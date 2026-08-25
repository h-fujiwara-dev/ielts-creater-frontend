// SiteHeader/SiteFooter共通のトップページセクションへのアンカーリンク。
// ルート絶対パス+フラグメント（例: "/#features"）にすることで、/privacy・/terms等の
// 他ページからでも "/" への遷移+該当セクションへのブラウザ標準アンカースクロールが機能する。
export const navLinks = [
  { label: "特長", href: "/#features" },
  { label: "使い方", href: "/#how-it-works" },
  { label: "出題形式", href: "/#formats" },
];
