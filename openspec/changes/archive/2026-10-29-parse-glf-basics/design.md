# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [glf-parsing](specs/glf-parsing/spec.md)。
- 前提と制約: [Coreの責務](../../../structure.md#core)と[テスト方針](../../../tech.md#テスト方針)に従う。

## Goals / Non-Goals

**Goals:**

- REQ-002からREQ-005の解析結果をCoreの公開APIから取得できるようにする。
- 入力の順序と行番号を保ち、表示属性を推論せず構造化する。

**Non-Goals:**

- Webview描画、VSCode診断、分岐経路の意味検証は後続変更で扱う。

## Decisions

### D-01 - 行とインデントに基づくIR

- 対象: REQ-002-S01、REQ-005-S01、REQ-005-S03。
- 選択: `parseGlf(source)`は文書メタデータ、宣言順のObject、順序付きイベント木、診断を返す。
各ノードは1始まりの行番号を持つ。
`alt`はcaseとelseの子イベントを持ち、活性操作はイベントとして保持する。
- 理由: 時間軸と入れ子構造を失わず、後続のLayoutが同じIRを使える。
- 代替案: 解析時に平坦化すると分岐の範囲を復元できないため採用しない。
- 配置と依存: `src/core/model/glf-model.ts`、`src/core/parser/parse-glf.ts`、`src/core/index.ts`。

### D-02 - 表示用データの明示的な属性

- 対象: REQ-003-S01、REQ-004-S01。
- 選択: DB参照はObject ID、任意のschema名、table名と元の文字列を保持する。
DBレコードのセル分割は引用符内のカンマを区切りとしない。
FILEノードはインデントで親子にし、各行の変更記号だけを属性へ変換する。
SQLは本文を改行で連結する。
- 理由: 描画時に操作の再解釈をせず、入力の値をそのまま使える。
- 代替案: 状態差分の計算は入力にない意味を追加するため採用しない。
- 配置と依存: `src/core/model/glf-model.ts`、`src/core/parser/parse-glf.ts`。

### D-03 - 診断と参照検証

- 対象: REQ-002-S02、REQ-005-S02。
- 選択: Parserは行単位の構文とインデントを診断し、ValidatorはObject参照と活性の閉じ忘れを診断する。
`Global`はメッセージの送信元だけで特別扱いする。
分岐内の活性は分岐ごとに複製した状態で検査し、分岐間の整合性判定は後続変更へ残す。
- 理由: 解析可能な部分のIRを返しながら、問題の位置を伝えられる。
- 代替案: 最初のエラーで例外にすると複数箇所の編集診断に利用しづらい。
- 配置と依存: `src/core/validator/validate-glf.ts`はモデルにのみ依存する。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-002 | REQ-002-S01 | [D-01](#d-01---行とインデントに基づくir) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`で基準DSL |
| REQ-002 | REQ-002-S02 | [D-03](#d-03---診断と参照検証) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`でtitle異常 |
| REQ-003 | REQ-003-S01 | [D-02](#d-02---表示用データの明示的な属性) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`でDB参照と属性 |
| REQ-004 | REQ-004-S01 | [D-02](#d-02---表示用データの明示的な属性) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`でFILEとSQL |
| REQ-005 | REQ-005-S01 | [D-01](#d-01---行とインデントに基づくir) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`で基準DSLの分岐 |
| REQ-005 | REQ-005-S02 | [D-03](#d-03---診断と参照検証) | `src/core/validator/validate-glf.ts` | `tests/core/parse-glf.test.ts`で異常入力 |
| REQ-005 | REQ-005-S03 | [D-01](#d-01---行とインデントに基づくir) | `src/core/parser/parse-glf.ts` | `tests/core/parse-glf.test.ts`で入れ子 |

## Verification Plan

- 正常、境界、異常: 全シナリオを`tests/core/parse-glf.test.ts`で検査する。
- 非機能要件: 今回追加しない。
- 手動確認: 解析結果はCore単体テストで観測できるため不要である。
- 全体検証: `npm run check`、`npm run test:visual`、`npx --no-install openspec validate parse-glf-basics --strict`、OpenSpec Verifyを実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 不正なインデントで子の所属を誤る | 行番号付き診断と入れ子テストを用意する |
| D-02 | 引用符内のカンマでDBセルが分割される | 引用符を考慮した分割をテストする |

## Migration Plan

既存のCore公開APIを保ったまま関数を追加する。
失敗時は新しいCoreファイルと公開exportを戻す。

## Open Questions

なし。
