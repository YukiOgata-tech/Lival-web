'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db, functions } from '@/lib/firebase'
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { TutorChatMessage, RetryPayload, TutorTag } from '@/components/agent/tutor/TutorChatMessage'
import { uploadTutorImageWeb } from '@/lib/tutorImageStorage'
import { recognizeMultiple } from '@/lib/ocr/recognize'
import { tutorCategorize } from '@/lib/agent/tutor/categorize'
import { generateTutorReportWithGemini } from '@/lib/ai/gemini'

export type ChatStatus = 'idle' | 'loading' | 'error' | 'receiving' | 'generating_report'

function messagesKey(uid: string | null, threadId: string) {
  return `lival_tutor_messages_${uid ?? 'guest'}_${threadId}`
}

export function useTutorChat(threadId: string) {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<TutorChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  const persistMessages = useCallback((updatedMessages: TutorChatMessage[]) => {
    setMessages(updatedMessages)
    if (threadId && user) {
      const sanitized = updatedMessages.map(({ animate, retryPayload, ...rest }) => rest)
      localStorage.setItem(messagesKey(user.uid, threadId), JSON.stringify(sanitized))
    }
  }, [threadId, user]);

  // Initial message loading
  useEffect(() => {
    if (authLoading || !threadId || !user) return
    const loadMessages = async () => {
      setStatus('loading')
      const cachedRaw = localStorage.getItem(messagesKey(user.uid, threadId))
      if (cachedRaw) {
        const cachedMessages = JSON.parse(cachedRaw).map((m: any) => ({ ...m, status: 'sent' }))
        persistMessages(cachedMessages)
      }
      try {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
        await setDoc(threadRef, { id: threadId, title: 'Tutor スレッド', agent: 'tutor', archived: false, updatedAt: serverTimestamp() }, { merge: true })
        const col = collection(threadRef, 'messages')
        const q = query(col, orderBy('createdAt', 'asc'), limit(50))
        const snap = await getDocs(q)
        if (!snap.empty) {
          const remoteMessages = snap.docs.map(d => {
            const v = d.data()
            const base: TutorChatMessage = { id: d.id, fsId: d.id, role: v.role, content: v.content, createdAt: v.createdAt?.toMillis?.() || Date.now(), hasImage: !!v.hasImage, imageStorageUrls: v.imageStorageUrls || [], tags: v.tags || [], status: 'sent' }
            if (v.kind === 'report_log') { base.type = 'report_log'; base.reportEngine = v.reportEngine; base.reportTextContent = v.reportTextContent; base.reportTitle = v.reportTitle; }
            return base
          })
          persistMessages(remoteMessages)
        }
      } catch (e) {
        console.error("Failed to fetch messages from Firestore:", e)
        setError("過去のメッセージの読み込みに失敗しました。")
      }
      setStatus('idle')
    }
    loadMessages()
  }, [authLoading, user, threadId, persistMessages])

  const saveMessageToFirestore = async (message: TutorChatMessage) => {
    if (!user || !threadId) return null;
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
        };
        // Clean undefined fields before sending to Firestore
        Object.keys(docData).forEach(key => {
            if (docData[key] === undefined) {
                delete docData[key];
            }
        });

        const newMsgRef = doc(col);
        const batch = writeBatch(db);
        batch.set(newMsgRef, docData);
        batch.update(threadRef, { updatedAt: serverTimestamp() });
        await batch.commit();
        return newMsgRef.id;
    } catch (e) {
        console.error("Failed to save message to Firestore:", e);
        setError('メッセージの保存に失敗しました。');
        return null;
    }
  };

  const sendMessage = useCallback(async (payload: RetryPayload) => {
    if (!user || !threadId) { setError("ユーザー認証が完了していません。"); return; }

    setStatus('receiving');
    setError(null);

    const { text, files, images: payloadImages } = payload;
    const userMessageId = crypto.randomUUID();
    const aiMessageId = crypto.randomUUID();

    const userMsg: TutorChatMessage = { id: userMessageId, role: 'user', content: text || '画像を送信しました', createdAt: Date.now(), hasImage: files.length > 0, status: 'sending', retryPayload: payload };
    const assistantPlaceholder: TutorChatMessage = { id: aiMessageId, role: 'assistant', content: '', createdAt: Date.now() + 1, status: 'sending' };
    
    const currentMessages = [...messages, userMsg, assistantPlaceholder];
    persistMessages(currentMessages);

    let finalAnswer = '';
    let success = false;

    try {
      let imageStorageUrls: string[] = [];
      if (files?.length) {
        const results = await Promise.all(files.map((f) => uploadTutorImageWeb(f, threadId, userMessageId)));
        imageStorageUrls = results.map(r => r.storageUrl);
      }
      const finalUserMessage = { ...userMsg, imageStorageUrls };
      persistMessages(currentMessages.map(m => m.id === userMessageId ? finalUserMessage : m));

      const historyForApi = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const apiPayload = { threadId, messages: [...historyForApi, { role: 'user' as const, content: userMsg.content }], storageUrls: imageStorageUrls };
      const token = await user.getIdToken();

      const res = await fetch('/api/tutor/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(apiPayload) });

      if (res.ok) {
        const data = await res.json();
        finalAnswer = data?.text || '回答を生成できませんでした。';
        success = true;
      } else {
        let ocrText = '';
        if (payloadImages?.length) ocrText = await recognizeMultiple(payloadImages);
        const fallbackText = ocrText ? `${text}\n\n【画像テキスト】\n${ocrText}` : text;
        const tutorText = httpsCallable(functions, 'tutorTextAnswer');
        const resp = await tutorText({ userText: fallbackText, history: historyForApi });
        finalAnswer = (resp.data as any)?.text || '回答を生成できませんでした。';
        success = true;
      }
    } catch (e) {
      console.error('[sendMessage] Error:', e);
      finalAnswer = 'エラーが発生しました。時間をおいて再試行してください。';
      success = false;
    }

    const userFsId = await saveMessageToFirestore(userMsg);
    const finalAiMessage: TutorChatMessage = { ...assistantPlaceholder, content: finalAnswer, status: success ? 'sent' : 'error', animate: success };
    const aiFsId = await saveMessageToFirestore(finalAiMessage);

    persistMessages(currentMessages.map(m => {
        if (m.id === userMessageId) return { ...m, status: success ? 'sent' : 'error', fsId: userFsId };
        if (m.id === aiMessageId) return { ...m, ...finalAiMessage, fsId: aiFsId };
        return m;
    }));

    setStatus('idle');
  }, [user, threadId, messages, persistMessages]);

  const generateReport = useCallback(async (engine: 'gpt' | 'gemini' = 'gpt') => {
    if (!user || !threadId) return { error: 'ユーザー認証が必要です' };
    const tagged = messages.filter(m => (m.tags || []).length > 0);
    if (tagged.length === 0) return { error: 'タグ付きメッセージがありません' };

    setStatus('generating_report');
    let reportText = '';
    let success = false;

    try {
      if (engine === 'gpt') {
        const fn = httpsCallable(functions, 'reportGenerater');
        const res = await fn({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), options: { focus: ['important','memorize','review'] } });
        reportText = (res.data as any)?.text || 'レポートの生成に失敗しました';
      } else {
        reportText = await generateTutorReportWithGemini({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), focus: ['important','memorize','review'], model: 'gemini-1.5-flash' });
      }
      success = true;
    } catch (e) {
      console.error('[generateReport] Error:', e);
      reportText = 'レポートの作成中にエラーが発生しました。';
      success = false;
    }

    const reportMsg: TutorChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: 'report_log', createdAt: Date.now(), type: 'report_log', reportEngine: engine, reportTextContent: reportText, reportTitle: 'Tutorレポート', status: 'sent' };
    const reportFsId = await saveMessageToFirestore(reportMsg);
    persistMessages([...messages, { ...reportMsg, fsId: reportFsId }]);

    setStatus('idle');
    return { error: success ? null : reportText };
  }, [user, threadId, messages, persistMessages]);

  return { messages, status, error, sendMessage, generateReport, authLoading, user };
}
