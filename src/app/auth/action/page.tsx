import { Suspense } from 'react'
import AuthActionClient from './AuthActionClient'

export const dynamic = 'force-dynamic'

export default function AuthActionPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-6">
      <Suspense fallback={
        <div className="max-w-md w-full text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700">読み込み中…</p>
          </div>
        </div>
      }>
        <AuthActionClient />
      </Suspense>
    </div>
  )
}
