# Tasks

## 1. 寸法と時間軸

設計: [D-01](design.md#d-01---coreで表示寸法と位置を計算する)。

- [x] 1.1 [REQ-009/REQ-009-S01、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] `tests/core/state-layout.test.ts`で表幅、ツリー深さ、SQL位置、1回だけの表示を検査し、`npm test`で未実装の失敗を確認する。
- [x] 1.2 [REQ-009/REQ-009-S01、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] Coreのレイアウトを拡張し、`npm test`で対象テストの成功を確認する。
- [x] 1.3 [REQ-009/REQ-009-S01、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] 台帳にCoreの実装とテストの対応を記録し、リンクを確認する。

## 2. 描画と変更属性

設計: [D-02](design.md#d-02---svgのテキストノードで変更属性を装飾する)。

- [x] 2.1 [REQ-009/REQ-009-S01、REQ-009-S02、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] `tests/visual/state.spec.ts`で全セル、変更属性、FILE階層、SQL全文を検査し、`npm run test:visual`で未実装の失敗を確認する。
- [x] 2.2 [REQ-009/REQ-009-S01、REQ-009-S02、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] Webviewの描画を拡張し、`npm run test:visual`で対象テストの成功を確認する。
- [x] 2.3 [REQ-009/REQ-009-S01、REQ-009-S02、REQ-010/REQ-010-S01、REQ-011/REQ-011-S01、REQ-011-S02] 台帳に描画の実装とテストを記録し、リンクを確認する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-009、REQ-010、REQ-011] `npm run check`と`npm run test:visual`を実行し、Chromium画像で切れと重なりを確認して結果を台帳へ記録する。
- [x] 3.2 [REQ-009、REQ-010、REQ-011] `render-state-and-sql`のOpenSpec strict検証とVerifyを実施し、要件、シナリオ、設計、タスク、実装、テストの対応を確認する。

## Workflow follow-up

- 完了確認後に別途archiveを行い、正式仕様と台帳の参照を更新する。
