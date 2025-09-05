import TutorChatHeader from '@/components/agent/tutor/TutorChatHeader'

export default function TutorThreadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TutorChatHeader />
      <main>{children}</main>
    </div>
  )
}

