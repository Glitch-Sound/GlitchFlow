# Spec Delta

## Purpose

設計者が`.glf`で記述した処理順序と表示用の状態を、後続の描画と診断が共通して利用できる構造へ変換する機能である。
入力にない操作やスキーマを補わず、元の位置と記述順を保持する。

## ADDED Requirements

### Requirement: REQ-002 - 文書メタデータと基本イベント

WHEN `.glf`テキストを解析したとき、GlitchFlowは SHALL 最初の非空行にある非空の`title`、宣言順の6種のObject、メッセージ、処理、明示的な活性開始と終了を、行番号と記述順を持つIRに変換する。
`Global`は宣言不要のメッセージ起点として扱う。
`->>`は同期、`->`は非同期、`-->`と`<--`は応答として扱い、逆向き表記では送信元と受信先を反転する。

#### Scenario: REQ-002-S01 - 基本イベントを入力順に保持する

- **GIVEN** `examples/login.glf`のtitle、4つのObject、メッセージ、処理、活性操作がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** titleは`ログインフロー`、ObjectはFE、BE、DB、FILEの順で、GlobalからFEの同期要求とFEの活性操作は元の行順でIRにある。
- **AND** FILEへの同期要求には応答メッセージがなくても、その後の`FILE-`が活性終了としてIRにある。

#### Scenario: REQ-002-S02 - タイトルの誤用を診断する

- **GIVEN** 最初の非空行ではない`title`、重複した`title`、空文字の`title`をそれぞれ含む入力がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** 各入力にタイトルの位置、重複、空文字を示す診断と行番号が返る。

### Requirement: REQ-003 - DB参照と表示用状態

WHEN `schema`とDBの`state`を解析したとき、GlitchFlowは SHALL `ObjectID.table`と`ObjectID.schema.table`の記述された識別子とカラム順を保持し、DB行の`+`、`-`、無印を`added`、`removed`、`unchanged`、セルの`!`と無印を`updated`、`unchanged`としてIRに保持する。
スキーマ名や変更属性を推論しない。

#### Scenario: REQ-003-S01 - DB参照と変更属性を保持する

- **GIVEN** `DB.users`のschemaと無印行、`DB.public.users`のschemaと`-`、無印、`!`、`+`を含むstateがある。
- **WHEN** `parseGlf`で解析する。
- **THEN** 両形式の参照は入力どおり別々に保持され、各行とセルの変更属性は記号を除いた値とともにIRにある。
- **AND** 省略された`public`や前後のstateからの操作推論はない。

### Requirement: REQ-004 - FILE状態とSQL

WHEN `state FILE:`または`sql DB:`を解析したとき、GlitchFlowは SHALL インデントで表したFILEの親子関係と各ノードの`added`、`removed`、`unchanged`、SQL本文の改行と記述位置をIRに保持する。
親の変更属性を子へ伝播させず、SQLを実行しない。

#### Scenario: REQ-004-S01 - FILE階層とSQLを保持する

- **GIVEN** `users/`の子に`1/`と`+ user.info`があるFILE state、および複数行の`sql DB:`がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** FILEは3階層で、`user.info`だけが`added`、親は`unchanged`であり、SQLは改行を保った文字列でIRにある。

### Requirement: REQ-005 - 分岐構造と解析診断

WHEN `alt:`を含む`.glf`を解析したとき、GlitchFlowは SHALL `case`と`else`の範囲とその中のイベントをインデントに従うIRに保持する。
IF 未宣言Object、不正なインデント、未終了の活性、未対応の構文がある場合、THEN GlitchFlowは SHALL 原因と行番号を持つ診断を返す。
活性はインデントで自動終了しない。

#### Scenario: REQ-005-S01 - 分岐内イベントを保持する

- **GIVEN** `examples/login.glf`の`alt`に`case ユーザヒット:`と`else:`があり、両方に`FE-`がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** 2つの分岐と各イベントがIRにあり、`FE-`は各分岐の明示的なイベントとして残る。

#### Scenario: REQ-005-S02 - 誤った構文と参照を診断する

- **GIVEN** 未宣言Object宛てのメッセージ、不正な子インデント、末尾まで閉じない活性、または未対応の`opt:`がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** 該当する行番号と原因を示す診断が返る。

#### Scenario: REQ-005-S03 - 入れ子分岐を保持する

- **GIVEN** `alt`の`case`内に別の`alt`がある。
- **WHEN** `parseGlf`で解析する。
- **THEN** 内側の分岐は外側のcaseの子として保持され、インデントの診断はない。
