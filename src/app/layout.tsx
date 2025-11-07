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
  description: 'LIVAL AIは中高生・保護者のための教育AI。塾・予備校の代わりに24時間365日いつでも質問できる。人間講師サポート付き。Tutor AI（質問応答）、Planner AI（学習計画）、Counselor AI（進路相談）が全教科対応。月額2,480円から。無料プランあり。オンライン学習塾として受験対策・テスト対策を徹底サポート。',
  keywords: [
    // ブランド名
    'LIVAL AI', 'リバルAI', 'ライバルAI', 'Lival', 'lival.ai',

    // コアコンセプト
    '教育AI', 'AI学習', '学習AI', 'AIチューター', 'AI先生', '教育特化AI', 'AI教育プラットフォーム', '学習支援AI',

    // ターゲット（学生）
    '中学生', '高校生', '中高生', '受験生', '学生', '10代', 'ティーン', '小学生高学年',

    // ターゲット（保護者）
    '保護者', '親', '母親', '父親', '子供の教育', '子供の勉強',

    // 塾・予備校比較
    '塾', '予備校', '学習塾', 'オンライン学習塾', '塾代わり', '予備校代わり', '塾 比較', '予備校 比較',
    '塾 安い', '塾 費用', '予備校 料金', 'オンライン塾', 'ネット塾', 'AI塾',

    // 家庭教師比較
    '家庭教師', 'オンライン家庭教師', '家庭教師AI', '家庭教師 代わり', '家庭教師 安い', '家庭教師 24時間',

    // 学習形態
    'オンライン学習', 'eラーニング', 'デジタル学習', 'リモート学習', '自宅学習', '個別学習', '自学自習',
    '在宅学習', '通信教育', 'ネット学習',

    // 機能・サービス
    '個別指導AI', '質問応答AI', '学習プランナー', 'AI進路相談', '学習計画', '勉強計画',
    '学習タイプ診断', 'パーソナライズ学習', 'アダプティブラーニング', '学習分析', '進捗管理',

    // 3つのAI
    'Tutor AI', 'Planner AI', 'Counselor AI', 'チューターAI', 'プランナーAI', 'カウンセラーAI',

    // 最大の特徴（24時間）
    '24時間学習サポート', '24時間365日', '24時間質問', 'いつでも質問', '深夜質問', '早朝質問',
    '無制限質問', '質問し放題', '即時回答', 'すぐ答えてくれる',

    // 人間サポート
    '講師サポート', '人間講師', '先生サポート', '講師相談', 'プロ講師',

    // 教科・科目
    '数学', '英語', '国語', '理科', '社会', '全教科対応', '5教科', '主要科目',
    '数学 質問', '英語 質問', '理科 質問', '社会 質問',

    // 試験対策
    'テスト対策', '定期テスト', '受験対策', '高校受験', '大学受験', '入試対策', '模試対策',
    '中間テスト', '期末テスト', '実力テスト',

    // プラン・価格
    '無料プラン', '月額2480円', '月額3980円', '安い', '格安', 'コスパ',
    'フリープラン', 'ベーシックプラン', 'プレミアムプラン', '無料体験', '無料お試し',

    // 競合比較
    'AI勉強アプリ', '勉強アプリ', '学習アプリ', '質問アプリ', '教育アプリ',
    'スタディサプリ 代わり', '進研ゼミ 代わり',

    // 悩み・課題
    'わからない問題', '勉強 わからない', '質問できない', '勉強 つまずく', '成績上がらない',
    '勉強 やり方', '勉強方法', '効率的 勉強', '学習習慣',

    // 地域・言語
    '日本', '国内', '日本語対応', '日本の学生',

    // その他
    '最新技術', '最先端AI', '画像認識', 'OCR', '写真で質問'
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
    title: 'LIVAL AI - 塾・予備校の代わりに24時間365日質問できる教育AI',
    description: '中高生・保護者のための教育AIプラットフォーム。24時間365日いつでも質問OK。人間講師サポート付き。月額2,480円から。塾・予備校・家庭教師の代わりに受験対策・テスト対策を徹底サポート。無料プランあり。',
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
    title: 'LIVAL AI - 24時間365日質問できる教育AI',
    description: '塾・予備校の代わりに使える教育AI。中高生・保護者向け。人間講師サポート付き。月額2,480円から。無料プランあり。受験対策・テスト対策を24時間徹底サポート。',
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
              "description": "中高生・保護者のための教育AIプラットフォーム。塾・予備校の代わりに24時間365日いつでも質問可能。人間講師によるサポートあり。Tutor AI（質問応答）・Planner AI（学習計画）・Counselor AI（進路相談）の3つの専門AIが全教科の受験対策・テスト対策を徹底サポート。",
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
              "description": "塾・予備校の代わりに24時間365日質問できる教育AIプラットフォーム。人間講師によるサポート付き。中高生・保護者向け。Tutor AI（質問応答）、Planner AI（学習計画）、Counselor AI（進路相談）の3つの専門AIが全教科の受験対策・テスト対策を徹底サポート。",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "featureList": [
                "24時間365日いつでも質問OK（深夜・早朝も対応）",
                "人間講師によるサポート",
                "質問応答AI（Tutor）- 全教科対応",
                "学習計画AI（Planner）- 個別最適化",
                "進路相談AI（Counselor）- 受験アドバイス",
                "学習タイプ診断 - 6つのタイプ",
                "画像認識 - 写真で質問",
                "質問し放題・無制限",
                "即時回答システム",
                "受験対策・テスト対策"
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
