// src/app/api/blogs/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/firebase/blog'
import { getServerUserRole } from '@/lib/auth/server'
import { ReviewAction } from '@/lib/types/blog'

// POST /api/blogs/review - Review blog (admin only)
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = request.headers.get('x-user-id')
    
    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

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

    await BlogService.reviewBlog(blogId, typedAction, userId, finalComments)

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