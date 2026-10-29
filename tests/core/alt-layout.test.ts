import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

const measure = (text: string) => text.length * 8;

describe("alt fragment", () => {
  it("REQ-013 / REQ-013-S02: 出口の活性不一致を診断する", () => {
    const model = parseGlf(
      'Object FE as "FE" type APP\nFE+\nalt:\n    case 成功:\n        FE-\n    else:\n        FE: 継続',
    );
    expect(model.diagnostics.map((item) => item.code)).toContain(
      "activation-branch-mismatch",
    );
  });

  it("REQ-012 / REQ-012-S01、REQ-013 / REQ-013-S01: 基準DSLの両経路を配置する", () => {
    const model = parseGlf(readFileSync("examples/login.glf", "utf8"));
    const layout = layoutSequence(model, measure);
    expect(layout.fragments).toHaveLength(1);
    expect(layout.fragments[0].branches.map((branch) => branch.label)).toEqual([
      "ユーザヒット",
      "else",
    ]);
    expect(layout.fileStates).toHaveLength(1);
    expect(layout.processes.map((item) => item.text)).toContain(
      "ホーム画面表示",
    );
    expect(layout.processes.map((item) => item.text)).toContain(
      "エラーメッセージ表示",
    );
    expect(
      layout.messages.filter((item) => item.label === "200 OK"),
    ).toHaveLength(1);
    expect(
      layout.messages.filter((item) => item.label === "401 Unauthorized"),
    ).toHaveLength(1);
    const fe = layout.activations.filter((item) => item.objectId === "FE");
    expect(fe).toHaveLength(3);
    const home = layout.processes.find(
      (item) => item.text === "ホーム画面表示",
    );
    const error = layout.processes.find(
      (item) => item.text === "エラーメッセージ表示",
    );
    expect(
      fe.some((item) => home && item.startY < home.y && item.endY > home.y),
    ).toBe(true);
    expect(
      fe.some((item) => error && item.startY < error.y && item.endY > error.y),
    ).toBe(true);
    const [success, failure] = layout.fragments[0].branches;
    expect(layout.fileStates[0].y).toBeGreaterThan(success.y);
    expect(layout.fileStates[0].y + layout.fileStates[0].height).toBeLessThan(
      success.endY,
    );
    expect(home?.y).toBeGreaterThan(success.y);
    expect(home?.y).toBeLessThan(success.endY);
    expect(error?.y).toBeGreaterThan(failure.y);
    expect(error?.y).toBeLessThan(failure.endY);
    expect(fe[1].endY).toBeLessThanOrEqual(success.endY);
    expect(fe[2].endY).toBeLessThanOrEqual(failure.endY);
    expect(model.diagnostics.map((item) => item.code)).not.toContain(
      "activation-branch-mismatch",
    );
  });

  it("REQ-012 / REQ-012-S02: 入れ子の枠と処理を親区画に収める", () => {
    const model = parseGlf(
      'Object FE as "FE" type APP\nalt:\n    case 外側:\n        alt:\n            case 内側:\n                FE: A\n            else:\n                FE: B\n    else:\n        FE: C',
    );
    const layout = layoutSequence(model, measure);
    expect(layout.fragments).toHaveLength(2);
    const [outer, inner] = layout.fragments;
    expect(inner.y).toBeGreaterThan(outer.branches[0].y);
    expect(inner.y + inner.height).toBeLessThan(outer.branches[0].endY);
    expect(layout.processes.map((item) => item.text)).toEqual(["A", "B", "C"]);
  });
});
