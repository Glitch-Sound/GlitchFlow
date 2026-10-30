import { expect, test } from "@playwright/test";
import {
  type GlfDocument,
  mergeGlfDefinitions,
  parseGlf,
} from "../../src/core";

test.skip(process.env.CAPTURE_README !== "1", "README画像の更新時だけ実行する");

async function show(
  page: import("@playwright/test").Page,
  source: string | GlfDocument,
  fileName = "notation.glf",
): Promise<void> {
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto("/");
  const document = typeof source === "string" ? parseGlf(source) : source;
  expect(document.diagnostics).toEqual([]);
  await page.evaluate(
    ({ document, fileName }) =>
      window.postMessage(
        { type: "glitchflow.document", document, fileName },
        "*",
      ),
    { document, fileName },
  );
  await expect(page.locator(".sequence-diagram")).toBeVisible();
}

const definitions = 'Object FE as "画面" type APP\nObject BE as "API" type API';
const database =
  'Object DB as "データベース" type DB\nschema DB.users:\n    id: int\n    name: text\nstate DB.users:\n    [1, "太郎"]\n    + [2, "次郎"]';

test("READMEの記法キャプチャを生成する", async ({ page }) => {
  test.setTimeout(120_000);
  const cases = [
    {
      name: "object",
      source: `${definitions}\nObject DB as "DB" type DB`,
    },
    {
      name: "message",
      source: `${definitions}\nFE ->> BE: 保存を要求\nFE -> BE: 更新を通知`,
    },
    {
      name: "response",
      source: `${definitions}\nFE ->> BE: データを取得\nFE <-- BE: 取得結果`,
    },
    {
      name: "activation",
      source: `${definitions}\nFE ->> BE: 保存\nBE+\nBE: 書き込み\nBE-`,
    },
    {
      name: "process",
      source: `${definitions}\nFE: 通常の処理\n    内容を確認\nFE: *重要な処理\n    入力を確認*`,
    },
    { name: "db", source: database },
    {
      name: "file",
      source:
        'Object FILE as "保存先" type FILE\nstate FILE:\n    users/\n        + report.json\n        - old.json',
    },
    {
      name: "sql",
      source:
        'Object DB as "データベース" type DB\nsql DB:\n    SELECT id, name\n    FROM users',
    },
    {
      name: "alt",
      source: `${definitions}\nalt:\n    case 成功:\n        FE ->> BE: 保存\n    else:\n        FE: エラーを表示`,
    },
    {
      name: "opt",
      source: `${definitions}\nopt 認可済み:\n    FE ->> BE: 更新`,
    },
    {
      name: "loop",
      source: `${definitions}\nloop 再試行:\n    FE ->> BE: 再送`,
    },
    {
      name: "par",
      source: `${definitions}\npar:\n    case 画面更新:\n        FE: 表示を更新\n    case 記録:\n        BE: 履歴を記録`,
    },
    {
      name: "break",
      source: `${definitions}\nbreak エラー:\n    FE: 処理を中断\nFE: 後続の処理`,
    },
  ];

  await show(page, 'title: "処理の例"\nObject FE as "画面" type APP');
  await expect(page.getByRole("heading", { name: "処理の例" })).toBeVisible();
  await page.screenshot({
    path: "docs/images/notation-title.png",
    clip: { x: 0, y: 0, width: 590, height: 220 },
  });

  for (const { name, source } of cases) {
    await show(page, source);
    await page.locator(".sequence-diagram").screenshot({
      path: `docs/images/notation-${name}.png`,
    });
  }

  await show(page, database);
  await page.locator(".state-db-column").first().hover();
  await expect(page.locator(".preview__column-tooltip")).toHaveText("id: int");
  await page.screenshot({
    path: "docs/images/notation-schema-hover.png",
    clip: { x: 0, y: 0, width: 620, height: 370 },
  });

  const sharedSource =
    'Object DB as "共有DB" type DB\nschema DB.users:\n    id: int\n    name: text';
  const flowSource =
    'import "./common.glf"\nObject FE as "画面" type APP\nFE ->> DB: 検索\nstate DB.users:\n    [1, "太郎"]';
  const merged = mergeGlfDefinitions(
    parseGlf(flowSource, { validate: false }),
    [
      {
        uri: "file:///guide/common.glf",
        importLine: 1,
        document: parseGlf(sharedSource, { validate: false }),
      },
    ],
  );
  await show(page, merged, "flow.glf");
  await expect(page.locator(".sequence-object-label")).toHaveText([
    "画面",
    "共有DB",
  ]);
  await page.locator(".sequence-diagram").screenshot({
    path: "docs/images/notation-import.png",
  });
});
