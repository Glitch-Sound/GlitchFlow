# Proposal

## Why

設計者は長い処理内容を1行に詰め込む必要があり、DSLとプレビューの両方で読みにくい。
処理ラベルを複数行で記述し、各行を図の同じカードに表示できるようにする。

## What Changes

- `ObjectID: 処理`の後に4空白下げた継続行、または`ObjectID:`の後に4空白下げた本文を記述できるようにする。
- 強調記号`*`で囲んだ複数行を1つの強調処理として表示する。
- カードと時間軸の寸法を行数に合わせ、後続要素との重なりを防ぐ。

## Scope

**In scope:**

- 処理の複数行解析、IR、プレビュー描画、診断、READMEとサンプルの更新。

**Out of scope:**

- メッセージや分岐ラベルの複数行化は別の表示規則を要するため対象外。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-002 | 文書メタデータと基本イベント | 変更 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md#要件一覧) |
| REQ-008 | 活性と処理の表現 | 変更 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |
| REQ-023 | メッセージと処理の視覚表現 | 変更 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- なし。

### Modified Capabilities

- `glf-parsing`: 複数行の処理を1つのイベントに変換する(REQ-002)。
- `sequence-rendering`: 処理と後続要素を行数に応じて配置する(REQ-008)。
- `preview-appearance`: 複数行の処理を同じカード内に表示する(REQ-023)。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-002 | 正常 | 通常・強調の継続行 | 解析 | [REQ-002-S03](specs/glf-parsing/spec.md#scenario-req-002-s03---複数行の処理を保持する) |
| REQ-002 | 異常 | 本文のない`FE:` | 解析 | [REQ-002-S04](specs/glf-parsing/spec.md#scenario-req-002-s04---空の処理を診断する) |
| REQ-008 | 正常 | 活性中の複数行処理 | 描画 | [REQ-008-S03](specs/sequence-rendering/spec.md#scenario-req-008-s03---複数行処理の時間軸を確保する) |
| REQ-023 | 正常 | 通常・強調の複数行処理 | プレビュー表示 | [REQ-023-S02](specs/preview-appearance/spec.md#scenario-req-023-s02---複数行の処理カードを表示する) |

## Impact

- 実装と配置: Coreのparserとlayout、WebviewのSVG描画を変更する。
- 互換性とデータ: 既存の1行処理は同じ記法と表示を維持する。
- 依存関係と文書: 追加パッケージは不要で、README、product.md、台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30に利用者が処理の複数行入力と表示を依頼した。
- 実装を妨げる未決事項: なし。
