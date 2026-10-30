# state-rendering Specification

## Purpose

この機能は、設計者とレビュアーが処理の各時点で指定したDBとFILEの期待状態、および表示用SQLをシーケンス図と同じ時間軸で省略なく確認するためのものである。

## Requirements

### Requirement: REQ-009 - DB状態の描画

WHEN DBの`state`を描画する時、GlitchFlowは SHALL 同じ参照形式の`schema`にある全カラムと全セルを1行内で横並びに表示し、行とセルの明示された変更属性を装飾する。

#### Scenario: REQ-009-S01 - 全カラムを表示する

- **GIVEN** `schema DB.users`に5カラムがあり、`state DB.users`に5値の行がある。
- **WHEN** プレビューを描画する。
- **THEN** DBライフラインの右に5つの見出しと5つの値が横一列で表示され、省略と折り返しがない。

#### Scenario: REQ-009-S02 - 変更属性を表示する

- **GIVEN** `DB.public.users`に削除行、無印行、`!`付きの更新セル、追加行がある。
- **WHEN** プレビューを描画する。
- **THEN** 削除行は赤文字と取り消し線、追加行と更新セルだけは赤文字、無印行は通常色で表示される。
- **AND** `+`、`-`、`!`の記号は表示されず、`DB.users`のスキーマは代用されない。

### Requirement: REQ-010 - FILE状態の描画

WHEN FILEの`state`を描画する時、GlitchFlowは SHALL 各ノードの深さと明示された変更属性を保持してツリーを表示する。

#### Scenario: REQ-010-S01 - 階層と個別の変更属性を表示する

- **GIVEN** 無印の`users/`の下に`- old.info`、無印の`user.info`、`+ new.info`がある。
- **WHEN** プレビューを描画する。
- **THEN** FILEライフラインの右に子を一段下げて表示し、削除だけに赤文字と取り消し線、追加だけに赤文字を適用する。
- **AND** 親の変更属性を子へ伝播させず、変更記号は表示しない。

### Requirement: REQ-011 - SQLの描画と状態配置

WHEN `state`または`sql`を描画する時、GlitchFlowは SHALL 記述順の位置に表示し、同じDBのState直後のSQLを表の下のグレー系の矩形に表示し、SQL本文の各行が矩形の内側に収まる寸法とスクロール範囲を確保する。

#### Scenario: REQ-011-S01 - SQLをStateの下に表示する

- **GIVEN** `state DB.users`の直後に`sql DB`があり、複数行のSQLがある。
- **WHEN** プレビューを描画する。
- **THEN** SQL全文がDB表の下のグレー系矩形に表示され、周辺のメッセージや次のイベントと重ならない。

#### Scenario: REQ-011-S02 - 指定位置だけに表示する

- **GIVEN** 2つの処理の間に1つのStateがあり、後続に別のSQLがある。
- **WHEN** プレビューを描画する。
- **THEN** StateとSQLは各記述位置に1回ずつ表示され、別の時点へ複製されない。
- **AND** 表示のためにSQLを実行せず、前後のStateから変更属性を推論しない。

#### Scenario: REQ-011-S03 - SQL本文を枠内に収める

- **GIVEN** 同じDBのState直後に、等幅フォントで一般文字列用フォントより幅が広くなるSQL行がある。
- **WHEN** プレビューを等倍で描画する。
- **THEN** SQL行の表示上の右端は灰色の矩形の右端から12px以上内側にあり、全文を選択できる。
- **AND** DB表とSQL矩形は同じ幅で接し、図面のスクロール範囲内に収まる。
