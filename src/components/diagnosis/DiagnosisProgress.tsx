// src/components/diagnosis/DiagnosisProgress.tsx
'use client'
import { motion } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'

interface DiagnosisProgressProps {
  currentQuestion: number
  totalQuestions: number
  timeElapsed: number
  className?: string
}

export default function DiagnosisProgress({
  currentQuestion,
  totalQuestions,
  timeElapsed,
  className = ''
}: DiagnosisProgressProps) {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">
            質問 {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>進捗</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ステップインジケーター */}
      <div className="flex space-x-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionNumber = index + 1
          const isCompleted = questionNumber < currentQuestion
          const isCurrent = questionNumber === currentQuestion
          
          return (
            <motion.div
              key={questionNumber}
              className={`
                flex-1 h-2 rounded-full transition-colors duration-300
                ${isCompleted 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : isCurrent
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          )
        })}
      </div>

      {/* 残り時間の目安 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          残り約{Math.max(1, totalQuestions - currentQuestion + 1)}問
          {totalQuestions - currentQuestion > 0 && (
            <span className="ml-2">
              (予想残り時間: {Math.ceil((totalQuestions - currentQuestion) * 0.5)}分)
            </span>
          )}
        </p>
      </div>
    </div>
  )
}