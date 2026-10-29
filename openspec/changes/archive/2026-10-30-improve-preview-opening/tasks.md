# Tasks

## 1. 自動起動と設定

設計: [D-01](design.md#d-01---エディタ表示イベントを起動契機にする)。

- [x] 1.1 [REQ-026/REQ-026-S01、REQ-026-S02、REQ-026-S03] Extension受け入れテストを追加し、未実装で失敗することを確認する。
- [x] 1.2 [REQ-026/REQ-026-S01、REQ-026-S02、REQ-026-S03] エディタ表示イベントと設定を実装し、Extensionテストで成功を確認する。

## 2. 単一パネルと手動起動

設計: [D-02](design.md#d-02---単一パネルと対象uriを管理する)、[D-03](design.md#d-03---閉鎖の抑制と標準メニュー)。

- [x] 2.1 [REQ-027/REQ-027-S01、REQ-027-S02、REQ-027-S03] 切り替え、閉鎖、連続起動の受け入れテストを追加し、未実装で失敗することを確認する。
- [x] 2.2 [REQ-027/REQ-027-S01、REQ-027-S02、REQ-027-S03] Webview管理を単一パネルへ改め、Extensionテストの成功を確認する。
- [x] 2.3 [REQ-028/REQ-028-S01、REQ-028-S02] 標準メニューの定義とテストを追加し、設定OFFでもアイコンと既存コマンドから起動できることを確認する。
- [x] 2.4 [REQ-026/REQ-026-S01、REQ-027/REQ-027-S01、REQ-028/REQ-028-S01] READMEと台帳の実装、テスト対応を更新する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-026/REQ-026-S01、REQ-027/REQ-027-S01、REQ-028/REQ-028-S01] `npm run check`と`npm run test:extension`を実行し、結果を台帳に記録する。
- [x] 3.2 [REQ-026/REQ-026-S01、REQ-027/REQ-027-S01、REQ-028/REQ-028-S01] OpenSpec strict検証と成果物の照合を行い、未解決事項を記録する。

## Workflow follow-up

- 必要に応じてconfig.yamlの運用に従い、仕様同期後にアーカイブする。
