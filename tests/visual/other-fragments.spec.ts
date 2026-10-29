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
