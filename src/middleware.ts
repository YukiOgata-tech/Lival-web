// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    // Temporary: Skip authentication checks in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      console.log(`[DEV] Skipping auth check for ${pathname}`)
      
      // In development, set mock user info
      if (pathname.startsWith('/api/')) {
        const response = NextResponse.next()
        response.headers.set('x-user-id', 'dev-user-id')
        response.headers.set('x-user-role', 'admin')
        return response
      }
      
      return NextResponse.next()
    }

    // Blog submission routes
    // Rely on client-side gating for subscription/admin to avoid blocking valid logged-in users in production
    if (pathname.startsWith('/blog/submit') || pathname.startsWith('/submit')) {
      return NextResponse.next()
    }

    // Admin routes - rely on client-side guard (no server redirect)
    // Pages under /admin handle access using useAuth().isAdmin on the client.
    if (pathname.startsWith('/admin')) {
      return NextResponse.next()
    }

    // API routes: no-op in middleware (auth via Authorization: Bearer on server)
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
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
