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
        return { icon: '🔥', text: '平均以上', color: 'text-green-600 bg-green-50' };
      case 'average':
        return { icon: '📊', text: '平均的', color: 'text-blue-600 bg-blue-50' };
      case 'below_average':
        return { icon: '💪', text: 'がんばろう', color: 'text-orange-600 bg-orange-50' };
      default:
        return { icon: '📚', text: '-', color: 'text-gray-600 bg-gray-50' };
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
    <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          📈 みんなとの比較
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${rankInfo.color}`}>
          {rankInfo.icon} {rankInfo.text}
        </div>
      </div>

      {/* 対象書籍 */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-900 text-center">
          📚 {comparison.bookTitle}
        </div>
      </div>

      {/* 使用回数比較 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">使用回数</span>
          <span className={`text-xs font-medium ${usageDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {usageDiff >= 0 ? '+' : ''}{usageDiff}%
          </span>
        </div>
        
        <div className="space-y-2">
          {/* ユーザー */}
          <div className="flex items-center">
            <div className="w-12 text-xs text-gray-600 mr-2">あなた</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${usageProgress.user}%` }}
              >
                <span className="text-xs text-white font-medium">{comparison.userUsage}</span>
              </div>
            </div>
          </div>
          
          {/* 全体平均 */}
          <div className="flex items-center">
            <div className="w-12 text-xs text-gray-600 mr-2">平均</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-gray-400 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${usageProgress.global}%` }}
              >
                <span className="text-xs text-white font-medium">{comparison.globalUsage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学習時間比較 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">総学習時間</span>
          <span className={`text-xs font-medium ${timeDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {timeDiff >= 0 ? '+' : ''}{timeDiff}%
          </span>
        </div>
        
        <div className="space-y-2">
          {/* ユーザー */}
          <div className="flex items-center">
            <div className="w-12 text-xs text-gray-600 mr-2">あなた</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${timeProgress.user}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {formatTime(comparison.userTime)}
                </span>
              </div>
            </div>
          </div>
          
          {/* 全体平均 */}
          <div className="flex items-center">
            <div className="w-12 text-xs text-gray-600 mr-2">平均</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-gray-400 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${timeProgress.global}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {formatTime(comparison.globalTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分析コメント */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
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