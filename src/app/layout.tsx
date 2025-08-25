// src/app/layout.tsx
import "./globals.css";
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import { AuthProvider } from '@/hooks/useAuth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Lival AI - 中高生向け教育特化AIサービス',
    template: '%s | Lival AI'
  },
  description: 'Lival AIは中高生向けの教育特化AIサービスです。学習プランナーAI、家庭教師AI、進路カウンセラーAIの3つの専門AIコーチがあなたの学習スタイルに合わせて個別最適化された指導を提供します。学習タイプ診断で自分に合った学習方法を見つけましょう。',
  keywords: ['Lival AI', '教育AI', '学習支援', '中学生', '高校生', '学習プランナー', '家庭教師AI', '進路カウンセラー', '学習タイプ診断', '個別学習', 'AIコーチング', 'パーソナライズ学習'],
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
    title: 'Lival AI - 中高生向け教育特化AIサービス',
    description: '3種の専門AIコーチがあなたの学習スタイルに合わせて個別最適化された指導を提供。学習タイプ診断で自分に合った学習方法を見つけましょう。',
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
    title: 'Lival AI - 中高生向け教育特化AIサービス',
    description: '3種の専門AIコーチがあなたの学習を完全サポート。無料の学習タイプ診断から始めよう。',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Lival AI",
              "url": "https://lival.ai",
              "logo": "https://lival.ai/logo.png",
              "description": "中高生向け教育特化AIサービス。3つの専門AIコーチが学習をサポート。",
              "sameAs": [
                "https://twitter.com/lival_ai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@lival.ai"
              }
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <MainHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <MainFooter />
        </AuthProvider>
      </body>
    </html>
  )
}