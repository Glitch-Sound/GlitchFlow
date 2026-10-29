import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

const document = parseGlf(readFileSync("examples/login.glf", "utf8"));
const layout = layoutSequence(document, (text) => text.length * 9);

describe("stabilize-layout: 基準DSLの配置回帰", () => {
  it("REQ-006 / REQ-006-S01、REQ-007 / REQ-007-S01: レーン中心と矢印端点", () => {
    const centers = new Map(layout.lifelines.map((lane) => [lane.id, lane.x]));
    expect([...centers.keys()]).toEqual(["FE", "BE", "DB", "FILE"]);
    for (const message of layout.messages) {
      const source = centers.get(message.from);
      const target = centers.get(message.to);
      expect(target).toBeDefined();
      if (source === undefined) {
        expect(message.from).toBe("Global");
        expect(message.x1).toBe(52);
      } else {
        expect(Math.abs(message.x1 - source)).toBeLessThanOrEqual(9);
      }
      expect(Math.abs(message.x2 - (target ?? 0))).toBeLessThanOrEqual(9);
      expect(message.x1).toBeGreaterThanOrEqual(0);
      expect(message.x2).toBeLessThanOrEqual(layout.width);
    }
  });

  it("REQ-009 / REQ-009-S01、REQ-011 / REQ-011-S01: Stateの寸法とSQL間隔", () => {
    const db = layout.dbStates[0];
    const sql = layout.sqlBlocks[0];
    const file = layout.fileStates[0];
    expect(db.columns).toHaveLength(5);
    expect(db.width).toBe(
      db.columnWidths.reduce((sum, width) => sum + width, 0),
    );
    expect(db.height).toBe(60 + db.rows.length * 28);
    expect(sql.y).toBe(db.y + db.height);
    expect(sql.x).toBe(db.x);
    for (const box of [db, sql, file]) {
      expect(box.x).toBeGreaterThan(
        layout.lifelines.find((lane) => lane.id === box.objectId)?.x ?? 0,
      );
      expect(box.x + box.width).toBeLessThan(layout.width);
      expect(box.y + box.height).toBeLessThan(layout.height);
    }
  });

  it("REQ-012 / REQ-012-S01、REQ-013 / REQ-013-S01: 分岐内のStateと活性終了", () => {
    const fragment = layout.fragments[0];
    expect(fragment.branches).toHaveLength(2);
    const [success, failure] = fragment.branches;
    const file = layout.fileStates[0];
    expect(file.y).toBeGreaterThan(success.y);
    expect(file.y + file.height).toBeLessThan(success.endY);
    for (const [branch, processText] of [
      [success, "ホーム画面表示"],
      [failure, "エラーメッセージ表示"],
    ] as const) {
      const process = layout.processes.find(
        (item) => item.text === processText,
      );
      expect(process).toBeDefined();
      expect(process?.y).toBeGreaterThan(branch.y);
      expect(process?.y).toBeLessThan(branch.endY);
      expect(
        layout.activations.some(
          (activation) =>
            activation.objectId === "FE" &&
            activation.startY < (process?.y ?? 0) &&
            activation.endY > (process?.y ?? 0) &&
            activation.endY <= branch.endY,
        ),
      ).toBe(true);
    }
  });
});
