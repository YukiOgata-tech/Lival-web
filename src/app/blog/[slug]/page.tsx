// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogContent from '@/components/blog/BlogContent'
import { getCachedBlogBySlug, BlogService } from '@/lib/firebase/blog'
import { Blog } from '@/lib/types/blog'
import { DocumentSnapshot } from 'firebase/firestore'

// ISR setting: revalidate every 60 seconds
export const revalidate = 60

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// Generate static pages at build time
export async function generateStaticParams() {
  try {
    const allBlogs: Blog[] = []
    let lastDoc: DocumentSnapshot | null = null
    let hasMore = true

    while (hasMore) {
      const result = await BlogService.getBlogs({
        status: ['approved'],
        pageSize: 100, // Fetch 100 at a time
        lastDoc: lastDoc || undefined,
      })
      
      allBlogs.push(...result.blogs)
      lastDoc = result.lastDoc
      hasMore = result.hasMore
    }

    return allBlogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await getCachedBlogBySlug(slug)
    
    if (!blog) {
      return {
        title: 'ページが見つかりません | Lival AI',
        description: 'お探しのブログ記事は見つかりませんでした。'
      }
    }

    // Assuming coverPath is a full URL. If not, it needs to be constructed.
    const imageUrl = blog.coverPath || 'https://www.lival.dev/images/og-image.png'

    return {
      title: `${blog.title} | Lival AI ブログ`,
      description: blog.excerpt,
      keywords: [...blog.tags, ...blog.categories].join(', '),
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: `https://www.lival.dev/blog/${blog.slug}`,
        type: 'article',
        publishedTime: blog.createdAt.toISOString(),
        authors: [blog.authorName || 'Lival AI Team'],
        tags: blog.tags,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
        images: [imageUrl]
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
  const { slug } = await params
  const blog = await getCachedBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // The full blog object is passed to the client component
  return <BlogContent initialBlog={blog as Blog} />
}