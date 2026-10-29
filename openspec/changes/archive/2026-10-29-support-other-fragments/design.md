# Design

## Context

- 提案: [proposal](proposal.md)。
- 対象仕様: [REQ-018からREQ-021](specs/other-fragments/spec.md)。
- 前提と制約: [活性規則](../../../product.md#設計上の優先事項)、[CoreとWebview](../../../structure.md#設計責務の境界)。

## Goals / Non-Goals

**Goals:**

- REQ-018からREQ-020の本体と区画を既存の`alt`と同じ時間軸に配置する。
- REQ-021の構造と活性を診断する。

**Non-Goals:**

- 条件の評価や制御フローの実行は表示用DSLの範囲外である。

## Decisions

### D-01 - 共通のフラグメントIR

- 対象: REQ-018からREQ-021。
- 選択: 単一本体と複数区画を共通のフラグメントIRへ格納する。
- 理由: 入れ子の解析とレイアウトを共通化できる。
- 代替案: 種類ごとの独立した木は重複するため採用しない。
- 配置と依存: `src/core/model/glf-model.ts`、`src/core/parser/parse-glf.ts`。

### D-02 - 経路出口の活性

- 対象: REQ-021。
- 選択: `opt`と`break`は本体を通らない経路、`loop`は0回と1回の経路、`par`は各区画の出口を開始状態と比較する。活性集合が違えばフラグメント行へ診断する。
- 理由: 暗黙終了せず、後続に活性状態を一意に渡せる。
- 代替案: 本体の終了状態だけを採用すると省略経路の活性を失うため採用しない。
- 配置と依存: `src/core/validator/validate-glf.ts`。

### D-03 - 既存レイアウトへの展開

- 対象: REQ-018からREQ-020。
- 選択: 各フラグメントを既存の区画開始・終了タイムラインに展開し、種類と条件をレイアウト結果へ持たせる。SVGはイベント描画後に共通枠を描く。
- 理由: Stateや活性の寸法と前面の枠を維持できる。
- 代替案: 固定座標の描画は内容の長さと入れ子に追従できないため採用しない。
- 配置と依存: `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-018 | REQ-018-S01 | [D-01](#d-01---共通のフラグメントir)、[D-03](#d-03---既存レイアウトへの展開) | Parser、Layout、Renderer | `tests/core/other-fragments.test.ts`、`tests/visual/other-fragments.spec.ts` |
| REQ-019 | REQ-019-S01 | [D-01](#d-01---共通のフラグメントir)、[D-03](#d-03---既存レイアウトへの展開) | Parser、Layout、Renderer | 同上 |
| REQ-020 | REQ-020-S01 | [D-01](#d-01---共通のフラグメントir)、[D-03](#d-03---既存レイアウトへの展開) | Parser、Layout、Renderer | 同上 |
| REQ-021 | REQ-021-S01 | [D-01](#d-01---共通のフラグメントir)、[D-02](#d-02---経路出口の活性) | Parser、Validator | `tests/core/other-fragments.test.ts` |
| REQ-021 | REQ-021-S02 | [D-02](#d-02---経路出口の活性) | Validator | `tests/core/other-fragments.test.ts` |

## Verification Plan

- 正常、境界、異常: 4種類、入れ子、構造エラー、活性不一致、既存`alt`をCoreで確認する。
- 非機能要件: 新規の対象なし。
- 手動確認: Chromium画像で枠、ラベル、分岐線、活性、後続イベントの切れと重なりを確認し、`verification.md`に記録する。
- 全体検証: `npm run check`、`npm run test:visual`、OpenSpec strict検証、Verifyを実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-02 | 分岐後の活性が曖昧になる | 出口不一致を診断し、暗黙終了を避ける |
| D-03 | 入れ子の枠が重なる | Core座標とChromium画像を確認する |

## Migration Plan

既存DSLの構文は変更しない。
問題があれば追加した4種類の解析と描画を戻す。

## Open Questions

なし。
