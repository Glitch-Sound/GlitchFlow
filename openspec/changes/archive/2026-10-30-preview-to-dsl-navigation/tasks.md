# Tasks

## 1. ソース位置を描画まで伝える

設計: [D-01](design.md#d-01---irの行番号を描画要素まで渡す)。

- [x] 1.1 [REQ-038/REQ-038-S01、REQ-038-S02] CoreとPlaywrightの受け入れテストを追加し、未実装による失敗を確認する。
- [x] 1.2 [REQ-038/REQ-038-S01、REQ-038-S02] LayoutからSVGへ行番号を伝え、対象テストを成功させる。
- [x] 1.3 [REQ-038/REQ-038-S01、REQ-038-S02] 操作可能なカーソルを追加し、Playwrightで確認する。

## 2. エディタへのジャンプと鮮度検証

設計: [D-02](design.md#d-02---表示済み文書版と行をextensionで照合する)、[D-03](design.md#d-03---svg内でクリック対象を限定する)。

- [x] 2.1 [REQ-039/REQ-039-S01、REQ-040/REQ-040-S01、REQ-040-S02、REQ-040-S03] WebviewとExtensionの受け入れテストを追加し、未実装による失敗を確認する。
- [x] 2.2 [REQ-039/REQ-039-S01、REQ-040/REQ-040-S01、REQ-040-S02、REQ-040-S03] Webview通信、版の照合、既存エディタへの選択を実装し、対象テストを成功させる。
- [x] 2.3 [REQ-038/REQ-038-S01、REQ-038-S02、REQ-039/REQ-039-S01、REQ-040/REQ-040-S01、REQ-040-S02、REQ-040-S03] README、方針文書、台帳を更新し、仕様とリンク先を確認する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-038/REQ-038-S01、REQ-038-S02、REQ-039/REQ-039-S01、REQ-040/REQ-040-S01、REQ-040-S02、REQ-040-S03] `npm run check`、`npm run test:visual`、`npm run test:extension`を成功させ、結果を記録する。
- [x] 3.2 [REQ-038/REQ-038-S01、REQ-038-S02、REQ-039/REQ-039-S01、REQ-040/REQ-040-S01、REQ-040-S02、REQ-040-S03] OpenSpec strict検証とverifyを行い、仕様、実装、テスト、台帳を照合する。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
