'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, TrendingUp } from 'lucide-react'
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl border border-blue-100 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">週間学習時間</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            {currentWeek.weekLabel} • 合計 <span className="text-blue-600 font-bold">{formatTime(currentWeek.totalMinutes)}</span>
          </p>
        </div>

        {/* 週ナビゲーション */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigateWeek('prev')}
            disabled={!canGoBack}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">前</span>
          </button>

          <button
            onClick={() => navigateWeek('next')}
            disabled={!canGoForward}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md"
          >
            <span className="hidden sm:inline">次</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* 詳細チャート */}
      <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-3 sm:p-6 mb-6 border border-blue-100 shadow-sm">
        <div className="grid grid-cols-7 gap-1 sm:gap-4 mb-3 sm:mb-4">
          {currentWeek.days.map((day) => (
            <div key={day.date.toISOString()} className="text-center">
              <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                {day.dayName}
              </div>
              <div className="text-xs text-gray-600 mb-2 sm:mb-4">
                {day.date.getDate()}日
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-4 items-end" style={{ height: '120px' }}>
          {currentWeek.days.map((day, index) => {
            const intensity = day.minutes / maxMinutes
            const gradientClass = intensity > 0.7
              ? 'from-green-400 via-green-500 to-green-600'
              : intensity > 0.4
                ? 'from-blue-400 via-blue-500 to-blue-600'
                : 'from-blue-300 via-blue-400 to-blue-500'

            return (
              <motion.div
                key={day.date.toISOString()}
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}px` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`bg-gradient-to-t ${gradientClass} rounded-t-lg relative group cursor-pointer hover:scale-105 transition-all shadow-md hover:shadow-lg`}
                style={{ minHeight: day.minutes > 0 ? '6px' : '2px' }}
              >
                {day.minutes > 0 && (
                  <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs px-1 sm:px-2 py-1 rounded-lg whitespace-nowrap shadow-lg font-semibold">
                      {formatTime(day.minutes)}
                      {day.sessions > 0 && ` (${day.sessions}回)`}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-1 sm:mb-2">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white/90" />
            </div>
            <div className="text-sm sm:text-xl font-bold text-white mb-1">
              {formatTime(currentWeek.totalMinutes)}
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-medium">合計時間</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-1 sm:mb-2">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white/90" />
            </div>
            <div className="text-sm sm:text-xl font-bold text-white mb-1">
              {currentWeek.days.filter(d => d.minutes > 0).length}日
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-medium">学習日数</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-1 sm:mb-2">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white/90" />
            </div>
            <div className="text-sm sm:text-xl font-bold text-white mb-1">
              {currentWeek.totalMinutes > 0
                ? Math.round(currentWeek.totalMinutes / Math.max(currentWeek.days.filter(d => d.minutes > 0).length, 1))
                : 0
              }分
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-medium">1日平均</div>
          </div>
        </div>
      </div>
    </div>

  )
}