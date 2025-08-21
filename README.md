# LIVAL AI - パーソナルAIコーチング Webサイト

![LIVAL AI Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=LIVAL+AI+-+パーソナルAIコーチング)

## 📖 プロジェクト概要

**LIVAL AI** は、一人ひとりの学習特性に最適化されたパーソナルAIコーチングプラットフォームです。6つの学習タイプに基づいた個別指導により、学習効果を最大化します。

### 🎯 主な特徴

- 🧠 **6つの学習タイプ**: 戦略家、探求家、努力家、挑戦家、伴走者、効率家
- 🤖 **3つの専門AIエージェント**: 家庭教師AI、進路カウンセラーAI、学習計画AI
- ⏰ **24時間対応**: いつでもどこでも学習サポート
- 📊 **進捗可視化**: リアルタイムでの学習分析・レポート
- 🔒 **安心・安全**: 教育専門家監修のセキュアな環境

## 🚀 技術スタック

### フロントエンド
- **Next.js 15.5.0** (App Router + Turbopack)
- **React 19.1.0** + **React DOM 19.1.0**
- **TypeScript 5.x**
- **Tailwind CSS 4.x** (最新版)
- **Framer Motion 12.x** (アニメーション)
- **Lucide React 0.540.0** (アイコン)

### 3D・アニメーション
- **Three.js 0.179.1** (3D graphics)
- **@react-three/fiber** + **@react-three/drei** (React Three.js)
- **Lottie React 2.4.1** (After Effects アニメーション)
- **React Particles** + **tsparticles-slim** (パーティクル効果)
- **@react-spring/web** (軽量アニメーション)

### バックエンド・データベース
- **Firebase 12.1.0**
  - Authentication (認証)
  - Firestore (データベース)
  - Storage (ファイル保存)
  - Admin SDK (サーバーサイド)

### CMS・コンテンツ管理
- **Contentful 11.7.15** (ヘッドレスCMS)
- **@contentful/rich-text-react-renderer** (リッチテキスト)

### フォーム・バリデーション
- **React Hook Form 7.62.0** (フォーム管理)
- **@hookform/resolvers 5.2.1** (バリデーション)

### SEO・分析
- **Next SEO 6.8.0** (SEO最適化)
- **Next Sitemap 4.2.3** (サイトマップ生成)
- **@vercel/analytics** + **@vercel/speed-insights** (分析)

### ユーティリティ
- **Lodash 4.17.21** (ユーティリティ)
- **Date-fns 4.1.0** (日付操作)
- **clsx 2.1.1** + **tailwind-merge 3.3.1** (CSS管理)
- **Sharp 0.34.3** (画像最適化)
- **React Intersection Observer** (スクロール監視)

### デプロイ・ホスティング
- **Vercel** (フロントエンド + Edge Functions)
- **Firebase Hosting** (バックアップ)

### 開発ツール
- **ESLint 9.33.0** + **Prettier 3.6.2** (コード品質)
- **Autoprefixer** + **PostCSS** (CSS後処理)
- **Claude Code** (AI開発支援)

## 📁 プロジェクト構造

```
lival-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── admin/             # 管理者画面
│   │   ├── blog/              # ブログ
│   │   ├── diagnosis/         # 性格診断
│   │   ├── api/               # API Routes
|   |   └── faq/               # faq
│   ├── components/            # UIコンポーネント
│   │   ├── ui/                # 基本UIコンポーネント
│   │   ├── layout/            # レイアウト関連
│   │   ├── MainHeader.tsx     # メインヘッダー
│   │   └── MainFooter.tsx     # メインフッター
│   ├── hooks/                 # カスタムフック
│   ├── lib/                   # ユーティリティ・設定
│   │   ├── firebase.ts        # Firebase設定
│   │   └── utils.ts           # ユーティリティ関数
│   ├── types/                 # TypeScript型定義
│   │   └── index.ts           # 基本型定義
│   └── data/                  # 静的データ・定数
│       └── constants.ts       # サイト定数
├── public/                    # 静的ファイル
├── .env.local                 # 環境変数 (要設定)
├── .env.example              # 環境変数テンプレート
├── next.config.js            # Next.js設定
├── tailwind.config.js        # Tailwind CSS設定
├── tsconfig.json             # TypeScript設定
└── package.json              # 依存関係
```

## 🛠️ セットアップ手順

### 前提条件
- **Node.js 18.17.0+** (推奨: 20.x)
- **npm 9.0.0+** または **yarn 1.22.0+**
- **Git 2.34.0+**

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd lival-web
```

### 2. 依存関係のインストール

```bash
# npm を使用する場合
npm install

# yarn を使用する場合  
yarn install
```

### 3. 環境変数の設定

```bash
# .env.local ファイルを作成
cp .env.example .env.local
```

`.env.local` に以下の設定を追加：

```env
# Firebase Configuration (必須)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Contentful CMS (オプション)
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=LIVAL AI

# Analytics (本番環境)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### 4. 開発サーバーの起動

```bash
# Turbopack を使用（高速）
npm run dev

# 通常のWebpack を使用
npm run dev:webpack
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 5. ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# 本番サーバー起動（ローカル確認用）
npm run start

# Vercel にデプロイ
vercel --prod
```

#### CMS・コンテンツ
```json
{
  "contentful": "^11.7.15",
  "@contentful/rich-text-react-renderer": "^16.1.0"
}
```


## 🎨 デザインシステム

### カラーパレット
- **Primary**: Blue (#3B82F6) → Purple (#8B5CF6)
- **Secondary**: Purple (#8B5CF6) → Pink (#EC4899)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### タイポグラフィ
- **見出し**: Noto Sans JP (Bold)
- **本文**: Noto Sans JP (Regular)
- **サイズ**: Tailwind CSS デフォルトスケール

### アニメーション原則
- **Easing**: `ease-out` (0.3s)
- **Hover**: `scale(1.02)` + `shadow-xl`
- **Enter**: `fadeInUp` (0.6s delay)
- **Scroll**: `Intersection Observer` トリガー

## 🧩 主要コンポーネント

### レイアウトコンポーネント
- **MainHeader**: ナビゲーション・CTA・モバイルメニュー
- **MainFooter**: 企業情報・リンク・ソーシャルメディア

### UIコンポーネント
- **Button**: 5種のバリエーション (primary, secondary, outline, ghost, gradient)
- **Card**: ホバーエフェクト・グラデーション対応
- **FloatingCard**: スクロールアニメーション付き
- **AnimatedCounter**: 数値カウントアップ
- **ProgressBar**: プログレス表示

### ページコンポーネント
- **HomePage**: メインランディングページ
- *(今後追加予定)*
  - DiagnosisPage: 性格診断
  - FeaturesPage: 機能詳細
  - PricingPage: 料金プラン
  - BlogPage: ブログ一覧

## 🔧 開発ガイドライン

### コーディング規約
- **TypeScript**: 厳密な型定義を使用
- **関数型**: React Hooks + 関数コンポーネント
- **CSS**: Tailwind CSS クラスのみ使用
- **ファイル名**: kebab-case (例: `main-header.tsx`)
- **変数名**: camelCase (例: `isVisible`)

### Git コミット規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: その他のメンテナンス
```

### パフォーマンス最適化
- **画像**: `next/image` を使用
- **フォント**: `next/font` で最適化
- **コード分割**: 動的インポート活用
- **SEO**: メタデータ適切に設定

## 🐛 トラブルシューティング

### よくある問題

#### 1. ハイドレーションエラー
```
Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```
**解決法**: `useEffect` + `useState` でクライアント限定コンテンツを制御

```typescript
const [isMounted, setIsMounted] = useState(false)
useEffect(() => {
  setIsMounted(true)
}, [])

return isMounted ? <DynamicContent /> : <StaticContent />
```

#### 2. Firebase接続エラー
**確認項目**:
- `.env.local` の設定値
- Firebase プロジェクトの設定
- API キーの有効性
- Firebase バージョン互換性

#### 3. Tailwind CSS 4.x スタイルが適用されない
**解決法**:
```bash
# キャッシュクリア
rm -rf .next
npm run dev

# Tailwind 設定確認
npx tailwindcss --help
```

#### 4. Turbopack 関連エラー
**解決法**:
```bash
# Turbopack 無効化
npm run dev:webpack

# または package.json の scripts を修正
"dev": "next dev"  # --turbopack を削除
```

#### 5. React 19.x 互換性エラー
**確認項目**:
- サードパーティライブラリの React 19 対応状況
- TypeScript 型定義の更新
- Strict Mode での動作確認

#### 6. Three.js / 3D 関連エラー
**解決法**:
```typescript
// SSR 対策
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
})
```

#### 7. Contentful CMS 接続エラー
**確認項目**:
- Space ID と Access Token の正確性
- API レート制限
- コンテンツタイプの設定


## 📊 パフォーマンス目標

- **Lighthouse Score**: 95+ (全項目)
- **Core Web Vitals**: 
  - LCP < 2.5s (Largest Contentful Paint)
  - FID < 100ms (First Input Delay)
  - CLS < 0.1 (Cumulative Layout Shift)
- **SEO Score**: 100/100
- **Accessibility Score**: 95+

### パフォーマンス最適化機能
- **Next.js 15.5.0**: App Router + Turbopack (高速ビルド)
- **React 19.x**: 最新の並行機能とパフォーマンス改善
- **Sharp**: 自動画像最適化
- **Vercel Analytics**: リアルタイムパフォーマンス監視
- **Code Splitting**: 自動コード分割
- **Edge Runtime**: エッジでの高速処理

## 🤝 コントリビューション

1. Feature ブランチを作成
2. 変更をコミット
3. テストを実行
4. Pull Request を作成

### 開発環境要件
- **Node.js 18.17.0+** (推奨: 20.x)
- **npm 9.0.0+** または **yarn 1.22.0+**
- **Git 2.34.0+**
- **Visual Studio Code**

### 推奨 VS Code 拡張機能
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
`

---

**LIVAL AI** - あなただけの教育特化パーソナルAI

© 2025 LIVAL AI. All rights reserved.