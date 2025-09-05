'use client'

import { usePathname } from 'next/navigation'
import MainHeader from './MainHeader'
import MainFooter from './MainFooter'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // reception AI パスの場合はヘッダー・フッターを表示しない
  const hideHeaderFooter =
    pathname === '/dashboard/receptionAI' ||
    pathname.startsWith('/lival-agent-mode/')
  
  if (hideHeaderFooter) {
    return <>{children}</>
  }
  
  return (
    <>
      <MainHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <MainFooter />
    </>
  )
}
