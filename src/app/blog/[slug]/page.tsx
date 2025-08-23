// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogContent from '@/components/blog/BlogContent'
import { BlogService } from '@/lib/firebase/blog'

interface BlogPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const blog = await BlogService.getBlogBySlug(params.slug)
    
    if (!blog) {
      return {
        title: 'ページが見つかりません | Lival AI',
        description: 'お探しのブログ記事は見つかりませんでした。'
      }
    }

    return {
      title: `${blog.title} | Lival AI ブログ`,
      description: blog.excerpt,
      keywords: [...blog.tags, ...blog.categories].join(', '),
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        type: 'article',
        publishedTime: blog.createdAt.toISOString(),
        authors: [blog.authorName || 'Anonymous'],
        tags: blog.tags,
        ...(blog.coverPath && {
          images: [{
            url: blog.coverPath,
            width: 1200,
            height: 630,
            alt: blog.title
          }]
        })
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
        ...(blog.coverPath && {
          images: [blog.coverPath]
        })
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'ブログ記事 | Lival AI',
      description: '教育特化ブログ記事をお読みください。'
    }
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = params

  try {
    // This would typically be done through an API call in a real app
    // For now, we'll pass the slug to the client component
    return <BlogContent slug={slug} />
  } catch (error) {
    console.error('Error loading blog:', error)
    notFound()
  }
}