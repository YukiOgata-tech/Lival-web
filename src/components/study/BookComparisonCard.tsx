// src/components/study/BookComparisonCard.tsx
'use client'

import { useState, useEffect } from 'react';
import { getBookComparisonData } from '../../lib/api/studyLogService';

interface BookComparisonCardProps {
  userId?: string;
  className?: string;
}

interface BookComparison {
  bookTitle: string;
  userUsage: number;
  userTime: number;
  globalUsage: number;
  globalTime: number;
  userRank: 'above_average' | 'average' | 'below_average';
}

export default function BookComparisonCard({ userId, className = '' }: BookComparisonCardProps) {
  const [comparison, setComparison] = useState<BookComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchComparisonData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchComparisonData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 最初に使用頻度の高い書籍を取得してその中から比較対象を選ぶ
      const { getUserBookStats } = await import('../../lib/api/studyLogService');
      const userStats = await getUserBookStats(userId);
      
      if (userStats.length === 0) {
        setComparison(null);
        setIsLoading(false);
        return;
      }

      // 最も使用回数の多い書籍を比較対象とする
      const mostUsedBook = userStats[0];
      const comparisonData = await getBookComparisonData(userId, mostUsedBook.book.id);
      
      if (comparisonData) {
        const formattedComparison: BookComparison = {
          bookTitle: comparisonData.bookTitle,
          userUsage: comparisonData.userUsage,
          userTime: comparisonData.userTime,
          globalUsage: comparisonData.globalAvgUsage,
          globalTime: comparisonData.globalAvgTime,
          userRank: comparisonData.userRank
        };
        setComparison(formattedComparison);
      } else {
        setComparison(null);
      }
    } catch (err) {
      console.error('比較データの取得に失敗しました:', err);
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

  const getPercentageDifference = (userValue: number, globalValue: number) => {
    const diff = ((userValue - globalValue) / globalValue) * 100;
    return Math.round(diff);
  };

  const getProgressPercentage = (userValue: number, globalValue: number) => {
    const maxValue = Math.max(userValue, globalValue) * 1.2; // 20%余裕を持たせる
    return {
      user: (userValue / maxValue) * 100,
      global: (globalValue / maxValue) * 100
    };
  };

  const getRankDisplay = (rank: string) => {
    switch (rank) {
      case 'above_average':
        return { icon: '🔥', text: '平均以上', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' };
      case 'average':
        return { icon: '📊', text: '平均的', color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' };
      case 'below_average':
        return { icon: '💪', text: 'がんばろう', color: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' };
      default:
        return { icon: '📚', text: '-', color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md' };
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-gray-600 mb-3">{error}</div>
          <button
            onClick={fetchComparisonData}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-sm text-gray-600 mb-2">
            比較データがありません
          </div>
          <div className="text-xs text-gray-500">
            参考書を使って学習を記録すると、比較が表示されます
          </div>
        </div>
      </div>
    );
  }

  const usageDiff = getPercentageDifference(comparison.userUsage, comparison.globalUsage);
  const timeDiff = getPercentageDifference(comparison.userTime, comparison.globalTime);
  const usageProgress = getProgressPercentage(comparison.userUsage, comparison.globalUsage);
  const timeProgress = getProgressPercentage(comparison.userTime, comparison.globalTime);
  const rankInfo = getRankDisplay(comparison.userRank);

  return (
    <div className={`bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl border border-purple-100 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-base sm:text-xl">📈</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            みんなとの比較
          </h3>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${rankInfo.color}`}>
          {rankInfo.icon} {rankInfo.text}
        </div>
      </div>

      {/* 対象書籍 */}
      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200 rounded-xl shadow-sm">
        <div className="text-sm font-semibold text-gray-900 text-center">
          📚 {comparison.bookTitle}
        </div>
      </div>

      {/* 使用回数比較 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">使用回数</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${usageDiff >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {usageDiff >= 0 ? '+' : ''}{usageDiff}%
          </span>
        </div>

        <div className="space-y-3">
          {/* ユーザー */}
          <div className="flex items-center">
            <div className="w-12 text-xs font-semibold text-blue-600 mr-2">あなた</div>
            <div className="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden shadow-sm">
              <div
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${usageProgress.user}%` }}
              >
                <span className="text-xs text-white font-bold drop-shadow">{comparison.userUsage}回</span>
              </div>
            </div>
          </div>

          {/* 全体平均 */}
          <div className="flex items-center">
            <div className="w-12 text-xs font-semibold text-gray-600 mr-2">平均</div>
            <div className="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden shadow-sm">
              <div
                className="bg-gradient-to-r from-gray-400 to-gray-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${usageProgress.global}%` }}
              >
                <span className="text-xs text-white font-bold drop-shadow">{comparison.globalUsage}回</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学習時間比較 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">総学習時間</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${timeDiff >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {timeDiff >= 0 ? '+' : ''}{timeDiff}%
          </span>
        </div>

        <div className="space-y-3">
          {/* ユーザー */}
          <div className="flex items-center">
            <div className="w-12 text-xs font-semibold text-purple-600 mr-2">あなた</div>
            <div className="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden shadow-sm">
              <div
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${timeProgress.user}%` }}
              >
                <span className="text-xs text-white font-bold drop-shadow">
                  {formatTime(comparison.userTime)}
                </span>
              </div>
            </div>
          </div>

          {/* 全体平均 */}
          <div className="flex items-center">
            <div className="w-12 text-xs font-semibold text-gray-600 mr-2">平均</div>
            <div className="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden shadow-sm">
              <div
                className="bg-gradient-to-r from-gray-400 to-gray-500 h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${timeProgress.global}%` }}
              >
                <span className="text-xs text-white font-bold drop-shadow">
                  {formatTime(comparison.globalTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分析コメント */}
      <div className="mt-6 pt-4 border-t border-purple-100">
        <div className="text-xs font-medium text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 sm:p-4 rounded-xl shadow-md">
          {usageDiff >= 20 && timeDiff >= 20 ? (
            <span>🎉 素晴らしい！平均をかなり上回る学習量です。この調子で継続しましょう！</span>
          ) : usageDiff >= 0 && timeDiff >= 0 ? (
            <span>👏 良いペースです！平均を上回る学習ができています。</span>
          ) : (
            <span>💪 まだまだ伸びしろがあります。少しずつ学習量を増やしていきましょう。</span>
          )}
        </div>
      </div>
    </div>
  );
}