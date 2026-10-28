# GlitchFlow - Structure

## 基本原則

Core、VSCode拡張、Webviewを明確に分離する。
WebviewはFSD v2.1に従い、画面単位から作り始める。
最初から細かいフォルダを作らず、必要な責務ができた時点で追加する。
長期的な方針は `openspec/product.md`、`openspec/tech.md`、`openspec/structure.md` に置く。

## 推奨ディレクトリ構成

```text
glitchflow/
├── openspec/
│   ├── config.yaml
│   ├── product.md
│   ├── tech.md
│   ├── structure.md
│   ├── traceability.md
│   ├── schemas/
│   │   └── glitchflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   │           ├── proposal.md
│   │           ├── spec.md
│   │           ├── design.md
│   │           └── tasks.md
│   ├── specs/
│   └── changes/
├── src/
│   ├── core/
│   │   ├── index.ts
│   │   ├── model/
│   │   ├── parser/
│   │   ├── validator/
│   │   └── layout/
│   ├── extension/
│   │   ├── extension.ts
│   │   ├── preview-panel.ts
│   │   ├── diagnostics.ts
│   │   └── syntax-colors.ts
│   └── webview/
│       ├── app/
│       │   ├── main.ts
│       │   └── styles.css
│       ├── pages/
│       │   └── preview/
│       │       ├── index.ts
│       │       ├── ui/
│       │       └── model/
│       └── shared/
│           └── lib/
├── syntaxes/
│   └── glf.tmLanguage.json
├── examples/
│   └── login.glf
├── tests/
│   ├── core/
│   ├── visual/
│   └── extension/
├── .github/
│   └── workflows/
│       └── ci.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── esbuild.mjs
├── biome.json
├── steiger.config.ts
└── lefthook.yml
```

これは目標構成の例であり、空のディレクトリまで先に作る必要はない。
OpenSpecの標準配置を使い、config.yamlのプロジェクト設定とカスタムスキーマを維持する。
OpenSpecによる変更仕様は `openspec/changes/<change-name>/specs/<capability-path>/spec.md`、正式仕様は `openspec/specs/<capability-path>/spec.md` に置く。
プロジェクト方針は3つのMarkdownを正とし、変更単位の設計を重複して記載しない。
`openspec/traceability.md` には要件IDの採番と、仕様、設計、タスク、実装、テスト、検証結果の対応関係を置く。
要件の本文はOpenSpec仕様に置き、台帳からリンクする。
`proposal.md`、`design.md`、`tasks.md` は変更ディレクトリの直下に置く。
テンプレートの原本は `openspec/schemas/glitchflow/templates/` で一元管理し、生成した成果物と区別する。
アーカイブ先は `openspec/changes/archive/<date>-<change-name>/` とする。

## 配置原則

### core

- `model` はIRとドメインの型を扱う。
- 文書の表示メタデータとして先頭の `title: "タイトル"` を保持し、図面のEventとは区別する。
- DBテーブルは `DB.table` と `DB.schema.table` の参照形式を扱い、入力された識別子を保持する。
- DBのレコード、セルとFILEのノードには、明示された変更の描画属性を保持する。
- `parser` は字句解析と構文解析を扱う。
- DBの `+`、`-`、`!` とFILEの `+`、`-` は `parser` で解釈し、表示文字列から取り除く。
- `validator` は構文上の参照、活性、分岐の意味検証と診断情報を扱う。
- `validator` は前後のStateの比較、FILEの親子操作の整合性、SQLとのデータ整合性を検証しない。
- `layout` は要素のサイズと位置を計算する。
- `core/index.ts` をCoreの公開APIとする。
- Coreから `extension`、`webview` を参照しない。

### extension

- `extension.ts` は拡張機能の起動と登録を行う。
- `preview-panel.ts` はWebviewの生成と通信を行う。
- `diagnostics.ts` はVSCode上のエラーと警告を表示する。
- `syntax-colors.ts` は専用配色設定を読み、`.glf` エディタのみに装飾を適用、解除する。
- `glitchflow.syntaxHighlighting` の既定値は `theme` とし、`glitchflow` はユーザーが選んだ場合だけ適用する。
- 通常のトークン分類は `syntaxes/glf.tmLanguage.json` に置き、VSCodeテーマに従う。
- 専用配色を使っても、VSCode全体のテーマやほかの言語の設定を書き換えない。
- VSCode APIへの依存をここへ集める。

### webview

- `app` は起動処理と共通スタイルを扱う。
- `pages/preview` はプレビュー画面を扱う。
- プレビュー見出しはCoreの`title`を使い、未指定時はExtensionから渡された`.glf`ファイル名を使う。
- `pages/preview/ui` は図面のDOM、SVG描画を扱う。
- 変更属性の文字色、取り消し線はUIで表現し、DSLの操作記号は描画しない。
- `pages/preview/model` はズームなどの画面状態を扱う。
- `shared` は画面固有でない小さな共通機能だけを扱う。
- 必要になるまでは `features`、`entities`、`widgets` を作らない。
- FSDのSliceを外部から使う場合は、その `index.ts` を経由する。
- Steigerの検査対象は `src/webview/` のみとする。

### 開発ツールとテスト

- `biome.json` で静的解析とフォーマットのルールを管理する。
- `steiger.config.ts` でFSD v2.1向けの推奨ルールを設定する。
- `lefthook.yml` でGitの `pre-commit` フックを管理する。
- `package.json` にBiome、Steiger、型検査、テストのnpmスクリプトを定義する。
- `.github/workflows/ci.yml` で同じ検査と描画テストを実行する。
- `syntaxes` には `.glf` のTextMateシンタックスハイライト定義を置く。
- タイトルを表示するためのファイル名取得はExtension側で行い、CoreからVSCode APIを参照しない。
- `examples` には手動確認と回帰テストで使うDSLを置く。
- `tests/core` はParser、Validator、Layoutの単体テストを置く。
- 差分記号の解釈とスキーマ有無の参照を、Coreの単体テストに含める。
- `tests/visual` はPlaywrightによる描画確認を置く。
- 赤文字、取り消し線、記号の非表示と、DB全カラムの表示を描画テストで確認する。
- `tests/extension` はVSCode連携の統合テストを置く。

## 設計責務の境界

- `core/parser` はDSLを解析して構造を生成し、DOMやVSCode APIを参照しない。
- `core/validator` は構文上の参照、活性区間、分岐の整合性を検証し、DBやFILEの状態変化の妥当性は判定しない。
- `core/model` は表示名、Object ID、元のDSLの位置、イベントの順序、分岐、変更属性を共通の型として定義する。
- `core/layout` は測定済みの寸法とIRから座標を計算し、DOMの取得やHTMLの生成を行わない。
- `webview/pages/preview/ui` は計算結果に従いHTML/CSS/SVGを描画し、DSLの意味解釈を行わない。
- `extension` はVSCodeのイベントとファイル名、診断、Webview通信を担当し、描画座標を計算しない。
- 回帰テストの基準DSLは `examples/` に置き、単体テストと描画テストで共通して使用する。
- 実装のためだけに不要な共通モジュールやフォルダを追加せず、明確な責務と再利用先ができた場合に分割する。

## 命名規則

- フォルダ名と通常のTypeScriptファイル名は `kebab-case` を基本とする。
- TypeScriptの型とインターフェースは `PascalCase` とする。
- 変数と関数は `camelCase`、定数は必要に応じて `UPPER_SNAKE_CASE` とする。
- DSLのObject IDは `FE`、`BE`、`DB`、`FILE` のような識別子を許可する。
- Object種別は `APP`、`API`、`DB`、`FILE`、`FEATURE`、`MODULE` を許可する。
- CSSクラスには画面または要素の役割がわかる名前を付ける。
- テストファイルは `*.test.ts`、描画テストは `*.spec.ts` を基本とする。
- OpenSpecの変更名は `add-dsl-parser` のような `kebab-case` とする。
- 設定ファイルは各ツールが指定する標準のファイル名を優先する。

## 依存ルール

- `extension` と `webview` は `core` の公開APIを利用できる。
- `core` は外側のモジュールへ依存しない。
- `webview` のFSDレイヤーは上位から下位のみを参照する。
- 同じFSDレイヤー内のSlice間で内部ファイルを直接参照しない。
- Coreの型をWebviewの `shared` に再定義しない。
- BiomeとSteigerの対象範囲を混同せず、FSDの規則をCoreへ適用しない。
