// src/components/diagnosis/ExpandableLearningType.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  CheckCircle, 
  Rocket, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Users,
  Settings
} from 'lucide-react'

interface AICoaching {
  style: string
  approach: string
  example: string
}

interface LearningType {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  bgColor: string
  description: string
  detailedDescription: string
  characteristics: string[]
  strengths: string[]
  aiCoaching: AICoaching
  studyTips: string[]
}

interface ExpandableLearningTypeProps {
  type: LearningType
  index: number
}

// アイコンマッピング
const iconMap = {
  'explorer': Sparkles,
  'strategist': Target,
  'achiever': TrendingUp,
  'challenger': Zap,
  'companion': Users,
  'efficiency': Settings
}

export default function ExpandableLearningType({ type, index }: ExpandableLearningTypeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const IconComponent = iconMap[type.icon as keyof typeof iconMap] || Sparkles

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* ヘッダー（常に表示） */}
      <div className={`bg-gradient-to-r ${type.color} p-4 sm:p-6 md:p-8 text-white`}>
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold truncate">{type.name}</h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90 truncate">{type.subtitle}</p>
          </div>
        </div>
        <p className="text-sm sm:text-base md:text-lg opacity-95 leading-relaxed">{type.description}</p>
      </div>

      {/* モバイル用展開ボタン */}
      <div className="block lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-gray-700"
        >
          <span className="font-medium text-sm sm:text-base">
            {isExpanded ? '詳細を閉じる' : '詳細を見る'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* デスクトップ版：常に表示 */}
      <div className="hidden lg:block">
        <DetailContent type={type} />
      </div>

      {/* モバイル版：展開式 */}
      <div className="lg:hidden">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <DetailContent type={type} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 重要ポイント（モバイルで常に表示） */}
      <div className="lg:hidden px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-100">
        <div className="space-y-3 sm:space-y-4">
          {/* 主な強み（最大2つ） */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
              主な強み
            </h3>
            <div className="flex flex-wrap gap-2">
              {type.strengths.slice(0, 2).map((strength, idx) => (
                <span 
                  key={idx} 
                  className={`px-2 sm:px-3 py-1 bg-${type.bgColor}-100 text-${type.bgColor}-800 rounded-full text-xs sm:text-sm font-medium`}
                >
                  {strength}
                </span>
              ))}
              {type.strengths.length > 2 && !isExpanded && (
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm">
                  +{type.strengths.length - 2}個
                </span>
              )}
            </div>
          </div>

          {/* AIコーチングスタイル */}
          <div className={`bg-gradient-to-br from-${type.bgColor}-50 to-${type.bgColor}-100 rounded-lg p-3 sm:p-4`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
              AIコーチング
            </h3>
            <div className="bg-white/80 rounded-lg p-2 sm:p-3">
              <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">スタイル</h4>
              <p className="text-gray-700 text-xs sm:text-sm">{type.aiCoaching.style}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 詳細コンテンツコンポーネント（共通）
function DetailContent({ type }: { type: LearningType }) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* 左側：詳細説明と特徴 */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
              このタイプの特徴
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              {type.detailedDescription}
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {type.characteristics.map((characteristic, idx) => (
                <div key={idx} className={`flex items-start space-x-2 p-2 sm:p-3 bg-${type.bgColor}-50 rounded-lg`}>
                  <div className={`w-1.5 h-1.5 bg-${type.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                  <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{characteristic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
              あなたの強み
            </h3>
            <div className="flex flex-wrap gap-2">
              {type.strengths.map((strength, idx) => (
                <span 
                  key={idx} 
                  className={`px-2 sm:px-3 py-1 bg-${type.bgColor}-100 text-${type.bgColor}-800 rounded-full text-xs sm:text-sm font-medium`}
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：AIコーチングとコツ */}
        <div className="space-y-4 sm:space-y-6">
          <div className={`bg-gradient-to-br from-${type.bgColor}-50 to-${type.bgColor}-100 rounded-xl p-4 sm:p-6`}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
              Lival AIコーチング
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="bg-white/80 rounded-lg p-2 sm:p-3">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">コーチングスタイル</h4>
                <p className="text-gray-700 text-xs sm:text-sm">{type.aiCoaching.style}</p>
              </div>
              <div className="bg-white/80 rounded-lg p-2 sm:p-3">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">アプローチ方法</h4>
                <p className="text-gray-700 text-xs sm:text-sm">{type.aiCoaching.approach}</p>
              </div>
              <div className="bg-white/80 rounded-lg p-2 sm:p-3">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">AIからの声かけ例</h4>
                <p className="text-gray-700 text-xs sm:text-sm italic">「{type.aiCoaching.example}」</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
              効果的な学習のコツ
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {type.studyTips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}