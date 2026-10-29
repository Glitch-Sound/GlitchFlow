# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [editor-integration](specs/editor-integration/spec.md)。
- 前提と制約: [tech.md](../../../tech.md#アーキテクチャ)、[structure.md](../../../structure.md#配置原則)。
- 既存の`preview-panel.ts`はコマンド時に一度だけ文書を送信する。

## Goals / Non-Goals

**Goals:**

- REQ-014、REQ-015、NREQ-001の文書変更と診断をVSCodeイベントから処理する。
- REQ-016の配色を`.glf`エディタだけに適用する。
- REQ-017の表示倍率とスクロールをWebviewで保持する。

**Non-Goals:**

- Parser、IR、DSL構文の変更は不要である。
- 新しい描画ライブラリの追加は不要である。

## Decisions

### D-01 - 文書単位の更新と診断

- 対象: REQ-014-S01、REQ-014-S02、REQ-015-S01、NREQ-001-S01。
- 選択: Extensionはプレビュー対象URIを保持し、変更後150 msで`parseGlf`を実行する。
  更新番号で古いタイマーを無効化し、診断は毎回更新する。
  診断が空のときだけWebviewへ文書を送る。
- 理由: 最後の正常な図を保持しつつ、入力中の誤りをProblemsに出せる。
- 代替案: 毎入力でWebviewを再生成する方式は表示状態とスクロールを失うため採用しない。
- 配置と依存: `extension.ts`が購読を登録し、`preview-panel.ts`が対象文書と通信、`diagnostics.ts`がVSCode診断を扱う。

### D-02 - 二段階の構文配色

- 対象: REQ-016-S01、REQ-016-S02。
- 選択: `syntaxes/glf.tmLanguage.json`で標準スコープを分類する。
  `syntax-colors.ts`は設定が`glitchflow`の場合にだけ編集範囲へ装飾を付け、テーマ変更とエディタ変更時に再適用する。
- 理由: 標準モードはテーマに従い、専用モードでも他のファイルやグローバル設定を変更しない。
- 代替案: `editor.tokenColorCustomizations`は全体へ影響するため採用しない。
- 配置と依存: `package.json`の言語登録とGrammar、`extension.ts`のイベント登録、`syntax-colors.ts`の装飾。

### D-03 - 図の倍率とスクロール

- 対象: REQ-017-S01。
- 選択: プレビュー上部に拡大、縮小、等倍ボタンを置き、SVGの表示寸法を倍率に応じて変更する。
  画面の更新時は倍率とスクロール位置を再利用する。
- 理由: 既存のレイアウト座標を維持し、全方向の内容を確認できる。
- 代替案: CSS transformだけではスクロール領域の寸法が追従しにくいため採用しない。
- 配置と依存: `webview/pages/preview/model`に倍率状態、`ui/render-preview.ts`に操作、`app/styles.css`に表示を置く。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-014 | REQ-014-S01 | [D-01](#d-01---文書単位の更新と診断) | `src/extension/preview-panel.ts` | `tests/extension/preview.test.ts`の編集追従 |
| REQ-014 | REQ-014-S02 | [D-01](#d-01---文書単位の更新と診断) | `src/extension/preview-panel.ts` | `tests/extension/preview.test.ts`の正常モデル保持 |
| REQ-015 | REQ-015-S01 | [D-01](#d-01---文書単位の更新と診断) | `src/extension/diagnostics.ts` | `tests/extension/diagnostics.test.ts`のProblems確認 |
| REQ-016 | REQ-016-S01 | [D-02](#d-02---二段階の構文配色) | `syntaxes/glf.tmLanguage.json`、`src/extension/syntax-colors.ts` | `tests/extension/syntax-colors.test.ts`の設定切替 |
| REQ-016 | REQ-016-S02 | [D-02](#d-02---二段階の構文配色) | `src/extension/syntax-colors.ts` | Development Hostでライトテーマ確認 |
| REQ-017 | REQ-017-S01 | [D-03](#d-03---図の倍率とスクロール) | `src/webview/pages/preview` | `tests/visual/editor.spec.ts`の倍率と端確認 |
| NREQ-001 | NREQ-001-S01 | [D-01](#d-01---文書単位の更新と診断) | `src/extension/preview-panel.ts` | Development Hostで編集から表示まで計測 |

## Verification Plan

- 正常、境界、異常: REQ-014からREQ-017のシナリオをExtensionとChromiumで確認する。
- 非機能要件: [NREQ-001-S01](specs/editor-integration/spec.md#scenario-nreq-001-s01---編集応答時間を測る)に従ってローカルDevelopment Hostで計測する。
- 手動確認: ライトとダークのテーマを切り替え、`.glf`以外の配色が変わらないことを確認し、結果を台帳に記録する。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証とVerifyを実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 編集の速い連続入力で古い結果が届く | 更新番号とタイマーの破棄をテストする |
| D-02 | テーマごとの可読性に差が出る | ライト・ダーク両方をDevelopment Hostで確認する |
| D-03 | 拡大時に端が切れる | Chromiumで右端と下端へのスクロールを確認する |

## Migration Plan

DSLは変更しない。
既存の`.glf`と設定の移行は不要である。
問題が生じた場合は設定を`theme`へ戻し、変更の差分を取り消す。

## Open Questions

なし。
