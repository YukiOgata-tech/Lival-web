// src/app/api/blogs/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'

// POST /api/blogs/submit - Submit blog for review
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = request.headers.get('x-user-id')
    
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

    // Mock implementation - simulate successful submission
    // In production, this would interact with Firestore
    console.log(`Mock: Blog ${blogId} submitted for review by user ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'Blog submitted for review successfully',
      blogId: blogId,
      status: 'pending'
    })

  } catch (error) {
    console.error('Error submitting blog:', error)
    return NextResponse.json(
      { error: 'Failed to submit blog for review' },
      { status: 500 }
    )
  }
}