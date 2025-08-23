// src/lib/firebase/blog-admin.ts
import { adminDb } from './admin'
import { 
  Blog, 
  BlogStatus, 
  UserRole 
} from '@/lib/types/blog'

// Server-side Blog Service using Firebase Admin SDK
export class BlogAdminService {
  // Get blogs with filters (server-side)
  static async getBlogs(options: {
    page?: number
    pageSize?: number
    category?: string
    tag?: string
    status?: BlogStatus[]
    authorId?: string
    visibility?: string[]
  }) {
    const {
      page = 1,
      pageSize = 20,
      category,
      tag,
      status = ['approved'],
      authorId,
      visibility
    } = options

    try {
      let query = adminDb.collection('blogs')
      
      // Apply filters
      if (status.length > 0) {
        query = query.where('status', 'in', status)
      }
      
      if (category) {
        query = query.where('categories', 'array-contains', category)
      }
      
      if (tag) {
        query = query.where('tags', 'array-contains', tag)
      }
      
      if (authorId) {
        query = query.where('authorId', '==', authorId)
      }
      
      if (visibility && visibility.length > 0) {
        query = query.where('visibility', 'in', visibility)
      }

      // Order and paginate
      query = query.orderBy('createdAt', 'desc')
      
      if (page > 1) {
        query = query.offset((page - 1) * pageSize)
      }
      
      query = query.limit(pageSize)

      const snapshot = await query.get()
      
      const blogs: Blog[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Blog))

      return {
        blogs,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
      }

    } catch (error) {
      console.error('Error fetching blogs (admin):', error)
      throw new Error('Failed to fetch blogs')
    }
  }

  // Get single blog by slug (server-side)
  static async getBlogBySlug(slug: string, userRole: UserRole = 'guest'): Promise<{
    blog: Blog | null
    isTeaser: boolean
    canAccess: boolean
  }> {
    try {
      const query = adminDb.collection('blogs')
        .where('slug', '==', slug)
        .limit(1)

      const snapshot = await query.get()
      
      if (snapshot.empty) {
        return {
          blog: null,
          isTeaser: false,
          canAccess: false
        }
      }

      const doc = snapshot.docs[0]
      const blog = {
        id: doc.id,
        ...doc.data()
      } as Blog

      // Check access permissions
      const canAccess = this.canAccessFullContent(blog, userRole)
      const isTeaser = blog.visibility === 'teaser' || (blog.visibility === 'premium' && !canAccess)

      return {
        blog,
        isTeaser,
        canAccess
      }

    } catch (error) {
      console.error('Error fetching blog by slug (admin):', error)
      throw new Error('Failed to fetch blog')
    }
  }

  // Search blogs (server-side)
  static async searchBlogs(searchQuery: string, userRole: UserRole = 'guest'): Promise<Blog[]> {
    try {
      // Simple title search - for full text search, you'd need Algolia or similar
      const query = adminDb.collection('blogs')
        .where('status', '==', 'approved')
        .orderBy('createdAt', 'desc')
        .limit(50) // Limit search results

      const snapshot = await query.get()
      
      const blogs: Blog[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Blog))
        .filter(blog => 
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )

      return blogs.slice(0, 20) // Return max 20 results

    } catch (error) {
      console.error('Error searching blogs (admin):', error)
      throw new Error('Failed to search blogs')
    }
  }

  // Check if user can access full content
  static canAccessFullContent(blog: Blog, userRole: UserRole): boolean {
    switch (blog.visibility) {
      case 'public':
        return true
      case 'teaser':
        return userRole === 'subscriber' || userRole === 'admin'
      case 'premium':
        return userRole === 'subscriber' || userRole === 'admin'
      default:
        return userRole === 'admin'
    }
  }

  // Get visibility filter based on user role
  static getVisibilityFilter(userRole: UserRole): string[] {
    switch (userRole) {
      case 'admin':
        return ['public', 'teaser', 'premium']
      case 'subscriber':
        return ['public', 'teaser', 'premium']
      case 'free':
        return ['public', 'teaser']
      case 'guest':
      default:
        return ['public', 'teaser']
    }
  }

  // Increment view count (server-side)
  static async incrementViewCount(blogId: string): Promise<void> {
    try {
      const viewCountRef = adminDb.collection('viewCounts').doc(blogId)
      
      await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(viewCountRef)
        
        if (doc.exists) {
          transaction.update(viewCountRef, {
            count: (doc.data()?.count || 0) + 1,
            lastViewed: new Date()
          })
        } else {
          transaction.set(viewCountRef, {
            blogId,
            count: 1,
            lastViewed: new Date(),
            createdAt: new Date()
          })
        }
      })

    } catch (error) {
      console.error('Error incrementing view count (admin):', error)
      // Don't throw error for view count failures
    }
  }

  // Get view count (server-side)
  static async getViewCount(blogId: string): Promise<number> {
    try {
      const doc = await adminDb.collection('viewCounts').doc(blogId).get()
      return doc.exists ? (doc.data()?.count || 0) : 0
    } catch (error) {
      console.error('Error getting view count (admin):', error)
      return 0
    }
  }
}