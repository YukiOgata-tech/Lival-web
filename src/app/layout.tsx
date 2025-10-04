// src/app/layout.tsx
import "./globals.css";
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import { AuthProvider } from '@/hooks/useAuth'
import { Metadata } from 'next'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'

export const metadata: Metadata = {
  title: {
    default: 'Lival AI - 中高生向け教育特化AIサービス',
    template: '%s | Lival AI'
  },
  description: 'Lival AIは塾や予備校に代わる新しい学習体験を提供する中高生向け教育特化AIサービスです。月額4,980円で24時間365日、3つの専門AIコーチ（学習プランナー・家庭教師・進路カウンセラー）があなたの学習スタイルに完全適応。高額な塾費用の心配なく、科学的根拠に基づく個別最適化された学習サポートを受けられます。',
  keywords: ['Lival AI', '塾代わり', '予備校代わり', '教育AI', '学習支援', '中学生', '高校生', 'オンライン家庭教師', '個別指導', '学習プランナー', '進路カウンセラー', '学習タイプ診断', 'AIコーチング', 'パーソナライズ学習', '塾費用削減', 'コスト効率', '24時間学習サポート'],
  authors: [{ name: 'Lival AI' }],
  creator: 'Lival AI',
  publisher: 'Lival AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://lival.ai',
    siteName: 'Lival AI',
    title: 'Lival AI - 塾・予備校に代わる中高生向けAI学習サービス',
    description: '月額4,980円で塾・予備校費用の1/10以下。24時間365日、3つの専門AIコーチがあなた専用の学習サポートを提供。高額な塾費用の心配なく、科学的根拠に基づく個別最適化された学習を実現。',
    images: [
      {
        url: '/og-image-default.png',
        width: 1200,
        height: 630,
        alt: 'Lival AI - 中高生向け教育特化AIサービス'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lival AI - 塾・予備校に代わるAI学習サービス',
    description: '月額4,980円で塾費用の1/10以下。24時間365日のAI学習サポートで塾通いは不要。無料診断から始めよう。',
    images: ['/og-image-default.png']
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Lival AI",
              "url": "https://lival.ai",
              "logo": "https://lival.ai/logo.png",
              "description": "塾・予備校に代わる中高生向けAI学習サービス。月額4,980円で24時間365日の個別指導を提供。",
              "sameAs": [
                "https://twitter.com/lival_ai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@lival-ai.com"
              }
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
