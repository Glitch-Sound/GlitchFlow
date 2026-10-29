# GlitchFlow — OpenSpec開発入力

## この文書の使い方

この文書は、VSCode + Codex + OpenSpecでGlitchFlowを開発するための入力仕様である。
最初に `openspec/product.md`・`openspec/tech.md`・`openspec/structure.md` を読み、内容を守って変更を提案する。
OpenSpecの仕様が確定する前にコードを作成しない。
ここに書かれた内容と他の3文書が矛盾する場合は、推測して実装せず、差分を報告して整理する。

## Codexへの初回指示

> GlitchFlowのVSCode拡張機能をOpenSpecで段階的に開発する。
> 最初に `openspec/product.md`、`openspec/tech.md`、`openspec/structure.md` を読み、目的と制約を整理してほしい。
> `openspec init` が必要なら、既存ファイルを確認したうえで初期化手順を提示してほしい。
> 最初の変更は `bootstrap-glitchflow` とし、TypeScript、VSCode Extension、ViteによるWebview、Coreの最小構成、Biome、Steiger、LefthookによるチェックについてOpenSpecの変更提案を作成してほしい。
> `proposal`、`specs`、必要な `design`、`tasks` を確認できる形にしてほしい。
> この段階ではコードを書かず、既存ファイルの変更もしないでほしい。
> 各タスクは小さく独立させ、完了条件とテスト方法を明記してほしい。

## OpenSpecの運用

1. `openspec init` でOpenSpecを導入し、Codexとの連携を設定する。
2. `openspec/config.yaml` は公式形式に従って管理し、`openspec/` 配下の3文書を参照する方針を短く記載する。
3. 変更ごとに `/opsx:propose` または対応するCodexのOpenSpecスキルで提案を作る。
4. `proposal`・`specs`・`design`・`tasks` の整合性をレビューする。
5. 承認した変更のみ `/opsx:apply` 相当の手順で実装する。
6. 実装後にテストと差分を検証し、必要な修正を行う。
7. `verify` が利用可能ならOpenSpecの照合も実行し、不一致を解消する。
8. 完了後に `/opsx:archive` 相当の手順で仕様へ反映する。

コマンドやスキル名は導入したOpenSpecとCodexのバージョンに合わせる。
変更が大きい場合は一つにまとめず、複数の変更として計画する。
OpenSpecの恒久仕様は `openspec/specs/` を正とし、製品・技術・構造の方針は `openspec/` 直下の3文書で管理する。

## 設計時の確認事項

Codexは各OpenSpec変更の提案時に、以下を確認する。

- 目的、今回の対象、対象外、依存する既存仕様、完了条件を明記する。
- 仕様には入力例、期待するIRまたは表示結果、構文エラー時の扱いを記載する。
- `alt` などの分岐では、分岐前から継続する活性と各分岐の `Object-` を確認する。
- DB・FILEのStateは明示された表示属性のみを扱い、前後比較や整合性の推論を加えない。
- レイアウト変更では、ライフライン中心、矢印の端点、Stateの寸法、フラグメントの重なり順を検証項目に含める。
- 仕様追加時はParser、Validator、IR、Layout、Renderer、VSCode連携のうち、変更される責務を明記する。
- 表示例は既存のHTMLサンプルを参考とするが、固定座標を実装仕様とはしない。
- 正常例に加えて、未宣言Object、不正なインデント、活性の閉じ忘れ、入れ子分岐などの境界・異常例を検討する。
- 既存の`.glf`に影響する変更では、後方互換性と回帰テストの更新方針を示す。
- 新しいライブラリや構成の追加、DSLの意味の変更は、必要性と代替案を提示してから決定する。
- 不確定事項をCodexが独自解釈して実装せず、未決定事項として明示する。

## 実装完了前の確認事項

- `npm run check` と `npm run test:visual` を実行し、失敗・未実行の項目を報告する。
- 描画の変更では、実際のChromium表示を確認し、切れ・重なり・活性区間の終了位置を確かめる。
- OpenSpecの `verify` を利用可能にし、仕様・設計・タスクと実装の対応を確認する。
- `verify` が実行できない場合は手動で対応を確認し、その理由を報告する。
- テスト結果だけで完了とせず、差分と受け入れ条件を照合してからarchiveする。
- 未実装、暫定対応、未検証の事項が残る場合は、完了したと表現せず具体的に記載する。

## 開発する機能

### 1. DSLの解析

- `.glf` の最初の非空行に `title: "タイトル"` を任意で指定できるようにする。
- タイトルはIRのメタデータとし、複数指定・空文字列・先頭以外の指定を診断する。
- タイトルがないときはプレビューの見出しにファイル名を表示する。
- `Object`、`schema`、`state`、`sql`、メッセージ、処理、活性操作、複合フラグメントを解析する。
- `schema` と `state` で `ObjectID.table` と `ObjectID.schema.table` の両形式を受け付ける。
- スキーマ名の省略時も自動補完せず、記述された識別子を保持する。
- DB行の `+`・`-`、DBセルの `!`、FILEノードの `+`・`-` を変更属性として解析する。
- 無印は変更なしとし、前後のStateを比較して操作を推論しない。
- Object種別は `APP`・`API`・`DB`・`FILE`・`FEATURE`・`MODULE` の6種類を受け付ける。
- メッセージ記法は `->>` が同期、`->` が非同期、`-->` が応答である。
- `FE <-- BE` のような逆向き表記を受け付ける。
- `Global` は宣言不要の特殊な起点である。
- 複合フラグメントとStateはPython-likeな `:` とインデントで範囲を表す。
- 活性区間だけは `Object+` と `Object-` で制御し、インデントから自動終了させない。
- 応答メッセージのない同期要求も有効とする。

### 2. シーケンス図の描画

- オブジェクトはDSLの宣言順に横へ並べる。
- ライフライン、活性区間、メッセージ、処理内容を表示する。
- `Global` はオブジェクト枠とライフラインを持たず、メッセージ起点を白系の丸で表示する。
- 同期矢印は白系の塗りつぶし先端、非同期と応答は白系の開いた先端とする。
- 応答は破線で表示する。
- `*起動処理*` などは太字で表現する。
- 複合フラグメントは `#DD6872` の枠、ラベル、分岐線で表現する。
- フラグメントの枠やラベルは前面に置き、メッセージや状態を隠さない。

### 3. StateとSQLの描画

- `schema DB.users:` または `schema DB.public.users:` で定義した全カラムを、同じ参照形式の `state` に横並びで表示する。
- カラムを要約したり、別の行へ分割したりしない。
- DB行の `+` は追加、`-` は削除、無印は変更なしを表す。
- DBセルの `!` は更新を表し、そのセルだけを強調する。
- `state FILE:` は階層の深さを保ったツリーとして表示し、各ノードの `+` は追加、`-` は削除、無印は変更なしとする。
- 追加と更新は赤文字、削除は赤文字と取り消し線、変更なしは通常色とする。
- `+`・`-`・`!` の記号自体は図面へ表示しない。
- FILEの親の指定を子に自動伝播させない。
- `sql DB:` の内容はグレー系の矩形に表示する。
- SQLが同じDBのStateに連続している場合はテーブルの下へ表示する。
- DB・FILEのStateは該当ライフラインの右側に表示する。
- StateはDSLに書いた位置にのみ表示する。
- 変更前後のStateやSQLとの整合性を検証せず、ユーザー指定どおりに描画する。
- SQLとStateは描画のみ行い、外部データを操作しない。

### 4. 分岐と活性区間

- `alt:` の `case:` と `else:` は排他的な経路として描画する。
- 分岐前に開始した活性は、各分岐の明示的な `-` まで続ける。
- 成功経路は「ホーム画面表示」の後、失敗経路は「エラーメッセージ表示」の後にFEを非活性へ戻す。
- `else` 内には処理開始前の余白を設けるが、活性区間には不自然な空白を作らない。
- 分岐を抜ける時点で活性状態が不一致なら、診断として通知する。
- `opt`・`loop`・`par`・`break` は `alt` が安定した後に独立して実装する。

### 5. VSCodeとの連携

- `.glf` を言語として登録し、TextMate Grammarによるシンタックスハイライトを提供する。
- 既定のハイライトはVSCodeのカラーテーマに追従させる。
- 設定 `glitchflow.syntaxHighlighting` は `theme`（既定）と `glitchflow` を選択できるようにする。
- `glitchflow` の場合だけ`.glf`のエディタ装飾で専用配色を使用し、ほかのファイルやVSCode全体の配色を変更しない。
- 専用配色はダーク・ライトで読みやすくし、設定変更時に再適用する。
- `title` やDSL記法を標準・専用の両モードで色分けする。
- ファイル編集に追従してWebviewプレビューを更新する。
- 構文エラーと意味エラーをVSCodeのProblemsに表示する。
- 拡大・縮小とスクロールを利用できるようにする。

## 基準DSL

以下の例を `examples/login.glf` に保存し、初期の回帰テストに使用する。
この例のDBレコードは表示サンプルであり、DB検索や認証の実行結果を計算するものではない。
SQLも表示用のサンプルであり、実行や認証方式の安全性評価は対象外である。

```text
title: "ログインフロー"

Object FE   as "フロントエンド" type APP
Object BE   as "バックエンド"   type API
Object DB   as "PostgreSQL"     type DB
Object FILE as "Storage"        type FILE

schema DB.users:
    uid: int
    name: text
    password_hash: text
    created_at: datetime
    deleted_at: datetime

Global ->> FE: アプリ起動
FE+
FE: *起動処理*
FE: 設定読み込み
FE: ログイン画面表示

Global ->> FE: ログイン情報入力

FE ->> BE: login(name, password)
BE+
BE: *ログイン処理*

BE ->> DB: ユーザ検索(name, password)
DB+
state DB.users:
    [1, "taro", "hashed-xxx", "2026-10-27 22:00:00", null]
sql DB:
    SELECT COUNT(uid)
    FROM users
    WHERE
    name = :name
    AND
    password_hash = :password_hash;
BE <-- DB: 検索結果
DB-

alt:
    case ユーザヒット:
        BE ->> FILE: user.info を保存
        FILE+
        state FILE:
            users/
                1/
                    + user.info
        FILE-

        FE <-- BE: 200 OK
        BE-
        FE: ホーム画面表示
        FE-
    else:
        FE <-- BE: 401 Unauthorized
        BE-
        FE: エラーメッセージ表示
        FE-
```

DBレコードの先頭の `-` は削除を表すため、基準例では無印のレコードを記述する。
FILEの `+ user.info` は保存による追加を表し、無印であれば変更なしを表す。
FILEへの同期要求は、応答メッセージを省略して `FILE-` で終了する。

スキーマ指定と追加・削除・更新の構文を確認するため、次の別例もテストに使用する。

```text
Object DB as "PostgreSQL" type DB
Object FILE as "Storage" type FILE

schema DB.public.users:
    uid: int
    name: text
    status: text

state DB.public.users:
    - [1, "taro", "inactive"]
    [2, "jiro", "active"]
    [3, !"saburo", "active"]
    + [4, "shiro", "active"]

state FILE:
    users/
        1/
            - old.info
            user.info
            + new.info
```

この別例は、変更操作の整合性を検証するものではなく、指定された装飾を描画するためのものである。

## 段階的な変更計画

| 順序 | OpenSpec変更名の例 | 完了条件 |
| --- | --- | --- |
| 1 | `bootstrap-glitchflow` | VSCode拡張とVite Webviewが起動し、Biome・Steiger・Lefthookの設定とチェック用スクリプトが動作する。 |
| 2 | `parse-glf-basics` | 基準DSLからTitle、Object、Message、Activation、Schema、State、SQLのIRを作り、DB参照形式と変更属性を解析する。 |
| 3 | `render-sequence` | ライフライン、要求・応答、活性、処理が自動配置される。 |
| 4 | `render-state-and-sql` | DB全カラム、FILEツリー、SQL枠と変更属性を指定位置に表示する。 |
| 5 | `support-alt-fragment` | 成功・失敗の分岐と活性区間を正しく描画する。 |
| 6 | `integrate-glf-editor` | 編集連動、診断、ズーム、スクロール、VSCodeテーマ追従と任意の専用配色が使える。 |
| 7 | `support-other-fragments` | `opt`・`loop`・`par`・`break` を仕様とテスト付きで追加する。 |
| 8 | `stabilize-layout` | レイアウト回帰テストと基本操作の確認を完了する。 |

各変更の着手前に、より小さい単位へ分割すべきか判断する。
次の変更は、前の変更のテストが通ってから開始する。

## 受け入れ条件

- `title: "ログインフロー"` をプレビュー見出しへ反映でき、未指定時はファイル名を表示する。
- `title` をオブジェクトや時間軸のイベントとして描画しない。
- `.glf` の構文色は標準でVSCodeテーマに従い、専用配色へ切り替えてもほかのファイルに影響しない。
- `Global` にオブジェクト枠とライフラインがなく、起点の丸とメッセージが表示される。
- `FE+` は最初の `FE-` まで途切れず、ユーザー入力の位置でも継続する。
- DB・FILEの活性区間は要求に合わせて開始し、明示的な `-` で終了する。
- FILEへの応答矢印がなくても正常に描画される。
- 同期矢印の先端が塗りつぶされ、その他の矢印と区別できる。
- 「起動処理」と「ログイン処理」が太字で表示される。
- DBの5カラムと値が全て横並びで表示される。
- `DB.table` と `DB.schema.table` の両方を解析・表示でき、スキーマ名を自動補完しない。
- DBレコードの追加・削除・変更なし、DBカラムの更新を描き分けられる。
- DBテーブルの下にグレー系のSQL枠が表示される。
- FILEツリーの階層と追加・削除・変更なしが正しく表示され、子へ変更指定が自動伝播しない。
- 変更の赤文字、削除の取り消し線、`+`・`-`・`!` の非表示が確認できる。
- 状態変化やSQLとのデータ整合性を検証せず、指定された表示を維持する。
- `alt` の枠・分岐線が `#DD6872` で前面に表示される。
- 成功側・失敗側の活性区間が、それぞれの `FE-` の位置で終わる。
- 図の文字列やデータが切れず、必要な方向へスクロールできる。
- DSLを編集したとき、プレビューが同期して更新される。
- 不正な構文、未対応の活性、分岐の不整合が診断できる。
- VitestとPlaywrightのテストが通り、実際のChromium描画を確認する。
- コミット前にLefthookからBiome・Steiger・型検査が実行され、CIでも検証できる。

## 完了時の報告

実装ごとに、変更したファイル、満たした要件、実行したテスト、未対応事項を簡潔に報告する。
要求にない機能やライブラリを独断で追加しない。
既存のDSL仕様やレイアウトを変更する場合は、変更提案と回帰テストを先に更新する。
