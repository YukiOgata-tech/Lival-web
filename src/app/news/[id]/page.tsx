// src/app/news/[id]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsDetail from '@/components/news/NewsDetail'
import { getNewsById } from '@/lib/firebase/news'

interface NewsDetailPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  try {
    const news = await getNewsById(params.id)
    
    if (!news || news.status !== 'published') {
      return {
        title: 'お知らせが見つかりません | Lival AI'
      }
    }

    return {
      title: `${news.title} | Lival AI`,
      description: news.excerpt,
      openGraph: {
        title: news.title,
        description: news.excerpt,
        type: 'article',
        publishedTime: news.publishedAt?.toISOString(),
        modifiedTime: news.updatedAt.toISOString(),
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'お知らせが見つかりません | Lival AI'
    }
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  try {
    const news = await getNewsById(params.id)
    
    if (!news || news.status !== 'published') {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <NewsDetail news={news} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading news detail:', error)
    notFound()
  }
}