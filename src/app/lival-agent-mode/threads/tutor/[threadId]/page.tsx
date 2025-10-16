'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import TutorInputBar from '@/components/agent/tutor/TutorInputBar'
import TutorChatMessageView, { type TutorChatMessage, type TutorTag, RetryPayload } from '@/components/agent/tutor/TutorChatMessage'
import LottieLoader from '@/components/agent/common/LottieLoader'
import TutorReportModal from '@/components/agent/tutor/TutorReportModal'
import { useTutorChat } from '@/hooks/useTutorChat'

export default function TutorThreadPage() {
  const params = useParams<{ threadId: string }>()
  const threadId = params?.threadId || ''
  const { messages, status, error, sendMessage, generateReport, authLoading, user } = useTutorChat(threadId)

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
    <div className="relative mx-auto min-h-[100dvh] max-w-7xl">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="opacity-[0.8] select-none">
          <Image 
            src="/images/header-livalAI.png" 
            alt="LIVAL AI" 
            width={400}
            height={100}
            className="max-w-sm w-auto h-auto"
            priority
          />
        </div>
      </div>
      
      {toast && (
        <div className="pointer-events-none fixed right-4 top-16 z-50 rounded-md border border-emerald-200 bg-white/95 px-3 py-2 text-sm text-emerald-700 shadow-md">{toast}</div>
      )}
      {error && (
        <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-16 z-50 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-800 shadow-md">{error}</div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl space-y-3 p-4 pb-32 sm:pb-40">
        {messages.map((m) => (
          <div key={m.id} className="animate-fade-in">
            <TutorChatMessageView 
              msg={m} 
              enableTagging 
              uid={user?.uid ?? null} 
              threadId={threadId || null} 
              onRetry={(payload) => sendMessage(payload)} 
              onOpenReport={(p)=> setReportPreview(p)} 
            />
          </div>
        ))}
        {(status === 'receiving' || status === 'generating_report') && (
          <div className="my-2 flex items-center gap-2 text-gray-600">
            <div className="max-w-[80%] rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2"><LottieLoader size={28} /><span className="text-gray-700">{status === 'receiving' ? '回答を作成中…' : 'レポートを作成中…'}</span></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-20" />
      </div>

      <TutorInputBar disabled={status === 'receiving' || status === 'generating_report'} onSend={sendMessage} />

      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setReportOpen(false)} />
          <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">レポートを作成</h3>
            <p className="mb-3 text-sm text-gray-600">エンジンを選択し、タグ付きメッセージを元に要約レポートを生成します。</p>
            <div className="mb-3">
              <div className="mb-1 text-xs font-medium text-gray-700">エンジン選択</div>
              <div className="flex gap-2">
                <button onClick={() => setReportEngine('gpt')} className={`rounded-md border px-3 py-1.5 text-xs ${reportEngine==='gpt' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>GPT</button>
                <button onClick={() => setReportEngine('gemini')} className={`rounded-md border px-3 py-1.5 text-xs ${reportEngine==='gemini' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Gemini</button>
              </div>
            </div>
            <div className="mb-3 rounded-md bg-gray-50 p-3 text-sm">
              <div className="mb-1 text-gray-800">このスレッドのタグ付きメッセージ数: <span className="font-semibold">{messages.filter(m => (m.tags||[]).length>0).length}</span></div>
              <ul className="list-disc pl-5 text-gray-600">
                <li>重要: <code className="rounded bg-white px-1">important</code></li>
                <li>暗記: <code className="rounded bg-white px-1">memorize</code></li>
                <li>確認: <code className="rounded bg-white px-1">check</code></li>
              </ul>
              <div className="mt-2 text-xs text-gray-500">ヒント: 大事な要点や覚えたい定義には <b>important/memorize</b>、あとで検算・見直ししたい部分には <b>check</b> を付けると、より使えるレポートになります。</div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setReportOpen(false)} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={() => { setReportOpen(false); handleGenerateReport(reportEngine); }} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">作成する</button>
            </div>
          </div>
        </div>
      )}
      {reportPreview && (
        <TutorReportModal open={true} onClose={() => setReportPreview(null)} reportText={reportPreview.text} title={reportPreview.title} onDownloaded={(kind)=> setToast(kind==='pdf'?'PDFを保存しました':'画像を書き出しました')} />
      )}
    </div>
  )
}
