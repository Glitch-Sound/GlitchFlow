# Tasks

## 1. SQL本文の枠内表示

設計: [D-01](design.md#d-01---sqlの表示フォントで幅を計測する)、[D-02](design.md#d-02---表とsqlの共通幅を維持する)。

- [x] 1.1 [REQ-011/REQ-011-S03] `tests/visual/state.spec.ts`にSQL本文と枠の実座標を比較するテストを追加し、対象テストが旧実装で失敗することを確認する。
- [x] 1.2 [REQ-011/REQ-011-S01、REQ-011-S03] Webviewが渡すSQLの表示フォントの計測値をCoreのSQL幅に適用し、対象テストの成功とState、SQLの共通幅を確認する。
- [x] 1.3 [REQ-011/REQ-011-S01、REQ-011-S02、REQ-011-S03] README画像を再生成し、既存の配置テストと台帳の実装、テスト、検証記録を更新して一致を確認する。

## 2. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 2.1 [REQ-011/REQ-011-S01、REQ-011-S02、REQ-011-S03] `npm run check`と`npm run test:visual`を実行し、既存の描画と新しい境界条件がすべて成功することを確認する。
- [x] 2.2 [REQ-011/REQ-011-S01、REQ-011-S02、REQ-011-S03] OpenSpec strict検証と差分照合を行い、仕様、設計、タスク、実装、テスト、台帳の対応を確認する。

## Workflow follow-up

- config.yamlのarchive運用に従って仕様を同期し、変更をアーカイブした後で参照を確認する。
