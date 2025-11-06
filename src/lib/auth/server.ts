// src/lib/auth/server.ts
import { NextRequest } from 'next/server'
import { UserRole } from '@/lib/types/blog'

// Detect Node runtime (avoid Admin SDK on Edge/Middleware)
const isNodeRuntime = () => typeof (globalThis as any).EdgeRuntime === 'undefined'

async function verifyBearer(request: NextRequest): Promise<{ uid: string | null; role: UserRole }>
{
  if (!isNodeRuntime()) return { uid: null, role: 'guest' }

  try {
    const authz = request.headers.get('authorization') || ''
    if (!authz.startsWith('Bearer ')) return { uid: null, role: 'guest' }
    const token = authz.slice(7)

    const { adminAuth, adminDb } = await import('@/lib/firebase/admin')
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded?.uid || null
    if (!uid) return { uid: null, role: 'guest' }

    const snap = await adminDb.collection('users').doc(uid).get()
    const data = snap.exists ? (snap.data() as any) : null
    if (data?.role === 'admin') return { uid, role: 'admin' }
    const plan = data?.subscription?.plan
    if (plan && plan !== 'free_web') return { uid, role: 'sub' }
    return { uid, role: 'free' }
  } catch {
    return { uid: null, role: 'guest' }
  }
}

export async function getServerUserRole(request: NextRequest): Promise<UserRole> {
  try {
    const hdr = request.headers.get('x-user-role') as UserRole
    if (hdr && ['guest', 'free', 'sub', 'admin'].includes(hdr)) return hdr

    const via = await verifyBearer(request)
    if (via.uid) return via.role
    return 'guest'
  } catch (e) {
    console.error('Error getting user role:', e)
    return 'guest'
  }
}

export async function getServerUserId(request: NextRequest): Promise<string | null> {
  try {
    const headerId = request.headers.get('x-user-id')
    if (headerId) return headerId

    const via = await verifyBearer(request)
    if (via.uid) return via.uid
    return null
  } catch (e) {
    console.error('Error getting user ID:', e)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const userId = await getServerUserId(request)
  const userRole = await getServerUserRole(request)
  if (!userId || userRole === 'guest') throw new Error('Authentication required')
  return { userId, userRole }
}

export async function requireSubscription(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const { userId, userRole } = await requireAuth(request)
  if (userRole !== 'sub' && userRole !== 'admin') throw new Error('Subscription required')
  return { userId, userRole }
}

export async function requireAdmin(request: NextRequest): Promise<{ userId: string; userRole: UserRole }> {
  const { userId, userRole } = await requireAuth(request)
  if (userRole !== 'admin') throw new Error('Admin access required')
  return { userId, userRole }
}

