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
| REQ-018 | optとloop | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/other-fragments/spec.md#requirement-req-018---optとloop) |
| REQ-019 | par区画 | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/other-fragments/spec.md#requirement-req-019---par区画) |
| REQ-020 | break表示 | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/other-fragments/spec.md#requirement-req-020---break表示) |
| REQ-021 | フラグメントの診断 | 実装済み | [設計上の優先事項](product.md#設計上の優先事項) | [正式仕様](specs/other-fragments/spec.md#requirement-req-021---フラグメントの診断) |
| REQ-022 | 図面とObjectの視覚表現 | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/preview-appearance/spec.md#requirement-req-022---図面とobjectの視覚表現) |
| REQ-023 | メッセージと処理の視覚表現 | 実装済み | [シーケンス図](product.md#シーケンス図) | [正式仕様](specs/preview-appearance/spec.md#requirement-req-023---メッセージと処理の視覚表現) |
| REQ-024 | StateとSQLのカード表現 | 実装済み | [データ状態](product.md#データ状態) | [正式仕様](specs/preview-appearance/spec.md#requirement-req-024---stateとsqlのカード表現) |
| REQ-025 | フラグメントの視覚表現と配置 | 実装済み | [図面の操作](product.md#図面の操作) | [正式仕様](specs/preview-appearance/spec.md#requirement-req-025---フラグメントの視覚表現と配置) |
| REQ-026 | プレビュー自動起動 | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/preview/spec.md#requirement-req-026---プレビュー自動起動) |
| REQ-027 | プレビューの再利用とクローズ | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/preview/spec.md#requirement-req-027---プレビューの再利用とクローズ) |
| REQ-028 | エディタの起動アイコン | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/preview/spec.md#requirement-req-028---エディタの起動アイコン) |
| REQ-029 | 定型構文補完 | 実装済み | [DSLと編集](product.md#dslと編集) | [正式仕様](specs/dsl-completion/spec.md#requirement-req-029---定型構文補完) |
| REQ-030 | 定義参照補完 | 実装済み | [データ状態](product.md#データ状態) | [正式仕様](specs/dsl-completion/spec.md#requirement-req-030---定義参照補完) |
| REQ-031 | 文脈別補完 | 実装済み | [構文と安全性](tech.md#構文と安全性) | [正式仕様](specs/dsl-completion/spec.md#requirement-req-031---文脈別補完) |
| REQ-032 | 画像エクスポート操作 | 実装済み | [図面の操作](product.md#図面の操作) | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-032---画像エクスポート操作) |
| REQ-033 | 全体図の品質 | 実装済み | [描画規則](tech.md#描画規則) | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-033---全体図の品質) |
| REQ-034 | 失敗と状態保持 | 実装済み | [構文と安全性](tech.md#構文と安全性) | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-034---失敗と状態保持) |
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
| fix-sql-panel-overflow | REQ-011 | 変更 | アーカイブ済み | [正式仕様](specs/state-rendering/spec.md#requirement-req-011---sqlの描画と状態配置) | [提案](changes/archive/2026-10-30-fix-sql-panel-overflow/proposal.md)、[設計](changes/archive/2026-10-30-fix-sql-panel-overflow/design.md)、[タスク](changes/archive/2026-10-30-fix-sql-panel-overflow/tasks.md) |
| support-alt-fragment | REQ-012 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#requirement-req-012---alt分岐の描画) | [提案](changes/archive/2026-10-29-support-alt-fragment/proposal.md)、[設計](changes/archive/2026-10-29-support-alt-fragment/design.md)、[タスク](changes/archive/2026-10-29-support-alt-fragment/tasks.md) |
| support-alt-fragment | REQ-013 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-support-alt-fragment/specs/alt-fragment/spec.md#requirement-req-013---分岐の活性整合性) | [提案](changes/archive/2026-10-29-support-alt-fragment/proposal.md)、[設計](changes/archive/2026-10-29-support-alt-fragment/design.md)、[タスク](changes/archive/2026-10-29-support-alt-fragment/tasks.md) |
| integrate-glf-editor | REQ-014 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-014---編集連動プレビュー) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-015 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-015---problems診断) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-016 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-016---dsl構文配色) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | REQ-017 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-req-017---プレビュー操作) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| integrate-glf-editor | NREQ-001 | 追加 | アーカイブ済み | [変更仕様](changes/archive/2026-10-29-integrate-glf-editor/specs/editor-integration/spec.md#requirement-nreq-001---編集応答時間) | [提案](changes/archive/2026-10-29-integrate-glf-editor/proposal.md)、[設計](changes/archive/2026-10-29-integrate-glf-editor/design.md)、[タスク](changes/archive/2026-10-29-integrate-glf-editor/tasks.md) |
| support-other-fragments | REQ-018 | 追加 | アーカイブ済み | [正式仕様](specs/other-fragments/spec.md#requirement-req-018---optとloop) | [提案](changes/archive/2026-10-29-support-other-fragments/proposal.md)、[設計](changes/archive/2026-10-29-support-other-fragments/design.md)、[タスク](changes/archive/2026-10-29-support-other-fragments/tasks.md) |
| support-other-fragments | REQ-019 | 追加 | アーカイブ済み | [正式仕様](specs/other-fragments/spec.md#requirement-req-019---par区画) | [提案](changes/archive/2026-10-29-support-other-fragments/proposal.md)、[設計](changes/archive/2026-10-29-support-other-fragments/design.md)、[タスク](changes/archive/2026-10-29-support-other-fragments/tasks.md) |
| support-other-fragments | REQ-020 | 追加 | アーカイブ済み | [正式仕様](specs/other-fragments/spec.md#requirement-req-020---break表示) | [提案](changes/archive/2026-10-29-support-other-fragments/proposal.md)、[設計](changes/archive/2026-10-29-support-other-fragments/design.md)、[タスク](changes/archive/2026-10-29-support-other-fragments/tasks.md) |
| support-other-fragments | REQ-021 | 追加 | アーカイブ済み | [正式仕様](specs/other-fragments/spec.md#requirement-req-021---フラグメントの診断) | [提案](changes/archive/2026-10-29-support-other-fragments/proposal.md)、[設計](changes/archive/2026-10-29-support-other-fragments/design.md)、[タスク](changes/archive/2026-10-29-support-other-fragments/tasks.md) |
| align-preview-with-html-sample | REQ-022 | 追加 | アーカイブ済み | [正式仕様](specs/preview-appearance/spec.md#requirement-req-022---図面とobjectの視覚表現) | [提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md) |
| align-preview-with-html-sample | REQ-023 | 追加 | アーカイブ済み | [正式仕様](specs/preview-appearance/spec.md#requirement-req-023---メッセージと処理の視覚表現) | [提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md) |
| align-preview-with-html-sample | REQ-024 | 追加 | アーカイブ済み | [正式仕様](specs/preview-appearance/spec.md#requirement-req-024---stateとsqlのカード表現) | [提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md) |
| align-preview-with-html-sample | REQ-025 | 追加 | アーカイブ済み | [正式仕様](specs/preview-appearance/spec.md#requirement-req-025---フラグメントの視覚表現と配置) | [提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md) |
| improve-preview-opening | REQ-026 | 追加 | アーカイブ済み | [正式仕様](specs/preview/spec.md#requirement-req-026---プレビュー自動起動) | [提案](changes/archive/2026-10-30-improve-preview-opening/proposal.md)、[設計](changes/archive/2026-10-30-improve-preview-opening/design.md)、[タスク](changes/archive/2026-10-30-improve-preview-opening/tasks.md) |
| improve-preview-opening | REQ-027 | 追加 | アーカイブ済み | [正式仕様](specs/preview/spec.md#requirement-req-027---プレビューの再利用とクローズ) | [提案](changes/archive/2026-10-30-improve-preview-opening/proposal.md)、[設計](changes/archive/2026-10-30-improve-preview-opening/design.md)、[タスク](changes/archive/2026-10-30-improve-preview-opening/tasks.md) |
| improve-preview-opening | REQ-028 | 追加 | アーカイブ済み | [正式仕様](specs/preview/spec.md#requirement-req-028---エディタの起動アイコン) | [提案](changes/archive/2026-10-30-improve-preview-opening/proposal.md)、[設計](changes/archive/2026-10-30-improve-preview-opening/design.md)、[タスク](changes/archive/2026-10-30-improve-preview-opening/tasks.md) |
| add-glf-completion | REQ-029 | 追加 | アーカイブ済み | [正式仕様](specs/dsl-completion/spec.md#requirement-req-029---定型構文補完) | [提案](changes/archive/2026-10-30-add-glf-completion/proposal.md)、[設計](changes/archive/2026-10-30-add-glf-completion/design.md)、[タスク](changes/archive/2026-10-30-add-glf-completion/tasks.md) |
| add-glf-completion | REQ-030 | 追加 | アーカイブ済み | [正式仕様](specs/dsl-completion/spec.md#requirement-req-030---定義参照補完) | [提案](changes/archive/2026-10-30-add-glf-completion/proposal.md)、[設計](changes/archive/2026-10-30-add-glf-completion/design.md)、[タスク](changes/archive/2026-10-30-add-glf-completion/tasks.md) |
| add-glf-completion | REQ-031 | 追加 | アーカイブ済み | [正式仕様](specs/dsl-completion/spec.md#requirement-req-031---文脈別補完) | [提案](changes/archive/2026-10-30-add-glf-completion/proposal.md)、[設計](changes/archive/2026-10-30-add-glf-completion/design.md)、[タスク](changes/archive/2026-10-30-add-glf-completion/tasks.md) |
| add-image-export | REQ-032 | 追加 | 検証済み | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-032---画像エクスポート操作) | [提案](changes/add-image-export/proposal.md)、[設計](changes/add-image-export/design.md)、[タスク](changes/add-image-export/tasks.md) |
| add-image-export | REQ-033 | 追加 | 検証済み | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-033---全体図の品質) | [提案](changes/add-image-export/proposal.md)、[設計](changes/add-image-export/design.md)、[タスク](changes/add-image-export/tasks.md) |
| add-image-export | REQ-034 | 追加 | 検証済み | [変更仕様](changes/add-image-export/specs/diagram-export/spec.md#requirement-req-034---失敗と状態保持) | [提案](changes/add-image-export/proposal.md)、[設計](changes/add-image-export/design.md)、[タスク](changes/add-image-export/tasks.md) |

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
| fix-sql-panel-overflow | REQ-011 / REQ-011-S01 | [シナリオ](specs/state-rendering/spec.md#scenario-req-011-s01---sqlをstateの下に表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Core](../tests/core/state-layout.test.ts) `REQ-011-S01`、[Chromium](../tests/visual/state.spec.ts) `REQ-011-S01` | [検証記録](#fix-sql-panel-overflow---2026-10-30-sql幅の回帰検証) |
| fix-sql-panel-overflow | REQ-011 / REQ-011-S02 | [シナリオ](specs/state-rendering/spec.md#scenario-req-011-s02---指定位置だけに表示する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence` | [Core](../tests/core/state-layout.test.ts) `REQ-011-S02` | [検証記録](#fix-sql-panel-overflow---2026-10-30-sql幅の回帰検証) |
| fix-sql-panel-overflow | REQ-011 / REQ-011-S03 | [シナリオ](specs/state-rendering/spec.md#scenario-req-011-s03---sql本文を枠内に収める) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Chromium](../tests/visual/state.spec.ts) `REQ-011-S03`、[README画像](../docs/images/session-isolation-preview.png) | [検証記録](#fix-sql-panel-overflow---2026-10-30-sql幅の回帰検証) |
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
| support-other-fragments | REQ-018 / REQ-018-S01 | [シナリオ](specs/other-fragments/spec.md#scenario-req-018-s01---単一区画を描画する) | [解析](../src/core/parser/parse-glf.ts) `parseGlf`、[配置](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Core](../tests/core/other-fragments.test.ts)、[Chromium](../tests/visual/other-fragments.spec.ts) | [検証記録](#support-other-fragments---2026-10-29-複合フラグメント検証) |
| support-other-fragments | REQ-019 / REQ-019-S01 | [シナリオ](specs/other-fragments/spec.md#scenario-req-019-s01---並列区画を描画する) | [解析](../src/core/parser/parse-glf.ts) `parseGlf`、[配置](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Core](../tests/core/other-fragments.test.ts)、[Chromium](../tests/visual/other-fragments.spec.ts) | [検証記録](#support-other-fragments---2026-10-29-複合フラグメント検証) |
| support-other-fragments | REQ-020 / REQ-020-S01 | [シナリオ](specs/other-fragments/spec.md#scenario-req-020-s01---中断枠と後続を描画する) | [解析](../src/core/parser/parse-glf.ts) `parseGlf`、[配置](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Core](../tests/core/other-fragments.test.ts)、[Chromium](../tests/visual/other-fragments.spec.ts) | [検証記録](#support-other-fragments---2026-10-29-複合フラグメント検証) |
| support-other-fragments | REQ-021 / REQ-021-S01 | [シナリオ](specs/other-fragments/spec.md#scenario-req-021-s01---不正な構造と活性を診断する) | [解析](../src/core/parser/parse-glf.ts) `parseGlf`、[検証](../src/core/validator/validate-glf.ts) `validateGlf` | [Core](../tests/core/other-fragments.test.ts) | [検証記録](#support-other-fragments---2026-10-29-複合フラグメント検証) |
| support-other-fragments | REQ-021 / REQ-021-S02 | [シナリオ](specs/other-fragments/spec.md#scenario-req-021-s02---並列経路の活性不一致を診断する) | [検証](../src/core/validator/validate-glf.ts) `validateGlf` | [Core](../tests/core/other-fragments.test.ts) | [検証記録](#support-other-fragments---2026-10-29-複合フラグメント検証) |
| align-preview-with-html-sample | REQ-022 / REQ-022-S01 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-022-s01---種別と活性を区別する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview`、[配色](../src/webview/app/styles.css) | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-022 / REQ-022-S01` | [記録](#align-preview-with-html-sample---2026-10-29-object表示)、[ID非表示](#align-preview-with-html-sample---2026-10-30-id非表示と列幅)、[余白](#align-preview-with-html-sample---2026-10-30-case文字とメッセージ余白)、[ボタン表示](#align-preview-with-html-sample---2026-10-30-拡大縮小ボタンのラベル) |
| align-preview-with-html-sample | REQ-022 / REQ-022-S02 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-022-s02---未使用の種別とテーマ) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[配色](../src/webview/app/styles.css) | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-022 / REQ-022-S02` | [記録](#align-preview-with-html-sample---2026-10-29-object表示)、[ID非表示](#align-preview-with-html-sample---2026-10-30-id非表示と列幅) |
| align-preview-with-html-sample | REQ-023 / REQ-023-S01 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-023-s01---メッセージと処理を区別する) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview`、[配色](../src/webview/app/styles.css) | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-023 / REQ-023-S01` | [記録](#align-preview-with-html-sample---2026-10-29-メッセージと処理)、[細部調整](#align-preview-with-html-sample---2026-10-29-細部調整)、[余白](#align-preview-with-html-sample---2026-10-30-case文字とメッセージ余白) |
| align-preview-with-html-sample | REQ-024 / REQ-024-S01 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-024-s01---stateとsqlを一続きに読む) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState`、[配色](../src/webview/app/styles.css) | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-024 / REQ-024-S01` | [記録](#align-preview-with-html-sample---2026-10-29-stateとsql)、[細部調整](#align-preview-with-html-sample---2026-10-29-細部調整)、[列幅調整](#align-preview-with-html-sample---2026-10-30-id非表示と列幅) |
| align-preview-with-html-sample | REQ-024 / REQ-024-S02 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-024-s02---独立したstateと長文) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderState` | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-024 / REQ-024-S02` | [記録](#align-preview-with-html-sample---2026-10-29-stateとsql)、[列幅調整](#align-preview-with-html-sample---2026-10-30-id非表示と列幅) |
| align-preview-with-html-sample | REQ-025 / REQ-025-S01 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-025-s01---ログイン分岐を読む) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-025 / REQ-025-S01` | [記録](#align-preview-with-html-sample---2026-10-29-分岐と配置)、[細部調整](#align-preview-with-html-sample---2026-10-29-細部調整)、[case位置](#align-preview-with-html-sample---2026-10-30-id非表示と列幅)、[文字装飾](#align-preview-with-html-sample---2026-10-30-case文字とメッセージ余白)、[else装飾](#align-preview-with-html-sample---2026-10-30-else文字の装飾) |
| align-preview-with-html-sample | REQ-025 / REQ-025-S02 | [シナリオ](specs/preview-appearance/spec.md#scenario-req-025-s02---可変内容でも図を読める) | [レイアウト](../src/core/layout/sequence-layout.ts) `layoutSequence`、[描画](../src/webview/pages/preview/ui/render-preview.ts) `renderPreview` | [Chromium](../tests/visual/preview-appearance.spec.ts) `REQ-025 / REQ-025-S02` | [記録](#align-preview-with-html-sample---2026-10-29-分岐と配置)、[文字装飾](#align-preview-with-html-sample---2026-10-30-case文字とメッセージ余白)、[else装飾](#align-preview-with-html-sample---2026-10-30-else文字の装飾) |
| improve-preview-opening | REQ-026 / REQ-026-S01 | [シナリオ](specs/preview/spec.md#scenario-req-026-s01---編集開始時の自動起動) | [起動](../src/extension/extension.ts) `activate` | [Extension](../tests/extension/preview.test.ts) `REQ-026` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-026 / REQ-026-S02 | [シナリオ](specs/preview/spec.md#scenario-req-026-s02---設定と対象外ファイル) | [設定](../package.json)、[起動](../src/extension/extension.ts) | [Extension](../tests/extension/preview.test.ts) `REQ-026` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-026 / REQ-026-S03 | [シナリオ](specs/preview/spec.md#scenario-req-026-s03---内部読み込みでは起動しない) | [起動](../src/extension/extension.ts) `activate` | [Extension](../tests/extension/preview.test.ts) `REQ-026` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-027 / REQ-027-S01 | [シナリオ](specs/preview/spec.md#scenario-req-027-s01---単一パネルの再利用) | [単一パネル](../src/extension/preview-panel.ts) `openPreview` | [Extension](../tests/extension/preview.test.ts) `REQ-027` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-027 / REQ-027-S02 | [シナリオ](specs/preview/spec.md#scenario-req-027-s02---手動クローズを尊重する) | [閉鎖](../src/extension/extension.ts) `activate` | [Extension](../tests/extension/preview.test.ts) `REQ-027` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-027 / REQ-027-S03 | [シナリオ](specs/preview/spec.md#scenario-req-027-s03---連続起動で重複しない) | [単一パネル](../src/extension/preview-panel.ts) `openPreview` | [Extension](../tests/extension/preview.test.ts) `REQ-027` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-028 / REQ-028-S01 | [シナリオ](specs/preview/spec.md#scenario-req-028-s01---アイコンからの手動起動) | [メニュー](../package.json) | [Extension](../tests/extension/preview.test.ts) `REQ-028` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| improve-preview-opening | REQ-028 / REQ-028-S02 | [シナリオ](specs/preview/spec.md#scenario-req-028-s02---対象外のエディタ) | [メニュー](../package.json) | [Extension](../tests/extension/preview.test.ts) `REQ-028` | [記録](#improve-preview-opening---2026-10-30-起動動作の検証) |
| add-glf-completion | REQ-029 / REQ-029-S01 | [シナリオ](specs/dsl-completion/spec.md#scenario-req-029-s01---定型構文と記号) | [補完](../src/extension/completion.ts) | [Extension](../tests/extension/completion.test.ts) `REQ-029-S01` | [記録](#add-glf-completion---2026-10-30-入力補完の検証) |
| add-glf-completion | REQ-030 / REQ-030-S01 | [シナリオ](specs/dsl-completion/spec.md#scenario-req-030-s01---定義済み参照) | [補完](../src/extension/completion.ts) | [Extension](../tests/extension/completion.test.ts) `REQ-030-S01` | [記録](#add-glf-completion---2026-10-30-入力補完の検証) |
| add-glf-completion | REQ-031 / REQ-031-S01 | [シナリオ](specs/dsl-completion/spec.md#scenario-req-031-s01---ブロックごとの候補) | [補完](../src/extension/completion.ts) | [Extension](../tests/extension/completion.test.ts) `REQ-031-S01` | [記録](#add-glf-completion---2026-10-30-入力補完の検証) |
| add-glf-completion | REQ-031 / REQ-031-S02 | [シナリオ](specs/dsl-completion/spec.md#scenario-req-031-s02---未完成の文書) | [補完](../src/extension/completion.ts) | [Extension](../tests/extension/completion.test.ts) `REQ-031-S02` | [記録](#add-glf-completion---2026-10-30-入力補完の検証) |
| add-image-export | REQ-032 / REQ-032-S01 | [シナリオ](changes/add-image-export/specs/diagram-export/spec.md#scenario-req-032-s01---コマンドから保存) | [保存](../src/extension/preview-panel.ts)、[登録](../src/extension/extension.ts) | [Extension](../tests/extension/export.test.ts) | [記録](#add-image-export---2026-10-30-画像出力の検証) |
| add-image-export | REQ-032 / REQ-032-S02 | [シナリオ](changes/add-image-export/specs/diagram-export/spec.md#scenario-req-032-s02---プレビューから保存) | [ボタン](../src/webview/pages/preview/ui/render-preview.ts)、[通信](../src/webview/app/main.ts) | [Chromium](../tests/visual/export.spec.ts) | [記録](#add-image-export---2026-10-30-画像出力の検証) |
| add-image-export | REQ-033 / REQ-033-S01 | [シナリオ](changes/add-image-export/specs/diagram-export/spec.md#scenario-req-033-s01---図全体を出力) | [生成](../src/webview/pages/preview/model/export-diagram.ts) | [Chromium](../tests/visual/export.spec.ts) | [記録](#add-image-export---2026-10-30-画像出力の検証) |
| add-image-export | REQ-033 / REQ-033-S02 | [シナリオ](changes/add-image-export/specs/diagram-export/spec.md#scenario-req-033-s02---拡大縮小から独立した出力) | [生成](../src/webview/pages/preview/model/export-diagram.ts) | [Chromium](../tests/visual/export.spec.ts) | [記録](#add-image-export---2026-10-30-画像出力の検証) |
| add-image-export | REQ-034 / REQ-034-S01 | [シナリオ](changes/add-image-export/specs/diagram-export/spec.md#scenario-req-034-s01---失敗を通知する) | [通知](../src/extension/preview-panel.ts)、[生成](../src/webview/pages/preview/model/export-diagram.ts) | [Extension](../tests/extension/export.test.ts)、[Chromium](../tests/visual/export.spec.ts) | [記録](#add-image-export---2026-10-30-画像出力の検証) |

## 検証記録

### add-image-export - 2026-10-30 画像出力の検証

- 対象: REQ-032-S01、REQ-032-S02、REQ-033-S01、REQ-033-S02、REQ-034-S01。
- 実行日: 2026-10-30 JST。
- 結果: [検証記録](changes/add-image-export/verification.md)に記載したCore34件、Chromium36件、Extension13件、OpenSpec strict検証が成功した。

### add-glf-completion - 2026-10-30 入力補完の検証

- 対象: REQ-029-S01、REQ-030-S01、REQ-031-S01、REQ-031-S02。
- 実行日: 2026-10-30 JST。
- 結果: [検証記録](changes/archive/2026-10-30-add-glf-completion/verification.md)に記載したCore34件、Extension11件、OpenSpec strict検証が成功した。

### fix-sql-panel-overflow - 2026-10-30 アーカイブ

- 対象: REQ-011とREQ-011-S01からREQ-011-S03。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 差分仕様のREQ-011本文と3シナリオを[正式仕様](specs/state-rendering/spec.md)へ同期した。
  `npx --no-install openspec validate --specs`で正式仕様8件を検証し、同期後のREQ-011本文と差分仕様の一致を確認した。
  完了済みの変更を[アーカイブ](changes/archive/2026-10-30-fix-sql-panel-overflow/proposal.md)へ移し、台帳の参照を更新した。
- 結果: 正式仕様8件の検証が成功し、REQ-011のS01とS02を維持したままS03を追加した。
  アーカイブ前の成果物4/4とタスク5/5は完了していた。
- 証跡: [正式仕様](specs/state-rendering/spec.md)、[アーカイブ済み差分](changes/archive/2026-10-30-fix-sql-panel-overflow/specs/state-rendering/spec.md)、[タスク](changes/archive/2026-10-30-fix-sql-panel-overflow/tasks.md)。
- 未検証事項: なし。

### fix-sql-panel-overflow - 2026-10-30 SQL幅の回帰検証

- 対象: REQ-011-S01、REQ-011-S02、REQ-011-S03。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 等幅フォントで幅が広がるSQL行を用いたChromiumテストを追加し、修正前の失敗を確認した。
  CoreのSQL幅計算を変更し、対象テストと既存のState描画テストを再実行した。
  README例を描画してSQL本文の右余白を測り、画像を再生成した。
- 結果: 修正前はSQL文字列の右端が枠の右端を約181px越えた。
  修正後は境界テストとState描画テストの計4件が成功し、README例の右余白は20.26pxであった。
  DB表とSQL枠は同じ幅で接し、SQL全文を選択できる。
- 証跡: [変更仕様](changes/archive/2026-10-30-fix-sql-panel-overflow/specs/state-rendering/spec.md)、[描画テスト](../tests/visual/state.spec.ts)、[Core配置](../src/core/layout/sequence-layout.ts)、[README画像](../docs/images/session-isolation-preview.png)。
- 全体検査: `npm run check`でBiome、Steiger、型検査、Core33件が成功した。
  `npm run test:visual`でChromium30件が成功した。
  `npx --no-install openspec validate fix-sql-panel-overflow --strict`と`git diff --check`も成功した。
- 成果物照合: [Verify報告](changes/archive/2026-10-30-fix-sql-panel-overflow/verification.md)で要件、3シナリオ、設計、タスク5件、実装、テストを照合し、重大、警告、提案事項はない。
- 未検証事項: VS Code開発ホストでの再撮影は実施していない。

### improve-preview-opening - 2026-10-30 アーカイブ

- 対象: REQ-026からREQ-028、[変更](changes/archive/2026-10-30-improve-preview-opening/proposal.md)。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 差分仕様を[正式仕様](specs/preview/spec.md)へ同期し、`npx --no-install openspec validate --specs`で全仕様を検証した。
- 結果: 8仕様が成功し、REQ-001を保持したままREQ-026からREQ-028を追加した。
  成果物4件とタスク8件の完了を確認してアーカイブした。
- 証跡: [正式仕様](specs/preview/spec.md)、[アーカイブ](changes/archive/2026-10-30-improve-preview-opening/tasks.md)。
- 未検証事項: アイコンとツールチップの開発ホスト上での目視確認。

### improve-preview-opening - 2026-10-30 起動動作の検証

- 対象: REQ-026/REQ-026-S01からS03、REQ-027/REQ-027-S01からS03、REQ-028/REQ-028-S01からS02。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run check`、`npm run test:extension`、`npx --no-install openspec validate improve-preview-opening --strict`を実行する。
- 結果: `npm run check`でBiome、Steiger、型検査、Core単体テスト33件が成功した。
  `npm run test:extension`で7件が成功し、起動、設定OFF、内部読み込み、切り替え、クローズ後の抑制、連続起動、メニュー定義を確認した。
  OpenSpec strict検証と`git diff --check`も成功した。
- 証跡: [Extensionテスト](../tests/extension/preview.test.ts)、[設定とアイコン](../package.json)、[起動](../src/extension/extension.ts)、[単一パネル](../src/extension/preview-panel.ts)。
- 未検証事項: Development Hostでのアイコンとツールチップの目視確認。

### align-preview-with-html-sample - 2026-10-30 アーカイブ

- 対象: REQ-022からREQ-025の正式仕様への同期と変更のアーカイブ。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 成果物4件とタスク30件の完了をOpenSpec CLIで確認した。
差分仕様の4要件と7シナリオを新しい`preview-appearance`正式仕様へ同期し、Purposeと要件本文の一致、差分見出しの不在を照合した。
`npx --no-install openspec validate --specs`、アーカイブ内のMarkdown相対リンク検査、`git diff --check`を実行した。
- 結果: 正式仕様8件の検証が成功し、REQ-022からREQ-025と7シナリオが同期された。
変更は`2026-10-30-align-preview-with-html-sample`へ移動し、アクティブな変更一覧から消えた。
アーカイブ内の相対リンク4ファイルに欠落はなかった。
- 証跡: [正式仕様](specs/preview-appearance/spec.md)、[差分仕様](changes/archive/2026-10-30-align-preview-with-html-sample/specs/preview-appearance/spec.md)、[提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md)。
- 未検証事項: 最新のボタン表示をVS Code開発ホスト上で目視確認していない。

### align-preview-with-html-sample - 2026-10-30 拡大縮小ボタンのラベル

- 対象: REQ-022-S01の拡大縮小ボタンの表示文字。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: ボタンの表示文字、読み上げ用の名前、縮小・等倍・拡大の動作を検査するChromiumテストを追加した。
旧実装で表示文字の不一致による失敗を確認した。
実装後に`npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate align-preview-with-html-sample --strict`、`git diff --check`を実行した。
更新した基準DSL画像を目視確認した。
- 結果: 左から`-`、`Reset`、`+`が表示され、読み上げ用の名前`縮小`、`等倍`、`拡大`と倍率操作が維持された。
Core33件、Chromium29件、Extension4件、OpenSpec strict検証、差分チェックが成功した。
- 証跡: [仕様](specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[Webview描画](../src/webview/pages/preview/ui/render-preview.ts)、[Chromiumテスト](../tests/visual/preview-appearance.spec.ts)、[更新画像](../docs/images/align-preview-login.png)。
- 未検証事項: 今回のボタン改修後にVS Code開発ホスト上での目視確認は再実施していない。

### align-preview-with-html-sample - 2026-10-30 else文字の装飾

- 対象: REQ-025-S01、REQ-025-S02のelseラベルの外観。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: elseの文字色、背景矩形の不在、分岐線との間隔を検査するChromiumテストを追加した。
旧実装で文字色の不一致による失敗を確認した。
実装後に`npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate align-preview-with-html-sample --strict`、`git diff --check`を実行した。
更新した基準DSL画像を目視確認した。
- 結果: caseとelseはいずれも枠と背景のない`#DD6872`の文字になった。
altの見出しだけ背景付きラベルを維持し、elseは分岐線の下に8px以上の空きを持つ。
Core33件、Chromium28件、Extension4件、OpenSpec strict検証、差分チェックが成功した。
- 証跡: [仕様](specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[SVG描画](../src/webview/pages/preview/ui/render-preview.ts)、[CSS](../src/webview/app/styles.css)、[Chromiumテスト](../tests/visual/preview-appearance.spec.ts)、[更新画像](../docs/images/align-preview-login.png)。
- 未検証事項: 今回のelse改修後にVS Code開発ホスト上での目視確認は再実施していない。

### align-preview-with-html-sample - 2026-10-30 case文字とメッセージ余白

- 対象: REQ-022-S01、REQ-023-S01、REQ-025-S01、REQ-025-S02の2点の見た目の改修。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: Object下と連続メッセージ、分岐直後の余白、およびcaseの文字色と枠の有無を検査するChromiumテスト2件を追加した。
旧実装で両テストの失敗を確認した。
実装後に`npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate align-preview-with-html-sample --strict`、`git diff --check`を実行した。
更新した基準DSL画像を目視確認した。
- 結果: caseは背景と枠のない`#DD6872`の文字となり、`alt`と`else`の背景付きラベルは維持された。
Object枠の下端と最初のメッセージラベルには11pxの空きがあり、連続メッセージのY座標差は60pxとなった。
分岐直後のcase文字とメッセージラベルの空きも8px以上である。
Core33件、Chromium27件、Extension4件、OpenSpec strict検証、差分チェックが成功した。
- 証跡: [仕様](specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[Core配置](../src/core/layout/sequence-layout.ts)、[SVG描画](../src/webview/pages/preview/ui/render-preview.ts)、[CSS](../src/webview/app/styles.css)、[Chromiumテスト](../tests/visual/preview-appearance.spec.ts)、[更新画像](../docs/images/align-preview-login.png)。
- 未検証事項: 今回の2点の改修後にVS Code開発ホスト上での目視確認は再実施していない。

### align-preview-with-html-sample - 2026-10-30 ID非表示と列幅

- 対象: REQ-022-S01、REQ-022-S02、REQ-024-S01、REQ-024-S02、REQ-025-S01の3点の見た目の改修。
- 実行日: 2026-10-30 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: Object IDの非表示、State見出しとDB列幅、caseラベル位置を検査するChromiumテスト3件を追加し、旧実装で3件とも失敗することを確認した。実装後に`npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate align-preview-with-html-sample --strict`を実行した。新しい基準DSL画像を参照HTML画像と目視比較した。
- 結果: Objectカードは表示名と種別のみを描画し、DB見出しは`users`、FILE見出しは`Storage`となった。caseラベルの上端は枠上辺から26pxで、altとの間隔は14px。DB各列は12pxの等幅フォントでカラム名と値を測り、左右合計約20pxから36pxの余白に収めた。Core33件、Chromium25件、Extension4件、OpenSpec strict検証が成功した。
- 証跡: [仕様](specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[Core配置](../src/core/layout/sequence-layout.ts)、[SVG描画](../src/webview/pages/preview/ui/render-preview.ts)、[Chromiumテスト](../tests/visual/preview-appearance.spec.ts)、[新しい基準DSL画像](../docs/images/align-preview-login.png)、[参照HTML画像](../docs/images/align-preview-reference.png)。
- 未検証事項: 今回の3点の改修後にVS Code開発ホスト上での目視比較は再実施していない。

### align-preview-with-html-sample - 2026-10-29 細部調整

- 対象: REQ-023-S01、REQ-024-S01、REQ-025-S01の5点の細部改修。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `examples/login.glf`の処理カードの余白、応答線と活性下端、DB値、case位置と活性の継ぎ目を検査するChromiumテスト3件を追加し、旧実装で全件の失敗を確認した。
修正後に`npm run check`、`npm run test:visual`、`npm run test:extension`、`npx --no-install openspec validate align-preview-with-html-sample --strict`、`git diff --check`を実行した。
[新しい画像](../docs/images/align-preview-login.png)を[基準画像](../docs/images/glitchflow.png)と目視比較した。
- 結果: 処理カードの左・下の空きは8px以上で、DBの検索結果とBEの2つの応答は活性下端と一致する。
DBの`int`と`decimal`は右寄せ、`text`と`datetime`は左寄せとなり、表示文字列の外側の引用符は消えた。
最初のcaseラベルは枠上辺から30px以上下にあり、分岐開始前から続く活性バーは1本につながって水平の継ぎ目がない。
Core33件、Chromium22件、Extension4件、OpenSpec strict検証、差分チェックが成功した。
- 証跡: [仕様](specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[座標とDB表示](../src/core/layout/sequence-layout.ts)、[SVG描画](../src/webview/pages/preview/ui/render-preview.ts)、[視覚テスト](../tests/visual/preview-appearance.spec.ts)、[新しい画像](../docs/images/align-preview-login.png)。
- 未検証事項: 今回の細部修正後にVS Code開発ホストでの目視確認は再実施していない。

### align-preview-with-html-sample - 2026-10-29 OpenSpec照合

- 対象: REQ-022からREQ-025、7シナリオ、D-01からD-04、タスク全15件。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npx --no-install openspec validate align-preview-with-html-sample --strict`を実行した。
`openspec-verify-change`のCompleteness、Correctness、Coherenceの観点で提案、差分仕様、設計、タスク、Core、Webview、Chromiumテスト、台帳を照合した。
`git diff --check`も実行した。
- 結果: strict検証と差分チェックは成功した。
4要件と7シナリオの全てに実装箇所、受け入れテスト、台帳の対応がある。
D-01からD-04の描画責務と動的計測はCoreとWebviewの分担に沿い、新しい依存関係はない。
要件に対する未解決の重大事項、警告事項、提案事項は見つからなかった。
タスク5.3の記録完了時点で15/15件となる。
- 証跡: [提案](changes/archive/2026-10-30-align-preview-with-html-sample/proposal.md)、[差分仕様](changes/archive/2026-10-30-align-preview-with-html-sample/specs/preview-appearance/spec.md)、[設計](changes/archive/2026-10-30-align-preview-with-html-sample/design.md)、[タスク](changes/archive/2026-10-30-align-preview-with-html-sample/tasks.md)、[新しい描画テスト](../tests/visual/preview-appearance.spec.ts)、[開発ホストと画像比較](#align-preview-with-html-sample---2026-10-29-開発ホストと画像比較)。
- 未検証事項: macOSの開発ホストとChromium以外の環境での目視比較は実施していない。

### align-preview-with-html-sample - 2026-10-29 開発ホストと画像比較

- 対象: REQ-022からREQ-025、タスク5.2。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `.vscode/launch.json`からF5でVS Code Extension Development Hostを起動し、`examples/login.glf`で`GlitchFlow: プレビューを開く`を実行した。
既定の`ダーク 2026`で図面を目視し、`ライト 2026`へ切り替えてエディタとWebviewを比較した後、元の`ダーク 2026`に戻した。
Chromiumで撮影した`test-results/preview-appearance-login.png`と`test-results/reference-html.png`も目視比較した。
- 結果: 両テーマでWebviewにObjectの種別色と活性、処理カード、DBのStateとSQL、分岐ラベルが表示された。
ライトではVS Codeの通常エディタが明色になり、Webviewの暗色図面と文字の視認性は維持された。
参照HTMLの要素構成と配色に近づいたことを確認した。
開発ホストの分割表示では図面幅が足りないため、右側のObjectと下側のイベントはスクロールして読む構成である。
- 証跡: [開発ホスト設定](../.vscode/launch.json)、[基準DSL](../examples/login.glf)、[新しいChromium画像](../docs/images/align-preview-login.png)、[参照HTML画像](../docs/images/align-preview-reference.png)、[参照HTML](changes/archive/2026-10-29-glitchflow-spec/glitchflow-sample.html)。
- 未検証事項: macOSの開発ホストとChromium以外のOS・ブラウザでは目視比較していない。
開発ホスト画面の画像は保存していない。

### align-preview-with-html-sample - 2026-10-29 全体検査

- 対象: REQ-022からREQ-025の7シナリオと既存要件の回帰。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `npm run check`でBiome、Steiger、型検査、Coreテストを実行した。
`npm run test:visual`でChromiumの全描画テスト、`npm run test:extension`でビルドとVS Code拡張の統合テストを実行した。
- 結果: Core33件、Chromium19件、Extension4件が成功した。
Biome、Steiger、型検査、ビルドも成功した。
- 証跡: [新しい描画テスト](../tests/visual/preview-appearance.spec.ts)、[配置回帰](../tests/visual/layout-regression.spec.ts)、[Core配置](../tests/core/layout-regression.test.ts)、[Extension統合](../tests/extension/preview.test.ts)。
- 未検証事項: VS Code開発ホストのダーク・ライト両テーマの目視確認とOpenSpec全体照合は後続タスクで実施する。

### align-preview-with-html-sample - 2026-10-29 分岐と配置

- 対象: REQ-025-S01、REQ-025-S02。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 背景付きフラグメントラベルの欠如による2件の失敗を先に確認した。
実装後に新しい2件、配置回帰2件、`alt`の1件、ほかのフラグメント1件と関連Core12件をChromiumとVitestで実行した。
HTML試作をChromiumで撮影し、新しい基準DSL画像と並べて確認した。
- 結果: 対象と既存の計18件が成功した。
Objectの種別色、処理カード、DBとFILEの見出し付きカード、SQL、分岐ラベルは試作に近い。
専用のDSL編集欄は製品ではVS Codeエディタが担い、図面の縦寸法とカード寸法は可変内容に合わせている。
基準DSLのcaseラベルはFE活性バーより左にあり、内容を隠さない。
- 証跡: [新しい描画テスト](../tests/visual/preview-appearance.spec.ts)、[新しいChromium画像](../docs/images/align-preview-login.png)、[参照HTML画像](../docs/images/align-preview-reference.png)、[参照HTML](changes/archive/2026-10-29-glitchflow-spec/glitchflow-sample.html)。
- 未検証事項: VS Code開発ホストのダーク・ライト両テーマは全体検証で確認する。

### align-preview-with-html-sample - 2026-10-29 StateとSQL

- 対象: REQ-024-S01、REQ-024-S02、既存REQ-009からREQ-011。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 新しい2件のテストで見出し欠如による失敗を先に確認した。
実装後に`tests/visual/preview-appearance.spec.ts`の対象2件、`tests/visual/state.spec.ts`の3件、`tests/core/state-layout.test.ts`の4件を実行した。
- 結果: 対象2件、既存のChromium3件、Core4件が成功した。
共有境界の1pxの線幅を既存のSQL配置テストに反映した。
- 証跡: [新しい描画テスト](../tests/visual/preview-appearance.spec.ts)、[既存描画テスト](../tests/visual/state.spec.ts)、[Coreテスト](../tests/core/state-layout.test.ts)。
- 未検証事項: HTML試作との全体画像比較は後続タスクで実施する。

### align-preview-with-html-sample - 2026-10-29 メッセージと処理

- 対象: REQ-023-S01、既存REQ-007、REQ-008の描画。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 背景付きラベルのPlaywrightテストを先に実行し、未実装による失敗を確認した。
実装後に対象テストと`tests/visual/sequence.spec.ts`をChromiumで実行した。
- 結果: 対象1件と既存2件が成功した。
SVGテキストが背景内に収まることと応答の破線を確認した。
- 証跡: [新しい描画テスト](../tests/visual/preview-appearance.spec.ts)、[既存描画テスト](../tests/visual/sequence.spec.ts)。
- 未検証事項: 全体の画像比較は後続タスクで実施する。

### align-preview-with-html-sample - 2026-10-29 Object表示

- 対象: REQ-022-S01、REQ-022-S02。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: 基準DSLとFEATURE、MODULEを使うPlaywrightテストを先に実行し、二段表示の欠如による2件の失敗を確認した。
暗色パレットと種別表示の実装後、同じテストをChromiumで再実行した。
- 結果: 対象2件が成功した。
ライトテーマはWebviewのCSS変数を白にした相当条件で確認した。
- 証跡: [描画テスト](../tests/visual/preview-appearance.spec.ts)、[基準DSL](../examples/login.glf)。
- 未検証事項: VS Code開発ホストでのライトテーマと通常エディタへの影響は全体検証で確認する。

### stabilize-layout - 2026-10-29 アーカイブ

- 対象: [D-01からD-03](changes/archive/2026-10-29-stabilize-layout/design.md)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: OpenSpecの成果物とタスクの完了、`skip_specs: true`による差分仕様の省略、アーカイブ先の未使用を確認した。
  変更を`changes/archive/2026-10-29-stabilize-layout/`へ移し、台帳と成果物の相対リンクを更新した。
- 結果: 成果物は完了または意図的な省略、タスクは5/5件完了である。
  同期する差分仕様はなく、正式仕様に変更はない。
- 証跡: [アーカイブ済み提案](changes/archive/2026-10-29-stabilize-layout/proposal.md)、[タスク](changes/archive/2026-10-29-stabilize-layout/tasks.md)、[Verify報告](changes/archive/2026-10-29-stabilize-layout/verification.md)。
- 未検証事項: なし。

### stabilize-layout - 2026-10-29 レイアウト回帰と基本操作

- 対象: [D-01](changes/archive/2026-10-29-stabilize-layout/design.md#d-01---配置の構造をcoreで検査する)、[D-02](changes/archive/2026-10-29-stabilize-layout/design.md#d-02---chromiumで描画境界と前面順を検査する)、[D-03](changes/archive/2026-10-29-stabilize-layout/design.md#d-03---基本操作を同一画面で確認する)。
- 実行日: 2026-10-29 JST。
- 対象の版: この作業ツリーの未コミット差分。
- 方法: `examples/login.glf`と小画面のプレビューで`npm run check`、`npm run test:visual`、`npm run test:extension`、`git diff --check`を実行した。
  Chromiumの全体画像と右下端の画像を目視した。
- 結果: Coreの33件、Chromiumの12件、Extensionの4件が成功した。
  ライフライン中心、矢印端点、State寸法、DBセル境界、フラグメントの前面順、活性終了、倍率変更、縦横スクロール、文書更新を確認した。
  最初の`npm run check`は新しいテストのNodeList反復と`findLastIndex`が型検査で失敗したため、互換な`Array.from`と`lastIndexOf`へ修正して再実行し、成功した。
  全体画像ではDB表、SQL、FILEツリー、分岐枠と活性の終了位置に切れや不自然な重なりは見つからなかった。
- 証跡: [Core回帰テスト](../tests/core/layout-regression.test.ts)、[Chromium回帰テスト](../tests/visual/layout-regression.spec.ts)、`test-results/stabilize-layout-diagram.png`、`test-results/stabilize-layout-right-bottom.png`、[Verify報告](changes/archive/2026-10-29-stabilize-layout/verification.md)。
- 未検証事項: CIサービス上での実行は、実行先が未選択のため未実施である。

### support-other-fragments - 2026-10-29 アーカイブ

- 対象: REQ-018からREQ-021。
- 方法: 差分仕様の4要件と5シナリオを[正式仕様](specs/other-fragments/spec.md)へ同期した。
  `npx --no-install openspec validate --specs`で全7仕様の成功を確認した。
  変更を[アーカイブ](changes/archive/2026-10-29-support-other-fragments/proposal.md)へ移し、台帳の参照を更新した。
- 結果: 正式仕様と差分仕様の要件本文、シナリオが一致する。
- 証跡: [正式仕様](specs/other-fragments/spec.md)、[差分仕様](changes/archive/2026-10-29-support-other-fragments/specs/other-fragments/spec.md)。

### support-other-fragments - 2026-10-29 複合フラグメント検証

- 対象: REQ-018からREQ-021の全5シナリオ。
- 方法: Coreテスト、Chromium描画テスト、`npm run check`、`npm run test:visual`、OpenSpec strict検証、Verifyで照合する。
- 結果: `npm run check`はCore 30件を含め成功し、`npm run test:visual`はChromium 10件すべて成功した。
  上下のスクリーンショットでラベル、枠、区画線、後続イベントの表示を確認した。
  既存`alt`の回帰テストも成功した。
- 証跡: [Core](../tests/core/other-fragments.test.ts)、[Chromium](../tests/visual/other-fragments.spec.ts)、[Verify](changes/archive/2026-10-29-support-other-fragments/verification.md)。

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
| stabilize-layout | 既存表示の配置回帰と基本操作の検証 | [提案](changes/archive/2026-10-29-stabilize-layout/proposal.md) | [D-01](changes/archive/2026-10-29-stabilize-layout/design.md#d-01---配置の構造をcoreで検査する)、[D-02](changes/archive/2026-10-29-stabilize-layout/design.md#d-02---chromiumで描画境界と前面順を検査する)、[D-03](changes/archive/2026-10-29-stabilize-layout/design.md#d-03---基本操作を同一画面で確認する) | [タスク](changes/archive/2026-10-29-stabilize-layout/tasks.md) | [レイアウト回帰と基本操作](#stabilize-layout---2026-10-29-レイアウト回帰と基本操作) |
