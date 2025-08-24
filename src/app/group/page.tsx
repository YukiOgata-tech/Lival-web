// src/app/group/page.tsx

import { Metadata } from 'next'
import GroupFeatureIntro from '@/components/group/GroupFeatureIntro'

export const metadata: Metadata = {
  title: 'グループ学習 | Lival AI',
  description: 'モバイルアプリでグループ学習機能をご利用いただけます。仲間と一緒に効率的な学習を体験しましょう。',
}

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GroupFeatureIntro />
    </div>
  )
}