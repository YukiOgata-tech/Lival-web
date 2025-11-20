// src/components/study/PopularBooksSection.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PopularBook } from '../../types/study';
import { getPopularBooks } from '../../lib/api/studyLogService';

interface PopularBooksSectionProps {
  className?: string;
}

export default function PopularBooksSection({ className = '' }: PopularBooksSectionProps) {
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPopularBooks(5); // トップ5を取得
      setPopularBooks(data);
    } catch (err) {
      console.error('人気書籍データの取得に失敗しました:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours >= 1) {
      return `${hours.toLocaleString()}時間`;
    }
    return `${minutes}分`;
  };

  const formatUsageCount = (count: number) => {
    return count.toLocaleString();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg';
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg';
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg';
      default: return 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md';
    }
  };

  const getCardGradient = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-50 via-white to-amber-50 border-yellow-200';
      case 2: return 'from-gray-50 via-white to-slate-50 border-gray-200';
      case 3: return 'from-orange-50 via-white to-red-50 border-orange-200';
      default: return 'from-blue-50 via-white to-cyan-50 border-blue-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '📚';
    }
  };

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-gray-600">{error}</div>
          <button
            onClick={fetchPopularBooks}
            className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl border border-blue-100 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-base sm:text-xl">🔥</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            人気参考書ランキング
          </h3>
        </div>
        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold shadow-md">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="hidden sm:inline">全体統計</span>
          <span className="sm:hidden">TOP5</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="text-right">
                  <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {popularBooks.map((book) => (
            <div
              key={book.id}
              className={`flex items-center p-3 sm:p-4 bg-gradient-to-r ${getCardGradient(book.rank)} border rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 text-base sm:text-xl font-bold ${getRankColor(book.rank)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <span className="hidden sm:inline relative z-10">{getRankIcon(book.rank)}</span>
                <span className="sm:hidden relative z-10 text-sm">{book.rank}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  {book.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                  {book.author} | {book.company}
                </div>
              </div>

              <div className="text-right ml-3">
                <div className="text-xs sm:text-sm font-bold text-blue-600">
                  {formatUsageCount(book.usage_count_global)}回
                </div>
                <div className="text-xs text-gray-600">
                  総{formatTime(book.total_minutes_global)}
                </div>
                <div className="text-xs font-semibold text-green-600">
                  平均{book.avg_minutes_per_session.toFixed(0)}分
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && popularBooks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-sm text-gray-600">
            まだデータがありません
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-blue-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
          <span className="text-sm">⚡</span>
          <span>全ユーザーの学習データから算出</span>
        </div>
      </div>
    </div>
  );
}