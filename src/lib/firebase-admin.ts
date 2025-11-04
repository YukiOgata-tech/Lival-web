import type { ServiceAccount } from 'firebase-admin'
import admin from 'firebase-admin'

let adminApp: admin.app.App | null = null

try {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (projectId && clientEmail && privateKey) {
    const cred: ServiceAccount = { projectId, clientEmail, privateKey }
    adminApp = admin.apps.length ? admin.app() : admin.initializeApp({ credential: admin.credential.cert(cred) })
  }
} catch (e) {
  // No admin credentials; admin features disabled gracefully
}

export const adminDb: admin.firestore.Firestore | null = adminApp ? adminApp.firestore() : null

