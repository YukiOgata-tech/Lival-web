// src/lib/utils/isbn.ts
export function normalizeIsbn(raw?: string | null): string | null {
  if (!raw) return null
  const s = raw.replace(/[-\s]/g, '').toUpperCase()
  if (/^\d{13}$/.test(s) || /^\d{9}[\dX]$/.test(s)) return s
  return null
}
