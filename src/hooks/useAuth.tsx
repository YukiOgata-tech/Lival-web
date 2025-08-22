'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { LivalUser } from '@/types'
import { createUserInFirestore, getUserData } from '@/lib/user'

interface AuthContextType {
  user: FirebaseUser | null
  userData: LivalUser | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<LivalUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserData = async (retryCount = 0): Promise<void> => {
    if (!user) {
      console.log('👤 No user, clearing userData')
      setUserData(null)
      return
    }

    console.log(`🔄 Refreshing user data (attempt ${retryCount + 1})`)

    try {
      const data = await getUserData(user.uid)
      if (data) {
        console.log('✅ User data found and set')
        setUserData(data)
        return
      }

      // データが見つからない場合
      console.log('❌ User data not found in Firestore')
      
      if (retryCount < 2) {
        console.log(`🔄 Retrying user creation... (${retryCount + 1}/2)`)
        
        try {
          await createUserInFirestore(user)
          console.log('✅ User created in Firestore, retrying data fetch...')
          
          // 短い待機時間で再試行
          setTimeout(() => {
            refreshUserData(retryCount + 1)
          }, 1500)
        } catch (error) {
          console.error('🚨 Failed to create user in Firestore:', error)
          setUserData(null)
        }
      } else {
        console.error('🚨 Failed to get user data after all retries')
        // 最終的にフォールバック: 基本的なユーザーデータを作成
        const fallbackData = {
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'ユーザー',
          bio: '',
          birthday: null,
          gender: null,
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified,
          coins: 0,
          xp: 0,
          level: 1,
          currentMonsterId: 'monster-01',
          groupSessionCount: 0,
          groupTotalMinutes: 0,
          individualSessionCount: 0,
          individualTotalMinutes: 0,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
          subscription: {
            plan: 'free_web' as const,
            status: 'active' as const,
            currentPeriodStart: new Date() as any,
            currentPeriodEnd: null
          },
          webProfile: {
            lastWebLogin: new Date() as any,
            isWebUser: true,
            preferences: {
              theme: 'light' as const,
              notifications: true,
              language: 'ja' as const
            }
          }
        } as LivalUser
        
        console.log('🆘 Using fallback user data')
        setUserData(fallbackData)
      }
    } catch (error) {
      console.error('🚨 Error in refreshUserData:', error)
      setUserData(null)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser?.uid || 'null')
      setUser(firebaseUser)
      
      if (firebaseUser) {
        console.log('✅ User logged in, initializing user data...')
        
        // まず既存のユーザーデータを確認
        try {
          const existingData = await getUserData(firebaseUser.uid)
          if (existingData) {
            console.log('✅ Found existing user data')
            setUserData(existingData)
            setLoading(false)
            return
          }
        } catch (error) {
          console.log('❌ Error checking existing data, will create new:', error)
        }
        
        // 既存データがない場合は作成
        console.log('🔨 Creating new user in Firestore...')
        try {
          await createUserInFirestore(firebaseUser)
          // 作成後にデータを取得
          refreshUserData()
        } catch (error) {
          console.error('🚨 Failed to create user in Firestore:', error)
          // エラーの場合はフォールバックデータを使用
          refreshUserData()
        }
      } else {
        console.log('👋 User logged out')
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // userが変更された時の副作用を削除（無限ループの原因）

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName })
    }
    
    // Firestoreにユーザーデータを作成（onAuthStateChangedでも実行されるが、明示的に実行）
    await createUserInFirestore(result.user)
  }

  const value = {
    user,
    userData,
    loading,
    signOut,
    signIn,
    signUp,
    refreshUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, userData, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
            <p className="text-gray-600 mb-8">このページにアクセスするにはログインしてください。</p>
            <a 
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ログインページへ
            </a>
          </div>
        </div>
      )
    }

    // ユーザーデータがまだロードされていない場合
    if (!userData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">ユーザー情報を読み込み中...</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}