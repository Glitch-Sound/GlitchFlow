import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-007 / REQ-007-S01、REQ-008 / REQ-008-S01: 矢印、Global、活性と強調処理", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'title: "図面"\nObject FE as "フロントエンド" type APP\nObject BE as "バックエンド" type API\nGlobal ->> FE: 起動\nFE+\nFE: *起動処理*\nFE -> BE: 通知\nBE --> FE: 完了\nFE-',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document: data,
          fileName: "example.glf",
        },
        "*",
      ),
    document,
  );
  await expect(page.getByRole("heading", { name: "図面" })).toBeVisible();
  await expect(page.locator(".sequence-lifeline")).toHaveCount(2);
  await expect(
    page.locator('.sequence-lifeline[data-object-id="Global"]'),
  ).toHaveCount(0);
  await expect(page.locator(".sequence-global-origin")).toHaveCount(1);
  await expect(page.locator(".sequence-arrow--sync")).toHaveCount(1);
  await expect(page.locator(".sequence-arrow--async")).toHaveCount(1);
  await expect(page.locator(".sequence-arrow--response")).toHaveCount(1);
  await expect(page.locator("#sequence-arrow-filled path")).toHaveAttribute(
    "fill",
    "#e7edf6",
  );
  await expect(page.locator("#sequence-arrow-open path")).toHaveAttribute(
    "fill",
    "none",
  );
  await expect(
    page.locator(".sequence-arrow--response .sequence-arrow-line"),
  ).toHaveCSS("stroke-dasharray", "6px, 5px");
  await expect(page.locator(".sequence-process--emphasis")).toContainText(
    "起動処理",
  );
  const activation = await page.locator(".sequence-activation").boundingBox();
  const response = await page
    .locator(".sequence-arrow--response")
    .boundingBox();
  expect(activation).not.toBeNull();
  expect(response).not.toBeNull();
  if (!activation || !response) throw new Error("描画要素が見つからない");
  await expect(page.locator(".sequence-activation")).toHaveAttribute(
    "width",
    "10",
  );
  expect(activation.y + activation.height).toBeGreaterThan(response.y);
  await page.screenshot({
    path: "test-results/render-sequence.png",
    fullPage: true,
  });
});

test("REQ-007 / REQ-007-S02: 応答のない同期要求を補わない", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'Object FE as "FE" type APP\nObject BE as "BE" type API\nFE ->> BE: 保存',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "save.glf" },
        "*",
      ),
    document,
  );
  await expect(page.locator(".sequence-arrow--sync")).toHaveCount(1);
  await expect(page.locator(".sequence-arrow--response")).toHaveCount(0);
});
