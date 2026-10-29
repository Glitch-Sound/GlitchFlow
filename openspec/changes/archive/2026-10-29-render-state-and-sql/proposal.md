# Proposal

## Why

設計者は現在のプレビューで処理の流れだけを確認でき、同じ時点のDBやFILEの期待状態とSQLを読めない。
解析済みの表示情報を時間軸上に配置する必要がある。

## What Changes

- DBのスキーマ全カラムと全行を横並びの表として表示する。
- FILEの階層と各ノードの変更属性を表示する。
- SQLをグレーの枠に表示し、連続する同じDBのStateの下に置く。
- StateとSQLの大きさに応じて列間隔と時間軸を広げる。

## Scope

**In scope:**

- トップレベルのStateとSQL、明示された変更属性の描画。
- 既存のシーケンスとの重なりを避ける配置とスクロール。

**Out of scope:**

- `alt`内の描画は次の`support-alt-fragment`で扱う。
- 状態の推論、SQL実行、外部データ操作、編集連動は扱わない。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-009 | DB状態の描画 | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md#要件一覧) |
| REQ-010 | FILE状態の描画 | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md#要件一覧) |
| REQ-011 | SQLの描画と状態配置 | 追加 | [レイアウト](../../../tech.md#レイアウトと描画) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `state-rendering`: REQ-009からREQ-011の表示用状態とSQLを扱う。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-009 | 正常 | `DB.users`の5カラムと1行 | 描画 | [REQ-009-S01](specs/state-rendering/spec.md#scenario-req-009-s01---全カラムを表示する) |
| REQ-009 | 境界 | `DB.public.users`の変更行 | 描画 | [REQ-009-S02](specs/state-rendering/spec.md#scenario-req-009-s02---変更属性を表示する) |
| REQ-010 | 正常 | 追加と削除を含むFILE階層 | 描画 | [REQ-010-S01](specs/state-rendering/spec.md#scenario-req-010-s01---階層と個別の変更属性を表示する) |
| REQ-011 | 正常 | 同じDBのState直後のSQL | 描画 | [REQ-011-S01](specs/state-rendering/spec.md#scenario-req-011-s01---sqlをstateの下に表示する) |

## Impact

- 実装と配置: CoreのレイアウトとWebviewのSVG描画を拡張する。
- 互換性とデータ: DSLとIRは変更しない。
- 依存関係と文書: 新規ライブラリは不要であり、テストと台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザーによる`render-state-and-sql`の設計、実装、Verifyの明示指示。
- 実装を妨げる未決事項: なし。
