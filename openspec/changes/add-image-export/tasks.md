# Tasks

## 1. SVGとPNGの全体出力

設計: [D-01](design.md#d-01---表示中svgから独立した画像を作る)。

- [x] 1.1 [REQ-033/REQ-033-S01、REQ-033-S02] Playwrightで図の全体出力とズーム非依存の失敗テストを作成する。
- [x] 1.2 [REQ-033/REQ-033-S01、REQ-033-S02] 表示中SVGのスタイル内包とPNG変換を実装し、出力を読み込んでテストを成功させる。
- [x] 1.3 [REQ-033/REQ-033-S01、REQ-033-S02] プレビューとの画素比較と大きな図の検査を記録する。

## 2. 保存操作とエラー通知

設計: [D-02](design.md#d-02---extensionが形式選択と保存を担当する)。

- [x] 2.1 [REQ-032/REQ-032-S01、REQ-032-S02、REQ-034/REQ-034-S01] コマンド、ボタン、保存、失敗のExtensionとPlaywrightテストを作り、失敗を確認する。
- [x] 2.2 [REQ-032/REQ-032-S01、REQ-032-S02、REQ-034/REQ-034-S01] 保存ダイアログとWebview通信を実装し、対象テストを成功させる。
- [x] 2.3 [REQ-032/REQ-032-S01、REQ-032-S02、REQ-034/REQ-034-S01] README、方針文書、台帳を更新し、保存結果を開いて検証記録へ記載する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-032/REQ-032-S01、REQ-032-S02、REQ-033/REQ-033-S01、REQ-033-S02、REQ-034/REQ-034-S01] `npm run check`、`npm run test:visual`、`npm run test:extension`を成功させる。
- [x] 3.2 [REQ-032/REQ-032-S01、REQ-032-S02、REQ-033/REQ-033-S01、REQ-033-S02、REQ-034/REQ-034-S01] OpenSpec strict検証と仕様、実装、テスト、台帳の照合を行う。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
