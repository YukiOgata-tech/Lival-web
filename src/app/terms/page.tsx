import { Metadata } from 'next'
import { ArrowLeft, Scale, Shield, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約 | LIVAL AI',
  description: 'LIVAL AI（リバル エーアイ）の利用規約です。サービスをご利用いただく前に必ずお読みください。',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              トップページに戻る
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Scale className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">利用規約</h1>
              <p className="text-gray-600">Terms of Service</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            最終更新日：2024年12月1日　｜　施行日：2024年6月1日
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* 前文 */}
          <div className="mb-12">
            <p className="text-gray-700 leading-relaxed">
              本利用規約（以下「本規約」）は、LIVAL AI（以下「当社」）が提供するサービス「LIVAL AI」（以下「本サービス」）の利用に関する条件を定めるものです。
              本サービスをご利用いただく際には、本規約に同意いただく必要があります。
            </p>
          </div>

          {/* 目次 */}
          <div className="mb-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">目次</h2>
            <ol className="space-y-2 text-sm">
              <li><a href="#section1" className="text-blue-600 hover:underline">1. 定義</a></li>
              <li><a href="#section2" className="text-blue-600 hover:underline">2. サービス概要</a></li>
              <li><a href="#section3" className="text-blue-600 hover:underline">3. 利用登録</a></li>
              <li><a href="#section4" className="text-blue-600 hover:underline">4. 利用料金</a></li>
              <li><a href="#section5" className="text-blue-600 hover:underline">5. 利用者の義務</a></li>
              <li><a href="#section6" className="text-blue-600 hover:underline">6. 未成年者の利用</a></li>
              <li><a href="#section7" className="text-blue-600 hover:underline">7. 個人情報・学習データの取扱い</a></li>
              <li><a href="#section8" className="text-blue-600 hover:underline">8. 知的財産権</a></li>
              <li><a href="#section9" className="text-blue-600 hover:underline">9. 禁止事項</a></li>
              <li><a href="#section10" className="text-blue-600 hover:underline">10. サービスの変更・停止</a></li>
              <li><a href="#section11" className="text-blue-600 hover:underline">11. 免責事項</a></li>
              <li><a href="#section12" className="text-blue-600 hover:underline">12. 規約の変更</a></li>
              <li><a href="#section13" className="text-blue-600 hover:underline">13. 準拠法・管轄裁判所</a></li>
              <li><a href="#section14" className="text-blue-600 hover:underline">14. 問い合わせ先</a></li>
            </ol>
          </div>

          {/* 各セクション */}
          <div className="space-y-10">
            
            {/* 1. 定義 */}
            <section id="section1">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">1. 定義</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>「当社」</strong>とは、LIVAL AI を指します。</p>
                <p><strong>「本サービス」</strong>とは、当社が提供するAI学習支援サービス「LIVAL AI」を指します。</p>
                <p><strong>「利用者」</strong>とは、本サービスを利用する個人を指します。</p>
                <p><strong>「AIコーチング」</strong>とは、当社が開発した3つの専門AI（家庭教師AI・進路カウンセラーAI・学習プランナーAI）による学習支援機能を指します。</p>
                <p><strong>「学習タイプ診断」</strong>とは、利用者の学習特性を6つのタイプに分類する診断機能を指します。</p>
                <p><strong>「プレミアムプラン」</strong>とは、月額4,980円の有料プランを指します。</p>
                <p><strong>「フリープラン」</strong>とは、Web版限定の無料プランを指します。</p>
              </div>
            </section>

            {/* 2. サービス概要 */}
            <section id="section2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. サービス概要</h2>
              <div className="space-y-3 text-gray-700">
                <p>本サービスは、中学生・高校生を主な対象とした AI 学習支援サービスです。</p>
                <h3 className="font-semibold text-gray-900 mt-4">2.1 主な機能</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>学習タイプ診断（6つの学習タイプ分類）</li>
                  <li>AIコーチング（家庭教師AI・進路カウンセラーAI・学習プランナーAI）</li>
                  <li>個別最適化された学習サポート</li>
                  <li>学習進捗の記録・分析</li>
                  <li>教育コンテンツの配信</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mt-4">2.2 提供プラットフォーム</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>モバイルアプリ（iOS・Android）</li>
                  <li>Webアプリケーション</li>
                </ul>
              </div>
            </section>

            {/* 3. 利用登録 */}
            <section id="section3">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. 利用登録</h2>
              <div className="space-y-3 text-gray-700">
                <p>本サービスを利用するには、当社の定める方法により利用登録を行う必要があります。</p>
                <h3 className="font-semibold text-gray-900 mt-4">3.1 登録情報</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>メールアドレス</li>
                  <li>パスワード</li>
                  <li>ニックネーム（表示名）</li>
                  <li>学年（任意）</li>
                  <li>その他、当社が必要と判断する情報</li>
                </ul>
                <p className="mt-4">登録情報は正確かつ最新の内容で入力してください。虚偽の情報による登録は禁止されています。</p>
              </div>
            </section>

            {/* 4. 利用料金 */}
            <section id="section4">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">4. 利用料金</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-gray-900">4.1 料金プラン</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded p-4 bg-white">
                      <h4 className="font-semibold text-gray-900">フリープラン</h4>
                      <p className="text-lg font-bold text-green-600">無料</p>
                      <p className="text-sm text-gray-600">Web版限定・基本機能のみ</p>
                    </div>
                    <div className="border border-blue-200 rounded p-4 bg-blue-50">
                      <h4 className="font-semibold text-gray-900">プレミアムプラン</h4>
                      <p className="text-lg font-bold text-blue-600">月額 4,980円（税込）</p>
                      <p className="text-sm text-gray-600">全機能利用可・モバイルアプリ対応</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mt-4">4.2 決済・解約</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>プレミアムプランの料金は毎月自動課金されます</li>
                  <li>決済はStripeを通じて安全に処理されます</li>
                  <li>解約はいつでも可能で、解約後は次回課金日まで利用できます</li>
                  <li>一度お支払いいただいた料金の返金は、当社の判断により行います</li>
                </ul>
              </div>
            </section>

            {/* 5. 利用者の義務 */}
            <section id="section5">
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. 利用者の義務</h2>
              <div className="space-y-3 text-gray-700">
                <p>利用者は以下の義務を負います。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>本規約及び関連する法令を遵守すること</li>
                  <li>登録情報を正確かつ最新の状態に保つこと</li>
                  <li>アカウント情報の管理責任を負うこと</li>
                  <li>本サービスを学習目的以外に使用しないこと</li>
                  <li>他の利用者の学習を妨げる行為をしないこと</li>
                </ul>
              </div>
            </section>

            {/* 6. 未成年者の利用 */}
            <section id="section6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. 未成年者の利用</h2>
              <div className="space-y-3 text-gray-700">
                <p>18歳未満の方が本サービスを利用する場合は、保護者の同意が必要です。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>保護者は未成年者の本サービス利用について責任を負います</li>
                  <li>プレミアムプランへの加入は保護者の承諾が必要です</li>
                  <li>当社は必要に応じて保護者の同意確認を求める場合があります</li>
                </ul>
              </div>
            </section>

            {/* 7. 個人情報・学習データの取扱い */}
            <section id="section7">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">7. 個人情報・学習データの取扱い</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>当社は、利用者の個人情報及び学習データを適切に管理します。</p>
                <h3 className="font-semibold text-gray-900 mt-4">7.1 収集する情報</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>アカウント情報（メールアドレス、表示名など）</li>
                  <li>学習タイプ診断の回答・結果</li>
                  <li>AIコーチングでの対話履歴</li>
                  <li>学習進捗・時間・成果データ</li>
                  <li>アプリ・Web利用状況</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mt-4">7.2 利用目的</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>個別最適化された学習支援の提供</li>
                  <li>サービス品質の向上・機能開発</li>
                  <li>利用者サポートの提供</li>
                  <li>統計データの作成（個人を特定しない形式）</li>
                </ul>
                <p className="mt-4">詳細は「<Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>」をご確認ください。</p>
              </div>
            </section>

            {/* 8. 知的財産権 */}
            <section id="section8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. 知的財産権</h2>
              <div className="space-y-3 text-gray-700">
                <p>本サービスに関する全ての知的財産権は当社に帰属します。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AIアルゴリズム・診断システム</li>
                  <li>アプリケーション・Webサイトのデザイン</li>
                  <li>教育コンテンツ・学習教材</li>
                  <li>商標・ロゴ・サービス名称</li>
                </ul>
                <p className="mt-4">利用者は本サービスを個人の学習目的でのみ使用でき、商用利用・複製・配布は禁止されています。</p>
              </div>
            </section>

            {/* 9. 禁止事項 */}
            <section id="section9">
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. 禁止事項</h2>
              <div className="space-y-3 text-gray-700">
                <p>利用者は以下の行為を禁止します。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>虚偽情報による登録・診断回答</li>
                  <li>他人のアカウントの不正利用</li>
                  <li>本サービスの改ざん・解析・リバースエンジニアリング</li>
                  <li>システムへの負荷をかける行為</li>
                  <li>不正アクセス・ウイルス送信等のサイバー攻撃</li>
                  <li>他の利用者への迷惑行為・嫌がらせ</li>
                  <li>法令に違反する行為</li>
                  <li>その他、当社が不適切と判断する行為</li>
                </ul>
              </div>
            </section>

            {/* 10. サービスの変更・停止 */}
            <section id="section10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. サービスの変更・停止</h2>
              <div className="space-y-3 text-gray-700">
                <p>当社は、以下の場合にサービスの全部または一部を変更・停止することがあります。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>システムメンテナンス・アップデートの実施</li>
                  <li>技術的問題・障害の発生</li>
                  <li>法令変更・規制への対応</li>
                  <li>事業方針の変更</li>
                  <li>その他、運営上必要と判断される場合</li>
                </ul>
                <p className="mt-4">重要な変更については事前に通知いたします。</p>
              </div>
            </section>

            {/* 11. 免責事項 */}
            <section id="section11">
              <h2 className="text-xl font-bold text-gray-900 mb-4">11. 免責事項</h2>
              <div className="space-y-3 text-gray-700">
                <p>以下について、当社は責任を負いません。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>利用者の学習成果・進学結果に関する保証</li>
                  <li>AIコーチングの内容・精度に関する保証</li>
                  <li>サービス利用による間接的・付随的損害</li>
                  <li>第三者によるサービスの妨害・中断</li>
                  <li>利用者の端末・ネットワーク環境に起因する問題</li>
                  <li>利用者同士のトラブル</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-yellow-800">
                    <strong>重要：</strong>本サービスは学習支援を目的としており、特定の学習成果や進学実績を保証するものではありません。
                  </p>
                </div>
              </div>
            </section>

            {/* 12. 規約の変更 */}
            <section id="section12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">12. 規約の変更</h2>
              <div className="space-y-3 text-gray-700">
                <p>当社は必要に応じて本規約を変更することがあります。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>重要な変更は21日前に事前通知いたします</li>
                  <li>軽微な変更は本ページでの更新により行います</li>
                  <li>変更後の規約は、公開時点で効力を有します</li>
                  <li>変更に同意できない場合は、サービスの利用を停止してください</li>
                </ul>
              </div>
            </section>

            {/* 13. 準拠法・管轄裁判所 */}
            <section id="section13">
              <h2 className="text-xl font-bold text-gray-900 mb-4">13. 準拠法・管轄裁判所</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>本規約は日本法に準拠します</li>
                  <li>本サービスに関する一切の紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします</li>
                </ul>
              </div>
            </section>

            {/* 14. 問い合わせ先 */}
            <section id="section14">
              <h2 className="text-xl font-bold text-gray-900 mb-4">14. 問い合わせ先</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>LIVAL AI サポートチーム</strong></p>
                  <p>メール：support@lival.ai</p>
                  <p>受付時間：平日 9:00-18:00（土日祝日除く）</p>
                  <p>※お問い合わせには順次回答いたします。お急ぎの場合は、メールの件名に「【至急】」とご記載ください。</p>
                </div>
              </div>
            </section>

          </div>

          {/* フッター */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>LIVAL AI 利用規約</p>
            <p>Copyright © 2025 LIVAL AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}