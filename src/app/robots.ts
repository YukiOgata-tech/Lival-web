// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lival.ai'

  return {
    rules: [
      {
        // 一般的なクローラー（Googlebot、Bingbotなど）
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API エンドポイント
          '/admin/',         // 管理画面
          '/account/',       // アカウント管理
          '/dashboard/',     // ダッシュボード
          '/debug/',         // デバッグページ
          '/auth/',          // 認証ページ
          '/lival-agent-mode/threads/', // AIチャット履歴
          '/diagnosis/result/', // 診断結果ページ
          '/_next/',         // Next.js内部ファイル
          '/private/',       // プライベートファイル
          '*.json',          // JSONファイル
          '/search?*',       // 検索結果ページ
        ],
        crawlDelay: 0,
      },
      {
        // Googlebot専用（重要なページを優先的にクロール）
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/blog',
          '/subscription',
          '/pricing',
          '/diagnosis',
          '/features',
          '/faq',
          '/news',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/dashboard/',
          '/debug/',
          '/auth/',
          '/lival-agent-mode/threads/',
          '/diagnosis/result/',
        ],
        crawlDelay: 0,
      },
      {
        // Googlebot-Image（画像クロール許可）
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/og-image',
        ],
        disallow: [
          '/admin/',
          '/account/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}