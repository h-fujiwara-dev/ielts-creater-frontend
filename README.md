# IELTS Creator — Frontend

[IELTS Creator](https://github.com/h-fujiwara-dev/ielts-creater)（AIによるIELTS練習問題作成アプリ）のフロントエンド。Next.js（App Router）+ TypeScriptで実装。

プロジェクト全体の概要・業務/システム要件・アーキテクチャは[ielts-createrリポジトリ（ランディング）](https://github.com/h-fujiwara-dev/ielts-creater)を参照してください。バックエンドは[ielts-creater-backend](https://github.com/h-fujiwara-dev/ielts-creater-backend)、インフラは[ielts-creater-infra](https://github.com/h-fujiwara-dev/ielts-creater-infra)にあります。

## ドキュメント

- [docs/画面一覧.md](./docs/画面一覧.md) — 画面一覧とディレクトリ構成
- [docs/画面設計書/](./docs/画面設計書/) — 画面ごとの詳細仕様（S-01〜S-06）。S-01にNextAuth.js × Cognito連携方針を含む

## ローカル開発

### 環境変数

`.env.example`を`.env.local`にコピーし、値を設定します。

```bash
cp .env.example .env.local
```

- `AUTH_SECRET`: `npx auth secret`等で生成
- `COGNITO_CLIENT_ID` / `COGNITO_CLIENT_SECRET` / `COGNITO_ISSUER` / `COGNITO_HOSTED_UI_DOMAIN`: ログイン（NextAuth.js × Cognito、#00034）に必須。backendがno-authのローカルプロファイルで動作する場合でも、frontend側のログイン自体は実際のCognito User Poolへの接続が必要（Phase1の`dev-user`による擬似ログインは廃止済み）。dev環境のCognito User Poolの値は[ielts-creater-infra](https://github.com/h-fujiwara-dev/ielts-creater-infra)の`terraform/envs/dev`ディレクトリで`terraform output`を実行して取得する
- `BACKEND_API_ORIGIN`: 下記いずれかの接続先を指定（未設定時は`http://localhost:8080`）

### パターン1: ローカルbackend + ローカルfrontend

backendを先に起動しておきます（[ielts-creater-backend](https://github.com/h-fujiwara-dev/ielts-creater-backend)で `docker compose up -d` + `SPRING_PROFILES_ACTIVE=local ./gradlew bootRun`）。backendはlocalプロファイルではno-auth・固定devユーザーで動作するため`BACKEND_API_ORIGIN`は未設定のままでよく、`GET /api/v1/me`もCognitoトークンの検証なしに成功します。

### パターン2: devバックエンド（AWS） + ローカルfrontend（#00043）

backendをローカルで起動する必要はありません。[#00044](https://github.com/h-fujiwara-dev/ielts-creater/blob/main/tickets/00044_backendのAWSインフラ構築とSupabase接続.md)で構築済みのdev環境のAWSインフラ（ECS Fargate + API Gateway + Cognito + Supabase）にそのまま接続できます。

```bash
BACKEND_API_ORIGIN=<ielts-creater-infraのterraform/envs/devでterraform outputして取得したapi_endpoint>
```

Cognito App Clientのコールバック URL（`http://localhost:3000/api/auth/callback/cognito`）・ログアウト URL（`http://localhost:3000`）は`terraform/envs/dev`のデフォルト値としてすでに許可されているため、追加設定は不要です。

```bash
npm install
npm run dev   # http://localhost:3000
```
