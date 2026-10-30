# Proposal

## Why

最初のイベントが`FE+`の図では、活性バーの上端がObject枠に入り込み、表示名と種別を読みにくくする。
複数行処理の実画面でもこの重なりが発生したため、開始位置を修正する。

## What Changes

- 最初のイベントが活性開始の場合、活性バーをObject枠の下に配置する。
- [複数行処理の実画面](../../../../docs/images/multiline-process-preview.png)を修正後の表示で更新する。

## Scope

**In scope:**

- 最初の活性開始とObject枠の間隔。
- 描画テストと実画面の更新。

**Out of scope:**

- メッセージの直後に始まる活性の接続位置: 既存の表示条件を維持するため。
- Object枠の形と配色: 重なりの原因ではないため。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-022 | 図面とObjectの視覚表現 | 変更 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- なし。

### Modified Capabilities

- `preview-appearance`: 最初の活性とObject枠の重なりを解消する(REQ-022)。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-022 | 正常 | 最初に`FE+`がある | プレビュー表示 | [REQ-022-S03](specs/preview-appearance/spec.md#scenario-req-022-s03---先頭の活性をobject枠の下に置く) |

## Impact

- 実装と配置: Coreのシーケンス配置とChromiumの描画テストに影響する。
- 互換性とデータ: DSLとIRの形式は変わらず、先頭の活性以降の表示位置だけが下がる。
- 依存関係と文書: 新しい依存はなく、READMEに使う実画面と台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-31のユーザー指示で、実画面のObjectと活性の重なりを修正することが指定された。
- 実装を妨げる未決事項: なし。
