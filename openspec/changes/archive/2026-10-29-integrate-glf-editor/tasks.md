# Tasks

## 1. 編集連動と診断

設計: [D-01](design.md#d-01---文書単位の更新と診断)。

- [x] 1.1 [REQ-014/REQ-014-S01、REQ-014-S02、NREQ-001/NREQ-001-S01] `tests/extension/preview.test.ts`へ編集追従と正常図保持の受け入れ確認を追加し、`npm run test:extension`で失敗を確認する。
- [x] 1.2 [REQ-015/REQ-015-S01] `tests/extension/diagnostics.test.ts`へProblemsの発生と解消を追加し、`npm run test:extension`で失敗を確認する。
- [x] 1.3 [REQ-014/REQ-014-S01、REQ-014-S02、REQ-015/REQ-015-S01、NREQ-001/NREQ-001-S01] Extensionの文書購読、150 ms更新、診断通知を実装し、`npm run test:extension`で対象テストの成功を確認する。
- [x] 1.4 [REQ-014/REQ-014-S01、REQ-014-S02、REQ-015/REQ-015-S01] 台帳へ実装、テストのリンクを記録し、対象シナリオとの対応を確認する。

## 2. エディタの構文配色

設計: [D-02](design.md#d-02---二段階の構文配色)。

- [x] 2.1 [REQ-016/REQ-016-S01、REQ-016-S02] `tests/extension/syntax-colors.test.ts`に言語登録と設定切替の確認を追加し、`npm run test:extension`で失敗を確認する。
- [x] 2.2 [REQ-016/REQ-016-S01、REQ-016-S02] Grammarと専用装飾を実装し、`npm run test:extension`で成功を確認する。
- [x] 2.3 [REQ-016/REQ-016-S01、REQ-016-S02] ライトとダークで可読性を確認し、台帳へ結果を記録する。

## 3. プレビューの操作

設計: [D-03](design.md#d-03---図の倍率とスクロール)。

- [x] 3.1 [REQ-017/REQ-017-S01] `tests/visual/editor.spec.ts`に倍率と右下端の受け入れ確認を追加し、`npm run test:visual`で失敗を確認する。
- [x] 3.2 [REQ-017/REQ-017-S01] 倍率状態と操作UIを実装し、`npm run test:visual`で成功を確認する。
- [x] 3.3 [REQ-017/REQ-017-S01] 台帳へ実装とChromium結果を記録する。

## 4. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 4.1 [REQ-014、REQ-015、REQ-016、REQ-017、NREQ-001] `npm run check`、`npm run test:visual`、`npm run test:extension`を実行し、結果を台帳に記録する。
- [x] 4.2 [NREQ-001/NREQ-001-S01] Development Hostで編集から表示までを測り、1秒以内を確認して証跡を台帳に記録する。
- [x] 4.3 [REQ-014、REQ-015、REQ-016、REQ-017、NREQ-001] OpenSpec strict検証とVerifyで要件、シナリオ、設計、タスク、実装、テストを照合し、結果を記録する。

## Workflow follow-up

- `config.yaml`のarchive運用に従ってアーカイブし、移動後の参照を確認する。
