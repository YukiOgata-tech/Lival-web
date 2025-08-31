// src/components/study/StudyLogCard.tsx
'use client'

import { StudyLog } from '../../types/study';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface StudyLogCardProps {
  log: StudyLog;
  onEdit?: (log: StudyLog) => void;
  onDelete?: (logId: number) => void;
  showActions?: boolean;
}

export default function StudyLogCard({ 
  log, 
  onEdit, 
  onDelete, 
  showActions = true 
}: StudyLogCardProps) {
  const studiedDate = new Date(log.studied_at);
  const formattedDate = studiedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });
  
  const formattedTime = studiedDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const timeAgo = formatDistanceToNow(studiedDate, { addSuffix: true, locale: ja });

  const getBookTitle = () => {
    if (log.book?.title) {
      return log.book.title;
    }
    if (log.manual_book_title) {
      return log.manual_book_title;
    }
    return '書籍なし';
  };

  const getBookAuthor = () => {
    if (log.book?.author) {
      return log.book.author;
    }
    return null;
  };

  const formatDuration = (minutes: number) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* 書籍情報 */}
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            {log.book?.cover_image_url && (
              <img
                src={log.book.cover_image_url}
                alt={getBookTitle()}
                className="w-10 h-12 sm:w-12 sm:h-16 object-cover rounded shadow-sm flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">
                {getBookTitle()}
              </h3>
              {getBookAuthor() && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                  {getBookAuthor()}
                </p>
              )}
              {log.book?.company && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {log.book.company}
                </p>
              )}
            </div>
          </div>

          {/* 学習情報 */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-blue-600">
                  {formatDuration(log.duration_minutes)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{formattedDate} {formattedTime}</span>
              </div>
            </div>

            {log.memo && (
              <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-md">
                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                  {log.memo}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              {timeAgo}
            </div>
          </div>
        </div>

        {/* アクション */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(log)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="編集"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(log.id)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="削除"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}