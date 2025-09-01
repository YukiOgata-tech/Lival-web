// src/app/dashboard/study/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from 'next/image';
import { auth } from '../../../lib/firebase';
import { StudyStats, StudyLog } from '../../../types/study';
import StudyLogList from '../../../components/study/StudyLogList';
import StudyStatsCard from '../../../components/study/StudyStatsCard';
import StudyTimeChart from '../../../components/study/StudyTimeChart';
import { getStudyStats, testSupabaseConnection, checkTableExists, getStudyLogs } from '../../../lib/api/studyLogService';
import { StudyLogLoading } from '../../../components/ui/LoadingAnimation';

export default function StudyPage() {
  const [user, loading, error] = useAuthState(auth);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadStudyStats = useCallback(async () => {
    if (!user) return;

    setIsLoadingStats(true);
    try {
      // デバッグ: Supabase接続テスト
      console.log('Testing Supabase connection...');
      const connectionTest = await testSupabaseConnection();
      console.log('Connection test result:', connectionTest);

      const tableCheck = await checkTableExists();
      console.log('Table exists check:', tableCheck);

      const studyStats = await getStudyStats(user.uid);
      setStats(studyStats);

      // ログデータも取得（チャート用）
      const studyLogs = await getStudyLogs(user.uid);
      setLogs(studyLogs);
    } catch (error) {
      console.error('Error loading study stats:', error);
    }
    setIsLoadingStats(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStudyStats();
    }
  }, [user, loadStudyStats]);

  // 認証チェック
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="text-red-600 mb-4 text-sm sm:text-base">認証エラーが発生しました</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            ログインが必要です
          </h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            学習記録を利用するにはログインしてください
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            ログイン
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">学習記録</h1>
                <p className="mt-1 text-gray-600 text-sm sm:text-base">
                  学習の記録と振り返りで継続的な成長を
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
                <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[140px] sm:max-w-none">
                  {user.displayName || user.email}
                </div>
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* 統計セクション */}
          {isLoadingStats ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              <StudyLogLoading 
                message="学習統計を読み込んでいます..." 
                size="lg"
              />
            </div>
          ) : stats && (
            <StudyStatsCard 
              stats={stats} 
              isLoading={isLoadingStats} 
            />
          )}

          {/* 学習時間チャート */}
          {!isLoadingStats && logs.length > 0 && (
            <StudyTimeChart 
              logs={logs}
              userId={user.uid}
            />
          )}

          {/* 学習記録リスト */}
          <StudyLogList userId={user.uid} />
        </div>
      </div>
    </div>
  );
}