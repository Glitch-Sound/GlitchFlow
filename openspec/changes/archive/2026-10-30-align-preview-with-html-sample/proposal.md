# Proposal

## Why

設計者とレビュアーが`examples/login.glf`をプレビューすると、図の要素は表示されるが、[HTML試作](../2026-10-29-glitchflow-spec/glitchflow-sample.html)にあるObject種別、活性、処理、State、分岐の視覚的な区別が弱い。
現行のChromium画像ではDBとFILEの間隔も大きく、流れと状態を一続きに読むのが難しい。
参照HTMLの視覚表現を動的な図面へ反映する。

## What Changes

- Webviewプレビューと図面に、HTML試作に近い暗色パレット、背景、見出し、操作部の表現を適用する。
- Objectの種別ごとの色、種別の副題、活性バー、処理ラベル、メッセージラベルを区別して表示する。
- DBとFILEのStateを見出し付きカードとして表示し、ライフラインとの接続と直後のSQLの一体感を表す。
- フラグメントの見出しを背景付きで、`case`と`else`を枠と背景のない赤系の文字で表し、宣言順と時間順を保ったまま余白と間隔を調整する。
- Chromiumで基準DSLの前後画像を比較し、長文、別のState、入れ子、ライトテーマでも切れと重なりを検査する。
- 基準DSLの処理ラベルの小さな余白、応答線と活性下端の整列、DB値の表示形式、分岐ラベルの位置、活性バーの継ぎ目を調整する。
- DSLのObject IDを図面から除き、caseラベルを枠とaltに重ならない範囲で上げ、DBの列幅を表示文字列に近づける。
- caseラベルを枠と背景のない赤系の文字にし、Object枠の下とメッセージの前に小さな縦余白を加える。
- elseラベルもcaseと同じ枠と背景のない赤系の文字にする。
- 拡大縮小の操作ボタンに表示する文字を`-`、`Reset`、`+`に揃える。

## Scope

**In scope:**

- `examples/login.glf`のWebview図面と操作部の視覚表現。
- 内容の長さに応じたCoreレイアウト、SVG描画、Webview CSS、視覚回帰テスト。
- 既存の図面要件を維持した受け入れ条件と台帳の更新。

**Out of scope:**

- HTML試作の独立したDSL編集ペイン。
編集はVS Codeの通常のエディタが担う。
- HTML試作の固定座標と完全なピクセル一致。
入力内容とWebview幅に合わせた自動配置を優先する。
- DSL構文、解析、診断、外部データ操作の変更。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-022 | 図面とObjectの視覚表現 | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |
| REQ-023 | メッセージと処理の視覚表現 | 追加 | [シーケンス図](../../../product.md#シーケンス図) | [台帳](../../../traceability.md#要件一覧) |
| REQ-024 | StateとSQLのカード表現 | 追加 | [データ状態](../../../product.md#データ状態) | [台帳](../../../traceability.md#要件一覧) |
| REQ-025 | フラグメントの視覚表現と配置 | 追加 | [図面の操作](../../../product.md#図面の操作) | [台帳](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `preview-appearance`: 図面の視覚階層と動的配置を扱う。REQ-022からREQ-025を含む。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-022 | 正常 | `examples/login.glf` | プレビュー表示 | [REQ-022-S01](specs/preview-appearance/spec.md#scenario-req-022-s01---種別と活性を区別する) |
| REQ-023 | 正常 | 同じ入力 | プレビュー表示 | [REQ-023-S01](specs/preview-appearance/spec.md#scenario-req-023-s01---メッセージと処理を区別する) |
| REQ-024 | 正常 | 同じ入力 | プレビュー表示 | [REQ-024-S01](specs/preview-appearance/spec.md#scenario-req-024-s01---stateとsqlを一続きに読む) |
| REQ-025 | 境界 | 長文Stateと入れ子のフラグメント | プレビュー表示 | [REQ-025-S02](specs/preview-appearance/spec.md#scenario-req-025-s02---可変内容でも図を読める) |

## Impact

- 実装と配置: `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts`、`src/webview/app/styles.css`、`tests/visual/`。
- 互換性とデータ: `.glf`構文とIRに変更はない。
図面の外観と寸法は変わるが、既存ファイルはそのまま表示できる。
- 依存関係と文書: 新規パッケージは不要である。
HTML試作は視覚参考として保持し、仕様と`openspec/traceability.md`を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザー指示`なるべく参照HTMLにデザインを近づけたい`と、同日の5点および3点の細部改修依頼、2026-10-30のcase装飾と縦余白の2点、else装飾、および拡大縮小ボタンのラベル改修依頼。
- 実装を妨げる未決事項: なし。
