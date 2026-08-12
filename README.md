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

## E2Eテスト（Playwright）

[#00047](https://github.com/h-fujiwara-dev/ielts-creater/blob/main/tickets/00047_PlaywrightによるE2Eテストの導入.md)で導入。上記「パターン2: devバックエンド（AWS） + ローカルfrontend」の構成（ローカルfrontend + AWS dev backend + dev Cognito User Pool）に接続して実行する。CI（GitHub Actions）への組み込みは対象外（別チケットで検討）。

### 事前準備

1. 「パターン2」の`.env.local`設定（`BACKEND_API_ORIGIN`・`COGNITO_*`）を済ませておく
2. dev Cognito User Poolに、E2E専用のテストユーザーを2種類用意し、`.env.local`に追記する（`.env.example`参照）
   - `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`: `name`属性を設定済みの正常系ユーザー（コアフロー・履歴一覧のテストで使用）
   - `E2E_NAMELESS_USER_EMAIL` / `E2E_NAMELESS_USER_PASSWORD`: `name`属性を**未設定のまま**作成したユーザー（[#00046](https://github.com/h-fujiwara-dev/ielts-creater/blob/main/tickets/00046_Cognito新規サインアップ時のdisplayName未設定バグ修正.md)の既知バグを再現するために使用）

   いずれもAWS管理者権限で作成する（実際のセルフサインアップ・メール確認コード入力の完了までは、確認コードがメール配信される都合上E2Eでは自動化していない）。

   ```bash
   aws cognito-idp admin-create-user \
     --user-pool-id <ielts-creater-infraのterraform/envs/devでterraform outputして取得したuser_pool_id> \
     --username <email> \
     --user-attributes Name=email,Value=<email> Name=email_verified,Value=true \
     --message-action SUPPRESS

   aws cognito-idp admin-set-user-password \
     --user-pool-id <user_pool_id> --username <email> --password <password> --permanent

   # E2E_USER_* のみ、backendのdisplayName検証を通すためnameを設定する
   # （E2E_NAMELESS_USER_* はこのコマンドを実行せず、name属性を未設定のままにする）
   aws cognito-idp admin-update-user-attributes \
     --user-pool-id <user_pool_id> --username <email> --user-attributes Name=name,Value=<display-name>
   ```

3. Playwrightのブラウザバイナリを未取得の場合は取得する: `npx playwright install chromium`

### 実行

```bash
npm run dev          # 別ターミナルでfrontendを起動しておく（http://localhost:3000）
npm run test:e2e
```

`playwright.config.ts`が`.env.local`を自動読み込みする。実行結果（HTMLレポート、gitignore対象）は`npx playwright show-report`で確認できる。

実dev環境（実Cognito・実backend・実DB・実AI生成API）に対して実行するため、コアフロー・履歴一覧のテストは実行のたびにOpenAI APIへの実リクエスト（費用）が発生する点に注意する。

### カバー範囲

- `e2e/core-flow.spec.ts`: ログイン→ダッシュボード→問題生成(Reading)→回答→採点のコアフロー
- `e2e/history.spec.ts`: 履歴一覧（S-06）からの再受験・結果再確認
- `e2e/signup.spec.ts`: 新規サインアップの入口確認、および[#00046](https://github.com/h-fujiwara-dev/ielts-creater/blob/main/tickets/00046_Cognito新規サインアップ時のdisplayName未設定バグ修正.md)で修正済みのdisplayNameフォールバック（`name`属性未設定時にemailのローカル部を使う）の検証
- `e2e/static-pages.spec.ts`: Top / プライバシーポリシー / 利用規約の表示・遷移確認
