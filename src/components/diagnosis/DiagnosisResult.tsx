// src/components/diagnosis/DiagnosisResult.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DiagnosisResult as DiagnosisResultType } from '@/types/diagnosis'
import { useSimpleDownload } from '@/hooks/useSimpleDownload'
import { useShare } from '@/hooks/useShare'
import { detailedDescriptions } from '@/data/diagnosis/detailed-descriptions'
import { 
  Star, 
  TrendingUp, 
  Brain, 
  Target, 
  Users, 
  Zap,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  Share2,
  ChevronDown,
  MessageCircle,
  Copy,
  Facebook,
  Instagram,
  CheckCircle,
  X,
  Lightbulb,
  GraduationCap,
  Heart
} from 'lucide-react'
import Link from 'next/link'

interface DiagnosisResultProps {
  result: DiagnosisResultType
  showActions?: boolean
  className?: string
}

export default function DiagnosisResult({
  result,
  showActions = true,
  className = ''
}: DiagnosisResultProps) {
  const { primaryType, secondaryType, confidence, scores } = result
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  
  // 詳細説明を取得
  const detailedInfo = detailedDescriptions.find(desc => desc.typeId === primaryType.id)
  
  const { downloadAsImage, isDownloading } = useSimpleDownload()
  const { shareViaWebAPI, shareToLine, shareToX, shareToFacebook, copyToClipboard, shareAsImage, isSharing } = useShare()
  
  const resultCardId = `diagnosis-result-${result.sessionId}`

  const getTypeIcon = (typeId: string) => {
    const icons = {
      explorer: Brain,
      strategist: Target,
      achiever: TrendingUp,
      challenger: Zap,
      partner: Users,
      pragmatist: BookOpen
    }
    return icons[typeId as keyof typeof icons] || Star
  }

  const getTypeColor = (typeId: string) => {
    const colors = {
      explorer: 'from-purple-500 to-indigo-500',
      strategist: 'from-blue-500 to-cyan-500',
      achiever: 'from-green-500 to-emerald-500',
      challenger: 'from-red-500 to-orange-500',
      partner: 'from-pink-500 to-rose-500',
      pragmatist: 'from-amber-500 to-yellow-500'
    }
    return colors[typeId as keyof typeof colors] || 'from-gray-500 to-slate-500'
  }

  const PrimaryIcon = getTypeIcon(primaryType.id)
  const SecondaryIcon = secondaryType ? getTypeIcon(secondaryType.id) : null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

  // ダウンロードハンドラー（シンプル版）
  const handleDownload = async () => {
    try {
      // ダウンロード前に要素が存在するか確認
      const element = document.getElementById(resultCardId)
      if (!element) {
        throw new Error('結果カードが見つかりません')
      }

      // シンプルなCanvas実装でダウンロード
      await downloadAsImage(resultCardId, {
        filename: `lival-ai-diagnosis-${primaryType.id}-result`,
        width: 800,
        height: 1200
      })
      
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
      
    } catch (error) {
      console.error('画像のダウンロードに失敗しました:', error)
      
      // エラーメッセージを表示
      const errorMessage = '画像のダウンロードに失敗しました。ブラウザのスクリーンショット機能をご利用ください。'
      alert(errorMessage)
    }
  }

  // 共有ハンドラー群
  const handleShareToLine = () => {
    shareToLine(result)
    setShowShareMenu(false)
  }

  const handleShareToX = () => {
    shareToX(result)
    setShowShareMenu(false)
  }

  const handleShareToFacebook = () => {
    shareToFacebook(result)
    setShowShareMenu(false)
  }

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(result)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
      setShowShareMenu(false)
    } catch (error) {
      console.error('リンクのコピーに失敗しました:', error)
      alert('リンクのコピーに失敗しました。もう一度お試しください。')
    }
  }

  const handleNativeShare = async () => {
    try {
      await shareViaWebAPI(result)
      setShowShareMenu(false)
    } catch (error) {
      console.error('共有に失敗しました:', error)
      // Web Share APIがサポートされていない場合は何もしない
    }
  }

  // 画像付き共有（現在は無効化）
  const handleShareWithImage = async () => {
    // シンプル実装では画像共有は無効化し、テキスト共有のみ
    handleNativeShare()
  }

  // 共有メニューの外側クリックで閉じる
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowShareMenu(false)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  return (
    <div className={`space-y-4 md:space-y-8 ${className}`}>
      {/* メイン結果カード */}
      <motion.div
        id={resultCardId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* ヘッダー */}
        <div className={`bg-gradient-to-r ${getTypeColor(primaryType.id)} p-4 md:p-8 text-white`}>
          <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <PrimaryIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{primaryType.displayName}</h1>
              <p className="text-sm md:text-lg opacity-90">{primaryType.scientificName}</p>
            </div>
          </div>
          <p className="text-sm md:text-lg opacity-95">{primaryType.description}</p>
        </div>

        {/* 信頼度とスコア */}
        <div className="p-4 md:p-8">
          {/* スマホ用コンパクト表示 */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center bg-amber-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-amber-600">{confidence}%</div>
                <p className="text-xs text-gray-600">信頼度</p>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{result.totalQuestions}</div>
                <p className="text-xs text-gray-600">質問数</p>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-600">{formatTime(result.responseTime)}</div>
                <p className="text-xs text-gray-600">所要時間</p>
              </div>
            </div>
          </div>

          {/* デスクトップ用表示 */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-amber-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">信頼度</span>
              </div>
              <div className="text-3xl font-bold text-amber-600">{confidence}%</div>
              <p className="text-sm text-gray-600">診断の確実性</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">質問数</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{result.totalQuestions}</div>
              <p className="text-sm text-gray-600">回答した質問</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-purple-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">所要時間</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{formatTime(result.responseTime)}</div>
              <p className="text-sm text-gray-600">診断時間</p>
            </div>
          </div>

          {/* セカンダリタイプ - スマホでは開閉式 */}
          {secondaryType && SecondaryIcon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-4 md:p-6 mb-4 md:mb-8"
            >
              <div className="md:hidden">
                <button
                  onClick={() => toggleSection('secondary')}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <SecondaryIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      サブタイプ: {secondaryType.displayName}
                    </h3>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transform transition-transform ${
                      expandedSections['secondary'] ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedSections['secondary'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <p className="text-gray-700 text-sm">{secondaryType.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-3 mb-3">
                  <SecondaryIcon className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    サブタイプ: {secondaryType.displayName}
                  </h3>
                </div>
                <p className="text-gray-700">{secondaryType.description}</p>
              </div>
            </motion.div>
          )}

          {/* 特徴 - スマホでは開閉式 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 md:mb-8"
          >
            <div className="md:hidden">
              <button
                onClick={() => toggleSection('characteristics')}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-3"
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  あなたの特徴
                </h3>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transform transition-transform ${
                    expandedSections['characteristics'] ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <AnimatePresence>
                {expandedSections['characteristics'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {primaryType.characteristics.map((characteristic, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{characteristic}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                あなたの特徴
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {primaryType.characteristics.map((characteristic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{characteristic}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 強み */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4 md:mb-8"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
              <Star className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600" />
              あなたの強み
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {primaryType.strengths.map((strength, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium"
                >
                  {strength}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* 詳細分析 */}
          {detailedInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 md:space-y-6 mb-4 md:mb-8"
            >
              {/* 科学的背景 */}
              <div className="bg-blue-50 rounded-xl p-4 md:p-6">
                <button
                  onClick={() => toggleSection('scientific')}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-600" />
                    科学的根拠
                  </h3>
                  <ChevronDown 
                    className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transform transition-transform ${
                      expandedSections['scientific'] ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedSections['scientific'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{detailedInfo.scientificBackground}</p>
                      <div className="mt-3 text-xs md:text-sm text-blue-600 font-medium">
                        理論的基盤: {detailedInfo.theoreticalBasis}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 学習アプローチ */}
              <div className="bg-green-50 rounded-xl p-4 md:p-6">
                <button
                  onClick={() => toggleSection('learning')}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600" />
                    あなたの学習アプローチ
                  </h3>
                  <ChevronDown 
                    className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transform transition-transform ${
                      expandedSections['learning'] ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedSections['learning'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3 md:space-y-4"
                    >
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{detailedInfo.learningApproach}</p>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">動機の源泉</h4>
                        <p className="text-green-700 text-sm md:text-base">{detailedInfo.motivationSource}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">詳細な特徴</h4>
                        <div className="space-y-2">
                          {detailedInfo.detailedCharacteristics.slice(0, 3).map((char, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-xs md:text-sm">{char}</span>
                            </div>
                          ))}
                          {detailedInfo.detailedCharacteristics.length > 3 && (
                            <p className="text-xs text-gray-500 mt-2">他{detailedInfo.detailedCharacteristics.length - 3}項目...</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 成長のヒント */}
              <div className="bg-amber-50 rounded-xl p-4 md:p-6">
                <button
                  onClick={() => toggleSection('tips')}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                    <Lightbulb className="w-5 h-5 md:w-6 md:h-6 mr-2 text-amber-600" />
                    学習のコツ & 成長ポイント
                  </h3>
                  <ChevronDown 
                    className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transform transition-transform ${
                      expandedSections['tips'] ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedSections['tips'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3 md:space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">🎯 あなたの強み</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {detailedInfo.strengths.slice(0, 3).map((strength, index) => (
                            <div key={index} className="bg-green-100 px-3 py-2 rounded-lg text-xs md:text-sm text-green-800">
                              {strength}
                            </div>
                          ))}
                          {detailedInfo.strengths.length > 3 && (
                            <p className="text-xs text-gray-500 mt-1">他{detailedInfo.strengths.length - 3}項目...</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">📚 効果的な学習方法</h4>
                        <div className="space-y-2">
                          {detailedInfo.studyTips.slice(0, 3).map((tip, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-xs md:text-sm">{tip}</span>
                            </div>
                          ))}
                          {detailedInfo.studyTips.length > 3 && (
                            <p className="text-xs text-gray-500 mt-1">他{detailedInfo.studyTips.length - 3}項目...</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">🌱 成長できる領域</h4>
                        <div className="space-y-2">
                          {detailedInfo.developmentAreas.slice(0, 2).map((area, index) => (
                            <div key={index} className="bg-blue-50 px-3 py-2 rounded-lg text-xs md:text-sm text-blue-700">
                              {area}
                            </div>
                          ))}
                          {detailedInfo.developmentAreas.length > 2 && (
                            <p className="text-xs text-gray-500 mt-1">他{detailedInfo.developmentAreas.length - 2}項目...</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* AIコーチングスタイル */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 md:p-6"
          >
            {/* スマホ用開閉式 */}
            <div className="md:hidden">
              <button
                onClick={() => toggleSection('aiCoaching')}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-3"
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  おすすめAIコーチングスタイル
                </h3>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transform transition-transform ${
                    expandedSections['aiCoaching'] ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <AnimatePresence>
                {expandedSections['aiCoaching'] && detailedInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-white/80 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">あなたに最適な指導方法</h4>
                      <p className="text-gray-700 text-xs leading-relaxed">{detailedInfo.aiCoachingStyle}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-white/60 rounded-lg p-2">
                        <h4 className="font-semibold text-gray-900 mb-1 text-xs">コミュニケーションスタイル</h4>
                        <p className="text-purple-700 font-medium text-xs">{primaryType.aiCoachingStyle.communicationStyle}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-2">
                        <h4 className="font-semibold text-gray-900 mb-1 text-xs">学習アプローチ</h4>
                        <p className="text-blue-700 font-medium text-xs">{primaryType.aiCoachingStyle.learningStyle}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">AIからの声かけ例</h4>
                      <div className="space-y-2">
                        {primaryType.aiCoachingStyle.languagePatterns.slice(0, 1).map((pattern, index) => (
                          <div key={index} className="bg-white/80 rounded-lg p-2 text-gray-700 italic text-xs">
                            「{pattern}」
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* デスクトップ用表示 */}
            <div className="hidden md:block">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-600" />
                おすすめAIコーチングスタイル
              </h3>
              {detailedInfo && (
                <div className="space-y-4">
                  <div className="bg-white/80 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">あなたに最適な指導方法</h4>
                    <p className="text-gray-700 leading-relaxed">{detailedInfo.aiCoachingStyle}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-2">コミュニケーションスタイル</h4>
                      <p className="text-purple-700 font-medium text-sm">{primaryType.aiCoachingStyle.communicationStyle}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-2">学習アプローチ</h4>
                      <p className="text-blue-700 font-medium text-sm">{primaryType.aiCoachingStyle.learningStyle}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AIからの声かけ例</h4>
                    <div className="space-y-2">
                      {primaryType.aiCoachingStyle.languagePatterns.slice(0, 2).map((pattern, index) => (
                        <div key={index} className="bg-white/80 rounded-lg p-3 text-gray-700 italic text-sm">
                          「{pattern}」
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* アクションボタン */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">次のステップ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
            >
              <Brain className="w-4 h-4 md:w-5 md:h-5" />
              <span>AIコーチングを始める</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
            
            <motion.button 
              onClick={handleDownload}
              disabled={isDownloading || downloadSuccess}
              whileHover={{ scale: downloadSuccess ? 1 : 1.02 }}
              whileTap={{ scale: downloadSuccess ? 1 : 0.98 }}
              className={`flex items-center justify-center space-x-2 py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm md:text-base ${
                downloadSuccess 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
              }`}
            >
              <AnimatePresence mode="wait">
                {isDownloading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4 md:w-5 md:h-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
                  />
                ) : downloadSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="download"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="hidden sm:inline">{
                isDownloading 
                  ? 'ダウンロード中...' 
                  : downloadSuccess 
                    ? '完了！' 
                    : '結果をダウンロード'
              }</span>
              <span className="sm:hidden">{
                isDownloading 
                  ? 'DL中...' 
                  : downloadSuccess 
                    ? '完了' 
                    : 'ダウンロード'
              }</span>
            </motion.button>
            
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                disabled={isSharing}
                className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2.5 md:py-3 px-4 md:px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 w-full text-sm md:text-base"
              >
                {isSharing ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                ) : (
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                )}
                <span className="hidden sm:inline">{isSharing ? '共有中...' : '結果を共有'}</span>
                <span className="sm:hidden">{isSharing ? '共有中' : '共有'}</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <>
                    {/* オーバーレイ（背景クリックで閉じる） */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={handleOutsideClick}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                    <div className="p-2">
                      <motion.button
                        onClick={handleShareToLine}
                        whileHover={{ scale: 1.02, backgroundColor: '#F0FDF4' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">LINEで共有</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={handleShareToX}
                        whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-900" />
                        <span className="text-gray-700">X (Twitter)で共有</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={handleShareToFacebook}
                        whileHover={{ scale: 1.02, backgroundColor: '#EFF6FF' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Facebookで共有</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.02, backgroundColor: copySuccess ? '#F0FDF4' : '#F9FAFB' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
                      >
                        <AnimatePresence mode="wait">
                          {copySuccess ? (
                            <motion.div
                              key="success"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 1 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="w-5 h-5 text-gray-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span className="text-gray-700">{copySuccess ? 'コピー完了！' : 'リンクをコピー'}</span>
                      </motion.button>
                      
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <>
                          <hr className="my-2 border-gray-200" />
                          <motion.button
                            onClick={handleNativeShare}
                            whileHover={{ scale: 1.02, backgroundColor: '#EFF6FF' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
                          >
                            <Share2 className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">その他のアプリで共有</span>
                          </motion.button>
                        </>
                      )}
                    </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}