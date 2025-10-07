import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// In-memory, very light rate limit (process lifetime). TODO: replace with durable store if厳密化
const rateMap = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60_000
const MAX_REQ_PER_WINDOW = 5

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  // honeypot & timing
  company: z.string().optional(), // legacy honeypot (should be empty)
  _hp: z.string().optional(), // current honeypot (should be empty)
  hv: z.string().optional(), // JS-set human validation token ('1' expected)
  startedAt: z.number().optional(),
})


function getClientIp(headers: Headers): string {
  const xfwd = headers.get('x-forwarded-for') || ''
  const ip = xfwd.split(',')[0]?.trim()
  return ip || headers.get('x-real-ip') || 'unknown'
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // allow when missing (non-browser or curl)
  try {
    const reqHost = new URL(request.url).host
    const originHost = new URL(origin).host
    return reqHost === originHost
  } catch {
    return false
  }
}

function buildHtml(params: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = params
  return `<!doctype html><html><body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#111;">
    <h2 style="margin:0 0 12px;">新しいお問い合わせ</h2>
    <p style="margin:0 0 4px;"><strong>件名:</strong> ${escapeHtml(subject)}</p>
    <p style="margin:0 0 4px;"><strong>お名前:</strong> ${escapeHtml(name)}</p>
    <p style="margin:0 0 12px;"><strong>メール:</strong> ${escapeHtml(email)}</p>
    <div style="padding:12px; background:#f6f7f9; border-radius:8px; white-space:pre-wrap;">${escapeHtml(message)}</div>
    <p style="margin-top:16px; font-size:12px; color:#555;">このメールはWebサイトの問い合わせフォームから送信されています。</p>
  </body></html>`
}

function buildText(params: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = params
  return [
    '新しいお問い合わせ',
    `件名: ${subject}`,
    `お名前: ${name}`,
    `メール: ${email}`,
    '',
    message,
    '',
    'このメールはWebサイトの問い合わせフォームから送信されています。',
  ].join('\n')
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function isValidFromFormat(input: string): boolean {
  const plainEmail = /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/
  const nameWithEmail = /^[^<>]+<\s*([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)\s*>$/
  return plainEmail.test(input) || nameWithEmail.test(input)
}

export async function POST(request: Request) {
  const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  try {
    if (!sameOrigin(request)) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    const ip = getClientIp(request.headers)
    const now = Date.now()
    // very light rate limit (best-effort)
    const key = ip
    const rec = rateMap.get(key)
    if (!rec || now - rec.ts > WINDOW_MS) {
      rateMap.set(key, { count: 1, ts: now })
    } else if (rec.count >= MAX_REQ_PER_WINDOW) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    } else {
      rec.count++
    }

    const json = await request.json().catch(() => null)
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      console.error('[contact] invalid_request', { requestId, issues: parsed.error.flatten() })
      return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 })
    }

    const { name, email, subject, message, company, _hp, hv, startedAt } = parsed.data

    // honeypot: 現在はブロックせず警告のみ（誤検知回避のため）
    if ((company && company.trim().length > 0) || (_hp && _hp.trim().length > 0)) {
      console.warn('[contact] honeypot_triggered', { requestId, ip })
      // 将来的に厳密化時はここで block を有効化
    }
    // min submit time (3s)
    if (!startedAt || now - startedAt < 3000) {
      console.warn('[contact] too_fast', { requestId, ip, delta: startedAt ? now - startedAt : null })
      return NextResponse.json({ ok: false, error: 'too_fast' }, { status: 400 })
    }
    // JS token is advisory: warn but do not block (reduce誤検知)
    if (hv !== '1') {
      console.warn('[contact] human_validation_missing', { requestId, ip })
    }

    const TO = process.env.CONTACT_TO || 'info@lival-ai.com'
    // 既定は自社ドメインの送信元に設定（ドメイン認証済み前提）
    let FROM = process.env.RESEND_FROM || 'Lival AI <no-reply@lival-ai.com>'
    if (!isValidFromFormat(FROM)) {
      console.warn('[contact] invalid_from_format_fallback', { requestId, from: FROM })
      FROM = 'no-reply@lival-ai.com'
    }

    // 将来的に保存（Supabase/Firebase）に対応可能: ここでDB挿入を行う
    // 例: await saveContact({ name, email, subject, message, ipHash, userAgent })

    const emailSubject = `[Contact] ${subject}`
    const html = buildHtml({ name, email, subject, message })
    const text = buildText({ name, email, subject, message })

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('[contact] missing_api_key', { requestId })
      return NextResponse.json({ ok: false, error: 'missing_api_key' }, { status: 500 })
    }
    const resend = new Resend(resendApiKey)

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: emailSubject,
      html,
      text,
      reply_to: email,
    })

    if (error) {
      const msg = typeof error === 'string' ? error : (error as any)?.message || 'unknown'
      console.error('[contact] send_error', { requestId, message: msg })
      // 代表的な設定ミスはヒントを返す
      let hint: string | undefined
      if (/only send testing emails to your own email address/i.test(msg)) {
        hint = 'resend_domain_not_verified_or_wrong_from_domain'
      } else if (/from|domain|verify|authenticated/i.test(msg)) {
        hint = 'verify_from_domain_or_set_RESEND_FROM_correctly'
      }
      return NextResponse.json({ ok: false, error: 'send_failed', hint }, { status: 500 })
    }

    console.info('[contact] sent', { requestId, to: TO })
    return NextResponse.json({ ok: true, requestId })
  } catch (err) {
    console.error('[contact] unexpected_error', { requestId, err })
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
