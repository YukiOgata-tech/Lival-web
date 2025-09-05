import PlannerChatHeader from '@/components/agent/planner/PlannerChatHeader'

export default function PlannerThreadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PlannerChatHeader />
      <main>{children}</main>
    </div>
  )
}

