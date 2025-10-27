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
    description: '個人学習に最適なプラン',
    features: [
      'AI学習サポート',
      '学習記録管理',
      'Web版全機能利用',
      '基本的なAIコーチング'
    ]
  },
  premium: {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 3980,
    currency: 'JPY',
    interval: 'month',
    description: 'AIサービス全般利用可能（近日公開予定）',
    features: [
      'AIサービス全機能利用可能',
      'モバイルアプリ対応',
      '無制限学習サポート',
      '専用AIコーチング',
      '進路相談サービス',
      '優先サポート'
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
    feature: 'Web版基本機能',
    free_web: true,
    basic: true,
    premium: true
  },
  {
    feature: 'モバイルアプリ対応',
    free_web: false,
    basic: false,
    premium: true
  },
  {
    feature: 'AI利用制限',
    free_web: '制限あり',
    basic: '月50回まで',
    premium: '無制限'
  },
  {
    feature: '学習サポート',
    free_web: '基本のみ',
    basic: 'AI学習サポート',
    premium: '専用AIコーチング'
  },
  {
    feature: '進路相談',
    free_web: false,
    basic: false,
    premium: true
  },
  {
    feature: '優先サポート',
    free_web: false,
    basic: false,
    premium: true
  }
]

export default SUBSCRIPTION_PLANS