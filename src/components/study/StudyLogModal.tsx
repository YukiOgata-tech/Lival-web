// src/components/study/StudyLogModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { StudyLogInput, BookSearchResult, VideoSearchResult } from '../../types/study'
import { searchBookByISBN, searchBookByTitle } from '../../lib/api/bookService'
import { searchVideoByUrl, searchVideos } from '../../lib/api/youtubeService'
import { BookSearchLoading } from '../ui/LoadingAnimation'
import BarcodeScanner from './BarcodeScanner'
import { Youtube, BookOpen, X } from 'lucide-react'

interface StudyLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: StudyLogInput) => void
  initialData?: StudyLogInput
  mode: 'create' | 'edit'
}

type ContentType = 'book' | 'video' | 'none'
type BookSearchMode = 'isbn' | 'title' | 'manual'
type VideoSearchMode = 'url' | 'search' | 'manual'

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
    video_id: null,
    manual_video_title: '',
    duration_minutes: 30,
    memo: '',
    studied_at: new Date().toISOString().slice(0, 16),
    free_mode: false,
  })

  const [contentType, setContentType] = useState<ContentType>('none')
  const [bookSearchMode, setBookSearchMode] = useState<BookSearchMode>('isbn')
  const [videoSearchMode, setVideoSearchMode] = useState<VideoSearchMode>('url')

  const [searchQuery, setSearchQuery] = useState('')
  const [bookSearchResults, setBookSearchResults] = useState<BookSearchResult[]>([])
  const [videoSearchResults, setVideoSearchResults] = useState<VideoSearchResult[]>([])
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoSearchResult | null>(null)

  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false)

  const sanitizeNullable = (s?: string | null) => {
    const t = (s ?? '').trim()
    return t.length ? t : null
  }

  // モーダル初期化
  useEffect(() => {
    if (!isOpen) return

    if (initialData) {
      const hasBook = Boolean(initialData.book_id)
      const hasManualBook = Boolean(sanitizeNullable(initialData.manual_book_title))
      const hasVideo = Boolean(initialData.video_id)
      const hasManualVideo = Boolean(sanitizeNullable(initialData.manual_video_title))
      const isFree = Boolean(initialData.free_mode)

      setFormData({
        book_id: hasBook ? initialData.book_id! : null,
        manual_book_title: hasManualBook ? initialData.manual_book_title! : '',
        video_id: hasVideo ? initialData.video_id! : null,
        manual_video_title: hasManualVideo ? initialData.manual_video_title! : '',
        duration_minutes: initialData.duration_minutes,
        memo: initialData.memo ?? '',
        studied_at: initialData.studied_at,
        free_mode: isFree,
      })

      // 既存データからコンテンツタイプとモードを推定
      if (hasBook || hasManualBook) {
        setContentType('book')
        if (hasBook) setBookSearchMode('isbn')
        else if (hasManualBook) setBookSearchMode('manual')
      } else if (hasVideo || hasManualVideo) {
        setContentType('video')
        if (hasVideo) setVideoSearchMode('url')
        else if (hasManualVideo) setVideoSearchMode('manual')
      } else if (isFree) {
        setContentType('none')
      }
    } else {
      setFormData({
        book_id: null,
        manual_book_title: '',
        video_id: null,
        manual_video_title: '',
        duration_minutes: 30,
        memo: '',
        studied_at: new Date().toISOString().slice(0, 16),
        free_mode: false,
      })
      setContentType('none')
    }

    setSearchQuery('')
    setBookSearchResults([])
    setVideoSearchResults([])
    setSelectedBook(null)
    setSelectedVideo(null)
  }, [isOpen, initialData])

  // コンテンツタイプ切替時のクリーンアップ
  useEffect(() => {
    if (!isOpen) return

    if (contentType === 'book') {
      setFormData(prev => ({
        ...prev,
        video_id: null,
        manual_video_title: '',
        free_mode: false
      }))
      setSelectedVideo(null)
      setVideoSearchResults([])
    } else if (contentType === 'video') {
      setFormData(prev => ({
        ...prev,
        book_id: null,
        manual_book_title: '',
        free_mode: false
      }))
      setSelectedBook(null)
      setBookSearchResults([])
    } else if (contentType === 'none') {
      setFormData(prev => ({
        ...prev,
        book_id: null,
        manual_book_title: '',
        video_id: null,
        manual_video_title: '',
        free_mode: true
      }))
      setSelectedBook(null)
      setSelectedVideo(null)
      setBookSearchResults([])
      setVideoSearchResults([])
    }
    setSearchQuery('')
  }, [contentType, isOpen])

  // 書籍検索
  const handleBookSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      if (bookSearchMode === 'isbn') {
        const r = await searchBookByISBN(searchQuery.trim())
        setBookSearchResults(r ? [r] : [])
      } else if (bookSearchMode === 'title') {
        const rs = await searchBookByTitle(searchQuery.trim())
        setBookSearchResults(rs)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // 動画検索
  const handleVideoSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      if (videoSearchMode === 'url') {
        const r = await searchVideoByUrl(searchQuery.trim())
        setVideoSearchResults(r ? [r] : [])
        // URL検索で1件見つかった場合は自動選択
        if (r) handleVideoSelect(r)
      } else if (videoSearchMode === 'search') {
        const rs = await searchVideos(searchQuery.trim(), 10)
        setVideoSearchResults(rs)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // バーコード読み取り完了
  const handleBarcodeScanComplete = async (isbn: string) => {
    setIsBarcodeScannerOpen(false)
    setContentType('book')
    setBookSearchMode('isbn')
    setSearchQuery(isbn)

    setIsSearching(true)
    try {
      const result = await searchBookByISBN(isbn)
      setBookSearchResults(result ? [result] : [])
      if (result) handleBookSelect(result)
    } catch (error) {
      console.error('Barcode search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // 書籍選択
  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book)
    setFormData(prev => ({
      ...prev,
      book_id: book.id ?? null,
      manual_book_title: '',
      video_id: null,
      manual_video_title: '',
      free_mode: false,
    }))
  }

  // 動画選択
  const handleVideoSelect = (video: VideoSearchResult) => {
    setSelectedVideo(video)
    setFormData(prev => ({
      ...prev,
      video_id: video.id ?? null,
      manual_video_title: '',
      book_id: null,
      manual_book_title: '',
      free_mode: false,
    }))
  }

  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let payload: StudyLogInput

      if (contentType === 'book') {
        if (bookSearchMode === 'manual') {
          payload = {
            book_id: null,
            manual_book_title: sanitizeNullable(formData.manual_book_title) ?? '',
            video_id: null,
            manual_video_title: '',
            duration_minutes: formData.duration_minutes,
            memo: sanitizeNullable(formData.memo) ?? '',
            studied_at: formData.studied_at,
            free_mode: false,
          }
        } else {
          payload = {
            book_id: formData.book_id ?? selectedBook?.id ?? null,
            manual_book_title: '',
            video_id: null,
            manual_video_title: '',
            duration_minutes: formData.duration_minutes,
            memo: sanitizeNullable(formData.memo) ?? '',
            studied_at: formData.studied_at,
            free_mode: false,
          }
        }
      } else if (contentType === 'video') {
        if (videoSearchMode === 'manual') {
          payload = {
            book_id: null,
            manual_book_title: '',
            video_id: null,
            manual_video_title: sanitizeNullable(formData.manual_video_title) ?? '',
            duration_minutes: formData.duration_minutes,
            memo: sanitizeNullable(formData.memo) ?? '',
            studied_at: formData.studied_at,
            free_mode: false,
          }
        } else {
          payload = {
            book_id: null,
            manual_book_title: '',
            video_id: formData.video_id ?? selectedVideo?.id ?? null,
            manual_video_title: '',
            duration_minutes: formData.duration_minutes,
            memo: sanitizeNullable(formData.memo) ?? '',
            studied_at: formData.studied_at,
            free_mode: false,
          }
        }
      } else {
        // なし（フリーモード）
        payload = {
          book_id: null,
          manual_book_title: '',
          video_id: null,
          manual_video_title: '',
          duration_minutes: formData.duration_minutes,
          memo: sanitizeNullable(formData.memo) ?? '',
          studied_at: formData.studied_at,
          free_mode: true,
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
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* コンテンツタイプ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">学習内容</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setContentType('book')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    contentType === 'book'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`w-6 h-6 ${contentType === 'book' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${contentType === 'book' ? 'text-blue-700' : 'text-gray-700'}`}>
                    書籍
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('video')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    contentType === 'video'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Youtube className={`w-6 h-6 ${contentType === 'video' ? 'text-red-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${contentType === 'video' ? 'text-red-700' : 'text-gray-700'}`}>
                    動画
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentType('none')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    contentType === 'none'
                      ? 'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <X className={`w-6 h-6 ${contentType === 'none' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${contentType === 'none' ? 'text-gray-700' : 'text-gray-700'}`}>
                    なし
                  </span>
                </button>
              </div>
            </div>

            {/* 書籍検索UI */}
            {contentType === 'book' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">検索方法</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['isbn', 'title', 'manual'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setBookSearchMode(mode)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          bookSearchMode === mode
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {mode === 'isbn' ? 'ISBN' : mode === 'title' ? '書籍名' : '手入力'}
                      </button>
                    ))}
                  </div>
                </div>

                {(bookSearchMode === 'isbn' || bookSearchMode === 'title') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {bookSearchMode === 'isbn' ? 'ISBN' : '書籍名'}
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBookSearch())}
                          placeholder={bookSearchMode === 'isbn' ? 'ISBNを入力' : '書籍名を入力'}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={handleBookSearch}
                          disabled={isSearching || !searchQuery.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSearching ? '検索中...' : '検索'}
                        </button>
                      </div>

                      {bookSearchMode === 'isbn' && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-sm text-gray-500">または</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsBarcodeScannerOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
                          >
                            <span className="text-gray-700">バーコードをスキャン</span>
                          </button>
                        </>
                      )}
                    </div>

                    {isSearching && (
                      <div className="mt-4 py-8">
                        <BookSearchLoading message="書籍を検索しています..." size="md" />
                      </div>
                    )}

                    {!isSearching && bookSearchResults.length > 0 && (
                      <div className="mt-3 space-y-2 max-h-60 overflow-y-auto border rounded-md">
                        {bookSearchResults.map((book) => (
                          <div
                            key={book.id ?? book.isbn}
                            onClick={() => handleBookSelect(book)}
                            className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                              selectedBook?.id === book.id ? 'bg-blue-50 border-blue-200' : ''
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
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                                <p className="text-sm text-gray-600 truncate">{book.author}</p>
                                <p className="text-xs text-gray-500">{book.publisher}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {bookSearchMode === 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">書籍名</label>
                    <input
                      type="text"
                      value={formData.manual_book_title ?? ''}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, manual_book_title: e.target.value }))
                      }
                      placeholder="書籍名を入力してください"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* 動画検索UI */}
            {contentType === 'video' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">検索方法</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['url', 'search', 'manual'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setVideoSearchMode(mode)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          videoSearchMode === mode
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {mode === 'url' ? 'URL' : mode === 'search' ? 'キーワード' : '手入力'}
                      </button>
                    ))}
                  </div>
                </div>

                {(videoSearchMode === 'url' || videoSearchMode === 'search') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {videoSearchMode === 'url' ? 'YouTube URL' : 'キーワード'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleVideoSearch())}
                        placeholder={
                          videoSearchMode === 'url'
                            ? 'https://www.youtube.com/watch?v=...'
                            : '動画を検索'
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={handleVideoSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSearching ? '検索中...' : '検索'}
                      </button>
                    </div>

                    {isSearching && (
                      <div className="mt-4 py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        <p className="mt-2 text-sm text-gray-600">動画を検索しています...</p>
                      </div>
                    )}

                    {!isSearching && videoSearchResults.length > 0 && (
                      <div className="mt-3 space-y-2 max-h-80 overflow-y-auto border rounded-md">
                        {videoSearchResults.map((video) => (
                          <div
                            key={video.id ?? video.videoId}
                            onClick={() => handleVideoSelect(video)}
                            className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                              selectedVideo?.videoId === video.videoId ? 'bg-red-50 border-red-200' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {video.thumbnailUrl && (
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-32 h-18 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 line-clamp-2">{video.title}</h4>
                                <p className="text-sm text-gray-600">{video.channelTitle}</p>
                                {video.durationSeconds && (
                                  <p className="text-xs text-gray-500">
                                    {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, '0')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {videoSearchMode === 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">動画タイトル</label>
                    <input
                      type="text"
                      value={formData.manual_video_title ?? ''}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, manual_video_title: e.target.value }))
                      }
                      placeholder="動画タイトルを入力してください"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                      required
                    />
                  </div>
                )}
              </>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
