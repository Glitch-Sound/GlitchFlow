# Tasks

## 1. 基本レイアウト

設計: [D-01](design.md#d-01---coreで基本レイアウトを計算する)。

- [x] 1.1 [REQ-006/REQ-006-S01、REQ-008/REQ-008-S01、REQ-008-S02] Coreレイアウトの受け入れテストを作成し、`npm test`で未実装の失敗を確認する。
- [x] 1.2 [REQ-006/REQ-006-S01、REQ-008/REQ-008-S01、REQ-008-S02] `layoutSequence`を実装し、同じテストの成功を確認する。
- [x] 1.3 [REQ-006/REQ-006-S01、REQ-008/REQ-008-S01、REQ-008-S02] 台帳にCoreの実装とテストの実績を記録する。

## 2. 図面と起動時連携

設計: [D-02](design.md#d-02---svgで図面を描く)、[D-03](design.md#d-03---起動時文書をwebviewへ渡す)。

- [x] 2.1 [REQ-001/REQ-001-S01、REQ-007/REQ-007-S01、REQ-007-S02、REQ-008/REQ-008-S01] Chromiumの受け入れテストを作成し、`npm run test:visual`で未実装の失敗を確認する。
- [x] 2.2 [REQ-001/REQ-001-S01、REQ-007/REQ-007-S01、REQ-007-S02、REQ-008/REQ-008-S01] WebviewのSVG描画とExtensionの起動時通信を実装し、描画テストとExtensionテストの成功を確認する。
- [x] 2.3 [REQ-001/REQ-001-S01、REQ-007/REQ-007-S01、REQ-007-S02、REQ-008/REQ-008-S01] 台帳にWebviewとExtensionの実装、テストの実績を記録する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-001、REQ-006、REQ-007、REQ-008] `npm run check`と`npm run test:visual`、Chromium表示を確認し、結果を台帳へ記録する。
- [x] 3.2 [REQ-001、REQ-006、REQ-007、REQ-008] `render-sequence`のOpenSpec strict検証とVerifyを行い、要件、設計、タスク、実装、テストの対応を確認する。

## Workflow follow-up

- 完了確認後に別途archiveを行い、正式仕様と台帳の参照を更新する。
