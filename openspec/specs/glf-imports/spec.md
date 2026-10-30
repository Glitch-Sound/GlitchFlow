# glf-imports Specification

## Purpose

複数のフローを管理する設計者が、別のローカルGLFファイルにあるObjectとschemaを共有し、定義の重複と設計書間のずれを減らしながら各フローの図を作成するための機能である。

## Requirements

### Requirement: REQ-035 - GLF定義のインポート

WHEN トップレベルに`import "相対パス.glf"`を記述したとき、GlitchFlowは SHALL 記述元からの相対パスでローカルGLFを解決し、そのObjectとschemaだけを参照元の定義として利用する。
同じファイルは一度だけ取り込み、複数・多段のインポートと`DB.table`、`DB.schema.table`を扱い、定義元のファイルと行を保持する。

#### Scenario: REQ-035-S01 - 共通定義を使う

- **GIVEN** `common.glf`にDB Objectと`schema DB.users`があり、`flow.glf`に`import "./common.glf"`と`state DB.users`がある。
- **WHEN** `flow.glf`を解析してプレビューを開く。
- **THEN** 未宣言参照の診断がなく、DBとテーブルを用いた図が表示される。

#### Scenario: REQ-035-S02 - 複数と多段のインポート

- **GIVEN** フローが2ファイルをimportし、そのうち1つが第3のファイルをimportし、双方が同じファイルへ到達する。
- **WHEN** フローを解析する。
- **THEN** 各ファイルのObjectと`DB.schema.table`を利用でき、同じファイルの定義は重複しない。

#### Scenario: REQ-035-S03 - 処理要素を取り込まない

- **GIVEN** インポート先にObject、schema、title、メッセージ、活性、state、sql、複合フラグメントがある。
- **WHEN** 参照元の図を開く。
- **THEN** Objectとschemaだけが利用され、参照元にないイベントとtitleは図に追加されない。

#### Scenario: REQ-035-S04 - インポートしない文書

- **GIVEN** importを含まない既存の`login.glf`がある。
- **WHEN** 解析、補完、プレビューを実行する。
- **THEN** 従来と同じ定義、診断、描画結果になる。

### Requirement: REQ-036 - インポートの診断

IF 同名のObject IDまたはschema参照、循環、不正なパス、欠損、読み取り失敗、インポート先の構文エラーがある場合、THEN GlitchFlowは SHALL 参照元の関連する行に原因と対象ファイルを示す診断エラーを表示し、曖昧な定義を採用しない。

#### Scenario: REQ-036-S01 - 衝突を診断

- **GIVEN** ローカルとインポート先、または別々のインポート先に同じObject IDか同じschema参照がある。
- **WHEN** 参照元を解析する。
- **THEN** 重複した種類と定義元を示す診断が表示され、プレビューは不正な定義で更新されない。

#### Scenario: REQ-036-S02 - 循環を診断

- **GIVEN** `a.glf`が`b.glf`をimportし、`b.glf`が`a.glf`をimportする。
- **WHEN** `a.glf`を解析する。
- **THEN** 循環経路の診断がimport行に表示され、解析は停止せず終了する。

#### Scenario: REQ-036-S03 - 読み込みと構文の失敗を診断

- **GIVEN** import先がない、`.glf`以外や絶対パスを指定する、またはimport先に構文エラーがある。
- **WHEN** 参照元を解析する。
- **THEN** 対象パスと原因の診断がimport行に表示される。

### Requirement: REQ-037 - 依存更新と補完

WHEN インポートしたファイルの内容が変わるか、参照元で補完を要求したとき、GlitchFlowは SHALL 依存する開いたフローの解析結果、診断、プレビューを更新し、解析済みのObject IDとschemaを補完候補に含める。

#### Scenario: REQ-037-S01 - 定義元の変更を反映

- **GIVEN** `flow.glf`が`common.glf`のObjectとschemaを利用し、プレビューを表示している。
- **WHEN** `common.glf`の定義を編集またはディスク上で更新する。
- **THEN** `flow.glf`の診断とプレビューが新しい定義で再解析される。

#### Scenario: REQ-037-S02 - インポート定義を補完

- **GIVEN** `flow.glf`がDB Objectと2形式のschemaをインポートしている。
- **WHEN** Object参照、`state`、`sql`の位置で補完を要求する。
- **THEN** インポートされたObject IDと両形式のschemaが文脈に合う候補に現れる。
