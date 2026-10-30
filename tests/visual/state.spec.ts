import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-009 / REQ-009-S01: 基準DSLの5カラムを横並びで表示する", async ({
  page,
}) => {
  await page.goto("/");
  const model = parseGlf(readFileSync("examples/login.glf", "utf8"));
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "login.glf" },
        "*",
      ),
    model,
  );
  const table = page.locator(".state-db");
  await expect(table.locator(".state-db-heading")).toHaveText([
    "uid",
    "name",
    "password_hash",
    "created_at",
    "deleted_at",
  ]);
  await expect(table.locator(".state-db-cell")).toHaveCount(5);
  const positions = await table
    .locator(".state-db-heading")
    .evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().x),
    );
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  const overflow = await table
    .locator(".state-db-heading, .state-db-cell")
    .evaluateAll((items) =>
      items
        .filter((item) => {
          const cell = item.previousElementSibling?.getBoundingClientRect();
          return !cell || item.getBoundingClientRect().right > cell.right - 2;
        })
        .map((item) => item.textContent),
    );
  expect(overflow).toEqual([]);
  await table.screenshot({
    path: "test-results/render-state-five-columns.png",
  });
});

test("REQ-009 / REQ-009-S01、REQ-009-S02: DB全カラムと変更属性", async ({
  page,
}) => {
  await page.goto("/");
  const model = parseGlf(
    'Object DB as "DB" type DB\nschema DB.public.users:\n    uid: int\n    name: text\n    status: text\nstate DB.public.users:\n    - [1, "taro", "inactive"]\n    [2, "jiro", "active"]\n    [3, !"saburo", "active"]\n    + [4, "shiro", "active"]',
  );
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "state.glf" },
        "*",
      ),
    model,
  );
  await expect(page.locator(".state-db")).toHaveCount(1);
  await expect(page.locator(".state-db-heading")).toHaveCount(3);
  await expect(page.locator(".state-db-cell")).toHaveCount(12);
  await expect(page.locator(".state-db-cell--removed")).toHaveCount(3);
  await expect(page.locator(".state-db-cell--added")).toHaveCount(3);
  await expect(page.locator(".state-db-cell--updated")).toHaveCount(1);
  await expect(page.locator(".state-db-cell--updated")).toHaveText("saburo");
  await expect(page.locator(".state-db")).not.toContainText('!"saburo"');
});

test("REQ-010 / REQ-010-S01、REQ-011 / REQ-011-S01: FILEツリーとSQL枠", async ({
  page,
}) => {
  await page.goto("/");
  const model = parseGlf(
    'Object DB as "DB" type DB\nObject FILE as "FILE" type FILE\nschema DB.users:\n    id: int\nstate DB.users:\n    [1]\nsql DB:\n    SELECT id\n    FROM users\nstate FILE:\n    users/\n        1/\n            - old.info\n            user.info\n            + new.info',
  );
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "state.glf" },
        "*",
      ),
    model,
  );
  await expect(page.locator(".state-file-node")).toHaveCount(5);
  await expect(page.locator(".state-file-node--removed")).toHaveText(
    "old.info",
  );
  await expect(page.locator(".state-file-node--added")).toHaveText("new.info");
  await expect(page.locator(".state-sql-line")).toHaveText([
    "SELECT id",
    "FROM users",
  ]);
  const db = await page.locator(".state-db").boundingBox();
  const sql = await page.locator(".state-sql").boundingBox();
  expect(db && sql && sql.y >= db.y + db.height - 1).toBe(true);
  await page.screenshot({
    path: "test-results/render-state-and-sql.png",
    fullPage: true,
  });
});

test("REQ-011 / REQ-011-S03: 等幅のSQL本文が枠内に収まる", async ({ page }) => {
  await page.goto("/");
  const line = `SELECT ${"i".repeat(48)}`;
  const model = parseGlf(
    `Object DB as "DB" type DB\nschema DB.items:\n    id: int\nstate DB.items:\n    [1]\nsql DB:\n    ${line}`,
  );
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "sql.glf" },
        "*",
      ),
    model,
  );
  await expect(page.locator(".state-sql-line")).toHaveText(line);
  const selectedText = await page
    .locator(".state-sql-line")
    .evaluate((text) => {
      const selection = window.getSelection();
      selection?.selectAllChildren(text);
      return selection?.toString();
    });
  expect(selectedText).toBe(line);
  const bounds = await page.evaluate(() => {
    const text = document.querySelector(".state-sql-line");
    const background = document.querySelector(".state-sql-background");
    const table = document.querySelector(".state-db-background");
    const diagram = document.querySelector(".sequence-diagram");
    if (!text || !background || !table || !diagram) return null;
    const textBox = text.getBoundingClientRect();
    const box = background.getBoundingClientRect();
    const tableBox = table.getBoundingClientRect();
    const diagramBox = diagram.getBoundingClientRect();
    return {
      textRight: textBox.right,
      panelRight: box.right,
      panelWidth: box.width,
      tableWidth: tableBox.width,
      diagramRight: diagramBox.right,
    };
  });
  expect(bounds).not.toBeNull();
  if (!bounds) return;
  expect(bounds.textRight).toBeLessThanOrEqual(bounds.panelRight - 12);
  expect(Math.abs(bounds.panelWidth - bounds.tableWidth)).toBeLessThan(1);
  expect(bounds.panelRight).toBeLessThanOrEqual(bounds.diagramRight);
});

test("連続する複数のDB状態とSQLが一続きのカードになる", async ({ page }) => {
  await page.goto("/");
  const model = parseGlf(
    'Object DB as "DB" type DB\nschema DB.sessions:\n    id: text\n    status: text\n    risk_score: int\nstate DB.sessions:\n    ["S-42", "active", 92]\nstate DB.sessions:\n    ["S-42", "active", 92]\nsql DB:\n    UPDATE sessions SET status = \'isolated\'\n    WHERE id = :session_id AND status = \'active\'\n    AND risk_score >= 80 RETURNING id;',
  );
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "joined.glf" },
        "*",
      ),
    model,
  );
  await expect(page.locator(".state-db")).toHaveCount(2);
  await expect(page.locator(".state-sql")).toHaveCount(1);
  await expect(page.locator(".state-db-link")).toHaveCount(1);
  const geometry = await page
    .locator(".state-db-background, .state-sql-background")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
  expect(geometry).toHaveLength(3);
  for (let index = 1; index < geometry.length; index++) {
    expect(
      Math.abs(
        geometry[index].y - geometry[index - 1].y - geometry[index - 1].height,
      ),
    ).toBeLessThanOrEqual(1);
    expect(geometry[index].x).toBe(geometry[0].x);
    expect(geometry[index].width).toBe(geometry[0].width);
  }
  const first = geometry[0];
  const last = geometry[geometry.length - 1];
  await page.screenshot({
    path: "test-results/connected-db-states-and-sql.png",
    clip: {
      x: first.x - 42,
      y: first.y - 16,
      width: first.width + 62,
      height: last.y + last.height - first.y + 32,
    },
  });
});
