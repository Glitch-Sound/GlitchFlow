# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [glf-imports](specs/glf-imports/spec.md)。
- 前提と制約: [DSLと編集](../../../product.md#dslと編集)、[構文と安全性](../../../tech.md#構文と安全性)。
- 既存の`parseGlf`は構文解析後に`validateGlf`を実行する。
- Extensionは診断、補完、プレビューで個別にParserを呼んでいる。

## Goals / Non-Goals

**Goals:**

- REQ-035からREQ-037の定義共有、診断、依存更新を単一の解決結果から提供する。

**Non-Goals:**

- ネットワーク読み込み、実行要素の合成、定義ジャンプUIは扱わない。

## Decisions

### D-01 - Coreは構文と定義合成を扱う

- 対象: REQ-035-S01からS04、REQ-036-S01。
- 選択: Parserにトップレベルのimportを加え、検証を後で実行できるようにする。
- 選択: 共通の定義合成処理がObject IDとschema参照を照合し、定義元URIと行を保持する。
- 理由: インポート先のイベントを除外し、読み込み後の定義集合で参照を検証できる。
- 代替案: テキストの連結は行番号とイベントの境界を失うため採用しない。
- 配置と依存: `src/core/model/glf-model.ts`、`parser/parse-glf.ts`、`validator/validate-glf.ts`、`core/index.ts`。

### D-02 - Extensionで依存グラフを解決する

- 対象: REQ-035-S02、REQ-036-S02、REQ-036-S03、REQ-037-S01。
- 選択: import行のファイルURIを基準に相対パスを解決し、open documentを優先して読み、閉じたファイルは`workspace.fs`から読む。
- 選択: 深さ優先探索の訪問中集合で循環を、完了集合で同一ファイルの再訪問を検出する。
- 選択: 依存URIを追跡してファイル監視と文書変更イベントから参照元を再解析する。
- 理由: CoreをVSCode非依存に保ち、未保存編集とディスク変更を同じ解決経路で扱える。
- 代替案: Coreのファイル読み込みとワークスペース全走査は責務と編集応答を悪化させる。
- 配置と依存: `src/extension/imports.ts`がファイル操作、依存関係と合成を担当する。

### D-03 - 解析結果を3つの利用者に共有する

- 対象: REQ-035-S01、REQ-037-S01、REQ-037-S02。
- 選択: Extensionの更新経路が解決済み文書を診断とプレビューへ渡し、補完も同じ解決結果を参照する。
- 選択: 非同期更新には文書版と更新番号を使い、古い結果で新しいプレビューを上書きしない。
- 理由: Parserを重複実装せず、3機能の候補と表示を一致させる。
- 代替案: 補完Providerごとにファイル走査する方式は不要な読み込みを増やす。
- 配置と依存: `extension.ts`、`diagnostics.ts`、`completion.ts`、`preview-panel.ts`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-035 | REQ-035-S01 | [D-01](#d-01---coreは構文と定義合成を扱う)、[D-03](#d-03---解析結果を3つの利用者に共有する) | Core、Extension、Preview | CoreとExtensionでDB参照と描画を確認 |
| REQ-035 | REQ-035-S02 | [D-01](#d-01---coreは構文と定義合成を扱う)、[D-02](#d-02---extensionで依存グラフを解決する) | Core、`imports.ts` | Extensionで複数、多段、同一ファイルの再利用を確認 |
| REQ-035 | REQ-035-S03 | [D-01](#d-01---coreは構文と定義合成を扱う) | Parser、`imports.ts` | CoreとExtensionでイベントとtitleの非取込を確認 |
| REQ-035 | REQ-035-S04 | [D-03](#d-03---解析結果を3つの利用者に共有する) | Extension | 既存Core、Extension、Visualの回帰テスト |
| REQ-036 | REQ-036-S01 | [D-01](#d-01---coreは構文と定義合成を扱う) | 合成処理 | 重複Objectとschemaの診断テスト |
| REQ-036 | REQ-036-S02 | [D-02](#d-02---extensionで依存グラフを解決する) | `imports.ts` | 循環インポートの終了と診断テスト |
| REQ-036 | REQ-036-S03 | [D-02](#d-02---extensionで依存グラフを解決する) | `imports.ts` | 欠損、非GLF、絶対パス、構文エラーの診断テスト |
| REQ-037 | REQ-037-S01 | [D-02](#d-02---extensionで依存グラフを解決する)、[D-03](#d-03---解析結果を3つの利用者に共有する) | 依存監視と更新経路 | 未保存編集とディスク変更のExtensionテスト |
| REQ-037 | REQ-037-S02 | [D-03](#d-03---解析結果を3つの利用者に共有する) | `completion.ts` | Objectと2形式のテーブル補完テスト |

## Verification Plan

- 正常、境界、異常: `tests/core/imports.test.ts`と`tests/extension/imports.test.ts`で9シナリオを確認する。
- 非機能要件: 新規NREQはない。
- 手動確認: import先を変更した際のプレビュー更新をExtension Hostテストで自動確認する。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-02 | 循環と多段参照で無限探索する | 訪問中と完了集合を分けて検証する |
| D-02 | 未保存編集とディスクの内容が異なる | 開いた文書を優先する |
| D-03 | 非同期結果が古い図を上書きする | 文書版と更新番号を照合する |

## Migration Plan

importのない既存文書は同期Parserの経路を維持する。
外部設定とDSLファイルの移行は不要である。

## Open Questions

なし。
