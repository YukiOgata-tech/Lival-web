# Repository Guidelines

このドキュメントは本リポジトリの貢献者向けガイドです。以下の方針に従い、構成と品質を一貫させてください。

## プロジェクト構成・モジュール
- `src/app`: Next.js App Router（`page.tsx`/`layout.tsx`、各機能配下にルート）
- `src/components`: UI コンポーネント（例: `Button.tsx`）
- `src/lib`: 共通ロジック（`api/` `auth/` `firebase/` `supabase/` `types/` `utils/`）
- `src/hooks`, `src/data`: カスタムフックと静的データ
- `public/`: アセット、`docs/`: 仕様と運用（例: `DATABASE-STRUCTURE.md`）
- 注意: Cloud Functions は別リポジトリで管理します

## ビルド・開発・検証コマンド
- `npm run dev`: 開発サーバー起動（http://localhost:3000）
- `npm run dev:turbo`: Turbopack で開発
- `npm run build` / `npm run build:turbo`: 本番ビルド
- `npm start`: 生成物を起動
- `npm run lint`: ESLint（Next.js + TypeScript）

## コーディング規約・命名
- 言語: TypeScript（strict）+ React 関数コンポーネント/Hooks
- スタイル: Tailwind CSS v4（PostCSS）、ユーティリティファースト
- Lint/Format: `eslint.config.mjs`（Flat Config）+ Prettier
- 命名: コンポーネント/型は PascalCase、変数/関数は camelCase、ルート/ファイルは kebab-case
- インポート: `@/*` エイリアスで `src/` を参照

## テスト方針
- 現時点でテストランナー未導入。追加時の推奨:
  - 単体: Jest + Testing Library、E2E: Playwright
  - 近接配置: 対象ファイル付近に `*.test.ts(x)` を作成
  - `npm test` と CI は別 PR で追加（現時点でカバレッジ閾値は未設定）

## コミット・PR ガイドライン
- コミット: 短い命令形（厳密な Conventional ではない）
  - 例: `feat: add study logs`、`fix: handle auth redirect`
- PR には以下を含める:
  - 目的/概要と関連 Issue（例: `Closes #123`）
  - UI 変更のスクリーンショット/GIF
  - チェック: ビルド可、`npm run lint` 通過、TS エラーなし、必要な環境変数を記載

## セキュリティ・設定
- 秘密値は必ず `.env.local` に保存しコミットしない
- Cloud Functions は本リポジトリで扱わない（別リポジトリの手順に従う）
- `next.config.ts` はビルド時に Lint/TS エラーを無視するため、PR 前に必ずローカルで `npm run lint` を実行

## エージェント向けノート
- 変更は必要最小限・既存パターンに整合させる
- Cloud Functions 関連コードは変更しない
- 仕様/契約が変わる場合は `docs/` を更新

---

## プロジェクト全体の理解サマリー（エージェント用）

本プロジェクトは Next.js App Router ベース（TypeScript strict）で、UI は Tailwind CSS v4、バックエンドは Firebase（Auth/Firestore/Storage/Functions）と Supabase を併用するハイブリッド構成です。ブログ/ニュース/診断/学習記録/チューターAI/問い合わせなどの機能を包含します。開発モードではミドルウェアでロール付与を簡略化しています。

### 技術スタックと主要ライブラリ
- Next.js `15.x` / React `19` / TypeScript `^5.9`
- Tailwind CSS v4（PostCSS）、ESLint Flat Config、Prettier
- Firebase Web SDK（Auth/Firestore/Storage/Functions）
- Supabase（ブラウザ/SSR クライアント、RLS 連携）
- Vertex AI via `@firebase/vertexai`（Gemini）
- Optional: Contentful（CMS）

### ディレクトリ要点
- ルーティング: `src/app/*`（`layout.tsx`/`page.tsx` ベースの App Router）
- コンポーネント: `src/components/*`（ドメインごと + `ui/`/`layout/`）
- 共通ロジック: `src/lib/*`
  - Firebase 初期化: `src/lib/firebase.ts`
  - Firestore アクセス: `src/lib/firebase/*.ts`（ブログ/ニュース等）
  - Supabase 連携: `src/lib/supabase/*`
  - API クライアント/業務ロジック: `src/lib/api/*`
  - AI/Gemini: `src/lib/ai/gemini.ts`
  - その他: `math/`, `ocr/`, `utils/`, `types/`
- フック: `src/hooks/*`
- 静的データ: `src/data/*`
- API Routes: `src/app/api/*`
- 仕様ドキュメント: `docs/*`

### 認証とミドルウェア
- サーバー側ロール取得（暫定）: `src/lib/auth/server.ts`
- Next.js Middleware: `src/middleware.ts`
  - 開発時は `/api/*` へ `x-user-id` と `x-user-role=admin` を付与
  - `/submit` はサブスク必須、`/admin` は管理者必須にリダイレクト制御

### 主要モジュール（例）
- ブログ CRUD/承認監査: `src/lib/firebase/blog.ts`
- ニュース管理: `src/lib/firebase/news.ts`
- 学習記録・書籍検索（Supabase/RLS 連携）:
  - `src/lib/api/studyLogService.ts`
  - `src/lib/api/bookService.ts`
- Tutor AI（Gemini レポート生成）: `src/lib/ai/gemini.ts`

### 主な API ルート（抜粋）
- ブログ: `src/app/api/blogs/*`
- ニュース: `src/app/api/news/*`
- 書籍: `src/app/api/books/google/route.ts`
- ビュー数: `src/app/api/views/[slug]/route.ts`
- Tutor チャット: `src/app/api/tutor/chat/route.ts`
- 診断 OG 画像: `src/app/api/og/diagnosis/route.tsx`
- 学習プラン PDF: `src/app/api/plan-pdf/route.ts`

### 環境変数・設定
- Firebase: `NEXT_PUBLIC_FIREBASE_*`（`src/lib/firebase.ts`）
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.env.local` に保存し、秘匿・未コミットを徹底
- 画像リモート許可: `next.config.ts` の `images.remotePatterns`

### 開発・ビルド・Lint
- 開発: `npm run dev`（Turbopack: `npm run dev:turbo`）
- 本番ビルド: `npm run build`（Turbopack: `npm run build:turbo`）
- サーバ起動: `npm start`
- Lint: `npm run lint`（PR 前に必須実行）
- 備考: `next.config.ts` でビルド時に TS/ESLint を無視するため、ローカルでの Lint/型チェックが実質ゲートになります

### コーディング規約の補足
- TS は strict、React 関数コンポーネント + Hooks
- スタイルは Tailwind ユーティリティファースト（v4）
- 命名: コンポーネント/型は PascalCase、変数/関数は camelCase、ルート/ファイルは kebab-case
- インポートは `@/*` で `src/` 参照（`tsconfig.json`）
- 既存の UI/レイアウト/ドメイン別ディレクトリの流儀に合わせる

### PR チェックリスト（推奨）
- ビルド可（`npm run build`）
- Lint クリア（`npm run lint`）・TS エラーなし
- UI 変更はスクリーンショット/GIF を添付
- 必要な環境変数のドキュメント反映
- 仕様変更は `docs/` を更新し、関連 Issue を明記（例: `Closes #123`）

### セキュリティ/運用上の注意
- 秘密値は `.env.local` のみ・コミット禁止
- Cloud Functions は別リポジトリ管理（本リポではコード変更しない）
- Firestore/Supabase の RLS/権限前提を崩さない（`studyLogService` などは RLS 前提）

### クイックスタート（再掲）
1) 依存インストール: `npm install`
2) `.env.local` 設定（`README.md` のテンプレ参照）
3) 開発起動: `npm run dev`（http://localhost:3000）
4) Lint: `npm run lint`

### よくある落とし穴（回避策）
- 画像最適化でブロック: 許可ドメインは `next.config.ts` に追記
- ローカルは管理者ロール付与: ミドルウェアの開発分岐を前提に挙動確認
- Supabase へのトークン伝播: `src/lib/supabase/supabaseClient.ts` が Firebase ID トークンを付与（トークン更新時の Realtime 再バインド含む）
- Lint 無視のビルド成功に注意: PR 前に必ず Lint/型チェックで品質担保

### エージェント運用ノート（実務）
- 変更はスコープ最小・既存パターン踏襲。不要な命名変更や大規模リファクタは避ける。
- 仕様/契約の更新を伴う場合は `docs/*` を更新し、当該画面/機能の説明を追記。
- Cloud Functions ディレクトリは存在しても、本リポでは編集禁止（手順は `docs/FUNCTIONS_OPERATIONS.md` 参照）。
- 不明点や曖昧さがある場合は PR 説明で前提/制約を明記し、段階的に導入。
