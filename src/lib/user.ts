// src/lib/user.ts
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile, User as FirebaseUser } from 'firebase/auth'
import { db } from './firebase'
import { LivalUser, UserSubscription, WebProfile } from '@/types'
import { initializeUserData } from './firebase/user-initialization'
import { upsertUserProfile, getUserProfile } from './supabase/userProfile'

/**
 * 新規ユーザーをFirebase Functions経由で作成または更新
 */
export const createUserInFirestore = async (
  firebaseUser: FirebaseUser,
  additionalData?: Partial<LivalUser>
): Promise<void> => {
  if (!firebaseUser.email) {
    throw new Error('ユーザーのメールアドレスが取得できません')
  }

  try {
    // Firebase Functions経由でユーザー初期化
    const result = await initializeUserData({ platform: 'web' })
    
    if (result.success) {
      console.log('User initialized via Firebase Functions:', result.userData)
      
      // Supabase user_profilesテーブルにも初期プロファイルを作成
      await createSupabaseUserProfile(firebaseUser, result.userData)
      
      // 既存ユーザーの場合、Web版ログイン時刻のみ更新
      if (result.message === 'User already initialized') {
        const userRef = doc(db, 'users', firebaseUser.uid)
        await updateDoc(userRef, {
          'webProfile.lastWebLogin': serverTimestamp(),
          updatedAt: serverTimestamp(),
          emailVerified: firebaseUser.emailVerified
        })
      }
    } else {
      throw new Error(`Failed to initialize user: ${result.message}`)
    }
  } catch (error) {
    console.error('Error creating/updating user via Functions:', error)
    throw error
  }
}

/**
 * Supabase user_profilesテーブルに初期プロファイルを作成
 */
const createSupabaseUserProfile = async (
  firebaseUser: FirebaseUser,
  livalUserData?: LivalUser
): Promise<void> => {
  try {
    console.log('📝 Creating Supabase user profile for:', firebaseUser.uid)
    
    // Firebase Firestoreのデータから初期値を設定
    const profileData = {
      uid: firebaseUser.uid,
      display_name: firebaseUser.displayName || livalUserData?.displayName || firebaseUser.email?.split('@')[0] || '',
      deviation_score: 50, // デフォルト偏差値
      // 他のフィールドはnullまたは未設定のままにして、後から設定可能にする
      grade: null,
      diag_rslt: null,
      diag_rslt_desc: null,
      target_universities: null,
      career_interests: null,
      avg_study_min: null,
      prefers_video: null,
      prefers_text: null,
      recency_mark: null
    }

    const result = await upsertUserProfile(profileData)
    
    if (result) {
      console.log('✅ Supabase user profile created successfully:', result.uid)
    } else {
      console.warn('⚠️ Failed to create Supabase user profile, but continuing...')
    }
  } catch (error) {
    console.error('❌ Error creating Supabase user profile:', error)
    // Supabase側のエラーでFirebase認証を止めないように、エラーをスローしない
    console.warn('⚠️ Continuing despite Supabase profile creation error')
  }
}

/**
 * ログイン時にSupabaseユーザープロファイルの存在を確認し、ない場合は作成
 */
export const ensureSupabaseUserProfile = async (
  firebaseUser: FirebaseUser,
  livalUserData?: LivalUser
): Promise<void> => {
  // 重複実行を避けるための簡易ガード（同UIDの連続チェックを抑止）
  const uid = firebaseUser.uid
  if (profileEnsureGuard.shouldSkip(uid)) {
    return
  }
  profileEnsureGuard.mark(uid)
  try {
    console.log('🔍 Checking Supabase user profile for:', uid)
    
    // 既存のSupabaseプロファイルをチェック
    const existingProfile = await getUserProfile(uid)
    
    if (existingProfile) {
      console.log('✅ Supabase user profile already exists:', existingProfile.uid)
      return
    }
    
    console.log('📝 Supabase user profile not found, creating new one...')
    
    // プロファイルが存在しない場合は作成
    await createSupabaseUserProfile(firebaseUser, livalUserData)
    
    console.log('✅ Supabase user profile ensured for existing user')
  } catch (error) {
    console.error('❌ Error ensuring Supabase user profile:', error)
    // エラーが発生してもアプリケーション全体を停止しない
    console.warn('⚠️ Continuing despite Supabase profile ensure error')
  }
}

// 同一UIDの短時間の重複実行を抑止するガード
const profileEnsureGuard = (() => {
  const lastRun = new Map<string, number>()
  const WINDOW_MS = 10_000 // 10秒間は再実行を抑止
  return {
    shouldSkip(uid: string) {
      const now = Date.now()
      const ts = lastRun.get(uid)
      return ts !== undefined && (now - ts) < WINDOW_MS
    },
    mark(uid: string) {
      lastRun.set(uid, Date.now())
    }
  }
})()

/**
 * ユーザープロフィールを更新
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<LivalUser>
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

/**
 * Firebase Authenticationのプロフィールも同時更新
 */
export const updateAuthProfile = async (
  firebaseUser: FirebaseUser,
  updates: { displayName?: string; photoURL?: string }
): Promise<void> => {
  await updateProfile(firebaseUser, updates)
}

/**
 * ユーザーデータを取得
 */
export const getUserData = async (uid: string): Promise<LivalUser | null> => {
  try {
    console.log('🔍 Getting user data for UID:', uid)
    const userRef = doc(db, 'users', uid)
    console.log('📄 Firestore reference created:', userRef.path)
    
    const userSnap = await getDoc(userRef)
    console.log('📋 Document snapshot exists:', userSnap.exists())
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as LivalUser
      console.log('✅ User data retrieved successfully:', {
        email: userData.email,
        displayName: userData.displayName,
        hasSubscription: !!userData.subscription,
        hasWebProfile: !!userData.webProfile
      })
      return userData
    }
    
    console.log('❌ User document does not exist')
    return null
  } catch (error) {
    console.error('🚨 Error getting user data:', error)
    throw error
  }
}

/**
 * サブスクリプション情報を更新
 */
export const updateSubscription = async (
  uid: string,
  subscription: Partial<UserSubscription>
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  
  await updateDoc(userRef, {
    subscription: {
      ...subscription
    },
    updatedAt: serverTimestamp()
  })
}

/**
 * Web版設定を更新
 */
export const updateWebProfile = async (
  uid: string,
  webProfile: Partial<WebProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  
  await updateDoc(userRef, {
    webProfile: {
      ...webProfile
    },
    updatedAt: serverTimestamp()
  })
}
