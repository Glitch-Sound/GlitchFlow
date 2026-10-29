# Spec Delta

## Purpose

設計者がGlitchFlowのプレビュー画面をVSCodeから開き、後続のDSL解析と図面描画を追加するための表示先が利用できることを確認する機能である。
初期段階ではファイル内容の解析や図面描画を行わない。

## ADDED Requirements

### Requirement: REQ-001 - プレビューの起動

WHEN 利用者が`.glf`ファイルを開いたVSCodeで`GlitchFlow: プレビューを開く`コマンドを実行したとき、GlitchFlowは SHALL `GlitchFlow Preview`の見出しを持つWebviewパネルを表示する。

#### Scenario: REQ-001-S01 - `.glf`ファイルを開いてプレビューを起動する

- **GIVEN** GlitchFlow拡張が有効なVSCodeで`login.glf`を開いている。
- **WHEN** 利用者が`GlitchFlow: プレビューを開く`コマンドを実行する。
- **THEN** Webviewパネルが表示され、見出しに`GlitchFlow Preview`がある。
- **AND** パネルにDSLの解析結果や図面は表示されない。

