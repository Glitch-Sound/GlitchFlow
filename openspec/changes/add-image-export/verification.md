# Verification

## 対象

REQ-032-S01、REQ-032-S02、REQ-033-S01、REQ-033-S02、REQ-034-S01を検証した。

## 実行結果

| 方法 | 結果 | 内容 |
| --- | --- | --- |
| `npm run check` | 成功 | Biome、FSD、型検査、Core 34件 |
| `npm run test:visual` | 成功 | Chromium 36件。うち画像出力5件 |
| `npm run test:extension` | 成功 | VSCode Extension Host 13件。うち画像出力2件 |
| `npx --no-install openspec validate add-image-export --strict` | 成功 | 変更仕様を検証 |
| `git diff --check` | 成功 | 差分の空白を検査 |

## 出力の確認

- [Chromiumテスト](../../../tests/visual/export.spec.ts)で、SVGをXMLとして、PNGを画像として読み戻した。
- SVGにDBテーブル、FILEツリー、SQL、分岐、矢印、日本語のテキスト要素が含まれることを確認した。
- PNGは2028×1496ピクセルの実ファイルとして出力し、開いて欠落と文字化けがないことを目視確認した。
- ズームとスクロール後も全体寸法が変わらず、65件のメッセージを持つ長い図の末尾まで出力できることを確認した。
- プレビューとPNGの画素差、ボタンからの操作、描画不能時のエラー応答を確認した。
- [Extensionテスト](../../../tests/extension/export.test.ts)でPNGとSVGの保存、初期ファイル名、保存失敗時の通知、DSL本文の保持を確認した。

## 制約

PNGの倍率は最大2倍とし、長辺16384ピクセルと6400万画素を上限として大きな図では倍率を下げる。
SVGのフォントは表示環境にあるフォントを参照するため、別環境では代替フォントとなる場合がある。
