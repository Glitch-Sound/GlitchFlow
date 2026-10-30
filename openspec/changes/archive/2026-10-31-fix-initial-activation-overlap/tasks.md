# Tasks

## 1. Object枠と活性の間隔

設計: [D-01](design.md#d-01---先頭の活性開始位置を下限で守る)。

- [x] 1.1 [REQ-022/REQ-022-S03] `tests/visual/sequence.spec.ts`にObject枠と活性の間隔のテストを追加し、対象テストの失敗を確認する。
- [x] 1.2 [REQ-022/REQ-022-S03] `src/core/layout/sequence-layout.ts`で先頭活性の開始位置を修正し、対象テストの成功を確認する。
- [x] 1.3 [REQ-022/REQ-022-S01、REQ-022-S02、REQ-022-S03] 修正後の画像と`openspec/traceability.md`を更新し、仕様、実装、検証結果を対応づける。

## 2. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 2.1 [REQ-022/REQ-022-S01、REQ-022-S02、REQ-022-S03] `npm run check`と関連するPlaywrightテストを実行し、既存の描画を含む回帰がないことを確認する。
- [x] 2.2 [REQ-022/REQ-022-S03] `fix-initial-activation-overlap`のOpenSpec strict検証と成果物の照合を行い、未解決事項を確認する。

## Workflow follow-up

- アーカイブ時に正式仕様へ同期し、移動後の参照を確認する。
