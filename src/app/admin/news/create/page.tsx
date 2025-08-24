// src/app/admin/news/create/page.tsx

import { Metadata } from 'next'
import NewsForm from '@/components/news/NewsForm'

export const metadata: Metadata = {
  title: 'お知らせ作成 | Lival AI',
  description: '新しいお知らせを作成',
  robots: 'noindex'
}

export default function NewsCreatePage() {
  return <NewsForm mode="create" />
}