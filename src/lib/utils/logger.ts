export type LogLevel = 'info' | 'warn' | 'error'

function log(level: LogLevel, msg: string, ctx?: Record<string, unknown>) {
  const payload = { level, msg, ...ctx }
  // eslint-disable-next-line no-console
  console[level === 'info' ? 'log' : level](`[web] ${msg}`, payload)
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}

