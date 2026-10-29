# Design

## Context

- 提案: [proposal](proposal.md)。
- 対象仕様: [preview](specs/preview/spec.md)、[sequence-rendering](specs/sequence-rendering/spec.md)。
- 前提と制約: [構造](../../../structure.md#設計責務の境界)、[描画方針](../../../tech.md#レイアウトと描画)に従う。

## Goals / Non-Goals

**Goals:**

- REQ-001、REQ-006からREQ-008を既存IRから決定的に描画する。
- 活性の境界とメッセージの端点を同じ座標系で計算する。

**Non-Goals:**

- State、SQL、altの描画は専用の後続変更で扱う。

## Decisions

### D-01 - Coreで基本レイアウトを計算する

- 対象: REQ-006-S01、REQ-008-S01、REQ-008-S02。
- 選択: Webviewが文字幅を測り、Coreの純粋な`layoutSequence`へ渡す。
  Coreは宣言順にレーンを配置し、基本イベントへ行座標を割り当てる。
  State、SQL、altはこの段階で配置せず、未宣言Objectを参照するイベントは飛ばす。
- 理由: DOM取得と座標計算を分け、文字幅の変化を扱える。
- 代替案: 固定座標を使う方式はラベル長で切れるため採用しない。
- 配置と依存: `src/core/layout/sequence-layout.ts`をCore公開APIから使う。

### D-02 - SVGで図面を描く

- 対象: REQ-006-S01、REQ-007-S01、REQ-007-S02、REQ-008-S01。
- 選択: Webview UIはCore座標からSVGの枠、線、矢印、活性、テキストを作る。
  ラベルは`textContent`で設定し、ユーザー文字列をHTMLとして評価しない。
  図面の外側は横と縦のスクロールを許す。
- 理由: 一本の座標系で線の端点と活性の重なりを検査できる。
- 代替案: CSSだけで矢印を構成する方式は斜線と端点の整合が難しい。
- 配置と依存: `src/webview/pages/preview/ui/render-preview.ts`と`src/webview/app/styles.css`。

### D-03 - 起動時文書をWebviewへ渡す

- 対象: REQ-001-S01。
- 選択: Extensionは起動時のアクティブな`.glf`を解析し、Webviewのready通知後に型付きメッセージでIRとファイル名を渡す。
- 理由: CSPを保ち、DSLをHTMLへ直接埋め込まない。
- 代替案: DSLをscriptへ埋める方式はエスケープが複雑になる。
- 配置と依存: `src/extension/preview-panel.ts`、`src/webview/app/main.ts`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-001 | REQ-001-S01 | [D-03](#d-03---起動時文書をwebviewへ渡す) | `src/extension/preview-panel.ts` | `tests/extension/preview.test.ts`、`tests/visual/preview.spec.ts` |
| REQ-006 | REQ-006-S01 | [D-01](#d-01---coreで基本レイアウトを計算する) | `src/core/layout/sequence-layout.ts` | `tests/core/sequence-layout.test.ts` |
| REQ-007 | REQ-007-S01 | [D-02](#d-02---svgで図面を描く) | `src/webview/pages/preview/ui/render-preview.ts` | `tests/visual/sequence.spec.ts` |
| REQ-007 | REQ-007-S02 | [D-02](#d-02---svgで図面を描く) | `src/webview/pages/preview/ui/render-preview.ts` | `tests/visual/sequence.spec.ts` |
| REQ-008 | REQ-008-S01 | [D-01](#d-01---coreで基本レイアウトを計算する)、[D-02](#d-02---svgで図面を描く) | CoreとWebview | `tests/core/sequence-layout.test.ts`、`tests/visual/sequence.spec.ts` |
| REQ-008 | REQ-008-S02 | [D-01](#d-01---coreで基本レイアウトを計算する) | `src/core/layout/sequence-layout.ts` | `tests/core/sequence-layout.test.ts` |

## Verification Plan

- 正常、境界、異常: 上記テストで宣言順、矢印種別、応答省略、活性区間、未知Objectを確認する。
- 非機能要件: 今回は新規採番しない。
- 手動確認: Chromiumの描画を目視し、ラベルの切れ、線と活性の位置、スクロールを確認する。
- 全体検証: `npm run check`、`npm run test:visual`、`openspec validate render-sequence --strict`とVerifyを実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | alt内のイベントは今回未配置 | 後続の`support-alt-fragment`で配置し、現段階で経路を推測しない |
| D-02 | 長いラベルが隣のレーンに重なる | 測定幅をレーン間隔へ反映しChromiumで確認する |

## Migration Plan

既存のDSLとIR形式を変更しない。
初期画面の受け入れテストは図面付きの仕様へ更新する。

## Open Questions

なし。
