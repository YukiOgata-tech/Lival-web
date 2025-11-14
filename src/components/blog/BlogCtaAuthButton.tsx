'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

// Hides login links when the user is already authenticated.
export default function BlogCtaAuthButton() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return

    const loginLinks = document.querySelectorAll<HTMLAnchorElement>('a[href="/login"]')
    loginLinks.forEach((el) => {
      el.style.display = 'none'
    })
  }, [loading, user])

  return null
}

