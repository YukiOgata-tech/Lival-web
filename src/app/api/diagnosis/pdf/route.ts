import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { jsPDF } from 'jspdf'
import path from 'path'
import fs from 'fs'
import { DiagnosisResult } from '@/types/diagnosis'
import { buildDiagnosisSvg } from '@/lib/diagnosis/pdf/svgBuilder'

export const runtime = 'nodejs'

type PdfRequestBody = {
  result?: DiagnosisResult
  name?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PdfRequestBody
    const result = body?.result

    if (!result || !result.primaryType || typeof result.confidence !== 'number') {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const pdfName = sanitizeFilename(body?.name || `lival-diagnosis-${result.primaryType.id}`)

    // Embed font + background if available
    const fontPath = resolveFirst([
      'public/fonts/noto-sans-jp-v54-japanese_latin-regular.woff2'
    ])
    const fontCss = fontPath ? buildFontFaceCss('Noto Sans JP', fontPath) : undefined
    const bgPath = resolveFirst([
      'public/images/Lival-text.png',
      'public/heading-Lival.png'
    ])
    const bgDataUri = bgPath ? toDataUri(fs.readFileSync(bgPath), 'image/png') : undefined

    // Single-page A4 SVG (96dpi: 794 x 1123)
    const svg = buildDiagnosisSvg(result, { fontCss, bgImageDataUri: bgDataUri })

    // Rasterize SVG to PNG first for maximum compatibility, then wrap into PDF
    const rasterPng = await sharp(Buffer.from(svg), { density: 300 })
      .png({ compressionLevel: 9 })
      .toBuffer()

    // Assemble a proper PDF with jsPDF and embed the PNG full-bleed
    const PAGE_W = 595.28 // pt (A4 width)
    const PAGE_H = 841.89 // pt (A4 height)
    const margin = 20 // pt

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })

    // Compute target draw size maintaining aspect ratio
    const img = sharp(rasterPng)
    const meta = await img.metadata()
    const imgW = meta.width || 794
    const imgH = meta.height || 1123
    const maxW = PAGE_W - margin * 2
    const maxH = PAGE_H - margin * 2
    const scale = Math.min(maxW / imgW, maxH / imgH)
    const drawW = imgW * scale
    const drawH = imgH * scale
    const dx = (PAGE_W - drawW) / 2
    const dy = (PAGE_H - drawH) / 2

    const base64 = Buffer.from(rasterPng).toString('base64')
    pdf.addImage(`data:image/png;base64,${base64}`, 'PNG', dx, dy, drawW, drawH)
    const pdfBuf = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfName}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    console.error('diagnosis/pdf error:', e?.message || e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 80)
}

function resolveFirst(relPaths: string[]) {
  for (const p of relPaths) {
    const full = path.join(process.cwd(), p)
    if (fs.existsSync(full)) return full
  }
  return undefined
}

function toDataUri(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString('base64')}`
}

function buildFontFaceCss(family: string, filePath: string) {
  const data = fs.readFileSync(filePath)
  const uri = toDataUri(data, 'font/woff2')
  return `@font-face { font-family: '${family}'; src: url(${uri}) format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }`
}
