# Design

## Context

- 提案: [proposal.md](proposal.md)。
- 対象仕様: [REQ-022](specs/preview-appearance/spec.md)。
- 前提と制約: [レイアウトと描画](../../../tech.md#レイアウトと描画)に従い、座標はCoreで決める。

## Goals / Non-Goals

**Goals:**

- REQ-022-S03のObject枠と先頭活性の間隔を確保する。

**Non-Goals:**

- メッセージの直後に始まる活性の起点は変えない。

## Decisions

### D-01 - 先頭の活性開始位置を下限で守る

- 対象: REQ-022、REQ-022-S03。
- 選択: Coreの配置で活性開始イベントの座標にObject枠下端からの下限を設ける。
- 理由: 表示側で活性バーだけをずらすと、後続の処理とメッセージの時間軸が一致しなくなる。
- 代替案: SVG描画時の活性バーだけを下げる方法は、配置結果と表示結果が食い違うため採用しない。
- 配置と依存: [sequence-layout.ts](../../../../src/core/layout/sequence-layout.ts)の`layoutSequence`に置き、既存のレイアウトAPIを維持する。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-022 | REQ-022-S01 | [D-01](#d-01---先頭の活性開始位置を下限で守る) | `layoutSequence` | [既存Chromium](../../../../tests/visual/preview-appearance.spec.ts)の色と表示 |
| REQ-022 | REQ-022-S02 | [D-01](#d-01---先頭の活性開始位置を下限で守る) | `layoutSequence` | [既存Chromium](../../../../tests/visual/preview-appearance.spec.ts)の種別とテーマ |
| REQ-022 | REQ-022-S03 | [D-01](#d-01---先頭の活性開始位置を下限で守る) | `layoutSequence` | [Chromium](../../../../tests/visual/sequence.spec.ts)のObject枠と活性の座標 |

## Verification Plan

- 正常、境界、異常: 先頭の`FE+`をChromiumで測定し、メッセージ直後の活性位置は既存の配置テストで確認する。
- 非機能要件: 対象外である。
- 手動確認: 更新した[実画面](../../../../docs/images/multiline-process-preview.png)でObject枠と活性の間を目視確認する。
- 全体検証: `npm run check`、対象のPlaywrightテスト、OpenSpec strict検証を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 先頭イベントの後続要素も下がる | 既存の描画テストを実行する |

## Migration Plan

DSLと設定の移行は不要である。
修正が失敗した場合は配置の下限と回帰テストを見直す。

## Open Questions

なし。
