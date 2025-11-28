# LIVAL AI - 教育特化AIプラットフォーム（Web版）

## 📖 プロジェクト概要

**LIVAL AI** は、一人ひとりの学習特性に最適化された教育特化AIプラットフォームです。既存のモバイルアプリと連携し、Web版で拡張機能を提供します。

### 🎯 主な特徴

- 🧠 **パーソナライズドAI**: 個別の学習スタイルに対応
- 🤖 **複数のAIエージェント**: 家庭教師AI、進路カウンセラーAI
- 📝 **ブログプラットフォーム**: リッチテキストエディタ搭載
- 💳 **サブスクリプション管理**: Stripe決済統合
- 📊 **学習管理**: Firebaseベースのデータ管理
- 🔒 **セキュア**: Firebase Authenticationによる認証

## 🚀 技術スタック

### フロントエンド
- **Next.js 15.5.0** (App Router)
- **React 19.1.0** + **React DOM 19.1.0**
- **TypeScript 5.9.3**
- **Tailwind CSS 4.x**
- **Framer Motion 12.23.12** (アニメーション)
- **Lucide React 0.540.0** (アイコン)

### エディタ・リッチコンテンツ
- **TipTap 3.2.2** (リッチテキストエディタ)
  - Image Extension (画像サイズ調整機能)
  - Link Extension (リンクプレビュー機能)
  - Table Extension (表作成)
  - Placeholder Extension
- **React Markdown 9.1.0** (Markdown表示)
- **KaTeX 0.16.22** (数式レンダリング)
- **DOMPurify 3.2.6** (XSS対策)

### 3D・アニメーション
- **Three.js 0.179.1**
- **@react-three/fiber 9.3.0**
- **@react-three/drei 10.7.3**
- **Lottie React 2.4.1**
- **React Particles 2.12.2**
- **@react-spring/web 10.0.1**

### バックエンド・データベース
- **Firebase 12.1.0**
  - **Authentication**: メール・Google認証
  - **Firestore**: NoSQLデータベース
  - **Storage**: 画像・ファイル保存
  - **Cloud Functions**: サーバーサイド処理
  - **Vertex AI 1.2.4**: AI機能統合
- **Firebase Admin SDK 13.4.0**

### 決済・サブスクリプション
- **Stripe 19.1.0** (サーバーサイド)
- **@stripe/stripe-js 8.1.0** (クライアントサイド)
- **@stripe/react-stripe-js 5.2.0** (React統合)
- **プラン構成**:
  - フリープラン: 0円 (Web限定)
  - ベーシックプラン: 2,480円/月
  - プレミアムプラン: 3,980円/月

### CMS・データベース
- **Contentful 11.7.15** (ヘッドレスCMS)
- **@contentful/rich-text-react-renderer 16.1.0**
- **Supabase 2.56.0** (補助データベース)

### フォーム・バリデーション
- **React Hook Form 7.62.0**
- **@hookform/resolvers 5.2.1**
- **Zod 4.1.11** (スキーマバリデーション)

### 通信・外部連携
- **Resend 6.1.2** (メール送信)
- **Tesseract.js 5.1.1** (OCR機能)
- **@zxing/browser 0.1.5** (QRコード読取)

### SEO・分析
- **Next SEO 6.8.0**
- **Next Sitemap 4.2.3**
- **@vercel/analytics 1.5.0**
- **@vercel/speed-insights 1.2.0**

### ユーティリティ
- **Lodash 4.17.21**
- **Date-fns 4.1.0**
- **clsx 2.1.1** + **tailwind-merge 3.3.1**
- **Sharp 0.34.3** (画像最適化)
- **html2canvas 1.4.1** (スクリーンショット)
- **jsPDF 3.0.2** (PDF生成)

### 開発ツール
- **ESLint 9.33.0**
- **Prettier 3.6.2** + **prettier-plugin-tailwindcss 0.6.14**
- **Autoprefixer 10.4.21** + **PostCSS 8.5.6**

## 📁 プロジェクト構造

```
lival-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # ホームページ
│   │   ├── account/             # アカウント管理
│   │   ├── admin/               # 管理者画面
│   │   ├── auth/                # 認証ページ (login, signup)
│   │   ├── blog/                # ブログ一覧
│   │   ├── submit/              # ブログ投稿
│   │   ├── subscription/        # サブスク管理
│   │   ├── pricing/             # 料金プラン
│   │   ├── dashboard/           # ダッシュボード
│   │   ├── diagnosis/           # 学習タイプ診断
│   │   ├── daily-fortune/       # デイリー機能
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/           # 認証API
│   │   │   ├── blogs/          # ブログAPI
│   │   │   ├── stripe/         # Stripe決済API
│   │   │   ├── link-preview/   # リンクプレビューAPI
│   │   │   └── contact/        # お問い合わせAPI
│   │   └── ...                  # その他公開ページ
│   │
│   ├── components/              # UIコンポーネント
│   │   ├── ui/                 # 基本UIコンポーネント
│   │   ├── layout/             # レイアウト関連
│   │   ├── blog/               # ブログ関連
│   │   │   ├── TiptapEditor.tsx      # リッチテキストエディタ
│   │   │   ├── LinkPreviewNode.tsx   # リンクプレビュー
│   │   │   ├── ImageUpload.tsx       # 画像アップロード
│   │   │   └── ArticleContent.tsx    # 記事表示
│   │   ├── payments/           # Stripe決済
│   │   ├── account/            # アカウント管理
│   │   ├── study/              # 学習機能
│   │   └── diagnosis/          # 診断機能
│   │
│   ├── hooks/                   # カスタムフック
│   │   └── useAuth.tsx         # 認証フック
│   │
│   ├── lib/                     # ユーティリティ・設定
│   │   ├── firebase/           # Firebase設定
│   │   │   └── storage.ts     # Firebase Storage操作
│   │   ├── stripe/             # Stripe統合
│   │   ├── subscription/       # サブスク管理ロジック
│   │   ├── api/                # APIクライアント
│   │   └── utils.ts            # 汎用ユーティリティ
│   │
│   ├── types/                   # TypeScript型定義
│   │   ├── index.ts            # メイン型定義 (LivalUser等)
│   │   ├── study.ts            # 学習機能型
│   │   ├── diagnosis.ts        # 診断機能型
│   │   └── book.ts             # 書籍管理型
│   │
│   ├── data/                    # 静的データ・定数
│   │   └── blogCategories.ts  # ブログカテゴリ
│   │
│   └── middleware.ts            # Next.js Middleware
│
├── functions/                   # Firebase Cloud Functions
│   └── src/
│       ├── index.ts            # メイン関数エントリポイント
│       ├── migrations/         # データマイグレーション
│       └── types/              # 関数側型定義
│
├── public/                      # 静的ファイル
├── .env.local                   # 環境変数 (Git管理外)
├── .env.example                # 環境変数テンプレート
├── next.config.ts              # Next.js設定
├── tsconfig.json               # TypeScript設定
├── eslint.config.mjs           # ESLint設定
├── postcss.config.mjs          # PostCSS設定
├── package.json                # 依存関係
└── CLAUDE.md                   # プロジェクト仕様書
```

## 🛠️ セットアップ手順

### 前提条件
- **Node.js 18.17.0+** (推奨: 20.x)
- **npm 9.0.0+**
- **Git 2.34.0+**
- **Firebaseプロジェクト** (既存モバイルアプリと共有)
- **Stripeアカウント** (決済機能用)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd lival-web
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
# .env.local ファイルを作成
cp .env.example .env.local
```

`.env.local` に以下の設定を追加：

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase Configuration (必須)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe Configuration (必須)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_...
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Contentful CMS (オプション)
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

# Resend (メール送信)
RESEND_API_KEY=your_resend_api_key
CONTACT_TO=info@lival-ai.com
RESEND_FROM="LIVAL AI <no-reply@lival-ai.com>"

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  / https://www.lival-ai.com
NEXT_PUBLIC_SITE_NAME=LIVAL AI
```

### 4. 開発サーバーの起動

```bash
# 通常起動
npm run dev

# Turbopack使用（高速）
npm run dev:turbo
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 5. ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# 本番サーバー起動（ローカル確認用）
npm run start

# Lintチェック
npm run lint
```

## 🎨 主要機能

### 1. ブログプラットフォーム

#### TipTapエディタ機能
- **リッチテキスト編集**: 見出し、太字、斜体、コード、リスト
- **画像挿入**: Firebase Storageへのアップロード
- **画像サイズ調整**: 小・中・大・フル幅（4サイズ）
- **リンク挿入**: 通常リンク + リンクプレビューカード
- **リンクプレビュー**: OGPメタデータ自動取得（タイトル、説明、画像）
- **URL表示切替**: プレビューカードでURL表示/非表示を選択可能
- **表作成**: 表の挿入と編集
- **コードブロック**: シンタックスハイライト対応

#### ブログ管理
- **下書き保存**: 途中保存機能
- **審査申請**: 編集部による品質確認
- **即座に公開**: 管理者権限での直接公開
- **公開設定**: 完全公開 / ティザー記事 / プレミアム限定

### 2. サブスクリプション管理

#### プラン構成
- **フリープラン (0円)**: Web版基本機能のみ
- **ベーシックプラン (2,480円/月)**: AI学習サポート、Web全機能
- **プレミアムプラン (3,980円/月)**: 全機能、モバイルアプリ対応

#### Stripe決済統合
- **Payment Element**: 最新のStripe UI
- **Webhook処理**: invoice.paid, subscription.updated等
- **Firestore同期**: サブスク状態の自動同期
- **請求履歴**: 過去の決済情報管理

### 3. 認証システム
- **Firebase Authentication**: メール・パスワード、Google認証
- **アカウント管理**: プロフィール編集、パスワード変更
- **ロール管理**: user / admin / moderator

### 4. データ管理
- **既存モバイルアプリと共有**: 同一Firebaseプロジェクト
- **データ同期**: Web⇔モバイル間の完全同期
- **Cloud Functions**: ユーザー初期化、マイグレーション

## 📊 データベース構造

### Firestore (lival-app)
```
users/{userId}/
├── [モバイル既存フィールド]
│   ├── bio, birthday, displayName
│   ├── coins, xp, level (ゲーミフィケーション)
│   └── sessionCount, totalMinutes (学習データ)
│
└── [Web版拡張フィールド]
    ├── subscription: { plan, status, stripeCustomerId... }
    └── webProfile: { lastWebLogin, preferences... }
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: Blue (#3B82F6) → Purple (#8B5CF6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### タイポグラフィ
- **フォント**: Noto Sans JP Variable
- **見出し**: Bold (700)
- **本文**: Regular (400)

### アニメーション
- **Framer Motion**: ページ遷移、要素アニメーション
- **Easing**: ease-out (0.3s)
- **Hover**: scale(1.02) + shadow-xl

## 🔧 開発ガイドライン

### コーディング規約
- **TypeScript**: strict mode有効、any型の使用禁止
- **関数コンポーネント**: React Hooks使用
- **CSS**: Tailwind CSSクラスのみ使用
- **ファイル名**: PascalCase (コンポーネント) / camelCase (ユーティリティ)
- **インポート順序**: 外部ライブラリ → @/エイリアス → 相対パス

### Git規約
- **ブランチ**: main (本番) / develop (開発)
- **コミット**: カジュアルでOK（英語・日本語混在可）
- **プッシュ前**: `npm run lint` でチェック

### セキュリティ
- **環境変数**: `.env.local` は絶対にコミットしない
- **API Key**: NEXT_PUBLIC_* のみクライアント公開可
- **Firebase Admin**: サーバーサイドのみで使用
- **XSS対策**: DOMPurify使用

## 🐛 トラブルシューティング

### Firebase接続エラー
```bash
# 環境変数を確認
cat .env.local | grep FIREBASE

# Firebase設定を再確認
# src/lib/firebase.ts
```

### Stripe Webhook エラー
```bash
# Stripe CLIでローカルテスト
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Webhook署名を確認
echo $STRIPE_WEBHOOK_SECRET
```

### ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
rm -rf node_modules/.cache

# 再インストール
npm install

# 再ビルド
npm run build
```

### TipTap関連エラー
```bash
# TipTapバージョン確認
npm list @tiptap/react @tiptap/core

# 依存関係の整合性確認
npm install
```

## 📊 パフォーマンス目標

- **Lighthouse Score**: 95+ (全項目)
- **Core Web Vitals**:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

## 🤝 コントリビューション

1. Featureブランチを作成
2. 変更をコミット
3. `npm run lint` でチェック
4. Pull Requestを作成

### 推奨開発環境
- **エディタ**: Visual Studio Code
- **拡張機能**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Extension Pack

## 📝 ドキュメント

- **プロジェクト仕様書**: `CLAUDE.md`
- **環境変数テンプレート**: `.env.example`
- **型定義**: `src/types/index.ts`

---

**LIVAL AI** - あなただけの教育特化パーソナルAI

© 2025 LIVAL AI. All rights reserved.
