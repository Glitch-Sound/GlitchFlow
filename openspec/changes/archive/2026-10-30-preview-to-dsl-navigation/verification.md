# 検証記録

## 対象

- 変更: `preview-to-dsl-navigation`。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。

## Completeness

- REQ-038からREQ-040と6件のシナリオを仕様、設計、タスク、実装、テストに対応付けた。
- 8件のタスクを完了した。

## Correctness

| 対象 | 方法 | 結果 |
| --- | --- | --- |
| REQ-038-S01、REQ-038-S02 | CoreとChromiumで同名メッセージ、複数State、FILE、SQL、Object、処理、ネスト分岐の行を検査 | 成功 |
| REQ-039-S01 | VSCode Extensionテストで既存エディタグループと行全体の選択を検査 | 成功 |
| REQ-040-S01、REQ-040-S02 | VSCode Extensionテストで編集直後の旧描画IDと不正行を拒否し、再描画後の行を検査 | 成功 |
| REQ-040-S03 | Chromiumでズームとスクロールを検査 | 成功 |
| import定義 | VSCode ExtensionとChromiumで定義元URIと行、SVG出力からの位置情報除去を検査 | 成功 |

## Coherence

- Parserの行番号をLayoutとSVGへ伝え、Webviewの既存メッセージ経路を利用した。
- Extensionが表示済み描画IDと文書版を照合し、VSCode標準APIで表示と選択を行う。
- 外部依存とDSL構文の変更はない。

## 実行結果

- `npm run check`: 成功。Core 39件が成功した。
- `npm run test:visual`: 成功。Chromium 41件が成功した。
- `npm run test:extension`: 成功。VSCode Extension 19件が成功した。
- `npx --no-install openspec validate preview-to-dsl-navigation --strict`: 成功。
- `git diff --check`: 成功。

## 未検証事項

- 人手による実際のVSCode画面のクリック操作は実施していない。
Webviewのクリックとメッセージ生成はChromiumで、受信後のエディタ動作はVSCode Extensionテストで確認した。
