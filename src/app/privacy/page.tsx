'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, Eye, Users, AlertCircle, CheckCircle, Calendar, Mail } from 'lucide-react'

const sections = [
  {
    id: 'overview',
    title: '1. 基本方針',
    icon: Shield,
    content: `LIVAL AI（以下「当社」）は、パーソナルAIコーチングサービスの提供にあたり、利用者の皆様の個人情報保護の重要性を深く認識し、適切な取り扱いを行います。

当社は、教育という重要な分野で事業を行う責任を自覚し、特に学習者の個人情報については、最高水準のセキュリティと透明性をもって保護いたします。`
  },
  {
    id: 'collection',
    title: '2. 収集する個人情報',
    icon: Eye,
    content: `当社では、サービス提供のために以下の個人情報を収集いたします：

**基本情報**
• 氏名、メールアドレス、生年月日
• 学年、学校名（任意）
• 保護者の連絡先（18歳未満の場合）

**学習関連情報**
• 性格診断結果・学習タイプ
• 学習履歴・進捗データ
• AIとの会話履歴
• 学習時間・頻度
• 成績・テスト結果（任意）

**技術情報**
• IPアドレス、デバイス情報
• アプリ利用状況・ログデータ
• Cookie情報

**その他**
• お問い合わせ内容
• アンケート・フィードバック`
  },
  {
    id: 'purpose',
    title: '3. 利用目的',
    icon: Users,
    content: `収集した個人情報は、以下の目的でのみ利用いたします：

**サービス提供**
• パーソナライズされたAIコーチング
• 学習計画の作成・最適化
• 進捗レポートの生成
• 学習コンテンツの推奨

**サービス改善**
• AI機能の向上・最適化
• ユーザー体験の改善
• 新機能の開発・テスト
• システムの安定性向上

**コミュニケーション**
• サービスに関する重要なお知らせ
• カスタマーサポート
• アンケート・フィードバック依頼
• 新機能のご案内（同意のある場合のみ）

**法的義務の履行**
• 法令に基づく対応
• 利用規約違反への対処`
  },
  {
    id: 'sharing',
    title: '4. 第三者提供',
    icon: Lock,
    content: `当社は、以下の場合を除き、個人情報を第三者に提供いたしません：

**提供しない原則**
• 利用者の同意なく第三者に販売・譲渡しません
• マーケティング目的での外部提供は行いません
• 学習データの商用利用は一切いたしません

**例外的な提供**
• 利用者の明示的な同意がある場合
• 法令に基づく要請がある場合
• 生命・身体の安全のために必要な場合
• 業務委託先への提供（適切な管理下）

**業務委託先**
• クラウドサービス提供者（Firebase等）
• システム開発・保守業者
• カスタマーサポート業者
※全ての委託先と秘密保持契約を締結`
  },
  {
    id: 'minors',
    title: '5. 未成年者の保護',
    icon: AlertCircle,
    content: `当社は、18歳未満の利用者について特別な保護措置を講じます：

**保護者の同意**
• 13歳未満：保護者の同意必須
• 13-17歳：保護者への通知推奨
• 保護者による利用状況確認可能

**データの制限**
• 必要最小限の情報のみ収集
• センシティブな学習データの慎重な取り扱い
• チャット履歴の定期的な確認・監視

**安全対策**
• 不適切なコンテンツのフィルタリング
• 学習時間の適切な管理
• 緊急時の保護者への連絡体制`
  },
  {
    id: 'security',
    title: '6. セキュリティ対策',
    icon: Shield,
    content: `当社は、個人情報の安全管理のため以下の措置を実施しています：

**技術的対策**
• SSL/TLS暗号化通信
• データベースの暗号化
• 多要素認証システム
• 定期的なセキュリティ監査

**組織的対策**
• 個人情報保護責任者の設置
• 従業員への教育・研修
• アクセス権限の適切な管理
• インシデント対応体制

**物理的対策**
• データセンターの物理セキュリティ
• 定期的なバックアップ
• 災害対策・事業継続計画`
  },
  {
    id: 'retention',
    title: '7. 保存期間',
    icon: Calendar,
    content: `個人情報の保存期間は以下の通りです：

**アカウント情報**
• 利用期間中および退会後1年間
• 法令で定められた期間（該当する場合）

**学習データ**
• 利用期間中および退会後6ヶ月間
• 統計データ化後の匿名情報は長期保存

**コミュニケーション履歴**
• お問い合わせ：対応完了後3年間
• チャット履歴：利用期間中および退会後3ヶ月間

**技術データ**
• ログデータ：6ヶ月間
• アクセス解析データ：1年間（匿名化）`
  },
  {
    id: 'rights',
    title: '8. 利用者の権利',
    icon: CheckCircle,
    content: `利用者は、自身の個人情報について以下の権利を有します：

**アクセス権**
• 個人情報の開示請求
• 利用目的の確認
• 第三者提供状況の確認

**訂正・削除権**
• 不正確な情報の訂正請求
• 不要な情報の削除請求
• 利用停止請求

**データポータビリティ**
• 学習データのエクスポート
• 他サービスへのデータ移行支援

**異議申し立て権**
• 処理に対する異議申し立て
• 自動化された意思決定への異議

これらの権利行使をご希望の場合は、お問い合わせフォームまたは以下の連絡先までご連絡ください。`
  },
  {
    id: 'updates',
    title: '9. ポリシーの変更',
    icon: Calendar,
    content: `当社は、法令の変更やサービスの改善に伴い、本プライバシーポリシーを変更する場合があります：

**変更の通知**
• 重要な変更：30日前に事前通知
• 軽微な変更：サイト上での公表
• メール・アプリ内通知による告知

**変更の効力**
• 変更後も継続利用で同意とみなす
• 同意いただけない場合は退会可能
• 変更前データは旧ポリシーで保護

**履歴の管理**
• 過去のポリシーバージョンを保管
• 変更履歴をサイト上で公開`
  },
  {
    id: 'contact',
    title: '10. お問い合わせ',
    icon: Mail,
    content: `個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：

**個人情報保護責任者**
LIVAL AI 個人情報保護担当
Email: privacy@lival-ai.com

**お問い合わせ窓口**
営業時間：平日10:00-18:00
Email: support@lival-ai.com
電話：03-XXXX-XXXX

**所在地**
〒XXX-XXXX
東京都渋谷区XXX X-X-X

お問い合わせをいただいた場合、原則として5営業日以内にご回答いたします。`
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              プライバシーポリシー
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              LIVAL AIにおける個人情報の取り扱いについて
            </p>
            <div className="mt-6 text-sm text-blue-200">
              最終更新日：2025年8月20日 | 施行日：2025年8月15日
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
            className="mb-12 bg-blue-50 rounded-2xl p-8 border border-blue-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">はじめに</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              LIVAL AI（株式会社LIVAL AI）は、パーソナルAIコーチングサービス「LIVAL AI」の提供にあたり、
              利用者の皆様の個人情報を適切に保護することを最重要課題と認識しております。
            </p>
            <p className="text-gray-700 leading-relaxed">
              本プライバシーポリシーは、当社がどのような個人情報を収集し、どのように利用・保護するかを
              明確に説明するものです。サービスをご利用いただく前に、必ずお読みください。
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h3 key={pIndex} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                          {paragraph.replace(/\*\*/g, '')}
                        </h3>
                      )
                    } else if (paragraph.startsWith('•')) {
                      const items = paragraph.split('\n').filter(item => item.startsWith('•'))
                      return (
                        <ul key={pIndex} className="list-none space-y-2 mb-4">
                          {items.map((item, iIndex) => (
                            <li key={iIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{item.substring(2)}</span>
                            </li>
                          ))}
                        </ul>
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

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ご質問・ご不明な点がございましたら
            </h3>
            <p className="text-gray-700 mb-6">
              プライバシーポリシーについてご不明な点がございましたら、
              お気軽にお問い合わせください。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                お問い合わせ
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