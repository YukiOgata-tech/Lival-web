import PlannerChatHeader from '@/components/agent/planner/PlannerChatHeader'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // この配下ではグローバルのヘッダー/フッターは非表示（ConditionalLayoutで制御）
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 専用ヘッダー（Planner 固定） */}
      <PlannerChatHeader />
      <main>{children}</main>
    </div>
  )
}
