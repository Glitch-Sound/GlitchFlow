# Proposal

## Why

設計者が`.glf`を編集するとき、キーワード、参照ID、定型ブロックを記憶して入力する負担がある。
既存DSLをVSCode標準の候補UIから入力できるようにする。

## What Changes

- 実装済みキーワード、メッセージ記号、定型構文の補完を追加する。
- 解析できたObjectとschema定義から参照候補を表示する。
- 行とブロックの文脈に合わせて候補を絞り、構文エラーがあっても利用できる候補を残す。

## Scope

**In scope:**

- `.glf`用のVSCode標準補完、Snippet、説明、統合テスト。

**Out of scope:**

- SQL本文の補完、外部DBへの接続、未実装DSL構文の提案。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-029 | 定型構文補完 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-030 | 定義参照補完 | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md) |
| REQ-031 | 文脈別補完 | 追加 | [構文と安全性](../../../tech.md#構文と安全性) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `dsl-completion`: REQ-029からREQ-031の構文、参照、文脈別補完。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-029 | 正常 | 空行に`Obj` | 手動補完 | [REQ-029-S01](specs/dsl-completion/spec.md#scenario-req-029-s01---定型構文と記号) |
| REQ-030 | 正常 | schemaと`state DB.` | 手動補完 | [REQ-030-S01](specs/dsl-completion/spec.md#scenario-req-030-s01---定義済み参照) |
| REQ-031 | 異常 | 未完成の別行と`sql ` | 手動補完 | [REQ-031-S02](specs/dsl-completion/spec.md#scenario-req-031-s02---未完成の文書) |

## Impact

- 実装と配置: Extensionに補完Providerを追加し、Coreの既存Parser結果を利用する。
- 互換性とデータ: DSL、診断、プレビューの既存挙動を変更しない。
- 依存関係と文書: 新規依存は不要であり、製品と技術方針に補完を追記する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザーによる実装・検証までの明示的な指示。
- 実装を妨げる未決事項: なし。
