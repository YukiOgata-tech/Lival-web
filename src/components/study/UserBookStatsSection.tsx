// src/components/study/UserBookStatsSection.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserBookStat } from '../../types/study';
import { getUserBookStats } from '../../lib/api/studyLogService';

interface UserBookStatsSectionProps {
  userId: string;
  className?: string;
}

export default function UserBookStatsSection({ userId, className = '' }: UserBookStatsSectionProps) {
  const [userBookStats, setUserBookStats] = useState<UserBookStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'usage' | 'time' | 'recent'>('usage');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) {
      fetchUserBookStats();
    }
  }, [userId]);

  const fetchUserBookStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getUserBookStats(userId);
      setUserBookStats(data);
    } catch (err) {
      console.error('個人書籍統計の取得に失敗しました:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours >= 1) {
      return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
    }
    return `${minutes}分`;
  };

  const formatLastUsed = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  const sortedStats = [...userBookStats].sort((a, b) => {
    switch (sortBy) {
      case 'usage':
        return b.used_times - a.used_times;
      case 'time':
        return b.total_minutes - a.total_minutes;
      case 'recent':
        return new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime();
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-gray-600">{error}</div>
          <button
            onClick={fetchUserBookStats}
            className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          📖 あなたの参考書統計 TOP5
        </h3>
        
        {/* ソート選択 */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'usage' | 'time' | 'recent')}
            className="text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="usage">使用回数順</option>
            <option value="time">学習時間順</option>
            <option value="recent">最近使用順</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-16 bg-gray-200 rounded mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {sortedStats.slice(0, 5).map((stat, index) => (
            <div key={stat.book.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              {/* 書籍カバー */}
              <div className="w-10 h-12 sm:w-12 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center mr-3 flex-shrink-0">
                {stat.book.cover_image_url && !failedImages.has(stat.book.id) ? (
                  <Image
                    src={stat.book.cover_image_url}
                    alt={stat.book.title}
                    width={48}
                    height={64}
                    className="w-full h-full object-cover rounded"
                    onError={() => {
                      console.log('Image load failed:', stat.book.cover_image_url);
                      setFailedImages(prev => new Set(prev).add(stat.book.id));
                    }}
                    unoptimized={stat.book.cover_image_url.includes('books.google.com')}
                  />
                ) : (
                  <div className="text-blue-600 text-lg sm:text-xl">📚</div>
                )}
              </div>
              
              {/* 書籍情報 */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                  {stat.book.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 truncate mb-1">
                  {stat.book.author} | {stat.book.company}
                </div>
                <div className="text-xs text-gray-600">
                  最終学習: {formatLastUsed(stat.last_used_at)}
                </div>
              </div>
              
              {/* 統計情報 */}
              <div className="text-right ml-3">
                <div className="text-sm sm:text-base font-semibold text-gray-900">
                  {stat.used_times}回
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  {formatTime(stat.total_minutes)}
                </div>
                <div className="text-xs text-gray-500">
                  平均{stat.avg_minutes_per_session.toFixed(0)}分/回
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && userBookStats.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-sm text-gray-600 mb-2">
            まだ学習記録がありません
          </div>
          <div className="text-xs text-gray-500">
            参考書を使って学習を記録すると、統計が表示されます
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          📊 あなた専用の学習統計
        </div>
      </div>
    </div>
  );
}