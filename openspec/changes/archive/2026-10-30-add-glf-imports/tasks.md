# Tasks

## 1. 構文と定義合成

設計: [D-01](design.md#d-01---coreは構文と定義合成を扱う)。

- [x] 1.1 [REQ-035/REQ-035-S01、REQ-035-S03、REQ-035-S04、REQ-036/REQ-036-S01] Coreテストを追加し、未実装による失敗を確認する。
- [x] 1.2 [REQ-035/REQ-035-S01、REQ-035-S03、REQ-035-S04、REQ-036/REQ-036-S01] Parser、IR、Validatorと共通の定義合成を実装し、Coreテストを成功させる。

## 2. ファイル解決と診断

設計: [D-02](design.md#d-02---extensionで依存グラフを解決する)。

- [x] 2.1 [REQ-035/REQ-035-S02、REQ-036/REQ-036-S02、REQ-036-S03] 複数、多段、循環、欠損、不正パス、構文エラーのExtensionテストを追加し、失敗を確認する。
- [x] 2.2 [REQ-035/REQ-035-S02、REQ-036/REQ-036-S02、REQ-036-S03] Extension側の相対パス解決と依存グラフ探索を実装し、診断テストを成功させる。

## 3. 更新と補完、プレビュー

設計: [D-03](design.md#d-03---解析結果を3つの利用者に共有する)。

- [x] 3.1 [REQ-037/REQ-037-S01、REQ-037-S02、REQ-035/REQ-035-S01] 未保存編集、ディスク変更、補完、プレビューのExtensionテストを追加し、失敗を確認する。
- [x] 3.2 [REQ-037/REQ-037-S01、REQ-037-S02、REQ-035/REQ-035-S01] 依存更新と共有解析結果を診断、補完、プレビューに接続し、テストを成功させる。
- [x] 3.3 [REQ-035/REQ-035-S01からS04、REQ-036/REQ-036-S01からS03、REQ-037/REQ-037-S01、REQ-037-S02] README、方針文書、台帳を更新し、実装とテストのリンクを照合する。

## 4. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 4.1 [REQ-035/REQ-035-S01からS04、REQ-036/REQ-036-S01からS03、REQ-037/REQ-037-S01、REQ-037-S02] `npm run check`、`npm run test:visual`、`npm run test:extension`を成功させ、回帰を確認する。
- [x] 4.2 [REQ-035/REQ-035-S01からS04、REQ-036/REQ-036-S01からS03、REQ-037/REQ-037-S01、REQ-037-S02] OpenSpec strict検証と仕様、設計、実装、テスト、台帳の照合を行い、検証記録へ結果を残す。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
