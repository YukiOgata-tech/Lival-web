// src/lib/user.ts
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile, User as FirebaseUser } from 'firebase/auth'
import { db } from './firebase'
import { LivalUser, UserSubscription, WebProfile } from '@/types'

/**
 * Web版新規登録時のデフォルトユーザーデータ作成
 */
export const createDefaultUserData = (email: string, displayName?: string): Omit<LivalUser, 'createdAt' | 'updatedAt'> => ({
  // 基本プロフィール
  bio: '',
  birthday: null,
  displayName: displayName || email.split('@')[0],
  email,
  emailVerified: false,
  gender: null,
  photoURL: '',
  
  // ゲーミフィケーション要素
  coins: 0,
  xp: 0,
  level: 1,
  currentMonsterId: 'monster-01', // デフォルトキャラクター
  
  // 学習データ
  groupSessionCount: 0,
  groupTotalMinutes: 0,
  individualSessionCount: 0,
  individualTotalMinutes: 0,
  
  // Web版拡張フィールド
  subscription: {
    plan: 'free_web',
    status: 'active',
    currentPeriodStart: serverTimestamp() as unknown as Timestamp,
    currentPeriodEnd: null
  },
  webProfile: {
    lastWebLogin: serverTimestamp() as unknown as Timestamp,
    isWebUser: true,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'ja'
    }
  }
})

/**
 * 新規ユーザーをFirestoreに作成または更新
 */
export const createUserInFirestore = async (
  firebaseUser: FirebaseUser,
  additionalData?: Partial<LivalUser>
): Promise<void> => {
  if (!firebaseUser.email) {
    throw new Error('ユーザーのメールアドレスが取得できません')
  }

  const userRef = doc(db, 'users', firebaseUser.uid)
  
  try {
    // 既存ユーザーの確認
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const existingData = userSnap.data() as LivalUser
      
      // 既存ユーザーでもWeb版フィールドがない場合は追加
      const hasWebProfile = existingData.webProfile && existingData.subscription
      
      if (!hasWebProfile) {
        console.log('Existing user without web profile, adding web fields...')
        const webFields = {
          subscription: {
            plan: 'free_web' as const,
            status: 'active' as const,
            currentPeriodStart: serverTimestamp() as unknown as Timestamp,
            currentPeriodEnd: null
          },
          webProfile: {
            lastWebLogin: serverTimestamp() as unknown as Timestamp,
            isWebUser: true,
            preferences: {
              theme: 'light' as const,
              notifications: true,
              language: 'ja' as const
            }
          },
          updatedAt: serverTimestamp()
        }
        
        await updateDoc(userRef, webFields)
      } else {
        // Web版ログイン時刻のみ更新
        await updateDoc(userRef, {
          'webProfile.lastWebLogin': serverTimestamp(),
          updatedAt: serverTimestamp(),
          emailVerified: firebaseUser.emailVerified
        })
      }
      return
    }

    // 新規ユーザーの場合はデフォルトデータで作成
    console.log('Creating new user in Firestore...')
    const defaultData = createDefaultUserData(firebaseUser.email, firebaseUser.displayName || undefined)
    const userData: LivalUser = {
      ...defaultData,
      ...additionalData,
      createdAt: serverTimestamp() as unknown as Timestamp,
      updatedAt: serverTimestamp() as unknown as Timestamp,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified
    }

    await setDoc(userRef, userData)
    console.log('New user created successfully in Firestore')
  } catch (error) {
    console.error('Error creating/updating user in Firestore:', error)
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