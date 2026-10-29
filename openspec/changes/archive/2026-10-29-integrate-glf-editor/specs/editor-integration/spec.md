# Spec Delta

## Purpose

設計者がVSCodeで`.glf`を編集しながら図面と診断を確認し、配色と表示倍率を調整して大きなフローを読み進めるための機能である。

## ADDED Requirements

### Requirement: REQ-014 - 編集連動プレビュー

WHEN プレビュー対象の`.glf`文書が変更されたとき、GlitchFlowは SHALL 最新の正常な解析結果で開いているプレビューを更新し、解析エラーがある間は最後の正常な図を保持する。

#### Scenario: REQ-014-S01 - 編集結果を表示する

- **GIVEN** `title: "ログインフロー"`を持つ`login.glf`のプレビューが開いている。
- **WHEN** 利用者がタイトルを`変更後`へ編集する。
- **THEN** パネルを開き直さずに見出しが`変更後`へ変わる。

#### Scenario: REQ-014-S02 - 編集中の図を保持する

- **GIVEN** 正常な`login.glf`の図を表示している。
- **WHEN** 利用者が未宣言Objectへのメッセージを入力する。
- **THEN** 図は最後の正常な状態のままである。
- **AND** 誤りを修正すると新しい図が表示される。

### Requirement: REQ-015 - Problems診断

WHEN `.glf`文書が開かれるか編集されたとき、GlitchFlowは SHALL ParserとValidatorの診断を該当行のVSCode Problemsに表示し、修正または文書の閉鎖時に古い診断を除去する。

#### Scenario: REQ-015-S01 - 診断を表示して解消する

- **GIVEN** `Object FE as "FE" type APP`を含む`.glf`文書が開いている。
- **WHEN** 利用者が`FE ->> UNKNOWN: call`を入力する。
- **THEN** Problemsに未宣言Objectの診断が入力行に表示される。
- **AND** 行を削除すると診断が消える。

### Requirement: REQ-016 - DSL構文配色

WHILE `.glf`を編集するとき、GlitchFlowは SHALL `title`、宣言、状態、SQL、分岐、メッセージと活性・差分記号、文字列をテーマに従うTextMate Grammarで分類し、設定が`glitchflow`の場合だけ`.glf`エディタへダーク・ライト対応の専用配色を適用する。

#### Scenario: REQ-016-S01 - 配色を切り替える

- **GIVEN** `.glf`とTypeScriptを開き、`glitchflow.syntaxHighlighting`が既定の`theme`である。
- **WHEN** 設定を`glitchflow`に切り替える。
- **THEN** `.glf`の構文だけが専用配色になる。
- **AND** TypeScriptとVSCode全体のテーマ設定は変わらない。
- **AND** `theme`へ戻すと`.glf`の専用装飾が消える。

#### Scenario: REQ-016-S02 - ライトテーマで読める

- **GIVEN** ライトテーマで`.glf`を開き、専用配色を選択している。
- **WHEN** VSCodeテーマを切り替える。
- **THEN** DSLの文字列とキーワードが背景と異なる濃い色で表示される。

### Requirement: REQ-017 - プレビュー操作

WHEN 利用者がプレビューの拡大、縮小、等倍操作を行ったとき、GlitchFlowは SHALL 図全体の倍率を変更し、表示領域を超える部分を縦横にスクロールできるようにする。

#### Scenario: REQ-017-S01 - 図の全体を確認する

- **GIVEN** 表示領域より大きい図のプレビューが開いている。
- **WHEN** 利用者が拡大して右下へスクロールする。
- **THEN** 右端と下端の文字まで表示できる。
- **AND** 等倍操作で元の倍率に戻る。

### Requirement: NREQ-001 - 編集応答時間

WHILE `examples/login.glf`をプレビューしているとき、GlitchFlowは SHALL 編集イベント後150 msの待機を経て更新を開始し、通常の1文字編集から新しい図の表示までを1秒以内にする。

#### Scenario: NREQ-001-S01 - 編集応答時間を測る

- **GIVEN** ローカルのVSCode Extension Development Hostで`examples/login.glf`のプレビューを開き、描画が完了している。
- **WHEN** タイトルの1文字を編集する。
- **THEN** 最後の編集から150 msの待機を経て更新が開始する。
- **AND** 編集から見出しの変更までが1秒以内である。
