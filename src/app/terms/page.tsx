'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, AlertTriangle, Users, CreditCard, Shield, Scale, Clock, Mail } from 'lucide-react'

const sections = [
  {
    id: 'overview',
    title: '第1条（本規約の適用）',
    icon: FileText,
    content: `1. 本利用規約（以下「本規約」）は、LIVAL AI（以下「当社」）が提供するパーソナルAIコーチングサービス「LIVAL AI」（以下「本サービス」）の利用条件を定めるものです。

2. 利用者は、本サービスを利用することによって、本規約に同意したものとみなされます。

3. 本規約に同意いただけない場合、本サービスをご利用いただくことはできません。`
  },
  {
    id: 'service',
    title: '第2条（サービス内容）',
    icon: Users,
    content: `1. 本サービスは、AIを活用したパーソナライズされた学習コーチングサービスです。

2. 主な機能は以下の通りです：
• 性格診断に基づく学習タイプの判定
• 個別最適化されたAIコーチング
• 学習計画の作成・管理
• 学習進捗の分析・レポート
• 24時間対応のAIサポート

3. サービス内容は、当社の判断により変更・追加・削除される場合があります。

4. 本サービスはオンラインでの提供となり、インターネット接続環境が必要です。`
  },
  {
    id: 'account',
    title: '第3条（アカウント登録）',
    icon: Users,
    content: `1. 本サービスの利用には、アカウント登録が必要です。

2. 登録時には、正確かつ最新の情報を提供してください。

3. 登録情報に変更が生じた場合は、速やかに更新してください。

4. アカウントのIDおよびパスワードの管理は、利用者の責任において行ってください。

5. 18歳未満の方が利用される場合は、保護者の同意が必要です。

6. 13歳未満の方の利用には、保護者による代理登録が必要です。`
  },
  {
    id: 'payment',
    title: '第4条（料金・支払い）',
    icon: CreditCard,
    content: `1. 本サービスの利用料金は、当社が別途定める料金表に従います。

2. 料金は月額制とし、毎月同日に自動的に課金されます。

3. 支払い方法は、クレジットカードまたは当社が指定する方法とします。

4. 料金の支払いが確認できない場合、サービスの利用を停止する場合があります。

5. 既にお支払いいただいた料金の返金は、原則として行いません。

6. 料金は事前の通知により変更される場合があります。`
  },
  {
    id: 'cancellation',
    title: '第5条（解約・退会）',
    icon: Clock,
    content: `1. 利用者はいつでも本サービスを解約することができます。

2. 解約手続きは、サービス内の設定画面または当社指定の方法で行ってください。

3. 解約後も、当月分の利用料金は返金されません。

4. 解約後、当社は利用者のアカウントおよびデータを削除する場合があります。

5. データの削除前に必要な情報はバックアップを取得してください。

6. 解約後のデータ復旧には応じかねます。`
  },
  {
    id: 'ai_disclaimer',
    title: '第6条（AIサービスに関する免責）',
    icon: AlertTriangle,
    content: `1. AIによる提案・回答は参考情報であり、絶対的な正確性を保証するものではありません。

2. 学習効果や成績向上を保証するものではなく、効果には個人差があります。

3. AIが生成するコンテンツについて、当社は完全性や適切性を保証しません。

4. 重要な判断や専門的な判断が必要な場合は、適切な専門家にご相談ください。

5. AIの技術的制約により、サービスが一時的に利用できない場合があります。

6. AI技術の改善に伴い、応答内容や機能が変更される場合があります。`
  },
  {
    id: 'data_usage',
    title: '第7条（データの利用）',
    icon: Shield,
    content: `1. 当社は、サービス提供のために利用者の学習データを収集・利用します。

2. 収集したデータは、以下の目的で利用されます：
• パーソナライズされたサービス提供
• AIモデルの改善・向上
• サービス品質の向上
• 統計データの作成（匿名化後）

3. 個人を特定可能な形での第三者への提供は行いません。

4. データの取り扱いについては、プライバシーポリシーをご確認ください。

5. 利用者は、自身のデータの利用停止を求めることができます。`
  },
  {
    id: 'prohibited',
    title: '第8条（禁止事項）',
    icon: AlertTriangle,
    content: `利用者は、以下の行為を行ってはなりません：

1. 法令に違反する行為
2. 当社または第三者の権利を侵害する行為
3. 不正アクセスやシステムへの攻撃
4. 虚偽の情報の登録・提供
5. 営利目的での無断利用
6. AIを悪用した不適切なコンテンツ生成
7. その他、当社が不適切と判断する行為

これらの行為が確認された場合、警告なくサービス利用を停止する場合があります。`
  },
  {
    id: 'liability',
    title: '第9条（免責・責任制限）',
    icon: Scale,
    content: `1. 当社は、本サービスの利用により生じた損害について、法令で定める場合を除き責任を負いません。

2. システム障害、通信障害等により本サービスが利用できない場合の責任は負いません。

3. 利用者同士または利用者と第三者間のトラブルについて、当社は責任を負いません。

4. 当社の責任は、損害の発生原因となった月の月額利用料相当額を上限とします。

5. 天災地変その他の不可抗力による損害については責任を負いません。`
  },
  {
    id: 'intellectual_property',
    title: '第10条（知的財産権）',
    icon: Shield,
    content: `1. 本サービスに関する知的財産権は、当社または正当な権利者に帰属します。

2. 利用者は、本サービスのコンテンツを無断で複製・転載・配布することはできません。

3. 利用者が投稿したコンテンツの著作権は利用者に帰属しますが、当社はサービス提供に必要な範囲で利用できるものとします。

4. 当社の事前の書面による同意なく、商用利用は禁止されています。`
  },
  {
    id: 'changes',
    title: '第11条（規約の変更）',
    icon: FileText,
    content: `1. 当社は、必要に応じて本規約を変更することがあります。

2. 重要な変更については、事前に利用者に通知します。

3. 軽微な変更については、サービス内またはウェブサイトでの公表をもって通知とします。

4. 変更後の規約は、通知または公表した日から効力を生じます。

5. 変更後も継続してサービスを利用された場合、変更に同意したものとみなします。`
  },
  {
    id: 'contact',
    title: '第12条（準拠法・管轄裁判所）',
    icon: Scale,
    content: `1. 本規約の解釈・適用については、日本法を準拠法とします。

2. 本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。

3. 本規約についてご不明な点がございましたら、以下までお問い合わせください：

**お問い合わせ先**
LIVAL AI カスタマーサポート
Email: support@lival-ai.com
営業時間: 平日 10:00-18:00`
  }
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              利用規約
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              LIVAL AIサービスご利用時の重要な取り決め
            </p>
            <div className="mt-6 text-sm text-gray-400">
              最終更新日：2024年12月21日 | 施行日：2024年4月1日
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 bg-blue-50 rounded-2xl p-8 border border-blue-100 mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ご利用前に必ずお読みください</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              この利用規約は、LIVAL AI（株式会社LIVAL AI）が提供するパーソナルAIコーチングサービスの
              利用条件を定めたものです。
            </p>
            <p className="text-gray-700 leading-relaxed">
              本サービスをご利用いただく前に、必ず全ての条項をお読みいただき、
              内容にご同意いただいた上でご利用ください。
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    if (paragraph.includes('•')) {
                      const lines = paragraph.split('\n')
                      const title = lines[0]
                      const items = lines.slice(1).filter(line => line.startsWith('•'))
                      
                      return (
                        <div key={pIndex}>
                          <p className="text-gray-700 leading-relaxed mb-3">{title}</p>
                          <ul className="list-none space-y-2 mb-4 ml-4">
                            {items.map((item, iIndex) => (
                              <li key={iIndex} className="flex items-start">
                                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700">{item.substring(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    } else {
                      return (
                        <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      )
                    }
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-8"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">重要なお知らせ</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• AIによる学習効果には個人差があり、成績向上を保証するものではありません</p>
                  <p>• サービスの利用には安定したインターネット接続環境が必要です</p>
                  <p>• 18歳未満の方は保護者の同意が必要です</p>
                  <p>• 本規約は予告なく変更される場合があります</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ご質問・ご不明な点がございましたら
            </h3>
            <p className="text-gray-700 mb-6">
              利用規約についてご不明な点がございましたら、
              お気軽にカスタマーサポートまでお問い合わせください。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-600 to-slate-700 text-white font-semibold rounded-full hover:from-gray-700 hover:to-slate-800 transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                お問い合わせ
              </Link>
              
              <Link
                href="/privacy"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                プライバシーポリシー
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                ホームに戻る
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}