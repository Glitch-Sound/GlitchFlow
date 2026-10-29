# GlitchFlow

GlitchFlowは、処理の流れ(Flow)とデータの状態(State)を同じ時間軸で可視化するVS Code拡張機能である。\
設計、実装、テストで期待する動作を共有し、認識のずれや設計の考慮漏れを見つけやすくする。

![ログイン処理の流れと、DBやファイルの期待状態を並べた表示イメージ](docs/images/glitchflow.png)

## 主な機能(開発予定)

- `.glf` ファイルに処理やメッセージ、条件分岐を記述し、編集内容を図に反映する。
- 処理の途中にDBレコード、ファイルツリー、SQLを並べ、各時点の期待状態を確認する。
- データの追加、更新、削除を明示し、色や取り消し線で見分ける。
- 構文エラーや参照先の誤りをVS Code上で確認する。

設計レビューでの確認や、実装時の期待動作の共有、結合テストの期待結果の整理に利用することを想定する。\
SQLや業務ファイルを実際に操作する機能は持たず、設計上の期待状態を表示する。

## 現在使える機能

`.glf` ファイルを開き、コマンドパレットから `GlitchFlow: プレビューを開く` を実行すると、`GlitchFlow Preview` という見出しの初期画面を表示する。上の画像は完成時の参考図であり、現在のプレビューには図面を表示しない。

DSL の解析、図面描画、編集に合わせた更新、構文ハイライト、診断、ズームは今後の変更で実装する。基準入力は [examples/login.glf](examples/login.glf) に置いてある。

## 開発環境

Node.js 24 と npm を使用する。リポジトリのルートで次を実行する。

```sh
npm install
npx --no-install lefthook install
npm run build
```

VS Code でリポジトリを開き、ビルド後に F5 を押す。`.vscode/launch.json` の構成が Extension Development Host を起動し、`examples/login.glf` を開く。開発ホストのコマンドパレットから `GlitchFlow: プレビューを開く` を実行する。

## 検査

```sh
npm run check
npx --no-install playwright install chromium
npm run test:visual
npm run test:extension
```

`npm run check` は Biome、Webview の FSD 規則、型検査、Core 単体テストを実行する。`test:visual` は Chromium で初期画面を確認し、`test:extension` は VS Code の Extension Test API でコマンドとパネルの生成を確認する。コミット前は Lefthook がステージ済みファイルの Biome、Webview 全体の Steiger、型検査を実行する。
