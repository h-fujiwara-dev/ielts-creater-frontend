# IELTS Creator — Frontend

[IELTS Creator](https://github.com/h-fujiwara-dev/ielts-creater)（AIによるIELTS練習問題作成アプリ）のフロントエンド。Next.js（App Router）+ TypeScriptで実装。

プロジェクト全体の概要・業務/システム要件・アーキテクチャは[ielts-createrリポジトリ（ランディング）](https://github.com/h-fujiwara-dev/ielts-creater)を参照してください。バックエンドは[ielts-creater-backend](https://github.com/h-fujiwara-dev/ielts-creater-backend)、インフラは[ielts-creater-infra](https://github.com/h-fujiwara-dev/ielts-creater-infra)にあります。

## ドキュメント

- [docs/画面一覧.md](./docs/画面一覧.md) — 画面一覧とディレクトリ構成
- [docs/画面設計書/](./docs/画面設計書/) — 画面ごとの詳細仕様（S-01〜S-06）。S-01にNextAuth.js × Cognito連携方針を含む

## ローカル開発

先にバックエンドを起動しておく必要があります（[ielts-creater-backend](https://github.com/h-fujiwara-dev/ielts-creater-backend)で `docker compose up -d` + `./gradlew bootRun`）。

```bash
npm install
npm run dev   # http://localhost:3000
```

Phase 1ではバックエンド側が認証なし・固定devユーザーで動作するため、Cognito連携前でも「生成→回答→採点」の一連の流れをローカルで確認できます。

## 開発ルール

- `main`への直接pushは禁止。変更はfeatureブランチ→PR経由で行う（push時にPRが自動作成される）
- コミット時にmarkdownlint・コミットメッセージ規約（commitlint）がローカルフックでチェックされる
- PRではmarkdownlintが必須ステータスチェックとして実行される
