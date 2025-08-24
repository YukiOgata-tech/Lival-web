// src/hooks/useDiagnosis.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { 
  DiagnosisSession, 
  DiagnosisQuestion, 
  DiagnosisResult,
  DiagnosisProgress,
  DiagnosisSessionState 
} from '@/types/diagnosis'
import { 
  startDiagnosisSession,
  submitAnswer,
  getDiagnosisResult,
  getNextQuestion
} from '@/lib/diagnosis'
import { CORE_QUESTIONS } from '@/data/diagnosis/questions'
import { useAuth } from './useAuth'

export function useDiagnosis() {
  const { user } = useAuth()
  const [state, setState] = useState<DiagnosisSessionState>({
    session: null,
    currentQuestion: null,
    progress: { currentQuestion: 0, totalQuestions: 6, percentage: 0, timeElapsed: 0 },
    isLoading: false,
    error: null
  })
  const [startTime, setStartTime] = useState<number>(0)

  // 時間経過の追跡
  useEffect(() => {
    if (!state.session || state.session.status !== 'active') return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          timeElapsed: elapsed
        }
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, state.session])

  // 診断開始
  const startDiagnosis = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const sessionId = await startDiagnosisSession(user?.uid)
      const firstQuestion = CORE_QUESTIONS[0]
      
      const newSession: DiagnosisSession = {
        id: sessionId,
        userId: user?.uid || null,
        startedAt: new Date(),
        rawScores: {},
        status: 'active',
        currentQuestionIndex: 0,
        followUpQuestions: [],
        responses: []
      }

      setStartTime(Date.now())
      setState({
        session: newSession,
        currentQuestion: firstQuestion,
        progress: {
          currentQuestion: 1,
          totalQuestions: 6, // 初期値（フォローアップで増える可能性）
          percentage: Math.round((1 / 6) * 100),
          timeElapsed: 0
        },
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Failed to start diagnosis:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '診断を開始できませんでした。もう一度お試しください。'
      }))
    }
  }, [user])

  // 回答送信
  const submitQuestionAnswer = useCallback(async (
    answer: 'A' | 'B' | 'C' | 'D',
    responseTime: number
  ) => {
    if (!state.session || !state.currentQuestion) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const result = await submitAnswer(
        state.session.id!,
        state.currentQuestion.id,
        answer,
        responseTime
      )

      const newQuestionIndex = state.session.currentQuestionIndex + 1
      
      // 総質問数の更新（フォローアップ質問を考慮）
      const estimatedTotalQuestions = 6 + (result.nextQuestion ? 1 : 0)
      
      if (result.isCompleted) {
        setState(prev => ({
          ...prev,
          session: prev.session ? { ...prev.session, status: 'completed' as const } : null,
          currentQuestion: null,
          progress: {
            currentQuestion: newQuestionIndex,
            totalQuestions: newQuestionIndex,
            percentage: 100,
            timeElapsed: prev.progress.timeElapsed
          },
          isLoading: false
        }))
      } else if (result.nextQuestion) {
        setState(prev => ({
          ...prev,
          session: prev.session ? { 
            ...prev.session, 
            currentQuestionIndex: newQuestionIndex 
          } : null,
          currentQuestion: result.nextQuestion!,
          progress: {
            currentQuestion: newQuestionIndex + 1,
            totalQuestions: estimatedTotalQuestions,
            percentage: Math.round(((newQuestionIndex + 1) / estimatedTotalQuestions) * 100),
            timeElapsed: prev.progress.timeElapsed
          },
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '回答の送信に失敗しました。もう一度お試しください。'
      }))
    }
  }, [state.session, state.currentQuestion])

  // 結果取得
  const getResult = useCallback(async (): Promise<DiagnosisResult | null> => {
    if (!state.session?.id) return null

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await getDiagnosisResult(state.session.id)
      setState(prev => ({ ...prev, isLoading: false }))
      return result
    } catch (error) {
      console.error('Failed to get diagnosis result:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '結果の取得に失敗しました。もう一度お試しください。'
      }))
      return null
    }
  }, [state.session])

  // 診断リセット
  const resetDiagnosis = useCallback(() => {
    setState({
      session: null,
      currentQuestion: null,
      progress: { currentQuestion: 0, totalQuestions: 6, percentage: 0, timeElapsed: 0 },
      isLoading: false,
      error: null
    })
    setStartTime(0)
  }, [])

  // エラークリア
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // 状態
    session: state.session,
    currentQuestion: state.currentQuestion,
    progress: state.progress,
    isLoading: state.isLoading,
    error: state.error,
    isActive: state.session?.status === 'active',
    isCompleted: state.session?.status === 'completed',
    
    // アクション
    startDiagnosis,
    submitAnswer: submitQuestionAnswer,
    getResult,
    resetDiagnosis,
    clearError
  }
}

export default useDiagnosis