// src/lib/api/bookService.ts
import { createClient } from '../supabase/supabaseClient';
import { BookSearchResult, GoogleBooksItem } from '../../types/study';

const supabase = createClient();

/**
 * ISBNで書籍情報を検索
 * フォールバック戦略: Supabase → openBD → Google Books API
 */
export async function searchBookByISBN(isbn: string): Promise<BookSearchResult | null> {
  try {
    // 1. まずSupabaseから検索
    const supabaseResult = await searchBookFromSupabase(isbn);
    if (supabaseResult) {
      return supabaseResult;
    }

    // 2. openBD APIから検索
    const openBDResult = await searchBookFromOpenBD(isbn);
    if (openBDResult) {
      // Supabaseに保存
      await saveBookToSupabase(openBDResult);
      return openBDResult;
    }

    // 3. Google Books APIから検索
    const googleResult = await searchBookFromGoogleBooks(isbn);
    if (googleResult) {
      // Supabaseに保存
      await saveBookToSupabase(googleResult);
      return googleResult;
    }

    return null;
  } catch (error) {
    console.error('Book search error:', error);
    return null;
  }
}

/**
 * 書籍名で書籍情報を検索
 */
export async function searchBookByTitle(title: string): Promise<BookSearchResult[]> {
  try {
    const results: BookSearchResult[] = [];

    // Supabaseから検索
    const supabaseResults = await searchBooksByTitleFromSupabase(title);
    results.push(...supabaseResults);

    // Google Books APIから検索（タイトル検索の場合）
    const googleResults = await searchBooksByTitleFromGoogleBooks(title);
    
    // 重複を避けるためISBNでフィルタリング
    const existingIsbns = new Set(results.map(r => r.isbn));
    const newGoogleResults = googleResults.filter(r => !existingIsbns.has(r.isbn));
    
    results.push(...newGoogleResults);

    // 新しい結果をSupabaseに保存
    for (const book of newGoogleResults) {
      await saveBookToSupabase(book);
    }

    return results.slice(0, 10); // 最大10件まで
  } catch (error) {
    console.error('Book title search error:', error);
    return [];
  }
}

/**
 * Supabaseから書籍検索（ISBN）
 */
async function searchBookFromSupabase(isbn: string): Promise<BookSearchResult | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('isbn', isbn)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    isbn: data.isbn,
    title: data.title,
    author: data.author,
    publisher: data.company,
    coverImageUrl: data.cover_image_url || undefined,
    source: 'supabase'
  };
}

/**
 * Supabaseから書籍検索（タイトル）
 */
async function searchBooksByTitleFromSupabase(title: string): Promise<BookSearchResult[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .ilike('title', `%${title}%`)
    .limit(5);

  if (error || !data) {
    return [];
  }

  return data.map(book => ({
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.company,
    coverImageUrl: book.cover_image_url || undefined,
    source: 'supabase' as const
  }));
}

/**
 * openBD APIから書籍検索
 */
async function searchBookFromOpenBD(isbn: string): Promise<BookSearchResult | null> {
  try {
    const response = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data || !data[0] || !data[0].summary) {
      return null;
    }

    const bookData = data[0].summary;
    
    return {
      isbn: isbn,
      title: bookData.title || '',
      author: bookData.author || '',
      publisher: bookData.publisher || '',
      coverImageUrl: bookData.cover || undefined,
      source: 'openbd'
    };
  } catch (error) {
    console.error('OpenBD API error:', error);
    return null;
  }
}

/**
 * Google Books APIから書籍検索（ISBN）
 */
async function searchBookFromGoogleBooks(isbn: string): Promise<BookSearchResult | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      console.warn('Google Books API key not found');
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const book = data.items[0];
    const volumeInfo = book.volumeInfo;

    // ISBNを取得
    const isbnData = volumeInfo.industryIdentifiers?.find(
      (id: { type: string; identifier: string }) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
    );

    return {
      isbn: isbnData?.identifier || isbn,
      title: volumeInfo.title || '',
      author: volumeInfo.authors?.join(', ') || '',
      publisher: volumeInfo.publisher || '',
      coverImageUrl: volumeInfo.imageLinks?.thumbnail || undefined,
      source: 'google'
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    return null;
  }
}

/**
 * Google Books APIから書籍検索（タイトル）
 */
async function searchBooksByTitleFromGoogleBooks(title: string): Promise<BookSearchResult[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      console.warn('Google Books API key not found');
      return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=5&key=${apiKey}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    return data.items.map((book: GoogleBooksItem) => {
      const volumeInfo = book.volumeInfo;
      
      // ISBNを取得
      const isbnData = volumeInfo.industryIdentifiers?.find(
        (id: { type: string; identifier: string }) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
      );

      return {
        isbn: isbnData?.identifier || book.id,
        title: volumeInfo.title || '',
        author: volumeInfo.authors?.join(', ') || '',
        publisher: volumeInfo.publisher || '',
        coverImageUrl: volumeInfo.imageLinks?.thumbnail || undefined,
        source: 'google' as const
      };
    }).filter(book => book.isbn); // ISBNがあるもののみ
  } catch (error) {
    console.error('Google Books API title search error:', error);
    return [];
  }
}

/**
 * Supabaseに書籍データを保存
 */
async function saveBookToSupabase(book: BookSearchResult): Promise<void> {
  try {
    const { error } = await supabase
      .from('books')
      .upsert({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        company: book.publisher,
        cover_image_url: book.coverImageUrl || null,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving book to Supabase:', error);
    }
  } catch (error) {
    console.error('Error saving book to Supabase:', error);
  }
}