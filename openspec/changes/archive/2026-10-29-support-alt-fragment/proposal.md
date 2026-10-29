# Proposal

## Why

設計者は`alt`の成功経路と失敗経路を記述しても、現在のプレビューでは分岐内のイベントと活性終了を確認できない。
排他的な経路を同じ図面上で読めるようにする必要がある。

## What Changes

- `alt`の各分岐を縦に並べ、枠、ラベル、分岐線と内部イベントを表示する。
- 分岐前の活性を各経路の明示的な終了まで描き、経路間の活性状態が異なる場合は診断する。

## Scope

**In scope:**

- `alt`と入れ子の`alt`、内部のメッセージ、処理、State、SQL、活性。
- 基準DSLの成功、失敗経路と異常な活性の回帰検証。

**Out of scope:**

- `opt`、`loop`、`par`、`break`は後続の変更で扱う。
- VSCodeのProblems連携は`integrate-glf-editor`で扱う。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-012 | alt分岐の描画 | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |
| REQ-013 | 分岐の活性整合性 | 追加 | [設計上の優先事項](../../../product.md#設計上の優先事項) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `alt-fragment`: REQ-012とREQ-013の排他的経路の表示と活性整合性を扱う。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-012 | 正常 | `examples/login.glf`の`case`と`else` | 描画 | [REQ-012-S01](specs/alt-fragment/spec.md#scenario-req-012-s01---ログインの成功と失敗を描画する) |
| REQ-012 | 境界 | `case`内に別の`alt` | 描画 | [REQ-012-S02](specs/alt-fragment/spec.md#scenario-req-012-s02---入れ子の分岐を描画する) |
| REQ-013 | 正常 | 分岐前に`FE+`、各経路に`FE-` | 解析と描画 | [REQ-013-S01](specs/alt-fragment/spec.md#scenario-req-013-s01---分岐ごとに活性を終了する) |
| REQ-013 | 異常 | 一方の経路だけに`FE-` | 解析 | [REQ-013-S02](specs/alt-fragment/spec.md#scenario-req-013-s02---活性状態の不一致を診断する) |

## Impact

- 実装と配置: Core ValidatorとLayout、WebviewのSVG描画を変更する。
- 互換性とデータ: 既存DSLとIRの構文は変えず、`alt`内の表示が追加される。
- 依存関係と文書: 新規ライブラリは不要であり、テストと台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザーによる`support-alt-fragment`の設計、実装、Verifyの明示指示と基準DSL。
- 実装を妨げる未決事項: なし。
