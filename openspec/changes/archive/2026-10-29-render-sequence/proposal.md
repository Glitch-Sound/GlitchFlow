# Proposal

## Why

設計者は解析済みの`.glf`をまだ図として確認できない。
基本イベントを時間順に配置し、処理の流れを読めるプレビューが必要である。

## What Changes

- `.glf`を開いてプレビューを起動すると、現在の内容から基本シーケンス図を表示する。
- 宣言順のオブジェクト、ライフライン、要求・応答、活性、処理を描画する。
- 従来の空の初期プレビューという受け入れ条件を更新する。

## Scope

**In scope:**

- 基本イベントの自動配置と、`Global`、矢印種別、太字処理の表示。
- 起動時の文書内容をWebviewへ安全に渡すこと。

**Out of scope:**

- State、SQL、複合フラグメントの描画は後続の変更で扱う。
- 編集連動、診断表示、ズーム操作は後続のVSCode連携で扱う。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-001 | プレビューの起動 | 変更 | [対象機能](../../../product.md#対象機能) | [台帳](../../../traceability.md#要件一覧) |
| REQ-006 | 基本シーケンス配置 | 追加 | [レイアウトと描画](../../../tech.md#レイアウトと描画) | [台帳](../../../traceability.md#要件一覧) |
| REQ-007 | メッセージの表現 | 追加 | [対象機能](../../../product.md#対象機能) | [台帳](../../../traceability.md#要件一覧) |
| REQ-008 | 活性と処理の表現 | 追加 | [設計上の優先事項](../../../product.md#設計上の優先事項) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `sequence-rendering`: REQ-006からREQ-008の基本シーケンス図を扱う。

### Modified Capabilities

- `preview`: REQ-001の初期表示を図面付きに変更する。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-001 | 正常 | 基本イベントを含む`.glf` | プレビュー起動 | [REQ-001-S01](specs/preview/spec.md#scenario-req-001-s01---glfファイルを開いてプレビューを起動する) |
| REQ-006 | 正常 | FE、BEを宣言 | 描画 | [REQ-006-S01](specs/sequence-rendering/spec.md#scenario-req-006-s01---宣言順と時間順に配置する) |
| REQ-007 | 境界 | Global起点と応答なし要求 | 描画 | [REQ-007-S01](specs/sequence-rendering/spec.md#scenario-req-007-s01---矢印種別とglobal起点を表示する) |
| REQ-008 | 正常 | 明示的なFE+とFE- | 描画 | [REQ-008-S01](specs/sequence-rendering/spec.md#scenario-req-008-s01---活性と処理を表示する) |

## Impact

- 実装と配置: Coreのlayout、Webviewの描画、Extensionの起動時データ受け渡しを変更する。
- 互換性とデータ: DSLとIRの形式を維持する。
- 依存関係と文書: 新規ライブラリは不要で、受け入れテストと台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザーによる`render-sequence`の設計、実装、Verifyの明示指示。
- 実装を妨げる未決事項: なし。
