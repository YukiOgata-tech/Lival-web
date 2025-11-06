'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, FileImage, X, Sparkles } from 'lucide-react'
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  レポートプレビュー
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="max-h-[70vh] overflow-auto p-6"
              >
                <div ref={ref} className="relative mx-auto max-w-2xl whitespace-pre-wrap rounded-xl border border-gray-200 bg-white p-8 text-gray-900 shadow-sm">
                  {/* ウォーターマーク */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                    <img src="/images/Lival-text.png" alt="Lival" className="w-96 select-none" />
                  </div>
                  <h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  <div className="text-sm leading-relaxed text-gray-700">
                    {reportText}
                  </div>
                  <div className="mt-8 flex items-center justify-end gap-2 text-xs text-gray-400">
                    <Sparkles className="w-3 h-3" />
                    <span>created by Lival AI tutor</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-2xl"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadImage}
                  disabled={!!downloading}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileImage className="w-4 h-4" />
                  画像で保存
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadPDF}
                  disabled={!!downloading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  PDFで保存
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {downloading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-white px-8 py-6 shadow-2xl"
                    >
                      <LottieLoader size={48} />
                      <span className="text-sm font-medium text-gray-800">
                        {downloading === 'pdf' ? 'PDFを生成しています…' : '画像を書き出しています…'}
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

