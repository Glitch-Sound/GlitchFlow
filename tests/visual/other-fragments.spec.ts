import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-018 / REQ-018-S01、REQ-019 / REQ-019-S01、REQ-020 / REQ-020-S01: 4種類の枠と後続イベント", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'Object FE as "FE" type APP\nopt 許可:\n    FE: A\nloop 再試行:\n    FE: B\npar:\n    case X:\n        FE: C\n    case Y:\n        FE: D\nbreak エラー:\n    FE: E\nFE: F',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document: data,
          fileName: "fragments.glf",
        },
        "*",
      ),
    document,
  );
  await expect(page.locator(".sequence-fragment")).toHaveCount(4);
  await expect(page.locator(".sequence-fragment-label")).toHaveText([
    "opt 許可",
    "loop 再試行",
    "par",
    "break エラー",
  ]);
  await expect(page.locator(".sequence-fragment-branch-label")).toHaveText([
    "case X",
    "case Y",
  ]);
  await expect(page.locator(".sequence-process")).toHaveText([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ]);
  await page.screenshot({
    path: "test-results/render-other-fragments-top.png",
  });
  await page.locator(".sequence-fragment").last().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/render-other-fragments.png" });
});

test("REQ-019 / REQ-019-S01: parの右枠が処理カードと重ならない", async ({
  page,
}) => {
  await page.goto("/");
  const document = parseGlf(
    'Object FE as "画面" type APP\nObject BE as "API" type API\npar:\n    case 画面更新:\n        FE: 表示を更新\n    case 記録:\n        BE: 履歴を記録',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "par.glf" },
        "*",
      ),
    document,
  );
  await expect(page.locator(".sequence-process")).toHaveText([
    "表示を更新",
    "履歴を記録",
  ]);
  const geometry = await page.locator(".sequence-diagram").evaluate((svg) => {
    const frame = svg.querySelector<SVGRectElement>(".sequence-fragment-frame");
    const card = svg.querySelectorAll<SVGRectElement>(
      ".sequence-process-card",
    )[1];
    if (!frame || !card) throw new Error("parの枠または処理カードがない");
    const frameBox = frame.getBBox();
    const cardBox = card.getBBox();
    return {
      frameRight: frameBox.x + frameBox.width,
      cardRight: cardBox.x + cardBox.width,
    };
  });
  expect(geometry.frameRight - geometry.cardRight).toBeGreaterThanOrEqual(12);
});

test("opt 枠を通過する活性が途切れず、幅が 10px になる", async ({ page }) => {
  await page.goto(process.env.GLITCHFLOW_PREVIEW_URL ?? "/");
  const document = parseGlf(
    'Object FE as "FE" type APP\nFE+\nopt test:\n    FE: aaa\nFE-',
  );
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "opt.glf" },
        "*",
      ),
    document,
  );
  await expect(page.locator(".sequence-fragment-frame")).toBeVisible();
  const frame = page.locator(".sequence-fragment-frame");
  const activation = page.locator(".sequence-activation");
  const frameBox = await frame.boundingBox();
  const activationBox = await activation.boundingBox();
  expect(frameBox).not.toBeNull();
  expect(activationBox).not.toBeNull();
  if (!frameBox || !activationBox) return;
  expect(activationBox.y).toBeLessThan(frameBox.y);
  expect(activationBox.y + activationBox.height).toBeGreaterThan(
    frameBox.y + frameBox.height,
  );
  expect(
    await frame.evaluate((element) => {
      const bar = element.ownerDocument.querySelector(".sequence-activation");
      return (
        bar !== null &&
        (element.compareDocumentPosition(bar) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
          0
      );
    }),
  ).toBe(true);
  await expect(activation).toHaveAttribute("width", "10");
  for (let index = 0; index < 10; index++)
    await page.getByRole("button", { name: "拡大" }).click();
  await expect(page.locator(".preview__zoom-level")).toHaveText("200%");
  await page.screenshot({ path: "test-results/opt-activation-200.png" });
});
