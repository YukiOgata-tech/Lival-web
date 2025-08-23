// src/lib/auth/server.ts
import { NextRequest } from 'next/server'
import { UserRole } from '@/lib/types/blog'

// This is a placeholder implementation
// In a real app, you would integrate with your authentication system
export async function getServerUserRole(request: NextRequest): Promise<UserRole> {
  try {
    // Get user role from headers (would come from auth middleware)
    const role = request.headers.get('x-user-role') as UserRole
    
    if (role && ['guest', 'free', 'sub', 'admin'].includes(role)) {
      return role
    }
    
    // Temporary: Check for actual authentication (cookies, session, etc.)
    // For development, assume logged-in users are admin
    const authCookie = request.cookies.get('auth-token') || request.cookies.get('next-auth.session-token')
    if (authCookie && authCookie.value) {
      return 'admin' // Temporary: all authenticated users are admin
    }
    
    // Default to guest if no valid role found
    return 'guest'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'guest'
  }
}

export async function getServerUserId(request: NextRequest): Promise<string | null> {
  try {
    // First check headers (from middleware)
    const headerId = request.headers.get('x-user-id')
    if (headerId) {
      return headerId
    }
    
    // Temporary: Check for actual authentication (cookies, session, etc.)
    // For development, return a mock user ID if authenticated
    const authCookie = request.cookies.get('auth-token') || request.cookies.get('next-auth.session-token')
    if (authCookie && authCookie.value) {
      return 'mock-user-id' // Temporary: return mock user ID for authenticated users
    }
    
    return null
  } catch (error) {
    console.error('Error getting user ID:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const userId = await getServerUserId(request)
  const userRole = await getServerUserRole(request)
  
  if (!userId || userRole === 'guest') {
    throw new Error('Authentication required')
  }
  
  return { userId, userRole }
}

export async function requireSubscription(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const { userId, userRole } = await requireAuth(request)
  
  if (userRole !== 'sub' && userRole !== 'admin') {
    throw new Error('Subscription required')
  }
  
  return { userId, userRole }
}

export async function requireAdmin(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const { userId, userRole } = await requireAuth(request)
  
  if (userRole !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return { userId, userRole }
}