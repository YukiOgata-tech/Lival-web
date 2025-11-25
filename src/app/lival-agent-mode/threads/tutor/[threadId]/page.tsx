'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Loader2 } from 'lucide-react'
import TutorInputBar from '@/components/agent/tutor/TutorInputBar'
import TutorChatMessageView, { type TutorChatMessage, type TutorTag, RetryPayload } from '@/components/agent/tutor/TutorChatMessage'
import LottieLoader from '@/components/agent/common/LottieLoader'
import TutorReportModal from '@/components/agent/tutor/TutorReportModal'
import TutorChatHeader from '@/components/agent/tutor/TutorChatHeader'
import { useTutorChat } from '@/hooks/useTutorChat'

export default function TutorThreadPage() {
  const params = useParams<{ threadId: string }>()
  const threadId = params?.threadId || ''
  const { messages, status, error, sendMessage, generateReport, authLoading, user, quality, setQuality } = useTutorChat(threadId)

  const [toast, setToast] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEngine, setReportEngine] = useState<'gpt' | 'gemini'>('gpt')
  const [reportPreview, setReportPreview] = useState<{ text: string; title: string; engine?: 'gpt' | 'gemini' } | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleGenerateReport = async (engine: 'gpt' | 'gemini') => {
    const { error } = await generateReport(engine);
    if (error) {
      setToast(error);
    } else {
      setToast('レポートを作成しました');
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, status])

  // Event listener for report modal
  useEffect(() => {
    const handler = () => setReportOpen(true)
    window.addEventListener('tutor-open-report-modal', handler as EventListener)
    return () => window.removeEventListener('tutor-open-report-modal', handler as EventListener)
  }, [])

  if (authLoading || status === 'loading') {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <LottieLoader size={60} />
        </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border bg-white p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">ログインが必要です</h2>
          <p className="mb-6 text-gray-600">Tutor AI を利用するにはログインまたは新規登録してください。</p>
          <div className="flex justify-center gap-3">
            <a href="/login" className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">ログイン</a>
            <a href="/signup" className="rounded-md border px-4 py-2 hover:bg-gray-50">新規登録</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-7xl bg-gradient-to-b from-emerald-50/30 via-white to-teal-50/20">
      {/* Header with quality selector */}
      <TutorChatHeader quality={quality} setQuality={setQuality} />

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1 }}
          className="select-none"
        >
          <Image
            src="/images/header-livalAI.png"
            alt="LIVAL AI"
            width={400}
            height={100}
            className="max-w-sm w-auto h-auto"
            priority
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed right-4 top-20 z-50 rounded-xl border border-emerald-300 bg-white/95 backdrop-blur-sm px-4 py-3 text-sm text-emerald-700 shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed left-1/2 -translate-x-1/2 top-20 z-50 rounded-xl border border-red-300 bg-red-50/95 backdrop-blur-sm px-4 py-3 text-sm text-red-800 shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-3xl space-y-4 p-4 pb-24 sm:pb-32">
        {messages.map((m) => (
          <TutorChatMessageView
            key={m.id}
            msg={m}
            enableTagging
            uid={user?.uid ?? null}
            threadId={threadId || null}
            onRetry={(payload) => sendMessage(payload)}
            onOpenReport={(p)=> setReportPreview(p)}
          />
        ))}
        {(status === 'receiving' || status === 'generating_report') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex-shrink-0 mt-1"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
                <span className="text-gray-700 font-medium">
                  {status === 'receiving' ? '回答を作成中…' : 'レポートを作成中…'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-20" />
      </div>

      <TutorInputBar disabled={status === 'receiving' || status === 'generating_report'} onSend={sendMessage} />

      <AnimatePresence>
        {reportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setReportOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="mb-2 text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  レポートを作成
                </h3>
                <p className="mb-4 text-sm text-gray-600">エンジンを選択し、タグ付きメッセージを元に要約レポートを生成します。</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-4"
              >
                <div className="mb-2 text-sm font-semibold text-gray-700">エンジン選択</div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReportEngine('gpt')}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${reportEngine==='gpt' ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}
                  >
                    GPT
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReportEngine('gemini')}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${reportEngine==='gemini' ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}
                  >
                    Gemini
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 rounded-xl bg-gradient-to-br from-gray-50 to-emerald-50 p-4 border border-gray-200"
              >
                <div className="mb-2 text-sm font-semibold text-gray-800">
                  このスレッドのタグ付きメッセージ数:
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    {messages.filter(m => (m.tags||[]).length>0).length}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    重要: <code className="rounded-md bg-white px-2 py-0.5 text-xs border">important</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">📚</span>
                    暗記: <code className="rounded-md bg-white px-2 py-0.5 text-xs border">memorize</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    確認: <code className="rounded-md bg-white px-2 py-0.5 text-xs border">check</code>
                  </li>
                </ul>
                <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-2 text-xs text-blue-800">
                  💡 ヒント: 大事な要点や覚えたい定義には <b>important/memorize</b>、あとで検算・見直ししたい部分には <b>check</b> を付けると、より使えるレポートになります。
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex justify-end gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setReportOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  キャンセル
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setReportOpen(false); handleGenerateReport(reportEngine); }}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  作成する
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {reportPreview && (
        <TutorReportModal open={true} onClose={() => setReportPreview(null)} reportText={reportPreview.text} title={reportPreview.title} onDownloaded={(kind)=> setToast(kind==='pdf'?'PDFを保存しました':'画像を書き出しました')} />
      )}
    </div>
  )
}
