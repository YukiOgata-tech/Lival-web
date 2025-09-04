// src/lib/api/bookService.ts
import { supabase } from '../supabase/supabaseClient'
import { BookSearchResult, GoogleBooksItem } from '../../types/study'
import { normalizeIsbn } from '@/lib/utils/isbn'

/**
 * ISBNで検索 → Supabase / openBD / Google の順でフォールバック。
 * 見つかった本は Supabase に保存し、保存後（id 付き）のレコード情報を返す。
 */
export async function searchBookByISBN(isbn: string): Promise<BookSearchResult | null> {
  try {
    const norm = normalizeIsbn(isbn) || isbn

    // 1) Supabase
    const sb = await searchBookFromSupabaseByIsbn(norm)
    if (sb) return sb

    // 2) openBD
    const ob = await searchBookFromOpenBD(norm)
    if (ob) return await saveBookToSupabase(ob)

    // 3) Google
    const gg = await searchBookFromGoogleBooksByIsbn(norm)
    if (gg) return await saveBookToSupabase(gg)

    return null
  } catch (error) {
    console.error('Book search error:', error)
    return null
  }
}

/**
 * タイトルで検索。
 * - まず Supabase を検索
 * - Google で補完（重複排除）
 * - 新規は Supabase に保存し、保存後（id 付き）で返す
 */
export async function searchBookByTitle(title: string): Promise<BookSearchResult[]> {
  try {
    const results: BookSearchResult[] = []

    // 1) Supabase
    const sbList = await searchBooksByTitleFromSupabase(title)
    results.push(...sbList)

    // 2) Google
    const ggList = await searchBooksByTitleFromGoogleBooks(title)

    // 既存重複チェック（ISBN or volumeId を優先キーに）
    const seen = new Set<string>()
    for (const r of results) {
      if (r.isbn) seen.add(`isbn:${r.isbn}`)
      else if (r.googleVolumeId) seen.add(`vid:${r.googleVolumeId}`)
      else seen.add(`t:${r.title}:${r.author}`)
    }

    const toSave = ggList.filter(g => {
      const key = g.isbn ? `isbn:${g.isbn}` : g.googleVolumeId ? `vid:${g.googleVolumeId}` : `t:${g.title}:${g.author}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Googleの新規を保存（idを付与）
    for (const g of toSave) {
      const saved = await saveBookToSupabase(g)
      results.push(saved)
    }

    return results.slice(0, 10)
  } catch (error) {
    console.error('Book title search error:', error)
    return []
  }
}

/* =========================
 * Supabase 検索
 * ========================= */

async function searchBookFromSupabaseByIsbn(isbn: string): Promise<BookSearchResult | null> {
  const { data, error } = await supabase
    .from('books')
    .select('id, isbn, title, author, company, cover_image_url')
    .eq('isbn', isbn)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    isbn: data.isbn || undefined,
    title: data.title,
    author: data.author,
    publisher: data.company,
    coverImageUrl: data.cover_image_url || undefined,
    source: 'supabase',
  }
}

async function searchBooksByTitleFromSupabase(title: string): Promise<BookSearchResult[]> {
  const { data, error } = await supabase
    .from('books')
    .select('id, isbn, title, author, company, cover_image_url')
    .ilike('title', `%${title}%`)
    .limit(5)

  if (error || !data) return []

  return data.map(b => ({
    id: b.id,
    isbn: b.isbn || undefined,
    title: b.title,
    author: b.author,
    publisher: b.company,
    coverImageUrl: b.cover_image_url || undefined,
    source: 'supabase' as const,
  }))
}

/* =========================
 * 外部API（openBD / Google）
 * ========================= */

async function searchBookFromOpenBD(isbn: string): Promise<BookSearchResult | null> {
  try {
    const norm = normalizeIsbn(isbn) || isbn
    const res = await fetch(`https://api.openbd.jp/v1/get?isbn=${norm}`)
    if (!res.ok) return null
    const json = await res.json()
    const sum = json?.[0]?.summary
    if (!sum) return null

    return {
      isbn: normalizeIsbn(norm) || norm,
      title: sum.title || '',
      author: sum.author || '',
      publisher: sum.publisher || '',
      coverImageUrl: sum.cover || undefined,
      source: 'openbd',
    }
  } catch (error) {
    console.error('OpenBD API error:', error)
    return null
  }
}

async function fetchGoogleVolumes(q: string): Promise<GoogleBooksItem[] | null> {
  try {
    const res = await fetch(`/api/books/google?q=${encodeURIComponent(q)}&maxResults=5`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.items || null
  } catch (error) {
    console.error('Google Books client error:', error)
    return null
  }
}

function mapGoogleItemToResult(item: GoogleBooksItem): BookSearchResult {
  const v = item.volumeInfo
  const isbn13 = v.industryIdentifiers?.find(x => x.type === 'ISBN_13')?.identifier
  const isbn10 = v.industryIdentifiers?.find(x => x.type === 'ISBN_10')?.identifier
  const normalized = normalizeIsbn(isbn13 || isbn10 || '')

  return {
    // ISBNが取れない場合は undefined のまま（DB側では google_volume_id で一意化）
    isbn: normalized || undefined,
    title: v.title || '',
    author: v.authors?.join(', ') || '',
    publisher: v.publisher || '',
    coverImageUrl: v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || undefined,
    googleVolumeId: item.id,  // 型に追加して使う
    source: 'google',
  }
}

async function searchBookFromGoogleBooksByIsbn(isbn: string): Promise<BookSearchResult | null> {
  try {
    const items = await fetchGoogleVolumes(`isbn:${isbn}`)
    if (!items || items.length === 0) return null
    return mapGoogleItemToResult(items[0])
  } catch (error) {
    console.error('Google Books (ISBN) error:', error)
    return null
  }
}

async function searchBooksByTitleFromGoogleBooks(title: string): Promise<BookSearchResult[]> {
  try {
    const items = await fetchGoogleVolumes(title)
    if (!items) return []
    return items.map(mapGoogleItemToResult)
  } catch (error) {
    console.error('Google Books (title) error:', error)
    return []
  }
}

/*  保存（id 返す）*/

/**
 * Supabase に upsert して保存後の行を返す（id 付き）。
 * - ISBN があれば onConflict = 'isbn'
 * - ISBN がなければ onConflict = 'google_volume_id'
 *   （DB 側にそれぞれ UNIQUE 制約がある前提）
 */
async function saveBookToSupabase(book: BookSearchResult): Promise<BookSearchResult> {
  const payload = {
    isbn: book.isbn ?? null,
    google_volume_id: book.googleVolumeId ?? null,
    title: book.title,
    author: book.author,
    company: book.publisher,
    cover_image_url: book.coverImageUrl ?? null,
    created_at: new Date().toISOString(),
  }

  const conflictTarget = book.isbn ? 'isbn' : 'google_volume_id'

  const { data, error } = await supabase
    .from('books')
    .upsert(payload, { onConflict: conflictTarget })
    .select('id, isbn, title, author, company, cover_image_url')
    .single()

  if (error || !data) {
    console.error('Error saving book to Supabase:', error)
    throw error || new Error('saveBookToSupabase failed')
  }

  return {
    id: data.id,
    isbn: data.isbn || undefined,
    title: data.title,
    author: data.author,
    publisher: data.company,
    coverImageUrl: data.cover_image_url || undefined,
    source: book.source,
  }
}
