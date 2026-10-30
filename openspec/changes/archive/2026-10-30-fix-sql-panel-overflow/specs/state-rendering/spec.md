# Spec Delta

## MODIFIED Requirements

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
