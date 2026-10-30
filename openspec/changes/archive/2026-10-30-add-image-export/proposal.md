# Proposal

## Why

設計者とレビュアーがGlitchFlowの図をVSCode外の設計書、README、Issueで利用するには、現在のプレビューを画像として保存する手段が必要である。

## What Changes

- 表示中の図をPNGまたはSVGで保存できるようにする。
- コマンドパレットとプレビューのボタンから同じ保存操作を起動する。
- 描画不能時と保存失敗時には原因を通知する。

## Scope

**In scope:**

- 図全体のPNG/SVG出力、形式と保存先の選択、エラー通知、出力画像の検証。

**Out of scope:**

- DSL以外のファイル、PDF、クリップボード、バッチ出力。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-032 | 画像エクスポート操作 | 追加 | [図面の操作](../../../product.md#図面の操作) | [台帳](../../../traceability.md) |
| REQ-033 | 全体図の品質 | 追加 | [描画規則](../../../tech.md#描画規則) | [台帳](../../../traceability.md) |
| REQ-034 | 失敗と状態保持 | 追加 | [構文と安全性](../../../tech.md#構文と安全性) | [台帳](../../../traceability.md) |

## Capabilities

### New Capabilities

- `diagram-export`: REQ-032からREQ-034のプレビュー図の画像保存。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-032 | 正常 | `login.glf`の図を表示中 | コマンド実行 | [REQ-032-S01](specs/diagram-export/spec.md#scenario-req-032-s01---コマンドから保存) |
| REQ-032 | 正常 | プレビューを表示中 | アイコンを押す | [REQ-032-S02](specs/diagram-export/spec.md#scenario-req-032-s02---プレビューから保存) |
| REQ-033 | 境界 | 大きなDB/FILE/SQLの図 | 画像出力 | [REQ-033-S01](specs/diagram-export/spec.md#scenario-req-033-s01---図全体を出力) |
| REQ-034 | 異常 | 図が描画できない | エクスポート | [REQ-034-S01](specs/diagram-export/spec.md#scenario-req-034-s01---失敗を通知する) |

## Impact

- 実装と配置: Webviewの既存SVGを複製して出力し、Extensionで保存ダイアログとファイル書き込みを扱う。
- 互換性とデータ: `.glf`と既存プレビューの内容は変更しない。
- 依存関係と文書: 新規ライブラリは不要であり、READMEと方針文書を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザーによる実装と検証の明示的な指示。
- 実装を妨げる未決事項: なし。
