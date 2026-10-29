import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

const measure = (text: string) => text.length * 8;

describe("layoutSequence", () => {
  it("REQ-006 / REQ-006-S01: 宣言順のレーンと時間順のイベント", () => {
    const document = parseGlf(
      'Object FE as "FE" type APP\nObject BE as "BE" type API\nObject DB as "DB" type DB\nFE ->> BE: call\nBE ->> DB: query',
    );
    const layout = layoutSequence(document, measure);
    expect(layout.lifelines.map((lane) => lane.id)).toEqual(["FE", "BE", "DB"]);
    expect(layout.lifelines[0].x).toBeLessThan(layout.lifelines[1].x);
    expect(layout.lifelines[1].x).toBeLessThan(layout.lifelines[2].x);
    expect(layout.messages[0].y).toBeLessThan(layout.messages[1].y);
  });

  it("REQ-008 / REQ-008-S01: 明示的な活性は途中のメッセージを通過する", () => {
    const document = parseGlf(
      'Object FE as "FE" type APP\nFE+\nFE: *起動処理*\nGlobal ->> FE: 入力\nFE-',
    );
    const layout = layoutSequence(document, measure);
    expect(layout.activations).toHaveLength(1);
    expect(layout.activations[0].startY).toBeLessThan(layout.messages[0].y);
    expect(layout.activations[0].endY).toBeGreaterThan(layout.messages[0].y);
    expect(layout.processes[0].emphasis).toBe(true);
  });

  it("REQ-008 / REQ-008-S02: 未宣言の参照を配置せず既知の処理を残す", () => {
    const document = parseGlf(
      'Object FE as "FE" type APP\nFE ->> X: call\nFE: work',
    );
    const layout = layoutSequence(document, measure);
    expect(layout.messages).toHaveLength(0);
    expect(layout.processes).toHaveLength(1);
    expect(layout.lifelines).toHaveLength(1);
  });

  it("REQ-007 / REQ-007-S02: 要求直後に始まる活性の外縁へ接続する", () => {
    const document = parseGlf(
      'Object FE as "FE" type APP\nObject BE as "BE" type API\nFE ->> BE: 保存\nBE+\nBE-',
    );
    const layout = layoutSequence(document, measure);
    expect(layout.messages[0].x2).toBe(layout.lifelines[1].x - 9);
  });

  it("REQ-006 / REQ-006-S01: 長いGlobalラベルと処理に必要な幅を確保する", () => {
    const document = parseGlf(
      'Object FE as "FE" type APP\nObject BE as "BE" type API\nGlobal ->> FE: 長い長い長いラベル\nFE: 長い長い長い処理',
    );
    const layout = layoutSequence(document, measure);
    expect(layout.messages[0].x1 + layout.messages[0].x2).toBeGreaterThan(
      measure("長い長い長いラベル"),
    );
    expect(layout.lifelines[1].x - layout.processes[0].x).toBeGreaterThan(
      measure("長い長い長い処理"),
    );
  });
});
