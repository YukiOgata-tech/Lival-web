import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表示',
  description: '特定商取引法に基づく表示（電話番号非掲載に関する特例の記載を含む）',
}

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">特定商取引法に基づく表示</h1>
          <p className="mt-3 text-gray-300 text-sm">本表示はオンライン提供サービスに関する法定表記です。</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
            <Item label="販売事業者">LIVAL AI（屋号）</Item>
            <Item label="運営責任者">（追記予定）</Item>
            <Item label="所在地">〒XXX-XXXX 東京都渋谷区XXX X-X-X（追記予定）</Item>
            <Item label="お問い合わせ先">
              お問い合わせは <a className="text-blue-600 underline" href="/contact">お問い合わせフォーム</a> または <a className="text-blue-600 underline" href="mailto:info@lival-ai.com">info@lival-ai.com</a> までお願いします。
            </Item>
            <Item label="電話番号の開示について">
              当社は電話によるサポートを提供しておらず、電話番号は掲載しておりません（特定商取引法の特例に基づく運用）。<br />
              取引やお問い合わせにおいて電話連絡が必要な場合は、<span className="font-semibold">ご請求に基づき遅滞なく開示</span>いたします。まずは上記のフォームまたはメールよりご連絡ください。
            </Item>
            <Item label="販売価格・対価">各サービス/プランのページに税込価格を表示します。</Item>
            <Item label="商品代金以外の必要料金">消費税、通信費（インターネット接続に係る費用はお客様負担）</Item>
            <Item label="支払方法">クレジットカードその他、各サービスページに記載</Item>
            <Item label="支払時期">申込時または各サービスページに記載</Item>
            <Item label="役務の提供時期">申込手続き完了後、直ちに提供開始（詳細は各ページの案内に従います）</Item>
            <Item label="返品・キャンセル">デジタルサービスの性質上、提供開始後の返品はできません。個別のキャンセル・返金条件は各ページに記載します。</Item>
            <Item label="動作環境">インターネット接続環境と対応ブラウザが必要です。</Item>
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

