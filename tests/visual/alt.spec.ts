import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-012 / REQ-012-S01、REQ-013 / REQ-013-S01: ログインの分岐と活性", async ({
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
  await expect(page.locator(".sequence-fragment")).toHaveCount(1);
  await expect(page.locator(".sequence-fragment-branch-label")).toHaveText([
    "case ユーザヒット",
    "else",
  ]);
  await expect(page.locator(".state-file")).toHaveCount(1);
  await expect(
    page.locator(".sequence-process").filter({ hasText: "ホーム画面表示" }),
  ).toHaveCount(1);
  await expect(
    page
      .locator(".sequence-process")
      .filter({ hasText: "エラーメッセージ表示" }),
  ).toHaveCount(1);
  await expect(page.locator(".sequence-fragment-frame")).toHaveCSS(
    "stroke",
    "rgb(221, 104, 114)",
  );
  await page.locator(".sequence-fragment").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/render-alt.png" });
  await page.locator(".preview__scroller").evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await page.screenshot({ path: "test-results/render-alt-right.png" });
});
