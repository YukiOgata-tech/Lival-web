// src/lib/firebase/admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK
const apps = getApps()

function normalizePrivateKey(): string | undefined {
  let key = process.env.FIREBASE_PRIVATE_KEY
  // Optional: support base64-encoded key as a fallback
  if (!key && process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    try {
      key = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8')
    } catch {
      // ignore decode error; will surface as undefined later
    }
  }
  if (!key) return undefined
  // Strip surrounding quotes if present and normalize newlines
  key = key.trim()
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  key = key.replace(/\\r/g, '')
  key = key.replace(/\\n/g, '\n')
  return key
}

const firebaseAdminApp = apps.length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: normalizePrivateKey(),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  : apps[0]

export const adminDb = getFirestore(firebaseAdminApp)
export const adminStorage = getStorage(firebaseAdminApp)
export const adminAuth = getAuth(firebaseAdminApp)

export default firebaseAdminApp
