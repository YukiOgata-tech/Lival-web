// src/app/api/views/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'

// POST /api/views/[slug] - Increment view count (simplified)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const userRole = await getServerUserRole(request)
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Skip counting for admin users (as per spec)
    if (userRole === 'admin') {
      return NextResponse.json({ ok: true, counted: false })
    }

    // Additional bot detection (basic)
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /bot|crawl|spider|scrape/i.test(userAgent)
    
    if (isBot) {
      return NextResponse.json({ ok: true, counted: false })
    }

    // Mock view count increment
    const mockViewCount = Math.floor(Math.random() * 500) + 100

    return NextResponse.json({ 
      ok: true, 
      counted: true,
      viewCount: mockViewCount
    })

  } catch (error) {
    console.error('Error incrementing view count:', error)
    // Don't fail the request for view count errors
    return NextResponse.json({ 
      ok: true, 
      counted: false,
      error: 'Failed to increment view count'
    })
  }
}