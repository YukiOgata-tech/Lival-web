// src/components/study/StudyLogList.tsx
'use client'

import { useState, useEffect } from 'react';
import { StudyLog, StudyLogInput } from '../../types/study';
import StudyLogCard from './StudyLogCard';
import StudyLogModal from './StudyLogModal';
import { createStudyLog, updateStudyLog, deleteStudyLog, getStudyLogs } from '../../lib/api/studyLogService';
import { StudyLogLoading } from '../ui/LoadingAnimation';

interface StudyLogListProps {
  userId: string;
  initialLogs?: StudyLog[];
  showAddButton?: boolean;
}

export default function StudyLogList({ 
  userId, 
  initialLogs = [], 
  showAddButton = true 
}: StudyLogListProps) {
  const [logs, setLogs] = useState<StudyLog[]>(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // 初回データ読み込み
  useEffect(() => {
    if (initialLogs.length === 0) {
      loadStudyLogs();
    }
  }, []);

  const loadStudyLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await getStudyLogs(userId);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error loading study logs:', error);
    }
    setIsLoading(false);
  };

  const handleCreate = async (data: StudyLogInput) => {
    try {
      const newLog = await createStudyLog(userId, data);
      if (newLog) {
        setLogs(prev => [newLog, ...prev]);
      }
    } catch (error) {
      console.error('Error creating study log:', error);
    }
  };

  const handleEdit = async (data: StudyLogInput) => {
    if (!editingLog) return;

    try {
      const updatedLog = await updateStudyLog(userId, editingLog.id, data);
      if (updatedLog) {
        setLogs(prev => prev.map(log => 
          log.id === editingLog.id ? updatedLog : log
        ));
      }
    } catch (error) {
      console.error('Error updating study log:', error);
    }
  };

  const handleDelete = async (logId: number) => {
    if (deleteConfirm === logId) {
      try {
        const success = await deleteStudyLog(userId, logId);
        if (success) {
          setLogs(prev => prev.filter(log => log.id !== logId));
        }
      } catch (error) {
        console.error('Error deleting study log:', error);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(logId);
      // 3秒後に確認状態をリセット
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const openEditModal = (log: StudyLog) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  const getInitialData = (): StudyLogInput | undefined => {
    if (!editingLog) return undefined;

    return {
      book_id: editingLog.book_id ?? null,
      manual_book_title: editingLog.manual_book_title || '',
      duration_minutes: editingLog.duration_minutes,
      memo: editingLog.memo || '',
      studied_at: editingLog.studied_at
    };
  };

  const groupLogsByDate = (logs: StudyLog[]) => {
    const grouped = logs.reduce((groups, log) => {
      const date = new Date(log.studied_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {} as Record<string, StudyLog[]>);

    return Object.entries(grouped).map(([date, logs]) => ({
      date,
      logs,
      totalMinutes: logs.reduce((sum, log) => sum + log.duration_minutes, 0)
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const groupedLogs = groupLogsByDate(logs);

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          学習記録 ({logs.length}件)
        </h2>
        {showAddButton && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            記録を追加
          </button>
        )}
      </div>

      {/* 学習記録一覧 */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <StudyLogLoading 
            message="学習記録を読み込んでいます..." 
            size="lg"
          />
        </div>
      ) : groupedLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">まだ学習記録がありません</p>
          {showAddButton && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              最初の記録を追加
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedLogs.map(({ date, logs, totalMinutes }) => (
            <div key={date} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* 日付ヘッダー */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{date}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {totalMinutes < 60 
                        ? `${totalMinutes}分` 
                        : `${Math.floor(totalMinutes / 60)}時間${totalMinutes % 60 > 0 ? `${totalMinutes % 60}分` : ''}`
                      }
                    </span>
                    <span className="text-gray-400">・</span>
                    <span>{logs.length}回</span>
                  </div>
                </div>
              </div>

              {/* その日の学習記録 */}
              <div className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <div key={log.id} className="p-4">
                    <StudyLogCard
                      log={log}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      showActions={true}
                    />
                    {deleteConfirm === log.id && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 mb-2">
                          この記録を削除しますか？この操作は取り消せません。
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            削除する
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* モーダル */}
      <StudyLogModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingLog ? handleEdit : handleCreate}
        initialData={getInitialData()}
        mode={editingLog ? 'edit' : 'create'}
      />
    </div>
  );
}