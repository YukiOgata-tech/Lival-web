import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プレミアムプラン - 塾・予備校費用の1/10以下で24時間学習サポート',
  description: '塾・予備校に通う必要なし！月額4,980円で従来の塾費用の1/10以下を実現。24時間365日のAI個別指導で、高額な塾代・予備校代を大幅削減しながら学習効果を最大化。通塾時間も不要で効率的な学習環境を提供します。',
  keywords: ['Lival AI', '塾代削減', '予備校代削減', 'プレミアムプラン', 'サブスクリプション', '料金比較', 'コスト効率', '24時間指導', '個別指導', 'オンライン学習', '通塾不要', '学習費用', '教育費節約'],
  openGraph: {
    title: 'プレミアムプラン - 塾費用の1/10以下で24時間学習サポート | Lival AI',
    description: '塾・予備校の代わりに月額4,980円で24時間365日のAI個別指導。高額な塾費用を大幅削減し、通塾不要の効率的学習を実現。',
    type: 'website',
    url: 'https://lival.ai/subscription',
    images: [
      {
        url: '/og-image-subscription.png',
        width: 1200,
        height: 630,
        alt: 'プレミアムプラン - 学習効果を最大化'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'プレミアムプラン - 塾費用の1/10以下 | Lival AI',
    description: '塾・予備校代わりの24時間AI学習サポート。月額4,980円で高額な塾費用を大幅削減。',
    images: ['/og-image-subscription.png']
  },
  alternates: {
    canonical: 'https://lival.ai/subscription'
  }
}

export default function SubscriptionLayout({
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
            "@type": "Service",
            "name": "Lival AI プレミアムプラン",
            "description": "塾・予備校に代わる中高生向けAI学習サービスのプレミアムプラン。月額4,980円で24時間365日の個別指導",
            "provider": {
              "@type": "Organization",
              "name": "Lival AI"
            },
            "serviceType": "Educational Technology",
            "areaServed": "JP",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Subscription Plans",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "プレミアムプラン"
                  },
                  "price": "4980",
                  "priceCurrency": "JPY",
                  "billingPeriod": "P1M",
                  "description": "塾・予備校代わりの24時間AI学習サポート、モバイルアプリ対応、専用サポート"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "フリープラン"
                  },
                  "price": "0",
                  "priceCurrency": "JPY",
                  "description": "基本機能を無料で利用"
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  )
}