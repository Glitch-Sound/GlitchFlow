# 要件のトレーサビリティ

この台帳で、要件IDの採番と各成果物の対応関係を管理する。
採番、参照、実績の扱いは [config.yaml](config.yaml) を参照する。
ここでは台帳の状態と記録形式を定義する。

## 要件一覧

状態は `提案中`、`確定`、`実装済み`、`却下`、`廃止` で管理する。
`確定` は要件と受け入れ条件への合意を記録した状態を表す。
実装済みとするには、すべての受け入れ条件の検証結果が必要となる。
既存要件への変更提案がある場合は、現在の正式仕様の状態を保持し、変更の状態を次の履歴へ記録する。
新規要件の却下は `却下`、正式要件の撤回は `廃止` とする。

| 要件ID | 要件名 | 状態 | 根拠となる文書の節 | 現在の仕様 |
| --- | --- | --- | --- | --- |
| REQ-001 | プレビューの起動 | 実装済み | [対象機能](product.md#対象機能) | [正式仕様](specs/preview/spec.md#requirement-req-001---プレビューの起動) |
| REQ-002 | 文書メタデータと基本イベント | 実装済み | [DSL](product.md#dslと編集) | [変更仕様](specs/glf-parsing/spec.md) |
| REQ-003 | DB参照と表示用状態 | 実装済み | [State](product.md#対象機能) | [変更仕様](specs/glf-parsing/spec.md) |
| REQ-004 | FILE状態とSQL | 実装済み | [State](product.md#対象機能) | [変更仕様](specs/glf-parsing/spec.md) |
| REQ-005 | 分岐構造と解析診断 | 実装済み | [DSL](product.md#dslと編集) | [変更仕様](specs/glf-parsing/spec.md) |
| REQ-006 | 基本シーケンス配置 | 実装済み | [レイアウト](tech.md#レイアウトと描画) | [正式仕様](specs/sequence-rendering/spec.md#requirement-req-006---基本シーケンス配置) |
| REQ-007 | メッセージの表現 | 実装済み | [対象機能](product.md#対象機能) | [正式仕様](specs/sequence-rendering/spec.md#requirement-req-007---メッセージの表現) |
| REQ-008 | 活性と処理の表現 | 実装済み | [設計上の優先事項](product.md#設計上の優先事項) | [正式仕様](specs/sequence-rendering/spec.md#requirement-req-008---活性と処理の表現) |
| REQ-009 | DB状態の描画 | 実装済み | [データ状態](product.md#データ状態) | [正式仕様](specs/state-rendering/spec.md#requirement-req-009---db状態の描画) |
| REQ-010 | FILE状態の描画 | 実装済み | [データ状態](product.md#データ状態) | [正式仕様](specs/state-rendering/spec.md#requirement-req-010---file状態の描画) |
| REQ-011 | SQLの描画と状態配置 | 実装済み | [レイアウト](tech.md#レイアウトと描画) | [正式仕様](specs/state-rendering/spec.md#requirement-req-011---sqlの描画と状態配置) |
| REQ-012 | alt分岐の描画 | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/alt-fragment/spec.md#requirement-req-012---alt分岐の描画) |
| REQ-013 | 分岐の活性整合性 | 実装済み | [設計上の優先事項](product.md#設計上の優先事項) | [正式仕様](specs/alt-fragment/spec.md#requirement-req-013---分岐の活性整合性) |
| REQ-014 | 編集連動プレビュー | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/editor-integration/spec.md#requirement-req-014---編集連動プレビュー) |
| REQ-015 | Problems診断 | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/editor-integration/spec.md#requirement-req-015---problems診断) |
| REQ-016 | DSL構文配色 | 実装済み | [DSLエディタの配色](product.md#dslエディタの配色) | [正式仕様](specs/editor-integration/spec.md#requirement-req-016---dsl構文配色) |
| REQ-017 | プレビュー操作 | 実装済み | [設計上の優先事項](product.md#設計上の優先事項) | [正式仕様](specs/editor-integration/spec.md#requirement-req-017---プレビュー操作) |
| NREQ-001 | 編集応答時間 | 実装済み | [構文と安全性](tech.md#構文と安全性) | [正式仕様](specs/editor-integration/spec.md#requirement-nreq-001---編集応答時間) |

## 要件ごとの変更履歴

変更と要件の組み合わせごとに行を追加する。
変更の状態は `提案中`、`計画確定`、`検証済み`、`アーカイブ済み`、`却下` とする。
計画確定の根拠は提案に記録し、変更が却下されても既存要件の状態を却下へ変更しない。
後続の変更で以前の履歴を上書きしない。
成果物の欄には、提案、設計、タスクへのリンクをまとめる。

| 変更名 | 要件ID | 操作 | 変更の状態 | 対象仕様 | 提案、設計、タスク |
| --- | --- | --- | --- | --- | --- |
| glitchflow-spec | REQ-001 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-glitchflow-spec/specs/preview/spec.md#requirement-req-001---プレビューの起動) | [提案](changes/archive/2026-10-29-glitchflow-spec/proposal.md)、[設計](changes/archive/2026-10-29-glitchflow-spec/design.md)、[タスク](changes/archive/2026-10-29-glitchflow-spec/tasks.md) |
| parse-glf-basics | REQ-002 | 追加 | アーカイブ済み | [変更仕様](specs/glf-parsing/spec.md#requirement-req-002---文書メタデータと基本イベント) | [提案](changes/archive/2026-10-29-parse-glf-basics/proposal.md)、[設計](changes/archive/2026-10-29-parse-glf-basics/design.md)、[タスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md) |
| parse-glf-basics | REQ-003 | 追加 | アーカイブ済み | [変更仕様](specs/glf-parsing/spec.md#requirement-req-003---db参照と表示用状態) | [提案](changes/archive/2026-10-29-parse-glf-basics/proposal.md)、[設計](changes/archive/2026-10-29-parse-glf-basics/design.md)、[タスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md) |
| parse-glf-basics | REQ-004 | 追加 | アーカイブ済み | [変更仕様](specs/glf-parsing/spec.md#requirement-req-004---file状態とsql) | [提案](changes/archive/2026-10-29-parse-glf-basics/proposal.md)、[設計](changes/archive/2026-10-29-parse-glf-basics/design.md)、[タスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md) |
| parse-glf-basics | REQ-005 | 追加 | アーカイブ済み | [変更仕様](specs/glf-parsing/spec.md#requirement-req-005---分岐構造と解析診断) | [提案](changes/archive/2026-10-29-parse-glf-basics/proposal.md)、[設計](changes/archive/2026-10-29-parse-glf-basics/design.md)、[タスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md) |
| render-sequence | REQ-001 | 変更 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-sequence/specs/preview/spec.md#requirement-req-001---プレビューの起動) | [提案](changes/archive/2026-10-29-render-sequence/proposal.md)、[設計](changes/archive/2026-10-29-render-sequence/design.md)、[タスク](changes/archive/2026-10-29-render-sequence/tasks.md) |
| render-sequence | REQ-006 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#requirement-req-006---基本シーケンス配置) | [提案](changes/archive/2026-10-29-render-sequence/proposal.md)、[設計](changes/archive/2026-10-29-render-sequence/design.md)、[タスク](changes/archive/2026-10-29-render-sequence/tasks.md) |
| render-sequence | REQ-007 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#requirement-req-007---メッセージの表現) | [提案](changes/archive/2026-10-29-render-sequence/proposal.md)、[設計](changes/archive/2026-10-29-render-sequence/design.md)、[タスク](changes/archive/2026-10-29-render-sequence/tasks.md) |
| render-sequence | REQ-008 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#requirement-req-008---活性と処理の表現) | [提案](changes/archive/2026-10-29-render-sequence/proposal.md)、[設計](changes/archive/2026-10-29-render-sequence/design.md)、[タスク](changes/archive/2026-10-29-render-sequence/tasks.md) |
| render-state-and-sql | REQ-009 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#requirement-req-009---db状態の描画) | [提案](changes/archive/2026-10-29-render-state-and-sql/proposal.md)、[設計](changes/archive/2026-10-29-render-state-and-sql/design.md)、[タスク](changes/archive/2026-10-29-render-state-and-sql/tasks.md) |
| render-state-and-sql | REQ-010 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#requirement-req-010---file状態の描画) | [提案](changes/archive/2026-10-29-render-state-and-sql/proposal.md)、[設計](changes/archive/2026-10-29-render-state-and-sql/design.md)、[タスク](changes/archive/2026-10-29-render-state-and-sql/tasks.md) |
| render-state-and-sql | REQ-011 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#requirement-req-011---sqlの描画と状態配置) | [提案](changes/archive/2026-10-29-render-state-and-sql/proposal.md)、[設計](changes/archive/2026-10-29-render-state-and-sql/design.md)、[タスク](changes/archive/2026-10-29-render-state-and-sql/tasks.md) |
| support-alt-fragment | REQ-012 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#requirement-req-012---alt分岐の描画) | [提案](changes/archive/2026-10-29-support-alt-fragment/proposal.md)、[設計](changes/archive/2026-10-29-support-alt-fragment/design.md)、[タスク](changes/archive/2026-10-29-support-alt-fragment/tasks.md) |
| support-alt-fragment | REQ-013 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#requirement-req-013---分岐の活性整合性) | [提案](changes/archive/2026-10-29-support-alt-fragment/proposal.md)、[設計](changes/archive/2026-10-29-support-alt-fragment/design.md)、[タスク](changes/archive/2026-10-29-support-alt-fragment/tasks.md) |
| integrate-glf-editor | REQ-014 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-014---編集連動プレビュー) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-015 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-015---problems診断) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-016 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-016---dsl構文配色) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-017 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-017---プレビュー操作) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | NREQ-001 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-nreq-001---編集応答時間) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |

## シナリオと検証の対応

受け入れシナリオごとに行を追加する。
実装とテストは、ファイルへのリンクに加えて関数名やテスト名で特定する。
検証結果には実行記録へのリンクを置き、次の"検証記録"で詳細を管理する。
変更や再検証が発生した場合は履歴を追加し、過去の結果を消さない。

| 変更名 | 要件IDとシナリオID | 受け入れ条件 | 実装箇所 | テストまたは手動確認 | 検証記録 |
| --- | --- | --- | --- | --- | --- |
| glitchflow-spec | REQ-001 / REQ-001-S01 | [シナリオ](changes/archive/2026-10-29-glitchflow-spec/specs/preview/spec.md#scenario-req-001-s01---glfファイルを開いてプレビューを起動する) | [コマンド登録](../src/extension/extension.ts) `activate`、[パネルとCSP](../src/extension/preview-panel.ts) `openPreview`、[初期画面](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Extension統合テスト](../tests/extension/preview.test.ts) `REQ-001 / REQ-001-S01`、[Chromium描画テスト](../tests/visual/preview.spec.ts) `REQ-001 / REQ-001-S01`、Development Host手動確認 | [プレビュー確認](#glitchflow-spec---2026-10-29-プレビュー確認) |
| parse-glf-basics | REQ-002 / REQ-002-S01 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-002-s01---基本イベントを入力順に保持する) | [IR](../src/core/model/glf-model.ts)、[Parser](../src/core/parser/parse-glf.ts) `parseGlf` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-002 / REQ-002-S01` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-002 / REQ-002-S02 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-002-s02---タイトルの誤用を診断する) | [Parser](../src/core/parser/parse-glf.ts) `parseGlf` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-002 / REQ-002-S02` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-003 / REQ-003-S01 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-003-s01---db参照と変更属性を保持する) | [Parser](../src/core/parser/parse-glf.ts) `tableReference`、`splitCells` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-003 / REQ-003-S01` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-004 / REQ-004-S01 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-004-s01---file階層とsqlを保持する) | [Parser](../src/core/parser/parse-glf.ts) `parseFileNodes` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-004 / REQ-004-S01` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-005 / REQ-005-S01 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-005-s01---分岐内イベントを保持する) | [Parser](../src/core/parser/parse-glf.ts) `parseGlf` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-005 / REQ-005-S01` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-005 / REQ-005-S02 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-005-s02---誤った構文と参照を診断する) | [Validator](../src/core/validator/validate-glf.ts) `validateGlf` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-005 / REQ-005-S02` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| parse-glf-basics | REQ-005 / REQ-005-S03 | [シナリオ](specs/glf-parsing/spec.md#scenario-req-005-s03---入れ子分岐を保持する) | [Parser](../src/core/parser/parse-glf.ts) `parseGlf` | [Coreテスト](../tests/core/parse-glf.test.ts) `REQ-005 / REQ-005-S03` | [Core解析](#parse-glf-basics---2026-10-29-core解析) |
| render-sequence | REQ-001 / REQ-001-S01 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/preview/spec.md#scenario-req-001-s01---glfファイルを開いてプレビューを起動する) | [起動通信](../src/extension/preview-panel.ts) `openPreview`、[画面](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Extension](../tests/extension/preview.test.ts)、[Chromium](../tests/visual/preview.spec.ts) | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-sequence | REQ-006 / REQ-006-S01 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#scenario-req-006-s01---宣言順と時間順に配置する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/sequence-layout.test.ts) `REQ-006 / REQ-006-S01` | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-sequence | REQ-007 / REQ-007-S01 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#scenario-req-007-s01---矢印種別とglobal起点を表示する) | [画面](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Chromium](../tests/visual/sequence.spec.ts) `REQ-007 / REQ-007-S01` | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-sequence | REQ-007 / REQ-007-S02 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#scenario-req-007-s02---応答なしの同期要求を表示する) | [レイアウト](../src/core/layout/sequence-layout.ts)、[画面](../src/webview/pages/preview/ui/render-preview.ts) | [Core](../tests/core/sequence-layout.test.ts)、[Chromium](../tests/visual/sequence.spec.ts) `REQ-007 / REQ-007-S02` | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-sequence | REQ-008 / REQ-008-S01 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#scenario-req-008-s01---活性と処理を表示する) | [レイアウト](../src/core/layout/sequence-layout.ts)、[画面](../src/webview/pages/preview/ui/render-preview.ts) | [Core](../tests/core/sequence-layout.test.ts)、[Chromium](../tests/visual/sequence.spec.ts) `REQ-008 / REQ-008-S01` | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-sequence | REQ-008 / REQ-008-S02 | [シナリオ](changes/archive/2026-10-29-render-sequence/specs/sequence-rendering/spec.md#scenario-req-008-s02---構文エラーを含む文書の描画) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/sequence-layout.test.ts) `REQ-008 / REQ-008-S02` | [描画検証](#render-sequence---2026-10-29-描画検証) |
| render-state-and-sql | REQ-009 / REQ-009-S01 | [シナリオ](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#scenario-req-009-s01---全カラムを表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState` | [Core](../tests/core/state-layout.test.ts)、[Chromium](../tests/visual/state.spec.ts) `REQ-009-S01` | [検証記録](#render-state-and-sql---2026-10-29-描画検証) |
| render-state-and-sql | REQ-009 / REQ-009-S02 | [シナリオ](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#scenario-req-009-s02---変更属性を表示する) | [描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState`、[CSS](../src/webview/app/styles.css) | [Chromium](../tests/visual/state.spec.ts) `REQ-009-S02` | [検証記録](#render-state-and-sql---2026-10-29-描画検証) |
| render-state-and-sql | REQ-010 / REQ-010-S01 | [シナリオ](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#scenario-req-010-s01---階層と個別の変更属性を表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState` | [Core](../tests/core/state-layout.test.ts)、[Chromium](../tests/visual/state.spec.ts) `REQ-010-S01` | [検証記録](#render-state-and-sql---2026-10-29-描画検証) |
| render-state-and-sql | REQ-011 / REQ-011-S01 | [シナリオ](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#scenario-req-011-s01---sqlをstateの下に表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState` | [Core](../tests/core/state-layout.test.ts)、[Chromium](../tests/visual/state.spec.ts) `REQ-011-S01` | [検証記録](#render-state-and-sql---2026-10-29-描画検証) |
| render-state-and-sql | REQ-011 / REQ-011-S02 | [シナリオ](changes/archive/2026-10-29-render-state-and-sql/specs/state-rendering/spec.md#scenario-req-011-s02---指定位置だけに表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/state-layout.test.ts) `REQ-011-S02` | [検証記録](#render-state-and-sql---2026-10-29-描画検証) |
| support-alt-fragment | REQ-012 / REQ-012-S01 | [シナリオ](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#scenario-req-012-s01---ログインの成功と失敗を描画する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Core](../tests/core/alt-layout.test.ts)、[Chromium](../tests/visual/alt.spec.ts) | [検証記録](#support-alt-fragment---2026-10-29-描画検証) |
| support-alt-fragment | REQ-012 / REQ-012-S02 | [シナリオ](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#scenario-req-012-s02---入れ子の分岐を描画する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/alt-layout.test.ts) | [検証記録](#support-alt-fragment---2026-10-29-描画検証) |
| support-alt-fragment | REQ-013 / REQ-013-S01 | [シナリオ](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#scenario-req-013-s01---分岐ごとに活性を終了する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/alt-layout.test.ts)、[Chromium](../tests/visual/alt.spec.ts) | [検証記録](#support-alt-fragment---2026-10-29-描画検証) |
| support-alt-fragment | REQ-013 / REQ-013-S02 | [シナリオ](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#scenario-req-013-s02---活性状態の不一致を診断する) | [Validator](../src/core/validator/validate-glf.ts) `validateGlf` | [Core](../tests/core/alt-layout.test.ts) | [検証記録](#support-alt-fragment---2026-10-29-描画検証) |
| integrate-glf-editor | REQ-014 / REQ-014-S01 | [シナリオ](specs/editor-integration/spec.md#scenario-req-014-s01---編集結果を表示する) | [購読](../src/extension/extension.ts) `activate`、[通信](../src/extension/preview-panel.ts) `updatePreview` | [Extension](../tests/extension/preview.test.ts)、[Chromium](../tests/visual/editor.spec.ts) | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | REQ-014 / REQ-014-S02 | [シナリオ](specs/editor-integration/spec.md#scenario-req-014-s02---編集中の図を保持する) | [通信](../src/extension/preview-panel.ts) `updatePreview` | [Extension](../tests/extension/preview.test.ts) | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | REQ-015 / REQ-015-S01 | [シナリオ](specs/editor-integration/spec.md#scenario-req-015-s01---診断を表示して解消する) | [診断](../src/extension/diagnostics.ts) `diagnoseDocument` | [Extension](../tests/extension/diagnostics.test.ts) | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | REQ-016 / REQ-016-S01 | [シナリオ](specs/editor-integration/spec.md#scenario-req-016-s01---配色を切り替える) | [Grammar](../syntaxes/glf.tmLanguage.json)、[装飾](../src/extension/syntax-colors.ts) `registerSyntaxColors` | [Extension](../tests/extension/syntax-colors.test.ts)、Development Host手動確認 | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | REQ-016 / REQ-016-S02 | [シナリオ](specs/editor-integration/spec.md#scenario-req-016-s02---ライトテーマで読める) | [装飾](../src/extension/syntax-colors.ts) `registerSyntaxColors` | Development Hostでライト・ダーク両テーマを目視確認 | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | REQ-017 / REQ-017-S01 | [シナリオ](specs/editor-integration/spec.md#scenario-req-017-s01---図の全体を確認する) | [倍率](../src/webview/pages/preview/model/zoom.ts)、[画面](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Chromium](../tests/visual/editor.spec.ts) | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |
| integrate-glf-editor | NREQ-001 / NREQ-001-S01 | [シナリオ](specs/editor-integration/spec.md#scenario-nreq-001-s01---編集応答時間を測る) | [更新](../src/extension/extension.ts) `activate`、[描画通知](../src/webview/app/main.ts) | [Extension](../tests/extension/preview.test.ts) | [検証記録](#integrate-glf-editor---2026-10-29-編集連携) |

## 検証記録

### integrate-glf-editor - 2026-10-29 編集連携

- 対象: REQ-014からREQ-017、NREQ-001、全7シナリオ。
- 実行日: 2026-10-29 (Asia/Tokyo)。
- 対象の版: `integrate-glf-editor`の作業差分。
- 方法: `npm run check`、`npm run test:visual`、`npm run test:extension`、Development Hostの配色切替。
- 結果: Core 21件、Chromium 9件、Extension 4件が成功した。
  `examples/login.glf`のタイトル1文字編集からWebview描画通知までは157 msであった。
  ダークとライト両テーマで専用配色の文字列、キーワード、記号を目視でき、設定を`theme`へ戻した。
  拡大後の右下端スクロールをChromiumで確認した。
- 証跡: [Extensionテスト](../tests/extension/preview.test.ts)、[Chromiumテスト](../tests/visual/editor.spec.ts)、[描画画像](../docs/images/integrate-glf-editor.png)、[Verify報告](changes/archive/2026-10-29-integrate-glf-editor/verification.md)。
- 未検証事項: なし。

### support-alt-fragment - 2026-10-29 アーカイブ

- 対象: REQ-012、REQ-013。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `alt-fragment`のREQ-012とREQ-013を正式仕様へ同期した。
  差分仕様と正式仕様のPurpose、要件、4シナリオを照合し、`npx --no-install openspec validate --specs`で正式仕様5件を検証した。
  変更を`changes/archive/2026-10-29-support-alt-fragment/`へ移し、台帳の参照を更新した。
- 結果: 2要件と4シナリオが一致し、正式仕様5件の検証が成功した。
- 証跡: [正式仕様](specs/alt-fragment/spec.md)、[アーカイブ](changes/archive/2026-10-29-support-alt-fragment/proposal.md)。
- 未検証事項: なし。

### support-alt-fragment - 2026-10-29 描画検証

- 対象: REQ-012-S01、REQ-012-S02、REQ-013-S01、REQ-013-S02。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run check`、`npm run test:visual`、`npx --no-install openspec validate support-alt-fragment --strict`、`git diff --check`を実行した。
  CLIに`verify`コマンドがないため、`openspec-verify-change`の3観点で手動照合する。
- 結果: Coreの21件、Chromiumの7件、Biome、Steiger、型検査、OpenSpec strict検証が成功した。
  Chromium画像で両分岐の枠、ラベル、イベント、活性区間を確認した。
- 証跡: [Coreテスト](../tests/core/alt-layout.test.ts)、[描画テスト](../tests/visual/alt.spec.ts)、[Verify報告](changes/archive/2026-10-29-support-alt-fragment/verification.md)、`test-results/render-alt.png`、`test-results/render-alt-right.png`。
- 未検証事項: なし。

### render-state-and-sql - 2026-10-29 描画検証

- 対象: REQ-009-S01、REQ-009-S02、REQ-010-S01、REQ-011-S01、REQ-011-S02。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run check`、`npm run test:visual`、`npx --no-install openspec validate render-state-and-sql --strict`、`git diff --check`を実行した。
  CLIに`verify`コマンドがないため、`openspec-verify-change`の3観点で手動照合した。
- 結果: Coreの18件、Chromiumの6件、Biome、Steiger、型検査、OpenSpec strict検証が成功した。
  Chromium画像でDBの5カラムと全値、FILE階層、SQL枠と変更属性を確認した。
  日時の値が隣のセルへはみ出す問題を修正し、文字の境界検査が成功した。
- 証跡: [Coreテスト](../tests/core/state-layout.test.ts)、[描画テスト](../tests/visual/state.spec.ts)、[Verify報告](changes/archive/2026-10-29-render-state-and-sql/verification.md)、`test-results/render-state-five-columns.png`、`test-results/render-state-and-sql.png`。
- 未検証事項: `alt`内の状態描画は次の変更の範囲である。

### render-state-and-sql - 2026-10-29 アーカイブ

- 対象: REQ-009、REQ-010、REQ-011。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `state-rendering`のREQ-009からREQ-011を正式仕様へ同期した。
  差分仕様と同期後の要件本文・シナリオを照合し、`npx --no-install openspec validate --specs`で正式仕様4件を検証した。
  変更を`changes/archive/2026-10-29-render-state-and-sql/`へ移し、台帳の参照を更新した。
- 結果: 3要件と5シナリオが一致し、正式仕様4件の検証が成功した。
- 証跡: [正式仕様](specs/state-rendering/spec.md)、[アーカイブ](changes/archive/2026-10-29-render-state-and-sql/proposal.md)。
- 未検証事項: なし。

### render-sequence - 2026-10-29 描画検証

- 対象: REQ-001-S01、REQ-006-S01、REQ-007-S01、REQ-007-S02、REQ-008-S01、REQ-008-S02。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate render-sequence --strict`、`git diff --check`を実行した。
  CLIに`verify`コマンドがないため、`openspec-verify-change`の3観点で手動照合した。
- 結果: Coreの14件、Chromiumの3件、Extensionの1件が成功した。
  Chromiumのスクリーンショットを目視し、文字の切れ、矢印と活性バーの接続、活性終了位置を確認した。
- 証跡: [Coreテスト](../tests/core/sequence-layout.test.ts)、[描画テスト](../tests/visual/sequence.spec.ts)、[プレビューテスト](../tests/visual/preview.spec.ts)、[Verify報告](changes/archive/2026-10-29-render-sequence/verification.md)、`test-results/render-sequence.png`。
- 未検証事項: State、SQL、altの描画は後続変更の範囲である。

### render-sequence - 2026-10-29 アーカイブ

- 対象: REQ-001、REQ-006、REQ-007、REQ-008。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `preview`のREQ-001を変更し、`sequence-rendering`のREQ-006からREQ-008を正式仕様へ同期した。
  `npx --no-install openspec validate --specs`で3件の正式仕様を検証し、差分仕様と同期後の要件本文を照合した。
- 結果: 3件の正式仕様が成功し、差分の適用漏れはない。
  `preview`のPurposeは旧初期段階の「図面を描画しない」という記述が現行要件と矛盾するため、正式仕様上で直接更新した。
  [変更成果物](changes/archive/2026-10-29-render-sequence/proposal.md)をアーカイブへ移し、台帳の仕様と成果物への参照を更新した。
- 証跡: [preview正式仕様](specs/preview/spec.md)、[sequence-rendering正式仕様](specs/sequence-rendering/spec.md)、[Verify報告](changes/archive/2026-10-29-render-sequence/verification.md)。
- 未検証事項: なし。

### parse-glf-basics - 2026-10-29 Core解析

- 対象: REQ-002からREQ-005の全7シナリオ。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 受け入れテストを先に作成し、未実装による7件の失敗を確認した。
`npm run check`でBiome、Steiger、型検査、Coreテストを実行し、`npm run test:visual`で既存プレビューをChromiumで検査した。
- 結果: Coreの9件と描画の1件が成功した。
CoreからExtensionとWebviewへの依存はない。
- 証跡: [Coreテスト](../tests/core/parse-glf.test.ts)、[既存描画テスト](../tests/visual/preview.spec.ts)。
- 未検証事項: 分岐間の活性整合性と描画、VSCodeへの診断通知は後続変更の対象である。

### parse-glf-basics - 2026-10-29 OpenSpec照合

- 対象: REQ-002からREQ-005、7シナリオ、D-01からD-03、タスク9件。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npx --no-install openspec validate parse-glf-basics --strict`を実行した。
CLIには`verify`コマンドがないため、`openspec-verify-change`のCompleteness、Correctness、Coherenceに沿って差分仕様、設計、タスク、コード、テスト、台帳を手動照合した。
- 結果: strict検証が成功した。
タスク9/9、追加要件4/4、シナリオ7/7の実装とテストを確認した。
設計の責務分担と新規コードの配置に不一致はなく、重大・警告事項はない。
- 証跡: [変更仕様](specs/glf-parsing/spec.md)、[設計](changes/archive/2026-10-29-parse-glf-basics/design.md)、[タスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md)、[Coreテスト](../tests/core/parse-glf.test.ts)。
- 未検証事項: 描画、VSCodeへの診断通知、分岐間の活性整合性は今回の仕様対象外である。

### parse-glf-basics - 2026-10-29 アーカイブ

- 対象: REQ-002からREQ-005。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 差分仕様を[正式仕様](specs/glf-parsing/spec.md)へ同期し、`npx --no-install openspec validate --specs`で検証した。
差分仕様との要件とシナリオの一致を確認してから、変更を[アーカイブ](changes/archive/2026-10-29-parse-glf-basics/proposal.md)へ移した。
- 結果: 新しい正式仕様に4要件と7シナリオが反映された。
正式仕様2件の検証が成功し、台帳と変更成果物のリンクを更新した。
- 証跡: [正式仕様](specs/glf-parsing/spec.md)、[アーカイブ済みタスク](changes/archive/2026-10-29-parse-glf-basics/tasks.md)。
- 未検証事項: なし。

変更ごと、実行ごとに見出しを作り、以下を記録する。
同じ実行結果を複数のシナリオから参照できる。

### glitchflow-spec - 2026-10-29 Core基盤

- 対象: [D-01](changes/archive/2026-10-29-glitchflow-spec/design.md#d-01---実行環境を分けた最小ビルド)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: Node.js v24.18.0、npm 11.16.0で`npm install`、`npm run build`、`npm run typecheck`、`npm run test`を実行した。
- 結果: 依存関係の導入、ExtensionとWebviewのビルド、型検査、Coreの1テストが成功した。
- 証跡: [Coreテスト](../tests/core/file-name.test.ts)、[ビルド設定](../vite.config.ts)、[Extensionビルド設定](../esbuild.mjs)。
- 未検証事項: VSCode上のコマンドとWebview表示は後続タスクで検証する。

### glitchflow-spec - 2026-10-29 プレビュー確認

- 対象: REQ-001 / REQ-001-S01。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run test:extension`で`.glf`を開いたコマンド実行とWebviewタブ生成、`npm run test:visual`でChromiumの初期画面を検査した。VS Codeで `.vscode/launch.json` の構成からF5を実行し、Extension Development Hostで`examples/login.glf`を開いた。コマンドパレットから`GlitchFlow: プレビューを開く`を実行し、Webview Developer ToolsのConsoleで`Content Security Policy`を検索した。
- 結果: 統合テスト1件と描画テスト1件が成功。開発ホスト内のWebviewに`GlitchFlow Preview`のh1が表示され、図面は表示されなかった。CSP違反メッセージは検索結果0件。開発ホスト全体のConsoleにはほかの拡張機能やVS Code由来の警告・エラーがあり、コンソール全体が無エラーという意味ではない。
- 証跡: [統合テスト](../tests/extension/preview.test.ts)、[描画テスト](../tests/visual/preview.spec.ts)、[開発ホスト設定](../.vscode/launch.json)。
- 未検証事項: 当時はGitHub Actions上でのExtension統合テストが未実施。後の撤去判断により、この変更の検証対象から外した。

### glitchflow-spec - 2026-10-29 CI相当の検査

- 対象: [D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 当初は`.github/workflows/ci.yml`にNode.js 24、`npm ci`、Chromium導入、`npm run check`、`npm run test:visual`を設定した。同じ2つの検査コマンドをローカルのmacOSで実行した。Extension統合テストは別途ローカルで実行した。このワークフローは後述の判断で撤去した。
- 結果: `npm run check`はBiome、Steiger、型検査、Core単体テストの全てが成功。`npm run test:visual`はChromiumで1件成功。`npm run test:extension`はローカルで1件成功。GitHub Actionsの実行結果は未実施のため不明であり、Linux CIでExtension統合テストが実行できるかも未検証。当初のCIにはExtension統合テストを含めていなかった。
- 証跡: [Coreテスト](../tests/core/file-name.test.ts)、[描画テスト](../tests/visual/preview.spec.ts)、[統合テスト](../tests/extension/preview.test.ts)。
- 未検証事項: 当時はpushまたはPR後にGitHub Actionsを実行する予定だった。後の撤去判断により、この予定は取り消した。Extension統合テストのCI実行可否は、CIサービスの導入時に確認する。

### glitchflow-spec - 2026-10-29 開発手順と基準入力

- 対象: [D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)、[D-04](changes/archive/2026-10-29-glitchflow-spec/design.md#d-04---初期画面と基準dslの検証)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: [README](../README.md)の`npm install`、`npx --no-install lefthook install`、`npm run build`、F5でのExtension Development Host起動、`npm run check`、`npx --no-install playwright install chromium`、`npm run test:visual`、`npm run test:extension`を実行した。[入力資料](changes/archive/2026-10-29-glitchflow-spec/input.md#基準dsl)の最初のDSLコードブロックと[examples/login.glf](../examples/login.glf)をUTF-8で読み、バイト相当の文字列一致を確認した。
- 結果: 依存導入、Gitフック設置、両ビルド、開発ホスト起動、各検査とテストが成功。基準DSLは59行で原文と一致した。Lefthookは一時的な構文エラーで終了コード1、正常ファイルで終了コード0となり、コミット中断を確認した。
- 証跡: [README](../README.md)、[基準DSL](../examples/login.glf)、[フック設定](../lefthook.yml)、[開発ホスト設定](../.vscode/launch.json)。
- 未検証事項: 当時はGitHub Actions上での実行結果が未確認。後の撤去判断により、この変更の検証対象から外した。

### glitchflow-spec - 2026-10-29 差分レビュー

- 対象: [D-01](changes/archive/2026-10-29-glitchflow-spec/design.md#d-01---実行環境を分けた最小ビルド)、[D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)、[D-04](changes/archive/2026-10-29-glitchflow-spec/design.md#d-04---初期画面と基準dslの検証)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `git diff --check`、ビルド設定とimportの読み合わせ、Lefthookの正常・異常入力、CIコマンドのローカル実行、基準DSLとREADMEの照合を行った。
- 成功: `npm run build`でExtensionのCommonJSとWebviewの静的資産が別々に生成される。Coreの公開APIはVS Code、DOM、Viteを参照しない。LefthookはBiomeをステージ済み対象ファイルに適用し、Steigerと型検査を全体に実行する。構文エラーでは終了コード1、正常入力では0となった。`npm run check`と`npm run test:visual`はローカルで成功した。基準DSLとREADMEの手順は実行結果と一致し、`git diff --check`も成功した。
- 未実施: GitHub Actions自体の実行と、Linux CIでのExtension統合テストは未実施。CIの本番結果や統合テストの実行可否を成功扱いしない。
- 失敗・リスク: 最終のビルド・検査・テストに未解決の失敗はない。サンドボックス内のSteiger実行ではファイル監視の`EMFILE`が発生したが、通常環境で同じ検査が成功した。`npm audit --json`はhighを3件報告した。いずれも開発依存のSteigerが使用するZod 3系に由来し、Steigerの修正版は監査結果で提示されていない。製品の実行時依存とは区別して追跡する。
- 証跡: [Core](../src/core/index.ts)、[Extensionビルド](../esbuild.mjs)、[Webviewビルド](../vite.config.ts)、[フック](../lefthook.yml)、[README](../README.md)、[基準DSL](../examples/login.glf)。

### glitchflow-spec - 2026-10-29 OpenSpec照合

- 対象: REQ-001 / REQ-001-S01、D-01からD-04、タスク全15件。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npx --no-install openspec validate glitchflow-spec --strict`を実行した。CLIに`verify`コマンドがないため、`openspec-verify-change`のCompleteness、Correctness、Coherenceの手順で提案、仕様、設計、タスク、実装、テスト、台帳を照合した。
- 結果: strict検証は成功。REQ-001の実装箇所、REQ-001-S01のExtension統合テスト、Chromium描画テスト、開発ホストでの手動確認を確認した。D-01からD-04の設計方針とコード配置に矛盾は見つからなかった。タスクはこの照合を完了として15/15件になる。仕様と実装の照合に未解決の重大・警告事項はない。依存関係の監査警告は[差分レビュー](#glitchflow-spec---2026-10-29-差分レビュー)に記録した。
- 未検証事項: 当時はGitHub Actionsの実行結果とLinux CIでのExtension統合テストが未確認。後の撤去判断によりCI実行はこの変更の対象外とした。これはREQ-001-S01のローカル・手動の受け入れ確認とは区別する。

### glitchflow-spec - 2026-10-29 GitHub Actions撤去

- 対象: [D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)、[タスク3.3](changes/archive/2026-10-29-glitchflow-spec/tasks.md#3-開発時の検査とciへの移植性)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 判断: ユーザーのGitHub依存を抑える指示に従い、CIサービスの設定を第1段階から除外した。`.github/workflows/ci.yml`を撤去し、検査入口をnpmスクリプトに保った。CIを導入する際に実行先を選ぶ。
- 方法: `npm run check`と`npm run test:visual`をローカルで実行し、GitHub Actionsなしで検査できることを確認した。提案、設計、タスク、技術・構造方針の参照を更新した。
- 結果: 両コマンドは成功済み。製品のREQ-001-S01とローカルの検証方法に変更はない。GitHub Actionsの実行はこの変更の完了条件から外した。
- 未検証事項: CIサービスを選んだ後の実行結果と、その環境でのExtension統合テストの実行可否。

### glitchflow-spec - 2026-10-29 Lefthook対象調整

- 対象: [D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)、[タスク3.2](changes/archive/2026-10-29-glitchflow-spec/tasks.md#3-開発時の検査とciへの移植性)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: [Lefthook設定](../lefthook.yml)のBiomeジョブから、[Biome設定](../biome.json)で対象外の`package-lock.json`を除外した。`npx --no-install lefthook validate`、`npx --no-install lefthook run pre-commit --file package-lock.json --no-auto-install`、`npx --no-install lefthook run pre-commit --job biome --file package.json --no-auto-install`を実行した。
- 結果: 設定検証は成功。ロックファイルだけの場合はBiomeがスキップされ、Steigerと型検査を含むpre-commit全体が終了コード0で通過した。`package.json`にはBiomeが実行され、終了コード0で通過した。前回のOpenSpec verifyで指摘された不要なコミット中断は解消した。
- 未検証事項: なし。

- 対象: 変更名、要件ID、シナリオID、または支援作業の設計節
- 実行日: 日付と、時間に意味がある場合はタイムゾーン
- 対象の版: コミットID、または差分と作業状態を特定できる証跡
- 方法: 実行コマンド、環境、データ、または手動確認の手順
- 結果: 成功、失敗、未検証と、実際に観測した内容
- 証跡: ログ、レポート、画像などへのリンク
- 未検証事項: 対象と理由、次に確認する方法

## IDの分割、統合、置き換え

旧IDと新IDの関係を記録し、双方の仕様と変更履歴から追跡できるようにする。

| 旧ID | 新ID | 関係と理由 | 変更へのリンク |
| --- | --- | --- | --- |

## 支援変更

製品の振る舞いを変えない変更は、製品要件を採番せずにここへ記録する。
skip_specsの理由、設計節、タスク、検証記録へリンクし、要件変更の履歴と同じように保存する。

| 変更名 | 目的 | 提案 | 設計 | タスク | 検証記録 |
| --- | --- | --- | --- | --- | --- |
| glitchflow-spec | Core、ビルド、検査、将来のCI移植性、基準DSLの基盤 | [提案](changes/archive/2026-10-29-glitchflow-spec/proposal.md) | [D-01](changes/archive/2026-10-29-glitchflow-spec/design.md#d-01---実行環境を分けた最小ビルド)、[D-03](changes/archive/2026-10-29-glitchflow-spec/design.md#d-03---開発時とciの同一検査)、[D-04](changes/archive/2026-10-29-glitchflow-spec/design.md#d-04---初期画面と基準dslの検証) | [タスク](changes/archive/2026-10-29-glitchflow-spec/tasks.md) | [Core基盤](#glitchflow-spec---2026-10-29-core基盤)、[CI相当の検査](#glitchflow-spec---2026-10-29-ci相当の検査)、[開発手順と基準入力](#glitchflow-spec---2026-10-29-開発手順と基準入力)、[GitHub Actions撤去](#glitchflow-spec---2026-10-29-github-actions撤去)、[Lefthook対象調整](#glitchflow-spec---2026-10-29-lefthook対象調整) |
