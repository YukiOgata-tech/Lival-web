"use client"

import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

type Props = {
  priceId: string
  email?: string
}

function InnerForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      // If a redirect is needed (e.g., 3DS), Stripe will handle it.
      confirmParams: {
        return_url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
    })

    if (error) {
      setMessage(error.message || 'Payment failed')
    } else {
      setMessage('Payment processed. You will be updated shortly.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Subscribe'}
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  )
}

export default function SubscribeForm({ priceId, email }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load publishable key from env
  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!pk) return null
    return loadStripe(pk)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        setError(null)
        const res = await fetch('/api/stripe/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId, email }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to create subscription')
        setClientSecret(data.clientSecret)
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize')
      }
    }
    init()
  }, [priceId, email])

  if (!stripePromise) {
    return <p className="text-sm text-red-600">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</p>
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!clientSecret) return <p>Loading…</p>

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      <InnerForm />
    </Elements>
  )
}

