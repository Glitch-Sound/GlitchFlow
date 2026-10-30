# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [dsl-completion](specs/dsl-completion/spec.md)。
- 前提と制約: [Core構成](../../../tech.md#アーキテクチャ)と[既存Parser](../../../../src/core/parser/parse-glf.ts)を使う。

## Goals / Non-Goals

**Goals:**

- REQ-029からREQ-031の補完をVSCode標準APIで提供する。

**Non-Goals:**

- SQL言語の解析やLanguage Serverの導入は対象外である。

## Decisions

### D-01 - 解析済み定義と行文脈を組み合わせる

- 対象: REQ-029-S01、REQ-030-S01、REQ-031-S01、REQ-031-S02。
- 選択: `parseGlf`のObjectとschemaを文書版ごとにキャッシュする。
- 選択: 現在行の接頭辞と、直近の低いインデントの祖先行で補完文脈を選ぶ。
- 理由: 定義解析を重複実装せず、未完成の現在行に依存しない候補を出せる。
- 代替案: 全文の補完専用Parserは文法の二重管理になるため採用しない。
- 配置と依存: `src/extension/completion.ts`からCoreの`parseGlf`を参照し、`extension.ts`でProviderを登録する。

### D-02 - 明示的な挿入範囲とSnippet

- 対象: REQ-029-S01、REQ-030-S01。
- 選択: `CompletionItem`と`SnippetString`で候補、説明、置換範囲を設定する。
- 理由: 接頭辞を重複させず、定型構文の編集箇所へ移動できる。
- 代替案: 独自Webviewの補完UIは標準操作から外れるため採用しない。
- 配置と依存: VSCode標準補完APIのみを利用する。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-029 | REQ-029-S01 | [D-02](#d-02---明示的な挿入範囲とsnippet) | `src/extension/completion.ts` | `tests/extension/completion.test.ts`で候補とSnippetを検査 |
| REQ-030 | REQ-030-S01 | [D-01](#d-01---解析済み定義と行文脈を組み合わせる) | `src/extension/completion.ts` | 同テストで参照形式と型別候補を検査 |
| REQ-031 | REQ-031-S01 | [D-01](#d-01---解析済み定義と行文脈を組み合わせる) | `src/extension/completion.ts` | 同テストでブロック別候補を検査 |
| REQ-031 | REQ-031-S02 | [D-01](#d-01---解析済み定義と行文脈を組み合わせる) | `src/extension/completion.ts` | 同テストで不正行との共存を検査 |

## Verification Plan

- 正常、境界、異常: VSCode Extension Test APIで全4シナリオを検査する。
- 非機能要件: 文書版キャッシュを使い、入力ごとに複数回の解析を行わないことをコードで確認する。
- 手動確認: 補完UIの説明とSnippetのタブ移動をVSCodeで確認し、結果をverification.mdに記す。
- 全体検証: `npm run check`、`npm run test:extension`、OpenSpec strict検証を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 未完成の親ブロックでは文脈が曖昧になる | 明確に認識できる祖先のみで絞り、テストする |
| D-01 | 大きなファイルで解析が重くなる | 文書版キャッシュを用い、閉鎖時に破棄する |

## Migration Plan

既存DSLと設定の移行は不要である。

## Open Questions

なし。
