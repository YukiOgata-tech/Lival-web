// src/app/pricing/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '料金プラン - 塾・予備校より安い月額2,480円から | LIVAL AI',
  description: 'LIVAL AIの料金プラン。無料プラン・ベーシックプラン（月額2,480円）・プレミアムプラン（月額3,980円）。塾・予備校より圧倒的に安く、24時間365日質問し放題。人間講師サポート付き。中高生・保護者向け。全教科対応でコスパ最強のオンライン学習。',
  keywords: [
    // 料金系
    '料金', '価格', '月額', '費用', '料金プラン', 'プラン', 'サブスクリプション',
    '月額2480円', '月額3980円', '無料プラン', '無料体験',
    // 比較系
    '塾 料金', '予備校 料金', '家庭教師 料金', '塾 費用', '予備校 費用',
    '塾 安い', '予備校 安い', '家庭教師 安い', 'コスパ', '格安', '安い塾',
    '塾 月謝', '予備校 月謝', 'オンライン塾 料金',
    // プラン名
    'ベーシックプラン', 'プレミアムプラン', 'フリープラン',
    // ターゲット
    '中学生 塾代', '高校生 塾代', '受験生 費用', '保護者',
    // 特徴
    '質問し放題', '無制限質問', '24時間対応', '全教科対応', '人間講師サポート',
    // 競合
    'スタディサプリ 料金', '進研ゼミ 料金', 'オンライン家庭教師 料金'
  ],
  openGraph: {
    title: '料金プラン - 塾より安い月額2,480円から | LIVAL AI',
    description: '無料プランあり。ベーシック月額2,480円、プレミアム月額3,980円。塾・予備校より圧倒的に安く24時間質問し放題。人間講師サポート付き。',
    type: 'website',
    url: 'https://lival-ai.com/pricing',
    images: [
      {
        url: '/images/lival-circle.png',
        width: 1200,
        height: 1200,
        alt: 'LIVAL AI 料金プラン'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '料金プラン - 月額2,480円から | LIVAL AI',
    description: '塾より安い！24時間質問し放題で月額2,480円から。無料プランあり。人間講師サポート付き。全教科対応。',
    images: ['/images/lival-circle.png']
  },
  alternates: {
    canonical: 'https://lival-ai.com/pricing'
  }
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "LIVAL AI 教育AIプラットフォーム",
            "description": "24時間365日質問できる教育AI。塾・予備校の代わりに使える。人間講師サポート付き。",
            "brand": {
              "@type": "Brand",
              "name": "LIVAL AI"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "フリープラン",
                "price": "0",
                "priceCurrency": "JPY",
                "availability": "https://schema.org/InStock",
                "url": "https://lival-ai.com/pricing",
                "priceValidUntil": "2025-12-31",
                "description": "Web版基本機能のみ。無料で始められる。"
              },
              {
                "@type": "Offer",
                "name": "ベーシックプラン",
                "price": "2480",
                "priceCurrency": "JPY",
                "availability": "https://schema.org/InStock",
                "url": "https://lival-ai.com/pricing",
                "priceValidUntil": "2025-12-31",
                "billingDuration": "P1M",
                "description": "AI学習サポート・学習記録管理・Web版全機能・基本的なAIコーチング"
              },
              {
                "@type": "Offer",
                "name": "プレミアムプラン",
                "price": "3980",
                "priceCurrency": "JPY",
                "availability": "https://schema.org/InStock",
                "url": "https://lival-ai.com/pricing",
                "priceValidUntil": "2025-12-31",
                "billingDuration": "P1M",
                "description": "AIサービス全機能・モバイルアプリ対応・無制限学習サポート・専用AIコーチング・進路相談・優先サポート"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })
        }}
      />
      {children}
    </>
  )
}
