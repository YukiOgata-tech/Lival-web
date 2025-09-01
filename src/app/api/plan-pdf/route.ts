import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    (searchParams.get('variant') || 'mobile') as 'mobile' | 'desktop'
    const name = searchParams.get('name') || 'LIVAL-plan'
    const body = await req.json()
    const imageDataUrl: string = body?.imageDataUrl
    if (!imageDataUrl?.startsWith('data:image/')) {
      return NextResponse.json({ error: 'invalid image data' }, { status: 400 })
    }

    // decode base64
    const base64 = imageDataUrl.split(',')[1]
    const buf = Buffer.from(base64, 'base64')

    // 受け取った画像をそのままPDFに埋め込み（オフスクリーンDOM側で透かし等を描画済み）
    const a4w = 794 // 約A4幅@96dpi
    const resized = await sharp(buf).flatten({ background: '#ffffff' }).resize({ width: a4w }).toBuffer()
    const pdfBuf = await sharp(resized).toFormat('pdf').toBuffer()

    return new NextResponse(pdfBuf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${name}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    console.error('plan-pdf error:', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
