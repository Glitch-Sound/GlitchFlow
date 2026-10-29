import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-001 / REQ-001-S01: 文書を受けたプレビューに見出しと図面がある", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'title: "ログインフロー"\nObject FE as "フロントエンド" type APP\nGlobal ->> FE: 起動',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "login.glf" },
        "*",
      ),
    document,
  );
  await expect(
    page.getByRole("heading", { name: "ログインフロー" }),
  ).toBeVisible();
  await expect(page.locator(".sequence-lifeline")).toHaveCount(1);
  await expect(page.locator(".sequence-arrow--sync")).toHaveCount(1);
});
