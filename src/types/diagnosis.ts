// src/types/diagnosis.ts
import { Timestamp } from 'firebase/firestore'

/**
 * 診断関連の型定義
 */

export interface DiagnosisQuestionOption {
  id: string
  text: string
}

export interface ScoreWeights {
  [key: string]: number
}

export interface QuestionCondition {
  [key: string]: { min?: number; max?: number }
  scoreGap?: { max: number }
}

export interface DiagnosisQuestion {
  id: string
  questionText: string
  questionType: 'core' | 'followup'
  questionOrder: number
  options: DiagnosisQuestionOption[]
  scoringWeights: Record<string, ScoreWeights>
  condition?: QuestionCondition
}

export interface DiagnosisResponse {
  id?: string
  questionId: string
  answer: 'A' | 'B' | 'C' | 'D'
  responseTime: number
  answeredAt: Timestamp
}

export interface DiagnosisSession {
  id?: string
  userId?: string | null
  startedAt: Timestamp
  completedAt?: Timestamp | null
  resultType?: string | null
  confidenceScore?: number | null
  rawScores: Record<string, number>
  status: 'active' | 'completed' | 'abandoned'
  currentQuestionIndex: number
  followUpQuestions: string[]
  responses: DiagnosisResponse[]
  createdAt: Timestamp
  updatedAt: Timestamp
  // セッション管理用追加フィールド
  totalQuestions?: number
  estimatedTimeRemaining?: number
  lastActiveAt?: Timestamp
}

export interface AICoachingStyle {
  communicationStyle: string
  languagePatterns: string[]
  motivationApproach: string
  learningStyle: string
}

export interface DiagnosisType {
  id: string
  displayName: string
  scientificName: string
  description: string
  characteristics: string[]
  strengths: string[]
  weaknesses?: string[]
  recommendedStrategies?: string[]
  aiCoachingStyle: AICoachingStyle
}

export interface DiagnosisResult {
  sessionId: string
  primaryType: DiagnosisType
  secondaryType?: DiagnosisType
  confidence: number
  scores: Record<string, number>
  rawScores: Record<string, number>
  completedAt: Timestamp
  totalQuestions: number
  responseTime: number
}

export interface DiagnosisProgress {
  currentQuestion: number
  totalQuestions: number
  percentage: number
  timeElapsed: number
}

// API関連
export interface StartDiagnosisRequest {
  userId?: string
}

export interface StartDiagnosisResponse {
  sessionId: string
  firstQuestion: DiagnosisQuestion
}

export interface SubmitAnswerRequest {
  sessionId: string
  questionId: string
  answer: 'A' | 'B' | 'C' | 'D'
  responseTime: number
}

export interface SubmitAnswerResponse {
  nextQuestion?: DiagnosisQuestion
  isCompleted: boolean
  progress: DiagnosisProgress
}

export interface GetResultRequest {
  sessionId: string
}

export interface GetResultResponse {
  result: DiagnosisResult
}

// ユーザーの診断履歴
export interface UserDiagnosisHistory {
  userId: string
  diagnosisResults: DiagnosisResult[]
  lastDiagnosisAt?: Timestamp
  totalDiagnoses: number
}

// セッション管理用
export interface DiagnosisSessionState {
  session: DiagnosisSession | null
  currentQuestion: DiagnosisQuestion | null
  progress: DiagnosisProgress
  isLoading: boolean
  error: string | null
}

const diagnosisTypes = {}
export default diagnosisTypes