import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { DiagnosisResult } from '@/types/diagnosis'
import { buildDiagnosisSvg } from '@/lib/diagnosis/pdf/svgBuilder'
import path from 'path'
import fs from 'fs'

export const runtime = 'nodejs'

type ImgRequestBody = {
  result?: DiagnosisResult
  name?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImgRequestBody
    const result = body?.result
    if (!result || !result.primaryType || typeof result.confidence !== 'number') {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const name = sanitizeFilename(body?.name || `lival-diagnosis-${result.primaryType.id}`)

    // Embed Noto Sans JP from public/fonts if available
    const fontPath = resolveFirst([
      'public/fonts/noto-sans-jp-v54-japanese_latin-regular.woff2'
    ])
    const fontCss = fontPath ? buildFontFaceCss('Noto Sans JP', fontPath) : undefined

    // Embed background logo if exists
    const bgPath = resolveFirst([
      'public/images/Lival-text.png', // preferred
      'public/heading-Lival.png'      // fallback
    ])
    const bgDataUri = bgPath ? toDataUri(fs.readFileSync(bgPath), 'image/png') : undefined

    const svg = buildDiagnosisSvg(result, { fontCss, bgImageDataUri: bgDataUri })

    // Rasterize at higher density for crisp PNG
    const pngBuf = await sharp(Buffer.from(svg), { density: 192 })
      .png({ compressionLevel: 9 })
      .toBuffer()

    return new NextResponse(pngBuf, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${name}.png"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('diagnosis/image error:', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 80)
}

function toDataUri(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString('base64')}`
}

function resolveFirst(relPaths: string[]) {
  for (const p of relPaths) {
    const full = path.join(process.cwd(), p)
    if (fs.existsSync(full)) return full
  }
  return undefined
}

function buildFontFaceCss(family: string, filePath: string) {
  const data = fs.readFileSync(filePath)
  const uri = toDataUri(data, 'font/woff2')
  return `@font-face { font-family: '${family}'; src: url(${uri}) format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }`
}
