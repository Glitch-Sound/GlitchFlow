# Proposal

## Why

複雑なフローでは、設計者が図の要素に対応するDSL記述を探す負担が大きい。
プレビューから直接その記述を選択できるようにする。

## What Changes

- メッセージ、処理、State、SQL、Object、複合フラグメントと分岐から対応するDSLへ移動する。
- DSLエディタを表示し、対象行を選択する。
- 編集後の古い位置情報による誤移動を防ぐ。

## Scope

**In scope:**

- SVG上の主要要素とローカルの`.glf`記述位置の対応、Webview通信、エディタ選択、鮮度検証。

**Out of scope:**

- 図上でのDSL編集と、表示文字列からの位置推測。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-038 | 描画要素からDSLへの移動 | 追加 | [図面の操作](../../../product.md#図面の操作) | [台帳](../../../traceability.md) |
| REQ-039 | エディタ表示と配置 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-040 | 位置情報の鮮度と安全性 | 追加 | [診断と安全性](../../../tech.md#診断安全性品質) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `preview-navigation`: REQ-038からREQ-040の図からDSLへの移動。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-038 | 正常 | 同名メッセージと複数Stateを表示 | 要素をクリック | [REQ-038-S01](specs/preview-navigation/spec.md#scenario-req-038-s01---描画要素の移動) |
| REQ-038 | 境界 | ネストしたaltとelseを表示 | 分岐ラベルをクリック | [REQ-038-S02](specs/preview-navigation/spec.md#scenario-req-038-s02---分岐の移動) |
| REQ-039 | 正常 | 左にDSL、右にプレビュー | 要素をクリック | [REQ-039-S01](specs/preview-navigation/spec.md#scenario-req-039-s01---配置と選択) |
| REQ-040 | 異常 | 編集直後の古い図 | 要素をクリック | [REQ-040-S01](specs/preview-navigation/spec.md#scenario-req-040-s01---古い位置の拒否) |

## Impact

- 実装と配置: CoreのLayout、WebviewのSVG描画、Extensionのプレビュー通信を変更する。
- 互換性とデータ: DSL構文と既存の描画外観は変更しない。
- 依存関係と文書: 新規ライブラリは不要である。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザーによる目的、要件、実装方針と実装・検証の指示。
- 実装を妨げる未決事項: なし。
