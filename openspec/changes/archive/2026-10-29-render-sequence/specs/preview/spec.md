# Spec Delta

## MODIFIED Requirements

### Requirement: REQ-001 - プレビューの起動

WHEN 利用者が`.glf`ファイルを開いたVSCodeで`GlitchFlow: プレビューを開く`コマンドを実行したとき、GlitchFlowは SHALL 見出しと現在の文書から生成した基本シーケンス図を持つWebviewパネルを表示する。

#### Scenario: REQ-001-S01 - `.glf`ファイルを開いてプレビューを起動する

- **GIVEN** GlitchFlow拡張が有効なVSCodeで基本イベントを含む`login.glf`を開いている。
- **WHEN** 利用者が`GlitchFlow: プレビューを開く`コマンドを実行する。
- **THEN** Webviewパネルが表示され、見出しに`ログインフロー`がある。
- **AND** 宣言済みのオブジェクトと基本イベントが図面に表示される。
