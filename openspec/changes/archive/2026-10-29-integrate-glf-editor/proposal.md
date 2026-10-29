# Proposal

## Why

設計者が`.glf`を編集しても現在のプレビューは初回表示のままであり、診断もProblemsに出ない。
図面の確認とDSLの修正を同じVSCode作業内で続けられるようにする。

## What Changes

- 開いている`.glf`の編集にプレビューを追従させ、構文が不正な間は最後の正常な図を保持する。
- ParserとValidatorの診断をProblemsに表示する。
- `.glf`のテーマ追従ハイライトと任意の専用配色を提供する。
- プレビューに拡大、縮小、等倍と縦横スクロールを提供する。

## Scope

**In scope:**

- `.glf`の編集、保存、閉鎖、設定変更、テーマ変更に対応するVSCode連携。
- `examples/login.glf`を使った更新と描画の回帰確認。

**Out of scope:**

- `opt`、`loop`、`par`、`break`は後続変更で扱う。
- SQL実行やStateの推論は製品方針の対象外である。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-014 | 編集連動プレビュー | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md#要件一覧) |
| REQ-015 | Problems診断 | 追加 | [DSLと編集](../../../product.md#dslと編集) | [台帳](../../../traceability.md#要件一覧) |
| REQ-016 | DSL構文配色 | 追加 | [DSLエディタの配色](../../../product.md#dslエディタの配色) | [台帳](../../../traceability.md#要件一覧) |
| REQ-017 | プレビュー操作 | 追加 | [設計上の優先事項](../../../product.md#設計上の優先事項) | [台帳](../../../traceability.md#要件一覧) |
| NREQ-001 | 編集応答時間 | 追加 | [構文と安全性](../../../tech.md#構文と安全性) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `editor-integration`: REQ-014からREQ-017とNREQ-001の編集連携と表示操作を扱う。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-014 | 正常 | `login.glf`をプレビュー中 | タイトルを編集 | [REQ-014-S01](specs/editor-integration/spec.md#scenario-req-014-s01---編集結果を表示する) |
| REQ-014 | 異常 | 正常な図を表示中 | 不正な構文を入力 | [REQ-014-S02](specs/editor-integration/spec.md#scenario-req-014-s02---編集中の図を保持する) |
| REQ-015 | 異常 | 未宣言Objectと閉じ忘れ | 文書を編集 | [REQ-015-S01](specs/editor-integration/spec.md#scenario-req-015-s01---診断を表示して解消する) |
| REQ-016 | 正常 | `.glf`と通常のTypeScript | 設定を切り替え | [REQ-016-S01](specs/editor-integration/spec.md#scenario-req-016-s01---配色を切り替える) |
| REQ-017 | 境界 | 大きな図 | 拡大とスクロール | [REQ-017-S01](specs/editor-integration/spec.md#scenario-req-017-s01---図の全体を確認する) |
| NREQ-001 | 正常 | `examples/login.glf` | 文字を編集 | [NREQ-001-S01](specs/editor-integration/spec.md#scenario-nreq-001-s01---編集応答時間を測る) |

## Impact

- 実装と配置: Extensionのイベント購読と診断、TextMate Grammar、Webviewの画面状態を追加する。
- 互換性とデータ: DSLとIRの形式は変えず、既存`.glf`をそのまま扱う。
- 依存関係と文書: 新規ライブラリは使わず、`package.json`、テスト、台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザーによる設計、実装、Verifyの明示指示と、150 ms / 1秒以内という回答。
- 実装を妨げる未決事項: なし。
