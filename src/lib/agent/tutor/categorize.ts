// src/lib/agent/tutor/categorize.ts
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'

export type Pillar = 'science' | 'japanese' | 'english' | 'knowledge' | 'other'

export async function tutorCategorize(userText: string, ocrText: string, history?: Array<{ role: string; content: string }>): Promise<Pillar> {
  // 既定: 指定ドキュメントの関数名に合わせる（tutor-categorize.ts）
  // フォールバック: 既存の categorizeSubject
  try {
    const fn = httpsCallable(functions, 'tutorCategorize')
    const res = await fn({ userText, ocrText, history })
    const pillar = (res.data as any)?.pillar as Pillar | undefined
    if (pillar) return pillar
  } catch (e) {
    // 続行してフォールバック
  }
  const fallback = httpsCallable(functions, 'categorizeSubject')
  const fb = await fallback({ userText, ocrText, hasImage: true, history })
  const pillar = (fb.data as any)?.pillar as Pillar | undefined
  return pillar || 'knowledge'
}

