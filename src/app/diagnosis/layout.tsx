import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '【無料】学習タイプ診断 - 自分に最適な勉強方法が5分でわかる',
  description: '無料の学習タイプ診断で自分に合った勉強方法を発見。塾・予備校選びで迷っている中高生・保護者必見。科学的根拠に基づく6つの学習タイプ（戦略家・探求家・努力家・挑戦家・伴走者・効率家）から最適なAI学習スタイルを提案。約5分で完了。',
  keywords: [
    // メインキーワード
    '学習タイプ診断', '勉強方法 診断', '学習スタイル診断', '無料診断',
    // ターゲット
    '中学生 勉強方法', '高校生 勉強方法', '受験勉強 方法', '効率的な勉強',
    // 悩み系
    '勉強 やり方 わからない', '成績 上がらない', '勉強 続かない', '勉強 集中できない',
    // 比較系
    '塾 選び方', '予備校 選び方', '自分に合った塾', '塾 比較',
    // 6つのタイプ
    '戦略家', '探求家', '努力家', '挑戦家', '伴走者', '効率家',
    // その他
    '性格診断', 'AIコーチング', 'パーソナライズ学習', '学習最適化', '自己分析',
    '学習診断', '勉強診断', '学力診断', '適性診断'
  ],
  openGraph: {
    title: '【無料】学習タイプ診断 - 自分に最適な勉強方法が5分でわかる',
    description: '塾・予備校選びで迷っている方必見。無料の学習タイプ診断で自分に合った勉強方法を発見。6つのタイプから最適なAI学習スタイルを提案。中高生・保護者向け。',
    type: 'website',
    url: 'https://lival.ai/diagnosis',
    images: [
      {
        url: '/og-image-diagnosis.png',
        width: 1200,
        height: 630,
        alt: '学習タイプ診断 - あなたに最適なAIコーチングを発見'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '【無料】学習タイプ診断 - 5分で勉強方法がわかる',
    description: '自分に合った勉強方法を無料診断。塾・予備校選びで迷っている中高生・保護者におすすめ。科学的根拠に基づく6つの学習タイプから最適化。',
    images: ['/og-image-diagnosis.png']
  },
  alternates: {
    canonical: 'https://lival.ai/diagnosis'
  }
}

export default function DiagnosisLayout({
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
            "@type": "Survey",
            "name": "Lival AI 学習タイプ診断",
            "description": "自己決定理論とBig Five性格理論に基づく科学的学習タイプ診断",
            "provider": {
              "@type": "Organization",
              "name": "Lival AI"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "中学生・高校生"
            },
            "timeRequired": "PT5M",
            "educationalLevel": "中等教育",
            "learningResourceType": "Assessment",
            "about": [
              {
                "@type": "Thing",
                "name": "学習スタイル"
              },
              {
                "@type": "Thing",
                "name": "パーソナライゼーション"
              },
              {
                "@type": "Thing",
                "name": "AIコーチング"
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
}