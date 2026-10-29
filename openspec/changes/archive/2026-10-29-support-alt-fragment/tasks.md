# Tasks

## 1. 分岐の活性診断

設計: [D-02](design.md#d-02---経路単位の活性状態)。

- [x] 1.1 [REQ-013/REQ-013-S02] `tests/core/alt-layout.test.ts`に活性不一致のテストを作り、`npm test`で失敗を確認する。
- [x] 1.2 [REQ-013/REQ-013-S02] Validatorで経路出口の活性集合を比較し、`npm test`で診断を確認する。

## 2. 分岐の配置と描画

設計: [D-01](design.md#d-01---経路を保持したレイアウト)、[D-03](design.md#d-03---前面の透過フラグメント)。

- [x] 2.1 [REQ-012/REQ-012-S01、REQ-012-S02、REQ-013/REQ-013-S01] `tests/core/alt-layout.test.ts`と`tests/visual/alt.spec.ts`に基準DSL、入れ子、活性終了のテストを作り、未実装による失敗を確認する。
- [x] 2.2 [REQ-012/REQ-012-S01、REQ-012-S02、REQ-013/REQ-013-S01] Core Layoutで各経路のイベントと活性を配置し、Coreテストの成功を確認する。
- [x] 2.3 [REQ-012/REQ-012-S01、REQ-012-S02] Webviewで透過した枠とラベルを描き、Chromiumテストの成功を確認する。

## 3. 全体の整合性と検証

設計: [検証計画](design.md#verification-plan)。

- [x] 3.1 [REQ-012/REQ-012-S01、REQ-012-S02、REQ-013/REQ-013-S01、REQ-013-S02] `npm run check`と`npm run test:visual`を実行し、Chromium画像を確認して結果と実装対応を台帳へ記録する。
- [x] 3.2 [REQ-012、REQ-013] `support-alt-fragment`のOpenSpec strict検証とVerifyを行い、仕様、設計、タスク、実装、テストの対応を`verification.md`へ記録する。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
