// src/app/layout.tsx
import "./globals.css";
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import { AuthProvider } from '@/hooks/useAuth'
import { Metadata } from 'next'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lival.ai'),
  title: {
    default: 'LIVAL AI - 中高生のための教育特化AIプラットフォーム',
    template: '%s | LIVAL AI'
  },
  description: 'LIVAL AIは中高生のための教育特化AIプラットフォーム。3つの専門AI（Tutor・Planner・Counselor）が24時間365日あなたの学習をサポート。フリープラン無料、ベーシックプラン月額2,480円、プレミアムプラン月額3,980円から選べます。学習タイプ診断で自分に最適な学習スタイルを発見しましょう。',
  keywords: [
    // ブランド名
    'LIVAL AI', 'リバルAI', 'ライバルAI', 'Lival', 'lival.ai',
    // コアコンセプト
    '教育AI', 'AI学習', '学習AI', 'AIチューター', 'AI先生', '教育特化AI', 'AI教育プラットフォーム', '学習支援AI',
    // ターゲット
    '中学生', '高校生', '中高生', '受験生', '学生', '10代', 'ティーン',
    // 学習形態
    'オンライン学習', 'eラーニング', 'デジタル学習', 'リモート学習', '自宅学習', '個別学習', '自学自習',
    // 機能・サービス
    '家庭教師AI', '個別指導AI', '質問応答AI', '学習プランナー', 'AI進路相談', '学習計画', '勉強計画',
    '学習タイプ診断', 'パーソナライズ学習', 'アダプティブラーニング', '学習分析', '進捗管理',
    // 3つのAI
    'Tutor AI', 'Planner AI', 'Counselor AI', 'チューターAI', 'プランナーAI', 'カウンセラーAI',
    // 特徴
    '24時間学習サポート', '24時間質問', 'いつでも質問', '無制限質問', '即時回答',
    // 教科・科目
    '数学', '英語', '国語', '理科', '社会', '全教科対応', '5教科',
    // 試験対策
    'テスト対策', '定期テスト', '受験対策', '高校受験', '大学受験', '入試対策',
    // プラン・価格
    '無料プラン', '月額2480円', '月額3980円', 'フリープラン', 'ベーシックプラン', 'プレミアムプラン',
    // 競合比較
    'AI勉強アプリ', '勉強アプリ', '学習アプリ', 'オンライン家庭教師', '質問アプリ',
    // 地域
    '日本', '国内', '日本語対応'
  ],
  authors: [{ name: 'LIVAL AI' }],
  creator: 'LIVAL AI',
  publisher: 'LIVAL AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    siteName: 'LIVAL AI',
    title: 'LIVAL AI - 中高生のための教育特化AIプラットフォーム',
    description: '3つの専門AI（Tutor・Planner・Counselor）が24時間365日あなたの学習をサポート。フリープラン無料、ベーシック月額2,480円、プレミアム月額3,980円。学習タイプ診断で自分に合った学習スタイルを発見。',
    images: [
      {
        url: '/images/lival-circle.png',
        width: 1200,
        height: 1200,
        alt: 'LIVAL AI - 中高生のための教育特化AIプラットフォーム'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIVAL AI - 中高生のための教育特化AIプラットフォーム',
    description: '3つの専門AI（Tutor・Planner・Counselor）が24時間学習サポート。無料プランから始められます。学習タイプ診断で最適な学習法を発見しよう。',
    images: ['/images/lival-circle.png'],
    creator: '@lival_ai'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  alternates: {
    canonical: 'https://lival.ai'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=M+PLUS+Rounded+1c:wght@300;400;500;700&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&family=Kiwi+Maru:wght@300;400;500&family=Kosugi+Maru&family=Sawarabi+Gothic&family=Dela+Gothic+One&family=Rampart+One&display=swap"
          rel="stylesheet"
        />
        {/* 組織情報 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "LIVAL AI",
              "alternateName": ["ライバルAI", "リバルAI"],
              "url": "https://lival.ai",
              "logo": "https://lival.ai/images/lival-circle.png",
              "description": "中高生のための教育特化AIプラットフォーム。3つの専門AI（Tutor・Planner・Counselor）が24時間365日学習をサポート。",
              "sameAs": [
                "https://twitter.com/lival_ai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@lival-ai.com",
                "availableLanguage": ["Japanese"],
                "areaServed": "JP"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Japan"
              },
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student",
                "audienceType": "中学生・高校生"
              }
            })
          }}
        />
        {/* Webサイト情報 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "LIVAL AI",
              "url": "https://lival.ai",
              "description": "中高生のための教育特化AIプラットフォーム",
              "inLanguage": "ja",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://lival.ai/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* ソフトウェアアプリケーション情報 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LIVAL AI",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "フリープラン",
                  "price": "0",
                  "priceCurrency": "JPY",
                  "description": "Web版基本機能のみ"
                },
                {
                  "@type": "Offer",
                  "name": "ベーシックプラン",
                  "price": "2480",
                  "priceCurrency": "JPY",
                  "billingDuration": "P1M",
                  "description": "AI学習サポート・学習記録管理"
                },
                {
                  "@type": "Offer",
                  "name": "プレミアムプラン",
                  "price": "3980",
                  "priceCurrency": "JPY",
                  "billingDuration": "P1M",
                  "description": "AIサービス全機能・モバイルアプリ対応"
                }
              ],
              "description": "中高生のための教育特化AIプラットフォーム。Tutor AI（質問応答）、Planner AI（学習計画）、Counselor AI（進路相談）の3つの専門AIが学習をサポート。",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "featureList": [
                "24時間365日AI学習サポート",
                "質問応答AI（Tutor）",
                "学習計画AI（Planner）",
                "進路相談AI（Counselor）",
                "学習タイプ診断",
                "全教科対応",
                "画像認識による問題解析"
              ]
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
