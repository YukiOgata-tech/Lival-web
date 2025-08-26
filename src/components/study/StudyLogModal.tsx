// src/components/study/StudyLogModal.tsx
'use client'

import { useState, useEffect } from 'react';
import { StudyLogInput, BookSearchResult } from '../../types/study';
import { searchBookByISBN, searchBookByTitle } from '../../lib/api/bookService';

interface StudyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudyLogInput) => void;
  initialData?: StudyLogInput;
  mode: 'create' | 'edit';
}

export default function StudyLogModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: StudyLogModalProps) {
  const [formData, setFormData] = useState<StudyLogInput>({
    book_isbn: '',
    manual_book_title: '',
    duration_minutes: 30,
    memo: '',
    studied_at: new Date().toISOString().slice(0, 16)
  });

  const [bookSearchType, setBookSearchType] = useState<'isbn' | 'title' | 'manual' | 'none'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // モーダルが開かれた時の初期化
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        if (initialData.book_isbn) {
          setBookSearchType('isbn');
        } else if (initialData.manual_book_title) {
          setBookSearchType('manual');
        } else {
          setBookSearchType('none');
        }
      } else {
        // 新規作成時は現在時刻に設定
        setFormData({
          book_isbn: '',
          manual_book_title: '',
          duration_minutes: 30,
          memo: '',
          studied_at: new Date().toISOString().slice(0, 16)
        });
        setBookSearchType('none');
      }
      setSearchQuery('');
      setSearchResults([]);
      setSelectedBook(null);
    }
  }, [isOpen, initialData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      if (bookSearchType === 'isbn') {
        const result = await searchBookByISBN(searchQuery);
        setSearchResults(result ? [result] : []);
      } else if (bookSearchType === 'title') {
        const results = await searchBookByTitle(searchQuery);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book);
    setFormData(prev => ({
      ...prev,
      book_isbn: book.isbn,
      manual_book_title: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let submitData: StudyLogInput;

      if (bookSearchType === 'isbn' || bookSearchType === 'title') {
        submitData = {
          book_isbn: formData.book_isbn || selectedBook?.isbn,
          manual_book_title: '',
          duration_minutes: formData.duration_minutes,
          memo: formData.memo,
          studied_at: formData.studied_at
        };
      } else if (bookSearchType === 'manual') {
        submitData = {
          book_isbn: '',
          manual_book_title: formData.manual_book_title,
          duration_minutes: formData.duration_minutes,
          memo: formData.memo,
          studied_at: formData.studied_at
        };
      } else {
        submitData = {
          book_isbn: '',
          manual_book_title: '',
          duration_minutes: formData.duration_minutes,
          memo: formData.memo,
          studied_at: formData.studied_at
        };
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

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
            {/* 書籍選択方法 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                書籍の記録方法
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBookSearchType('isbn')}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    bookSearchType === 'isbn'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ISBN検索
                </button>
                <button
                  type="button"
                  onClick={() => setBookSearchType('title')}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    bookSearchType === 'title'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  書籍名検索
                </button>
                <button
                  type="button"
                  onClick={() => setBookSearchType('manual')}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    bookSearchType === 'manual'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  手入力
                </button>
                <button
                  type="button"
                  onClick={() => setBookSearchType('none')}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    bookSearchType === 'none'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  書籍なし
                </button>
              </div>
            </div>

            {/* 書籍検索 */}
            {(bookSearchType === 'isbn' || bookSearchType === 'title') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bookSearchType === 'isbn' ? 'ISBN' : '書籍名'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={bookSearchType === 'isbn' ? 'ISBNを入力' : '書籍名を入力'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* 検索結果 */}
                {searchResults.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto border rounded-md">
                    {searchResults.map((book, index) => (
                      <div
                        key={index}
                        onClick={() => handleBookSelect(book)}
                        className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                          selectedBook?.isbn === book.isbn ? 'bg-blue-50 border-blue-200' : ''
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

            {/* 手入力書籍名 */}
            {bookSearchType === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  書籍名
                </label>
                <input
                  type="text"
                  value={formData.manual_book_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, manual_book_title: e.target.value }))}
                  placeholder="書籍名を入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={bookSearchType === 'manual'}
                />
              </div>
            )}

            {/* 学習時間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学習時間（分）
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                min="1"
                max="1440"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 学習日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学習日時
              </label>
              <input
                type="datetime-local"
                value={formData.studied_at}
                onChange={(e) => setFormData(prev => ({ ...prev, studied_at: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メモ（任意）
              </label>
              <textarea
                value={formData.memo}
                onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                placeholder="学習内容や感想を記録してください"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* フォームアクション */}
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
    </div>
  );
}