// src/components/diagnosis/QuestionCard.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DiagnosisQuestion } from '@/types/diagnosis'
import { Brain, Lightbulb } from 'lucide-react'

interface QuestionCardProps {
  question: DiagnosisQuestion
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D', responseTime: number) => void
  isLoading?: boolean
  className?: string
}

export default function QuestionCard({
  question,
  onAnswer,
  isLoading = false,
  className = ''
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    setStartTime(Date.now())
    setSelectedAnswer(null)
  }, [question.id])

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (isLoading) return
    
    setSelectedAnswer(answer)
    const responseTime = Math.round((Date.now() - startTime) / 1000)
    
    // 少し待ってから回答を送信（UX向上）
    setTimeout(() => {
      onAnswer(answer, responseTime)
    }, 300)
  }

  const getQuestionTypeInfo = () => {
    if (question.questionType === 'core') {
      return {
        icon: Brain,
        label: 'コア質問',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }
    }
    return {
      icon: Lightbulb,
      label: 'フォローアップ',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  }

  const typeInfo = getQuestionTypeInfo()
  const TypeIcon = typeInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 ${className}`}
    >
      {/* 質問タイプ */}
      <div className="flex items-center space-x-2 mb-6">
        <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
          <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
        </div>
        <span className={`text-sm font-medium ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      </div>

      {/* 質問文 */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-relaxed"
      >
        {question.questionText}
      </motion.h2>

      {/* 選択肢 */}
      <div className="space-y-4">
        <AnimatePresence>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id
            const isAnswered = selectedAnswer !== null
            
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleAnswerSelect(option.id as 'A' | 'B' | 'C' | 'D')}
                disabled={isLoading || isAnswered}
                className={`
                  w-full p-6 rounded-xl border-2 text-left transition-all duration-300 transform
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                    : isAnswered
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:scale-[1.01] hover:shadow-md'
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {option.id}
                  </div>
                  <p className={`
                    text-base md:text-lg leading-relaxed
                    ${isSelected ? 'text-blue-900' : 'text-gray-700'}
                  `}>
                    {option.text}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ローディング状態 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-center space-x-3"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">次の質問を準備中...</span>
        </motion.div>
      )}

      {/* ヒント */}
      {!selectedAnswer && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm text-gray-600 text-center">
            💡 直感で答えてOK！正解・不正解はありません
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}