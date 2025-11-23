'use client'

import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'

export default function PlanDetailModal({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: { text?: string; plan?: any; versionLabel?: string } | null
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [variant, setVariant] = useState<'mobile' | 'desktop'>('mobile')

  if (!open || !data) return null

  const fileBase = () => {
    const d = new Date()
    const pad = (n: number) => `${n}`.padStart(2, '0')
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-LIVAL`
  }

  // オフスクリーンDOM（oklch回避・一貫配色・ウォーターマーク付与）
  const buildOffscreenNode = (opts?: { includePlanJson?: boolean }) => {
    const node = document.createElement('div')
    const width = variant === 'mobile' ? 420 : 900
    node.style.position = 'fixed'
    node.style.left = '-99999px'
    node.style.top = '0'
    node.style.width = `${width}px`
    node.style.background = '#ffffff'
    node.style.color = '#111111'
    node.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif'
    node.style.padding = '16px'
    node.style.border = '1px solid #e5e7eb'
    node.style.borderRadius = '12px'
    node.style.boxSizing = 'border-box'
    node.style.overflow = 'hidden'

    const wmWrap = document.createElement('div')
    wmWrap.style.position = 'absolute'
    wmWrap.style.inset = '0'
    wmWrap.style.display = 'flex'
    wmWrap.style.alignItems = 'center'
    wmWrap.style.justifyContent = 'center'
    wmWrap.style.pointerEvents = 'none'
    wmWrap.style.opacity = '0.4'
    const wmImg = document.createElement('img')
    wmImg.src = '/images/Lival-text.png'
    wmImg.alt = 'Lival watermark'
    wmImg.style.maxWidth = '40%'
    wmWrap.appendChild(wmImg)
    node.appendChild(wmWrap)

    const container = document.createElement('div')
    container.style.position = 'relative'
    node.appendChild(container)

    const title = document.createElement('div')
    title.style.fontSize = '12px'
    title.style.color = '#1d4ed8'
    if (data?.versionLabel) title.textContent = data.versionLabel
    container.appendChild(title)

    const text = document.createElement('div')
    text.style.whiteSpace = 'pre-wrap'
    text.style.fontSize = '14px'
    text.style.lineHeight = '1.6'
    text.style.color = '#111111'
    text.textContent = data?.text || ''
    container.appendChild(text)

    if (data?.plan && (opts?.includePlanJson ?? true)) {
      const box = document.createElement('div')
      box.style.marginTop = '12px'
      box.style.background = '#f3f4f6'
      box.style.padding = '12px'
      box.style.borderRadius = '8px'
      box.style.color = '#374151'
      const head = document.createElement('div')
      head.style.fontSize = '12px'
      head.style.fontWeight = '600'
      head.textContent = '構造化プラン（概要）'
      box.appendChild(head)
      const pre = document.createElement('pre')
      pre.style.whiteSpace = 'pre-wrap'
      pre.style.maxHeight = '240px'
      pre.style.overflow = 'auto'
      pre.textContent = JSON.stringify({
        horizonDays: data.plan.horizonDays,
        dailyBudgetMin: data.plan.dailyBudgetMin,
        dailyTemplate: data.plan.dailyTemplate?.slice?.(0, 5),
        notes: data.plan.notes?.slice?.(0, 4),
      }, null, 2)
      box.appendChild(pre)
      container.appendChild(box)
    }

    const footer = document.createElement('div')
    footer.style.marginTop = '24px'
    footer.style.textAlign = 'center'
    footer.style.fontSize = '10px'
    footer.style.color = '#6b7280'
    footer.textContent = 'created by Lival-AI'
    container.appendChild(footer)
    return node
  }

  const exportImage = async () => {
    const node = buildOffscreenNode({ includePlanJson: true })
    document.body.appendChild(node)
    const canvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2, useCORS: true })
    document.body.removeChild(node)
    canvas.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${fileBase()}.jpg`
      a.click()
      URL.revokeObjectURL(a.href)
    }, 'image/jpeg', 0.95)
  }

  // Tailwind v4が採用する oklch カラー関数により html2canvas が失敗するのを回避するため、
  // PDF 生成時は簡易なオフスクリーンDOM（インラインHEX色）でレンダリングして画像化する。
  const exportPdf = async () => {
    // オフスクリーンDOMからJPEGを取得
    const node = buildOffscreenNode({ includePlanJson: false })
    document.body.appendChild(node)
    const canvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2, useCORS: true })
    document.body.removeChild(node)
    const jpegUrl = canvas.toDataURL('image/jpeg', 0.95)

    // jsPDF を動的インポートしてPDFに貼り付け
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * pageWidth) / canvas.width
    const scale = Math.min(1, pageHeight / imgHeight)
    const drawWidth = imgWidth * scale
    const drawHeight = imgHeight * scale
    const offsetY = (pageHeight - drawHeight) / 2
    doc.addImage(jpegUrl, 'JPEG', 0, Math.max(0, offsetY), drawWidth, drawHeight)
    doc.save(`${fileBase()}.pdf`)
  }

  // jsPDFを使用するため、追加のローレベル実装は不要になりました

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" onClick={onBackdrop}>
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold text-black">プラン詳細</div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-300 text-black">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>

        {/* キャプチャ対象 */}
        <div className="max-h-[70vh] overflow-auto p-0">
          <div
            ref={ref}
            className={`relative mx-auto my-4 w-[360px] rounded-lg border bg-white p-4 sm:w-[720px] ${
              variant === 'mobile' ? 'sm:w-[420px]' : 'sm:w-[900px]'
            }`}
          >
            {/* ウォーターマーク */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
              <img src="/images/Lival-text.png" alt="Lival watermark" className="max-w-[40%]" />
            </div>

            {/* 本文 */}
            <div className="relative">
              {data.versionLabel && (
                <div className="mb-2 text-xs text-blue-700">{data.versionLabel}</div>
              )}
              <div className="text-sm leading-6 text-gray-900">
                <MarkdownMessage text={data.text || ''} />
              </div>
              {data.plan && (
                <div className="mt-3 rounded-md bg-gray-50 p-3 text-xs text-gray-700">
                  <div className="mb-1 font-medium">構造化プラン（概要）</div>
                  <pre className="max-h-60 overflow-auto whitespace-pre-wrap">
{JSON.stringify({
  horizonDays: data.plan.horizonDays,
  dailyBudgetMin: data.plan.dailyBudgetMin,
  dailyTemplate: data.plan.dailyTemplate?.slice?.(0, 5),
  notes: data.plan.notes?.slice?.(0, 4),
}, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-6 text-center text-[10px] text-gray-500">created by Lival-AI</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">レイアウト:</span>
            <button
              className={`rounded px-2 py-1 ${variant === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setVariant('mobile')}
            >モバイル</button>
            <button
              className={`rounded px-2 py-1 ${variant === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setVariant('desktop')}
            >PC</button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">閉じる</button>
            <button onClick={exportImage} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">画像（JPG）</button>
            <button onClick={exportPng} className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800">画像（PNG）</button>
            <button onClick={exportPdf} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">PDF</button>
          </div>
        </div>
      </div>
    </div>
  )
}
