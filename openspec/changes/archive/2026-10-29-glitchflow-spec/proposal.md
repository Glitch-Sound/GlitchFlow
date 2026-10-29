# Proposal

## Why

GlitchFlowは現在、方針文書と画面サンプルだけがあり、VSCode拡張機能やプレビューを起動できない。
後続のDSL解析と描画を小さな変更で実装、検証するため、最初に実行可能な拡張機能と開発時の検査基盤を用意する。

## What Changes

- VSCodeのコマンドからGlitchFlowのWebviewプレビューを開き、見出しと初期表示を確認できるようにする。
- Core、Extension、Webviewの最小の実行経路と、ビルド、静的解析、型検査、テスト、コミット前検査を整える。検査コマンドは将来どのCIでも再利用できる形にする。
- `examples/login.glf` に[入力資料](input.md#基準dsl)の基準DSLを登録する。
- 既存の製品動作はないため、互換性を壊す変更はない。

## Scope

**In scope:**

- TypeScript(strict)のCore公開API、VSCode拡張、Vite製Webviewの起動を確認できる最小構成。
- プレビュー起動コマンドと、[画面サンプル](glitchflow-sample.html)のプレビュー見出しを参考にした初期画面。
- Biome、Steiger、Lefthook、Vitest、Playwrightの実行入口と検証。
- 後続変更の回帰入力となる基準DSLの配置。

**Out of scope:**

- DSLの解析、診断、編集連動、Stateやシーケンス図の描画は[入力資料の段階計画](input.md#段階的な変更計画)の後続変更で扱う。
- `.glf` の言語登録、構文ハイライト、専用配色、ズームはエディタ連携の変更で扱う。
- `alt` 以外も含む複合フラグメントは各段階で仕様化する。
- CIサービスの選定・設定は今回の対象外とする。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-001 | プレビューの起動 | 追加 | [対象機能](../../../product.md#対象機能) | [要件一覧](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `preview`: VSCodeコマンドから初期プレビューを開く振る舞いを扱う(REQ-001)。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-001 | 正常 | `login.glf`を開いたVSCode | プレビュー起動コマンドを実行 | [REQ-001-S01](specs/preview/spec.md#scenario-req-001-s01---glfファイルを開いてプレビューを起動する) |

ファイル未オープン時の起動は、今回の受け入れ対象に含めない。
異常としてWebview資産の読み込み失敗があるが、これは表示要件ではなくビルドと統合テストの検証対象とする。

## Impact

- 実装と配置: [構造方針](../../../structure.md#推奨ディレクトリ構成)の`src/core`、`src/extension`、`src/webview`、`examples`、`tests`を段階的に作る。
- 互換性とデータ: 既存の`.glf`利用者と永続データはまだない。
ファイルの解析とデータ操作はこの変更に含めない。
- 依存関係と文書: [技術スタック](../../../tech.md#技術スタック)のパッケージ、`package-lock.json`、開発設定、README、[台帳](../../../traceability.md)を更新する。
入力資料の初回指示には既存ファイルを変更しないとあるが、今回の成果物作成では[config.yaml](../../../config.yaml)が要件IDの台帳予約を要求するため、台帳を更新した。
製品コードはこの計画段階で変更しない。

## Open Questions

- 名称と範囲: [入力資料](input.md#codexへの初回指示)は変更名`bootstrap-glitchflow`を指定するが、2026-10-29のユーザー回答により既存の`glitchflow-spec`で第1段階を計画することが確定した。
- 初期画面: コマンド名と見出しを[変更仕様](specs/preview/spec.md)で具体化した。
2026-10-29のユーザー指示により、ファイル未オープン時の受け入れシナリオを除外した。
残る受け入れ条件は、同日の`openspec-apply-change`実行指示で適用が承認された。
- 検証環境: 2026-10-29のユーザー指示によりGitHub Actionsへの依存を避け、この変更ではCIサービスを設定しない。CIを導入する際は実行先を選び、`npm run check`、`npm run test:visual`、必要なら`npm run test:extension`の実行可否を確認する。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザー指示で`glitchflow-spec`、`input.md`、画面サンプルの参照が指定された。
変更名の維持と第1段階への限定は同日の回答で確認した。
同日の追加指示で、ファイル未オープン時の起動シナリオを除外した。
同日の`openspec-apply-change`実行指示を、修正後の計画への合意とする。
- 実装を妨げる未決事項: なし。
