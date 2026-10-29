# GlitchFlow

![GlitchFlow のアイコン](docs/images/glitchflow-icon-512.png)

GlitchFlow は、処理の流れ（Flow）とデータの期待状態（State）を同じ時間軸で可視化する VS Code 拡張機能です。`.glf` ファイルにメッセージ、処理、分岐、DB レコードやファイルの状態を記述すると、図をプレビューできます。設計レビュー、実装時の動作共有、結合テストの期待結果の整理に利用できます。

![ログイン処理の流れと、DB やファイルの期待状態を並べたプレビュー](docs/images/align-preview-login.png)

## 使い方

1. VS Code で `.glf` ファイルを作成して開きます。右側にプレビューが自動表示されます。
2. DSL を編集すると図が更新されます。構文や参照の誤りは **Problems** に表示され、エラー中は最後に正常に描画できた図を保持します。
3. プレビューを手動で開くには、エディタ右上のアイコン、またはコマンドパレットの **GlitchFlow: プレビューを開く** を使います。

プレビューは縮小、等倍、拡大と縦横スクロールに対応します。自動表示は `glitchflow.preview.autoOpen` で切り替えられます。`.glf` の構文配色は標準で VS Code のテーマに従い、`glitchflow.syntaxHighlighting` を `glitchflow` にすると専用配色になります。

## DSL の書き方

以下を `login.glf` として保存すると、メッセージと DB・ファイルの期待状態を一つの図に表示できます。より詳しい入力例は [examples/login.glf](examples/login.glf) にあります。

```glf
title: "ログインフロー"

Object FE as "フロントエンド" type APP
Object BE as "バックエンド" type API
Object DB as "データベース" type DB
Object FILE as "ストレージ" type FILE

schema DB.users:
    id: int
    name: text

FE ->> BE: login(name)
BE+
BE: *ユーザーを検索*
BE ->> DB: users を検索
state DB.users:
    [1, "taro"]
sql DB:
    SELECT id, name FROM users WHERE name = :name;

alt:
    case 見つかった:
        FE <-- BE: 200 OK
    else:
        FE <-- BE: 401 Unauthorized

BE-
state FILE:
    users/
        + login.log
```

### 基本構文

| 記述 | 意味 |
| --- | --- |
| `title: "タイトル"` | 図のタイトル。指定する場合は最初の非空行に 1 回だけ書きます。 |
| `Object ID as "表示名" type 種別` | 登場する対象を宣言します。種別は `APP`、`API`、`DB`、`FILE`、`FEATURE`、`MODULE` です。`Global` は宣言不要の送信元 ID です。 |
| `FE ->> BE: 要求` / `FE -> BE: 通知` / `FE --> BE: 応答` | 左の ID から右の ID への同期、非同期、応答メッセージ。`FE <<- BE`、`FE <- BE`、`FE <-- BE` は右から左へ向かいます。 |
| `BE: 処理` / `BE: *強調する処理*` | 対象の処理。前後を `*` で囲むと強調します。 |
| `BE+` / `BE-` | 活性区間の開始と終了。開始した区間は終了させます。 |

### データの期待状態

`schema DB.users:` でカラムを `名前: 型` の形式で宣言し、`state DB.users:` にカラム順の行を `[値, 値]` で並べます。参照は `DB.users` のほか `DB.public.users` のようにスキーマ名も指定できます。行頭の `+` と `-` は追加・削除、セル値の先頭の `!` は更新を表します。

```glf
state DB.users:
    + [2, "hanako"]
    [1, !"taro-new"]
    - [3, "old-user"]
```

`state FILE:` ではインデントで階層を表し、行頭の `+` と `-` で追加・削除を示します。`sql DB:` には表示したい SQL を複数行で記述できます。これらは図に表示するための期待状態であり、DB・ファイル・SQL は実行されません。

### 条件分岐と繰り返し

`alt:` は `case 条件:` と省略可能な `else:`、`par:` は 2 つ以上の `case 名前:` で分岐を記述します。`opt 条件:`、`loop 条件:`、`break 条件:` はそれぞれ内容を 1 段下げて記述します。ブロックのインデントにはタブではなく **4 個ずつの空白**を使います。活性区間は分岐の出口で一致させてください。

```glf
opt キャッシュが有効:
    FE: キャッシュを使う

loop 再試行:
    FE ->> BE: 再送

par:
    case 画面更新:
        FE: 画面を更新
    case 記録:
        BE: 履歴を記録
```

## 開発

Node.js 24 と npm を使用します。

```sh
npm ci
npm run build
npm run check
```

VS Code でリポジトリを開いて F5 を押すと、Extension Development Host で [examples/login.glf](examples/login.glf) を確認できます。視覚テストは `npx --no-install playwright install chromium` の後に `npm run test:visual`、拡張機能の統合テストは `npm run test:extension` で実行します。

リポジトリ: [Glitch-Sound/glitchflow](https://github.com/Glitch-Sound/glitchflow) / 不具合の報告: [Issues](https://github.com/Glitch-Sound/glitchflow/issues)
