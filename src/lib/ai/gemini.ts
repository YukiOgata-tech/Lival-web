// src/lib/ai/gemini.ts
// Firebase AI (Vertex AI) のクライアントサイド呼び出し
// 依存: @firebase/vertexai

import app from '@/lib/firebase'
import { getVertexAI, getGenerativeModel } from '@firebase/vertexai'

export type TaggedMsg = { role: 'user' | 'assistant'; content: string; tags?: string[]; at?: number }

const DEFAULT_MODEL = 'gemini-1.5-flash'

export async function generateTutorReportWithGemini(params: {
  threadId: string
  taggedMessages: TaggedMsg[]
  focus?: Array<'important' | 'memorize' | 'review'>
  model?: string
}): Promise<string> {
  const vertex = getVertexAI(app)
  const model = getGenerativeModel(vertex, { model: params.model || DEFAULT_MODEL })

  const sys = `あなたは家庭教師AIです。次のタグ付きメッセージだけをもとに、復習レポートを日本語で作成してください。
- important: 重要点の要約
- memorize: 暗記のポイント（箇条書き）
- review: 復習課題（ステップ, 目安時間付き）
出力構成: 見出し/要約/暗記ポイント/復習計画。数式はTeX(\\( \\) / $$ $$)で出力。コードフェンス禁止。`

  const focus = params.focus && params.focus.length > 0 ? params.focus : ['important', 'memorize', 'review']
  const content = params.taggedMessages
    .filter((m) => (m.tags || []).some((t) => focus.includes(t as any)))
    .map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.content}`)
    .join('\n')

  const prompt = `${sys}\n\n<messages>\n${content}\n</messages>`

  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
  const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text.trim()
}
