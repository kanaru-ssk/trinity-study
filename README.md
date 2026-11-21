# 日本版トリニティ・スタディ

## プロジェクト概要

MSCI ACWI を日本円建てで取崩すシミュレーションを掲載するサイト「日本版トリニティスタディ」のソースコード。

毎月最新データを自動的に取得し、シミュレーション結果を更新する。

![png](./public/screenshot.png)

[シミュレーション結果はこちら](https://trinity-study.kanaru.jp)

## 公開 URL

[trinity-study.kanaru.jp](https://trinity-study.kanaru.jp)

## 技術スタック

- [Hono](https://hono.dev/)（SSG）
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Vite](https://vite.dev/) / [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub Actions](https://github.com/features/actions)

## 必要要件

- Node.js v26.x

## コマンド

| コマンド            | 内容                       |
| ------------------- | -------------------------- |
| `npm run dev`       | 開発サーバーを起動         |
| `npm run build`     | ビルドと SSG               |
| `npm test`          | テスト                     |
| `npm run lint`      | lint                       |
| `npm run format`    | 整形                       |
| `npm run typecheck` | 型チェック                 |
| `npm run update`    | チャートデータを最新に更新 |

## ルーティング

`src/routes` 以下の `index.ts` / `index.tsx` がルートになります。HTTP メソッド名（`GET` など）でハンドラーを export し、`ssg = true` を export すると `npm run build` で静的 HTML に書き出します。

| ファイル                      | パス           |
| ----------------------------- | -------------- |
| `routes/index.tsx`            | `/`            |
| `routes/sitemap.xml/index.ts` | `/sitemap.xml` |

## データ

チャートデータは `src/data/chart.csv` に保存しています。GitHub Actions（`.github/workflows/update-chart.yaml`）が毎月 `npm run update` で最新データを追記し、デプロイします。

ACWI のチャートデータ : [End of day index data search](https://www.msci.com/end-of-day-data-search)

`src/data/index.json` の `indexVariant` は、`chart.csv` の priceUsd がどの種類の指数か（`STRD`: 配当なし / `NETR`: 配当込み Net / `GRTR`: 配当込み Gross）を表します。月次更新では同じ種類の指数を取得します。種類を変える場合は、GitHub Actions の「Rebuild Chart」ワークフロー（`node scripts/rebuild-chart.ts <種類>`）で全期間を取り直し、作成された PR を確認してマージしてください。既存と同じ期間のデータを取得できない場合（配当込み指数の公表開始が遅い場合など）は失敗します。

ドル円為替データ : [Frankfurter API](https://frankfurter.dev/)（欧州中央銀行の参照レート）

## デプロイ

`main` への push で `.github/workflows/deploy.yaml` が Cloudflare Workers にデプロイします。リポジトリの Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` を設定してください。
