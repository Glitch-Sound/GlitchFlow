import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

type ExportMessage = {
  type: string;
  requestId?: string;
  format?: "png" | "svg";
  data?: string;
  error?: string;
};

async function setup(page: import("@playwright/test").Page, source: string) {
  await page.addInitScript(() => {
    const target = window as Window & {
      __glfMessages?: ExportMessage[];
      acquireVsCodeApi?: () => {
        postMessage: (message: ExportMessage) => void;
      };
    };
    target.__glfMessages = [];
    target.acquireVsCodeApi = () => ({
      postMessage: (message) => target.__glfMessages?.push(message),
    });
  });
  await page.goto("/");
  await page.evaluate((document) => {
    window.postMessage(
      { type: "glitchflow.document", document, fileName: "export.glf" },
      "*",
    );
  }, parseGlf(source));
  await expect(page.locator(".sequence-diagram")).toBeVisible();
}

async function request(
  page: import("@playwright/test").Page,
  format: "png" | "svg",
) {
  const requestId = `${format}-${Date.now()}`;
  await page.evaluate(
    ({ requestId, format }) => {
      window.postMessage({ type: "glitchflow.export", requestId, format }, "*");
    },
    { requestId, format },
  );
  await page.waitForFunction(
    (id) =>
      (
        window as Window & { __glfMessages?: ExportMessage[] }
      ).__glfMessages?.some(
        (message) =>
          message.type === "glitchflow.export.result" &&
          message.requestId === id,
      ),
    requestId,
  );
  const messages = await page.evaluate(
    () =>
      (window as Window & { __glfMessages?: ExportMessage[] }).__glfMessages ??
      [],
  );
  const result = messages.find(
    (message) =>
      message.type === "glitchflow.export.result" &&
      message.requestId === requestId,
  );
  expect(result).toBeDefined();
  return result as ExportMessage;
}

test("REQ-033 / REQ-033-S01: SVGとPNGにDB、FILE、SQL、分岐を含める", async ({
  page,
}) => {
  await setup(
    page,
    'Object FE as "フロント" type APP\nObject DB as "DB" type DB\nObject FILE as "Files" type FILE\nschema DB.users:\n    id: int\nFE ->> DB: 検索\nDB+\nstate DB.users:\n    [1]\nsql DB:\n    SELECT id FROM users\nDB-\nalt:\n    case 成功:\n        FE ->> FILE: 保存\n        state FILE:\n            + users/new.info\n    else:\n        FE: 失敗',
  );
  const svg = await request(page, "svg");
  expect(svg.error).toBeUndefined();
  expect(svg.data).toContain("<svg");
  await writeFile("test-results/export-diagram.svg", svg.data ?? "", "utf8");
  const inspection = await page.evaluate((xml) => {
    const parsed = new DOMParser().parseFromString(xml, "image/svg+xml");
    return {
      invalid: parsed.querySelectorAll("parsererror").length,
      text: parsed.querySelectorAll("text").length,
      db: parsed.querySelectorAll(".state-db").length,
      file: parsed.querySelectorAll(".state-file").length,
      sql: parsed.querySelectorAll(".state-sql").length,
      fragment: parsed.querySelectorAll(".sequence-fragment").length,
      toolbar: parsed.querySelectorAll(".preview__toolbar").length,
      width: Number(parsed.documentElement.getAttribute("width")),
      height: Number(parsed.documentElement.getAttribute("height")),
    };
  }, svg.data ?? "");
  expect(inspection.invalid).toBe(0);
  expect(inspection.text).toBeGreaterThan(5);
  expect([
    inspection.db,
    inspection.file,
    inspection.sql,
    inspection.fragment,
  ]).toEqual([1, 1, 1, 1]);
  expect(inspection.toolbar).toBe(0);
  const png = await request(page, "png");
  expect(png.error).toBeUndefined();
  expect(png.data?.startsWith("iVBORw0KGgo")).toBe(true);
  await writeFile(
    "test-results/export-diagram.png",
    Buffer.from(png.data ?? "", "base64"),
  );
  const size = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  }, png.data ?? "");
  expect(size[0]).toBeGreaterThanOrEqual(inspection.width);
  expect(size[1]).toBeGreaterThanOrEqual(inspection.height);
});

test("REQ-032 / REQ-032-S02、REQ-033-S02: ボタンとズーム非依存", async ({
  page,
}) => {
  await setup(
    page,
    'Object FE as "Front" type APP\nObject BE as "Backend" type API\nFE ->> BE: request\nBE+\nBE ->> FE: response\nBE-',
  );
  await page.getByRole("button", { name: "拡大" }).click();
  await page.locator(".preview__scroller").evaluate((element) => {
    element.scrollLeft = 100;
    element.scrollTop = 100;
  });
  const before = await page
    .locator(".sequence-diagram")
    .evaluate((element) => ({
      width: element.getAttribute("width"),
      scroll: element.parentElement?.scrollLeft,
    }));
  await page.getByRole("button", { name: "図をエクスポート" }).click();
  const clicked = await page.evaluate(() =>
    (
      window as Window & { __glfMessages?: ExportMessage[] }
    ).__glfMessages?.some(
      (message) => message.type === "glitchflow.export.clicked",
    ),
  );
  expect(clicked).toBe(true);
  const svg = await request(page, "svg");
  expect(svg.error).toBeUndefined();
  const exportedWidth = await page.evaluate(
    (xml) =>
      new DOMParser()
        .parseFromString(xml, "image/svg+xml")
        .documentElement.getAttribute("width"),
    svg.data ?? "",
  );
  const viewWidth = await page
    .locator(".sequence-diagram")
    .getAttribute("viewBox");
  expect(Number(exportedWidth)).toBe(Number(viewWidth?.split(" ")[2]));
  const after = await page.locator(".sequence-diagram").evaluate((element) => ({
    width: element.getAttribute("width"),
    scroll: element.parentElement?.scrollLeft,
  }));
  expect(after).toEqual(before);
});

test("REQ-034 / REQ-034-S01: 図がない場合はエラーを返す", async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as Window & {
      __glfMessages?: ExportMessage[];
      acquireVsCodeApi?: () => {
        postMessage: (message: ExportMessage) => void;
      };
    };
    target.__glfMessages = [];
    target.acquireVsCodeApi = () => ({
      postMessage: (message) => target.__glfMessages?.push(message),
    });
  });
  await page.goto("/");
  const result = await request(page, "svg");
  expect(result.error).toMatch(/図/);
});

test("REQ-033 / REQ-033-S01: PNGとプレビューの画素差を確認", async ({
  page,
}) => {
  await setup(
    page,
    'Object FE as "Front" type APP\nObject DB as "Database" type DB\nFE ->> DB: request\nDB+\nsql DB:\n    SELECT id FROM users\nDB-',
  );
  const preview = await page.locator(".sequence-diagram").screenshot();
  const png = await request(page, "png");
  expect(png.error).toBeUndefined();
  const difference = await page.evaluate(
    async ({ preview, exported }) => {
      const load = async (source: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${source}`;
        await image.decode();
        return image;
      };
      const reference = await load(preview);
      const output = await load(exported);
      const canvas = document.createElement("canvas");
      canvas.width = reference.naturalWidth;
      canvas.height = reference.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(reference, 0, 0);
      const a = context.getImageData(0, 0, canvas.width, canvas.height).data;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(output, 0, 0, canvas.width, canvas.height);
      const b = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let index = 0; index < a.length; index += 4)
        sum +=
          Math.abs(a[index] - b[index]) +
          Math.abs(a[index + 1] - b[index + 1]) +
          Math.abs(a[index + 2] - b[index + 2]);
      return sum / (canvas.width * canvas.height * 3);
    },
    { preview: preview.toString("base64"), exported: png.data ?? "" },
  );
  expect(difference).toBeLessThan(18);
});

test("REQ-033 / REQ-033-S02: 長い図の末尾までPNGへ出力", async ({ page }) => {
  const messages = Array.from(
    { length: 65 },
    (_, index) => `FE ->> BE: message ${index}`,
  ).join("\n");
  await setup(
    page,
    `Object FE as "Front" type APP\nObject BE as "Backend" type API\n${messages}`,
  );
  const box = await page.locator(".sequence-diagram").evaluate((element) => {
    const svg = element as SVGSVGElement;
    return {
      width: svg.viewBox.baseVal.width,
      height: svg.viewBox.baseVal.height,
    };
  });
  expect(box.height).toBeGreaterThan(2000);
  const svg = await request(page, "svg");
  expect(svg.data).toContain("message 64");
  const png = await request(page, "png");
  expect(png.error).toBeUndefined();
  const height = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    return image.naturalHeight;
  }, png.data ?? "");
  expect(height).toBeGreaterThanOrEqual(box.height);
});
