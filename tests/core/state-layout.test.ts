import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

const measure = (value: string) => value.length * 10;

describe("state layout", () => {
  it("REQ-009 / REQ-009-S01、REQ-025 / REQ-025-S01: 全カラムの幅を取り図面内に収める", () => {
    const doc = parseGlf(
      'Object DB as "DB" type DB\nObject FILE as "FILE" type FILE\nschema DB.users:\n    uid: int\n    name: text\n    password_hash: text\n    created_at: datetime\n    deleted_at: datetime\nstate DB.users:\n    [1, "a long name", "hashed-xxx", "2026-10-27 22:00:00", null]',
    );
    const layout = layoutSequence(doc, measure);
    expect(layout.dbStates).toHaveLength(1);
    expect(layout.dbStates[0].columns).toHaveLength(5);
    expect(layout.dbStates[0].x).toBeGreaterThan(layout.lifelines[0].x);
    expect(layout.dbStates[0].x + layout.dbStates[0].width).toBeLessThan(
      layout.width,
    );
    expect(layout.lifelines[1].x - layout.lifelines[0].x).toBeLessThanOrEqual(
      300,
    );
  });

  it("REQ-010 / REQ-010-S01: FILE階層の幅と高さを確保する", () => {
    const doc = parseGlf(
      'Object FILE as "FILE" type FILE\nstate FILE:\n    users/\n        1/\n            + new.info\nFILE: after',
    );
    const layout = layoutSequence(doc, measure);
    expect(layout.fileStates[0].nodes.map((node) => node.depth)).toEqual([
      0, 1, 2,
    ]);
    expect(layout.fileStates[0].y + layout.fileStates[0].height).toBeLessThan(
      layout.processes[0].y,
    );
  });

  it("REQ-011 / REQ-011-S01: SQLをStateの下に置く", () => {
    const doc = parseGlf(
      'Object DB as "DB" type DB\nschema DB.users:\n    id: int\nstate DB.users:\n    [1]\nsql DB:\n    SELECT id\n    FROM users\nDB: after',
    );
    const layout = layoutSequence(doc, measure);
    expect(layout.dbStates).toHaveLength(1);
    expect(layout.sqlBlocks).toHaveLength(1);
    expect(layout.sqlBlocks[0].y).toBeGreaterThanOrEqual(
      layout.dbStates[0].y + layout.dbStates[0].height,
    );
    expect(layout.sqlBlocks[0].y + layout.sqlBlocks[0].height).toBeLessThan(
      layout.processes[0].y,
    );
  });

  it("REQ-011 / REQ-011-S02: StateとSQLを記述位置にだけ置く", () => {
    const doc = parseGlf(
      'Object DB as "DB" type DB\nschema DB.users:\n    id: int\nDB: before\nstate DB.users:\n    [1]\nDB: after\nsql DB:\n    SELECT id',
    );
    const layout = layoutSequence(doc, measure);
    expect(layout.dbStates).toHaveLength(1);
    expect(layout.sqlBlocks).toHaveLength(1);
    expect(layout.processes[0].y).toBeLessThan(layout.dbStates[0].y);
    expect(layout.dbStates[0].y + layout.dbStates[0].height).toBeLessThan(
      layout.processes[1].y,
    );
    expect(layout.processes[1].y).toBeLessThan(layout.sqlBlocks[0].y);
  });

  it("連続する複数テーブルのStateとSQLを共通幅で接続する", () => {
    const doc = parseGlf(
      'Object DB as "DB" type DB\nschema DB.sessions:\n    id: text\nschema DB.audit:\n    event: text\nstate DB.sessions:\n    ["S-42"]\nstate DB.audit:\n    ["isolated"]\nsql DB:\n    UPDATE sessions SET status = \'isolated\' RETURNING id;\nDB: after\nstate DB.sessions:\n    ["S-43"]',
    );
    const layout = layoutSequence(doc, measure);
    const [first, second, later] = layout.dbStates;
    const sql = layout.sqlBlocks[0];
    expect(layout.dbStates).toHaveLength(3);
    expect(second.y).toBe(first.y + first.height);
    expect(sql.y).toBe(second.y + second.height);
    expect([first.x, second.x, sql.x]).toEqual([first.x, first.x, first.x]);
    expect([first.width, second.width, sql.width]).toEqual([
      sql.width,
      sql.width,
      sql.width,
    ]);
    expect(sql.y + sql.height).toBeLessThan(layout.processes[0].y);
    expect(later.y).toBeGreaterThan(layout.processes[0].y);
  });
});
