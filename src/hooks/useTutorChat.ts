'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db, functions } from '@/lib/firebase'
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { TutorChatMessage, RetryPayload, TutorTag } from '@/components/agent/tutor/TutorChatMessage'
import { uploadTutorImageWeb } from '@/lib/tutorImageStorage'
import { recognizeMultiple } from '@/lib/ocr/recognize'
import { tutorCategorize } from '@/lib/agent/tutor/categorize'
import { generateTutorReportWithGemini } from '@/lib/ai/gemini'
import { callTutorChatStream } from '@/lib/api/tutorCloudRunClient'

export type ChatStatus = 'idle' | 'loading' | 'error' | 'receiving' | 'generating_report'

function messagesKey(uid: string | null, threadId: string) {
  return `lival_tutor_messages_${uid ?? 'guest'}_${threadId}`
}

export function useTutorChat(threadId: string) {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<TutorChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState<'fast' | 'standard'>('fast')

  // 保存済みメッセージIDを追跡（重複保存防止）
  const savedMessageIds = useRef<Set<string>>(new Set())

  // localStorageに保存（Firestore保存とは独立）
  const saveToLocalStorage = useCallback((msgs: TutorChatMessage[]) => {
    if (threadId && user) {
      const sanitized = msgs.map(({ animate, retryPayload, ...rest }) => rest)
      localStorage.setItem(messagesKey(user.uid, threadId), JSON.stringify(sanitized))
    }
  }, [threadId, user])

  // Initial message loading
  useEffect(() => {
    if (authLoading || !threadId || !user) return

    let isMounted = true
    const loadMessages = async () => {
      setStatus('loading')

      // localStorageから読み込み
      const cachedRaw = localStorage.getItem(messagesKey(user.uid, threadId))
      if (cachedRaw && isMounted) {
        const cachedMessages = JSON.parse(cachedRaw).map((m: any) => ({ ...m, status: 'sent' }))
        setMessages(cachedMessages)
      }

      // Firestoreから読み込み
      try {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
        await setDoc(threadRef, { id: threadId, title: 'Tutor スレッド', agent: 'tutor', archived: false, updatedAt: serverTimestamp() }, { merge: true })
        const col = collection(threadRef, 'messages')
        const q = query(col, orderBy('createdAt', 'asc'), limit(50))
        const snap = await getDocs(q)

        if (!snap.empty && isMounted) {
          const remoteMessages = snap.docs.map(d => {
            const v = d.data()
            const base: TutorChatMessage = {
              id: d.id,
              fsId: d.id,
              role: v.role,
              content: v.content,
              createdAt: v.createdAt?.toMillis?.() || Date.now(),
              hasImage: !!v.hasImage,
              imageStorageUrls: v.imageStorageUrls || [],
              tags: v.tags || [],
              status: 'sent'
            }
            if (v.kind === 'report_log') {
              base.type = 'report_log'
              base.reportEngine = v.reportEngine
              base.reportTextContent = v.reportTextContent
              base.reportTitle = v.reportTitle
            }
            // Firestoreから読み込んだメッセージは保存済みとしてマーク
            savedMessageIds.current.add(d.id)
            return base
          })
          setMessages(remoteMessages)
          saveToLocalStorage(remoteMessages)
        }
      } catch (e) {
        console.error("Failed to fetch messages from Firestore:", e)
        if (isMounted) setError("過去のメッセージの読み込みに失敗しました。")
      }

      if (isMounted) setStatus('idle')
    }

    loadMessages()

    return () => { isMounted = false }
  }, [authLoading, user, threadId, saveToLocalStorage])

  const saveMessageToFirestore = async (message: TutorChatMessage): Promise<string | null> => {
    if (!user || !threadId) return null

    // 既に保存済みの場合はスキップ
    if (message.fsId && savedMessageIds.current.has(message.fsId)) {
      console.log('[useTutorChat] Message already saved, skipping:', message.fsId)
      return message.fsId
    }

    try {
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
      const col = collection(threadRef, 'messages')
      const docData: any = {
        role: message.role,
        agent: 'tutor',
        content: message.content,
        hasImage: !!message.hasImage,
        imageStorageUrls: message.imageStorageUrls || [],
        tags: message.tags || [],
        kind: message.type === 'report_log' ? 'report_log' : (message.role === 'user' ? 'ask' : 'chitchat'),
        createdAt: serverTimestamp(),
        reportEngine: message.reportEngine,
        reportTextContent: message.reportTextContent,
        reportTitle: message.reportTitle,
      }

      // Clean undefined fields
      Object.keys(docData).forEach(key => {
        if (docData[key] === undefined) {
          delete docData[key]
        }
      })

      const newMsgRef = doc(col)
      const batch = writeBatch(db)
      batch.set(newMsgRef, docData)
      batch.update(threadRef, { updatedAt: serverTimestamp() })
      await batch.commit()

      // 保存済みとしてマーク
      savedMessageIds.current.add(newMsgRef.id)
      console.log('[useTutorChat] Message saved to Firestore:', newMsgRef.id)

      return newMsgRef.id
    } catch (e) {
      console.error("Failed to save message to Firestore:", e)
      setError('メッセージの保存に失敗しました。')
      return null
    }
  }

  const sendMessage = useCallback(async (payload: RetryPayload) => {
    if (!user || !threadId) {
      setError("ユーザー認証が完了していません。")
      return
    }

    setStatus('receiving')
    setError(null)

    const { text, files, images: payloadImages } = payload
    const userMessageId = crypto.randomUUID()
    const aiMessageId = crypto.randomUUID()

    const userMsg: TutorChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text || '画像を送信しました',
      createdAt: Date.now(),
      hasImage: files.length > 0,
      status: 'sending',
      retryPayload: payload
    }
    const assistantPlaceholder: TutorChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now() + 1,
      status: 'sending',
      animate: true
    }

    // メッセージをUI追加
    setMessages(prev => [...prev, userMsg, assistantPlaceholder])

    let finalAnswer = ''
    let success = false
    let userMsgWithImages = userMsg

    // クライアント側でのタイピングアニメーション（キャッシュヒット時用）
    const animateTextOnClient = (fullText: string) => {
      const chunkSize = 15
      let currentIndex = 0

      const interval = setInterval(() => {
        currentIndex += chunkSize
        const displayText = fullText.slice(0, currentIndex)

        setMessages(prev => prev.map(m =>
          m.id === aiMessageId ? { ...m, content: displayText, animate: true, status: 'sending' } : m
        ))

        if (currentIndex >= fullText.length) {
          clearInterval(interval)
          setTimeout(() => {
            setMessages(prev => prev.map(m =>
              m.id === aiMessageId ? { ...m, content: fullText, animate: false, status: 'sent' } : m
            ))
          }, 150)
        }
      }, 20)
    }

    try {
      // 画像アップロード
      let imageStorageUrls: string[] = []
      if (files?.length) {
        const results = await Promise.all(files.map((f) => uploadTutorImageWeb(f, threadId, userMessageId)))
        imageStorageUrls = results.map(r => r.storageUrl)
        userMsgWithImages = { ...userMsg, imageStorageUrls }
        setMessages(prev => prev.map(m => m.id === userMessageId ? userMsgWithImages : m))
      }

      const historyForApi = messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
      const token = await user.getIdToken()

      let hasReceivedContent = false

      // ストリーミングAPI呼び出し
      await callTutorChatStream({
        threadId,
        messages: [...historyForApi, { role: 'user' as const, content: userMsg.content }],
        storageUrls: imageStorageUrls,
        quality,
        idToken: token,
        onEvent: (event) => {
          if (event.type === 'meta') {
            console.log('[TutorChat] Meta:', event)
          } else if (event.type === 'content') {
            hasReceivedContent = true
            finalAnswer += event.text
            setMessages(prev => prev.map(m =>
              m.id === aiMessageId ? { ...m, content: finalAnswer, animate: true, status: 'sending' } : m
            ))
          } else if (event.type === 'done') {
            finalAnswer = event.full_text || finalAnswer

            if (!hasReceivedContent) {
              console.log('[TutorChat] Cache hit detected - animating on client')
              animateTextOnClient(finalAnswer)
            } else {
              setTimeout(() => {
                setMessages(prev => prev.map(m =>
                  m.id === aiMessageId ? { ...m, content: finalAnswer, animate: false, status: 'sent' } : m
                ))
              }, 150)
            }
            success = true
          } else if (event.type === 'error') {
            throw new Error(event.message)
          }
        },
        onError: (error) => {
          console.error('[sendMessage] Stream error:', error)
          throw error
        },
      })

      success = true
    } catch (e) {
      console.error('[sendMessage] Error:', e)

      // フォールバック: Firebase Functions
      try {
        let ocrText = ''
        if (payloadImages?.length) ocrText = await recognizeMultiple(payloadImages)
        const fallbackText = ocrText ? `${text}\n\n【画像テキスト】\n${ocrText}` : text
        const tutorText = httpsCallable(functions, 'tutorTextAnswer')
        const resp = await tutorText({ userText: fallbackText, history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })) })
        finalAnswer = (resp.data as any)?.text || '回答を生成できませんでした。'
        success = true
      } catch (fallbackError) {
        console.error('[sendMessage] Fallback error:', fallbackError)
        finalAnswer = 'エラーが発生しました。時間をおいて再試行してください。'
        success = false
      }
    }

    // Firestoreに保存（一度だけ）
    const finalAiMessage: TutorChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: finalAnswer,
      createdAt: Date.now() + 2,
      status: success ? 'sent' : 'error',
      animate: false
    }

    // Debug: 詳細な数式変換ログ（送信完了時に1回のみ）
    if (process.env.NODE_ENV === 'development') {
      const blockMathMatches = finalAnswer.match(/\\\[[\s\S]*?\\\]/g)
      const inlineMathMatches = finalAnswer.match(/\\\(.*?\\\)/g)

      console.log('=== [TutorChat] Message completed ===')
      console.log('Content length:', finalAnswer.length)
      console.log('Found \\[...\\] patterns:', blockMathMatches?.length || 0)
      console.log('Found \\(...\\) patterns:', inlineMathMatches?.length || 0)

      if (blockMathMatches && blockMathMatches.length > 0) {
        console.log('\n--- Original block math ---')
        blockMathMatches.forEach((match, i) => {
          console.log(`Block ${i + 1}:`, match)
        })
      }

      // fixIncompleteLatexを適用してみる
      const testFixed = finalAnswer
        .replace(/\\\((.*?)\\\)/g, (match, content) => `$${content}$`)
        .replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => `$$${content}$$`)

      const fixedBlockMatches = testFixed.match(/\$\$[\s\S]*?\$\$/g)
      if (fixedBlockMatches && fixedBlockMatches.length > 0) {
        console.log('\n--- After conversion to $$ ---')
        fixedBlockMatches.forEach((match, i) => {
          console.log(`Fixed block ${i + 1}:`, match)
        })
      }
      console.log('=================================\n')
    }

    // ユーザーメッセージを保存
    const userFsId = await saveMessageToFirestore(userMsgWithImages)

    // AIメッセージを保存
    const aiFsId = await saveMessageToFirestore(finalAiMessage)

    // 最終的な状態を更新（一度だけ）
    setMessages(prev => {
      const updated = prev.map(m => {
        if (m.id === userMessageId) return { ...m, fsId: userFsId || undefined, status: 'sent' as const }
        if (m.id === aiMessageId) return { ...m, fsId: aiFsId || undefined, content: finalAnswer, status: success ? 'sent' as const : 'error' as const, animate: false }
        return m
      })

      // localStorageに保存
      saveToLocalStorage(updated)

      return updated
    })

    setStatus('idle')
  }, [user, threadId, messages, quality, saveToLocalStorage])

  const generateReport = useCallback(async (engine: 'gpt' | 'gemini' = 'gpt') => {
    if (!user || !threadId) return { error: 'ユーザー認証が必要です' }
    const tagged = messages.filter(m => (m.tags || []).length > 0)
    if (tagged.length === 0) return { error: 'タグ付きメッセージがありません' }

    setStatus('generating_report')
    let reportText = ''
    let success = false

    try {
      if (engine === 'gpt') {
        const fn = httpsCallable(functions, 'reportGenerater')
        const res = await fn({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), options: { focus: ['important','memorize','review'] } })
        reportText = (res.data as any)?.text || 'レポートの生成に失敗しました'
      } else {
        reportText = await generateTutorReportWithGemini({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), focus: ['important','memorize','review'], model: 'gemini-1.5-flash' })
      }
      success = true
    } catch (e) {
      console.error('[generateReport] Error:', e)
      reportText = 'レポートの作成中にエラーが発生しました。'
      success = false
    }

    const reportMsg: TutorChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'report_log',
      createdAt: Date.now(),
      type: 'report_log',
      reportEngine: engine,
      reportTextContent: reportText,
      reportTitle: 'Tutorレポート',
      status: 'sent'
    }

    const reportFsId = await saveMessageToFirestore(reportMsg)

    setMessages(prev => {
      const updated = [...prev, { ...reportMsg, fsId: reportFsId || undefined }]
      saveToLocalStorage(updated)
      return updated
    })

    setStatus('idle')
    return { error: success ? null : reportText }
  }, [user, threadId, messages, saveToLocalStorage])

  return { messages, status, error, sendMessage, generateReport, authLoading, user, quality, setQuality }
}
