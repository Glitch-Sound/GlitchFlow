# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [preview-navigation](specs/preview-navigation/spec.md)。
- 前提と制約: [DSLと中間モデル](../../../tech.md#dslと中間モデル)と[診断、安全性、品質](../../../tech.md#診断安全性品質)。
- 調査結果: ParserのObjectとEvent、分岐は行番号を持つが、Layoutの描画要素では行番号が欠落する。

## Goals / Non-Goals

**Goals:**

- REQ-038からREQ-040の正確な位置対応、配置維持、編集後の安全性を満たす。

**Non-Goals:**

- 表示文字列や座標からの位置推測は行わない。

## Decisions

### D-01 - IRの行番号を描画要素まで渡す

- 対象: REQ-038-S01、REQ-038-S02、REQ-040-S02。
- 選択: LayoutのObject、メッセージ、処理、State、SQL、フラグメント、分岐へParserの行番号を伝播する。
- 選択: 活性バーは複数操作から結合されるためジャンプ対象にせず、処理とラベルを主要要素として扱う。
- 理由: 同一表示文字列でも要素ごとに宣言位置を保持できる。
- 代替案: DOMテキストや描画座標からの逆引きは同名要素で曖昧になる。
- 配置と依存: `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts`。

### D-02 - 表示済み文書版と行をExtensionで照合する

- 対象: REQ-039-S01、REQ-040-S01、REQ-040-S02。
- 選択: WebviewはSVG要素の行番号と描画IDを送る。
- 選択: importしたObjectは定義元URIと行番号を送り、Extensionが表示済み定義と現在の定義を照合する。
- 選択: Extensionは表示済み文書のURI、版、内容のハッシュ、描画ID、行番号を確認する。
- 選択: 既存の可視エディタを優先して`showTextDocument`し、対象行全体を選択して中央へ表示する。
- 理由: 更新待ちの古い図と不正なメッセージによる誤ジャンプを防げる。
- 代替案: 最新のテキストに対して古い行番号を適用すると、編集直後に別の記述へ移動する。
- 配置と依存: `src/webview/app/main.ts`、`src/extension/preview-panel.ts`。

### D-03 - SVG内でクリック対象を限定する

- 対象: REQ-038-S01、REQ-038-S02、REQ-040-S03。
- 選択: 対象のSVGグループやラベルに`data-source-line`を付け、イベント委譲でクリックを扱う。
- 選択: フラグメント枠の線、見出しと分岐ラベルを対象にし、枠の内部全面はクリック対象にしない。
- 理由: 内側の要素、スクロール、ズーム、テキスト選択との干渉を抑える。
- 配置と依存: `render-preview.ts`、`src/webview/app/styles.css`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-038 | REQ-038-S01 | [D-01](#d-01---irの行番号を描画要素まで渡す) | Layout、Renderer | Core、Playwrightで同名要素とStateの行を確認 |
| REQ-038 | REQ-038-S02 | [D-01](#d-01---irの行番号を描画要素まで渡す) | Layout、Renderer | Core、Playwrightでネスト分岐を確認 |
| REQ-039 | REQ-039-S01 | [D-02](#d-02---表示済み文書版と行をextensionで照合する) | Extension | Extensionテストで列、選択、配置を確認 |
| REQ-040 | REQ-040-S01 | [D-02](#d-02---表示済み文書版と行をextensionで照合する) | Extension | Extensionテストで編集直後と再描画後を確認 |
| REQ-040 | REQ-040-S02 | [D-02](#d-02---表示済み文書版と行をextensionで照合する) | Extension | Extensionテストで無効な要求を確認 |
| REQ-040 | REQ-040-S03 | [D-03](#d-03---svg内でクリック対象を限定する) | Webview | Playwrightでズーム、スクロール、選択を確認 |

## Verification Plan

- 正常、境界、異常: Core、Playwright、Extensionの各テストで仕様のシナリオを検証する。
- 非機能要件: 新規の性能要件はない。
- 手動確認: VSCodeの左右配置でクリックし、選択行とグループを確認して`verification.md`へ記録する。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証を成功させる。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-02 | 編集中に図の版が古くなる | 文書版を比較して移動を拒否する |
| D-03 | 枠のクリックが内部の要素を覆う | ラベルのみを対象とする |

## Migration Plan

DSL構文と設定の移行は不要である。

## Open Questions

なし。
