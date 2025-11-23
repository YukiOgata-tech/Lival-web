import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '教育ブログ - 勉強方法・受験対策・進路相談 | LIVAL AI',
  description: '中高生・保護者向けの教育ブログ。効率的な勉強方法、受験対策、テスト対策、進路選択、AI学習活用法など実践的な情報が満載。塾・予備校選びで悩んでいる方、成績を上げたい学生必見。専門家・現役講師による信頼できる記事を毎日更新。',
  keywords: [
    // メイン
    '教育ブログ', '勉強ブログ', '学習ブログ', '受験ブログ', 'blog', 'school blog',
    // 勉強方法
    '勉強方法', '勉強法', '学習方法', '効率的な勉強', '成績アップ', '暗記方法', '復習方法',
    // 受験・テスト
    '受験対策', 'テスト対策', '高校受験', '大学受験', '定期テスト', '模試対策',
    // 進路
    '進路相談', '進路選択', '志望校選び', '文理選択', '学部選び',
    // ターゲット
    '中学生', '高校生', '受験生', '保護者', '親',
    // 悩み
    '成績 上がらない', '勉強 続かない', 'やる気 出ない', '集中できない',
    // AI学習
    'AI学習', 'AIチューター', 'オンライン学習', 'デジタル学習',
    // 比較
    '塾 選び方', '予備校 比較', '通信教育', '習い事',
    // その他
    '教育情報', '学習支援', '教育トレンド', 'LIVAL AI'
  ],
  openGraph: {
    title: '教育ブログ - 勉強方法・受験対策・進路相談 | LIVAL AI',
    description: '中高生・保護者向け教育ブログ。効率的な勉強方法、受験対策、AI学習活用法など実践的な情報が満載。専門家・現役講師による信頼できる記事を毎日更新。',
    type: 'website',
    url: 'https://lival-ai.com/blog',
    images: [
      {
        url: '/og-image-blog.png',
        width: 1200,
        height: 630,
        alt: '教育特化ブログ - 質の高い学習コンテンツ'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '教育ブログ - 勉強方法・受験対策 | LIVAL AI',
    description: '中高生・保護者向け教育ブログ。効率的な勉強方法、受験対策、AI学習活用法。専門家による信頼できる記事を毎日更新。',
    images: ['/og-image-blog.png']
  },
  alternates: {
    canonical: 'https://lival-ai.com/blog'
  }
}

export default function BlogLayout({
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
            "@type": "Blog",
            "name": "Lival AI 教育特化ブログ",
            "description": "中高生向けの教育コンテンツを提供するブログ",
            "url": "https://lival-ai.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Lival AI",
              "logo": "https://lival-ai.com/images/lival-circle.png"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://lival-ai.com/blog"
            }
          })
        }}
      />
      {children}
    </>
  )
}