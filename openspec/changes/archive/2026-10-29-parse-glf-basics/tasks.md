# Tasks

## 1. 文書と基本イベント

設計: [D-01](design.md#d-01---行とインデントに基づくir)、[D-03](design.md#d-03---診断と参照検証)。

- [x] 1.1 [REQ-002/REQ-002-S01、REQ-002-S02] Coreテストに基準DSLとタイトル異常を追加し、`npm run test`で未実装の失敗を確認する。
- [x] 1.2 [REQ-002/REQ-002-S01、REQ-002-S02] IR、title、Object、メッセージ、処理、活性の解析を実装し、対象テストの成功を確認する。

## 2. 表示用の状態

設計: [D-02](design.md#d-02---表示用データの明示的な属性)。

- [x] 2.1 [REQ-003/REQ-003-S01、REQ-004/REQ-004-S01] DB参照、変更属性、FILE階層、SQLのテストを追加し、未実装の失敗を確認する。
- [x] 2.2 [REQ-003/REQ-003-S01、REQ-004/REQ-004-S01] schema、DB/FILE state、SQLの解析を実装し、対象テストの成功を確認する。

## 3. 分岐と診断

設計: [D-01](design.md#d-01---行とインデントに基づくir)、[D-03](design.md#d-03---診断と参照検証)。

- [x] 3.1 [REQ-005/REQ-005-S01、REQ-005-S02、REQ-005-S03] 基準DSLの分岐、入れ子、異常入力のテストを追加し、未実装の失敗を確認する。
- [x] 3.2 [REQ-005/REQ-005-S01、REQ-005-S02、REQ-005-S03] `alt`のイベント木と参照、インデント、未終了活性の診断を実装し、対象テストの成功を確認する。

## 4. 全体の整合性と検証

設計: [D-01](design.md#d-01---行とインデントに基づくir)、[D-02](design.md#d-02---表示用データの明示的な属性)、[D-03](design.md#d-03---診断と参照検証)。

- [x] 4.1 [REQ-002/REQ-002-S01、REQ-002-S02、REQ-003/REQ-003-S01、REQ-004/REQ-004-S01、REQ-005/REQ-005-S01、REQ-005-S02、REQ-005-S03] 実装、テスト、結果を台帳へ記録し、リンクとIDの対応を確認する。
- [x] 4.2 [REQ-002/REQ-002-S01、REQ-003/REQ-003-S01、REQ-004/REQ-004-S01、REQ-005/REQ-005-S01] `npm run check`と`npm run test:visual`を実行し、既存プレビューの回帰がないことを確認する。
- [x] 4.3 [REQ-002/REQ-002-S01、REQ-003/REQ-003-S01、REQ-004/REQ-004-S01、REQ-005/REQ-005-S01] `openspec validate parse-glf-basics --strict`とOpenSpec Verifyで成果物と実装を照合し、未解決事項を記録する。

## Workflow follow-up

- 2026-10-29に正式仕様へ同期し、アーカイブ後の参照を更新した。
