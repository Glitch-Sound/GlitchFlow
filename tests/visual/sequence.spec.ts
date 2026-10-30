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

test("REQ-008 / REQ-008-S03、REQ-022 / REQ-022-S03、REQ-023 / REQ-023-S02: 複数行の処理を重ねず表示する", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'Object FE as "FE" type APP\nObject BE as "BE" type API\nFE+\nFE: 通常の処理\n    内容を確認\nFE: *重要な処理\n    入力を確認*\nFE ->> BE: 次の処理\nFE-',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document: data,
          fileName: "multiline.glf",
        },
        "*",
      ),
    document,
  );
  const cards = page.locator(".sequence-process-card");
  const normalLines = page.locator(
    ".sequence-process:not(.sequence-process--emphasis) tspan",
  );
  const lines = page.locator(".sequence-process--emphasis tspan");
  await expect(normalLines).toHaveCount(2);
  await expect(normalLines.nth(0)).toHaveText("通常の処理");
  await expect(normalLines.nth(1)).toHaveText("内容を確認");
  await expect(lines).toHaveCount(2);
  await expect(lines.nth(0)).toHaveText("重要な処理");
  await expect(lines.nth(1)).toHaveText("入力を確認");
  const objectAndActivation = await page.evaluate(() => {
    const object = window.document.querySelector<SVGRectElement>(
      '.sequence-lifeline[data-object-id="FE"] .sequence-object',
    );
    const activation = window.document.querySelector<SVGRectElement>(
      '.sequence-activation[data-object-id="FE"]',
    );
    if (!object || !activation) return null;
    const objectBox = object.getBBox();
    const activationBox = activation.getBBox();
    return activationBox.y - (objectBox.y + objectBox.height);
  });
  expect(objectAndActivation).not.toBeNull();
  expect(objectAndActivation).toBeGreaterThanOrEqual(8);
  const firstCardBox = await cards.nth(0).boundingBox();
  const cardBox = await cards.nth(1).boundingBox();
  const arrowBox = await page.locator(".sequence-arrow--sync").boundingBox();
  expect(firstCardBox).not.toBeNull();
  expect(cardBox).not.toBeNull();
  expect(arrowBox).not.toBeNull();
  if (!firstCardBox || !cardBox || !arrowBox) return;
  expect(
    cardBox.y - (firstCardBox.y + firstCardBox.height),
  ).toBeGreaterThanOrEqual(8);
  expect(arrowBox.y).toBeGreaterThan(cardBox.y + cardBox.height);
  await page.screenshot({
    path: "test-results/multiline-process-preview.png",
    clip: { x: 0, y: 0, width: 700, height: 420 },
  });
  const selectedText = await page.evaluate(() => {
    const label = window.document.querySelector(".sequence-process--emphasis");
    if (!label) return "";
    const selection = window.getSelection();
    const range = window.document.createRange();
    range.selectNodeContents(label);
    selection?.removeAllRanges();
    selection?.addRange(range);
    return selection?.toString() ?? "";
  });
  expect(selectedText).toContain("重要な処理");
  expect(selectedText).toContain("入力を確認");
});
