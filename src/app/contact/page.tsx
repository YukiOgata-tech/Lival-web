import type { Metadata } from 'next'
import Link from 'next/link'
import AboutContactSection from '@/components/sections/about-related/AboutContactSection'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'Lival AI へのお問い合わせはこちらから。サービスに関するご質問・導入のご相談・メディア取材など、お気軽にご連絡ください。',
}

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gray-900 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">お問い合わせ</h1>
          <p className="mt-3 text-gray-300">
            サービスに関するご質問・導入のご相談・メディア取材など、お気軽にご連絡ください。
          </p>
        </div>
      </section>

      {/* FAQ 推奨セクション */}
      <section className="bg-gray-900 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">まずは FAQ をご確認ください</h2>
            <p className="text-gray-300 mb-4">よくあるご質問で多くの疑問が短時間で解決できます。</p>
            <div className="flex justify-center">
              <Link
                href="/faq"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                FAQを見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 既存の問い合わせセクション（Resend 経由で送信） */}
      <AboutContactSection />
    </main>
  )
}
