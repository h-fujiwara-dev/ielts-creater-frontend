// E2Eテスト専用の環境変数。認証情報をテストコードにハードコードしないためのアクセサ。
// 値の準備方法はREADME.md「Playwright E2Eテスト」節を参照。

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `環境変数 ${name} が未設定です。README.mdの「Playwright E2Eテスト」節を参照し、.env.localに設定してください。`
    );
  }
  return value;
}
