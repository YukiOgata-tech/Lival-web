'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { upsertUserProfile, CreateUserProfileData } from '@/lib/supabase/userProfile'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// プロファイルデータの型定義
interface ProfileData {
  display_name?: string
  grade?: string
  diag_rslt?: string
  diag_rslt_desc?: string
  target_universities?: string
  career_interests?: string
  avg_study_min?: number
  prefers_video?: boolean
  prefers_text?: boolean
  recency_mark?: string
}

// チャットメッセージの型定義
interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

// 質問設定
const questions = [
  {
    id: 'display_name',
    question: 'はじめまして！あなたのニックネームを教えてください 😊',
    type: 'text',
    required: false,
    placeholder: 'ニックネームを入力...'
  },
  {
    id: 'grade',
    question: '現在の学年を教えてください',
    type: 'select',
    required: false,
    options: [
      { value: '中学1年生', label: '中学1年生' },
      { value: '中学2年生', label: '中学2年生' },
      { value: '中学3年生', label: '中学3年生' },
      { value: '高校1年生', label: '高校1年生' },
      { value: '高校2年生', label: '高校2年生' },
      { value: '高校3年生', label: '高校3年生' },
      { value: 'その他', label: 'その他' }
    ]
  },
  {
    id: 'target_universities',
    question: '志望大学や将来の目標はありますか？（任意）',
    type: 'text',
    required: false,
    placeholder: '例: 東京大学、医学部、IT企業...'
  },
  {
    id: 'career_interests',
    question: '興味のある分野や将来やりたいことはありますか？（任意）',
    type: 'text',
    required: false,
    placeholder: '例: 医学、工学、文学、芸術...'
  },
  {
    id: 'avg_study_min',
    question: '普段の1日の学習時間はどのくらいですか？',
    type: 'select',
    required: false,
    options: [
      { value: 30, label: '30分以下' },
      { value: 60, label: '1時間程度' },
      { value: 120, label: '2時間程度' },
      { value: 180, label: '3時間程度' },
      { value: 240, label: '4時間以上' }
    ]
  },
  {
    id: 'learning_style',
    question: 'どんな学習方法が好きですか？（複数選択可）',
    type: 'multi_select',
    required: false,
    options: [
      { value: 'video', label: '動画で学習' },
      { value: 'text', label: '文章で学習' }
    ]
  },
  {
    id: 'recency_mark',
    question: '最近重視している科目はありますか？（任意）',
    type: 'select',
    required: false,
    options: [
      { value: '数学', label: '数学' },
      { value: '英語', label: '英語' },
      { value: '国語', label: '国語' },
      { value: '理科', label: '理科' },
      { value: '社会', label: '社会' },
      { value: 'その他', label: 'その他' }
    ]
  }
]

export default function ProfileSetupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)
  const initializationRef = useRef(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // タイピングエフェクト付きでメッセージを追加
  const addAIMessage = useCallback((content: string) => {
    const messageId = Date.now().toString()
    
    // タイピング中の状態を表示
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const newMessage: ChatMessage = {
        id: messageId,
        type: 'ai',
        content,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
    }, 1000 + Math.random() * 500) // ランダムな遅延でリアルさを演出
  }, [])

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // 初期メッセージと適切な質問を一度だけ設定
  useEffect(() => {
    if (user && !initializationRef.current) {
      initializationRef.current = true
      setHasInitialized(true)
      
      const initialMessage: ChatMessage = {
        id: '0',
        type: 'ai',
        content: `こんにちは、${user.displayName || 'さん'}！\nあなた専用のAI学習サポートをより良くするために、簡単な質問にお答えください。\n\n全て任意なので、答えたくない項目はスキップしても大丈夫です 🌟`,
        timestamp: new Date()
      }
      
      setTimeout(() => {
        setMessages([initialMessage])
        // タイピングアニメーション表示
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          
          // Firestore displayNameの有無で開始質問を決定
          let startQuestionIndex = 0
          if (user.displayName) {
            // 既にdisplayNameがある場合は名前質問をスキップ
            startQuestionIndex = 1
            setCurrentQuestionIndex(1)
          }
          
          const startQuestion = questions[startQuestionIndex]
          const questionMessage: ChatMessage = {
            id: '1',
            type: 'ai',
            content: startQuestion.question,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, questionMessage])
        }, 1500)
      }, 1000)
    }
  }, [user])

  // メッセージの自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ユーザーメッセージを追加
  const addUserMessage = (content: string) => {
    const messageId = Date.now().toString()
    const newMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }


  // 回答を処理
  const handleAnswer = async (value: string | string[] | number) => {
    const currentQuestion = questions[currentQuestionIndex]
    
    // プロファイルデータを更新
    const updatedProfile = { ...profileData }
    
    if (currentQuestion.id === 'learning_style') {
      // 学習スタイルの場合は特別処理
      const valueArray = Array.isArray(value) ? value : []
      updatedProfile.prefers_video = valueArray.includes('video')
      updatedProfile.prefers_text = valueArray.includes('text')
      
      const styles = []
      if (updatedProfile.prefers_video) styles.push('動画')
      if (updatedProfile.prefers_text) styles.push('文章')
      addUserMessage(styles.length > 0 ? styles.join('、') : 'スキップ')
    } else {
      const stringValue = typeof value === 'string' ? value : String(value)
      updatedProfile[currentQuestion.id as keyof ProfileData] = stringValue as any
      addUserMessage(stringValue || 'スキップ')
      
      // 名前質問の場合はFirestoreにも保存
      if (currentQuestion.id === 'display_name' && stringValue && user) {
        try {
          const userDocRef = doc(db, 'users', user.uid)
          await updateDoc(userDocRef, {
            displayName: stringValue,
            updatedAt: new Date()
          })
          console.log('DisplayName saved to Firestore:', stringValue)
        } catch (error) {
          console.error('Failed to save displayName to Firestore:', error)
        }
      }
    }
    
    setProfileData(updatedProfile)
    
    // 次の質問インデックスを先に計算
    const nextQuestionIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextQuestionIndex)
    setCurrentInput('')
    setSelectedOptions([])
    
    setTimeout(() => {
      // 次の質問があるかチェック
      if (nextQuestionIndex < questions.length) {
        const nextQuestion = questions[nextQuestionIndex]
        addAIMessage(nextQuestion.question)
      } else {
        // 全質問完了 - 完了処理を直接実行
        addAIMessage('ありがとうございました！✨\n\nあなたのプロファイルを保存して、最適な学習体験を準備中です...')
        
        setTimeout(async () => {
          try {
            if (!user) throw new Error('ユーザーが認証されていません')

            const profileToSave: CreateUserProfileData = {
              uid: user.uid,
              display_name: updatedProfile.display_name || user.displayName || undefined,
              grade: updatedProfile.grade,
              target_universities: updatedProfile.target_universities,
              career_interests: updatedProfile.career_interests,
              avg_study_min: updatedProfile.avg_study_min,
              prefers_video: updatedProfile.prefers_video || false,
              prefers_text: updatedProfile.prefers_text || false,
              recency_mark: updatedProfile.recency_mark,
              deviation_score: 50
            }

            const savedProfile = await upsertUserProfile(profileToSave)
            
            if (savedProfile) {
              addAIMessage('🎉 プロファイルの設定が完了しました！\n\nこれでAIがあなたに最適化された学習サポートを提供できます。\n\n準備ができましたら、トップページから学習を始めましょう！')
              setIsComplete(true)
            } else {
              throw new Error('プロファイルの保存に失敗しました')
            }
          } catch (error) {
            console.error('Profile save error:', error)
            addAIMessage('申し訳ありません。保存中にエラーが発生しました。\n\nネットワーク接続を確認して、後ほど再試行してください。')
          }
        }, 2000)
      }
    }, 1500)
  }

  // スキップ処理
  const handleSkip = () => {
    handleAnswer('')
  }


  // 入力コンポーネントの描画
  const renderInput = () => {
    if (isComplete || currentQuestionIndex >= questions.length) return null
    
    const currentQuestion = questions[currentQuestionIndex]
    
    switch (currentQuestion.type) {
      case 'text':
        return (
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAnswer(currentInput)}
            />
            <button
              onClick={() => handleAnswer(currentInput)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
            >
              送信
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
            >
              スキップ
            </button>
          </div>
        )
      
      case 'select':
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-left transition-colors group"
                >
                  <span className="text-white group-hover:text-blue-300">{option.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              スキップ
            </button>
          </div>
        )
      
      case 'multi_select':
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    const optionValue = String(option.value)
                    const newSelection = selectedOptions.includes(optionValue)
                      ? selectedOptions.filter(s => s !== optionValue)
                      : [...selectedOptions, optionValue]
                    setSelectedOptions(newSelection)
                  }}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedOptions.includes(String(option.value))
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAnswer(selectedOptions)}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                disabled={selectedOptions.length === 0}
              >
                選択完了 ({selectedOptions.length})
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                スキップ
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex-shrink-0">
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2 text-center">
          {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-4xl mx-auto px-4 pb-32">
          <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={`message-${message.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl whitespace-pre-line ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-12'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* タイピングインジケーター */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-gray-700 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {isComplete ? (
            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                トップページへ戻る
              </button>
            </div>
          ) : (
            renderInput()
          )}
        </div>
      </div>
    </div>
  )
}