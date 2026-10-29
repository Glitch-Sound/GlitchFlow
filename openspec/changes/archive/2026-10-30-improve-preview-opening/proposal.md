# Proposal

## Why

設計者が`.glf`を開くたびにコマンドパレットからプレビューを起動する手間がある。
編集開始時に図を並べ、必要なら明示的に再表示できるようにする。

## What Changes

- `.glf`のエディタ表示時に、既定で右側へプレビューを開く。
- 設定で自動起動を切り替え、エディタ右上のアイコンから手動起動する。
- 既存のパネルを再利用し、手動クローズを尊重する。

## Scope

**In scope:**

- VSCodeのエディタイベント、設定、メニュー、Webview管理、受け入れテスト。

**Out of scope:**

- DSL解析と描画の変更。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-026 | プレビュー自動起動 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-027 | プレビューの再利用とクローズ | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |
| REQ-028 | エディタの起動アイコン | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

なし。

### Modified Capabilities

- `preview`: 起動方法、パネル再利用、手動クローズを扱う。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-026 | 正常 | 自動起動が有効 | `.glf`を表示 | [REQ-026-S01](specs/preview/spec.md#scenario-req-026-s01---編集開始時の自動起動) |
| REQ-026 | 境界 | 自動起動が無効 | `.glf`を表示 | [REQ-026-S02](specs/preview/spec.md#scenario-req-026-s02---設定と対象外ファイル) |
| REQ-027 | 正常 | プレビューを表示中 | 別の`.glf`へ切り替え | [REQ-027-S01](specs/preview/spec.md#scenario-req-027-s01---単一パネルの再利用) |
| REQ-027 | 境界 | 手動で閉じた直後 | 同じ`.glf`を編集 | [REQ-027-S02](specs/preview/spec.md#scenario-req-027-s02---手動クローズを尊重する) |
| REQ-028 | 正常 | `.glf`を表示 | アイコンを押す | [REQ-028-S01](specs/preview/spec.md#scenario-req-028-s01---アイコンからの手動起動) |

## Impact

- 実装と配置: `src/extension/extension.ts`、`src/extension/preview-panel.ts`、`package.json`。
- 互換性とデータ: 既存コマンドを維持する。
  自動表示の既定値のみ変わる。
- 依存関係と文書: 外部依存は追加しない。
  READMEと台帳を更新する。

## Open Questions

なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザー依頼に、起動条件、設定、フォーカス、クローズ時の動作が指定されている。
- 実装を妨げる未決事項: なし。
