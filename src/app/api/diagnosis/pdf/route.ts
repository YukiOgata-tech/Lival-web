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

    // Embed multiple font weights if available
    const fontPaths = {
      regular: resolveFirst(['public/fonts/noto-sans-jp-v54-japanese_latin-regular.woff2']),
      medium: resolveFirst(['public/fonts/noto-sans-jp-500.ttf', 'public/fonts/noto-sans-jp-v54-japanese_latin-500.woff2']),
      semibold: resolveFirst(['public/fonts/noto-sans-jp-600.ttf', 'public/fonts/noto-sans-jp-v54-japanese_latin-600.woff2']),
      bold: resolveFirst(['public/fonts/noto-sans-jp-700.ttf', 'public/fonts/noto-sans-jp-v54-japanese_latin-700.woff2']),
    }

    const fontCss = buildMultiWeightFontCss('Noto Sans JP', fontPaths)
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

function buildMultiWeightFontCss(family: string, paths: { regular?: string; medium?: string; semibold?: string; bold?: string }) {
  const fontFaces: string[] = []

  const addFontFace = (path: string | undefined, weight: number) => {
    if (!path) return
    const data = fs.readFileSync(path)
    const ext = path.split('.').pop()?.toLowerCase()
    const format = ext === 'woff2' ? 'woff2' : ext === 'ttf' ? 'truetype' : 'woff2'
    const mimeType = ext === 'ttf' ? 'font/ttf' : 'font/woff2'
    const uri = toDataUri(data, mimeType)
    fontFaces.push(`@font-face { font-family: '${family}'; src: url(${uri}) format('${format}'); font-weight: ${weight}; font-style: normal; font-display: swap; }`)
  }

  addFontFace(paths.regular, 400)
  addFontFace(paths.medium, 500)
  addFontFace(paths.semibold, 600)
  addFontFace(paths.bold, 700)

  // If no fonts found, return undefined to use system fonts
  return fontFaces.length > 0 ? fontFaces.join('\n') : undefined
}
