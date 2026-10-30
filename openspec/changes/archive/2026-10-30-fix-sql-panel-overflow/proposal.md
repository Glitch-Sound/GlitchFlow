# Proposal

## Why

設計者がREADMEのSQLをプレビューすると、本文がカードの右辺を越える場合がある。
SQL全文を枠内で読めるという既存要件を満たすため、表示文字の寸法とカード幅を一致させる必要がある。

## What Changes

- SQL本文を実際の表示幅に収まるカードで描画する。
- 同じDBのState直後に置くSQLでは、表とSQLの共通幅を本文に合わせて確保する。

## Scope

**In scope:**

- SQL文字列の幅計測、カード幅とスクロール範囲、描画回帰の確認。
- READMEのサンプル画像の再生成。

**Out of scope:**

- SQLの実行、構文変更、自動折り返しは表示仕様の対象外である。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-011 | SQLの描画と状態配置 | 変更 | [レイアウト](../../../tech.md#レイアウトと描画) | [台帳](../../../traceability.md#要件ごとの変更履歴) |

## Capabilities

### New Capabilities

- なし。

### Modified Capabilities

- `state-rendering`: REQ-011のSQL本文と枠の寸法関係を明確にする。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-011 | 正常 | `state DB.sessions`直後に複数行のSQL | プレビュー描画 | [REQ-011-S01](specs/state-rendering/spec.md#scenario-req-011-s01---sqlをstateの下に表示する) |
| REQ-011 | 境界 | 等幅フォントで幅広くなるSQL行 | プレビュー描画 | [REQ-011-S03](specs/state-rendering/spec.md#scenario-req-011-s03---sql本文を枠内に収める) |

## Impact

- 実装と配置: Webviewの文字幅計測とCoreのSQLカード配置に影響する。
- 互換性とデータ: `.glf`の構文とIRは変わらず、必要なカード幅だけが増える。
- 依存関係と文書: 新規依存は不要であり、描画テスト、README画像、台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-30のユーザーによるSQL本文の枠外表示の指摘とOpenSpec経由の修正提案。
- 実装を妨げる未決事項: なし。
