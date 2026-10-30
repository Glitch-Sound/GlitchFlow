# Proposal

## Why

ObjectとDBテーブルを利用する設計者は、定義を探すためにDSLとimport先を手作業で往復している。
参照の場所と明示された型情報を編集画面とプレビューから直接確認できるようにする。

## What Changes

- Object IDとテーブル参照から、ローカルまたはimport先の定義へ移動する。
- VSCodeの参照検索で、解決先が同じObjectとschemaの利用箇所を示す。
- DSLのHoverにObject情報またはschemaのカラムと型を示す。
- プレビューのDBカラムに型のツールチップを示す。

## Scope

**In scope:**

- `.glf`の解決済み定義、参照位置、依存更新、DBテーブルの表示。

**Out of scope:**

- SQL解析、DB接続、型推論、別形式のファイル。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-041 | 定義への移動 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-042 | 参照箇所の検索 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-043 | DSLの型情報Hover | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md) |
| REQ-044 | プレビューのカラム型Hover | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `dsl-symbol-navigation`: REQ-041からREQ-044の定義、参照、型情報の閲覧。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-041 | 正常 | import先のObjectとschemaを参照 | F12 | [REQ-041-S01](specs/dsl-symbol-navigation/spec.md#scenario-req-041-s01---複数ファイルの定義へ移動) |
| REQ-042 | 境界 | 同じ名前の参照が複数ある | 参照検索 | [REQ-042-S01](specs/dsl-symbol-navigation/spec.md#scenario-req-042-s01---解決先ごとの参照一覧) |
| REQ-043 | 異常 | 未解決のテーブル参照 | Hover | [REQ-043-S02](specs/dsl-symbol-navigation/spec.md#scenario-req-043-s02---未解決の情報は表示しない) |
| REQ-044 | 正常 | DB表に複数の同名カラム | カラムHover | [REQ-044-S01](specs/dsl-symbol-navigation/spec.md#scenario-req-044-s01---カラムの型を表示) |

## Impact

- 実装と配置: Coreのレイアウト、Extensionの言語機能、WebviewのDBカラム描画。
- 互換性とデータ: DSL構文と通常時のプレビュー外観は維持する。
- 依存関係と文書: 外部ライブラリは追加しない。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザーによる要件、実装方針と実装・検証の指示。
- 実装を妨げる未決事項: なし。
