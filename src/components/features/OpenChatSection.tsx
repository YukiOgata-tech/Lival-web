'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Users, ShieldCheck, Zap } from 'lucide-react'

export default function OpenChatSection() {
  return (
    <section className="py-10 md:py-16 px-3 md:px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs md:text-sm font-semibold mb-3 md:mb-4">
              <Zap className="w-4 h-4" />
              <span>次の一歩（予告）</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 md:mb-4">
              会員限定のLINEオープンチャットで、<br className="hidden md:block" />
              AIで解決しきれない問題にもプロが伴走
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-3xl mb-5 md:mb-6">
              Tutor AIでほとんどの疑問はその場で解決できます。それでも難しい問題や、答案の添削・表現の工夫など「人の目」が必要な場面のために、
              会員だけが参加できる招待制のLINEオープンチャットを準備中です。現役のプロ講師が複数人体制で、あなたの学びをしっかり支えます。
            </p>

            {/* ポイント群 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
              <Feature icon={<Users className="w-4 h-4" />} title="会員限定・招待制">
                安心のクローズド空間で質問や相談ができます。
              </Feature>
              <Feature icon={<MessageCircle className="w-4 h-4" />} title="写真・動画でも相談OK">
                宿題や答案の写真を送って具体的なアドバイス。
              </Feature>
              <Feature icon={<ShieldCheck className="w-4 h-4" />} title="現役プロが複数名で対応">
                シフト制で素早いレスポンスを目指します。
              </Feature>
            </div>

            {/* 補足とCTA（レスポンシブ配慮） */}
            <details className="md:hidden mb-4">
              <summary className="cursor-pointer select-none text-emerald-700 underline text-sm">くわしい説明を見る</summary>
              <div className="mt-2 text-gray-700 text-sm">
                学校や塾の課題、記述式の表現、学習方法の相談、進路の悩みなど、人だからこそ寄り添えるテーマにも対応します。
                AIとプロのハイブリッドで、学びの安心と成果をさらに高めます。
              </div>
            </details>
            <div className="hidden md:block text-gray-700 text-sm mb-2">
              学校や塾の課題、記述式の表現、学習方法の相談、進路の悩みなど、人だからこそ寄り添えるテーマにも対応します。
              AIとプロのハイブリッドで、学びの安心と成果をさらに高めます。
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                会員登録して最新情報を受け取る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-300 px-5 py-3 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
              >
                詳細を問い合わせる
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white/60 p-3"
    >
      <div className="mt-0.5 text-emerald-700">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900 text-sm">{title}</div>
        <div className="text-gray-600 text-xs mt-0.5">{children}</div>
      </div>
    </motion.div>
  )
}

