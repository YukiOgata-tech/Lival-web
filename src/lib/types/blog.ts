// src/lib/types/blog.ts

export type BlogStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type BlogVisibility = 'public' | 'teaser' | 'premium'
export type AuthorType = 'user' | 'influencer' | 'staff'
export type UserRole = 'guest' | 'free' | 'sub' | 'admin'
export type ReviewAction = 'approved' | 'rejected' | 'revise'

export interface Blog {
  id: string
  title: string
  slug: string
  status: BlogStatus
  visibility: BlogVisibility
  authorType: AuthorType
  authorId: string
  authorName?: string
  categories: string[]
  tags: string[]
  readTimeMins: number
  coverPath: string | null
  storagePath: string
  content?: string // Only loaded when needed
  excerpt: string // First 300 characters for teaser
  approvedAt: Date | null
  createdAt: Date
  updatedAt: Date
  viewCount: number
  version: number
}

export interface BlogSubmission {
  id: string
  blogId: string
  userId: string
  status: BlogStatus
  submittedAt: Date
  reviewedAt?: Date
  reviewerId?: string
  reviewComments?: string
  rejectionReason?: string
}

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  action: string
  blogId: string
  timestamp: Date
  oldValue?: any
  newValue?: any
  comments?: string
}

export interface BlogReviewCriteria {
  id: string
  category: string
  description: string
  weight: number
  isRequired: boolean
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  isActive: boolean
  sortOrder: number
}

export interface BlogStats {
  totalBlogs: number
  pendingReviews: number
  approvedBlogs: number
  rejectedBlogs: number
  averageReviewTime: number
  topCategories: Array<{ category: string; count: number }>
  topTags: Array<{ tag: string; count: number }>
}

// Review templates
export interface ReviewTemplate {
  id: string
  category: string
  title: string
  content: string
  isActive: boolean
}

// API Request/Response types
export interface CreateBlogRequest {
  title: string
  content: string
  categories: string[]
  tags: string[]
  visibility: BlogVisibility
  coverPath?: string
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string
}

export interface ReviewBlogRequest {
  blogId: string
  action: ReviewAction
  comments?: string
  templateIds?: string[]
}

export interface BlogListResponse {
  blogs: Blog[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasMore: boolean
}

export interface BlogDetailResponse {
  blog: Blog
  isTeaser: boolean
  canAccess: boolean
  userRole: UserRole
}

// Firestore converter helpers
export const blogConverter = {
  toFirestore: (blog: Partial<Blog>) => ({
    ...blog,
    createdAt: blog.createdAt || new Date(),
    updatedAt: new Date(),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      approvedAt: data.approvedAt?.toDate() || null,
    } as Blog
  }
}

export const auditLogConverter = {
  toFirestore: (log: Partial<AuditLog>) => ({
    ...log,
    timestamp: log.timestamp || new Date(),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...data,
      timestamp: data.timestamp?.toDate() || new Date(),
    } as AuditLog
  }
}