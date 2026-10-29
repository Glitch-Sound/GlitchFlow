# Tasks

## 1. 構文と活性診断

設計: [D-01](design.md#d-01---共通のフラグメントir)、[D-02](design.md#d-02---経路出口の活性)。

- [x] 1.1 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01、REQ-021/REQ-021-S01、REQ-021-S02] Coreの構文・診断テストを追加し、`npm test`で未実装による失敗を確認する。
- [x] 1.2 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01、REQ-021/REQ-021-S01、REQ-021-S02] Parser、IR、Validatorを実装し、`npm test`で対象テストの成功を確認する。

## 2. 配置と表示

設計: [D-03](design.md#d-03---既存レイアウトへの展開)。

- [x] 2.1 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01] Core配置とChromium表示テストを追加し、未実装による失敗を確認する。
- [x] 2.2 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01] LayoutとRendererを実装し、対象テストの成功を確認する。
- [x] 2.3 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01、REQ-021/REQ-021-S01、REQ-021-S02] DSL例と台帳を更新し、仕様から実装とテストへのリンクを確認する。

## 3. 全体の整合性と検証

設計: [検証計画](design.md#verification-plan)。

- [x] 3.1 [REQ-018/REQ-018-S01、REQ-019/REQ-019-S01、REQ-020/REQ-020-S01、REQ-021/REQ-021-S01、REQ-021-S02] `npm run check`と`npm run test:visual`を実行し、Chromium画像と差分を確認して台帳に記録する。
- [x] 3.2 [REQ-018、REQ-019、REQ-020、REQ-021] `support-other-fragments`のOpenSpec strict検証とVerifyを行い、対応と未解決事項を`verification.md`に記録する。

## Workflow follow-up

- config.yamlのarchive運用に従ってアーカイブし、移動後の参照を確認する。
