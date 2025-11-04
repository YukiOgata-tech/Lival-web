// src/components/admin/CompactReviewCard.tsx
'use client'

import Link from 'next/link'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import { Blog } from '@/lib/types/blog'

interface CompactReviewCardProps {
  blog: Blog
  onApprove: (blogId: string) => void
}

export default function CompactReviewCard({ blog, onApprove }: CompactReviewCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  }

  const timeAgo = () => {
    const now = new Date().getTime()
    const t = new Date(blog.createdAt).getTime()
    const h = Math.floor((now - t) / 36e5)
    if (h < 24) return `${h}h`
    const d = Math.floor(h / 24)
    return `${d}d`
  }

  return (
    <div className="border border-gray-200 rounded-lg p-2 bg-white">
      <div className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
        {blog.title}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-600">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(blog.createdAt)}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo()}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <button
          onClick={() => onApprove(blog.id)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          <CheckCircle className="w-3.5 h-3.5" /> 承認
        </button>
        <Link
          href={`/blog/${blog.slug}`}
          className="flex-1 inline-flex items-center justify-center px-2 py-1 text-[11px] rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          詳細
        </Link>
      </div>
    </div>
  )
}

