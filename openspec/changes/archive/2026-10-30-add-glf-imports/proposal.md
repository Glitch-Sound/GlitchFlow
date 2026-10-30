# Proposal

## Why

設計者が複数のフローで同じObjectとschemaを繰り返し記述している。
定義の差異を減らし、共通定義の修正を参照元へ反映する必要がある。

## What Changes

- トップレベルの`import "相対パス.glf"`でローカルファイルのObjectとschemaを参照できる。
- 複数・多段のインポートを解決し、定義の重複、循環、欠損、不正を診断する。
- 定義元の変更を参照元の診断、補完、プレビューへ反映する。
- インポートしないDSLの動作は維持する。

## Scope

**In scope:**

- ローカル`.glf`ファイルのObjectとschema、定義元情報、依存関係の更新。
- `DB.table`と`DB.schema.table`の参照。

**Out of scope:**

- メッセージ、活性区間、state、sql、複合フラグメント、titleの取り込み。
- URLとネットワークからの読み込み。
- 定義ジャンプのUI。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-035 | GLF定義のインポート | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-036 | インポートの診断 | 追加 | [構文と安全性](../../../tech.md#構文と安全性) | [台帳](../../../traceability.md) |
| REQ-037 | 依存更新と補完 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `glf-imports`: 他のGLFにあるObjectとschemaの再利用と依存管理。REQ-035からREQ-037。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-035 | 正常 | `common.glf`にObjectとschema、`flow.glf`にimportとstate | flowを開く | [定義を利用](specs/glf-imports/spec.md#scenario-req-035-s01---共通定義を使う) |
| REQ-035 | 境界 | AからB、BからCをimport | Aを開く | [多段定義を利用](specs/glf-imports/spec.md#scenario-req-035-s02---複数と多段のインポート) |
| REQ-036 | 異常 | 同名定義、循環、欠損ファイル | flowを開く | [原因を診断](specs/glf-imports/spec.md#scenario-req-036-s01---衝突を診断) |
| REQ-037 | 更新 | 共通定義が参照中 | commonを編集する | [依存先を更新](specs/glf-imports/spec.md#scenario-req-037-s01---定義元の変更を反映) |

## Impact

- 実装と配置: CoreのParser、Validator、IRとExtensionのファイル解決、診断、補完、プレビューに影響する。
- 互換性とデータ: importのない既存DSLは同じ解析・描画結果を維持する。
- 依存関係と文書: 外部パッケージを増やさず、READMEと方針文書を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザー指示で構文、対象定義、診断、更新、補完の要件が明示された。
- 実装を妨げる未決事項: なし。
