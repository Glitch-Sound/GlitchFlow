# Verification Report: support-alt-fragment

## Summary

| Dimension | Status |
| --- | --- |
| Completeness | 7/7タスク、2/2要件、4/4シナリオを確認 |
| Correctness | 2/2要件の実装、4/4シナリオのテストを確認 |
| Coherence | D-01からD-03に沿う配置と責務を確認 |

## Completeness

- REQ-012はCore LayoutとWebviewのフラグメント描画に対応する。
- REQ-013はValidatorの出口診断とCore Layoutの経路別活性に対応する。
- `tasks.md`の7件に実装、テスト、検証結果が対応する。

## Correctness

- REQ-012-S01: 基準DSLの成功、失敗経路、FILE状態、枠、ラベルをCoreとChromiumで確認した。
- REQ-012-S02: 入れ子の枠の包含と3つの処理をCoreで確認した。
- REQ-013-S01: 各経路のFE活性が表示処理を通り、各区画の終了前に終わることをCoreで確認した。
- REQ-013-S02: 一方の経路だけでFEを閉じる入力に`activation-branch-mismatch`が付くことをCoreで確認した。

## Coherence

- D-01: IRの`alt`を経路境界付きの時間軸に展開し、既存のState計測と同じ配置処理を使う。
- D-02: Validatorは経路ごとに活性Mapを複製し、Layoutは分岐ごとに活性区間を計算する。
- D-03: SVGのイベントとStateの後に透明な枠、ラベル、分岐線を描く。
- 新規ファイル名と責務は既存のCore、Webview、テスト配置に従う。

## Evidence

- `npm run check`: 成功。Core 21件、Biome、Steiger、型検査が成功した。
- `npm run test:visual`: 成功。Chromium 7件が成功した。
- `npx --no-install openspec validate support-alt-fragment --strict`: 成功した。
- `git diff --check`: 成功した。
- `test-results/render-alt.png`と`test-results/render-alt-right.png`: Chromiumで分岐線、`else`、成功側のFILE状態、活性、右端の枠を確認した。
- OpenSpec CLI 1.15.0には`verify`コマンドがないため、`openspec-verify-change`のCompleteness、Correctness、Coherenceに従って照合した。

## Issues

- CRITICAL: なし。
- WARNING: なし。
- SUGGESTION: なし。

## Final Assessment

全チェックを通過した。
アーカイブの準備ができている。
