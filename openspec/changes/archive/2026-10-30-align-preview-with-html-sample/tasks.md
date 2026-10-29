# Tasks

## 1. 図面、Object、活性の視覚表現

設計: [D-01](design.md#d-01---暗色の図面パレットと種別の識別)。

- [x] 1.1 [REQ-022/REQ-022-S01、REQ-022-S02] `tests/visual/preview-appearance.spec.ts`に基準DSLとFEATURE、MODULEの色、二段表示、ライトテーマ相当のテストを作り、対象Playwright実行で未実装による失敗を確認する。
- [x] 1.2 [REQ-022/REQ-022-S01、REQ-022-S02] Coreのライフラインへ種別を渡し、Webviewの暗色パレット、操作部、Object枠、活性、横罫を描画し、対象テストの成功を確認する。
- [x] 1.3 [REQ-022/REQ-022-S01、REQ-022-S02] 台帳に実装箇所と受け入れテストを記録し、`examples/login.glf`と仕様の表示内容が一致することを確認する。

## 2. メッセージと処理のラベル

設計: [D-02](design.md#d-02---メッセージと処理のラベルを計測して描く)。

- [x] 2.1 [REQ-023/REQ-023-S01] 背景付きメッセージ、通常処理、強調処理と境界のテストを追加し、対象Playwright実行で失敗を確認する。
- [x] 2.2 [REQ-023/REQ-023-S01] Coreの余白計測とWebviewのSVGラベルを更新し、文字選択、矢印種別、非遮蔽を対象テストで確認する。
- [x] 2.3 [REQ-023/REQ-023-S01] 台帳へ実装とテストの対応を記録し、既存のREQ-007、REQ-008の描画テストも成功することを確認する。

## 3. DB、FILE、SQLのカード

設計: [D-03](design.md#d-03---stateとsqlを見出し付きカードにする)。

- [x] 3.1 [REQ-024/REQ-024-S01、REQ-024-S02] 基準DSLと独立State、長文を使うカード、接続線、SQLのテストを追加し、対象Playwright実行で失敗を確認する。
- [x] 3.2 [REQ-024/REQ-024-S01、REQ-024-S02] Coreのパネル寸法と連続SQLの位置、Webviewの見出しとカードを実装し、列、ツリー、変更属性、スクロールを対象テストで確認する。
- [x] 3.3 [REQ-024/REQ-024-S01、REQ-024-S02] 台帳へ実装とテストの対応を記録し、既存のREQ-009からREQ-011のテストも成功することを確認する。

## 4. フラグメントと動的配置

設計: [D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 4.1 [REQ-025/REQ-025-S01、REQ-025-S02] 基準DSL、長いメッセージ、複数行State、入れ子のラベルと衝突を検査するテストを作り、対象Playwright実行で失敗を確認する。
- [x] 4.2 [REQ-025/REQ-025-S01、REQ-025-S02] CoreのObject間隔とフラグメント余白、Webviewの背景付きラベルを更新し、対象テストと既存の配置回帰テストの成功を確認する。
- [x] 4.3 [REQ-025/REQ-025-S01、REQ-025-S02] 台帳へ実装とテストの対応を記録し、基準DSLの新しいChromium画像とHTML試作を目視比較する。

## 5. 全体の整合性と検証

設計: [D-01](design.md#d-01---暗色の図面パレットと種別の識別)、[D-02](design.md#d-02---メッセージと処理のラベルを計測して描く)、[D-03](design.md#d-03---stateとsqlを見出し付きカードにする)、[D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 5.1 [REQ-022からREQ-025] `npm run check`、`npm run test:visual`、`npm run test:extension`を実行し、全シナリオと既存要件の回帰を確認して台帳に結果を記録する。
- [x] 5.2 [REQ-022からREQ-025] VS Code開発ホストのダーク・ライト両テーマとChromiumの比較画像で表示を確認し、未検証事項を台帳に記録する。
- [x] 5.3 [REQ-022からREQ-025] `npx --no-install openspec validate align-preview-with-html-sample --strict`とOpenSpec verify相当の照合を実施し、提案、仕様、設計、タスク、実装、テスト、台帳の対応を確認する。

## 6. 基準画像に合わせた細部調整

設計: [D-02](design.md#d-02---メッセージと処理のラベルを計測して描く)、[D-03](design.md#d-03---stateとsqlを見出し付きカードにする)、[D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 6.1 [REQ-023-S01、REQ-024-S01、REQ-025-S01] 処理ラベルの左・下の余白、応答線と活性下端、DB値の寄せと引用符、case位置と活性の継ぎ目を検査するChromiumテストを追加し、現行実装で失敗を確認する。
- [x] 6.2 [REQ-023-S01、REQ-024-S01、REQ-025-S01] Coreの座標とDB表示用データ、Webviewのテキスト位置を修正し、追加テストと既存の関連テストを成功させる。
- [x] 6.3 [REQ-023-S01、REQ-024-S01、REQ-025-S01] 基準DSLの新しい画像を`docs/images/`に保存して参照画像と比較し、`npm run check`、`npm run test:visual`、OpenSpec strict検証を実行して台帳へ結果を記録する。

## 7. ID非表示、分岐ラベル、DB列幅の調整

設計: [D-01](design.md#d-01---暗色の図面パレットと種別の識別)、[D-03](design.md#d-03---stateとsqlを見出し付きカードにする)、[D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 7.1 [REQ-022-S01、REQ-022-S02、REQ-024-S01、REQ-025-S01] Object IDとState見出し、case位置、DB列幅のChromium受け入れテストを追加し、現行実装で失敗を確認する。
- [x] 7.2 [REQ-022-S01、REQ-022-S02、REQ-024-S01、REQ-024-S02、REQ-025-S01] Coreの表示データと列幅、WebviewのObject・State・分岐ラベルを修正し、新規と関連する既存テストを通す。
- [x] 7.3 [REQ-022からREQ-025] 新しい基準DSL画像を保存して目視比較し、`npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証を実行して台帳に結果を記録する。

## 8. case文字とメッセージ上部の余白

設計: [D-01](design.md#d-01---暗色の図面パレットと種別の識別)、[D-02](design.md#d-02---メッセージと処理のラベルを計測して描く)、[D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 8.1 [REQ-022-S01、REQ-023-S01、REQ-025-S01、REQ-025-S02] Object下と連続メッセージ・分岐直後の余白、枠のない赤いcase文字のChromiumテストを追加し、現行実装で失敗を確認する。
- [x] 8.2 [REQ-022-S01、REQ-023-S01、REQ-025-S01、REQ-025-S02] Coreの縦位置とWebviewのcase描画を修正し、追加テストと関連する既存テストを通す。
- [x] 8.3 [REQ-022、REQ-023、REQ-025] 基準DSL画像を更新して目視確認し、`npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証を実行して台帳に記録する。

## 9. else文字の装飾

設計: [D-04](design.md#d-04---フラグメントの前面ラベルと動的な間隔)。

- [x] 9.1 [REQ-025-S01、REQ-025-S02] elseの枠と背景の非表示、赤い文字色、分岐線との間隔をChromiumで検査し、旧実装で失敗を確認する。
- [x] 9.2 [REQ-025-S01、REQ-025-S02] Webviewのelse描画をcaseと揃え、既存の分岐テストも新しい表現で通す。
- [x] 9.3 [REQ-025-S01、REQ-025-S02] 基準DSL画像を更新して目視確認し、全体テストとOpenSpec strict検証を実行して台帳に結果を記録する。

## 10. 拡大縮小ボタンのラベル

設計: [D-01](design.md#d-01---暗色の図面パレットと種別の識別)。

- [x] 10.1 [REQ-022-S01] 3つのボタンの表示文字、読み上げ用の名前、操作をChromiumで検査し、旧実装で失敗を確認する。
- [x] 10.2 [REQ-022-S01] Webviewのボタン表示文字を`-`、`Reset`、`+`に変更し、追加テストと既存の拡大縮小テストを通す。
- [x] 10.3 [REQ-022-S01] 基準DSL画像を更新して目視確認し、全体テストとOpenSpec strict検証を実行して台帳に結果を記録する。

## Workflow follow-up

- 検証完了後にOpenSpecのarchive運用に従って正式仕様へ同期し、変更成果物の移動後に台帳のリンクを更新する。
