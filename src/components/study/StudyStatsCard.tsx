// src/components/study/StudyStatsCard.tsx
'use client'

import { StudyStats } from '../../types/study';

interface StudyStatsCardProps {
  stats: StudyStats;
  isLoading?: boolean;
}

export default function StudyStatsCard({ stats, isLoading }: StudyStatsCardProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}時間`;
    }
    return `${hours}時間${remainingMinutes}分`;
  };

  const formatHours = (minutes: number) => {
    return (minutes / 60).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">学習統計</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          統計情報
        </div>
      </div>

      {/* メイン統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
            {formatHours(stats.totalMinutes)}
          </div>
          <div className="text-sm text-gray-600">総学習時間</div>
          <div className="text-xs text-gray-500">時間</div>
        </div>

        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
            {stats.totalSessions}
          </div>
          <div className="text-sm text-gray-600">学習回数</div>
          <div className="text-xs text-gray-500">回</div>
        </div>

        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-600">現在の連続</div>
          <div className="text-xs text-gray-500">日</div>
        </div>

        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
            {stats.longestStreak}
          </div>
          <div className="text-sm text-gray-600">最長連続</div>
          <div className="text-xs text-gray-500">日</div>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">1日平均</div>
              <div className="text-xs text-gray-500">過去30日</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(stats.averageMinutesPerDay)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">平均時間/回</div>
              <div className="text-xs text-gray-500">1回あたり</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {stats.totalSessions > 0 
                ? formatTime(Math.round(stats.totalMinutes / stats.totalSessions))
                : '0分'
              }
            </div>
          </div>
        </div>
      </div>

      {/* 進捗バー（現在の連続日数） */}
      {stats.currentStreak > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">連続学習</span>
            <span className="text-sm text-gray-500">{stats.currentStreak}日継続中</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((stats.currentStreak / Math.max(stats.longestStreak, 7)) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}