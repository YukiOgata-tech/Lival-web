// src/app/admin/layout.tsx

import { Metadata } from 'next'
import { ReactNode } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Admin | Lival AI',
  description: '管理者画面',
  robots: 'noindex, nofollow',
}

interface AdminRootLayoutProps {
  children: ReactNode
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}