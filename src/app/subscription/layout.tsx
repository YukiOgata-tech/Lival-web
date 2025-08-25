import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プレミアムプラン - 学習効果を最大化するサブスクリプション',
  description: 'Lival AIのプレミアムプランで学習効果を最大化しましょう。月額4,980円でAI機能フル活用、モバイルアプリ対応、専用サポートを利用できます。フリープランとの比較、料金詳細、よくある質問まで詳しくご紹介。いつでもキャンセル可能で安心です。',
  keywords: ['Lival AI', 'プレミアムプラン', 'サブスクリプション', '料金プラン', 'AIコーチング', 'モバイルアプリ', '学習支援', '月額料金', '教育サービス'],
  openGraph: {
    title: 'プレミアムプラン - 学習効果を最大化 | Lival AI',
    description: '月額4,980円でAI機能フル活用、モバイルアプリ対応。学習効果を最大化するプレミアムプランの詳細をご紹介。',
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
    title: 'プレミアムプラン - 学習効果を最大化 | Lival AI',
    description: 'AI機能フル活用、モバイルアプリ対応で学習効果を最大化。プレミアムプランの詳細をチェック。',
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
            "description": "中高生向け教育特化AIサービスのプレミアムプラン",
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
                  "description": "AI機能フル活用、モバイルアプリ対応、専用サポート"
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