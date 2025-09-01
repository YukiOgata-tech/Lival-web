# Repository Guidelines

## プロジェクト構成・モジュール
- `src/app`: Next.js App Router（`page.tsx`/`layout.tsx`、各機能配下にルート）。
- `src/components`: UI コンポーネント（例: `Button.tsx`）。
- `src/lib`: 共通ロジック（`api/` `auth/` `firebase/` `supabase/` `types/` `utils/`）。
- `src/hooks`: カスタムフック、`src/data`: 静的データ、`public/`: アセット。
- `docs/`: 仕様と運用（例: `DATABASE-STRUCTURE.md`、`FUNCTIONS_OPERATIONS.md`、`study-log-system-specification.md`）。
- Cloud Functions は別リポジトリ（モバイルアプリ開発リポジトリ）で管理します。

## ビルド・開発・検証コマンド
- Web アプリ
  - `npm run dev`: 開発サーバー起動（http://localhost:3000）。
  - `npm run dev:turbo`: Turbopack で開発。
  - `npm run build` / `npm run build:turbo`: 本番ビルド。
  - `npm start`: 生成物を起動。
  - `npm run lint`: ESLint（Next + TypeScript）。
- Cloud Functions に関する開発/デプロイは別リポジトリの手順に従ってください。

## コーディング規約・命名
- TypeScript 厳格設定、React 関数コンポーネント + Hooks。
- Tailwind CSS v4（PostCSS）を優先。ユーティリティファーストで記述。
- Lint: `eslint.config.mjs`（Flat Config）。Format: Prettier を使用。
- 命名: コンポーネント/型は PascalCase、変数/関数は camelCase、ルート/ファイルは kebab-case 推奨。
- インポート: `@/*` エイリアスで `src/` を参照。

## テスト方針
- ルートにテストランナー未設定。導入時は:
  - 単体: Jest + Testing Library、E2E: Playwright を推奨。
  - 近接配置: `*.test.ts(x)` を対象ファイル付近に配置。
  - `npm test` と CI を別 PR で追加してください。

## コミット・PR ガイドライン
- 現在の履歴は短い命令形中心（厳密な Conventional Commits ではありません）。
- 推奨例: `feat: add study logs`、`fix: handle auth redirect`。
- PR には以下を含めてください:
  - 概要・目的、関連 Issue（例: `Closes #123`）。
  - UI 変更のスクリーンショット/GIF。
  - チェック: ビルド可、`npm run lint` 通過、TS エラーなし、必要な環境変数の記載。

## セキュリティ・設定
- 秘密値は `.env.local` に保存しコミットしないこと（Firebase/Contentful/Supabase など）。
- Cloud Functions は本リポジトリでは扱いません（別リポジトリの運用ガイド参照）。
- `next.config.ts` はビルド時の Lint/TS エラーを無視するため、PR 前にローカルで必ず `npm run lint` を実行してください。
