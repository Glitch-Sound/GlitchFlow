# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [REQ-002](specs/glf-parsing/spec.md)、[REQ-008](specs/sequence-rendering/spec.md)、[REQ-023](specs/preview-appearance/spec.md)。
- 前提と制約: [DSLと中間モデル](../../../tech.md#dslと中間モデル)、[レイアウトと描画](../../../tech.md#レイアウトと描画)に従う。

## Goals / Non-Goals

**Goals:**

- REQ-002、REQ-008、REQ-023の複数行処理を、既存の1行処理と同じ経路で扱う。

**Non-Goals:**

- メッセージやフラグメントのラベルは、独立した配置規則を持つため変更しない。

## Decisions

### D-01 - インデントした行を処理へまとめる

- 対象: REQ-002-S03、REQ-002-S04。
- 選択: `parseEvents`で処理行の直後に4空白下げた行を消費し、改行を保つ1つの`process`イベントを作る。
- 理由: 既存の`state`と`sql`のブロック規則にそろえられ、行番号は処理ヘッダを示せる。
- 代替案: `\n`を入力文字として扱う方式はDSLで実際の行を編集しにくいため採らない。
- 配置と依存: `src/core/parser/parse-glf.ts`から既存のIR型を利用する。

### D-02 - 最長行と行数で配置する

- 対象: REQ-008-S03。
- 選択: 処理の幅は各行の最大幅、高さは行数から計算し、後続イベントのY座標へ追加の高さを反映する。
- 理由: 横方向の切断と縦方向の重なりを防ぎ、活性と分岐の時間軸も保てる。
- 代替案: CSSによる自動折り返しはDSLの改行位置と図の行数を一致させられないため採らない。
- 配置と依存: `src/core/layout/sequence-layout.ts`で寸法を計算し、CoreからWebviewへの依存を作らない。

### D-03 - SVGの行ごとにtspanを描く

- 対象: REQ-023-S02。
- 選択: 1つのカード内に行ごとの`tspan`を置き、文字はDOMテキストとして残す。
- 理由: 通常と強調の字体をまとめて適用でき、行ごとの選択も保てる。
- 代替案: 文字を画像化すると選択できなくなるため採らない。
- 配置と依存: `src/webview/pages/preview/ui/render-preview.ts`がCoreの寸法を利用する。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-002 | REQ-002-S01、S02 | [D-01](#d-01---インデントした行を処理へまとめる) | `parse-glf.ts` | `parse-glf.test.ts`既存回帰 |
| REQ-002 | REQ-002-S03、S04 | [D-01](#d-01---インデントした行を処理へまとめる) | `parse-glf.ts` | `parse-glf.test.ts`複数行と空本文 |
| REQ-008 | REQ-008-S01、S02 | [D-02](#d-02---最長行と行数で配置する) | `sequence-layout.ts` | `sequence-layout.test.ts`既存回帰 |
| REQ-008 | REQ-008-S03 | [D-02](#d-02---最長行と行数で配置する) | `sequence-layout.ts` | `sequence-layout.test.ts`寸法と順序 |
| REQ-023 | REQ-023-S01 | [D-03](#d-03---svgの行ごとにtspanを描く) | `render-preview.ts` | `preview-appearance.spec.ts`既存回帰 |
| REQ-023 | REQ-023-S02 | [D-03](#d-03---svgの行ごとにtspanを描く) | `render-preview.ts` | `sequence.spec.ts`文字とカード境界 |

## Verification Plan

- 正常、境界、異常: 通常と強調、ヘッダ本文ありとなし、空の`FE:`、分岐内の処理を確認する。
- 非機能要件: 対象なし。
- 手動確認: 自動化するため必須項目はなし。
- 全体検証: `npm run check`と対象のPlaywrightテストを実行し、差分仕様を検証する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| [D-01](#d-01---インデントした行を処理へまとめる) | 継続行の境界 | 分岐内と後続イベントのテスト |
| [D-02](#d-02---最長行と行数で配置する) | カード重なり | SVGの座標と境界の検査 |

## Migration Plan

既存の1行処理はそのまま利用できる。
失敗時は新しい継続行の解釈と行数分の配置変更を戻す。

## Open Questions

なし。
