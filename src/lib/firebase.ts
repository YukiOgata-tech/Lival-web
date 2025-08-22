// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebase設定の検証
const validateFirebaseConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId']
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig])
  
  if (missingKeys.length > 0) {
    console.error('🚨 Missing Firebase configuration:', missingKeys)
    console.error('Please check your .env.local file')
    return false
  }
  
  console.log('✅ Firebase configuration is valid')
  console.log('📋 Project ID:', firebaseConfig.projectId)
  return true
}

validateFirebaseConfig()

// Firebase App の初期化（重複初期化を防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Firebase Services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// 開発環境でのエミュレーター接続（本番では実行されない）
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
  
//   if (useEmulator) {
//     try {
//       // Auth Emulator
//       if (!auth.config.emulator) {
//         connectAuthEmulator(auth, 'http://localhost:9099')
//       }
      
//       // Firestore Emulator
//       if (!db._delegate._databaseId.projectId.includes('demo-')) {
//         connectFirestoreEmulator(db, 'localhost', 8080)
//       }
      
//       // Storage Emulator
//       if (!storage._bucket) {
//         connectStorageEmulator(storage, 'localhost', 9199)
//       }
      
//       // Functions Emulator
//       connectFunctionsEmulator(functions, 'localhost', 5001)
      
//       console.log('🔧 Firebase Emulators connected')
//     } catch (error) {
//       console.warn('Firebase Emulator connection failed:', error)
//     }
//   }
// }

// Firebase App のエクスポート
export default app

// ヘルパー関数
export const isEmulatorMode = () => {
  return process.env.NODE_ENV === 'development' && 
         process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
}

// エラーハンドリング用ヘルパー
export const getFirebaseErrorMessage = (error: unknown): string => {
  const errorCode = (error as { code?: string }).code
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません'
    case 'auth/wrong-password':
      return 'パスワードが間違っています'
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています'
    case 'auth/weak-password':
      return 'パスワードが弱すぎます'
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません'
    case 'permission-denied':
      return 'アクセス権限がありません'
    case 'not-found':
      return 'データが見つかりません'
    case 'already-exists':
      return 'データが既に存在します'
    default:
      return (error as { message?: string }).message || '予期しないエラーが発生しました'
  }
}