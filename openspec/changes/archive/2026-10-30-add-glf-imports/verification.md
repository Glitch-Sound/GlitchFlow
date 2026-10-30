# Verification

## 対象

REQ-035-S01からS04、REQ-036-S01からS03、REQ-037-S01とS02を検証した。

## 実行結果

| 方法 | 結果 | 内容 |
| --- | --- | --- |
| `npm run check` | 成功 | Biome、FSD、型検査、Core 37件 |
| `npm run test:visual` | 成功 | Chromium 36件。既存描画の回帰を確認 |
| `npm run test:extension` | 成功 | VSCode Extension Host 17件。うちimport関連4件 |
| `npx --no-install openspec validate add-glf-imports --strict` | 成功 | 変更仕様を検証 |
| `git diff --check` | 成功 | 差分の空白を検査 |

## シナリオ照合

- REQ-035-S01、S03: [Coreテスト](../../../../tests/core/imports.test.ts)でimport定義の参照検証、DBのレイアウト、定義元、titleとイベントの非取込を確認した。
- REQ-035-S02: [Extensionテスト](../../../../tests/extension/imports.test.ts)で複数、多段、同一ファイルの再訪問を確認した。
- REQ-035-S04: importなしのCoreテストと既存のCore、Extension、Chromiumテストが成功した。
- REQ-036-S01からS03: CoreとExtensionテストでObject・schemaの衝突、循環、欠損、不正パス、import先の構文エラーを確認した。
- REQ-037-S01、S02: Extensionテストで未保存編集、ディスク更新、診断とプレビューの再更新、Object IDと2形式のschema補完を確認した。

## OpenSpec verify

- Completeness: 9/9タスク、3/3要件、9/9シナリオを実装とテストに対応付けた。
- Correctness: Parser、定義合成、依存解決、診断、補完、プレビューのコード経路を仕様と照合し、未解決の重大事項・警告事項はない。
- Coherence: D-01のCore定義合成、D-02のExtension依存グラフ、D-03の共有解析結果と文書版ガードを確認した。ファイル配置と命名は既存の構成に従う。

## 制約

初期実装はローカルの `.glf` ファイルのみを扱う。import先の表示イベントとtitleは取り込まない。親ディレクトリも存在しないパスは読み込みエラーとして診断し、再解析時に監視を再試行する。
