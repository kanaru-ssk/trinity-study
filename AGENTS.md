# Repository Guidelines

## 応答ルール

- 常に日本語で応答

## コーディングルール

- ファイル名は全てケバブケース（例 `about-us.tsx`）とする
- 型定義は interface ではなく type を使う
- 可能な限り余分なコードを排除し、シンプルに保つ
- 可能な限り余分な package を排除し、シンプルに保つ

## コミット/PR ルール

- 作業開始時は最新の `main` を取得し、トピックブランチ `feature/<topic>` を切る
- 複数のトピックを混在させない
- 大きな変更は段階的にブランチを分ける
- コミット前に`npm run format` → `npm run build`の順でチェック
- 1 行目は英語の命令形・50 文字以内（例 `feat: add hero animation`）。必要に応じて空行を挟み、72 文字幅で背景や実装方針を本文に記述する
- Issue/PR は `Refs #166` のようにフッターへ追記
- 論点が異なる変更は別コミット化
- `gh pr`コマンドで`.github/pull_request_template.md`に則って PR を作成する
