import { Metadata, Viewport } from 'next'
import PlannerChatHeader from '@/components/agent/planner/PlannerChatHeader'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Planner AI - 学習プランナーAI',
  description: '個人に最適化された学習計画を作成・管理する学習プランナーAI。目標達成をサポートします。',
}

export default function PlannerThreadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PlannerChatHeader />
      <main>{children}</main>
    </div>
  )
}

