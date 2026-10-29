# Proposal

## Why

設計者は基準DSLの処理順序と状態を記述できるが、現在のCoreは`.glf`を解析できない。
後続の描画と編集時診断が共通して利用できるIRを用意する。

## What Changes

- タイトル、Object、メッセージ、処理、活性操作を入力順に解析する。
- DBのschemaとstate、FILEのstate、SQLを表示用のIRに変換する。
- `alt`のcaseとelseの入れ子をIRに保持し、構文と参照の誤りを診断する。
- 既存のプレビュー表示はこの変更で切り替えない。

## Scope

**In scope:**

- [基準DSL](../2026-10-29-glitchflow-spec/input.md#基準dsl)と差分表現の例をCoreで解析する。
- タイトル位置、Object参照、インデント、活性操作の基本的な診断を返す。

**Out of scope:**

- 描画、VSCode Problemsへの通知、編集連動は後続変更で扱う。
- 分岐間の活性整合性と分岐の描画は`support-alt-fragment`で扱う。
- `opt`、`loop`、`par`、`break`は後続変更で扱う。

## Requirements

| 要件ID | 要件名 | 操作 | 根拠となる方針文書の節 | 台帳 |
| --- | --- | --- | --- | --- |
| REQ-002 | 文書メタデータと基本イベント | 追加 | [DSLの解析](../2026-10-29-glitchflow-spec/input.md#1-dslの解析) | [要件一覧](../../../traceability.md#要件一覧) |
| REQ-003 | DB参照と表示用状態 | 追加 | [StateとSQL](../2026-10-29-glitchflow-spec/input.md#3-stateとsqlの描画) | [要件一覧](../../../traceability.md#要件一覧) |
| REQ-004 | FILE状態とSQL | 追加 | [StateとSQL](../2026-10-29-glitchflow-spec/input.md#3-stateとsqlの描画) | [要件一覧](../../../traceability.md#要件一覧) |
| REQ-005 | 分岐構造と解析診断 | 追加 | [分岐と活性区間](../2026-10-29-glitchflow-spec/input.md#4-分岐と活性区間) | [要件一覧](../../../traceability.md#要件一覧) |

## Capabilities

### New Capabilities

- `glf-parsing`: `.glf`の構造と表示用データをIRと診断へ変換する(REQ-002からREQ-005)。

### Modified Capabilities

- なし。

## Examples

| 要件ID | 観点 | 状態と入力 | 契機 | 観測する結果 |
| --- | --- | --- | --- | --- |
| REQ-002 | 正常 | 基準DSLのtitle、Object、矢印、活性 | `parseGlf`を呼ぶ | [REQ-002-S01](specs/glf-parsing/spec.md#scenario-req-002-s01---基本イベントを入力順に保持する) |
| REQ-003 | 境界 | `DB.users`と`DB.public.users` | `parseGlf`を呼ぶ | [REQ-003-S01](specs/glf-parsing/spec.md#scenario-req-003-s01---db参照と変更属性を保持する) |
| REQ-004 | 境界 | FILEの親子とSQL | `parseGlf`を呼ぶ | [REQ-004-S01](specs/glf-parsing/spec.md#scenario-req-004-s01---file階層とsqlを保持する) |
| REQ-005 | 異常 | 未宣言Objectと不正インデント | `parseGlf`を呼ぶ | [REQ-005-S02](specs/glf-parsing/spec.md#scenario-req-005-s02---誤った構文と参照を診断する) |

## Impact

- 実装と配置: `src/core/model`、`parser`、`validator`、公開APIを追加する。
- 互換性とデータ: 既存のプレビューと`examples/login.glf`は変更しない。
- 依存関係と文書: 新規パッケージなし。Coreテスト、台帳を更新する。

## Open Questions

- なし。

## Readiness

- 計画の状態: 合意済み。
- 合意の根拠: 2026-10-29のユーザー指示で`parse-glf-basics`の設計、実装、Verifyが指定された。
- 実装を妨げる未決事項: なし。
