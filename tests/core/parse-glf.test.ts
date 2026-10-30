import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseGlf } from "../../src/core";

const login = readFileSync(
  new URL("../../examples/login.glf", import.meta.url),
  "utf8",
);

describe("parseGlf", () => {
  it("REQ-002 / REQ-002-S01: 基準DSLのメタデータとイベント順序", () => {
    const result = parseGlf(login);
    expect(result.title).toBe("ログインフロー");
    expect(result.objects.map((object) => object.id)).toEqual([
      "FE",
      "BE",
      "DB",
      "FILE",
    ]);
    expect(result.events[0]).toMatchObject({
      kind: "message",
      from: "Global",
      to: "FE",
      mode: "sync",
    });
    expect(result.events[1]).toMatchObject({
      kind: "activation",
      objectId: "FE",
      action: "start",
    });
    expect(
      result.events.some(
        (event) => event.kind === "message" && event.to === "FILE",
      ),
    ).toBe(false);
    expect(result.diagnostics).toEqual([]);
  });

  it("REQ-002 / REQ-002-S02: タイトルの位置、重複、空文字を診断", () => {
    expect(
      parseGlf('Object FE as "FE" type APP\ntitle: "後"').diagnostics.some(
        (d) => d.code === "title-position",
      ),
    ).toBe(true);
    expect(
      parseGlf('title: "先"\ntitle: "次"').diagnostics.some(
        (d) => d.code === "title-duplicate",
      ),
    ).toBe(true);
    expect(
      parseGlf('title: ""').diagnostics.some((d) => d.code === "title-empty"),
    ).toBe(true);
  });

  it("REQ-002 / REQ-002-S01: 矢印種別、逆向き、Object種別と処理の強調", () => {
    const result = parseGlf(
      'Object FE as "FE" type FEATURE\nObject BE as "BE" type MODULE\nFE -> BE: async\nFE ->> BE: sync\nFE <-- BE: response\nFE: *処理*',
    );
    expect(result.objects.map((object) => object.type)).toEqual([
      "FEATURE",
      "MODULE",
    ]);
    expect(result.events.slice(0, 3)).toMatchObject([
      { kind: "message", from: "FE", to: "BE", mode: "async" },
      { kind: "message", from: "FE", to: "BE", mode: "sync" },
      { kind: "message", from: "BE", to: "FE", mode: "response" },
    ]);
    expect(result.events[3]).toMatchObject({
      kind: "process",
      text: "処理",
      emphasis: true,
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("REQ-002 / REQ-002-S03: 処理の継続行と複数行の強調", () => {
    const result = parseGlf(
      'Object FE as "FE" type APP\nFE: 準備\n    設定を読む\nFE:\n    通知する\n    完了を待つ\nFE: *重要\n    確認*\nFE: 単一行',
    );
    expect(
      result.events.filter((event) => event.kind === "process"),
    ).toMatchObject([
      { kind: "process", text: "準備\n設定を読む", emphasis: false, line: 2 },
      {
        kind: "process",
        text: "通知する\n完了を待つ",
        emphasis: false,
        line: 4,
      },
      { kind: "process", text: "重要\n確認", emphasis: true, line: 7 },
      { kind: "process", text: "単一行", emphasis: false, line: 9 },
    ]);
    expect(result.diagnostics).toEqual([]);
  });

  it("REQ-002 / REQ-002-S04: 本文が空の処理を診断", () => {
    const result = parseGlf('Object FE as "FE" type APP\nFE:');
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "process-empty", line: 2 }),
      ]),
    );
  });

  it("REQ-003 / REQ-003-S01: DB参照と行・セルの変更属性", () => {
    const result = parseGlf(
      'Object DB as "DB" type DB\nschema DB.users:\n    id: int\nstate DB.users:\n    [1]\nschema DB.public.users:\n    id: int\n    name: text\nstate DB.public.users:\n    - [1, "a,b"]\n    [2, "jiro"]\n    [3, !"saburo"]\n    + [4, "shiro"]',
    );
    expect(result.schemas.map((schema) => schema.reference.raw)).toEqual([
      "DB.users",
      "DB.public.users",
    ]);
    expect(result.schemas[0].reference.schema).toBeUndefined();
    expect(result.schemas[1].reference.schema).toBe("public");
    const states = result.events.filter((event) => event.kind === "db-state");
    expect(states[1]).toMatchObject({
      reference: { raw: "DB.public.users" },
      rows: [
        { change: "removed", cells: [{ value: "1" }, { value: '"a,b"' }] },
        { change: "unchanged" },
        {
          cells: [
            { change: "unchanged" },
            { change: "updated", value: '"saburo"' },
          ],
        },
        { change: "added" },
      ],
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("REQ-004 / REQ-004-S01: FILE階層とSQL本文", () => {
    const result = parseGlf(
      'Object DB as "DB" type DB\nObject FILE as "FILE" type FILE\nstate FILE:\n    users/\n        1/\n            + user.info\nsql DB:\n    SELECT id\n    FROM users',
    );
    expect(result.events[0]).toMatchObject({
      kind: "file-state",
      nodes: [
        {
          name: "users/",
          change: "unchanged",
          children: [
            {
              name: "1/",
              change: "unchanged",
              children: [{ name: "user.info", change: "added" }],
            },
          ],
        },
      ],
    });
    expect(result.events[1]).toMatchObject({
      kind: "sql",
      objectId: "DB",
      text: "SELECT id\nFROM users",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("REQ-005 / REQ-005-S01: 基準DSLの分岐と明示的な活性終了", () => {
    const result = parseGlf(login);
    const alt = result.events.find((event) => event.kind === "alt");
    expect(alt).toMatchObject({
      kind: "alt",
      branches: [{ label: "ユーザヒット" }, { label: "else" }],
    });
    if (alt?.kind === "alt") {
      expect(
        alt.branches.map((branch) =>
          branch.events.some(
            (event) =>
              event.kind === "activation" &&
              event.objectId === "FE" &&
              event.action === "end",
          ),
        ),
      ).toEqual([true, true]);
      expect(
        alt.branches[0].events.some(
          (event) =>
            event.kind === "activation" &&
            event.objectId === "FILE" &&
            event.action === "end",
        ),
      ).toBe(true);
    }
  });

  it("REQ-005 / REQ-005-S02: 参照、インデント、未終了活性、未対応構文を診断", () => {
    const result = parseGlf(
      'Object FE as "FE" type APP\nFE ->> X: call\nFE+\n  FE: bad\nopt:',
    );
    expect(result.diagnostics.map((d) => d.code)).toEqual(
      expect.arrayContaining([
        "unknown-object",
        "indent",
        "activation-unclosed",
        "syntax",
      ]),
    );
    expect(result.diagnostics.every((d) => d.line > 0)).toBe(true);
  });

  it("REQ-005 / REQ-005-S03: 入れ子のaltを保持", () => {
    const result = parseGlf(
      'Object FE as "FE" type APP\nalt:\n    case outer:\n        alt:\n            case inner:\n                FE: work\n            else:\n                FE: rest\n    else:\n        FE: done',
    );
    expect(result.events[0]).toMatchObject({
      kind: "alt",
      branches: [{ events: [{ kind: "alt" }] }, { label: "else" }],
    });
    expect(result.diagnostics).toEqual([]);
  });
});
