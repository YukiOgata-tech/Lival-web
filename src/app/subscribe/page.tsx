"use client"

import SubscribeForm from '@/components/payments/SubscribeForm'

export default function SubscribePage() {
  // TODO: Replace with your real price ID from Stripe dashboard
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Subscribe</h1>
      {!priceId ? (
        <p className="text-sm text-red-600">
          Missing NEXT_PUBLIC_STRIPE_PRICE_ID. Set it in .env.local
        </p>
      ) : (
        <SubscribeForm priceId={priceId} />
      )}
      <p className="text-xs text-gray-500">
        Payments are secured by Stripe. Card details never touch our servers.
      </p>
    </main>
  )
}

