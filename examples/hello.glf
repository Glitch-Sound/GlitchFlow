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
