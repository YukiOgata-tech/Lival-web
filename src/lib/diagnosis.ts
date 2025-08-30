// src/lib/diagnosis.ts
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  DiagnosisSession, 
  DiagnosisResponse, 
  DiagnosisResult,
  DiagnosisQuestion,
  DiagnosisType
} from '@/types/diagnosis'
import { CORE_QUESTIONS, FOLLOWUP_QUESTIONS } from '@/data/diagnosis/questions'
import { DIAGNOSIS_TYPES, SCORING_FORMULAS } from '@/data/diagnosis/types'

/**
 * 診断セッションを開始
 */
export const startDiagnosisSession = async (userId?: string): Promise<string> => {
  const now = Timestamp.now()
  const sessionData: Omit<DiagnosisSession, 'id'> = {
    userId: userId || null,
    startedAt: now,
    rawScores: {},
    status: 'active',
    currentQuestionIndex: 0,
    followUpQuestions: [],
    responses: [], // 空配列で開始
    createdAt: now,
    updatedAt: now,
    totalQuestions: CORE_QUESTIONS.length, // 最初は基本質問数
    lastActiveAt: now
  }

  try {
    const sessionRef = await addDoc(collection(db, 'diagnosis_sessions'), sessionData)
    return sessionRef.id
  } catch (error) {
    console.error('Failed to create diagnosis session:', error)
    throw new Error('診断セッションの開始に失敗しました')
  }
}

/**
 * 診断セッションを取得
 */
export const getDiagnosisSession = async (sessionId: string): Promise<DiagnosisSession | null> => {
  try {
    const sessionRef = doc(db, 'diagnosis_sessions', sessionId)
    const sessionSnap = await getDoc(sessionRef)
    
    if (sessionSnap.exists()) {
      return { id: sessionSnap.id, ...sessionSnap.data() } as DiagnosisSession
    }
    return null
  } catch (error) {
    console.error('Error getting diagnosis session:', error)
    throw error
  }
}

/**
 * 回答を保存し、次の質問を取得
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  answer: 'A' | 'B' | 'C' | 'D',
  responseTime: number
): Promise<{ nextQuestion?: DiagnosisQuestion; isCompleted: boolean }> => {
  try {
    const session = await getDiagnosisSession(sessionId)
    if (!session) {
      throw new Error('セッションが見つかりません')
    }

    // セッション状態の確認
    if (session.status === 'completed') {
      throw new Error('このセッションは既に完了しています')
    }

    // 重複回答の防止
    const existingResponse = session.responses.find(r => r.questionId === questionId)
    if (existingResponse) {
      console.warn(`Question ${questionId} already answered, skipping...`)
      // 次の質問を返す
      const nextQuestion = getNextQuestion(session.responses, session.currentQuestionIndex)
      return { nextQuestion: nextQuestion || undefined, isCompleted: !nextQuestion }
    }

    // 回答を配列内ではJavaScriptのDateオブジェクトを使用
    const response: DiagnosisResponse = {
      questionId,
      answer,
      responseTime,
      answeredAt: Timestamp.now() // serverTimestamp()ではなくnew Date()を使用
    }

    const updatedResponses = [...session.responses, response]
    const nextQuestionIndex = session.currentQuestionIndex + 1

    // セッションを更新（配列とその他のフィールドを分けて更新）
    const updateData: Partial<DiagnosisSession> = {
      responses: updatedResponses,
      currentQuestionIndex: nextQuestionIndex,
      updatedAt: Timestamp.now(),
      lastActiveAt: Timestamp.now()
    }

    // フォローアップ質問の総数を動的に更新
    const scores = calculateRawScores(updatedResponses)
    const eligibleFollowupQuestions = FOLLOWUP_QUESTIONS.filter(q => 
      shouldAskFollowupQuestion(q, scores, updatedResponses)
    )
    updateData.totalQuestions = CORE_QUESTIONS.length + eligibleFollowupQuestions.length

    await updateDoc(doc(db, 'diagnosis_sessions', sessionId), updateData)

    // 次の質問を決定
    const nextQuestion = getNextQuestion(updatedResponses, nextQuestionIndex)
    const isCompleted = !nextQuestion

    if (isCompleted) {
      // 診断完了処理
      await completeDiagnosis(sessionId, updatedResponses)
    }

    return { nextQuestion: nextQuestion || undefined, isCompleted }
  } catch (error) {
    console.error('Error submitting answer:', error)
    if (error instanceof Error) {
      throw new Error(`回答の送信に失敗しました: ${error.message}`)
    }
    throw new Error('回答の送信に失敗しました')
  }
}

/**
 * 次の質問を取得
 */
export const getNextQuestion = (responses: DiagnosisResponse[], questionIndex: number): DiagnosisQuestion | null => {
  // コア質問（6問）をまず実施
  if (questionIndex < CORE_QUESTIONS.length) {
    return CORE_QUESTIONS[questionIndex]
  }

  // フォローアップ質問の条件チェック
  const scores = calculateRawScores(responses)
  
  // 既に回答したフォローアップ質問を取得
  const answeredFollowupIds = responses
    .filter(r => FOLLOWUP_QUESTIONS.some(fq => fq.id === r.questionId))
    .map(r => r.questionId)

  // まだ回答していないフォローアップ質問をチェック
  for (const question of FOLLOWUP_QUESTIONS) {
    if (!answeredFollowupIds.includes(question.id)) {
      if (shouldAskFollowupQuestion(question, scores, responses)) {
        return question
      }
    }
  }

  return null
}

/**
 * フォローアップ質問の条件チェック
 */
const shouldAskFollowupQuestion = (
  question: DiagnosisQuestion, 
  scores: Record<string, number>,
  responses: DiagnosisResponse[]
): boolean => {
  if (!question.condition) return false

  try {
    // scoreGap条件のチェック
    if (question.condition.scoreGap) {
      const typeScores = calculateTypeScores(scores)
      const sortedScores = Object.values(typeScores).sort((a, b) => b - a)
      
      // 安全性チェック：少なくとも2つのスコアが必要
      if (sortedScores.length < 2) return false
      
      const gap = sortedScores[0] - sortedScores[1]
      if (gap > question.condition.scoreGap.max) {
        return false
      }
    }

    // 他の条件のチェック
    for (const [key, condition] of Object.entries(question.condition)) {
      if (key === 'scoreGap') continue
      
      const score = scores[key] || 0
      if (condition.min !== undefined && score < condition.min) {
        return false
      }
      if (condition.max !== undefined && score > condition.max) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error in shouldAskFollowupQuestion:', error)
    return false
  }
}

/**
 * 生スコアを計算
 */
export const calculateRawScores = (responses: DiagnosisResponse[]): Record<string, number> => {
  const scores: Record<string, number> = {}

  responses.forEach(response => {
    const question = [...CORE_QUESTIONS, ...FOLLOWUP_QUESTIONS].find(q => q.id === response.questionId)
    if (!question) return

    const weights = question.scoringWeights[response.answer]
    if (!weights) return

    Object.entries(weights).forEach(([key, value]) => {
      scores[key] = (scores[key] || 0) + value
    })
  })

  return scores
}

/**
 * タイプ別スコアを計算
 */
export const calculateTypeScores = (rawScores: Record<string, number>): Record<string, number> => {
  const typeScores: Record<string, number> = {}

  Object.entries(SCORING_FORMULAS).forEach(([typeId, formula]) => {
    let score = 0
    Object.entries(formula.weights).forEach(([key, weight]) => {
      score += (rawScores[key] || 0) * weight
    })
    typeScores[typeId] = Math.max(0, score)
  })

  return typeScores
}

/**
 * 診断完了処理
 */
const completeDiagnosis = async (sessionId: string, responses: DiagnosisResponse[]): Promise<void> => {
  const rawScores = calculateRawScores(responses)
  const typeScores = calculateTypeScores(rawScores)
  
  // 最高スコアのタイプを判定
  const sortedTypes = Object.entries(typeScores).sort(([,a], [,b]) => b - a)
  const primaryType = sortedTypes[0][0]
  const confidence = calculateConfidence(responses, typeScores)

  await updateDoc(doc(db, 'diagnosis_sessions', sessionId), {
    completedAt: serverTimestamp(),
    resultType: primaryType,
    confidenceScore: confidence,
    rawScores,
    status: 'completed',
    updatedAt: serverTimestamp()
  })
}

/**
 * 信頼度を計算
 */
const calculateConfidence = (responses: DiagnosisResponse[], typeScores: Record<string, number>): number => {
  let confidence = 85 // 基本信頼度

  // 一貫性スコア（回答時間の標準偏差）
  const responseTimes = responses.map(r => r.responseTime)
  const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  const stdDev = Math.sqrt(responseTimes.reduce((sq, n) => sq + Math.pow(n - avgTime, 2), 0) / responseTimes.length)
  const consistencyScore = Math.max(0, 10 - (stdDev / 1000)) // 標準偏差が小さいほど高スコア
  confidence += consistencyScore * 0.8

  // 判定明確度（トップスコアと2位のスコア差）
  const sortedScores = Object.values(typeScores).sort((a, b) => b - a)
  const scoreGap = sortedScores[0] - sortedScores[1]
  const clarityScore = Math.min(5, scoreGap * 0.5)
  confidence += clarityScore

  // 極端回答率（同じ選択肢ばかり選んでいないか）
  const answerCounts = responses.reduce((acc, r) => {
    acc[r.answer] = (acc[r.answer] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const maxAnswerRate = Math.max(...Object.values(answerCounts)) / responses.length
  if (maxAnswerRate > 0.8) {
    confidence -= 5 // 極端回答ペナルティ
  }

  return Math.min(98, Math.max(75, Math.round(confidence)))
}

/**
 * 診断結果を取得
 */
export const getDiagnosisResult = async (sessionId: string): Promise<DiagnosisResult | null> => {
  try {
    const session = await getDiagnosisSession(sessionId)
    if (!session || session.status !== 'completed' || !session.resultType) {
      return null
    }

    const primaryType = DIAGNOSIS_TYPES[session.resultType]
    if (!primaryType) {
      throw new Error('無効な診断タイプです')
    }

    // セカンダリタイプの判定（任意）
    const typeScores = calculateTypeScores(session.rawScores)
    const sortedTypes = Object.entries(typeScores).sort(([,a], [,b]) => b - a)
    const secondaryTypeId = sortedTypes[1][0]
    const secondaryType = typeScores[secondaryTypeId] > typeScores[session.resultType] * 0.8 
      ? DIAGNOSIS_TYPES[secondaryTypeId] 
      : undefined

    const totalResponseTime = session.responses.reduce((total, r) => total + r.responseTime, 0)

    return {
      sessionId,
      primaryType,
      secondaryType,
      confidence: session.confidenceScore || 85,
      scores: typeScores,
      rawScores: session.rawScores,
      completedAt: session.completedAt!,
      totalQuestions: session.responses.length,
      responseTime: totalResponseTime
    }
  } catch (error) {
    console.error('Error getting diagnosis result:', error)
    throw error
  }
}

/**
 * ユーザーの診断履歴を取得
 */
export const getUserDiagnosisHistory = async (userId: string): Promise<DiagnosisResult[]> => {
  try {
    const q = query(
      collection(db, 'diagnosis_sessions'),
      where('userId', '==', userId),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc'),
      limit(10)
    )

    const querySnapshot = await getDocs(q)
    const results: DiagnosisResult[] = []

    for (const doc of querySnapshot.docs) {
      const session = { id: doc.id, ...doc.data() } as DiagnosisSession
      if (session.resultType) {
        const result = await getDiagnosisResult(session.id!)
        if (result) {
          results.push(result)
        }
      }
    }

    return results
  } catch (error) {
    console.error('Error getting user diagnosis history:', error)
    throw error
  }
}

/**
 * 診断結果をユーザーデータに保存
 */
export const saveDiagnosisToUserProfile = async (userId: string, result: DiagnosisResult): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      'diagnostics.studentType': result.primaryType.id,
      'diagnostics.completedAt': result.completedAt,
      'diagnostics.confidence': result.confidence,
      'diagnostics.lastResultId': result.sessionId,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error saving diagnosis to user profile:', error)
    throw error
  }
}