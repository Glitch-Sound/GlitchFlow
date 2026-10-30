# Tasks

## 1. 定型構文と参照補完

設計: [D-01](design.md#d-01---解析済み定義と行文脈を組み合わせる)、[D-02](design.md#d-02---明示的な挿入範囲とsnippet)。

- [x] 1.1 [REQ-029/REQ-029-S01、REQ-030/REQ-030-S01] `tests/extension/completion.test.ts`を作成し、`npm run test:extension`で未実装の失敗を確認する。
- [x] 1.2 [REQ-029/REQ-029-S01、REQ-030/REQ-030-S01] Providerと登録処理を実装し、`npm run test:extension`で候補、Snippet、参照形式を確認する。
- [x] 1.3 [REQ-029/REQ-029-S01、REQ-030/REQ-030-S01] 製品、技術方針と台帳の対応を更新し、リンクを確認する。

## 2. 文脈と不完全入力

設計: [D-01](design.md#d-01---解析済み定義と行文脈を組み合わせる)。

- [x] 2.1 [REQ-031/REQ-031-S01、REQ-031-S02] ブロック文脈と構文エラーを含むExtensionテストを追加し、失敗を確認する。
- [x] 2.2 [REQ-031/REQ-031-S01、REQ-031-S02] 行文脈の絞り込みと文書版キャッシュを実装し、対象テストの成功を確認する。
- [x] 2.3 [REQ-031/REQ-031-S01、REQ-031-S02] 台帳へ実装とテストの実績を記載し、シナリオとの対応を確認する。

## 3. 全体の整合性と検証

設計: [Verification Plan](design.md#verification-plan)。

- [x] 3.1 [REQ-029/REQ-029-S01、REQ-030/REQ-030-S01、REQ-031/REQ-031-S01、REQ-031-S02] `npm run check`と`npm run test:extension`を実行し、全件成功を記録する。
- [x] 3.2 [REQ-029/REQ-029-S01、REQ-030/REQ-030-S01、REQ-031/REQ-031-S01、REQ-031-S02] `add-glf-completion`のOpenSpec strict検証と成果物の照合を行う。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
