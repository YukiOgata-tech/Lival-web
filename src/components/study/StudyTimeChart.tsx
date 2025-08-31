'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, TrendingUp, X } from 'lucide-react'
import { StudyLog } from '../../types/study'

interface StudyTimeChartProps {
  logs: StudyLog[]
  userId: string
}

interface WeekData {
  weekStart: Date
  weekEnd: Date
  days: DayData[]
  totalMinutes: number
  weekLabel: string
}

interface DayData {
  date: Date
  dayName: string
  minutes: number
  sessions: number
}

export default function StudyTimeChart({ logs, userId }: StudyTimeChartProps) {
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week, -1 = last week, etc.
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [weekData, setWeekData] = useState<WeekData[]>([])

  // 週のデータを処理
  useEffect(() => {
    processWeeklyData()
  }, [logs])

  const processWeeklyData = () => {
    if (!logs.length) {
      setWeekData([])
      return
    }

    // ログを日付順にソート
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.studied_at).getTime() - new Date(b.studied_at).getTime()
    )

    const today = new Date()
    const weeks: WeekData[] = []

    // 過去12週間分のデータを生成
    for (let weekOffset = -11; weekOffset <= 0; weekOffset++) {
      const weekStart = getWeekStart(today, weekOffset)
      const weekEnd = getWeekEnd(weekStart)
      
      const days: DayData[] = []
      let weekTotalMinutes = 0

      // その週の7日分のデータを生成
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDay = new Date(weekStart)
        currentDay.setDate(weekStart.getDate() + dayOffset)
        
        // その日のログをフィルタ
        const dayLogs = sortedLogs.filter(log => {
          const logDate = new Date(log.studied_at)
          return isSameDay(logDate, currentDay)
        })

        const dayMinutes = dayLogs.reduce((sum, log) => sum + log.duration_minutes, 0)
        weekTotalMinutes += dayMinutes

        days.push({
          date: new Date(currentDay),
          dayName: currentDay.toLocaleDateString('ja-JP', { weekday: 'short' }),
          minutes: dayMinutes,
          sessions: dayLogs.length
        })
      }

      weeks.push({
        weekStart,
        weekEnd,
        days,
        totalMinutes: weekTotalMinutes,
        weekLabel: formatWeekLabel(weekStart, weekEnd)
      })
    }

    setWeekData(weeks)
  }

  const getWeekStart = (date: Date, weekOffset: number = 0): Date => {
    const result = new Date(date)
    result.setDate(date.getDate() + (weekOffset * 7))
    const dayOfWeek = result.getDay()
    const diff = result.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Monday as first day
    result.setDate(diff)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const getWeekEnd = (weekStart: Date): Date => {
    const result = new Date(weekStart)
    result.setDate(weekStart.getDate() + 6)
    result.setHours(23, 59, 59, 999)
    return result
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  const formatWeekLabel = (start: Date, end: Date): string => {
    const startStr = start.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
    return `${startStr} - ${endStr}`
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`
  }

  const getCurrentWeekData = (): WeekData | null => {
    const currentWeekIndex = weekData.length - 1 + selectedWeek
    return weekData[currentWeekIndex] || null
  }

  const currentWeek = getCurrentWeekData()
  const maxMinutes = Math.max(...(currentWeek?.days.map(day => day.minutes) || [0]), 1)

  const navigateWeek = (direction: 'prev' | 'next') => {
    const maxPastWeeks = -(weekData.length - 1)
    const maxFutureWeeks = 0

    if (direction === 'prev' && selectedWeek > maxPastWeeks) {
      setSelectedWeek(selectedWeek - 1)
    } else if (direction === 'next' && selectedWeek < maxFutureWeeks) {
      setSelectedWeek(selectedWeek + 1)
    }
  }

  const canGoBack = selectedWeek > -(weekData.length - 1)
  const canGoForward = selectedWeek < 0

  if (!currentWeek) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="text-center py-6 sm:py-8">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">学習データがありません</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">今週の学習時間</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {currentWeek.weekLabel} • 合計 {formatTime(currentWeek.totalMinutes)}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">詳細を見る</span>
            <span className="sm:hidden">詳細</span>
          </button>
        </div>

        {/* 簡易チャート */}
        <div className="space-y-2 sm:space-y-3">
          {currentWeek.days.map((day, index) => (
            <motion.div
              key={day.date.toISOString()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <div className="w-8 sm:w-12 text-xs sm:text-sm text-gray-600 font-medium">
                {day.dayName}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 sm:h-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
              <div className="w-16 sm:w-20 text-xs sm:text-sm text-gray-700 text-right">
                {day.minutes > 0 ? formatTime(day.minutes) : '-'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg sm:rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                {/* モーダルヘッダー */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex-1 pr-2">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">学習時間グラフ</h2>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">週ごとの学習記録を確認できます</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* 週ナビゲーション */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <button
                    onClick={() => navigateWeek('prev')}
                    disabled={!canGoBack}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">前の週</span>
                    <span className="sm:hidden">前</span>
                  </button>
                  
                  <div className="text-center flex-1 px-2">
                    <h3 className="text-base sm:text-xl font-semibold text-gray-900">
                      {currentWeek.weekLabel}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      合計 {formatTime(currentWeek.totalMinutes)} • {currentWeek.days.filter(d => d.minutes > 0).length}日間
                    </p>
                  </div>

                  <button
                    onClick={() => navigateWeek('next')}
                    disabled={!canGoForward}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">次の週</span>
                    <span className="sm:hidden">次</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* 詳細チャート */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-6">
                  <div className="grid grid-cols-7 gap-1 sm:gap-4 mb-3 sm:mb-4">
                    {currentWeek.days.map((day) => (
                      <div key={day.date.toISOString()} className="text-center">
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {day.dayName}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 sm:mb-4">
                          {day.date.getDate()}日
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-4 items-end" style={{ height: '120px' }}>
                    {currentWeek.days.map((day, index) => (
                      <motion.div
                        key={day.date.toISOString()}
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.minutes / maxMinutes) * 100}px` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-colors"
                        style={{ minHeight: day.minutes > 0 ? '6px' : '2px' }}
                      >
                        {day.minutes > 0 && (
                          <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-gray-900 text-white text-xs px-1 sm:px-2 py-1 rounded whitespace-nowrap">
                              {formatTime(day.minutes)}
                              {day.sessions > 0 && ` (${day.sessions}回)`}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* 統計サマリー */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-blue-500 mr-1 sm:mr-2" />
                      </div>
                      <div className="text-sm sm:text-2xl font-bold text-gray-900">
                        {formatTime(currentWeek.totalMinutes)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">合計時間</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2" />
                      </div>
                      <div className="text-sm sm:text-2xl font-bold text-gray-900">
                        {currentWeek.days.filter(d => d.minutes > 0).length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">学習日数</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-purple-500 mr-1 sm:mr-2" />
                      </div>
                      <div className="text-sm sm:text-2xl font-bold text-gray-900">
                        {currentWeek.totalMinutes > 0 
                          ? Math.round(currentWeek.totalMinutes / Math.max(currentWeek.days.filter(d => d.minutes > 0).length, 1))
                          : 0
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">分/日平均</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}