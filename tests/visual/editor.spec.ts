import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-017 / REQ-017-S01: 拡大後に図の右端と下端へスクロールできる", async ({
  page,
}) => {
  await page.setViewportSize({ width: 480, height: 320 });
  await page.goto("/");
  const document = parseGlf(
    'Object FE as "FE" type APP\nObject BE as "BE" type API\nObject DB as "DB" type DB\nGlobal ->> FE: start\nFE ->> BE: call\nBE ->> DB: query',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "wide.glf" },
        "*",
      ),
    document,
  );
  const diagram = page.locator(".sequence-diagram");
  const initialWidth = Number(await diagram.getAttribute("width"));
  await page.getByRole("button", { name: "拡大" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBeGreaterThan(
    initialWidth,
  );
  const scroller = page.locator(".preview__scroller");
  await scroller.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.scrollTop = element.scrollHeight;
  });
  const limits = await scroller.evaluate((element) => ({
    left: element.scrollLeft,
    top: element.scrollTop,
    maxLeft: element.scrollWidth - element.clientWidth,
    maxTop: element.scrollHeight - element.clientHeight,
  }));
  expect(limits.left).toBe(limits.maxLeft);
  expect(limits.top).toBe(limits.maxTop);
  await page.screenshot({ path: "test-results/integrate-glf-editor.png" });
  await page.getByRole("button", { name: "等倍" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBe(initialWidth);
});

test("REQ-014 / REQ-014-S01: 同じ画面で新しい文書を表示する", async ({
  page,
}) => {
  await page.goto("/");
  const first = parseGlf('title: "最初"\nObject FE as "FE" type APP');
  const second = parseGlf('title: "更新後"\nObject FE as "FE" type APP');
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "live.glf" },
        "*",
      ),
    first,
  );
  await expect(page.getByRole("heading", { name: "最初" })).toBeVisible();
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "live.glf" },
        "*",
      ),
    second,
  );
  await expect(page.getByRole("heading", { name: "更新後" })).toBeVisible();
});
