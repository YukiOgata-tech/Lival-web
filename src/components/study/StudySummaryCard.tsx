// src/components/study/StudySummaryCard.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import Link from 'next/link';
import { StudyStats } from '../../types/study';
import { getStudyStats } from '../../lib/api/studyLogService';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StudySummaryCardProps {
  userId: string;
  isLinked?: boolean;
}

interface DayData {
  date: Date;
  dayName: string;
  minutes: number;
}

export default function StudySummaryCard({ userId, isLinked = false }: StudySummaryCardProps) {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weekData, setWeekData] = useState<DayData[]>([]);

  // Wrap loadStats in useCallback
  const loadStats = useCallback(async () => {
    try {
      const studyStats = await getStudyStats(userId);
      setStats(studyStats);

      // 過去7日間のデータを生成
      if (studyStats) {
        const days: DayData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          date.setHours(0, 0, 0, 0);

          // その日のログを集計
          const dayLogs = studyStats.recentStudyLogs.filter(log => {
            const logDate = new Date(log.studied_at);
            return logDate.getFullYear() === date.getFullYear() &&
                   logDate.getMonth() === date.getMonth() &&
                   logDate.getDate() === date.getDate();
          });

          const dayMinutes = dayLogs.reduce((sum, log) => sum + log.duration_minutes, 0);

          days.push({
            date,
            dayName: date.toLocaleDateString('ja-JP', { weekday: 'short' }),
            minutes: dayMinutes
          });
        }

        setWeekData(days);
      }
    } catch (error) {
      console.error('Error loading study stats:', error);
    }
    setIsLoading(false);
  }, [userId]);

  // Update useEffect dependency array
  useEffect(() => {
    loadStats();
  }, [loadStats]);

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
            </div>
            <div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">学習記録</h3>
        </div>
        {!isLinked && ( // Conditionally render "詳細を見る" link
          <Link
            href="/dashboard/study"
            className="text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-1 flex-shrink-0"
          >
            <span className="hidden sm:inline">詳細を見る</span>
            <span className="sm:hidden">詳細</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>

      {stats && stats.totalSessions > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {/* 週次グラフ - メイン */}
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-3 sm:p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-900">過去7日間</h4>
              </div>
              <div className="text-xs font-medium text-gray-600">
                合計 {formatTime(weekData.reduce((sum, day) => sum + day.minutes, 0))}
              </div>
            </div>

            {/* 曜日ラベル */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekData.map((day) => (
                <div key={day.date.toISOString()} className="text-center">
                  <div className="text-xs font-semibold text-gray-700">
                    {day.dayName}
                  </div>
                </div>
              ))}
            </div>

            {/* バーチャート */}
            <div className="grid grid-cols-7 gap-1 items-end" style={{ height: '100px' }}>
              {weekData.map((day, index) => {
                const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1);
                const heightPercent = (day.minutes / maxMinutes) * 100;
                const intensity = day.minutes / maxMinutes;
                const gradientClass = intensity > 0.7
                  ? 'from-green-400 via-green-500 to-green-600'
                  : intensity > 0.4
                    ? 'from-blue-400 via-blue-500 to-blue-600'
                    : 'from-blue-300 via-blue-400 to-blue-500';

                return (
                  <motion.div
                    key={day.date.toISOString()}
                    initial={{ height: 0 }}
                    animate={{ height: day.minutes > 0 ? `${heightPercent}%` : '4px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative bg-gradient-to-t ${day.minutes > 0 ? gradientClass : 'from-gray-200 to-gray-300'} rounded-t-lg group cursor-pointer hover:scale-110 transition-all shadow-sm`}
                  >
                    {day.minutes > 0 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-gray-900 text-white text-xs px-1.5 py-1 rounded whitespace-nowrap shadow-lg font-semibold">
                          {formatTime(day.minutes)}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* 日付ラベル */}
            <div className="grid grid-cols-7 gap-1 mt-2">
              {weekData.map((day) => (
                <div key={day.date.toISOString()} className="text-center">
                  <div className="text-xs text-gray-500">
                    {day.date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* サマリー統計 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="relative overflow-hidden text-center p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <div className="relative z-10">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 mx-auto mb-1" />
                <div className="text-sm sm:text-lg font-bold text-white">
                  {formatTime(stats.totalMinutes)}
                </div>
                <div className="text-xs text-white/90">総学習時間</div>
              </div>
            </div>
            <div className="relative overflow-hidden text-center p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <div className="relative z-10">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 mx-auto mb-1" />
                <div className="text-sm sm:text-lg font-bold text-white">
                  {stats.currentStreak}日
                </div>
                <div className="text-xs text-white/90">連続日数</div>
              </div>
            </div>
            <div className="relative overflow-hidden text-center p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
              <div className="relative z-10">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 mx-auto mb-1" />
                <div className="text-sm sm:text-lg font-bold text-white">
                  {formatTime(stats.averageMinutesPerDay)}
                </div>
                <div className="text-xs text-white/90">1日平均</div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="pt-2 sm:pt-3">
            {!isLinked && ( // Conditionally render "学習記録を見る" button
              <Link
                href="/dashboard/study"
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white py-2 sm:py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg text-center block text-sm sm:text-base"
              >
                学習記録を見る
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 sm:py-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-600 mb-3 sm:mb-4">まだ学習記録がありません</p>
          {!isLinked && ( // Conditionally render "記録を始める" button
            <Link
              href="/dashboard/study"
              className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base font-bold"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>記録を始める</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}