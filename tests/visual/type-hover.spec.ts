import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-044 / REQ-044-S01、REQ-044-S02: 同名カラムでも各schemaの型をツールチップに表示", async ({
  page,
}) => {
  await page.goto("/");
  const source =
    'Object DB as "DB" type DB\nschema DB.users:\n    id: int\nschema DB.audit:\n    id: text\nstate DB.users:\n    [1]\nstate DB.audit:\n    ["a"]\n';
  await page.evaluate(
    (document) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document,
          fileName: "flow.glf",
          renderId: 1,
        },
        "*",
      ),
    parseGlf(source),
  );
  const columns = page.locator(".state-db-column");
  await expect(columns).toHaveCount(2);
  await expect(page.locator(".preview__column-tooltip")).toBeHidden();
  await columns.first().hover();
  await expect(page.locator(".preview__column-tooltip")).toHaveText("id: int");
  await columns.last().hover();
  await expect(page.locator(".preview__column-tooltip")).toHaveText("id: text");
  await page.evaluate(
    (document) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document,
          fileName: "flow.glf",
          renderId: 2,
        },
        "*",
      ),
    parseGlf(source.replace("id: text", "id: boolean")),
  );
  await page.locator(".state-db-column").last().hover();
  await expect(page.locator(".preview__column-tooltip")).toHaveText(
    "id: boolean",
  );
});
