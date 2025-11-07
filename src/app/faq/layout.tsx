import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'よくあるご質問（FAQ） - LIVAL AIの使い方・料金・サポート',
  description: 'LIVAL AIに関するよくある質問と回答。塾・予備校との違い、料金プラン（無料・月額2,480円・3,980円）、24時間サポート、人間講師サポート、アカウント作成、使い方、解約方法など。中高生・保護者の疑問を解決。',
  keywords: [
    // メイン
    'よくある質問', 'FAQ', 'サポート', 'ヘルプ', '使い方',
    // 料金関連
    '料金', '月額', '費用', '無料', '解約', '退会', '返金', 'プラン変更',
    // サービス関連
    '24時間対応', '人間講師', '質問し放題', '全教科対応',
    // トラブル
    'トラブルシューティング', 'ログインできない', '支払い方法', 'エラー',
    // 比較
    '塾との違い', '予備校との違い', '家庭教師との違い',
    // その他
    'アカウント作成', 'プライバシー', 'セキュリティ', '技術サポート'
  ],
  openGraph: {
    title: 'よくあるご質問（FAQ） - サポート情報 | Lival AI',
    description: 'Lival AIの使い方やトラブル解決方法をカテゴリ別に詳しく解説。お困りの際はまずこちらをご確認ください。',
    type: 'website',
    url: 'https://lival-ai.com/faq',
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
    canonical: 'https://lival-ai.com/faq'
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
                "name": "料金プランはどのようになっていますか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "フリープラン（無料）、ベーシックプラン（月額2,480円）、プレミアムプラン（月額3,980円）の3つのプランをご用意しています。塾・予備校より圧倒的に安く、24時間365日質問し放題です。"
                }
              },
              {
                "@type": "Question",
                "name": "24時間いつでも質問できますか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "はい、LIVAL AIは24時間365日いつでも質問可能です。深夜や早朝でも即座に回答が得られます。さらに人間講師によるサポートもご利用いただけます。"
                }
              },
              {
                "@type": "Question",
                "name": "塾や予備校との違いは何ですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "LIVAL AIは塾・予備校より圧倒的に安く、24時間いつでも質問し放題です。通塾の必要がなく、自宅で効率的に学習できます。人間講師サポートも付いているため安心です。"
                }
              },
              {
                "@type": "Question",
                "name": "3つのAIの違いは何ですか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tutor AI（質問応答）は全教科の質問に即答、Planner AI（学習計画）は個別最適化された学習計画を作成、Counselor AI（進路相談）は受験アドバイスを提供します。"
                }
              },
              {
                "@type": "Question",
                "name": "解約・退会はいつでもできますか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "はい、いつでもアカウント設定から解約できます。解約手数料や違約金は一切かかりません。"
                }
              },
              {
                "@type": "Question",
                "name": "無料プランでも使えますか？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "はい、フリープランでもWeb版の基本機能をご利用いただけます。まずは無料でお試しください。"
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