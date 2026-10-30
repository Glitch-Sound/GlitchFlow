# Tasks

## 1. 定義、参照、DSL Hover

設計: [D-01](design.md#d-01---構文位置と解決済み定義を結ぶ)、[D-02](design.md#d-02---3つのvscode-providerを同じ索引へ接続する)。

- [x] 1.1 [REQ-041/REQ-041-S01、S02、S03、REQ-042/REQ-042-S01、S02、REQ-043/REQ-043-S01、S02] `tests/extension/symbols.test.ts`に受け入れテストを追加し、対象テストが未実装のため失敗することを確認する。
- [x] 1.2 [REQ-041/REQ-041-S01、S02、S03、REQ-042/REQ-042-S01、S02、REQ-043/REQ-043-S01、S02] 共通索引と3つのProviderを実装し、対象テストを成功させる。
- [x] 1.3 [REQ-041/REQ-041-S01、S02、S03、REQ-042/REQ-042-S01、S02、REQ-043/REQ-043-S01、S02] READMEと台帳の実装・テスト対応を更新する。

## 2. プレビューの型表示

設計: [D-03](design.md#d-03---カラムと型をレイアウト経由で渡す)。

- [x] 2.1 [REQ-044/REQ-044-S01、S02] CoreとPlaywrightの受け入れテストを追加し、未実装による失敗を確認する。
- [x] 2.2 [REQ-044/REQ-044-S01、S02] schemaの型をレイアウトとWebviewに伝え、ツールチップの対象テストを成功させる。
- [x] 2.3 [REQ-044/REQ-044-S01、S02] READMEと台帳の実装・テスト対応を更新する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-041からREQ-044] `npm run check`、`npm run test:visual`、`npm run test:extension`を成功させ、結果を台帳に記録する。
- [x] 3.2 [REQ-041からREQ-044] OpenSpec strict検証とverifyで仕様、実装、テスト、台帳を照合する。

## Workflow follow-up

- 実装完了後にユーザーからアーカイブ指示があれば、config.yamlのarchive運用に従って同期とアーカイブを行う。
