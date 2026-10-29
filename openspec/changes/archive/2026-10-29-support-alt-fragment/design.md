# Design

## Context

- 提案: [proposal](proposal.md)。
- 対象仕様: [REQ-012とREQ-013](specs/alt-fragment/spec.md)。
- 前提と制約: [製品の活性規則](../../../product.md#設計上の優先事項)、[CoreとWebviewの責務](../../../structure.md#設計責務の境界)。

## Goals / Non-Goals

**Goals:**

- REQ-012の各区画にすべてのイベントを記述順に配置する。
- REQ-013の活性を経路ごとに分離し、出口の整合性を診断する。

**Non-Goals:**

- 他の複合フラグメントの解釈は後続変更で扱う。
- エディタへの診断表示は後続変更で扱う。

## Decisions

### D-01 - 経路を保持したレイアウト

- 対象: REQ-012、REQ-012-S01、REQ-012-S02。
- 選択: Core Layoutで`alt`を再帰的に走査し、分岐ごとの開始、終了座標とラベルを持つフラグメント箱を返す。
- 理由: 分岐内のStateを含む全イベントに既存の寸法計測と配置規則を適用できる。
- 代替案: 分岐イベントをトップレベルへ単純に展開すると区画境界を失うため採用しない。
- 配置と依存: `src/core/layout/sequence-layout.ts`がIRから計算し、Webviewは結果だけを描く。

### D-02 - 経路単位の活性状態

- 対象: REQ-013、REQ-013-S01、REQ-013-S02。
- 選択: Validatorで分岐前の活性Mapを各経路へ複製し、出口のObject集合を比較する。
  Layoutは分岐前の活性を各経路の開始位置に引き継ぎ、明示的な終了で区切る。
- 理由: 一方の経路の終了操作が他方へ影響せず、暗黙終了も起きない。
- 代替案: 単一の活性Mapを経路間で使い回すと後続経路の活性が欠落するため採用しない。
- 配置と依存: `src/core/validator/validate-glf.ts`と`src/core/layout/sequence-layout.ts`。

### D-03 - 前面の透過フラグメント

- 対象: REQ-012、REQ-012-S01、REQ-012-S02。
- 選択: SVGのイベントとStateの後に、透明な枠、ラベル、分岐線を描く。
  枠の内側に余白を取り、ラベルとイベントの衝突を避ける。
- 理由: 境界線を前面に保ちながら内部を隠さない。
- 代替案: 不透明な枠を前面に描くとイベントが隠れるため採用しない。
- 配置と依存: `src/webview/pages/preview/ui/render-preview.ts`と`src/webview/app/styles.css`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-012 | REQ-012-S01 | [D-01](#d-01---経路を保持したレイアウト)、[D-03](#d-03---前面の透過フラグメント) | `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts` | `tests/core/alt-layout.test.ts`と`tests/visual/alt.spec.ts`で基準DSLを確認 |
| REQ-012 | REQ-012-S02 | [D-01](#d-01---経路を保持したレイアウト)、[D-03](#d-03---前面の透過フラグメント) | `src/core/layout/sequence-layout.ts` | `tests/core/alt-layout.test.ts`で入れ子を確認 |
| REQ-013 | REQ-013-S01 | [D-02](#d-02---経路単位の活性状態) | `src/core/layout/sequence-layout.ts` | `tests/core/alt-layout.test.ts`と`tests/visual/alt.spec.ts`で各終了位置を確認 |
| REQ-013 | REQ-013-S02 | [D-02](#d-02---経路単位の活性状態) | `src/core/validator/validate-glf.ts` | `tests/core/alt-layout.test.ts`で診断を確認 |

## Verification Plan

- 正常、境界、異常: 基準DSL、入れ子の分岐、活性不一致、既存のトップレベル描画をCoreとChromiumで確認する。
- 非機能要件: 対象なし。
- 手動確認: Chromiumのスクリーンショットで枠、ラベル、FILE状態、活性終了位置の切れと重なりを確認し、結果を`verification.md`へ記録する。
- 全体検証: `npm run check`、`npm run test:visual`、OpenSpec strict検証、Verifyで仕様と実装を照合する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 入れ子の枠が親からはみ出す | Coreで包含座標を検査する |
| D-02 | 活性の重複や分岐間の空白 | 各経路の開始、終了座標を検査する |

## Migration Plan

DSLとIRを変更しないため移行は不要である。
問題が生じた場合はレイアウトと描画の変更を戻し、既存のトップレベル表示に復帰する。

## Open Questions

なし。
