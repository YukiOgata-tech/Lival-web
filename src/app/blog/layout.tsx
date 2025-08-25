import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '教育特化ブログ - 質の高い学習コンテンツ',
  description: 'Lival AIの教育特化ブログ。専門家や教育関係者による質の高い教育コンテンツをお届けします。学習方法、進路相談、教育トレンドなど、中高生の学習に役立つ実践的な情報が満載です。運営による厳格な審査を通過した信頼できる記事のみを掲載しています。',
  keywords: ['教育ブログ', '学習方法', '進路相談', '教育コンテンツ', '中学生', '高校生', '学習支援', '教育情報', '勉強法', 'Lival AI', '教育記事'],
  openGraph: {
    title: '教育特化ブログ - 質の高い学習コンテンツ | Lival AI',
    description: '専門家による質の高い教育コンテンツ。学習方法から進路相談まで、中高生の学習をサポートする実践的な情報をお届けします。',
    type: 'website',
    url: 'https://lival.ai/blog',
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
    title: '教育特化ブログ - 質の高い学習コンテンツ | Lival AI',
    description: '専門家による質の高い教育コンテンツ。中高生の学習をサポートする実践的な情報をお届けします。',
    images: ['/og-image-blog.png']
  },
  alternates: {
    canonical: 'https://lival.ai/blog'
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
            "url": "https://lival.ai/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Lival AI",
              "logo": "https://lival.ai/logo.png"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://lival.ai/blog"
            }
          })
        }}
      />
      {children}
    </>
  )
}