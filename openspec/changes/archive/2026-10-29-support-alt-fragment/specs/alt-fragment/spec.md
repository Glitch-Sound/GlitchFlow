# alt-fragment Specification

## Purpose

この機能は、設計者とレビュアーが排他的な成功経路と失敗経路を一つの時間軸上で読み、各経路に記述されたイベントと活性終了を区別して確認するためのものである。

## ADDED Requirements

### Requirement: REQ-012 - alt分岐の描画

WHEN `alt`を含む文書を描画するとき、GlitchFlowは SHALL 各`case`と`else`のイベントを排他的な縦方向の区画に記述順で配置し、`#DD6872`の枠、ラベル、分岐線を前面に表示し、内側の要素を隠さない。

#### Scenario: REQ-012-S01 - ログインの成功と失敗を描画する

- **GIVEN** `examples/login.glf`にFILE状態とホーム画面表示を含む`case`、エラーメッセージ表示を含む`else`がある。
- **WHEN** プレビューを描画する。
- **THEN** 成功と失敗のメッセージ、処理、FILE状態がそれぞれの区画に1回ずつ表示される。
- **AND** `alt`の枠、`case ユーザヒット`、`else`、分岐線が`#DD6872`で表示され、要素と重ならない。

#### Scenario: REQ-012-S02 - 入れ子の分岐を描画する

- **GIVEN** 外側の`case`内に別の`alt`があり、内側の各分岐に処理がある。
- **WHEN** プレビューを描画する。
- **THEN** 内側の枠は外側の区画内に収まり、各処理は対応する区画内に1回ずつ表示される。

### Requirement: REQ-013 - 分岐の活性整合性

WHEN `alt`を解析して描画するとき、GlitchFlowは SHALL 分岐前の活性を各経路へ引き継ぎ、経路ごとの明示的な`Object-`で終了させ、分岐出口で活性Objectの集合が一致しない場合は診断する。

#### Scenario: REQ-013-S01 - 分岐ごとに活性を終了する

- **GIVEN** `examples/login.glf`で`FE`と`BE`が分岐前に活性化し、両経路の処理の後にそれぞれ`FE-`と`BE-`がある。
- **WHEN** 解析してプレビューを描画する。
- **THEN** 各経路のFE活性はその経路の表示処理後にある`FE-`で終了し、分岐間に不自然な活性の空白がない。
- **AND** 分岐出口の活性不一致診断はない。

#### Scenario: REQ-013-S02 - 活性状態の不一致を診断する

- **GIVEN** 分岐前に`FE+`があり、`case`だけに`FE-`があり、`else`には`FE-`がない。
- **WHEN** 文書を解析する。
- **THEN** `activation-branch-mismatch`診断が`alt`の行に付く。
- **AND** `else`の活性を暗黙には終了しない。
