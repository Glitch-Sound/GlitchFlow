import { expect, test } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

test("REQ-044 / REQ-044-S01、REQ-044-S02: 表ごとに明示されたカラム型を保持する", () => {
  const model = parseGlf(
    'Object DB as "DB" type DB\nschema DB.users:\n    id: int\nschema DB.audit:\n    id: text\nstate DB.users:\n    [1]\nstate DB.audit:\n    ["a"]\n',
  );
  const layout = layoutSequence(model, (text) => text.length * 8);
  expect(layout.dbStates.map((state) => state.columnTypes)).toEqual([
    ["int"],
    ["text"],
  ]);
});
