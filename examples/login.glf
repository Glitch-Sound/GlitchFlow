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
