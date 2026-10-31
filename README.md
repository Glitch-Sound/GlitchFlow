# GlitchFlow

**処理の流れと、各時点のDB・FILEの期待状態を一枚の図に**。

`.glf`をVS Codeで開くと、メッセージ、処理、分岐、データの状態を同じ時間軸で確認できる。

![GlitchFlowの紹介: 処理の流れ、DBの状態と更新セル、追加ファイルを順に示すアニメーション](docs/images/glitchflow-overview.gif)

入力補助・構文チェック・`import`による定義の分割と、PNG/SVGエクスポートも使える。

![GlitchFlowの操作紹介: DSLの補完候補、Problemsの診断、importした定義、画像エクスポートを順に示すアニメーション](docs/images/glitchflow-tools.gif)

## 3ステップで試す

1. VS Codeの拡張機能で`GlitchFlow`をインストールする。
2. 次の内容を`hello.glf`として保存する。
3. VS Codeで開き、右側のプレビューを確認する。

```glf
title: "はじめてのフロー"

Object FE as "画面" type APP
Object BE as "API" type API

Global ->> FE: 開始
FE+
FE ->> BE: データを取得
BE+
FE <-- BE: 取得結果
BE-
FE-
```

![hello.glfをVS Codeで開いた実画面: 左にDSL、右に自動表示されたプレビュー](docs/images/editor-preview-hello.jpg)

**図の見方:** 左からObject、上から下へ処理順。

同じ入力は[hello.glf](examples/hello.glf)からも取得できる。\
保存した`.glf`は自動でプレビューされ、編集すると図も更新される。\
構文や参照の誤りはVS Codeの**Problems**に表示される。

### 記法の早見表

| 書き方 | 図での表示 |
| --- | --- |
| `title: "名前"` | プレビューの見出し |
| `Object ID as "表示名" type APP` | Objectとライフライン |
| `FE ->> BE: 要求` / `FE -> BE: 通知` | 同期 / 非同期メッセージ |
| `FE <-- BE: 応答` | 応答メッセージ |
| `FE+` / `FE-` | 活性区間の開始 / 終了 |
| `FE: 処理` / `FE: *重要な処理*` | 処理 / 強調された処理 |
| `schema DB.users:` / `state DB.users:` | DBのカラム / 期待状態 |
| `state FILE:` / `sql DB:` | ファイルツリー / 表示用SQL |
| `alt:` / `opt 条件:` / `loop 条件:` | 分岐 / 条件付き処理 / 繰り返し |
| `par:` / `break 条件:` | 並列区画 / 中断区画 |
| `import "./common.glf"` | 別ファイルのObjectとschemaを参照 |

`title`は最初の非空行に記述し、ブロックは4個の空白でインデントする。\
Objectの種別には`APP`、`API`、`DB`、`FILE`、`FEATURE`、`MODULE`を指定できる。\
`state`と`sql`は表示用であり、DBやファイルの操作は実行しない。

### 記法の表示例

以下は各記法を使って取得した実際のプレビューである。

#### `title`

最初の非空行に書いたタイトルがプレビューの見出しになる。

![titleで指定した"処理の例"がプレビューの見出しになった画面](docs/images/notation-title.png)

#### `Object`

宣言したObjectは表示名と種別を持つ枠になり、その下にライフラインが伸びる。

![APP、API、DBのObjectとライフライン](docs/images/notation-object.png)

#### 同期 / 非同期メッセージ

`->>`は同期メッセージ、`->`は非同期メッセージを表す。

![FEからBEへの同期メッセージと非同期メッセージ](docs/images/notation-message.png)

#### 応答メッセージ

`FE <-- BE`はBEからFEへ戻る破線の応答になる。

![要求の後にBEからFEへ戻る応答メッセージ](docs/images/notation-response.png)

#### 活性区間

`BE+`から`BE-`まで、BEのライフラインに活性区間が表示される。

![BEの処理を囲む活性区間](docs/images/notation-activation.png)

#### 通常 / 強調された処理

`FE: 処理`は通常のカード、`FE: *重要な処理*`は強調されたカードになる。\
2行目以降は4個の空白で下げる。

```glf
FE: 通常の処理
    内容を確認

FE:
    本文の1行目
    本文の2行目

FE: *重要な処理
    入力を確認*
```

![2行の通常処理と2行の強調処理](docs/images/notation-process.png)

#### DBのカラム / 期待状態

`schema`はカラム名と型を定義し、`state`は指定した時点の行を表示する。\
`+`で追加した行は赤字になり、カラム名にHoverすると型を確認できる。

```glf
schema DB.users:
    id: int
    name: text
state DB.users:
    [1, "太郎"]
    + [2, "次郎"]
```

![usersテーブルに追加された赤字の行](docs/images/notation-db.png)

![DBのidカラムにHoverして型intを表示した画面](docs/images/notation-schema-hover.png)

#### FILEツリー / 表示用SQL

`state FILE`はファイルツリーを表示する。\
`+`は追加、`-`は削除を示す。

```glf
state FILE:
    users/
        + report.json
        - old.json
```

![追加されたreport.jsonと削除されたold.jsonを含むFILEツリー](docs/images/notation-file.png)

`sql DB`は図中にSQLを表示する。

```glf
sql DB:
    SELECT id, name
    FROM users
```

![DBのライフラインに表示された複数行のSQL](docs/images/notation-sql.png)

#### `alt` / `opt` / `loop`

`alt`は`case`と`else`を別の区画に表示する。

```glf
alt:
    case 成功:
        FE ->> BE: 保存
    else:
        FE: エラーを表示
```

![成功と失敗の2区画を持つalt分岐](docs/images/notation-alt.png)

`opt 条件:`は条件が成立した場合の処理を囲む。

![認可済みの場合だけ更新するopt区画](docs/images/notation-opt.png)

`loop 条件:`は繰り返す処理を囲む。

![再試行を表すloop区画](docs/images/notation-loop.png)

#### `par` / `break`

`par`は複数の`case`を並列の区画として表示する。

```glf
par:
    case 画面更新:
        FE: 表示を更新
    case 記録:
        BE: 履歴を記録
```

![画面更新と記録の2区画を持つparフラグメント](docs/images/notation-par.png)

`break 条件:`は中断する場合の処理を囲む。

![エラー時に中断する処理を囲むbreak区画](docs/images/notation-break.png)

#### `import`

別ファイルに定義したObjectと`schema`を取り込み、フローから参照できる。

`flow.glf`:

```glf
import "./common.glf"
Object FE as "画面" type APP
FE ->> DB: 検索
state DB.users:
    [1, "太郎"]
```

`common.glf`:

```glf
Object DB as "共有DB" type DB
schema DB.users:
    id: int
    name: text
```

![importで取り込んだ共有DBとusersテーブルを含むフロー](docs/images/notation-import.png)

## 状態と分岐を一緒に見る

[セッション隔離のサンプル](examples/session-isolation.glf)では、更新前後のDB、SQL、監査ファイル、成功・失敗の分岐を表示する。

![session-isolation.glfの実際のプレビュー: 更新後のDBセルと追加された監査ファイル](docs/images/session-isolation-preview.png)

- **図の見方:** 緑の表はDB、橙のツリーはFILE、赤い枠は分岐。
- **DB:** `active`から`isolated`へ更新したセルだけを赤字で表示。
- **FILE:** 追加した`S-42.json`を赤字で表示。
- **分岐:** `alt`の成功経路と失敗経路を別の区画に表示。

## VS Codeでの操作

| やりたいこと | 操作 |
| --- | --- |
| プレビューを開く | `.glf`を開く / エディタ右上のアイコン / `GlitchFlow: プレビューを開く` |
| 図から記述へ移動 | 図のメッセージ・処理・Stateなどをクリック |
| 定義へ移動 / 参照を検索 | Object IDやDBテーブル参照で`F12` / `Shift+F12` |
| 型や種別を見る | DSLのObject・テーブル、図のDBカラム名にHover |
| 入力を補完 | VS Codeの補完操作で構文や宣言済みIDを選択 |
| 図を拡大・縮小 | プレビュー左上の`-` / `Reset` / `+` |
| 画像を保存 | プレビューのエクスポートアイコン / `GlitchFlow: 図をエクスポート` |

画像は**PNG**または**SVG**で、スクロール外を含む図全体を保存できる。\
解析エラーがある間は、最後に正常に描画できた図を保持する。

### 設定

| 設定 | 既定値 | 内容 |
| --- | --- | --- |
| `glitchflow.preview.autoOpen` | `true` | `.glf`を開いたときの自動プレビュー |
| `glitchflow.syntaxHighlighting` | `theme` | `theme`: VS Codeの配色 / `glitchflow`: 専用配色 |

## さらに試す

- [最小のフロー](examples/hello.glf): Object、メッセージ、活性区間。
- [ログインフロー](examples/login.glf): DB表、SQL、FILEツリー、`alt`分岐。
- [セッション隔離](examples/session-isolation.glf): 更新セル、監査ファイル、条件による分岐。
- [複合フラグメント](examples/other-fragments.glf): `opt`、`loop`、`par`、`break`。

## 開発

Node.js 24とnpmを使用する。

```sh
npm ci
npm run build
npm run check
```

VS Codeでリポジトリを開き、`F5`でExtension Development Hostを起動する。\
視覚テストは`npm run test:visual`、拡張機能の統合テストは`npm run test:extension`で実行する。

[リポジトリ](https://github.com/Glitch-Sound/glitchflow) / [不具合の報告](https://github.com/Glitch-Sound/glitchflow/issues)
