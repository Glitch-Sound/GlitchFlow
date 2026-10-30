# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [diagram-export](specs/diagram-export/spec.md)。
- 前提と制約: [既存の描画規則](../../tech.md#描画規則)と単一プレビューを再利用する。
- 実装調査: `renderPreview`は図本体とDB、FILE、SQLを単一のSVGに描画する。

## Goals / Non-Goals

**Goals:**

- REQ-032からREQ-034の保存操作、全体出力、失敗通知を成立させる。

**Non-Goals:**

- レイアウトの再計算と新規画像ライブラリは導入しない。

## Decisions

### D-01 - 表示中SVGから独立した画像を作る

- 対象: REQ-033-S01、REQ-033-S02。
- 選択: 表示中の`.sequence-diagram`を複製し、`viewBox`の全寸法に戻す。
- 選択: CSSの計算済み描画属性を複製側へ埋め込み、背景をSVG要素で明示してXMLSerializerで単独ファイル化する。
- 選択: PNGは同じSVGをImageとCanvasで2倍を基本にラスタライズする。
- 理由: Layout Engineの計算結果と描画要素をそのまま使い、SVGのテキストを維持できる。
- 代替案: DOMスクリーンショットはスクロール外を欠落させ、別Rendererはレイアウトを重複させるため採用しない。
- 配置と依存: `src/webview/pages/preview/model/export-diagram.ts`がSVG生成とPNG変換を扱う。

### D-02 - Extensionが形式選択と保存を担当する

- 対象: REQ-032-S01、REQ-032-S02、REQ-034-S01。
- 選択: コマンドとプレビューボタンは単一の保存処理へ集約する。
- 選択: `showQuickPick`と`showSaveDialog`を利用し、Webviewへ形式付き要求を送り、返却データを`workspace.fs.writeFile`で保存する。
- 選択: 応答に要求IDを付け、描画不能、変換不能、書込失敗を通知する。
- 理由: 保存先とファイル操作をExtensionに置き、Webviewは表示中SVGの変換だけを担える。
- 代替案: WebviewのダウンロードはVSCode標準保存ダイアログを利用できないため採用しない。
- 配置と依存: `src/extension/preview-panel.ts`と`extension.ts`、`src/webview/app/main.ts`、`render-preview.ts`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-032 | REQ-032-S01 | [D-02](#d-02---extensionが形式選択と保存を担当する) | Extensionのコマンドと保存処理 | Extensionテストでコマンドとファイルを確認 |
| REQ-032 | REQ-032-S02 | [D-02](#d-02---extensionが形式選択と保存を担当する) | プレビューボタンと通信 | Playwrightでアイコンとメッセージを確認 |
| REQ-033 | REQ-033-S01 | [D-01](#d-01---表示中svgから独立した画像を作る) | `export-diagram.ts` | PlaywrightでSVG/PNGを読み込み、要素と寸法を検査 |
| REQ-033 | REQ-033-S02 | [D-01](#d-01---表示中svgから独立した画像を作る) | `export-diagram.ts` | Playwrightでズーム、スクロール後の寸法を検査 |
| REQ-034 | REQ-034-S01 | [D-02](#d-02---extensionが形式選択と保存を担当する) | ExtensionとWebviewのエラー応答 | Extension/Playwrightテストで通知と状態を検査 |

## Verification Plan

- 正常、境界、異常: Playwrightで通常、複合フラグメントとDB/FILE/SQL、大きな図を出力して読み込む。
- 非機能要件: REQ-033の画質を2倍PNGの寸法、SVGテキストノード、プレビューとの画素比較で確認する。
- 手動確認: コマンドとボタンから保存ダイアログを操作し、出力ファイルを開いて検証記録へ残す。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | SVGのCSS変数と外部スタイルが消える | 計算済み属性を埋め込み、再読込テストをする |
| D-01 | 大きなPNGがCanvas上限に達する | 寸法と画素数を制限して縮小し、失敗時に通知する |
| D-02 | ダイアログ中にプレビューが変わる | 表示中の図を要求IDで特定し、古い応答を拒否する |

## Migration Plan

既存DSLと設定の移行は不要である。

## Open Questions

なし。
