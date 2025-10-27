'use client'

import { useEffect } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../../../public/lotties/4circle-loader.json'

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = '処理中...' }: LoadingOverlayProps) {
  // 画面遷移を防ぐ
  useEffect(() => {
    // スクロールを無効化
    document.body.style.overflow = 'hidden'

    // ブラウザバック・フォワードを防ぐ
    const preventNavigation = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', preventNavigation)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('beforeunload', preventNavigation)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
        <p className="text-sm text-gray-600">
          しばらくお待ちください...
        </p>
      </div>
    </div>
  )
}
