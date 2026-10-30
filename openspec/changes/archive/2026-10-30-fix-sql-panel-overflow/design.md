# Design

## Context

- 提案: [SQL枠の修正](proposal.md)。
- 対象仕様: [REQ-011](specs/state-rendering/spec.md#requirement-req-011---sqlの描画と状態配置)。
- 前提と制約: [レイアウトと描画](../../../tech.md#レイアウトと描画)に従い、Webviewで文字幅を計測し、Coreに数値だけを渡す。

## Goals / Non-Goals

**Goals:**

- REQ-011のSQL本文を表示フォントに合ったカード幅に収め、DB表と一続きに描画する。

**Non-Goals:**

- SQLの折り返し、実行、解析は扱わない。

## Decisions

### D-01 - SQLの表示フォントで幅を計測する

- 対象: REQ-011 / REQ-011-S01、REQ-011-S03。
- 選択: WebviewがDB表用に渡している12pxの等幅フォントの計測関数を、CoreのSQLパネル幅にも適用する。
- 理由: 現在のCoreはSQLを14pxの一般文字列用フォントで測り、SVGでは12pxの等幅フォントで描くため、狭い字形が多い行で幅が不足する。
- 代替案: 固定の余白を大きくする方式は文字列とフォントごとの差を保証できず、図も不要に広がる。
- 配置と依存: `src/webview/pages/preview/ui/render-preview.ts`の既存計測関数を、`src/core/layout/sequence-layout.ts`でSQL幅に適用する。

### D-02 - 表とSQLの共通幅を維持する

- 対象: REQ-011 / REQ-011-S01、REQ-011-S02、REQ-011-S03。
- 選択: 同じDBのState直後のSQLでは既存の共通幅計算を使い、拡大したSQL幅をStateにも反映する。
- 理由: SQL本文のために必要な横幅を確保しつつ、表とSQLの接続、次のイベントとの間隔を維持できる。
- 代替案: SQL文字をクリップする方式は全文表示の要件と合わない。
- 配置と依存: `src/core/layout/sequence-layout.ts`のStateとSQLの結合処理を回帰テストで検査する。

## Traceability

| 要件ID | シナリオID | 設計節 | 実装予定箇所 | 検証方法とテスト予定 |
| --- | --- | --- | --- | --- |
| REQ-011 | REQ-011-S01 | [D-01](#d-01---sqlの表示フォントで幅を計測する)、[D-02](#d-02---表とsqlの共通幅を維持する) | `render-preview.ts`の計測、`sequence-layout.ts`のSQL幅 | `tests/visual/state.spec.ts`で表とSQLの接続を確認する。 |
| REQ-011 | REQ-011-S02 | [D-02](#d-02---表とsqlの共通幅を維持する) | `sequence-layout.ts` | `tests/core/state-layout.test.ts`で記述位置を確認する。 |
| REQ-011 | REQ-011-S03 | [D-01](#d-01---sqlの表示フォントで幅を計測する)、[D-02](#d-02---表とsqlの共通幅を維持する) | `render-preview.ts`の計測、`sequence-layout.ts`のSQL幅 | `tests/visual/state.spec.ts`で文字と枠の実座標、表の幅、スクロール範囲を検査する。 |

## Verification Plan

- 正常、境界、異常: S01とS02の既存テストを維持し、S03に幅不足を起こすSQL行を使う。
  SQLの構文エラーは描画変更の対象外である。
- 非機能要件: 対象なし。
- 手動確認: READMEのサンプルからプレビュー画像を再生成し、SQL本文と右枠を目視する。
- 全体検証: `npm run check`、`npm run test:visual`、OpenSpec strict検証、差分チェックを実行する。

## Risks / Trade-offs

| 対象IDまたは設計節 | リスクや制約 | 対処と検証 |
| --- | --- | --- |
| D-01 | 実行環境のフォント代替で計測幅が変わる。 | 表示と計測のフォント指定を一致させ、Chromiumの実座標で境界を検査する。 |

## Migration Plan

DSLとIRに変更はない。
既存文書の移行は不要であり、問題があれば計測関数の適用を戻せる。

## Open Questions

なし。
