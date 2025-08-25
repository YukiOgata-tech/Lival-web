import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '学習タイプ診断 - あなたに最適なAIコーチングを発見',
  description: 'Lival AIの学習タイプ診断で、あなたに最適なAIコーチングスタイルを発見しましょう。自己決定理論とBig Five性格理論に基づく科学的診断により、6つの学習タイプから最適なパーソナライゼーションを提供します。約5-8分で完了する無料診断です。',
  keywords: ['学習タイプ診断', '性格診断', 'AIコーチング', 'パーソナライゼーション', '学習最適化', '自己決定理論', 'Big Five', '探求家', '戦略家', '努力家', '挑戦家', '伴走者', '効率家'],
  openGraph: {
    title: '学習タイプ診断 - あなたに最適なAIコーチングを発見 | Lival AI',
    description: '科学的根拠に基づく診断で6つの学習タイプから最適化。約5-8分の無料診断であなたの学習スタイルを発見。',
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
    title: '学習タイプ診断 - あなたに最適なAIコーチングを発見',
    description: '科学的根拠に基づく診断で6つの学習タイプから最適化。約5-8分の無料診断であなたの学習スタイルを発見。',
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