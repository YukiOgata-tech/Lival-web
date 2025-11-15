import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  try {
    const { adminAuth } = await import('@/lib/firebase/admin')
    // Verify Firebase ID token from Authorization header
    const authz = req.headers.get('authorization') || ''
    const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
    if (!token) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
    let uid: string | null = null
    try {
      const decoded = await adminAuth.verifyIdToken(token)
      uid = decoded.uid
    } catch {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }

    const { threadId, messages, images, storageUrls, quality } = (await req.json().catch(() => ({}))) as {
      threadId?: string
      messages?: ChatMessage[]
      images?: string[]
      storageUrls?: string[]
      quality?: 'fast' | 'standard' | 'thinking'
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 })
    }

    const base = process.env.TUTOR_API_BASE
    if (!base) {
      return NextResponse.json({ ok: false, error: 'missing_api_base' }, { status: 500 })
    }

    const url = `${base.replace(/\/$/, '')}/v1/tutor/chat`
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 25_000)
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'x-request-id': requestId,
    }
    if (process.env.TUTOR_API_KEY) headers['x-api-key'] = process.env.TUTOR_API_KEY!
    // Forward Firebase ID token to Cloud Run (FastAPI) for verification
    headers['authorization'] = authz

    // New FastAPI backend expects ChatRequest shape
    const body = JSON.stringify({
      threadId: threadId || '',
      messages: messages || [],
      images: storageUrls || images || [],
      quality: quality || undefined,
      hasUsedImagesInThread: !!((storageUrls && storageUrls.length) || (images && images.length)),
    })

    let resp: Response
    try {
      resp = await fetch(url, { method: 'POST', headers, body, signal: ctrl.signal })
    } catch (err) {
      clearTimeout(timeout)
      // one quick retry
      try {
        resp = await fetch(url, { method: 'POST', headers, body, signal: ctrl.signal })
      } catch (e2) {
        return NextResponse.json({ ok: false, error: 'upstream_unreachable' }, { status: 502 })
      }
    } finally {
      clearTimeout(timeout)
    }

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      return NextResponse.json({ ok: false, error: 'upstream_error', status: resp.status, detail: text?.slice(0, 400) }, { status: 502 })
    }

    const data = (await resp.json().catch(() => ({}))) as { text?: string }
    if (!data?.text) {
      return NextResponse.json({ ok: false, error: 'bad_response' }, { status: 502 })
    }
    return NextResponse.json({ ok: true, text: data.text })
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
