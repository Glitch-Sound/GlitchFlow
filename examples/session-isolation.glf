title: "不審セッションの隔離と証跡保全"

Object APP  as "監視コンソール" type APP
Object API  as "セキュリティAPI" type API
Object DB   as "セッションDB"   type DB
Object FILE as "証跡ストア"     type FILE

schema DB.sessions:
    id: text
    status: text
    risk_score: int

Global ->> APP: 未登録端末からの特権操作を検知
APP+
APP ->> API: セッション S-42 の隔離を要求
API+
API: *隔離条件を原子的に判定*
API ->> DB: 高リスクの有効セッションだけを更新
DB+
state DB.sessions:
    ["S-42", "active", 92]
state DB.sessions:
    ["S-42", "active", 92]
sql DB:
    UPDATE sessions SET status = 'isolated'
    WHERE id = :session_id AND status = 'active'
    AND risk_score >= 80 RETURNING id;
API <-- DB: 更新行（0または1件）
DB-

alt:
    case 隔離できた:
        state DB.sessions:
            ["S-42", !"isolated", 92]
        API ->> FILE: 監査証跡を保存
        FILE+
        state FILE:
            incidents/
                + S-42.json
        FILE-
        APP <-- API: 200 OK / 隔離完了
        API-
        APP-
    else:
        APP <-- API: 409 Conflict / 隔離条件未達
        API-
        APP-
