// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole, getServerUserId } from '@/lib/auth/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    const userRole = await getServerUserRole(request)
    const userId = await getServerUserId(request)

    // Temporary: Skip authentication checks in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      console.log(`[DEV] Skipping auth check for ${pathname}, userRole: ${userRole}, userId: ${userId}`)
      
      // In development, set mock user info
      if (pathname.startsWith('/api/')) {
        const response = NextResponse.next()
        response.headers.set('x-user-id', 'dev-user-id')
        response.headers.set('x-user-role', 'admin')
        return response
      }
      
      return NextResponse.next()
    }

    // Blog submission routes - require subscription
    if (pathname.startsWith('/blog/submit') || pathname.startsWith('/submit')) {
      if (!userId) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      if (userRole !== 'sub' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/subscription', request.url))
      }
    }

    // Admin routes - require admin access
    if (pathname.startsWith('/admin')) {
      if (!userId) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/403', request.url))
      }
    }

    // API routes authentication
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.next()
      
      // Add user info to headers for API routes
      if (userId) {
        response.headers.set('x-user-id', userId)
      }
      response.headers.set('x-user-role', userRole)
      
      return response
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, continue without auth info
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}