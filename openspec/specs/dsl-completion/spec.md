# dsl-completion Specification

## Purpose

設計者が`.glf`の実装済み構文と文書内の識別子をVSCodeエディタで見つけ、誤入力と手入力の負担を減らすための機能である。

## Requirements

### Requirement: REQ-029 - 定型構文補完

WHEN `.glf`の入力位置で補完を要求したとき、GlitchFlowは SHALL 実装済みの`title`、`Object`、`schema`、`state`、`sql`、`alt`、`case`、`else`、`opt`、`loop`、`par`、`break`、メッセージ記号と定型Snippetを、説明付きのVSCode標準候補として提示する。

#### Scenario: REQ-029-S01 - 定型構文と記号

- **GIVEN** 空の`.glf`文書またはObject IDの直後にカーソルがある。
- **WHEN** 手動補完を呼び出す。
- **THEN** 空行では`Object`などのSnippet、Object IDの直後では`->>`、`->`、`-->`、`<--`など実装済みのメッセージ記号が説明付きで表示される。
- **AND** Snippetの挿入後にIDやラベルをタブで編集できる。

### Requirement: REQ-030 - 定義参照補完

WHEN `.glf`の参照位置で補完を要求したとき、GlitchFlowは SHALL 解析できたObject IDとschema参照から動的に候補を作り、`DB.table`と`DB.schema.table`の表記を保持して提示する。

#### Scenario: REQ-030-S01 - 定義済み参照

- **GIVEN** `Object FE`と`Object DB`、`schema DB.users:`と`schema DB.public.orders:`が宣言されている。
- **WHEN** メッセージ受信先、`sql `、`state DB.`で補完を呼び出す。
- **THEN** 受信先にはFEとDB、`sql `にはDB、`state DB.`には`DB.users`と`DB.public.orders`が表示される。

### Requirement: REQ-031 - 文脈別補完

WHEN `.glf`の補完を要求したとき、GlitchFlowは SHALL 現在行と親ブロックの文脈で候補を限定し、別行の構文エラーがあっても解析可能な定義の候補を利用する。

#### Scenario: REQ-031-S01 - ブロックごとの候補

- **GIVEN** `alt`直下、`schema`のカラム行、`sql`本文にそれぞれカーソルがある。
- **WHEN** 手動補完を呼び出す。
- **THEN** `alt`直下には`case`と`else`、カラム行とSQL本文にはDSLイベント候補が表示されない。

#### Scenario: REQ-031-S02 - 未完成の文書

- **GIVEN** 未完成のメッセージ行と、別行の正常な`Object DB`がある。
- **WHEN** `sql `で手動補完を呼び出す。
- **THEN** DBが候補に表示され、診断とプレビューの更新動作は維持される。
