# Tasks

## 1. Coreの配置回帰

設計: [D-01](design.md#d-01---配置の構造をcoreで検査する)。

- [x] 1.1 [支援: D-01] 基準DSLのレーン中心、矢印端点、State寸法、SQL間隔、フラグメント区画、活性終了を`tests/core/layout-regression.test.ts`で検査し、`npm run test`の成功を確認する。

## 2. Chromium描画と基本操作

設計: [D-02](design.md#d-02---chromiumで描画境界と前面順を検査する)、[D-03](design.md#d-03---基本操作を同一画面で確認する)。

- [x] 2.1 [支援: D-02] 基準DSLの文字とStateの境界、フラグメントの前面順、活性終了を`tests/visual/layout-regression.spec.ts`で検査し、`npm run test:visual`の成功を確認する。
- [x] 2.2 [支援: D-03] 小画面で拡大、縮小、等倍、縦横スクロール、文書更新を連続して検査し、右下端まで到達できることを確認する。

## 3. 全体の整合性と検証

設計: [検証計画](design.md#verification-plan)。

- [x] 3.1 [支援: D-01からD-03] `npm run check`、`npm run test:visual`、`npm run test:extension`、`git diff --check`を実行し、結果と画像の目視確認を台帳へ記録する。
- [x] 3.2 [支援: D-01からD-03] OpenSpec strict検証とVerifyで提案、設計、タスク、テスト、実行結果の対応を照合し、報告を保存する。

## Workflow follow-up

- 必要に応じてarchive運用でアーカイブし、移動後のリンクを確認する。
