// 実API接続までのモック関数を、実fetch相当のPromiseベースI/Fに揃えるためのヘルパー。
// 生成中スピナーや自動保存インジケーターなど、非同期の状態遷移を伴うUIをモックデータでも
// 実際に再現できるようにする。実API接続時はこのラッパーを外すだけで置き換えられる。
export function simulateDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}
