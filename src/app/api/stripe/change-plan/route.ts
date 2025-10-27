import { NextResponse } from 'next/server'
import { assertStripeEnv, getStripe, updateFirestoreSubscription } from '@/lib/stripe/server'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Firebase Admin初期化
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

type ChangePlanBody = {
  newPriceId: string  // 変更先のStripe Price ID
}

export async function POST(req: Request) {
  try {
    assertStripeEnv()

    // 認証チェック
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    let decodedToken

    try {
      decodedToken = await getAuth().verifyIdToken(idToken)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid
    const body = (await req.json()) as ChangePlanBody
    const { newPriceId } = body || {}

    if (!newPriceId || typeof newPriceId !== 'string') {
      return NextResponse.json({ error: 'newPriceId is required' }, { status: 400 })
    }

    // Firestoreからユーザー情報取得
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const subscriptionId = userData?.subscription?.stripeSubscriptionId

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe first.' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // 現在のサブスクリプションを取得
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId)

    // 現在のプランと新しいプランを判定
    const currentPriceId = currentSubscription.items.data[0].price.id
    const isUpgrade =
      currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC &&
      newPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM
    const isDowngrade =
      currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM &&
      newPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC

    let updatedSubscription: Stripe.Subscription

    if (isUpgrade) {
      // 【アップグレード】即座に差額を請求
      console.log(`⬆️ Upgrading user ${userId} - charging prorated amount immediately`)

      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'always_invoice',  // 即座に請求書作成
        billing_cycle_anchor: 'unchanged',  // 請求サイクルは変更しない
        metadata: {
          firebaseUID: userId,
          changedAt: new Date().toISOString(),
          changeType: 'upgrade'
        }
      })

      // 作成された請求書を即座に決済
      const latestInvoiceId = updatedSubscription.latest_invoice as string | null
      if (latestInvoiceId) {
        try {
          // 請求書を取得
          const invoice = await stripe.invoices.retrieve(latestInvoiceId)

          // draft状態の場合は確定して決済
          if (invoice.status === 'draft') {
            await stripe.invoices.finalizeInvoice(latestInvoiceId)
            await stripe.invoices.pay(latestInvoiceId)
            console.log(`💰 Upgrade invoice paid immediately: ${latestInvoiceId}`)
          } else if (invoice.status === 'open') {
            // open状態の場合は決済のみ
            await stripe.invoices.pay(latestInvoiceId)
            console.log(`💰 Upgrade invoice paid: ${latestInvoiceId}`)
          }
        } catch (error) {
          console.error('⚠️ Error paying upgrade invoice:', error)
          // エラーでも処理は続行（webhookで後から処理される）
        }
      }

    } else if (isDowngrade) {
      // 【ダウングレード】次回請求日から変更（今月は現プランのまま）
      console.log(`⬇️ Downgrading user ${userId} - change will apply at period end`)

      // Subscription Scheduleを使用して次回から変更
      try {
        // 既存のScheduleがあるか確認
        const existingSchedules = await stripe.subscriptionSchedules.list({
          customer: currentSubscription.customer as string,
          limit: 1
        })

        let scheduleId: string | null = null

        if (existingSchedules.data.length > 0 && existingSchedules.data[0].status === 'active') {
          // 既存のScheduleを更新
          scheduleId = existingSchedules.data[0].id
          await stripe.subscriptionSchedules.update(scheduleId, {
            phases: [
              {
                // 現在の期間は現プランのまま
                start_date: currentSubscription.current_period_start,
                end_date: currentSubscription.current_period_end,
                items: [{ price: currentPriceId }],
              },
              {
                // 次回請求日から新プラン
                start_date: currentSubscription.current_period_end,
                items: [{ price: newPriceId }],
              }
            ],
            metadata: {
              firebaseUID: userId,
              changeType: 'downgrade'
            }
          })
        } else {
          // 新しいScheduleを作成
          const schedule = await stripe.subscriptionSchedules.create({
            from_subscription: subscriptionId,
            phases: [
              {
                // 現在の期間は現プランのまま
                start_date: currentSubscription.current_period_start,
                end_date: currentSubscription.current_period_end,
                items: [{ price: currentPriceId }],
              },
              {
                // 次回請求日から新プラン
                start_date: currentSubscription.current_period_end,
                items: [{ price: newPriceId }],
              }
            ],
            metadata: {
              firebaseUID: userId,
              changeType: 'downgrade'
            }
          })
          scheduleId = schedule.id
        }

        console.log(`📅 Downgrade scheduled: ${scheduleId}`)

        // 最新のサブスクリプション情報を取得
        updatedSubscription = await stripe.subscriptions.retrieve(subscriptionId)

      } catch (error) {
        console.error('Error creating schedule, falling back to immediate change:', error)

        // Scheduleの作成に失敗した場合は即座に変更（フォールバック）
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: currentSubscription.items.data[0].id,
              price: newPriceId,
            },
          ],
          proration_behavior: 'none',  // 日割り計算なし
          metadata: {
            firebaseUID: userId,
            changedAt: new Date().toISOString(),
            changeType: 'downgrade'
          }
        })
      }

    } else {
      // その他のプラン変更（同じプランへの変更など）
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
        metadata: {
          firebaseUID: userId,
          changedAt: new Date().toISOString()
        }
      })
    }

    // Firestoreを更新
    await updateFirestoreSubscription(userId, updatedSubscription)

    console.log(`✅ Plan changed for user ${userId}:`, {
      subscriptionId,
      newPriceId,
      changeType: isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'other'
    })

    return NextResponse.json({
      success: true,
      message: 'Plan changed successfully',
      changeType: isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'other',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodEnd: updatedSubscription.current_period_end
      }
    })
  } catch (err: any) {
    console.error('Change plan error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
