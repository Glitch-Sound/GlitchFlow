# Design

## Context

- 提案: [stabilize-layout](proposal.md)。
- 対象仕様: [シーケンス](../../../specs/sequence-rendering/spec.md)、[状態](../../../specs/state-rendering/spec.md)、[分岐](../../../specs/alt-fragment/spec.md)、[操作](../../../specs/editor-integration/spec.md)、[その他のフラグメント](../../../specs/other-fragments/spec.md)。
- 前提と制約: [製品方針](../../../product.md#設計上の優先事項)と[検証配置](../../../structure.md#開発ツールとテスト)に従う。

## Goals / Non-Goals

**Goals:**

- 現行の配置規則をCoreの数値検査とChromiumの実描画検査で固定する。
- 基準DSLと小画面で、基本操作後も図の端まで確認できることを検査する。

**Non-Goals:**

- 表示仕様、DSL、公開APIの変更は行わない。

## Decisions

### D-01 - 配置の構造をCoreで検査する

- 対象: REQ-006、REQ-007、REQ-008、REQ-009、REQ-011、REQ-012、REQ-013。
- 選択: `examples/login.glf`を解析し、レーン中心、矢印の外縁接続、Stateの寸法、SQLとの間隔、分岐区画と活性終了を座標の関係で検査する。
- 理由: 固定ピクセル値の画像比較より、表示意図に直結する不変条件を検査できる。
- 代替案: SVG全体のスナップショットはフォントや環境の差に弱いため採用しない。
- 配置と依存: `tests/core/layout-regression.test.ts`がCoreの公開APIを使う。

### D-02 - Chromiumで描画境界と前面順を検査する

- 対象: REQ-006、REQ-007、REQ-009、REQ-010、REQ-012、REQ-017からREQ-020。
- 選択: SVG要素の`getBBox`、DOMの順序、スクロール位置をPlaywrightで検査する。
- 理由: テキストの実寸、枠の前面順、右下端への到達はCore座標だけでは判定できない。
- 代替案: スクリーンショットの目視だけでは回帰時に自動検出できない。
- 配置と依存: `tests/visual/layout-regression.spec.ts`が既存のViteプレビューを使う。

### D-03 - 基本操作を同一画面で確認する

- 対象: REQ-014、REQ-017。
- 選択: 小画面で拡大、縮小、等倍、縦横スクロール、文書更新を順に操作し、見出しと図が更新されることを検査する。
- 理由: 単独操作の既存テストに加え、実利用に近い連続操作で回帰を検出できる。
- 代替案: 手動確認だけでは再実行性が低い。
- 配置と依存: `tests/visual/layout-regression.spec.ts`と既存のExtension統合テストを使う。

## Traceability

| 目的 | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- |
| 配置座標 | [D-01](#d-01---配置の構造をcoreで検査する) | `tests/core/layout-regression.test.ts` | `npm run test`で中心、端点、寸法、活性を検査 |
| 実描画 | [D-02](#d-02---chromiumで描画境界と前面順を検査する) | `tests/visual/layout-regression.spec.ts` | `npm run test:visual`で切れ、重なり、前面順を検査 |
| 基本操作 | [D-03](#d-03---基本操作を同一画面で確認する) | `tests/visual/layout-regression.spec.ts` | 小画面で操作と更新を検査 |

## Verification Plan

- 正常、境界、異常: 基準DSLと小画面を扱う。異常入力の診断は既存テストで検査済みであり、新しい描画規則を追加しないため本変更では再定義しない。
- 非機能要件: 新規の性能要件はない。
- 手動確認: Chromiumで基準DSLの上部と分岐部の画像を確認し、文字の切れ、重なり、活性終了位置を記録する。
- 全体検証: `npm run check`、`npm run test:visual`、`npm run test:extension`、OpenSpec strict検証、Verify、`git diff --check`を実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-02 | フォントの幅が環境で異なる | 実寸と包含関係を比較し、固定スクリーンショットの一致を要求しない |
| D-03 | Extension統合テストはローカル環境に依存する | 実行可否と結果を台帳に明記する |

## Migration Plan

製品の入出力を変更しないため移行は不要である。

## Open Questions

なし。
