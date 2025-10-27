// src/lib/subscription/access-control.ts
import { LivalUser, SubscriptionPlan } from '@/types'

/**
 * サブスクリプション機能へのアクセス権限を判定
 */
export function hasSubscriptionAccess(userData: LivalUser | null): boolean {
  if (!userData) return false

  const { subscription, role } = userData

  // 管理者は常にアクセス可能
  if (role === 'admin') return true

  // overrideAccessフラグが立っている場合
  if (subscription.overrideAccess === true) return true

  // Stripeサブスクがアクティブな場合
  if (
    subscription.status === 'active' &&
    (subscription.plan === 'basic' || subscription.plan === 'premium') &&
    subscription.stripeSubscriptionId
  ) {
    return true
  }

  return false
}

/**
 * 特定プラン以上かどうか判定
 */
export function hasPlanAccess(
  userData: LivalUser | null,
  requiredPlan: SubscriptionPlan
): boolean {
  if (!userData) return false

  const { subscription, role } = userData

  // 管理者は常にアクセス可能
  if (role === 'admin') return true

  // overrideAccessフラグが立っている場合
  if (subscription.overrideAccess === true) return true

  // プラン階層チェック
  const planHierarchy: Record<SubscriptionPlan, number> = {
    free_web: 0,
    basic: 1,
    premium: 2
  }

  const currentLevel = planHierarchy[subscription.plan] || 0
  const requiredLevel = planHierarchy[requiredPlan] || 0

  return (
    subscription.status === 'active' &&
    currentLevel >= requiredLevel
  )
}

/**
 * 決済が有効かどうか（Stripe連携チェック）
 */
export function hasActiveStripeSubscription(userData: LivalUser | null): boolean {
  if (!userData) return false

  const { subscription } = userData

  return !!(
    subscription.status === 'active' &&
    subscription.stripeCustomerId &&
    subscription.stripeSubscriptionId
  )
}

/**
 * 管理者による特別アクセスかどうか
 */
export function isOverrideAccess(userData: LivalUser | null): boolean {
  if (!userData) return false

  return (
    userData.role === 'admin' ||
    userData.subscription.overrideAccess === true
  )
}

/**
 * プラン表示名を取得（UI表示用）
 */
export function getSubscriptionDisplayInfo(userData: LivalUser | null) {
  if (!userData) {
    return {
      planName: 'ログインが必要です',
      canManagePayment: false,
      isOverride: false,
      overrideReason: null
    }
  }

  const { subscription, role } = userData
  const isOverride = role === 'admin' || subscription.overrideAccess === true

  let planName = ''
  switch (subscription.plan) {
    case 'free_web':
      planName = 'フリープラン'
      break
    case 'basic':
      planName = 'ベーシックプラン'
      break
    case 'premium':
      planName = 'プレミアムプラン'
      break
  }

  // 特別アクセスの場合は表示を追加
  if (isOverride && !subscription.stripeSubscriptionId) {
    const reason = subscription.overrideReason || (role === 'admin' ? 'admin' : 'special')
    const reasonText: Record<string, string> = {
      admin: '管理者権限',
      trial: 'トライアル期間',
      partner: 'パートナー特典',
      promotional: 'プロモーション'
    }
    planName += ` (${reasonText[reason] || '特別提供'})`
  }

  return {
    planName,
    canManagePayment: !!subscription.stripeSubscriptionId,  // Stripe決済がある場合のみ管理可能
    isOverride,
    overrideReason: subscription.overrideReason || (role === 'admin' ? 'admin' : null)
  }
}

/**
 * サブスク期限チェック
 */
export function getSubscriptionStatus(userData: LivalUser | null) {
  if (!userData) {
    return {
      isActive: false,
      daysRemaining: 0,
      isExpiringSoon: false,
      message: 'ログインが必要です'
    }
  }

  const { subscription } = userData

  // 管理者やoverride権限は無期限扱い
  if (userData.role === 'admin' || subscription.overrideAccess === true) {
    return {
      isActive: true,
      daysRemaining: Infinity,
      isExpiringSoon: false,
      message: '特別アクセス権限'
    }
  }

  // フリープランの場合
  if (subscription.plan === 'free_web') {
    return {
      isActive: false,
      daysRemaining: 0,
      isExpiringSoon: false,
      message: 'アップグレードして全機能を利用'
    }
  }

  // 有料プランの期限チェック
  if (subscription.currentPeriodEnd) {
    const now = new Date()
    const endDate = subscription.currentPeriodEnd.toDate()
    const diffTime = endDate.getTime() - now.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      isActive: subscription.status === 'active',
      daysRemaining,
      isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
      message: subscription.status === 'active'
        ? `${endDate.toLocaleDateString('ja-JP')}まで有効`
        : 'サブスクリプションが無効です'
    }
  }

  return {
    isActive: subscription.status === 'active',
    daysRemaining: 0,
    isExpiringSoon: false,
    message: 'サブスクリプション情報を確認してください'
  }
}
