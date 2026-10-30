import { describe, expect, it } from "vitest";
import { layoutSequence, mergeGlfDefinitions, parseGlf } from "../../src/core";

describe("GLF imports", () => {
  it("REQ-035 / REQ-035-S01、REQ-035-S03: 定義だけを合成し、定義元を保持する", () => {
    const root = parseGlf('import "./common.glf"\nstate DB.users:\n    [1]\n', {
      validate: false,
    });
    const common = parseGlf(
      'title: "共通"\nObject DB as "Database" type DB\nschema DB.users:\n    id: int\nDB -> DB: ignored\n',
      { validate: false },
    );
    expect(root.imports).toEqual([{ path: "./common.glf", line: 1 }]);
    const merged = mergeGlfDefinitions(root, [
      { uri: "file:///common.glf", importLine: 1, document: common },
    ]);
    expect(merged.objects).toMatchObject([
      { id: "DB", origin: { uri: "file:///common.glf", line: 2 } },
    ]);
    expect(merged.schemas).toMatchObject([
      {
        reference: { raw: "DB.users" },
        origin: { uri: "file:///common.glf", line: 3 },
      },
    ]);
    expect(merged.events).toHaveLength(1);
    expect(merged.title).toBeUndefined();
    expect(merged.diagnostics).toEqual([]);
    const layout = layoutSequence(merged, (text) => text.length * 8);
    expect(layout.lifelines.map((lane) => lane.id)).toEqual(["DB"]);
    expect(layout.dbStates).toHaveLength(1);
  });

  it("REQ-036 / REQ-036-S01: Objectとschemaの衝突を診断する", () => {
    const root = parseGlf(
      'Object DB as "Local" type DB\nschema DB.users:\n    id: int\nimport "./common.glf"\n',
      { validate: false },
    );
    const common = parseGlf(
      'Object DB as "Imported" type DB\nschema DB.users:\n    id: int\n',
      { validate: false },
    );
    const merged = mergeGlfDefinitions(root, [
      { uri: "file:///common.glf", importLine: 4, document: common },
    ]);
    expect(merged.diagnostics.map((d) => d.code)).toEqual(
      expect.arrayContaining(["object-duplicate", "schema-duplicate"]),
    );
    expect(merged.diagnostics.every((d) => d.line === 4)).toBe(true);
    expect(merged.objects).toHaveLength(1);
    expect(merged.schemas).toHaveLength(1);
  });

  it("REQ-035 / REQ-035-S04: importのない文書の結果を維持する", () => {
    const root = parseGlf('Object FE as "Front" type APP\nFE: work\n');
    expect(root.imports).toEqual([]);
    expect(root.diagnostics).toEqual([]);
    expect(root.events).toHaveLength(1);
  });
});
