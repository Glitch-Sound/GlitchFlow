title: "複合フラグメント"

Object FE as "フロントエンド" type APP
Object BE as "バックエンド" type API

opt 許可済み:
    FE ->> BE: 許可を確認

loop 再試行:
    FE ->> BE: 再送

par:
    case 画面更新:
        FE: 画面を更新
    case 記録:
        BE: 履歴を記録

break エラー:
    FE: エラーを通知

FE: 後続を表示
