import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Tutor AI - 家庭教師AI',
  description: '24時間365日対応の個人家庭教師AI。質問・画像解析・学習サポートを提供します。',
}

export default function TutorThreadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  )
}

