'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

// lottie-react を使用してローダーを表示（JSONが読み込めない場合は簡易フォールバック）
export default function LottieLoader({ size = 28 }: { size?: number }) {
  const [anim, setAnim] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/lotties/4circle-loader.json')
      .then((r) => r.json())
      .then((j) => {
        if (mounted) setAnim(j)
      })
      .catch(() => setAnim(null))
    return () => {
      mounted = false
    }
  }, [])

  if (anim) {
    return <Lottie animationData={anim} loop autoplay style={{ width: size, height: size }} />
  }

  return (
    <div className="inline-flex items-center gap-2">
      {[-0.3, -0.15, 0, 0.15].map((d, i) => (
        <span
          key={i}
          className="animate-bounce rounded-full bg-gray-400"
          style={{ width: Math.max(6, size / 5), height: Math.max(6, size / 5), animationDelay: `${d}s` }}
        />
      ))}
    </div>
  )
}
