'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import LottieLoader from '@/components/agent/common/LottieLoader'

export default function TutorReportModal({
  open,
  onClose,
  reportText,
  title = 'Tutorレポート',
  onDownloaded,
}: {
  open: boolean
  onClose: () => void
  reportText: string
  title?: string
  onDownloaded?: (kind: 'pdf' | 'image') => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [downloading, setDownloading] = useState<null | 'pdf' | 'image'>(null)

  const downloadImage = async () => {
    if (!ref.current) return
    setDownloading('image')
    try {
      const canvas = await html2canvas(ref.current, { backgroundColor: '#ffffff', scale: 2 })
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${title}.jpg`
      a.click()
      onDownloaded?.('image')
    } finally {
      setDownloading(null)
    }
  }

  const downloadPDF = async () => {
    if (!ref.current) return
    setDownloading('pdf')
    try {
      const canvas = await html2canvas(ref.current, { backgroundColor: '#ffffff', scale: 2 })
      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${title}.pdf`)
      onDownloaded?.('pdf')
    } finally {
      setDownloading(null)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="text-sm font-semibold text-gray-900">レポートプレビュー</div>
            <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="閉じる">✕</button>
          </div>
          <div className="max-h-[70vh] overflow-auto p-4">
            <div ref={ref} className="mx-auto max-w-2xl whitespace-pre-wrap rounded-lg border bg-white p-6 text-gray-900">
              {/* ウォーターマーク */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-40">
                <img src="/images/Lival-text.png" alt="Lival" className="w-64 select-none" />
              </div>
              <h2 className="mb-4 text-xl font-bold">{title}</h2>
              <div className="text-sm leading-relaxed">
                {reportText}
              </div>
              <div className="mt-8 text-right text-xs text-gray-500">
                created by Lival AI tutor
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t p-3">
            <button onClick={downloadImage} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">画像で保存</button>
            <button onClick={downloadPDF} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">PDFで保存</button>
          </div>
          {downloading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-3 shadow">
                <LottieLoader size={32} />
                <span className="text-sm text-gray-800">{downloading === 'pdf' ? 'PDFを生成しています…' : '画像を書き出しています…'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

