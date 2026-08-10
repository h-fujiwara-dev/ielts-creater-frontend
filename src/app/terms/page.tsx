import type { Metadata } from "next";

import {
  LegalList,
  LegalSection,
  LegalTable,
} from "@/components/legal/legal-content";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "利用規約 | IELTS Creator",
  description: "IELTS Creatorの利用条件・免責事項について説明します。",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="利用規約"
      enactedDate="2026-08-09"
      revisedDate="2026-08-09"
      crossLink={{ label: "プライバシーポリシー", href: "/privacy" }}
    >
      <LegalSection title="1. 適用">
        <p>
          本利用規約（以下「本規約」）は、「IELTS Creator」（以下「本サービス」）の利用条件を定めるものです。本サービスを利用するユーザーは、本規約に同意したものとみなします。
        </p>
      </LegalSection>

      <LegalSection title="2. 運営者情報">
        <p>
          本サービスは、個人開発者1名により、法人組織を持たない非商用（開発者自身のポートフォリオ）目的で運営されています。商用のIELTS対策サービスとしての品質・サポート体制を保証するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="3. 第三者商標・公式性に関する免責">
        <p>
          &quot;IELTS&quot;（International English Language Testing
          System）は、British
          Council・IDP: IELTS
          Australia・The University of
          Cambridge（Cambridge Assessment
          English）等の権利者が実施する試験の名称です。本サービスはこれらの団体とは提携・後援・公認等の関係を一切持たない、非公式の演習用アプリケーションです。本サービスが提供する問題・採点・スコア表示は、これら団体が実施する公式試験の内容・採点基準を保証するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="4. アカウント登録">
        <p>
          本サービスの利用にあたり、ユーザーはAmazon
          Cognitoを通じてアカウントを登録するものとします。ユーザーは、登録情報（メールアドレス等）を正確に保つ責任を負います。
        </p>
      </LegalSection>

      <LegalSection title="5. 禁止事項">
        <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
        <LegalList
          items={[
            "不正アクセス、認証情報の不正利用、その他本サービスのセキュリティを侵害する行為",
            "本サービスのリバースエンジニアリング、逆コンパイル、逆アセンブル",
            "生成された問題文・設問・解説等のコンテンツを、本サービス外で無断転用・再配布・商用利用する行為",
            "本サービスのサーバーに過度な負荷をかける行為、その他の運用を妨げる行為",
            "法令または公序良俗に違反する行為",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. AI生成コンテンツに関する免責">
        <p>
          本サービスが生成する問題文・設問・解説等のコンテンツは、OpenAI
          APIを用いて自動生成されたものです。その内容の完全な正確性を保証するものではなく、実際のIELTS試験の内容・出題傾向・採点基準と完全に一致しない場合があります。
        </p>
      </LegalSection>

      <LegalSection title="7. スコア・学習成果に関する免責">
        <p>
          本サービスが表示するバンドスコア相当の指標・採点結果・学習成果は、あくまで学習の目安として提供するものであり、公式なIELTSスコアを保証または代替するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="8. サービスの提供停止・変更・終了">
        <p>
          本サービスは個人開発により運営されているため、運営者の判断により、予告なくサービス内容の変更、提供の一時停止、または終了を行うことがあります。これによりユーザーに生じた損害について、運営者は責任を負いません。
        </p>
      </LegalSection>

      <LegalSection title="9. 知的財産権">
        <p>
          本サービスが生成する問題文・設問・解説等のコンテンツに関する権利は運営者に帰属します。ユーザーが入力した回答データについては、本サービスの提供（採点・履歴表示等）の目的の範囲内で運営者が利用できるものとします。
        </p>
      </LegalSection>

      <LegalSection title="10. 免責事項（総則）">
        <p>
          本サービスは、現状有姿で提供されます。運営者は、本サービスの利用によりユーザーに生じたいかなる損害についても、法令上許容される範囲で責任を負いません。
        </p>
      </LegalSection>

      <LegalSection title="11. 利用規約の変更">
        <p>
          本規約の内容は、法令の改正やサービス内容の変更に応じて予告なく改定することがあります。改定後の内容は、本ページの更新をもって効力を生じるものとします。
        </p>
      </LegalSection>

      <LegalSection title="12. 準拠法・裁判管轄">
        <p>
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の住所地を管轄する裁判所を第一審の専属的合意管轄裁判所とします（管轄裁判所は今後確定次第、本ページに追記します）。
        </p>
      </LegalSection>

      <LegalSection title="13. お問い合わせ窓口">
        <p>
          本規約に関するお問い合わせは、本サービスの運営者（開発者）まで連絡してください（連絡先は今後確定次第、本ページに追記します）。
        </p>
      </LegalSection>

      <LegalSection title="14. 制定日・改定履歴">
        <LegalTable headers={["日付", "内容"]} rows={[["2026-08-09", "制定"]]} />
      </LegalSection>
    </LegalPageLayout>
  );
}
