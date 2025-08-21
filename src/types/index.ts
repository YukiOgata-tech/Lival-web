// src/types/index.ts

import { Timestamp } from 'firebase/firestore'

/**
 * 学習者タイプ
 */
export type StudentType = 
  | 'strategist'  // 戦略家
  | 'explorer'    // 探求家
  | 'achiever'    // 努力家
  | 'challenger'  // 挑戦家
  | 'partner'     // 伴走者
  | 'pragmatist'  // 効率家

/**
 * AIエージェントタイプ
 */
export type AgentType = 
  | 'tutor'       // 家庭教師AI
  | 'counselor'   // 進路カウンセラーAI
  | 'planner'     // 学習計画AI

/**ユーザー情報（仮） */
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'student' | 'admin' | 'instructor'
  createdAt: Timestamp
  lastLoginAt?: Timestamp
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
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
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
  filters?: Record<string, any>
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

export default {}