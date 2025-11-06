// src/components/blog/ArticleContent.tsx
'use client'

import { useEffect, useRef } from 'react'

interface ArticleContentProps {
  content: string
  className?: string
}

/**
 * ブログ記事のHTMLコンテンツを美しく表示するコンポーネント
 * Tiptapエディタで作成されたHTMLを想定
 */
export default function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // 画像に遅延読み込みを追加
    const images = contentRef.current.querySelectorAll('img')
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy')
      }
    })
  }, [content])

  return (
    <div
      ref={contentRef}
      className={`article-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
