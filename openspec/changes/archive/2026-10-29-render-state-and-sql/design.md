# Design

## Context

- 提案: [proposal](proposal.md)。
- 対象仕様: [state-rendering](specs/state-rendering/spec.md)。
- 前提と制約: [CoreとWebviewの責務](../../../tech.md#アーキテクチャ)、[表示の優先事項](../../../product.md#設計上の優先事項)に従う。

## Goals / Non-Goals

**Goals:**

- REQ-009からREQ-011を既存IRの属性だけから決定的に配置する。
- 全文を選択可能なSVGテキストとして表示する。

**Non-Goals:**

- `alt`内のStateとSQLは後続変更で扱う。
- DSLの解析規則やIRを変更しない。

## Decisions

### D-01 - Coreで表示寸法と位置を計算する

- 対象: REQ-009-S01、REQ-010-S01、REQ-011-S01、REQ-011-S02。
- 選択: Webviewが文字幅を計測してCoreへ渡す。
  Coreはスキーマの完全な参照文字列でDBを対応付け、全カラムの幅、FILEノードの深さ、SQLの行幅から各枠の寸法を求める。
  状態枠は該当レーンの右に置き、後続レーンとの間隔と次イベントの縦位置を必要寸法だけ広げる。
- 理由: 情報を省略せず、既存シーケンスと同じ座標系を保てる。
- 代替案: 固定幅と折り返しは全カラムを横並びで表示する条件に合わない。
- 配置と依存: `src/core/layout/sequence-layout.ts`を拡張し、Coreの公開APIを維持する。

### D-02 - SVGのテキストノードで変更属性を装飾する

- 対象: REQ-009-S01、REQ-009-S02、REQ-010-S01、REQ-011-S01。
- 選択: DB表、FILEツリー、SQL枠をSVGの`rect`と`text`で作る。
  行、セル、ノードそれぞれのIR属性から赤文字と取り消し線を決め、`textContent`で値を入れる。
  SQLは複数行のテキストとして描く。
- 理由: ユーザー文字列をHTMLとして解釈せず、テキスト選択も維持できる。
- 代替案: `foreignObject`はWebviewの表示差と寸法管理を増やす。
- 配置と依存: `src/webview/pages/preview/ui/render-preview.ts`、`src/webview/app/styles.css`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-009 | REQ-009-S01 | [D-01](#d-01---coreで表示寸法と位置を計算する)、[D-02](#d-02---svgのテキストノードで変更属性を装飾する) | Coreレイアウト、Webview描画 | `tests/core/state-layout.test.ts`、`tests/visual/state.spec.ts` |
| REQ-009 | REQ-009-S02 | [D-02](#d-02---svgのテキストノードで変更属性を装飾する) | Webview描画 | `tests/visual/state.spec.ts` |
| REQ-010 | REQ-010-S01 | [D-01](#d-01---coreで表示寸法と位置を計算する)、[D-02](#d-02---svgのテキストノードで変更属性を装飾する) | Coreレイアウト、Webview描画 | `tests/core/state-layout.test.ts`、`tests/visual/state.spec.ts` |
| REQ-011 | REQ-011-S01 | [D-01](#d-01---coreで表示寸法と位置を計算する)、[D-02](#d-02---svgのテキストノードで変更属性を装飾する) | Coreレイアウト、Webview描画 | `tests/core/state-layout.test.ts`、`tests/visual/state.spec.ts` |
| REQ-011 | REQ-011-S02 | [D-01](#d-01---coreで表示寸法と位置を計算する) | Coreレイアウト | `tests/core/state-layout.test.ts` |

## Verification Plan

- 正常、境界、異常: 5シナリオと、スキーマ不一致時に別表を代用しないことをCoreとChromiumで確認する。
- 非機能要件: 新規採番はない。
- 手動確認: Chromiumのスクリーンショットで表、ツリー、SQL、スクロール範囲、重なりを確認する。
- 全体検証: `npm run check`、`npm run test:visual`、OpenSpec strict検証とVerifyを実施する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 長い値で隣のレーンへ重なる | 各列の計測幅をレーン間隔へ反映しChromiumで確認する |
| D-02 | 変更記号が値へ混入する | IRの表示値のみをテキスト化しテストで確認する |

## Migration Plan

DSLとIRの形式は変更しない。
表示に問題があれば本変更の描画差分を戻し、既存の基本シーケンス描画を利用する。

## Open Questions

なし。
