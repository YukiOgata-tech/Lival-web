// src/lib/math/tex.ts
import katex from 'katex'
import DOMPurify from 'dompurify'

// コードフェンスや不正な要素を除去し、TeX 記法を KaTeX で描画した HTML を返す
// - ブロック: $$ ... $$
// - インライン: \( ... \)

export function renderTextWithMathToHtml(input: string): string {
  if (!input) return ''
  // コードフェンス禁止: ```...``` を除去
  let text = input.replace(/```[\s\S]*?```/g, '')

  // ブロック数式 $$...$$ を一旦置換
  const blockPattern = /\$\$([\s\S]+?)\$\$/g
  const blocks: string[] = []
  text = text.replace(blockPattern, (_m, expr: string) => {
    try {
      const html = katex.renderToString(expr, { displayMode: true, throwOnError: false, strict: 'warn' })
      blocks.push(html)
      return `__KATEX_BLOCK_${blocks.length - 1}__`
    } catch {
      return expr
    }
  })

  // インライン数式 \( ... \)
  const inlinePattern = /\\\((.+?)\\\)/g
  const inlines: string[] = []
  text = text.replace(inlinePattern, (_m, expr: string) => {
    try {
      const html = katex.renderToString(expr, { displayMode: false, throwOnError: false, strict: 'warn' })
      inlines.push(html)
      return `__KATEX_INLINE_${inlines.length - 1}__`
    } catch {
      return expr
    }
  })

  // 置換戻し
  let html = text
  inlines.forEach((h, i) => { html = html.replaceAll(`__KATEX_INLINE_${i}__`, h) })
  blocks.forEach((h, i) => { html = html.replaceAll(`__KATEX_BLOCK_${i}__`, h) })

  // サニタイズ
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

