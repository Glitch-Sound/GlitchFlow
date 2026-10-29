# preview Specification

## Purpose

設計者がGlitchFlowのプレビュー画面をVSCodeから開き、`.glf`に記述した処理の流れを図面で確認する機能である。
基本シーケンス図を表示し、後続の変更でState、SQL、複合フラグメントの描画を追加する。

## Requirements

### Requirement: REQ-001 - プレビューの起動

WHEN 利用者が`.glf`ファイルを開いたVSCodeで`GlitchFlow: プレビューを開く`コマンドを実行したとき、GlitchFlowは SHALL 見出しと現在の文書から生成した基本シーケンス図を持つWebviewパネルを表示する。

#### Scenario: REQ-001-S01 - `.glf`ファイルを開いてプレビューを起動する

- **GIVEN** GlitchFlow拡張が有効なVSCodeで基本イベントを含む`login.glf`を開いている。
- **WHEN** 利用者が`GlitchFlow: プレビューを開く`コマンドを実行する。
- **THEN** Webviewパネルが表示され、見出しに`ログインフロー`がある。
- **AND** 宣言済みのオブジェクトと基本イベントが図面に表示される。

### Requirement: REQ-026 - プレビュー自動起動

WHEN 利用者が`.glf`をテキストエディタで表示または切り替えたとき、`glitchflow.preview.autoOpen`が有効ならGlitchFlowは SHALL 入力フォーカスをそのエディタに維持したまま右側へプレビューを表示する。
この設定の既定値は有効とし、内部的な文書読み込みと`.glf`以外の表示では自動起動しない。

#### Scenario: REQ-026-S01 - 編集開始時の自動起動

- **GIVEN** 自動起動が既定値で有効で、プレビューが閉じている。
- **WHEN** 利用者が`login.glf`をテキストエディタで表示する。
- **THEN** 右側に`login.glf`のプレビューが表示される。
- **AND** 入力フォーカスは`login.glf`のエディタに残る。

#### Scenario: REQ-026-S02 - 設定と対象外ファイル

- **GIVEN** `glitchflow.preview.autoOpen`が無効で、プレビューが閉じている。
- **WHEN** 利用者が`.glf`または`.txt`を表示する。
- **THEN** プレビューは自動表示されない。

#### Scenario: REQ-026-S03 - 内部読み込みでは起動しない

- **GIVEN** 自動起動が有効で、プレビューが閉じている。
- **WHEN** 拡張機能が`.glf`文書をエディタに表示せず読み込む。
- **THEN** プレビューは作成されない。

### Requirement: REQ-027 - プレビューの再利用とクローズ

WHEN 別の`.glf`へ切り替えるか手動起動するとき、GlitchFlowは SHALL 既存のプレビューがあれば単一のパネルを再利用して対象文書を更新する。
利用者がプレビューを閉じた後、同じ文書を編集している間は自動で再表示せず、明示的な起動では再表示する。

#### Scenario: REQ-027-S01 - 単一パネルの再利用

- **GIVEN** `first.glf`のプレビューが右側にある。
- **WHEN** 利用者が`second.glf`へ切り替える。
- **THEN** パネル数は1のままで、表示内容が`second.glf`になる。
- **AND** 入力フォーカスは`second.glf`に残る。

#### Scenario: REQ-027-S02 - 手動クローズを尊重する

- **GIVEN** `first.glf`のプレビューを利用者が閉じた。
- **WHEN** 利用者が同じ`first.glf`を編集する。
- **THEN** プレビューは再表示されない。
- **AND** 明示的な起動ではプレビューが再表示される。

#### Scenario: REQ-027-S03 - 連続起動で重複しない

- **GIVEN** `first.glf`を表示している。
- **WHEN** 利用者が起動コマンドを連続実行する。
- **THEN** プレビューパネルは1つだけ存在する。

### Requirement: REQ-028 - エディタの起動アイコン

WHILE `.glf`のテキストエディタを表示するとき、GlitchFlowは SHALL エディタ右上にCodicon `$(open-preview)`だけの起動ボタンを表示し、ホバー時にツールチップを示す。
このボタンと既存のコマンドパレットは自動起動設定に関係なくプレビューを開ける。

#### Scenario: REQ-028-S01 - アイコンからの手動起動

- **GIVEN** 自動起動が無効で、`.glf`を表示している。
- **WHEN** 利用者がエディタ右上のプレビューアイコンを押す。
- **THEN** 右側にプレビューが表示される。
- **AND** ボタンは文字ラベルを表示せず、ホバー時にプレビュー起動のツールチップを表示する。

#### Scenario: REQ-028-S02 - 対象外のエディタ

- **GIVEN** `.txt`を表示している。
- **WHEN** 利用者がエディタ右上を見る。
- **THEN** GlitchFlowのプレビュー起動アイコンは表示されない。
