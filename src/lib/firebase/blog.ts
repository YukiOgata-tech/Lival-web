// src/lib/firebase/blog.ts
import { cache } from 'react'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  DocumentSnapshot,
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Blog, 
  BlogCategory, 
  ReviewTemplate, 
  blogConverter, 
  auditLogConverter,
  BlogStatus,
  ReviewAction,
  UserRole 
} from '@/lib/types/blog'

// Collections
export const blogsCollection = collection(db, 'blogs').withConverter(blogConverter)
export const blogSubmissionsCollection = collection(db, 'blogSubmissions')
export const auditLogsCollection = collection(db, 'auditLogs').withConverter(auditLogConverter)
export const categoriesCollection = collection(db, 'blog_categories')
export const reviewTemplatesCollection = collection(db, 'review_templates')

// Blog CRUD operations
export class BlogService {
  // Helper: Calculate read time
  private static _calculateReadTime(content: string | undefined): number {
    if (!content) return 0
    const wordsPerMinute = 500 // Average reading speed
    const textLength = content.replace(/<[^>]+>/g, '').length // Strip HTML tags
    return Math.ceil(textLength / wordsPerMinute)
  }

  // Create a new blog
  static async createBlog(blogData: Partial<Blog>, authorId: string): Promise<string> {
    const blogRef = doc(blogsCollection)
    const slug = await this.generateUniqueSlug(blogData.title || '')
    const readTimeMins = this._calculateReadTime(blogData.content)
    
    const blog: Partial<Blog> = {
      ...blogData,
      id: blogRef.id,
      slug,
      authorId,
      status: 'draft',
      viewCount: 0,
      version: 1,
      readTimeMins,
      createdAt: (blogData as any)?.createdAt || new Date(),
      updatedAt: new Date(),
      approvedAt: null,
    }

    await setDoc(blogRef, blog)
    await this.createAuditLog(authorId, 'blog_created', blogRef.id, null, blog)
    
    return blogRef.id
  }

  // Update blog
  static async updateBlog(
    blogId: string, 
    updates: Partial<Blog>, 
    actorId: string
  ): Promise<void> {
    const blogRef = doc(blogsCollection, blogId)
    const oldBlog = await getDoc(blogRef)
    
    if (!oldBlog.exists()) {
      throw new Error('Blog not found')
    }

    const updatedData: Partial<Blog> & { updatedAt: Date; version: any } = {
      ...updates,
      updatedAt: new Date(),
      version: increment(1)
    }

    // Recalculate read time if content is updated
    if (updates.content) {
      updatedData.readTimeMins = this._calculateReadTime(updates.content)
    }

    await updateDoc(blogRef, updatedData)
    await this.createAuditLog(actorId, 'blog_updated', blogId, oldBlog.data(), updatedData)
  }

  // Submit blog for review
  static async submitForReview(blogId: string, authorId: string): Promise<void> {
    await this.updateBlog(blogId, { status: 'pending', submittedAt: new Date() } as any, authorId)
    
    // Create submission record
    const submissionRef = doc(blogSubmissionsCollection)
    await setDoc(submissionRef, {
      id: submissionRef.id,
      blogId,
      userId: authorId,
      status: 'pending',
      submittedAt: serverTimestamp(),
    })

    await this.createAuditLog(authorId, 'blog_submitted', blogId)
  }

  // Review blog
  static async reviewBlog(
    blogId: string,
    action: ReviewAction,
    reviewerId: string,
    comments?: string
  ): Promise<void> {
    const blogRef = doc(blogsCollection, blogId)
    const batch = writeBatch(db)

    // Update blog status
    const updateData: Partial<Blog> = {
      status: action,
      updatedAt: new Date(),
    }

    if (action === 'approved') {
      updateData.approvedAt = new Date()
    }

    batch.update(blogRef, updateData)

    // Update submission record
    const submissionQuery = query(
      blogSubmissionsCollection,
      where('blogId', '==', blogId),
      where('status', '==', 'pending')
    )
    const submissions = await getDocs(submissionQuery)
    
    submissions.forEach((doc) => {
      batch.update(doc.ref, {
        status: action,
        reviewedAt: serverTimestamp(),
        reviewerId,
        reviewComments: comments,
      })
    })

    await batch.commit()
    await this.createAuditLog(reviewerId, `blog_${action}`, blogId, null, { comments })
  }

  // Get blog by slug
  static async getBlogBySlug(slug: string): Promise<Blog | null> {
    const q = query(blogsCollection, where('slug', '==', slug), limit(1))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    return snapshot.docs[0].data()
  }

  // Get blogs list with pagination
  static async getBlogs(options: {
    page?: number
    pageSize?: number
    category?: string
    tag?: string
    status?: BlogStatus[]
    authorId?: string
    visibility?: string[]
    lastDoc?: DocumentSnapshot
  } = {}): Promise<{
    blogs: Blog[]
    lastDoc: DocumentSnapshot | null
    hasMore: boolean
  }> {
    const { 
      pageSize = 20, 
      category, 
      tag, 
      status, 
      authorId, 
      visibility,
      lastDoc 
    } = options

    let q = query(blogsCollection, orderBy('createdAt', 'desc'))

    // Apply filters
    if (category) {
      q = query(q, where('categories', 'array-contains', category))
    }
    if (tag) {
      q = query(q, where('tags', 'array-contains', tag))
    }
    if (status && status.length > 0) {
      q = query(q, where('status', 'in', status))
    }
    if (authorId) {
      q = query(q, where('authorId', '==', authorId))
    }
    if (visibility && visibility.length > 0) {
      q = query(q, where('visibility', 'in', visibility))
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    q = query(q, limit(pageSize + 1)) // Get one extra to check if there are more

    const snapshot = await getDocs(q)
    const blogs = snapshot.docs.slice(0, pageSize).map(doc => doc.data())
    const hasMore = snapshot.docs.length > pageSize
    const newLastDoc = hasMore ? snapshot.docs[pageSize - 1] : null

    return { blogs, lastDoc: newLastDoc, hasMore }
  }

  // Increment view count
  static async incrementViewCount(blogId: string): Promise<void> {
    const blogRef = doc(blogsCollection, blogId)
    await updateDoc(blogRef, {
      viewCount: increment(1)
    })
  }

  // Search blogs
  static async searchBlogs(
    searchQuery: string,
    userRole: UserRole = 'guest'
  ): Promise<Blog[]> {
    // Note: This is a simplified implementation. 
    // For production, consider using Algolia or similar search service
    const visibilityFilter = this.getVisibilityFilter(userRole)
    
    const q = query(
      blogsCollection,
      where('status', '==', 'approved'),
      where('visibility', 'in', visibilityFilter),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    const snapshot = await getDocs(q)
    const blogs = snapshot.docs.map(doc => doc.data())

    // Client-side filtering for search (not ideal for large datasets)
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // Helper: Generate unique slug
  static async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    let slug = baseSlug
    let counter = 1

    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  // Helper: Check if slug exists
  static async slugExists(slug: string): Promise<boolean> {
    const q = query(blogsCollection, where('slug', '==', slug), limit(1))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }

  // Helper: Get visibility filter based on user role
  static getVisibilityFilter(userRole: UserRole): string[] {
    switch (userRole) {
      case 'admin':
        return ['public', 'teaser', 'premium']
      case 'sub':
        return ['public', 'teaser', 'premium']
      case 'free':
      case 'guest':
      default:
        return ['public', 'teaser']
    }
  }

  // Helper: Check if user can access full content
  static canAccessFullContent(blog: Blog, userRole: UserRole): boolean {
    if (userRole === 'admin') return true
    if (blog.visibility === 'public') return true
    if (blog.visibility === 'premium' && (userRole === 'sub' || userRole === 'admin')) return true
    return false
  }

  // Helper: Create audit log
  static async createAuditLog(
    actorId: string,
    action: string,
    blogId: string,
    oldValue?: unknown,
    newValue?: unknown,
    comments?: string
  ): Promise<void> {
    const logRef = doc(auditLogsCollection)
    await setDoc(logRef, {
      id: logRef.id,
      actorId,
      actorName: '', // This would be populated from user data
      action,
      blogId,
      timestamp: new Date(),
      oldValue,
      newValue,
      comments
    })
  }
}

// Category management
export class CategoryService {
  static async getCategories(): Promise<BlogCategory[]> {
    const q = query(categoriesCollection, where('isActive', '==', true), orderBy('sortOrder'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogCategory))
  }

  static async createCategory(category: Omit<BlogCategory, 'id'>): Promise<string> {
    const ref = doc(categoriesCollection)
    await setDoc(ref, { ...category, id: ref.id })
    return ref.id
  }
}

// Review templates
export class ReviewTemplateService {
  static async getTemplates(): Promise<ReviewTemplate[]> {
    const q = query(reviewTemplatesCollection, where('isActive', '==', true))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewTemplate))
  }

  static async getTemplatesByCategory(category: string): Promise<ReviewTemplate[]> {
    const q = query(
      reviewTemplatesCollection, 
      where('category', '==', category),
      where('isActive', '==', true)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewTemplate))
  }
}

// Cached version of getBlogBySlug
export const getCachedBlogBySlug = cache(BlogService.getBlogBySlug)
