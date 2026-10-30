# Spec Delta

## MODIFIED Requirements

### Requirement: REQ-022 - 図面とObjectの視覚表現

WHEN `.glf`の図面を表示したとき、GlitchFlowは SHALL HTML試作に基づく暗色の図面背景と操作部を表示し、Objectの表示名と種別を二段の枠内に示し、DSL上のObject IDを図面の文字列として表示せず、APP `#74C9F8`、API `#B287FF`、DB `#47D78B`、FILE `#EDA357`、FEATURE `#E79BBE`、MODULE `#A5B3C4`を枠と活性の識別色として使用する。\
先頭イベントの活性バーはObject枠の下端から8px以上離して配置する。

#### Scenario: REQ-022-S01 - 種別と活性を区別する

- **GIVEN** FE、BE、DB、FILEの4種類と活性を含む`examples/login.glf`がある。
- **WHEN** プレビューを表示する。
- **THEN** 各Objectに表示名と種別だけが表示され、`FE`、`BE`、`DB`、`FILE`のIDは副題に現れず、枠と対応する活性バーが種別ごとの色で区別できる。
- **AND** 図面と操作部は暗色の背景を持ち、図面には控えめな横方向の時間目盛りがある。
- **AND** 操作部の3つのボタンに表示する文字は左から`-`、`Reset`、`+`であり、縮小、等倍、拡大の操作をそれぞれ実行できる。
- **AND** 3つのボタンの読み上げ用の名前はそれぞれ`縮小`、`等倍`、`拡大`である。
- **AND** 最初のメッセージラベルの上端はObject枠の下端から10px以上離れる。

#### Scenario: REQ-022-S02 - 未使用の種別とテーマ

- **GIVEN** FEATUREとMODULEを宣言した`.glf`をライトテーマのVS Codeで開いている。
- **WHEN** プレビューを表示する。
- **THEN** 両種別はそれぞれ指定の識別色を使い、暗色の図面上で表示名と種別が読め、IDは表示されない。
- **AND** VS Codeの通常エディタの配色は変更されない。

#### Scenario: REQ-022-S03 - 先頭の活性をObject枠の下に置く

- **GIVEN** 最初のイベントが`FE+`であり、FEの複数行処理、メッセージ、`FE-`が続く文書がある。
- **WHEN** プレビューを表示する。
- **THEN** FEの活性バーはObject枠の下端から8px以上下に始まり、処理とメッセージの位置まで連続する。
- **AND** メッセージの直後に始まる活性は、従来どおりメッセージの高さから始まる。
