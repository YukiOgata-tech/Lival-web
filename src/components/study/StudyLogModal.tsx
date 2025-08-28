// src/components/study/StudyLogModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { StudyLogInput, BookSearchResult } from '../../types/study'
import { searchBookByISBN, searchBookByTitle } from '../../lib/api/bookService'
import { BookSearchLoading } from '../ui/LoadingAnimation'
import BarcodeScanner from './BarcodeScanner'

interface StudyLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: StudyLogInput) => void
  initialData?: StudyLogInput
  mode: 'create' | 'edit'
}
/**
 * 4モード:
 * - 'isbn'   : ISBN検索 → 選択で book_id を確定
 * - 'title'  : 書籍名検索 → 選択で book_id を確定
 * - 'manual' : 手入力タイトルで登録（book_id は null）
 * - 'none'   : 書籍なし（free_mode = true、book_id も手入力タイトルも無しでOK）
 */
export default function StudyLogModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: StudyLogModalProps) {
  const [formData, setFormData] = useState<StudyLogInput>({
    book_id: null,
    manual_book_title: '',
    duration_minutes: 30,
    memo: '',
    studied_at: new Date().toISOString().slice(0, 16),
    free_mode: false,
  })

  const [bookSearchType, setBookSearchType] = useState<'isbn' | 'title' | 'manual' | 'none'>('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([])
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false)

  // 空文字/空白のみを null に変換（DB制約/RLSに優しい形へ）
  const sanitizeNullable = (s?: string | null) => {
    const t = (s ?? '').trim()
    return t.length ? t : null
  }

  // モーダル初期化
  useEffect(() => {
    if (!isOpen) return

    if (initialData) {
      const hasBook = Boolean(initialData.book_id)
      const hasManual = Boolean(sanitizeNullable(initialData.manual_book_title))
      const isFree = Boolean(initialData.free_mode)

      setFormData({
        book_id: hasBook ? initialData.book_id! : null,
        manual_book_title: hasManual ? initialData.manual_book_title! : '',
        duration_minutes: initialData.duration_minutes,
        memo: initialData.memo ?? '',
        studied_at: initialData.studied_at,
        free_mode: isFree,
      })

      // 既存データからモード推定
      if (hasBook) setBookSearchType('isbn')
      else if (hasManual) setBookSearchType('manual')
      else if (isFree) setBookSearchType('none')
      else setBookSearchType('none')
    } else {
      setFormData({
        book_id: null,
        manual_book_title: '',
        duration_minutes: 30,
        memo: '',
        studied_at: new Date().toISOString().slice(0, 16),
        free_mode: false,
      })
      setBookSearchType('none')
    }

    setSearchQuery('')
    setSearchResults([])
    setSelectedBook(null)
  }, [isOpen, initialData])

  // モード切替時の副作用：各モードに不要な値をクリア
  useEffect(() => {
    if (!isOpen) return
    if (bookSearchType === 'isbn' || bookSearchType === 'title') {
      setFormData(prev => ({ ...prev, free_mode: false, manual_book_title: '' }))
    } else if (bookSearchType === 'manual') {
      setFormData(prev => ({ ...prev, free_mode: false, book_id: null }))
      setSelectedBook(null)
    } else if (bookSearchType === 'none') {
      setFormData(prev => ({ ...prev, free_mode: true, book_id: null, manual_book_title: '' }))
      setSelectedBook(null)
      setSearchQuery('')
      setSearchResults([])
    }
  }, [bookSearchType, isOpen])

  // 検索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      if (bookSearchType === 'isbn') {
        const r = await searchBookByISBN(searchQuery.trim())
        setSearchResults(r ? [r] : [])
      } else if (bookSearchType === 'title') {
        const rs = await searchBookByTitle(searchQuery.trim())
        setSearchResults(rs)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // バーコード読み取り完了処理
  const handleBarcodeScanComplete = async (isbn: string) => {
    setIsBarcodeScannerOpen(false)
    setBookSearchType('isbn')
    setSearchQuery(isbn)
    
    // 自動的にISBN検索を実行
    setIsSearching(true)
    try {
      const result = await searchBookByISBN(isbn)
      setSearchResults(result ? [result] : [])
      
      // 結果が1つだけの場合は自動選択
      if (result) {
        handleBookSelect(result)
      }
    } catch (error) {
      console.error('Barcode search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // 書籍選択：book_id を確定、手入力/フリーモードは解除
  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book)
    setFormData(prev => ({
      ...prev,
      book_id: book.id ?? null, // ← books.id(UUID) を格納
      manual_book_title: '',
      free_mode: false,
    }))
  }

  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const resolvedBookId = formData.book_id ?? selectedBook?.id ?? null
      const resolvedManual = sanitizeNullable(formData.manual_book_title)
      const isFree = !!formData.free_mode || bookSearchType === 'none'

      // モード別の最小要件を満たす payload を組み立て
      let payload: StudyLogInput
      if (bookSearchType === 'isbn' || bookSearchType === 'title') {
        payload = {
          book_id: resolvedBookId,       // 選書時は book_id 必須
          manual_book_title: '',
          duration_minutes: formData.duration_minutes,
          memo: sanitizeNullable(formData.memo) ?? '',
          studied_at: formData.studied_at,
          free_mode: false,
        }
      } else if (bookSearchType === 'manual') {
        payload = {
          book_id: null,
          manual_book_title: resolvedManual ?? '', // 空白は直前でnull→''に戻す
          duration_minutes: formData.duration_minutes,
          memo: sanitizeNullable(formData.memo) ?? '',
          studied_at: formData.studied_at,
          free_mode: false,
        }
      } else {
        // 書籍なし（フリーモード）: book_id も manual_book_title も不要
        payload = {
          book_id: null,
          manual_book_title: '',
          duration_minutes: formData.duration_minutes,
          memo: sanitizeNullable(formData.memo) ?? '',
          studied_at: formData.studied_at,
          free_mode: true,
        }
      }

      // 事前ガード（UX向上）：none 以外で最低条件を満たさなければ警告
      if (!isFree) {
        const ok =
          (bookSearchType === 'isbn' || bookSearchType === 'title')
            ? !!payload.book_id
            : (bookSearchType === 'manual')
              ? !!sanitizeNullable(payload.manual_book_title)
              : true
        if (!ok) {
          console.warn('入力が不足しています。書籍を選ぶか、タイトルを入力してください。')
          return
        }
      }

      await onSubmit(payload)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? '学習記録を追加' : '学習記録を編集'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 記録モード選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">書籍の記録方法</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['isbn','title','manual','none'] as const).map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setBookSearchType(k)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      bookSearchType === k
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {k === 'isbn' ? 'ISBN検索'
                      : k === 'title' ? '書籍名検索'
                      : k === 'manual' ? '手入力'
                      : '書籍なし'}
                  </button>
                ))}
              </div>
            </div>

            {/* 検索UI（ISBN/タイトル） */}
            {(bookSearchType === 'isbn' || bookSearchType === 'title') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bookSearchType === 'isbn' ? 'ISBN' : '書籍名'}
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={bookSearchType === 'isbn' ? 'ISBNを入力' : '書籍名を入力'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? '検索中...' : '検索'}
                    </button>
                  </div>
                  
                  {bookSearchType === 'isbn' && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-sm text-gray-500">または</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                  )}
                  
                  {bookSearchType === 'isbn' && (
                    <button
                      type="button"
                      onClick={() => setIsBarcodeScannerOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">バーコードをスキャン</span>
                    </button>
                  )}
                </div>

                {/* 検索中のローディングアニメーション */}
                {isSearching && (
                  <div className="mt-4 py-8">
                    <BookSearchLoading 
                      message={
                        bookSearchType === 'isbn' 
                          ? 'ISBNから書籍を検索しています...'
                          : 'タイトルから書籍を検索しています...'
                      }
                      size="md"
                    />
                  </div>
                )}

                {/* 検索結果 */}
                {!isSearching && searchResults.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto border rounded-md">
                    {searchResults.map((book) => (
                      <div
                        key={book.id ?? book.isbn ?? `${book.title}-${book.author}`}
                        onClick={() => handleBookSelect(book)}
                        className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                          selectedBook?.id && book.id
                            ? selectedBook.id === book.id
                              ? 'bg-blue-50 border-blue-200'
                              : ''
                            : selectedBook?.isbn && book.isbn && selectedBook.isbn === book.isbn
                              ? 'bg-blue-50 border-blue-200'
                              : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {book.coverImageUrl && (
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{book.title}</h4>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <p className="text-xs text-gray-500">{book.publisher} • {book.source}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 手入力タイトル */}
            {bookSearchType === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">書籍名</label>
                <input
                  type="text"
                  value={formData.manual_book_title ?? ''}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, manual_book_title: e.target.value }))
                  }
                  placeholder="書籍名を入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  required={bookSearchType === 'manual'}
                />
              </div>
            )}

            {/* 学習時間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学習時間（分）</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    duration_minutes: Math.max(1, Math.min(1440, parseInt(e.target.value) || 0)),
                  }))
                }
                min={1}
                max={1440}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              />
            </div>

            {/* 学習日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学習日時</label>
              <input
                type="datetime-local"
                value={formData.studied_at}
                onChange={(e) => setFormData(prev => ({ ...prev, studied_at: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              />
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メモ（任意）</label>
              <textarea
                value={formData.memo ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                placeholder="学習内容や感想を記録してください"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* アクション */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '保存中...' : (mode === 'create' ? '記録する' : '更新する')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* バーコードスキャナー */}
      <BarcodeScanner
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onScanComplete={handleBarcodeScanComplete}
      />
    </div>
  )
}
