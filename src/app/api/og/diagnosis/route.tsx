// src/app/api/og/diagnosis/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'explorer'
    const displayName = searchParams.get('displayName') || '探求家'
    const confidence = searchParams.get('confidence') || '85'
    const description = searchParams.get('description') || '好奇心・発見・理解の喜びを原動力とするタイプ'

    // タイプ別の色設定
    const typeColors = {
      explorer: {
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        bg: '#F3F4F6'
      },
      strategist: {
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        bg: '#F0F9FF'
      },
      achiever: {
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        bg: '#F0FDF4'
      },
      challenger: {
        gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
        bg: '#FEF2F2'
      },
      partner: {
        gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
        bg: '#FDF2F8'
      },
      pragmatist: {
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
        bg: '#FFFBEB'
      }
    }

    const colors = typeColors[type as keyof typeof typeColors] || typeColors.explorer

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bg,
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.8) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.6) 0%, transparent 50%)`,
            fontFamily: '"Noto Sans JP", "Hiragino Sans", sans-serif',
            position: 'relative',
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: colors.gradient,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '30px',
                  color: 'white',
                }}
              >
                🧠
              </div>
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                background: colors.gradient,
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              LIVAL AI
            </div>
          </div>

          {/* メインカード */}
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '60px',
              maxWidth: '800px',
              margin: '0 40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* タイプ名 */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: colors.gradient,
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '20px',
              }}
            >
              {displayName}
            </div>

            {/* 説明 */}
            <div
              style={{
                fontSize: '24px',
                color: '#4B5563',
                lineHeight: 1.6,
                marginBottom: '40px',
                maxWidth: '600px',
              }}
            >
              {description}
            </div>

            {/* 信頼度バッジ */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: colors.gradient,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '30px',
              }}
            >
              ✨ 信頼度 {confidence}%
            </div>

            {/* CTA */}
            <div
              style={{
                fontSize: '18px',
                color: '#6B7280',
              }}
            >
              あなたも診断してみませんか？
            </div>
          </div>

          {/* フッター */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              fontSize: '16px',
              color: '#9CA3AF',
            }}
          >
            LIVAL AI 学習タイプ診断
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.log(`Failed to generate OG image: ${e instanceof Error ? e.message : 'Unknown error'}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}