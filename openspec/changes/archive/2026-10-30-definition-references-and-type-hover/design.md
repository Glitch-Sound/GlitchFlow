# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [DSLシンボル](specs/dsl-symbol-navigation/spec.md)。
- 前提と制約: [DSLと編集](../../../product.md#dslと編集)、[構成](../../../structure.md#設計責務の境界)。

## Goals / Non-Goals

**Goals:**

- REQ-041からREQ-043を統合済み定義と同一の参照索引で実現する。
- REQ-044をschemaの明示型から描画し、通常の表外観を維持する。

**Non-Goals:**

- SQL解析と外部DBからの型取得。

## Decisions

### D-01 - 構文位置と解決済み定義を結ぶ

- 対象: REQ-041-S01からS03、REQ-042-S01とS02、REQ-043-S01とS02。
- 選択: Parserが受理した宣言とイベントの行だけを索引化し、Object IDと完全なテーブル参照をimport解決済みIRに結び付ける。
- 理由: 文字列やSQL本文を誤って参照とせず、同名要素を定義単位で区別できる。
- 代替案: 文書全体の文字列検索は誤一致するため採用しない。
- 配置と依存: `src/extension/symbols.ts`がCoreとVSCode APIを利用する。

### D-02 - 3つのVSCode Providerを同じ索引へ接続する

- 対象: REQ-041からREQ-043の全シナリオ。
- 選択: 補完と同じ`GlfImportResolver.resolve`を使い、Definition、Reference、HoverのProviderを登録する。
- 理由: import先の未保存編集と依存更新を既存経路で反映できる。
- 代替案: Providerごとの再解析は結果が分岐するため採用しない。
- 配置と依存: `src/extension/extension.ts`と`src/extension/symbols.ts`。

### D-03 - カラムと型をレイアウト経由で渡す

- 対象: REQ-044-S01とS02。
- 選択: DB状態のschemaカラム型をレイアウトに保持し、ヘッダにツールチップを付ける。
- 理由: 同名カラムでも状態のテーブルと列順で正しい型に結び付く。
- 代替案: 表示文字列やSQLから型を探す方式は採用しない。
- 配置と依存: `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts`、`src/webview/app/styles.css`。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-041 | REQ-041-S01、REQ-041-S02、REQ-041-S03 | [D-01](#d-01---構文位置と解決済み定義を結ぶ)、[D-02](#d-02---3つのvscode-providerを同じ索引へ接続する) | `src/extension/symbols.ts` | `tests/extension/symbols.test.ts` |
| REQ-042 | REQ-042-S01、REQ-042-S02 | [D-01](#d-01---構文位置と解決済み定義を結ぶ)、[D-02](#d-02---3つのvscode-providerを同じ索引へ接続する) | `src/extension/symbols.ts` | `tests/extension/symbols.test.ts` |
| REQ-043 | REQ-043-S01、REQ-043-S02 | [D-01](#d-01---構文位置と解決済み定義を結ぶ)、[D-02](#d-02---3つのvscode-providerを同じ索引へ接続する) | `src/extension/symbols.ts` | `tests/extension/symbols.test.ts` |
| REQ-044 | REQ-044-S01、REQ-044-S02 | [D-03](#d-03---カラムと型をレイアウト経由で渡す) | `src/core/layout/sequence-layout.ts`、`src/webview/pages/preview/ui/render-preview.ts` | `tests/core/type-hover.test.ts`、`tests/visual/type-hover.spec.ts` |

## Verification Plan

- 正常、境界、異常: 各シナリオのProvider結果とプレビュー属性・Hover表示を統合テストとPlaywrightで確認する。
- 非機能要件: 新規採番はない。
- 手動確認: なし。
  VSCode標準Providerの結果はExtension統合テスト、WebviewのHoverと描画はPlaywrightで自動確認する。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strictとtraceability検査を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 不完全なDSL入力で誤解決 | Parserが受理した行だけを対象にし、未解決では結果を返さない |
| D-02 | import先変更の古い結果 | Provider要求時に解決器へ問い合わせ、変更テストで確認する |
| D-03 | カラム名の重複 | 表ごと・列ごとの型を保持し、複数表テストで確認する |

## Migration Plan

既存DSLと設定の移行は不要である。

## Open Questions

なし。
