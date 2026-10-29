# other-fragments Specification

## Purpose

設計者とレビュアーが条件付き処理、反復、並列区画、中断を同じ時間軸の図で区別し、明示的な活性操作と入力の誤りを確認できるようにする。

## ADDED Requirements

### Requirement: REQ-018 - optとloop

WHEN `opt 条件:`または`loop 条件:`と4空白下げた本体を描画するとき、GlitchFlowは SHALL 条件を含むラベルと`#DD6872`の枠を表示し、本体のイベントを記述順に1回描画する。

#### Scenario: REQ-018-S01 - 単一区画を描画する

- **GIVEN** `opt 許可:`と`loop 再試行:`にそれぞれ処理が1つある。
- **WHEN** プレビューを描画する。
- **THEN** `opt 許可`と`loop 再試行`の枠があり、各処理が対応する枠内に1回ずつ表示される。

### Requirement: REQ-019 - par区画

WHEN `par:`に2本以上の`case 名前:`を記述して描画するとき、GlitchFlowは SHALL 各区画のイベントを記述順に1回配置し、区画名と分岐線を`#DD6872`で表示する。

#### Scenario: REQ-019-S01 - 並列区画を描画する

- **GIVEN** `par:`の`case A:`と`case B:`に別々の処理がある。
- **WHEN** プレビューを描画する。
- **THEN** `par`の枠に2区画と分岐線があり、各処理が対応する区画に1回表示される。

### Requirement: REQ-020 - break表示

WHEN `break 条件:`と4空白下げた本体を描画するとき、GlitchFlowは SHALL 中断条件を枠のラベルに表示し、本体と後続イベントを記述順に1回ずつ描画する。

#### Scenario: REQ-020-S01 - 中断枠と後続を描画する

- **GIVEN** `break エラー:`にエラー処理があり、その後に通常処理がある。
- **WHEN** プレビューを描画する。
- **THEN** `break エラー`の枠内にエラー処理があり、枠の後に通常処理が表示される。

### Requirement: REQ-021 - フラグメントの診断

IF 複合フラグメントの本体、区画構造、または出口の活性が不正な場合、GlitchFlowは SHALL 該当行に診断を付け、インデントやフラグメント境界で活性を暗黙に終了しない。

#### Scenario: REQ-021-S01 - 不正な構造と活性を診断する

- **GIVEN** 空の`opt`、1区画だけの`par`、開始済み活性を本体で終了する`loop`がある。
- **WHEN** 文書を解析する。
- **THEN** 空本体と区画数に構造診断が付き、`loop`行に活性出口不一致の診断が付く。

#### Scenario: REQ-021-S02 - 並列経路の活性不一致を診断する

- **GIVEN** `par`前に`FE+`があり、一方の`case`だけに`FE-`がある。
- **WHEN** 文書を解析する。
- **THEN** `par`行に活性出口不一致の診断が付き、もう一方の区画の活性は暗黙に終了しない。
