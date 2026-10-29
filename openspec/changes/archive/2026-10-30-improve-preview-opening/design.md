# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [preview](specs/preview/spec.md)。
- 前提と制約: [技術方針](../../../tech.md#アーキテクチャ)に従い、VSCode標準APIと既存Webviewを使う。

## Goals / Non-Goals

**Goals:**

- REQ-026からREQ-028を拡張本体だけの変更で実現する。

**Non-Goals:**

- Coreの解析とWebviewの描画の変更。

## Decisions

### D-01 - エディタ表示イベントを起動契機にする

- 対象: REQ-026、REQ-026-S01からS03。
- 選択: `onDidChangeActiveTextEditor`と起動時の`activeTextEditor`だけを自動起動に使う。
- 理由: `onDidOpenTextDocument`は内部読み込みでも発火するため、自動起動の契機から除外する。
- 代替案: 文書オープンイベントは意図を判別できないため採用しない。
- 配置と依存: `src/extension/extension.ts`から共通の`openPreview`を呼ぶ。

### D-02 - 単一パネルと対象URIを管理する

- 対象: REQ-027、REQ-027-S01からS03。
- 選択: `preview-panel.ts`にパネルと現在のURIを保持し、起動処理を直列化する。
- 理由: パネルとメッセージ受信リスナーを1つに保ち、切り替え時の更新と重複防止を両立する。
- 代替案: 文書ごとのパネルは重複と古い図の残留を招くため採用しない。
- 配置と依存: `src/extension/preview-panel.ts`の既存Webview処理を再利用する。

### D-03 - 閉鎖の抑制と標準メニュー

- 対象: REQ-027-S02、REQ-028-S01、REQ-028-S02。
- 選択: 手動クローズされた文書URIを次の異なるエディタ表示まで記憶する。
  `editor/title`に`navigation`グループのCodiconコマンドを追加する。
- 理由: 編集イベントによる再生成を避け、設定が無効でも同じコマンドから手動起動できる。
- 代替案: 独自ボタンはVSCode標準UIと一致しないため採用しない。
- 配置と依存: `package.json`、`src/extension/extension.ts`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-026 | S01、S02、S03 | [D-01](#d-01---エディタ表示イベントを起動契機にする) | `extension.ts`、`package.json` | `tests/extension/preview.test.ts`で表示と設定を確認 |
| REQ-027 | S01、S02、S03 | [D-02](#d-02---単一パネルと対象uriを管理する) | `preview-panel.ts` | 同テストで切り替え、閉鎖、連続起動を確認 |
| REQ-028 | S01、S02 | [D-03](#d-03---閉鎖の抑制と標準メニュー) | `package.json`、`extension.ts` | メニュー定義の検査とDevelopment Hostで目視確認 |

## Verification Plan

- 正常、境界、異常: Extension統合テストで自動起動、設定OFF、内部読み込み、切り替え、閉鎖、連続起動を確認する。
- 非機能要件: 新規の性能要件はない。
- 手動確認: Development Hostでアイコン、ツールチップ、入力フォーカスを確認する。
- 全体検証: `npm run check`、`npm run test:extension`、`npx --no-install openspec validate improve-preview-opening --strict`。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | Webview表示でアクティブエディタが一時的に変わる | `preserveFocus`を使い、異なるエディタ表示だけ抑制状態を解除する |
| D-02 | 初期化中の連続起動 | 初期化Promiseとパネル参照を共有する |

## Migration Plan

既存コマンドは維持する。
自動起動を望まない利用者は`glitchflow.preview.autoOpen`を無効にできる。

## Open Questions

なし。
