# Tasks

## 1. 分離した実行基盤

設計: [D-01](design.md#d-01---実行環境を分けた最小ビルド)。

- [x] 1.1 [支援: D-01] `package.json`、`package-lock.json`、`tsconfig.json`、`vite.config.ts`、`esbuild.mjs`を整え、ビルドとテストのnpmスクリプトを登録して`npm install`の成功を確認する。
- [x] 1.2 [支援: D-01] `src/core/index.ts`、`src/extension/extension.ts`、`src/webview/app/main.ts`の最小エントリを配置し、`npm run build`で両方の資産が生成されることと、CoreがVSCode、DOM、Viteを参照しないことを`npm run typecheck`とコードレビューで確認する。
- [x] 1.3 [支援: D-01] `tests/core`に公開APIのスモークテストを置き、`npm run test`の成功を確認して、基盤構築の検証結果を[台帳](../../../traceability.md#支援変更)へ記録する。

## 2. プレビュー起動

設計: [D-02](design.md#d-02---プレビューコマンドと安全な初期画面)、[D-04](design.md#d-04---初期画面と基準dslの検証)。

- [x] 2.1 [REQ-001/REQ-001-S01] `tests/extension/preview.test.ts`に、`.glf`を開いた場合のコマンド実行とパネル表示のテストを作り、`npm run test:extension`で未実装による失敗を確認する。
- [x] 2.2 [REQ-001/REQ-001-S01] `tests/visual/preview.spec.ts`に見出しの表示と図面の非表示を確認するテストを作り、`npm run test:visual`で未実装による失敗を確認する。
- [x] 2.3 [REQ-001/REQ-001-S01] `glitchflow.openPreview`、Webview資産URI、CSP、初期画面を実装し、`npm run test:extension`と`npm run test:visual`でシナリオの成功を確認する。
- [x] 2.4 [REQ-001/REQ-001-S01] VSCode Extension Development Hostで`.glf`を開いてコマンドを実行し、見出しとCSPエラーの有無を確認して、実装箇所、テスト名、結果を[台帳](../../../traceability.md#シナリオと検証の対応)へ記録する。

## 3. 開発時の検査とCIへの移植性

設計: [D-03](design.md#d-03---開発時とciの同一検査)。

- [x] 3.1 [支援: D-03] `biome.json`と`steiger.config.ts`を設定し、`npm run check:biome`と`npm run check:fsd`が全対象で成功することを確認する。
- [x] 3.2 [支援: D-03] `lefthook.yml`にステージ済みファイルのBiome検査、Webview全体のSteiger検査、型検査を設定し、`npm install`後の`lefthook install`と失敗時のコミット中断を確認する。
- [x] 3.3 [支援: D-03] CIサービスに依存しない`npm run check`と`npm run test:visual`をローカルで実行し、結果とCIサービスを今回設定しない判断を[台帳](../../../traceability.md#検証記録)へ記録する。

## 4. 基準入力と利用手順

設計: [D-04](design.md#d-04---初期画面と基準dslの検証)。

- [x] 4.1 [支援: D-04] [入力資料の基準DSL](input.md#基準dsl)を`examples/login.glf`へ転記し、原文との差分とUTF-8で読めることを確認する。
- [x] 4.2 [支援: D-03、D-04] READMEへインストール、ビルド、開発ホスト、`lefthook install`、検査コマンドと今回未実装の機能を記載し、記載した手順を実行して結果を[台帳](../../../traceability.md#支援変更)へ記録する。

## 5. 全体の整合性と検証

設計: [D-01](design.md#d-01---実行環境を分けた最小ビルド)、[D-02](design.md#d-02---プレビューコマンドと安全な初期画面)、[D-03](design.md#d-03---開発時とciの同一検査)、[D-04](design.md#d-04---初期画面と基準dslの検証)。

- [x] 5.1 [REQ-001/REQ-001-S01] `npm run check`、`npm run test:visual`、`npm run test:extension`を実行し、[仕様](specs/preview/spec.md)の見出しと初期表示が`.glf`を開いた場合の条件に合うことを確認して結果を台帳へ記録する。
- [x] 5.2 [支援: D-01、D-03、D-04] ビルド、Coreの依存方向、Lefthook、検査コマンドのCI移植性、基準DSLとREADMEの対応をレビューし、未実施と失敗の項目を区別して台帳へ記録する。
- [x] 5.3 [REQ-001/REQ-001-S01] `npx --no-install openspec validate glitchflow-spec --strict`とOpenSpec verifyを実行し、仕様、設計、タスク、実装、テスト、台帳の対応と未解決事項を確認する。

## Workflow follow-up

- [config.yamlのarchive運用](../../../config.yaml)に従ってアーカイブし、移動後の参照を確認する。
