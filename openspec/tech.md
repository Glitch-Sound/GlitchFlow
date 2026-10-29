# GlitchFlow - Technology

## 基本方針

TypeScriptとWeb標準技術を中心に、依存関係を少なくして長期保守しやすい構成とする。
CoreはVSCode、DOM、ビルドツールに依存させない。
WebviewにはFSD v2.1を適用し、Pages Firstで必要な構造だけを作る。
静的解析とフォーマットはBiomeへ統一し、ESLintとPrettierは採用しない。

## 技術スタック

| 分類 | 採用技術 |
| --- | --- |
| 言語 | TypeScript(strict) |
| エディタ連携 | VSCode Extension API |
| `.glf` 構文ハイライト | VSCode TextMate Grammar(標準) |
| 任意の専用配色 | VSCode TextEditorDecorationType(`.glf` に限定) |
| プレビュー | VSCode Webview API |
| UI | Vanilla TypeScript、HTML、CSS |
| 配置 | CSS Gridと計算済みレイアウト座標 |
| 線、矢印 | 必要最小限のSVG |
| Webviewビルド | Vite |
| 拡張本体ビルド | esbuild(Node.js向け、`vscode` は外部依存) |
| 単体テスト | Vitest |
| 描画テスト | Playwright(Chromium) |
| 拡張統合テスト | VSCode Extension Test API(Extension側の動作を対象とする場合) |
| 静的解析、フォーマット | Biome(`@biomejs/biome`) |
| TypeScript型検査 | TypeScript Compiler(`tsc`) |
| FSDルール検査 | Steiger + `@feature-sliced/steiger-plugin` |
| Gitフック | Lefthook |
| 依存管理 | npm |

Reactは初期採用しない。
WebviewとVSCode拡張本体は実行環境が異なるため、それぞれ別にビルドする。
各ツールのバージョンは `package-lock.json` で固定する。

## アーキテクチャ

1. Extensionが `.glf` の変更を受け取る。
2. CoreのParserがDSLを構文解析する。
3. Validatorが構文と意味の整合性を検証する。
4. Coreが型付きのIR(中間モデル)を生成し、ExtensionからWebviewへ渡す。
5. WebviewがStateやSQLの必要な表示寸法を計測する。
6. DOMに依存しないLayout EngineがIRと計測値から列幅、行高、位置、重なり順を計算する。
7. Webviewがレイアウト結果をHTML/CSS/SVGへ描画する。

CoreはDOM、VSCode API、Viteに依存しない。
WebviewとExtensionはCoreの公開APIを使う。
Layout Engineには数値化した計測結果を渡し、DOMへの直接参照を持たせない。
VSCodeとWebviewのデータ交換にはメッセージ通信を使う。

## 描画規則

- ライフラインは同じ列の中心座標を共有する。
- メッセージの端点は活性バーの幅を考慮して決める。
- 活性区間は `Object+` と `Object-` の対応から計算し、`-` がない限り継続する。
- `alt` は排他的な経路として扱い、分岐ごとの活性終了を検証する。
- StateやSQLの実際のサイズを計測し、必要な行高と列幅を確保する。
- DBのセルごとの文字色と取り消し線、FILEのノードごとの文字色と取り消し線を反映する。
- 複合フラグメントの線とラベルは前面に配置し、背景は内部要素を隠さない。
- SQLとDB表の文字列はDOMのテキストとして描画し、選択、コピーを可能にする。
- 図が大きくなった場合はスクロールを優先し、内容を勝手に切り詰めない。

## 構文と安全性

- `.glf` は実行可能なスクリプトではなく、宣言と表示内容のデータとして扱う。
- 最初の非空行に `title: "タイトル"` を任意で認め、重複、空文字列、先頭以外での指定は診断する。
- `title` はIRの文書メタデータに保持し、プレビュー見出しへ渡す。
- タイトル未指定時はファイル名を表示し、図面のライフラインや時間軸は変えない。
- `Object` の種別は `APP`、`API`、`DB`、`FILE`、`FEATURE`、`MODULE` を許可する。
- 種別による色分けは `product.md` の規則に従う。
- DBテーブルの参照には `ObjectID.table` と `ObjectID.schema.table` を許可し、識別子を自動補完、解決しない。
- DBレコードの行操作は `added`、`removed`、`unchanged`、セル操作は `updated`、`unchanged` としてIRに保持する。
- FILEの各ノードの操作は `added`、`removed`、`unchanged` としてIRに保持し、子への伝播は行わない。
- `+`、`-`、`!` は構文解析時に表示属性へ変換し、レンダラーでは記号を表示しない。
- 追加、更新は赤文字、削除は赤文字と取り消し線、変更なしは通常色で表示する。
- 前後のStateを比較せず、操作の妥当性やSQLとのデータ整合性を判定しない。
- SQLは構文を保持して表示するだけで、実行しない。
- DSL中の文字列は安全なテキストとしてDOMに挿入し、HTMLとして評価しない。
- WebviewにはContent Security Policyを設定し、ローカル資産はVSCodeが許可するURIへ変換する。
- 解析に失敗した場合は診断を表示し、描画可能な最後の正常モデルを保持する。
- 編集中の描画更新はデバウンスを設け、古い解析結果による表示の上書きを防ぐ。
- デバウンス時間は、対象データと応答時間の合格基準を定義する変更で確定する。

## `.glf` のシンタックスハイライト

- 標準はVSCodeのTextMate Grammarでトークンを分類し、ユーザーが選択したテーマの色を使う。
- `.glf` 固有のTextMateスコープを定義し、既存の標準スコープへ適切に対応させる。
- 設定 `glitchflow.syntaxHighlighting` の既定値は `theme` とする。
- `glitchflow` を選んだ場合に限り、Extensionのエディタ装飾で`.glf`のキーワードなどに専用色を適用する。
- 専用色はダーク、ライトの両テーマで視認性を確保し、対象エディタの変更、閉鎖時には装飾を更新、破棄する。
- VSCode全体の `editor.tokenColorCustomizations` を自動変更しない。
- 専用色は `.glf` の編集画面だけの機能とし、Webview側の図面の配色には影響させない。
- Semantic TokensによるObject種別の色分けは将来の拡張候補とし、初期の必須要件にしない。
- `title` を含むDSLの基本トークンは標準、専用のどちらでも識別する。

## FSD v2.1の自動検証

公式に案内されているSteigerとFSDプラグインを利用する。
Steigerの対象は `src/webview/` のみとし、独立CoreとVSCode拡張本体はFSDの適用対象に含めない。
`steiger.config.ts` にFSDプラグインの推奨ルールを設定する。
`npm run check:fsd` から `steiger ./src/webview` を実行できるようにする。
FSDのレイヤー間参照、Slice間参照、公開APIの違反を検出する。
Steigerは開発途上のため、バージョンを固定し、必要な設計判断はコードレビューでも確認する。

## BiomeとGitコミット時の自動チェック

Biomeの `check` で静的解析、フォーマット、インポート整理を検査する。
BiomeはTypeScriptの型検査を代替しないため、`typecheck` には `tsc` を使用する。
Gitフックの管理にはLefthookを利用する。
ルートの `lefthook.yml` で `pre-commit` を設定する。

- Biomeはステージされた対応ファイルをチェックする。
- Steigerは変更ファイルだけでは依存関係全体を検証できないため、毎回 `src/webview/` 全体をチェックする。
- TypeScriptの型検査もコミット前に実行する。
- チェックに失敗した場合はコミットを中断する。
- コミット時にはソースを自動修正せず、修正後に再チェックする。

Lefthookは `npm install` 後に `lefthook install` を実行して有効化する。
開発環境の導入手順でもGitフックを必ず有効化する。
`pre-commit` はローカルの実行環境に依存し、`--no-verify` などで回避できる。CIを導入する場合は同じ検査を再実行する。

推奨するnpmスクリプト名を次のように統一する。

| スクリプト | 処理 |
| --- | --- |
| `check:biome` | Biomeで対象全体をチェックする |
| `check:fsd` | Steigerで `src/webview/` を検査する |
| `typecheck` | TypeScriptの型検査を実行する |
| `test` | Vitestの単体テストを実行する |
| `test:visual` | PlaywrightでChromium描画を確認する |
| `check` | Biome、Steiger、型検査、単体テストを実行する |

CIを導入する場合は、サービスに依存しない `check` と `test:visual` を実行する。特定のCIサービスは技術方針として固定しない。
コミット前は応答速度を優先し、Playwrightによる全画面の描画テストは実装完了時と、CIを導入した場合はCIでも行う。

## 設計時の重要事項

### DSLと中間モデル

- Parser、Validator、Layout Engine、Rendererの責務を分け、ParserからHTMLやSVGを生成しない。
- IRはメッセージ、処理、State、SQL、活性操作を記述順に保持し、複合フラグメントは入れ子構造として保持する。
- IRの各要素は元の`.glf`の位置情報を保持し、診断や将来のエディタ連携に利用できるようにする。
- IRはObjectの宣言と参照を分離し、表示名とObject IDを混同しない。
- Parserは変更記号を表示属性へ変換するだけとし、Stateの前後差分やSQLの結果を計算しない。
- 分岐内の活性区間は経路ごとに計算し、分岐の開始や終了で暗黙に活性を変更しない。
- 同じ入力から同じIRとレイアウト結果が得られるよう、暗黙の推測や実行順依存の状態を避ける。

### レイアウトと描画

- レイアウトはイベントの順序と共通のライフライン座標に基づいて計算し、HTMLサンプルの固定座標を製品ロジックに流用しない。
- DOMから得た寸法と計算座標を分離し、State、SQL、ラベルの幅と高さに応じて余白を確保する。
- メッセージの矢印は活性バーの外縁に接続し、活性バーの中央で矢印が隠れないようにする。
- 分岐の枠、ラベル、境界線は前面に描き、活性区間とメッセージの位置関係を壊さない。
- 図の内容が表示領域より大きい場合はスクロールさせ、勝手な省略や縮小をしない。
- フォント、ウィンドウ幅、ズームの変化で寸法が変わった場合は再計測し、再配置できる構造とする。
- 同じ画面の描画更新でWebview全体を再読み込みせず、更新対象とスクロール位置に配慮する。

### 診断、安全性、品質

- 記述途中の構文エラーは診断し、未完成のDSLによってプレビュー全体が使用不能にならないようにする。
- 編集ごとに更新番号を管理し、古い解析、計測結果で新しいプレビューを上書きしない。
- ExtensionとWebview間のメッセージは想定した型だけを受け付け、DSLやSQLの文字列をHTMLとして評価しない。
- DSL仕様を変更するときは、既存の`.glf`への互換性と回帰テストへの影響を確認する。
- 性能改善のためのキャッシュや並列処理は、測定で必要性を確認してから導入する。
- 新たなライブラリや抽象化は、既存技術で解決できない理由と保守負担をOpenSpecの設計で示してから採用する。

## OpenSpec変更の検証とレビュー

- 共通の開始条件と運用は [config.yaml](config.yaml)、成果物ごとの作成手順は [schema.yaml](schemas/glitchflow/schema.yaml) を参照する。
- UIやレイアウトに影響する変更では、正常例、境界例、異常例と描画テストを対応付ける。
- 実装完了後は自動テストに加えて、OpenSpecの `verify` ワークフローで仕様との一致を確認する。
- `verify` は助言的な検証であり、テストや人間のレビューの代わりにはしない。
- `verify` を利用できない環境では、同じ観点で手動確認し、未検証の事項を明記する。

## 開発基準

### EARSとGherkinの記述例

要件ID、EARS、Gherkin、BDDの共通ルールは [config.yaml](config.yaml) を参照する。
記録の形式は [traceability.md](traceability.md) を参照する。
下表は条件に応じたEARSの書き方を示す。

| 種類 | 本文の形式 |
| --- | --- |
| 常時 | システムは SHALL <応答>する |
| イベント | WHEN <契機>、システムは SHALL <応答>する |
| 状態 | WHILE <状態>、システムは SHALL <応答>する |
| 異常 | IF <異常条件>、THEN システムは SHALL <対処>する |
| 任意機能 | WHERE <機能が有効>、システムは SHALL <応答>する |

以下はタイトル表示の記述例であり、記載したIDを採番済みとして扱わない。

```markdown
### Requirement: REQ-001 - 明示したタイトルの表示

WHEN 有効なtitleを持つ.glfファイルの解析が成功したとき、GlitchFlowは SHALL titleの文字列をプレビューの見出しに表示する。

#### Scenario: REQ-001-S01 - タイトルを見出しに表示する

- **GIVEN** login.glfの最初の非空行が `title: "ログインフロー"` で、本文に `Object FE as "フロントエンド" type APP` だけが続く。
- **WHEN** 利用者がlogin.glfのプレビューを開く。
- **THEN** プレビューの見出しは `ログインフロー` と一致する。
```

### 変更と実装の基準

- 関数と型の名前は役割がわかる英語を用い、不要な抽象化を避ける。
- WebviewではFSD v2.1の `app`、`pages`、`shared` を起点とする。
- 再利用の理由がない限り `features`、`entities`、`widgets` を増やさない。
- `FEATURE` と `MODULE` はDSLのObject種別であり、FSDのFeatureやソースコードのモジュール構成とは別物とする。
- Biome、Steigerの検査対象と除外設定は必要最小限とし、理由なくルールを無効化しない。

## テスト方針

- Parserは正しい構文、空行、ネスト、誤記、未終了ブロックを検証する。
- Parserは先頭の`title`をIRに保持し、未指定と重複時の診断を検証する。
- ExtensionとWebviewのテストで、title未指定時にファイル名を見出しへ表示することを検証する。
- VSCodeのハイライトテストはTextMateスコープ、標準テーマでの追従、専用配色設定の切り替えを確認する。
- 専用配色が`.glf`以外のエディタやVSCode全体のテーマを変更しないことを確認する。
- Parserは `ObjectID.table` と `ObjectID.schema.table`、DBの行、セル修飾、FILEのノード修飾を検証する。
- Validatorは未宣言Object、未知のObject種別、活性の対応漏れ、分岐間の活性不一致を検証する。
- Validatorは変更前後のStateやSQLの結果との整合性を検証しない。
- Layoutはメッセージ端点、活性の継続、alt境界、Stateの幅と高さを検証する。
- Playwrightで全カラム表示、SQL枠、FILEツリー、重なり、スクロールを確認する。
- Playwrightで追加、更新の赤文字、削除の取り消し線、変更なしの通常色と記号の非表示を確認する。
- スキーマ有無の両形式が、DBテーブルの見出しと参照先にそのまま反映されることを確認する。
- `examples/login.glf` を回帰テスト用の基準DSLとし、差分表現とスキーマ指定のテスト例を追加する。
- 基準DSLは最初の実装変更で登録し、外部資料を取り込む場合は出典と仕様への対応をその変更に記録する。
- バグを修正した場合は再現テストを追加する。
- 製品コードの変更では `check` と `test:visual` を実装完了条件とする。
- 文書や開発基盤だけの変更では、OpenSpecの設定とスキーマ、成果物の形式、リンク、整合性などを検証し、製品コード向けの検証を適用しない理由を残す。

## OpenSpecのテンプレートと検証

設定、手順、テンプレートの役割分担は [config.yaml](config.yaml) の文書一覧を参照する。
以下のコマンドでスキーマ、テンプレートの解決先、変更の構造を確認できる。
OpenSpecの標準検証は構造を確認するために使い、要件IDの一意性、EARSの意味、台帳の網羅性は別に確認する。

```sh
npm exec -- openspec schema validate glitchflow
npm exec -- openspec templates --schema glitchflow --json
npm exec -- openspec validate <change-name> --strict
```

## 仕様化時に確定する事項

現在の方針文書から、以下の値や条件を推測して実装しない。
該当する機能の仕様を作る変更で具体例と判定条件を確定し、要件とシナリオへ記録する。

- 性能: 対象データ量、実行環境、描画更新の測定区間、指標、閾値、デバウンス時間
- 活性区間: ファイル末尾で開いた区間の診断と、分岐結合時の整合性の判定条件
- レイアウト: 要素ごとに許可する交差や重なりと、文字や表が欠けないことの判定方法
- 基準DSL: 最初の縦断実装で対象とする構文、具体的なログイン例、期待する描画と診断

## 技術上の参照先

- VSCode Webview API: https://code.visualstudio.com/api/extension-guides/webview
- VSCode Syntax Highlight Guide: https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
- VSCode Decoration API: https://code.visualstudio.com/api/references/vscode-api#TextEditorDecorationType
- FSD v2.1: https://fsd.how/docs/guides/migration/from-v2-0/
- Steiger: https://github.com/feature-sliced/steiger
- Biome Git Hooks: https://biomejs.dev/recipes/git-hooks/
- Lefthook: https://lefthook.dev/
- OpenSpec: https://openspec.dev/docs/quickstart
- EARS: https://alistairmavin.com/ears/
- Gherkin: https://cucumber.io/docs/gherkin/reference/
- BDDの具体例の整理: https://cucumber.io/docs/bdd/example-mapping/
