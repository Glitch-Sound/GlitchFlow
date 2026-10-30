import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

const header = 'Object FE as "FE" type APP\n';
const measure = (text: string) => text.length * 8;

describe("other fragments", () => {
  it("REQ-018 / REQ-018-S01、REQ-019 / REQ-019-S01、REQ-020 / REQ-020-S01: DSL例を解析する", () => {
    const model = parseGlf(
      readFileSync("examples/other-fragments.glf", "utf8"),
    );
    expect(model.diagnostics).toEqual([]);
    expect(model.events.map((event) => event.kind)).toEqual([
      "opt",
      "loop",
      "par",
      "break",
      "process",
    ]);
  });

  it("REQ-018 / REQ-018-S01: optとloopの本体を保持する", () => {
    const model = parseGlf(
      `${header}opt 許可:\n    FE: A\nloop 再試行:\n    FE: B`,
    );
    expect(model.diagnostics).toEqual([]);
    expect(model.events.map((event) => event.kind)).toEqual(["opt", "loop"]);
  });

  it("REQ-019 / REQ-019-S01: parの2区画を保持する", () => {
    const model = parseGlf(
      `${header}par:\n    case A:\n        FE: A\n    case B:\n        FE: B`,
    );
    expect(model.diagnostics).toEqual([]);
    expect(model.events[0].kind).toBe("par");
  });

  it("REQ-019 / REQ-019-S01: parの枠が右端レーンの処理カードを収める", () => {
    const model = parseGlf(
      'Object FE as "画面" type APP\nObject BE as "API" type API\npar:\n    case 画面更新:\n        FE: 表示を更新\n    case 記録:\n        BE: 履歴を記録',
    );
    const layout = layoutSequence(model, measure);
    expect(model.diagnostics).toEqual([]);
    const fragment = layout.fragments[0];
    const process = layout.processes.find((item) => item.text === "履歴を記録");
    expect(process).toBeDefined();
    expect(fragment.x + fragment.width).toBeGreaterThanOrEqual(
      (process?.x ?? 0) + measure(process?.text ?? "") + 28,
    );
  });

  it("REQ-020 / REQ-020-S01: break後もイベントを保持する", () => {
    const model = parseGlf(`${header}break エラー:\n    FE: エラー\nFE: 後続`);
    expect(model.diagnostics).toEqual([]);
    expect(model.events.map((event) => event.kind)).toEqual([
      "break",
      "process",
    ]);
  });

  it("REQ-021 / REQ-021-S01: 空本体、区画数、loop出口を診断する", () => {
    const model = parseGlf(
      `${header}FE+\nopt 許可:\npar:\n    case A:\n        FE: A\nloop 再試行:\n    FE-`,
    );
    expect(model.diagnostics.map((item) => item.code)).toContain("indent");
    expect(model.diagnostics.map((item) => item.code)).toContain(
      "fragment-branches",
    );
    expect(model.diagnostics.map((item) => item.code)).toContain(
      "activation-fragment-mismatch",
    );
  });

  it("REQ-021 / REQ-021-S02: parの活性不一致を診断する", () => {
    const model = parseGlf(
      `${header}FE+\npar:\n    case A:\n        FE-\n    case B:\n        FE: B`,
    );
    expect(model.diagnostics.map((item) => item.code)).toContain(
      "activation-fragment-mismatch",
    );
  });

  it("REQ-021 / REQ-021-S02: parの全区画が同じ活性を終了しても開始状態との不一致を診断する", () => {
    const model = parseGlf(
      `${header}FE+\npar:\n    case A:\n        FE-\n    case B:\n        FE-`,
    );
    expect(model.diagnostics.map((item) => item.code)).toContain(
      "activation-fragment-mismatch",
    );
  });

  it("REQ-018 / REQ-018-S01、REQ-021 / REQ-021-S01: 入れ子と明示的な活性を維持する", () => {
    const model = parseGlf(
      `${header}FE+\nopt 許可:\n    loop 再試行:\n        FE: 処理\nFE-`,
    );
    const layout = layoutSequence(model, measure);
    expect(model.diagnostics).toEqual([]);
    expect(layout.fragments).toHaveLength(2);
    expect(layout.fragments[1].y).toBeGreaterThan(
      layout.fragments[0].branches[0].y,
    );
    expect(layout.fragments[1].y + layout.fragments[1].height).toBeLessThan(
      layout.fragments[0].branches[0].endY,
    );
    expect(layout.activations.at(-1)?.endY).toBeGreaterThan(
      layout.fragments[0].y + layout.fragments[0].height,
    );
  });

  it("REQ-018 / REQ-018-S01、REQ-019 / REQ-019-S01、REQ-020 / REQ-020-S01: 枠と後続を配置する", () => {
    const model = parseGlf(
      `${header}opt 許可:\n    FE: A\nloop 再試行:\n    FE: B\npar:\n    case X:\n        FE: C\n    case Y:\n        FE: D\nbreak エラー:\n    FE: E\nFE: F`,
    );
    const layout = layoutSequence(model, measure);
    expect(layout.fragments.map((item) => item.kind)).toEqual([
      "opt",
      "loop",
      "par",
      "break",
    ]);
    expect(layout.fragments[2].branches).toHaveLength(2);
    expect(layout.processes.map((item) => item.text)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);
    expect(layout.processes[5].y).toBeGreaterThan(
      layout.fragments[3].y + layout.fragments[3].height,
    );
  });

  it("継続中の活性を各複合フラグメントの下端までつなぐ", () => {
    const bodies = [
      "alt:\n    case A:\n        FE: A\n    else:\n        FE: B",
      "opt 条件:\n    FE: A",
      "loop 再試行:\n    FE: A",
      "par:\n    case A:\n        FE: A\n    case B:\n        FE: B",
      "break 中断:\n    FE: A",
    ];
    for (const body of bodies) {
      const model = parseGlf(`${header}FE+\n${body}\nFE-`);
      expect(model.diagnostics).toEqual([]);
      const layout = layoutSequence(model, measure);
      const fragment = layout.fragments[0];
      const bottom = fragment.y + fragment.height;
      expect(
        layout.activations.some(
          (activation) =>
            activation.objectId === "FE" &&
            activation.startY < bottom &&
            activation.endY > bottom,
        ),
        fragment.kind,
      ).toBe(true);
    }
  });
});
