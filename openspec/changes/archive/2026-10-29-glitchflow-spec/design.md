# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [REQ-001](specs/preview/spec.md#requirement-req-001---プレビューの起動)。
- 前提と制約: [技術スタック](../../../tech.md#技術スタック)、[アーキテクチャ](../../../tech.md#アーキテクチャ)、[配置原則](../../../structure.md#配置原則)に従う。
現在のリポジトリにはOpenSpec、README、npmによるOpenSpec CLI以外の製品コードがない。
[HTMLサンプル](glitchflow-sample.html)は完成像の視覚参考であり、固定座標や独自DSL編集ペインを今回の実装に移さない。

## Goals / Non-Goals

**Goals:**

- REQ-001-S01を、VSCode上のコマンドとWebviewの表示で確認できる状態にする。
- Core、Extension、Webviewのビルド境界を作り、後続のParserとRendererを追加できるようにする。
- [開発ツール方針](../../../tech.md#biomeとgitコミット時の自動チェック)の検査をnpmスクリプトに集約し、ローカルと将来のCIで再現できるようにする。

**Non-Goals:**

- `.glf`の解析、言語登録、図面描画、編集連動は後続変更に含める。
- HTMLサンプルの2ペイン画面、固定座標、手書きのトークン色分けはVSCode製品画面の仕様にしない。

## Decisions

### D-01 - 実行環境を分けた最小ビルド

- 対象: REQ-001-S01、後続機能の基盤。
- 選択: `src/core/index.ts`をDOM、VSCode、Vite非依存の公開APIとする。
ExtensionをesbuildでNode.js向けにビルドし、`vscode`を外部依存とする。
Webviewの`src/webview/app/main.ts`をViteで静的資産へビルドする。
- 理由: [技術方針](../../../tech.md#アーキテクチャ)の依存方向を保ち、後続のParserとRendererを個別にテストできる。
- 代替案: Viteで拡張本体もまとめてビルドする方式は、Node.jsとWebviewの実行環境を混同するため採用しない。
- 配置と依存: `src/core/index.ts`、`src/extension/extension.ts`、`src/webview/app/main.ts`、`vite.config.ts`、`esbuild.mjs`、`tsconfig.json`。
Coreから外側のモジュールを参照しない。

### D-02 - プレビューコマンドと安全な初期画面

- 対象: REQ-001-S01。
- 選択: `package.json`に`glitchflow.openPreview`コマンドを登録する。
Extensionは`src/extension/preview-panel.ts`でWebviewパネルを作り、Vite資産を`asWebviewUri`で参照させ、Content Security Policyを設定する。
Webviewの`pages/preview/ui`は`GlitchFlow Preview`見出しをDOMテキストとして描画する。
`.glf`ファイルを開いてコマンドを実行した場合の初期画面を作る。
- 理由: 仕様のシナリオを成立させ、ファイル解析やタイトル表示を後続変更へ分離できる。
- 代替案: HTMLサンプル全体をWebviewに複製する方式は、未実装の図を完成した出力として誤認させるため採用しない。
- 配置と依存: `package.json`、`src/extension/extension.ts`、`src/extension/preview-panel.ts`、`src/webview/pages/preview/index.ts`、`src/webview/pages/preview/ui/`。
ExtensionだけがVSCode APIに依存する。

### D-03 - 開発時とCIの同一検査

- 対象: 基盤構築の支援作業。
- 選択: Biomeの`check`、TypeScriptの`tsc`、SteigerとFSDプラグイン、Vitest、Playwright、Lefthookをnpmスクリプトから起動する。
`check:fsd`は`steiger ./src/webview`だけを対象とし、`check`はBiome、Steiger、型検査、単体テストを実行する。
`pre-commit`はステージされた対応ファイルのBiome、Webview全体のSteiger、型検査を実行し、ファイルを自動修正しない。
CIサービスの設定はこの変更に含めない。将来導入する際は、実行先に依存しない`check`と`test:visual`を利用する。
- 理由: [技術方針](../../../tech.md#fsd-v21の自動検証)の対象範囲と、[コミット時の方針](../../../tech.md#biomeとgitコミット時の自動チェック)を一致させる。
- 代替案: ESLintとPrettierを併用すると規則が重複するため採用しない。
- 配置と依存: `biome.json`、`steiger.config.ts`、`lefthook.yml`、`package.json`、`package-lock.json`。
`npm install`後に`lefthook install`を実行する手順をREADMEへ記載する。

### D-04 - 初期画面と基準DSLの検証

- 対象: REQ-001-S01、後続機能の回帰入力。
- 選択: `examples/login.glf`へ[基準DSL](input.md#基準dsl)を記録する。
Extension Test APIでコマンド登録とWebview生成を検証し、PlaywrightのChromiumでVite画面の見出しと初期画面を検証する。
Webview単独の描画テストとVSCode統合テストを別に保つ。
- 理由: 実画面の表示とExtension側の登録を、それぞれ実行環境に即して確認できる。
- 代替案: HTMLサンプルのスクリーンショットだけを回帰基準にすると、Extension側の不具合を検出できないため採用しない。
- 配置と依存: `examples/login.glf`、`tests/extension/preview.test.ts`、`tests/visual/preview.spec.ts`、`playwright.config.ts`、Vitest設定。
テスト名にREQ-001とシナリオIDを含める。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-001 | REQ-001-S01 | [D-01](#d-01---実行環境を分けた最小ビルド)、[D-02](#d-02---プレビューコマンドと安全な初期画面)、[D-04](#d-04---初期画面と基準dslの検証) | `src/extension/extension.ts`、`src/extension/preview-panel.ts`、`src/webview/pages/preview/ui/` | `tests/extension/preview.test.ts`でコマンドとパネル、`tests/visual/preview.spec.ts`で見出しと図面の非表示 |

## Verification Plan

- 正常: [REQ-001-S01](specs/preview/spec.md#scenario-req-001-s01---glfファイルを開いてプレビューを起動する)をExtension統合テストで確認する。
境界としてのファイル未オープン時の動作は今回の要件に含めない。
異常としての資産の読み込み失敗はビルドと統合テストの失敗として検出する。
- 非機能要件: 今回はNREQを追加しない。
`npm run check`、`npm run test:visual`、`npm run test:extension`の実行結果を支援作業の検証として台帳に記録する。
- 手動確認: VSCode Extension Development Hostでコマンドを実行し、Webviewの見出しとCSPエラーの有無を確認する。
結果と必要な画面証跡を台帳の検証記録へ残す。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate glitchflow-spec --strict`を実行し、仕様と設計に照合する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-02 | Vite資産のURIまたはCSPが誤るとパネルが空白になる | Development Hostで読み込みとWebviewのコンソールを確認する |
| D-03 | Steigerの設定やバージョンでFSD規則が変わる | lockfileで固定し、`src/webview`全体の検査を`npm run check`で実行する |
| D-04 | Chromiumの単独テストだけではVSCode内のパネル生成を確認できない | Extension Test APIと手動確認を併用する |

## Migration Plan

既存の製品コードと保存データはないため移行は不要である。
後続変更では初期画面の表示経路を保ったまま、CoreのIRをWebviewへ渡す。
導入に失敗した場合は、この変更で追加した製品コードと設定を戻し、既存のOpenSpec文書とREADMEの状態へ戻す。

## Open Questions

CIサービスの選定とVSCode Extension Test APIをその環境で起動できるかの確認は、CI導入時に行う。
この変更の受け入れ条件はローカルの統合テストと開発ホストの手動確認で検証する。
