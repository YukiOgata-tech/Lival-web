// src/components/blog/ViewCounterPing.tsx
'use client'

import { useEffect } from 'react'
import { UserRole } from '@/lib/types/blog'

interface ViewCounterPingProps {
  slug: string
  role?: UserRole
}

export function ViewCounterPing({ slug, role = 'guest' }: ViewCounterPingProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (role === 'admin') return // 管理者は除外

    const key = `viewed:${slug}`
    if (sessionStorage.getItem(key)) return

    const ua = navigator.userAgent.toLowerCase()
    if (/bot|crawl|spider/.test(ua)) return

    const send = () => {
      if (document.visibilityState !== 'visible') return
      sessionStorage.setItem(key, '1')
      
      setTimeout(() => {
        fetch(`/api/views/${encodeURIComponent(slug)}`, { 
          method: 'POST', 
          cache: 'no-store' 
        }).catch(() => {
          // Silently handle errors - view counting shouldn't break the page
        })
      }, 1000)
    }

    if (document.visibilityState === 'visible') {
      send()
    } else {
      const onVis = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVis)
          send()
        }
      }
      document.addEventListener('visibilitychange', onVis)
      return () => document.removeEventListener('visibilitychange', onVis)
    }
  }, [slug, role])

  return null
}