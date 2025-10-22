import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表示',
  description: '特定商取引法に基づく表示（電話番号非掲載の特例を含む）',
}

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">特定商取引法に基づく表示</h1>
          <p className="mt-3 text-gray-300 text-sm">本ページはオンライン提供サービスに関する表示です。</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
            <Item label="販売事業者">LIVAL AI（運営統括責任者: 尾形 友輝）</Item>
            <Item label="販売業者（氏名）">尾形 友輝</Item>
            <Item label="所在地">〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル 2F-C</Item>
            <Item label="お問い合わせ先">
              お問い合わせは <a className="text-blue-600 underline" href="/contact">お問い合わせフォーム</a> または
              {' '}
              <a className="text-blue-600 underline" href="mailto:info@lival-ai.com">info@lival-ai.com</a> までご連絡ください。
            </Item>
            <Item label="電話番号の掲載について">
              当社は電話によるサポートを提供しておらず、電話番号は掲載しておりません（特定商取引法の特例に基づく運用）。請求があれば遅滞なく開示します。
            </Item>
            <Item label="支払方法">クレジットカード（Stripe）/ Apple Pay / Google Pay / Stripe Link</Item>
            <Item label="価格表示">当サイトの表示価格はすべて税込です。追加の決済手数料は発生しません（金融機関等の手数料を除きます）。</Item>
            <Item label="支払時期">初回は申込時に課金され、以後は初回課金日を基準として毎月同日に自動決済されます。月末起算の場合は月末に調整されることがあります。</Item>
            <Item label="役務の提供時期">決済確認後、直ちに利用可能です。</Item>
            <Item label="解約について">本サービスは月額の自動更新です。お客様はいつでも解約できます。解約は次回更新日の前日までにお手続きください。解約後も当該契約期間の満了日まではご利用いただけます。中途解約に伴う返金や日割り精算は行いません。</Item>
            <Item label="返金ポリシー">原則として返金は承っておりません。ただし、重複課金・二重決済・当社の不具合による明らかな誤課金、その他法令に基づき必要な場合には個別に対応いたします。</Item>
            <Item label="支払い失敗時の取扱い">更新時の決済が完了するまで一部機能のご利用を停止する場合があります。決済が完了次第、自動的にご利用を再開します。</Item>
          </div>
        </div>
      </section>
    </main>
  )
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-gray-900">{children}</div>
    </div>
  )
}

