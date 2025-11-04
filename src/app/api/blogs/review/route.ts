// src/app/api/blogs/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/firebase/blog'
import { ReviewAction } from '@/lib/types/blog'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/blogs/review - Review blog (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify Firebase ID token and admin role from users collection
    const authz = request.headers.get('authorization') || ''
    const token = authz.startsWith('Bearer ') ? authz.slice(7) : ''
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null)
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const uid = decoded.uid
    if (!adminDb) return NextResponse.json({ error: 'Server not ready' }, { status: 503 })
    const userSnap = await adminDb.collection('users').doc(uid).get()
    const isAdmin = userSnap.exists && (userSnap.data() as any)?.role === 'admin'
    if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const body = await request.json()
    const { blogId, action, comments, templateIds } = body

    if (!blogId || !action) {
      return NextResponse.json(
        { error: 'Blog ID and action are required' },
        { status: 400 }
      )
    }

    const validActions: ReviewAction[] = ['approved', 'rejected', 'revise']
    if (!validActions.includes(action as ReviewAction)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    const typedAction = action as ReviewAction

    // For rejection or revision, comments are recommended
    if ((typedAction === 'rejected' || typedAction === 'revise') && !comments && !templateIds?.length) {
      return NextResponse.json(
        { error: 'Comments or template feedback required for rejection/revision' },
        { status: 400 }
      )
    }

    // Build feedback from templates if provided
    let finalComments = comments || ''
    if (templateIds && templateIds.length > 0) {
      // TODO: Implement template resolution
      // For now, just include template IDs in comments
      finalComments += `\n\nTemplate IDs used: ${templateIds.join(', ')}`
    }

    await BlogService.reviewBlog(blogId, typedAction, uid, finalComments)

    const actionMessages: Record<ReviewAction, string> = {
      approved: 'Blog approved and published successfully',
      rejected: 'Blog rejected with feedback',
      revise: 'Blog sent back for revision'
    }

    return NextResponse.json({
      success: true,
      message: actionMessages[typedAction]
    })

  } catch (error) {
    console.error('Error reviewing blog:', error)
    return NextResponse.json(
      { error: 'Failed to review blog' },
      { status: 500 }
    )
  }
}
