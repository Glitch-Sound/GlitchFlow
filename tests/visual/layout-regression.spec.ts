import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

const login = parseGlf(readFileSync("examples/login.glf", "utf8"));

test("REQ-006 / REQ-006-S01、REQ-009 / REQ-009-S01、REQ-012 / REQ-012-S01: 基準DSLの文字、State、枠の境界", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "login.glf" },
        "*",
      ),
    login,
  );
  await expect(page.locator(".sequence-fragment")).toHaveCount(1);
  const geometry = await page.locator(".sequence-diagram").evaluate((svg) => {
    const view = (svg as SVGSVGElement).viewBox.baseVal;
    const text = Array.from(svg.querySelectorAll("text")).map((element) => {
      const box = element.getBBox();
      return {
        value: element.textContent,
        x: box.x,
        y: box.y,
        right: box.x + box.width,
        bottom: box.y + box.height,
      };
    });
    const states = Array.from(
      svg.querySelectorAll(".state-db, .state-file, .state-sql"),
    ).map((group) => {
      const box = (group as SVGGElement).getBBox();
      return {
        x: box.x,
        y: box.y,
        right: box.x + box.width,
        bottom: box.y + box.height,
      };
    });
    const children = Array.from(svg.children);
    const firstFragment = children.findIndex((item) =>
      item.classList.contains("sequence-fragment"),
    );
    const firstActivation = children.findIndex((item) =>
      item.classList.contains("sequence-activation"),
    );
    const feCenter = Number(
      svg
        .querySelector('.sequence-lifeline[data-object-id="FE"] line')
        ?.getAttribute("x1"),
    );
    const feBars = Array.from(svg.querySelectorAll(".sequence-activation"))
      .filter(
        (item) =>
          Math.abs(
            Number(item.getAttribute("x")) +
              Number(item.getAttribute("width")) / 2 -
              feCenter,
          ) < 0.01,
      )
      .map((item) => ({
        y: Number(item.getAttribute("y")),
        endY:
          Number(item.getAttribute("y")) + Number(item.getAttribute("height")),
      }));
    const processes = Array.from(svg.querySelectorAll(".sequence-process"))
      .filter((item) =>
        ["ホーム画面表示", "エラーメッセージ表示"].includes(
          item.textContent ?? "",
        ),
      )
      .map((item) => ({
        text: item.textContent,
        y: Number(item.getAttribute("y")),
      }));
    const divider = Number(
      svg.querySelector(".sequence-fragment-divider")?.getAttribute("y1"),
    );
    const frame = svg.querySelector(".sequence-fragment-frame");
    const frameBottom =
      Number(frame?.getAttribute("y")) + Number(frame?.getAttribute("height"));
    return {
      width: view.width,
      height: view.height,
      text,
      states,
      firstFragment,
      firstActivation,
      feBars,
      processes,
      divider,
      frameBottom,
    };
  });
  for (const item of [...geometry.text, ...geometry.states]) {
    expect(item.x).toBeGreaterThanOrEqual(0);
    expect(item.y).toBeGreaterThanOrEqual(0);
    expect(item.right).toBeLessThanOrEqual(geometry.width);
    expect(item.bottom).toBeLessThanOrEqual(geometry.height);
  }
  expect(geometry.firstFragment).toBeLessThan(geometry.firstActivation);
  for (const process of geometry.processes) {
    expect(
      geometry.feBars.some(
        (bar) =>
          bar.y < process.y &&
          bar.endY > process.y &&
          bar.endY <=
            (process.text === "ホーム画面表示"
              ? geometry.divider
              : geometry.frameBottom),
      ),
    ).toBe(true);
  }
  const cellOverflow = await page
    .locator(".state-db-heading, .state-db-cell")
    .evaluateAll((items) =>
      items
        .filter((item) => {
          const cell = item.previousElementSibling?.getBoundingClientRect();
          return !cell || item.getBoundingClientRect().right > cell.right - 2;
        })
        .map((item) => item.textContent),
    );
  expect(cellOverflow).toEqual([]);
  await page.setViewportSize({ width: 1600, height: 2400 });
  await page.screenshot({
    path: "test-results/stabilize-layout-diagram.png",
    fullPage: true,
  });
});

test("REQ-014 / REQ-014-S01、REQ-017 / REQ-017-S01: 小画面で倍率、スクロール、文書更新", async ({
  page,
}) => {
  await page.setViewportSize({ width: 480, height: 320 });
  await page.goto("/");
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "login.glf" },
        "*",
      ),
    login,
  );
  const diagram = page.locator(".sequence-diagram");
  const initial = Number(await diagram.getAttribute("width"));
  await page.getByRole("button", { name: "拡大" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBeGreaterThan(initial);
  await page.getByRole("button", { name: "縮小" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBe(initial);
  await page.getByRole("button", { name: "拡大" }).click();
  const scroller = page.locator(".preview__scroller");
  const limits = await scroller.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.scrollTop = element.scrollHeight;
    return {
      left: element.scrollLeft,
      top: element.scrollTop,
      maxLeft: element.scrollWidth - element.clientWidth,
      maxTop: element.scrollHeight - element.clientHeight,
    };
  });
  expect(limits.left).toBe(limits.maxLeft);
  expect(limits.top).toBe(limits.maxTop);
  expect(limits.left).toBeGreaterThan(0);
  expect(limits.top).toBeGreaterThan(0);
  await page.screenshot({
    path: "test-results/stabilize-layout-right-bottom.png",
  });
  await page.getByRole("button", { name: "等倍" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBe(initial);
  const updated = parseGlf(
    'title: "更新後"\nObject FE as "FE" type APP\nFE: 完了',
  );
  await page.evaluate(
    (document) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName: "login.glf" },
        "*",
      ),
    updated,
  );
  await expect(page.getByRole("heading", { name: "更新後" })).toBeVisible();
  await expect(page.locator(".sequence-process")).toHaveText("完了");
  await expect(page.locator(".sequence-lifeline")).toHaveCount(1);
});
