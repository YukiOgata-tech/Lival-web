/**
 * Tutor AI Cloud Run API Client
 * ストリーミングレスポンスをServer-Sent Events (SSE)で受信
 */

const TUTOR_API_BASE = process.env.NEXT_PUBLIC_TUTOR_API_BASE || 'https://tutor-api-455840687099.asia-northeast1.run.app'

export type TutorStreamEvent =
  | { type: 'meta'; subject?: string; model?: string }
  | { type: 'content'; text: string }
  | { type: 'done'; full_text: string; subject?: string; usage?: any; latency_ms?: number }
  | { type: 'error'; message: string }

export type TutorChatStreamOptions = {
  threadId: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  storageUrls?: string[]
  quality?: 'fast' | 'standard' | 'thinking'
  idToken: string
  onEvent: (event: TutorStreamEvent) => void
  onError?: (error: Error) => void
  onComplete?: () => void
}

/**
 * Tutor AI Chat Streaming
 * Cloud Run `/v1/tutor/chat/stream` エンドポイントを呼び出す
 */
export async function callTutorChatStream(options: TutorChatStreamOptions): Promise<void> {
  const { threadId, messages, storageUrls, quality, idToken, onEvent, onError, onComplete } = options

  const payload = {
    threadId,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    images: storageUrls || [],
    quality: quality || 'fast',
  }

  try {
    const response = await fetch(`${TUTOR_API_BASE}/v1/tutor/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onComplete?.()
        break
      }

      // チャンクをバッファに追加
      buffer += decoder.decode(value, { stream: true })

      // SSE形式のメッセージを解析（複数行ある場合がある）
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 最後の不完全な行を保持

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (!data) continue

          try {
            const event = JSON.parse(data) as TutorStreamEvent
            onEvent(event)
          } catch (e) {
            console.error('[TutorStreamClient] Failed to parse event:', data, e)
          }
        }
      }
    }
  } catch (error) {
    console.error('[TutorStreamClient] Error:', error)
    onError?.(error as Error)
  }
}
