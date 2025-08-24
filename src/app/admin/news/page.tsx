// src/app/admin/news/page.tsx

import { Metadata } from 'next'
import NewsAdminList from '@/components/news/NewsAdminList'

export const metadata: Metadata = {
  title: 'お知らせ管理 | Lival AI',
  description: 'お知らせの作成・編集・管理',
  robots: 'noindex'
}

export default function NewsAdminPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <NewsAdminList />
    </div>
  )
}