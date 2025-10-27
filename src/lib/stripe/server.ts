import Stripe from 'stripe'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

let cachedStripe: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY env')
  if (!cachedStripe) {
    cachedStripe = new Stripe(key, { apiVersion: '2024-06-20' })
  }
  return cachedStripe
}

export function assertStripeEnv() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY env')
  }
}

/**
 * Firebase UID から Stripe Customer ID を取得
 * 存在しない場合は新規作成
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  displayName?: string
): Promise<string> {
  const stripe = getStripe()

  // Firestoreからユーザー情報取得
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User not found in Firestore')
  }

  const userData = userSnap.data()
  const existingCustomerId = userData.subscription?.stripeCustomerId

  // 既存のCustomer IDがあれば確認して返す
  if (existingCustomerId) {
    console.log('✅ Existing Stripe customer found:', existingCustomerId)

    // 既存顧客の preferred_locales を確認・更新
    try {
      const customer = await stripe.customers.retrieve(existingCustomerId)
      if (!customer.deleted && (!customer.preferred_locales || !customer.preferred_locales.includes('ja'))) {
        console.log('📝 Updating existing customer locale to Japanese')
        await stripe.customers.update(existingCustomerId, {
          preferred_locales: ['ja']
        })
        console.log('✅ Customer locale updated to Japanese')
      }
    } catch (error) {
      console.error('Error updating customer locale:', error)
      // エラーでも処理を続行
    }

    return existingCustomerId
  }

  // 新規Customer作成
  console.log('📝 Creating new Stripe customer for user:', userId)
  const customer = await stripe.customers.create({
    email,
    name: displayName || email.split('@')[0],
    preferred_locales: ['ja'],  // 請求書を日本語化
    metadata: {
      firebaseUID: userId,
      platform: 'web'
    }
  })

  // FirestoreにCustomer IDを保存
  await updateDoc(userRef, {
    'subscription.stripeCustomerId': customer.id,
    updatedAt: serverTimestamp()
  })

  console.log('✅ New Stripe customer created:', customer.id)
  return customer.id
}

/**
 * Stripe Subscription情報をFirestoreに保存
 */
export async function updateFirestoreSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const userRef = doc(db, 'users', userId)

  // サブスクリプションステータスの変換
  let status: 'active' | 'canceled' | 'past_due' | 'trial'
  switch (subscription.status) {
    case 'active':
      status = 'active'
      break
    case 'canceled':
    case 'unpaid':
      status = 'canceled'
      break
    case 'past_due':
      status = 'past_due'
      break
    case 'trialing':
      status = 'trial'
      break
    default:
      status = 'canceled'
  }

  // Priceからプランを判定
  const priceId = subscription.items.data[0]?.price.id
  let plan: 'free_web' | 'basic' | 'premium' = 'free_web'

  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC) {
    plan = 'basic'
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM) {
    plan = 'premium'
  }

  // キャンセル予定日の処理
  const cancelAt = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000)
    : null

  // トライアル終了日の処理
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null

  await updateDoc(userRef, {
    'subscription.plan': plan,
    'subscription.status': status,
    'subscription.stripeCustomerId': subscription.customer as string,
    'subscription.stripeSubscriptionId': subscription.id,
    'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.cancelAt': cancelAt,
    'subscription.trialEnd': trialEnd,
    updatedAt: serverTimestamp()
  })

  console.log(`✅ Firestore subscription updated for user ${userId}:`, {
    plan,
    status,
    subscriptionId: subscription.id
  })
}

/**
 * StripeのCustomerメタデータからFirebase UIDを取得
 */
export async function getUserIdFromStripeCustomer(
  customerId: string
): Promise<string | null> {
  const stripe = getStripe()

  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) return null

    return (customer.metadata?.firebaseUID as string) || null
  } catch (error) {
    console.error('Error retrieving customer:', error)
    return null
  }
}
