import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test("REQ-038 / REQ-038-S01、REQ-038-S02: 同名要素と分岐が各行を送る", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const messages: unknown[] = [];
    Object.assign(window, {
      __messages: messages,
      acquireVsCodeApi: () => ({
        postMessage: (message: unknown) => messages.push(message),
      }),
    });
  });
  await page.goto("/");
  const source = [
    'Object FE as "FE" type APP',
    'Object DB as "DB" type DB',
    "schema DB.users:",
    "    id: int",
    "FE ->> DB: same",
    "FE ->> DB: same",
    "state DB.users:",
    "    [1]",
    "state DB.users:",
    "    [2]",
    "sql DB:",
    "    SELECT 1",
    "alt:",
    "    case yes:",
    "        FE: work",
    "    else:",
    "        FE: fallback",
  ].join("\n");
  await page.evaluate(
    (document) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document,
          fileName: "flow.glf",
          renderId: 42,
        },
        "*",
      ),
    parseGlf(source),
  );
  const arrows = page.locator(".sequence-arrow");
  await expect(arrows).toHaveCount(2);
  await expect(arrows.first()).toHaveAttribute("data-source-line", "5");
  await expect(arrows.last()).toHaveAttribute("data-source-line", "6");
  await expect(page.locator(".state-db")).toHaveCount(2);
  await expect(page.locator(".state-db").first()).toHaveAttribute(
    "data-source-line",
    "7",
  );
  await expect(page.locator(".state-db").last()).toHaveAttribute(
    "data-source-line",
    "9",
  );
  await expect(page.locator(".state-sql")).toHaveAttribute(
    "data-source-line",
    "11",
  );
  await expect(page.locator(".sequence-fragment-tag")).toHaveAttribute(
    "data-source-line",
    "13",
  );
  await expect(page.locator(".sequence-fragment-frame")).toHaveAttribute(
    "data-source-line",
    "13",
  );
  await expect(
    page.locator(".sequence-fragment-branch-label").first(),
  ).toHaveAttribute("data-source-line", "14");
  await expect(
    page.locator(".sequence-fragment-branch-label").last(),
  ).toHaveAttribute("data-source-line", "16");
  await arrows.first().locator(".sequence-message-label").click();
  await arrows.last().locator(".sequence-message-label").click();
  await page.locator(".state-db").first().locator(".state-db-title").click();
  await page.locator(".state-db").last().locator(".state-db-title").click();
  await page.locator(".state-sql-title").click();
  await page.locator(".sequence-fragment-label").click();
  await page.locator(".sequence-fragment-branch-label").last().click();
  await page.locator(".sequence-process").first().click();
  await page.locator(".sequence-object-label").first().click();
  const sent = await page.evaluate(
    () => (window as unknown as { __messages: unknown[] }).__messages,
  );
  expect(sent).toContainEqual({
    type: "glitchflow.navigate",
    renderId: 42,
    line: 5,
  });
  expect(sent).toContainEqual({
    type: "glitchflow.navigate",
    renderId: 42,
    line: 6,
  });
  for (const line of [1, 7, 9, 11, 13, 15, 16])
    expect(sent).toContainEqual({
      type: "glitchflow.navigate",
      renderId: 42,
      line,
    });
  await expect(arrows.first()).toHaveCSS("cursor", "pointer");
});

test("REQ-038 / REQ-038-S01: FILE Stateが定義行を送る", async ({ page }) => {
  await page.addInitScript(() => {
    const messages: unknown[] = [];
    Object.assign(window, {
      __messages: messages,
      acquireVsCodeApi: () => ({
        postMessage: (message: unknown) => messages.push(message),
      }),
    });
  });
  await page.goto("/");
  await page.evaluate(
    (document) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document,
          fileName: "flow.glf",
          renderId: 9,
        },
        "*",
      ),
    parseGlf('Object FILE as "Storage" type FILE\nstate FILE:\n    + a'),
  );
  await page.locator(".state-file-title").click();
  const messages = await page.evaluate(
    () => (window as unknown as { __messages: unknown[] }).__messages,
  );
  expect(messages).toContainEqual({
    type: "glitchflow.navigate",
    renderId: 9,
    line: 2,
  });
});

test("REQ-040 / REQ-040-S03: ズームとスクロールはクリック機能と併用できる", async ({
  page,
}) => {
  await page.goto("/");
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
    parseGlf('Object FE as "FE" type APP\nGlobal ->> FE: start'),
  );
  await page.getByRole("button", { name: "拡大" }).click();
  await expect(page.locator(".preview__zoom-level")).toHaveText("110%");
  await page.locator(".preview__scroller").evaluate((element) => {
    element.scrollLeft = 10;
    element.scrollTop = 10;
  });
  await expect(page.locator(".sequence-arrow")).toHaveAttribute(
    "data-source-line",
    "2",
  );
});

test("REQ-038 / REQ-038-S01: importしたObjectは定義元URIを送り、出力画像から位置情報を除く", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const messages: unknown[] = [];
    Object.assign(window, {
      __messages: messages,
      acquireVsCodeApi: () => ({
        postMessage: (message: unknown) => messages.push(message),
      }),
    });
  });
  await page.goto("/");
  const document = parseGlf('Object FE as "FE" type APP');
  document.objects[0].line = 1;
  document.objects[0].origin = { uri: "file:///definitions.glf", line: 7 };
  await page.evaluate(
    (value) =>
      window.postMessage(
        {
          type: "glitchflow.document",
          document: value,
          fileName: "flow.glf",
          renderId: 5,
        },
        "*",
      ),
    document,
  );
  const lane = page.locator(".sequence-lifeline");
  await expect(lane).toHaveAttribute("data-source-line", "7");
  await lane.locator(".sequence-object-label").click();
  const messages = await page.evaluate(
    () => (window as unknown as { __messages: unknown[] }).__messages,
  );
  expect(messages).toContainEqual({
    type: "glitchflow.navigate",
    renderId: 5,
    line: 7,
    sourceUri: "file:///definitions.glf",
  });
  await page.evaluate(() =>
    window.postMessage(
      {
        type: "glitchflow.export",
        requestId: "navigation-export",
        format: "svg",
        renderId: 5,
      },
      "*",
    ),
  );
  await expect
    .poll(async () =>
      page.evaluate(() =>
        (
          window as unknown as { __messages: { type?: string }[] }
        ).__messages.some(
          (message) => message.type === "glitchflow.export.result",
        ),
      ),
    )
    .toBe(true);
  const exported = await page.evaluate(
    () =>
      (
        window as unknown as { __messages: { type?: string; data?: string }[] }
      ).__messages.find(
        (message) => message.type === "glitchflow.export.result",
      )?.data ?? "",
  );
  expect(exported).not.toContain("data-source-uri");
  expect(exported).not.toContain("data-source-line");
});
