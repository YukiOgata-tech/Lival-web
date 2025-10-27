// src/data/subscriptions.ts
import { PricingPlanDetail } from '@/types'

/**
 * サブスクリプションプラン定義
 */
export const SUBSCRIPTION_PLANS: Record<string, PricingPlanDetail> = {
  free_web: {
    id: 'free_web',
    name: 'フリープラン',
    price: 0,
    currency: 'JPY',
    interval: null,
    description: 'Web版限定・基本機能のみ',
    features: [
      'Web版基本機能',
      '限定的なAI利用'
    ],
    restrictions: [
      'モバイルアプリ利用不可',
      '機能制限あり'
    ]
  },
  basic: {
    id: 'basic',
    name: 'ベーシックプラン',
    price: 2480,
    currency: 'JPY',
    interval: 'month',
    description: 'モバイルアプリで全機能利用可能',
    features: [
      '📱 iOS・Androidアプリ完全対応',
      '🤖 AI学習サポート（無制限）',
      '📊 学習記録・進捗管理',
      '🎯 AIコーチング機能',
      '📚 全ての基本システム利用可能',
      '💻 Web版も利用可能'
    ]
  },
  premium: {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 3980,
    currency: 'JPY',
    interval: 'month',
    description: 'ベーシック全機能 + 講師への直接質問サービス',
    features: [
      '✅ ベーシックプランの全機能',
      '📱 iOS・Androidアプリ完全対応',
      '💬 LINEオープンチャットで講師に質問',
      '👨‍🏫 現役講師が直接回答',
      '⏰ 質問回数無制限',
      '🎓 LINEで講師に学習相談・進路相談'
    ],
    isPopular: true,
    comingSoon: true  // 近日公開予定
  }
}

/** プラン情報を取得 */
export const getPlanInfo = (planId: string): PricingPlanDetail | null => {
  return SUBSCRIPTION_PLANS[planId] || null
}

/** 価格をフォーマット */
export const formatPrice = (price: number, currency: string = 'JPY'): string => {
  if (price === 0) return '無料'
  
  const formatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  })
  
  return formatter.format(price)
}

/** プラン比較用データ */
export const PLAN_COMPARISON_FEATURES = [
  {
    feature: 'iOS・Androidアプリ',
    free_web: false,
    basic: true,
    premium: true
  },
  {
    feature: 'Web版利用',
    free_web: '基本機能のみ',
    basic: true,
    premium: true
  },
  {
    feature: 'AI学習サポート',
    free_web: '制限あり',
    basic: '無制限',
    premium: '無制限'
  },
  {
    feature: '学習記録・進捗管理',
    free_web: false,
    basic: true,
    premium: true
  },
  {
    feature: 'AIコーチング',
    free_web: false,
    basic: true,
    premium: true
  },
  {
    feature: 'LINEで講師に質問',
    free_web: false,
    basic: false,
    premium: true
  },
  {
    feature: '学習相談・進路相談（LINE）',
    free_web: false,
    basic: false,
    premium: true
  }
]

export default SUBSCRIPTION_PLANS