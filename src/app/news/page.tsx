// src/app/news/page.tsx

import { Metadata } from 'next'
import NewsList from '@/components/news/NewsList'

export const metadata: Metadata = {
  title: 'お知らせ | Lival AI',
  description: '最新のお知らせ・システム情報をご覧いただけます',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <NewsList />
      </div>
    </div>
  )
}