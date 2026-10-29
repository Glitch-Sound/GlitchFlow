# Proposal

## Why

設計者は`alt`以外の複合フラグメントを記述しても解析できず、条件付き処理、反復、並列区画、中断を図で確認できない。
元仕様の段階的な変更計画に従い、この4種類を追加する。

## What Changes

- `opt 条件:`、`loop 条件:`、`break 条件:`の本体を4空白下げて記述し、ラベル付きの枠に描画する。
- `par:`の中に2本以上の`case 名前:`を置き、各区画を描画する。
- `break`は中断の表示を表し、後続イベントも記述順に描画する。
- 活性は明示的な操作だけで変更し、経路出口の不一致を診断する。

## Scope

**In scope:**

- 4種類のParser、Validator、IR、Layout、Renderer、CoreとChromiumのテスト。

**Out of scope:**

- 実行時の条件判定、反復実行、並列実行、中断による後続イベントの省略は表示用DSLのため扱わない。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-018 | optとloop | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md) |
| REQ-019 | par区画 | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md) |
| REQ-020 | break表示 | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md) |
| REQ-021 | フラグメントの診断 | 追加 | [活性規則](../../../product.md#設計上の優先事項) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `other-fragments`: REQ-018からREQ-021の構文、表示、診断を扱う。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-018 | 正常 | `opt 許可:`と`loop 再試行:` | プレビュー | [シナリオ](specs/other-fragments/spec.md#scenario-req-018-s01---単一区画を描画する) |
| REQ-019 | 正常 | `par:`と2本の`case` | プレビュー | [シナリオ](specs/other-fragments/spec.md#scenario-req-019-s01---並列区画を描画する) |
| REQ-020 | 正常 | `break エラー:`と後続処理 | プレビュー | [シナリオ](specs/other-fragments/spec.md#scenario-req-020-s01---中断枠と後続を描画する) |
| REQ-021 | 異常 | 空本体、不正な区画、活性不一致 | 解析 | [シナリオ](specs/other-fragments/spec.md#scenario-req-021-s01---不正な構造と活性を診断する) |

## Impact

- 実装と配置: Coreのモデル、Parser、Validator、LayoutとWebviewのSVG描画を変更する。
- 互換性とデータ: 既存の`alt`と基準DSLは維持する。
- 依存関係と文書: 新しいパッケージは不要である。構文例と台帳を追加する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29の依頼と、構文および`break`の表示上の意味への回答。
- 実装を妨げる未決事項: なし。
