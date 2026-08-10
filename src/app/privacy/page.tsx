import type { Metadata } from "next";

import {
  LegalList,
  LegalSection,
  LegalTable,
} from "@/components/legal/legal-content";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "プライバシーポリシー | IELTS Creator",
  description:
    "IELTS Creatorにおけるユーザーデータの取扱い方針について説明します。",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="プライバシーポリシー"
      enactedDate="2026-08-09"
      revisedDate="2026-08-09"
      crossLink={{ label: "利用規約", href: "/terms" }}
    >
      <LegalSection title="1. はじめに">
        <p>
          「IELTS Creator」（以下「本サービス」）は、個人開発者1名（法人ではない）が運営する、IELTS演習問題を生成・採点するWebアプリケーションです。本サービスは開発者自身のポートフォリオとして一般に公開されています。
        </p>
        <p>
          本プライバシーポリシーは、本サービスが取得する情報の種類、利用目的、外部サービスへの提供状況、およびユーザーが有する権利について説明するものです。
        </p>
      </LegalSection>

      <LegalSection title="2. 収集する情報">
        <p>本サービスは、サービス提供のために以下の情報を収集します。</p>
        <LegalTable
          headers={["区分", "収集する情報"]}
          rows={[
            [
              "アカウント情報",
              "認証基盤（Amazon Cognito）と紐づくユーザーID、メールアドレス、表示名",
            ],
            [
              "利用データ",
              "生成した問題セットの条件（セクション・トピック・難易度）、受験履歴（開始・提出日時、ステータス）、回答内容、採点結果・スコア",
            ],
            [
              "自動取得情報",
              "ログインセッションを維持するためのCookie（5. Cookieの利用を参照）",
            ],
          ]}
        />
        <p>
          パスワードそのものは本サービスのデータベースには保存されません。認証はAmazon
          Cognitoが管理します。
        </p>
      </LegalSection>

      <LegalSection title="3. 情報の利用目的">
        <p>収集した情報は、以下の目的の範囲内で利用します。</p>
        <LegalList
          items={[
            "ユーザー本人であることの認証、ログイン状態の維持",
            "トピック・難易度に応じた問題セットの生成、回答の自動採点、結果・解説の表示",
            "受験履歴・スコア推移の表示（履歴一覧・ダッシュボード）",
            "本サービスの品質改善（不具合調査等）",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. 外部サービスへの情報送信">
        <p>
          本サービスは、以下の外部サービスと連携して機能を提供しており、その過程で情報の送信が発生します。
        </p>
        <LegalTable
          headers={["送信先", "用途", "送信される情報"]}
          rows={[
            [
              "OpenAI API",
              "Structured Outputsによる問題文・設問の自動生成",
              "生成条件（トピック・難易度・セクション等）を含むプロンプト。ユーザーの個人情報（メールアドレス等）は含まない",
            ],
            [
              "Amazon Polly",
              "Listeningセクションの音声合成",
              "生成された台本テキスト",
            ],
            [
              "Amazon Cognito",
              "認証・アカウント管理",
              "メールアドレス、パスワード（Cognito側で管理）",
            ],
            [
              "AWS各種（Amazon RDS・Amazon S3・Amazon ECS Fargate等）",
              "アプリケーションの稼働基盤、データ・音声ファイルの保管",
              "本ポリシーに記載する各種データ全般",
            ],
          ]}
        />
        <p>
          各外部サービスにおける情報の取扱いは、それぞれの提供事業者のプライバシーポリシーに従います。
        </p>
      </LegalSection>

      <LegalSection title="5. Cookieの利用">
        <p>
          本サービスは、NextAuth.jsによるログインセッションの維持を目的としたCookie（httpOnly、暗号化）を使用します。これは認証機能に必須のものであり、無効化するとログイン状態を維持できません。
        </p>
        <p>
          広告配信・アクセス解析を目的としたCookieは、本ポリシー制定時点では使用していません。将来的に導入する場合は、本ポリシーを改定した上で周知します。
        </p>
      </LegalSection>

      <LegalSection title="6. データの保管・管理">
        <p>
          Listeningセクションの音声ファイルはAmazon
          S3に非公開で保管し、署名付きURLを通じてのみ配信します。
        </p>
        <p>
          データの保有期間・退会時の取扱い（アカウント削除に伴うデータ消去の範囲・タイミング等）については、本ポリシー制定時点では詳細を定めておらず、運用状況を踏まえて別途定める予定です。定め次第、本ポリシーを改定します。
        </p>
      </LegalSection>

      <LegalSection title="7. 第三者提供">
        <p>
          法令に基づく場合を除き、収集した情報を本人の同意なく第三者に提供することはありません。
        </p>
      </LegalSection>

      <LegalSection title="8. ユーザーの権利">
        <p>
          ユーザーは、自身の情報について開示・訂正・削除を求めることができます。請求方法は「12.
          お問い合わせ窓口」に従ってください。本サービスは個人開発（開発者1名）による運営のため、対応には一定期間を要する場合があります。
        </p>
      </LegalSection>

      <LegalSection title="9. セキュリティ対策">
        <p>
          本サービスは、収集した情報を保護するために以下の対策を講じています。
        </p>
        <LegalList
          items={[
            "通信のHTTPS化（ALB/CloudFrontでのTLS終端）",
            "Amazon Cognitoによる認証の委譲",
            "取得したトークンのhttpOnly・暗号化Cookieでの保存",
            "S3の非公開設定と署名付きURLによるアクセス制御",
            "Secrets ManagerによるAPIキー等の秘匿情報管理、IAMの最小権限設定",
          ]}
        />
      </LegalSection>

      <LegalSection title="10. 未成年の利用について">
        <p>
          本サービスは、未成年者の利用を積極的に想定した設計・年齢確認機能は備えていません。未成年者が利用する場合は、保護者の同意のもとで利用してください。
        </p>
      </LegalSection>

      <LegalSection title="11. ポリシーの変更">
        <p>
          本ポリシーの内容は、法令の改正やサービス内容の変更に応じて予告なく改定することがあります。改定後の内容は、本ページの更新をもって効力を生じるものとします。
        </p>
      </LegalSection>

      <LegalSection title="12. お問い合わせ窓口">
        <p>
          本ポリシーに関するお問い合わせは、本サービスの運営者（開発者）まで連絡してください（連絡先は今後確定次第、本ページに追記します）。
        </p>
      </LegalSection>

      <LegalSection title="13. 制定日・改定履歴">
        <LegalTable headers={["日付", "内容"]} rows={[["2026-08-09", "制定"]]} />
      </LegalSection>
    </LegalPageLayout>
  );
}
