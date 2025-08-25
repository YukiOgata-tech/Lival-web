// src/lib/user.ts
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile, User as FirebaseUser } from 'firebase/auth'
import { db } from './firebase'
import { LivalUser, UserSubscription, WebProfile } from '@/types'
import { initializeUserData } from './firebase/user-initialization'

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