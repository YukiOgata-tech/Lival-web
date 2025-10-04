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
