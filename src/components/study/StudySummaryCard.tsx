// src/components/study/StudySummaryCard.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyStats } from '../../types/study';
import { getStudyStats } from '../../lib/api/studyLogService';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight } from 'lucide-react';

interface StudySummaryCardProps {
  userId: string;
}

export default function StudySummaryCard({ userId }: StudySummaryCardProps) {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const studyStats = await getStudyStats(userId);
      setStats(studyStats);
    } catch (error) {
      console.error('Error loading study stats:', error);
    }
    setIsLoading(false);
  };

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div>
              <div className="h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">学習記録</h3>
        </div>
        <Link
          href="/dashboard/study"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>詳細を見る</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {stats && stats.totalSessions > 0 ? (
        <div className="space-y-4">
          {/* メイン統計 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatTime(stats.totalMinutes)}
              </div>
              <div className="text-sm text-gray-600">総学習時間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-600">連続日数</div>
            </div>
          </div>

          {/* 詳細統計 */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">今月の学習回数</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalSessions}回
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">1日平均</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(stats.averageMinutesPerDay)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">最長連続</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.longestStreak}日
                </span>
              </div>
            </div>
          </div>

          {/* 最近の学習記録 */}
          {stats.recentStudyLogs.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">最近の学習</h4>
              <div className="space-y-2">
                {stats.recentStudyLogs.slice(0, 3).map((log) => {
                  const bookTitle = log.book?.title || log.manual_book_title || '書籍なし';
                  const studiedDate = new Date(log.studied_at);
                  
                  return (
                    <div key={log.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{bookTitle}</p>
                        <p className="text-xs text-gray-500">
                          {studiedDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          ・{formatTime(log.duration_minutes)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/study"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
            >
              学習記録を見る
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">まだ学習記録がありません</p>
          <Link
            href="/dashboard/study"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>記録を始める</span>
          </Link>
        </div>
      )}
    </div>
  );
}