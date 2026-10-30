# Tasks

## 1. 複数行処理の解析

設計: [D-01](design.md#d-01---インデントした行を処理へまとめる)。

- [x] 1.1 [REQ-002/REQ-002-S03、REQ-002-S04] `tests/core/parse-glf.test.ts`に継続行、強調、空本文のテストを追加し、対象テストの失敗を確認する。
- [x] 1.2 [REQ-002/REQ-002-S01、REQ-002-S02、REQ-002-S03、REQ-002-S04] `src/core/parser/parse-glf.ts`で複数行を1イベントへ解析し、対象テストと既存回帰の成功を確認する。
- [x] 1.3 [REQ-002/REQ-002-S03、REQ-002-S04] `openspec/product.md`と`openspec/traceability.md`の解析に関する記録を更新し、仕様と一致させる。

## 2. 複数行処理の配置と表示

設計: [D-02](design.md#d-02---最長行と行数で配置する)、[D-03](design.md#d-03---svgの行ごとにtspanを描く)。

- [x] 2.1 [REQ-008/REQ-008-S03、REQ-023/REQ-023-S02] `tests/core/sequence-layout.test.ts`と`tests/visual/sequence.spec.ts`に高さ、幅、表示、重なりのテストを追加し、対象テストの失敗を確認する。
- [x] 2.2 [REQ-008/REQ-008-S01、REQ-008-S02、REQ-008-S03] `src/core/layout/sequence-layout.ts`で行数と最長行を配置へ反映し、Coreテストの成功を確認する。
- [x] 2.3 [REQ-023/REQ-023-S01、REQ-023-S02] `src/webview/pages/preview/ui/render-preview.ts`で全行を1枚のカードに表示し、Playwrightテストの成功を確認する。
- [x] 2.4 [REQ-008/REQ-008-S03、REQ-023/REQ-023-S02] `README.md`に複数行記法と表示例を追加し、台帳の実装、テスト、検証結果を更新する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-002、REQ-008、REQ-023] `npm run check`と対象のPlaywrightテストを実行し、既存の1行表示を含む回帰がないことを確認して結果を台帳へ記録する。
- [x] 3.2 [REQ-002、REQ-008、REQ-023] `multiline-process-labels`のOpenSpec strict検証と成果物の照合を行い、要件、シナリオ、設計、タスク、実装、テストの対応を確認する。

## Workflow follow-up

- config.yamlのarchive運用に従い、アーカイブ時に正式仕様へ同期して参照を更新する。
