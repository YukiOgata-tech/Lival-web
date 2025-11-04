// src/app/api/blogs/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole, getServerUserId } from '@/lib/auth/server'
import { BlogService } from '@/lib/firebase/blog'
import { adminDb } from '@/lib/firebase-admin'

// POST /api/blogs/submit - Submit blog for review
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = await getServerUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (userRole !== 'sub' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Subscription required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { blogId } = body

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    if (adminDb) {
      const now = new Date()
      await adminDb.collection('blogs').doc(blogId).update({ status: 'pending', submittedAt: now, updatedAt: now })
      await adminDb.collection('blog_submissions').doc().set({ id: `${blogId}_${now.getTime()}`, blogId, userId, status: 'pending', submittedAt: now })
      await adminDb.collection('audit_logs').doc().set({ actorId: userId, action: 'blog_submitted', blogId, timestamp: now })
    } else {
      await BlogService.submitForReview(blogId, userId)
    }

    return NextResponse.json({ success: true, message: 'Blog submitted for review successfully', blogId, status: 'pending' })

  } catch (error) {
    const code = (error as any)?.code || (error as any)?.message || 'unknown'
    console.error('Error submitting blog:', { code, error })
    const status = code === 'permission-denied' || code === 'unauthenticated' ? 403 : 500
    const details = typeof (error as any)?.message === 'string' ? (error as any).message : undefined
    return NextResponse.json(
      { error: 'Failed to submit blog for review', code, details },
      { status }
    )
  }
}
