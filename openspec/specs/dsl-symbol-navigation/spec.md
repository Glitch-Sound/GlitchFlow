# dsl-symbol-navigation Specification

## Purpose

設計者がDSL内のObjectとDB schemaの定義、利用箇所、明示された型情報を複数ファイルにわたって確認できるようにし、プレビューからもカラムの型を閲覧できるようにする。

## Requirements

### Requirement: REQ-041 - 定義への移動

WHEN 利用者が`.glf`内のObject IDまたはDBテーブル参照で定義への移動を実行した場合、GlitchFlowは SHALL 同じ文書またはimportで解決された文書の対応する`Object`または`schema`宣言位置をVSCode標準APIに返す。
IF 定義が一意に解決できない場合、GlitchFlowは SHALL 移動先を返さない。

#### Scenario: REQ-041-S01 - 複数ファイルの定義へ移動

- **GIVEN** `main.glf`が`shared.glf`をimportし、後者に`Object DB`と`schema DB.public.users`がある。
- **WHEN** `main.glf`の`state DB.public.users:`のテーブル参照で定義への移動を実行する。
- **THEN** `shared.glf`の該当`schema`宣言位置へ移動できる。
- **AND** `DB`部分で実行した場合は同ファイルの`Object DB`へ移動できる。

#### Scenario: REQ-041-S02 - スキーマ名を省いた参照

- **GIVEN** `schema DB.users:`と`state DB.users:`がある。
- **WHEN** `state`の`users`部分で定義への移動を実行する。
- **THEN** `schema DB.users:`に移動できる。

#### Scenario: REQ-041-S03 - 未解決参照

- **GIVEN** 対応するschemaが存在しない`state DB.missing:`がある。
- **WHEN** `missing`上で定義への移動を実行する。
- **THEN** 移動先は返されない。

### Requirement: REQ-042 - 参照箇所の検索

WHEN 利用者が解決済みのObject IDまたはschema参照で参照検索を実行した場合、GlitchFlowは SHALL 同じ定義に解決される`.glf`の参照位置をVSCode標準の一覧に返す。
宣言を含める設定が指定された場合だけ宣言位置も返す。

#### Scenario: REQ-042-S01 - 解決先ごとの参照一覧

- **GIVEN** `DB.users`と`DB.public.users`のschema、複数の`state`とObject参照がある。
- **WHEN** `DB.users`で参照検索を実行する。
- **THEN** `DB.users`に解決される箇所だけが一覧に含まれる。
- **AND** `DB.public.users`の箇所は含まれない。

#### Scenario: REQ-042-S02 - import元の更新

- **GIVEN** import先の`schema DB.users`に参照元がある。
- **WHEN** import先の定義を`schema DB.accounts`へ変更して参照検索する。
- **THEN** 古いschemaへの参照は解決済み一覧に含まれない。

### Requirement: REQ-043 - DSLの型情報Hover

WHEN 利用者が解決済みのObject IDまたはDBテーブル参照にHoverした場合、GlitchFlowは SHALL Objectの表示名と種別、またはschemaのテーブル名と明示されたカラム名・型をMarkdownで表示する。

#### Scenario: REQ-043-S01 - Objectとテーブル情報

- **GIVEN** `Object DB as "Database" type DB`と`schema DB.users:`の`id: int`、`name: text`がある。
- **WHEN** `state DB.users:`の`users`にHoverする。
- **THEN** テーブル名`DB.users`と`id: int`、`name: text`が表示される。
- **AND** `DB`にHoverすると`Database`と`DB`種別が表示される。

#### Scenario: REQ-043-S02 - 未解決の情報は表示しない

- **GIVEN** schemaが存在しない`state DB.missing:`がある。
- **WHEN** `missing`にHoverする。
- **THEN** 型情報は表示されない。

### Requirement: REQ-044 - プレビューのカラム型Hover

WHEN 利用者がプレビューのDBテーブルのカラム名にHoverした場合、GlitchFlowは SHALL 対応するschemaに明示された型をツールチップに表示する。
通常時の表の外観は維持する。

#### Scenario: REQ-044-S01 - カラムの型を表示

- **GIVEN** 別々のDB表に同じ`id`カラムがあり、型が`int`と`text`である。
- **WHEN** 各表の`id`カラム名にHoverする。
- **THEN** 各表自身のschemaに明示された`int`または`text`が表示される。

#### Scenario: REQ-044-S02 - 再描画後の型

- **GIVEN** import先schemaの`id: int`を利用した表が表示されている。
- **WHEN** import先を`id: text`へ編集してプレビューを再描画し、`id`にHoverする。
- **THEN** `text`が表示され、古い`int`は表示されない。
