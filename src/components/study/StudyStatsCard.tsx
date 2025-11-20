// src/components/study/StudyStatsCard.tsx
'use client'

import { StudyStats } from '../../types/study';
import { Clock, Target, Flame, Trophy, TrendingUp, BarChart3 } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl border border-blue-100 p-6 shadow-sm">
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">学習統計</h3>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          概要
        </div>
      </div>

      {/* メイン統計 - グラデーションカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 総学習時間 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <Clock className="w-6 h-6 text-white/80 mb-2" />
            <div className="text-3xl font-bold text-white mb-1">
              {formatHours(stats.totalMinutes)}
            </div>
            <div className="text-xs text-white/90 font-medium">総学習時間</div>
            <div className="text-xs text-white/70">時間</div>
          </div>
        </div>

        {/* 学習回数 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <Target className="w-6 h-6 text-white/80 mb-2" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalSessions}
            </div>
            <div className="text-xs text-white/90 font-medium">学習回数</div>
            <div className="text-xs text-white/70">回</div>
          </div>
        </div>

        {/* 現在の連続 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <Flame className="w-6 h-6 text-white/80 mb-2" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-white/90 font-medium">現在の連続</div>
            <div className="text-xs text-white/70">日</div>
          </div>
        </div>

        {/* 最長連続 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <Trophy className="w-6 h-6 text-white/80 mb-2" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.longestStreak}
            </div>
            <div className="text-xs text-white/90 font-medium">最長連続</div>
            <div className="text-xs text-white/70">日</div>
          </div>
        </div>
      </div>

      {/* 詳細統計 - より鮮やかに */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">1日平均</div>
              <div className="text-xs text-gray-600">過去30日</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              {formatTime(stats.averageMinutesPerDay)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">平均時間/回</div>
              <div className="text-xs text-gray-600">1回あたり</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">
              {stats.totalSessions > 0
                ? formatTime(Math.round(stats.totalMinutes / stats.totalSessions))
                : '0分'
              }
            </div>
          </div>
        </div>
      </div>

      {/* 連続学習プログレスバー */}
      {stats.currentStreak > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900">連続学習チャレンジ</span>
            </div>
            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
              {stats.currentStreak}日継続中 🔥
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full transition-all duration-500 shadow-md"
              style={{
                width: `${Math.min((stats.currentStreak / Math.max(stats.longestStreak, 7)) * 100, 100)}%`
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>継続中</span>
            <span>最長記録: {stats.longestStreak}日</span>
          </div>
        </div>
      )}
    </div>
  );
}
