# リポジトリガイドライン

## プロジェクト構成とモジュール整理

このリポジトリは `src` をルートにした Next.js 16 ワークスペースです。`src/app` がルートとグローバルスタイルを管理し、`src/components` に再利用可能な UI、`src/lib/server/makeSimulationData.ts` に引き出しシミュレーションがあります。共通の型は `src/types` に置き、自動化（特に `src/scripts/update-chart.ts`）で MSCI と為替レートを取得してローカルキャッシュします。デザイントークンとメディアは `public` にまとめ、生成ビルドは `out/` で検証してください。

## ビルド・テスト・開発コマンド

- `npm run dev`: Next.js の開発サーバーをホットリロード付きで起動。
- `npm run build`: 本番バンドルを出力（型チェック・ルートバンドル・Tailwind）。
- `npm run lint`: Biome の lint/format チェックを実行。失敗はブロッカー。
- `npm run format`: Biome の自動修正を適用。大規模リファクター後に実行。
- `npm run update`: `tsx` 経由で `src/scripts/update-chart.ts` を実行し、`.env` で定義した最新チャートデータを取得。

## コーディングスタイルと命名規則

TypeScript + ES Modules が必須。コンポーネントは PascalCase（`TrinityChart.tsx`）、フックやユーティリティは camelCase、ルートセグメントフォルダーは kebab-case を維持します。可能な限り関数コンポーネントを使い、IO を伴う処理はデフォルトでサーバーコンポーネントにし、Tailwind ユーティリティと `clsx` / `tailwind-merge` でスタイルを構築します。`tsconfig.json` のパスエイリアスを守り、インデント 2 スペースと import 順序を揃えるために Biome を実行してください。

## テストガイドライン

正式なテストランナーは未設定なので、`npm run lint`、型安全性、`npm run dev` 上での手動 QA に頼ります。自動テストを追加する場合は Vitest + React Testing Library を採用し、`*.test.ts(x)` として配置してください。`src/lib/server` では決定的なケースを優先し、PR では実施した手動シナリオを列挙します。

## コミットとプルリクエストのガイドライン

最近の履歴では、簡潔で命令形（小文字や日本語も可）のコミットタイトルが好まれます（例: `chartのマージン調整`）。コミットは変更 1 件に絞り、必要であれば本文でチケットを参照します。PR では動機を説明し、主な変更点をまとめ、課題へのリンク、UI スクリーンショット、環境変数更新の共有、`npm run update`・`npm run build`・影響を受ける画面の検証結果を記載してからレビューを依頼してください。

## データと環境変数の注意点

MSCI と exchangerates の認証情報は `.env` にのみ保存し、git には含めないでください。`@t3-oss/env-nextjs` が起動時に必要なキーを検証するため、新しい変数を導入する際はプレースホルダーも忘れずに追加します。インポーターを変更する場合は README にパラメーター変更を反映し、入力不足で必ず失敗するようにして自動更新の信頼性を保ってください。

## Codex への追加指示

Codex はこのリポジトリに関する回答を常に日本語で行ってください。
