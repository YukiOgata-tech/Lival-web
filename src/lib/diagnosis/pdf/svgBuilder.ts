import { DiagnosisResult } from '@/types/diagnosis'

type SvgBuildOptions = {
  fontCss?: string
  bgImageDataUri?: string // data:image/png;base64,...
}

export function buildDiagnosisSvg(result: DiagnosisResult, opts: SvgBuildOptions = {}) {
  const W = 794
  const H = 1123

  const type = result.primaryType
  const secondary = result.secondaryType

  const palette = getTypePalette(type.id)

  const sectionY: number[] = []
  let y = 0

  const headerH = 200
  y += headerH + 20
  sectionY.push(y)

  const metricsH = 120
  y += metricsH + 16
  sectionY.push(y)

  const charH = 250
  y += charH + 16
  sectionY.push(y)

  const detailH = 350
  y += detailH + 16
  sectionY.push(y)

  const aiH = 220
  y += aiH + 16

  const maxChars = 6
  const characteristics = (type.characteristics || []).slice(0, maxChars)
  const strengths = (type.strengths || []).slice(0, 5)
  const weak = (type.weaknesses || []).slice(0, 4)
  const rec = (type.recommendedStrategies || []).slice(0, 4)
  const aiLang = (type.aiCoachingStyle?.languagePatterns || []).slice(0, 4)

  const primaryTitle = esc(type.displayName)
  const scientific = esc(type.scientificName)
  const description = esc(type.description)

  const scoreEntries = Object.entries(result.scores || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const completedAt = toDate(result.completedAt)
  const dateStr = `${completedAt.getFullYear()}-${String(completedAt.getMonth() + 1).padStart(2, '0')}-${String(completedAt.getDate()).padStart(2, '0')}`

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.grad[0]}"/>
        <stop offset="100%" stop-color="${palette.grad[1]}"/>
      </linearGradient>
      <style>
        ${opts.fontCss || ''}
        text { font-synthesis: weight style; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
        .title { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 36px; font-weight: 700; fill: #0f172a; letter-spacing: 0.3px; }
        .subtitle { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 15px; font-weight: 500; fill: #334155; letter-spacing: 0.2px; }
        .body { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 14px; font-weight: 400; fill: #334155; letter-spacing: 0.2px; }
        .small { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 12px; font-weight: 400; fill: #64748b; letter-spacing: 0.15px; }
        .label { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 12px; font-weight: 500; fill: #475569; letter-spacing: 0.15px; }
        .metric { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 22px; font-weight: 700; fill: #0f172a; letter-spacing: 0.2px; }
        .cap { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; font-size: 18px; font-weight: 700; fill: #0f172a; letter-spacing: 0.2px; }
      </style>
    </defs>

    <rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>

    <!-- Soft background logo -->
    ${opts.bgImageDataUri ? `
      <g opacity="0.12">
        <image href="${opts.bgImageDataUri}" x="${(W - 620) / 2}" y="${(H - 620) / 2}" width="620" height="620" preserveAspectRatio="xMidYMid meet"/>
      </g>
    ` : ''}

    <rect x="0" y="0" width="${W}" height="${headerH}" fill="url(#g1)"/>
    <circle cx="${W - 70}" cy="40" r="32" fill="rgba(255,255,255,0.15)"/>
    <circle cx="70" cy="${headerH - 30}" r="22" fill="rgba(255,255,255,0.12)"/>
    <text x="40" y="54" class="subtitle" fill="#e2e8f0">LIVAL AI 学習タイプ診断</text>
    <text x="40" y="100" class="title" fill="#ffffff">${primaryTitle}</text>
    <text x="40" y="140" class="small" fill="#f1f5f9">${scientific}</text>
    <text x="${W - 200}" y="${headerH - 20}" class="small" fill="#e2e8f0">診断日: ${dateStr}</text>

    <g transform="translate(40, ${sectionY[0]})">
      <rect x="0" y="0" width="${W - 80}" height="88" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
      ${paragraph(description, 16, W - 120, 18, '#374151', 20)}
    </g>

    <g transform="translate(40, ${sectionY[1]})">
      ${metricBox(0, 0, 220, 100, '信頼度', result.confidence + '%', palette.accent)}
      ${metricBox(240, 0, 220, 100, '質問数', String(result.totalQuestions || 0), '#2563eb')}
      ${metricBox(480, 0, 220, 100, '所要時間', formatTime(result.responseTime), '#7c3aed')}
    </g>

    <g transform="translate(40, ${sectionY[2]})">
      <text x="0" y="0" class="cap">あなたの特徴</text>
      ${listBullets(characteristics, 0, 18, W - 420)}
      <g transform="translate(${W - 360}, -10)">
        <text x="0" y="18" class="cap">タイプスコア</text>
        ${scoreBars(scoreEntries)}
      </g>
    </g>

    <g transform="translate(40, ${sectionY[3]})">
      ${panel('🎯 あなたの強み', strengths, palette.soft)}
      <g transform="translate(${(W - 80) / 2 + 10}, 0)">
        ${panel('📚 効果的な学習方法', rec, '#eef2ff')}
      </g>
      <g transform="translate(0, 150)">
        ${panel('🌱 成長できる領域', weak, '#eff6ff')}
      </g>
    </g>

    <g transform="translate(40, ${sectionY[3] + 320})">
      <text x="0" y="0" class="cap">おすすめAIコーチングスタイル</text>
      <rect x="0" y="10" width="${W - 80}" height="170" rx="12" fill="#faf5ff" stroke="#ede9fe" />
      ${paragraph(esc(result.primaryType.aiCoachingStyle?.communicationStyle || ''), 30, (W - 120) / 2, 16, '#6d28d9', 16)}
      <text x="${(W - 80) / 2 + 20}" y="40" class="label">学習アプローチ</text>
      ${paragraph(esc(result.primaryType.aiCoachingStyle?.learningStyle || ''), 60, (W - 120) / 2 - 30, 16, '#334155', 16, (W - 80) / 2 + 20)}
      <text x="20" y="120" class="label">声かけ例</text>
      ${listInline(aiLang, 20, 140, W - 120)}
    </g>

    ${secondary ? `<g transform=\"translate(40, ${H - 170})\">
      <rect x=\"0\" y=\"0\" width=\"${W - 80}\" height=\"100\" rx=\"12\" fill=\"#f9fafb\" stroke=\"#e5e7eb\" />
      <text x=\"16\" y=\"28\" class=\"label\">サブタイプ</text>
      <text x=\"16\" y=\"56\" class=\"subtitle\">${esc(secondary.displayName)}</text>
      ${paragraph(esc(secondary.description), 78, W - 120, 16, '#4b5563', 16, 16)}
    </g>` : ''}

    <g transform="translate(0, ${H - 34})">
      <rect x="0" y="0" width="${W}" height="34" fill="#f8fafc"/>
      <text x="${W / 2}" y="22" class="small" text-anchor="middle">LIVAL AI | https://lival.ai</text>
    </g>
  </svg>`
}

export function paragraph(text: string, top: number, width: number, lineH: number, color = '#374151', maxLines = 0, left = 20) {
  const lines = wrap(text, width - 40)
  const used = maxLines > 0 ? lines.slice(0, maxLines) : lines
  return used
    .map((t, i) => `<text x="${left}" y="${top + i * lineH}" class="body" fill="${color}">${esc(t)}</text>`)
    .join('')
}

export function listBullets(items: string[], top: number, lineH: number, width: number) {
  return items
    .slice(0, 6)
    .map((t, i) => {
      const y = top + 26 + i * lineH
      const wrapped = wrap(t, width - 40).slice(0, 2)
      const first = `<circle cx="8" cy="${y - 4}" r="4" fill="#0ea5e9" />`
      const lines = wrapped
        .map((w, j) => `<text x="20" y="${y + j * 16}" class="body">${esc(w)}</text>`)
        .join('')
      return first + lines
    })
    .join('')
}

export function listInline(items: string[], x: number, y: number, width: number) {
  const paddings = 8
  let cx = x
  let cy = y
  const parts: string[] = []

  items.forEach((text) => {
    const label = `「${esc(text)}」`
    const w = Math.min(measure(label), width - 40)
    if (cx + w + 20 > width) {
      cx = x
      cy += 24
    }
    parts.push(
      `<g>
        <rect x="${cx}" y="${cy - 14}" rx="6" width="${w + paddings * 2}" height="24" fill="#fff" stroke="#e9d5ff" />
        <text x="${cx + paddings}" y="${cy + 3}" class="small" fill="#6b21a8">${label}</text>
      </g>`
    )
    cx += w + paddings * 2 + 10
  })

  return parts.join('')
}

export function scoreBars(entries: [string, number][]) {
  const maxVal = Math.max(1, ...entries.map((e) => e[1]))
  return entries
    .map((e, i) => {
      const [k, v] = e
      const width = Math.round((v / maxVal) * 240)
      const by = 30 + i * 28
      return `
        <text x="0" y="${by - 8}" class="small">${esc(k)}</text>
        <rect x="0" y="${by}" width="240" height="10" rx="5" fill="#e5e7eb"/>
        <rect x="0" y="${by}" width="${width}" height="10" rx="5" fill="#60a5fa"/>
      `
    })
    .join('')
}

export function panel(title: string, items: string[], bg: string) {
  const content = (items || []).slice(0, 5)
    .map((t, i) => `<text x="16" y="${50 + i * 20}" class="body">• ${esc(t)}</text>`)
    .join('')
  const half = (794 - 80) / 2 - 10
  return `
    <g>
      <rect x="0" y="0" width="${half}" height="140" rx="12" fill="${bg}" stroke="#e5e7eb" />
      <text x="16" y="26" class="label">${esc(title)}</text>
      ${content}
    </g>
  `
}

export function getTypePalette(typeId: string) {
  const map: Record<string, { grad: [string, string]; accent: string; soft: string }> = {
    explorer: { grad: ['#8B5CF6', '#3B82F6'], accent: '#7C3AED', soft: '#eff6ff' },
    strategist: { grad: ['#3B82F6', '#06B6D4'], accent: '#0284c7', soft: '#e0f2fe' },
    achiever: { grad: ['#10B981', '#059669'], accent: '#059669', soft: '#ecfdf5' },
    challenger: { grad: ['#EF4444', '#F97316'], accent: '#f97316', soft: '#fef2f2' },
    partner: { grad: ['#EC4899', '#F43F5E'], accent: '#f43f5e', soft: '#fdf2f8' },
    pragmatist: { grad: ['#F59E0B', '#EAB308'], accent: '#eab308', soft: '#fffbeb' },
  }
  return map[typeId] || map.explorer
}

export function wrap(text: string, max: number) {
  const words = (text || '').split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  words.forEach((w) => {
    const trial = current ? current + ' ' + w : w
    if (measure(trial) < max) {
      current = trial
    } else {
      if (current) lines.push(current)
      current = w
    }
  })
  if (current) lines.push(current)
  return lines
}

export function measure(text: string) {
  let w = 0
  for (const ch of text) {
    if (/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u.test(ch)) w += 14
    else if (/\s/.test(ch)) w += 4
    else w += 7
  }
  return w
}

export function formatTime(seconds: number) {
  const mins = Math.floor((seconds || 0) / 60)
  const secs = Math.max(0, (seconds || 0) % 60)
  return `${mins}分${secs}秒`
}

export function toDate(ts: any): Date {
  try {
    if (!ts) return new Date()
    if (typeof ts?.toMillis === 'function') return new Date(ts.toMillis())
    if (typeof ts?.seconds === 'number') {
      const ms = ts.seconds * 1000 + Math.round((ts.nanoseconds || 0) / 1_000_000)
      return new Date(ms)
    }
    if (typeof ts === 'number') return new Date(ts)
    return new Date()
  } catch {
    return new Date()
  }
}

export function esc(text: string) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function metricBox(x: number, y: number, w: number, h: number, label: string, value: string, color: string) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#f1f5f9" stroke="#e2e8f0" />
      <text x="${x + 16}" y="${y + 26}" class="label">${esc(label)}</text>
      <text x="${x + 16}" y="${y + 60}" class="metric" fill="${color}">${esc(value)}</text>
    </g>
  `
}
