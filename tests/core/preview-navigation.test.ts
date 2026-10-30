import { describe, expect, it } from "vitest";
import { layoutSequence, parseGlf } from "../../src/core";

describe("REQ-038 / REQ-038-S01、REQ-038-S02", () => {
  it("同名要素、State、SQL、ネスト分岐の行番号を保持する", () => {
    const source = [
      'Object FE as "FE" type APP',
      'Object DB as "DB" type DB',
      'Object FILE as "FILE" type FILE',
      "schema DB.users:",
      "    id: int",
      "FE ->> DB: same",
      "FE ->> DB: same",
      "FE: work",
      "state DB.users:",
      "    [1]",
      "state DB.users:",
      "    [2]",
      "sql DB:",
      "    SELECT 1",
      "state FILE:",
      "    + a",
      "alt:",
      "    case yes:",
      "        par:",
      "            case one:",
      "                FE ->> DB: inside",
      "            case two:",
      "                FE ->> DB: other",
      "    else:",
      "        FE ->> DB: fallback",
    ].join("\n");
    const layout = layoutSequence(
      parseGlf(source),
      (value) => value.length * 8,
    );
    expect(layout.lifelines.map((item) => item.line)).toEqual([1, 2, 3]);
    expect(layout.messages.map((item) => item.line)).toEqual([
      6, 7, 21, 23, 25,
    ]);
    expect(layout.processes[0].line).toBe(8);
    expect(layout.dbStates.map((item) => item.line)).toEqual([9, 11]);
    expect(layout.sqlBlocks[0].line).toBe(13);
    expect(layout.fileStates[0].line).toBe(15);
    expect(layout.fragments.map((item) => item.line)).toEqual([17, 19]);
    expect(layout.fragments[0].branches.map((item) => item.line)).toEqual([
      18, 24,
    ]);
    expect(layout.fragments[1].branches.map((item) => item.line)).toEqual([
      20, 22,
    ]);
  });
});
