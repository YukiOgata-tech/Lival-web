// src/types/index.ts

import { Timestamp } from 'firebase/firestore'

/**
 * 学習者タイプ（6つの診断タイプ）
 */
export type StudentType = 
  | 'strategist'   // 戦略家：効率と納得感を重視
  | 'explorer'     // 探求家：発見と好奇心重視
  | 'achiever'     // 努力家：承認と積み上げ重視
  | 'challenger'   // 挑戦家：競争と困難克服重視
  | 'partner'      // 伴走者：共感とサポート重視
  | 'pragmatist'   // 効率家：実用性と結果重視

/**
 * AIエージェントタイプ
 */
export type AgentType = 
  | 'tutor'       // 家庭教師AI
  | 'counselor'   // 進路カウンセラーAI
  | 'planner'     // 学習計画AI

/**
 * 性別
 */
export type Gender = 'male' | 'female'

/**
 * サブスクリプションプラン
 */
export type SubscriptionPlan = 'free_web' | 'premium'

/**
 * サブスクリプション状態
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trial'

/**
 * テーマタイプ
 */
export type Theme = 'light' | 'dark'

/**
 * 言語タイプ
 */
export type Language = 'ja' | 'en'

/**
 * サブスクリプション情報
 */
export interface UserSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp | null
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

/**
 * Web版ユーザー設定
 */
export interface WebUserPreferences {
  theme: Theme
  notifications: boolean
  language: Language
}

/**
 * Web版プロフィール
 */
export interface WebProfile {
  lastWebLogin: Timestamp
  isWebUser: boolean
  preferences: WebUserPreferences
}

/**
 * 診断情報（今後実装）
 */
export interface UserDiagnostics {
  studentType?: StudentType
  completedAt?: Timestamp
}

/**
 * 既存Firestoreデータ構造と完全互換のユーザー型定義
 */
export interface LivalUser {
  // 基本プロフィール（モバイルアプリと共通）
  bio: string
  birthday: Timestamp | null
  displayName: string
  email: string
  emailVerified: boolean
  gender: Gender | null
  photoURL: string
  
  // ゲーミフィケーション要素（モバイルアプリと共通）
  coins: number
  xp: number
  level: number
  currentMonsterId: string
  
  // 学習データ（モバイルアプリと共通）
  groupSessionCount: number
  groupTotalMinutes: number
  individualSessionCount: number
  individualTotalMinutes: number
  
  // システム情報（モバイルアプリと共通）
  createdAt: Timestamp
  updatedAt: Timestamp
  
  // Web版拡張フィールド
  subscription: UserSubscription
  webProfile: WebProfile
  
  // 今後の診断機能用（未実装）
  diagnostics?: UserDiagnostics
}

/**
 * Firebase Authentication User 拡張
 */
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

/**
 * サブスクリプションプラン定義
 */
export interface PricingPlanDetail {
  id: SubscriptionPlan
  name: string
  price: number
  currency: string
  interval: 'month' | null
  description: string
  features: string[]
  restrictions?: string[]
  isPopular?: boolean
}

/** 学生プロファイル */
// export interface StudentProfile {
//   uid: string
//   email: string
//   displayName: string
//   grade: number // 1-12 (小1から高3)
//   school?: string
//   studentType?: StudentType
//   diagnosisCompleted: boolean
//   preferences: StudentPreferences
//   goals: string[]
//   createdAt: Timestamp
//   updatedAt: Timestamp
//   lastActiveAt: Timestamp
// }

/**
 * 学生の設定・好み
 */
export interface StudentPreferences {
  motivationStyle: 'praise' | 'challenge' | 'autonomy' | 'collaboration'
  learningPace: 'slow' | 'normal' | 'fast'
  difficultyPreference: 'gradual' | 'challenging'
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night'
  subjects: string[]
  notifications: {
    email: boolean
    push: boolean
    studyReminder: boolean
    progressReport: boolean
  }
}

/**
 * 性格診断の質問
 */
export interface DiagnosisQuestion {
  id: number
  question: string
  optionA: string
  optionB: string
  category: 'motivation' | 'learning_style' | 'communication' | 'goals'
}

/**
 * 性格診断の回答
 */
export interface DiagnosisAnswer {
  questionId: number
  answer: 'A' | 'B'
}

/**
 * 性格診断結果
 */
export interface DiagnosisResult {
  id: string
  studentId: string
  answers: DiagnosisAnswer[]
  resultType: StudentType
  scores: {
    [key in StudentType]: number
  }
  completedAt: Timestamp
  recommendations: string[]
}

/**
 * ブログ記事
 */
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  featuredImage?: string
  tags: string[]
  category: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

/**
 * お知らせ
 */
export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high'
  targetAudience: 'all' | 'students' | 'admins' | 'instructors'
  isActive: boolean
  startDate: Timestamp
  endDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

/**
 * システム統計
 */
export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  totalStudyTime: number
  completedDiagnoses: number
  averageSessionLength: number
  popularSubjects: Array<{
    name: string
    count: number
  }>
  userGrowth: Array<{
    date: string
    count: number
  }>
}

/**
 * API レスポンス型
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * フォームエラー型
 */
export interface FormErrors {
  [key: string]: string | undefined
}

/**
 * ページネーション設定
 */
export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

/**
 * メール送信設定
 */
export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType: string
  }>
}

/**
 * ファイルアップロード情報
 */
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedAt: Timestamp
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  types: {
    studyReminder: boolean
    progressReport: boolean
    systemUpdates: boolean
    marketing: boolean
  }
}

/**
 * サブスクリプション情報
 */
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  canceledAt?: Timestamp
  createdAt: Timestamp
}

/**
 * 料金プラン
 */
export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  isPopular: boolean
  isActive: boolean
}

const indexTypes = {}
export default indexTypes