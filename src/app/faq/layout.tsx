import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'よくあるご質問（FAQ） - サポート情報',
  description: 'Lival AIに関するよくあるご質問と回答集。アカウント作成、AIコーチング、料金プラン、技術的な問題、プライバシー・セキュリティ、教育ブログについてなど、カテゴリ別に詳しく解説しています。使い方でお困りの際はこちらをご確認ください。',
  keywords: ['よくある質問', 'FAQ', 'サポート', 'ヘルプ', 'トラブルシューティング', 'アカウント', 'AIコーチング', '料金', 'プライバシー', '技術サポート'],
  openGraph: {
    title: 'よくあるご質問（FAQ） - サポート情報 | Lival AI',
    description: 'Lival AIの使い方やトラブル解決方法をカテゴリ別に詳しく解説。お困りの際はまずこちらをご確認ください。',
    type: 'website',
    url: 'https://lival.ai/faq',
    images: [
      {
        url: '/og-image-faq.png',
        width: 1200,
        height: 630,
        alt: 'よくあるご質問（FAQ） - サポート情報'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'よくあるご質問（FAQ） - サポート情報 | Lival AI',
    description: 'Lival AIの使い方やトラブル解決方法をカテゴリ別に詳しく解説。',
    images: ['/og-image-faq.png']
  },
  alternates: {
    canonical: 'https://lival.ai/faq'
  }
}

export default function FAQLayout({
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
            "@type": "FAQPage",
            "name": "Lival AI よくあるご質問",
            "description": "Lival AIサービスに関するよくある質問と回答",
            "publisher": {
              "@type": "Organization",
              "name": "Lival AI"
            },
            "mainEntity": [
              {
                "@type": "Question",
                "name": "アカウントの作成方法は？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "メールアドレスまたはGoogleアカウントでサインアップいただけます。詳しい手順はFAQをご覧ください。"
                }
              },
              {
                "@type": "Question",
                "name": "3つのAIエージェントの違いは？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "学習プランナーAI、家庭教師AI、進路カウンセラーAIがそれぞれ異なる専門性を持ち、連携してサポートします。"
                }
              },
              {
                "@type": "Question",
                "name": "料金プランの詳細は？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "フリープランと月額4,980円のプレミアムプランをご用意しています。詳細な機能比較は料金ページでご確認ください。"
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
}