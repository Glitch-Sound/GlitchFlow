import { expect, test } from "@playwright/test";

test("REQ-001 / REQ-001-S01: 初期プレビューには見出しがあり図面はない", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "GlitchFlow Preview" }),
  ).toBeVisible();
  await expect(page.locator(".diagram, .lifeline, svg")).toHaveCount(0);
  await expect(page.getByText("フロントエンド")).toHaveCount(0);
});
