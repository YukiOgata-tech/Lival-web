// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS クラス名を結合・マージするユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日付フォーマット関数
 */
export function formatDate(date: Date | string, locale: string = 'ja-JP'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 相対時間表示（例：2時間前、3日前）
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  const intervals = [
    { label: '年', seconds: 31536000 },
    { label: 'ヶ月', seconds: 2592000 },
    { label: '日', seconds: 86400 },
    { label: '時間', seconds: 3600 },
    { label: '分', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count > 0) {
      return `${count}${interval.label}前`
    }
  }

  return 'たった今'
}

/**
 * 文字列を指定した長さで切り詰める
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * メールアドレスのバリデーション
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 日本の電話番号のバリデーション
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+81|0)[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * URLのバリデーション
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 数値を3桁区切りでフォーマット
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ja-JP').format(num)
}

/**
 * パスワード強度チェック
 */
export function checkPasswordStrength(password: string): {
  score: number // 0-4
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length < 8) {
    feedback.push('8文字以上にしてください')
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('小文字を含めてください')
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('大文字を含めてください')
  } else {
    score += 1
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('数字を含めてください')
  } else {
    score += 1
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('記号を含めてください')
  } else {
    score += 1
  }

  if (score >= 4) {
    feedback.push('強力なパスワードです')
  }

  return { score: Math.min(score, 4), feedback }
}

/**
 * ランダムなIDを生成
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 配列をシャッフル
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * デバウンス関数
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * スロットル関数
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * ブラウザ環境チェック
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * ローカルストレージのヘルパー関数（ハイドレーション対応）
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (!isBrowser()) return defaultValue || null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  set: <T>(key: string, value: T): void => {
    if (!isBrowser()) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  remove: (key: string): void => {
    if (!isBrowser()) return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },
  clear: (): void => {
    if (!isBrowser()) return
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}

/**
 * Cookie のヘルパー関数（ハイドレーション対応）
 */
export const cookies = {
  get: (name: string): string | null => {
    if (!isBrowser()) return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  },
  set: (name: string, value: string, days: number = 7): void => {
    if (!isBrowser()) return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  },
  remove: (name: string): void => {
    if (!isBrowser()) return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

/**
 * 日本語学年の変換
 */
export function getGradeString(grade: number): string {
  const gradeMap: { [key: number]: string } = {
    1: '小学1年生',
    2: '小学2年生',
    3: '小学3年生',
    4: '小学4年生',
    5: '小学5年生',
    6: '小学6年生',
    7: '中学1年生',
    8: '中学2年生',
    9: '中学3年生',
    10: '高校1年生',
    11: '高校2年生',
    12: '高校3年生',
  }
  return gradeMap[grade] || `${grade}年生`
}

/**
 * 学習者タイプの日本語変換
 */
export function getStudentTypeString(type: string): string {
  const typeMap: { [key: string]: string } = {
    strategist: '戦略家',
    explorer: '探求家',
    achiever: '努力家',
    challenger: '挑戦家',
    partner: '伴走者',
    pragmatist: '効率家',
  }
  return typeMap[type] || type
}

/**
 * 進捗パーセンテージの計算
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * 学習時間の人間が読みやすい形式への変換
 */
export function formatStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}時間`
  }
  return `${hours}時間${remainingMinutes}分`
}

/**
 * スムーズスクロール（ハイドレーション対応）
 */
export function scrollToTop(): void {
  if (!isBrowser()) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function scrollToElement(elementId: string): void {
  if (!isBrowser()) return
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}