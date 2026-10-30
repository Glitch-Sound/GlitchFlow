import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

async function show(page: Page, source: string): Promise<void> {
  await page.goto("/");
  const document = parseGlf(source);
  await page.evaluate(
    (data) =>
      window.postMessage(
        { type: "glitchflow.document", document: data, fileName: "login.glf" },
        "*",
      ),
    document,
  );
  await expect(page.locator(".sequence-diagram")).toBeVisible();
}

test("REQ-022 / REQ-022-S01: Objectと活性を種別色で二段表示する", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  for (const [id, type, color] of [
    ["FE", "APP", "rgb(116, 201, 248)"],
    ["BE", "API", "rgb(178, 135, 255)"],
    ["DB", "DB", "rgb(71, 215, 139)"],
    ["FILE", "FILE", "rgb(237, 163, 87)"],
  ]) {
    const lane = page.locator(`.sequence-lifeline[data-object-id="${id}"]`);
    await expect(lane.locator(".sequence-object-subtitle")).toHaveText(type);
    await expect(lane.locator(".sequence-object")).toHaveCSS("stroke", color);
    await expect(
      page.locator(`.sequence-activation[data-object-id="${id}"]`).first(),
    ).toHaveCSS("stroke", color);
  }
  await expect(page.locator(".sequence-diagram")).toHaveCSS(
    "background-image",
    /linear-gradient/,
  );
  await expect(page.locator(".preview__toolbar")).toHaveCSS(
    "background-color",
    "rgb(28, 36, 48)",
  );
});

test("REQ-022 / REQ-022-S01: 拡大縮小ボタンの表示文字と操作をそろえる", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".preview__toolbar button")).toHaveText([
    "-",
    "Reset",
    "+",
    "⇩",
  ]);
  const diagram = page.locator(".sequence-diagram");
  const initialWidth = Number(await diagram.getAttribute("width"));
  await page.getByRole("button", { name: "縮小" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBeLessThan(
    initialWidth,
  );
  await page.getByRole("button", { name: "等倍" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBe(initialWidth);
  await page.getByRole("button", { name: "拡大" }).click();
  expect(Number(await diagram.getAttribute("width"))).toBeGreaterThan(
    initialWidth,
  );
});

test("REQ-022 / REQ-022-S02: FEATUREとMODULEをライトテーマ相当でも区別する", async ({
  page,
}) => {
  await page.addInitScript(() =>
    document.documentElement.style.setProperty(
      "--vscode-editor-background",
      "#ffffff",
    ),
  );
  await show(
    page,
    'Object F as "機能" type FEATURE\nObject M as "モジュール" type MODULE\nF+\nF ->> M: 実行\nM+\nM-\nF-',
  );
  for (const [id, type, color] of [
    ["F", "FEATURE", "rgb(231, 155, 190)"],
    ["M", "MODULE", "rgb(165, 179, 196)"],
  ]) {
    const lane = page.locator(`.sequence-lifeline[data-object-id="${id}"]`);
    await expect(lane.locator(".sequence-object-subtitle")).toHaveText(type);
    await expect(lane.locator(".sequence-object")).toHaveCSS("stroke", color);
  }
  await expect(page.locator(".preview")).toHaveCSS(
    "background-color",
    "rgb(18, 25, 34)",
  );
});

test("REQ-022 / REQ-022-S01、REQ-022-S02: Objectの副題にDSLのIDを表示しない", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  for (const [id, type] of [
    ["FE", "APP"],
    ["BE", "API"],
    ["DB", "DB"],
    ["FILE", "FILE"],
  ]) {
    const lane = page.locator(`.sequence-lifeline[data-object-id="${id}"]`);
    await expect(lane.locator(".sequence-object-subtitle")).toHaveText(type);
    await expect(lane.locator(".sequence-object-label")).not.toHaveText(id);
  }
  await show(
    page,
    'Object F as "機能" type FEATURE\nObject M as "モジュール" type MODULE',
  );
  await expect(page.locator(".sequence-object-subtitle")).toHaveText([
    "FEATURE",
    "MODULE",
  ]);
});

test("REQ-022 / REQ-022-S01、REQ-023 / REQ-023-S01: Object下と各メッセージ上部に余白を設ける", async ({
  page,
}) => {
  await show(
    page,
    'Object FE as "Frontend" type APP\nObject BE as "Backend" type API\nGlobal ->> FE: 開始\nFE ->> BE: 要求\nBE --> FE: 応答\nalt:\n    case 成功:\n        FE ->> BE: 再試行\n    else:\n        FE ->> BE: 中止',
  );
  const gaps = await page.locator(".sequence-diagram").evaluate((svg) => {
    const object = svg.querySelector<SVGRectElement>(".sequence-object");
    const lines = Array.from(
      svg.querySelectorAll<SVGLineElement>(".sequence-arrow-line"),
    );
    const tags = Array.from(
      svg.querySelectorAll<SVGRectElement>(".sequence-message-tag"),
    );
    const caseLabel = Array.from(
      svg.querySelectorAll<SVGTextElement>(".sequence-fragment-branch-label"),
    ).find((label) => label.textContent === "case 成功");
    if (!object || lines.length !== 5 || tags.length !== 5 || !caseLabel)
      return null;
    const lineY = lines.map((line) => Number(line.getAttribute("y1")));
    return {
      objectToFirstMessage:
        tags[0].getBBox().y - object.getBBox().y - object.getBBox().height,
      consecutiveMessages: [lineY[1] - lineY[0], lineY[2] - lineY[1]],
      caseToMessage:
        tags[3].getBBox().y -
        caseLabel.getBBox().y -
        caseLabel.getBBox().height,
    };
  });
  expect(gaps).not.toBeNull();
  expect(gaps?.objectToFirstMessage).toBeGreaterThanOrEqual(10);
  for (const gap of gaps?.consecutiveMessages ?? [])
    expect(gap).toBeGreaterThanOrEqual(60);
  expect(gaps?.caseToMessage).toBeGreaterThanOrEqual(8);
});

test("REQ-023 / REQ-023-S01: メッセージと処理を背景付きラベルで区別する", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".sequence-message-tag")).toHaveCount(
    await page.locator(".sequence-arrow").count(),
  );
  await expect(page.locator(".sequence-process-card")).toHaveCount(
    await page.locator(".sequence-process").count(),
  );
  const emphasis = page.locator(".sequence-process--emphasis").first();
  await expect(emphasis).toHaveCSS("font-weight", "700");
  await expect(emphasis).toHaveCSS("font-size", "14px");
  const normal = page
    .locator(".sequence-process:not(.sequence-process--emphasis)")
    .first();
  await expect(normal).toHaveCSS("font-size", "12px");
  const text = page.locator(".sequence-arrow .sequence-message-label").first();
  await expect(text).toHaveText("アプリ起動");
  await expect(
    page.locator(".sequence-arrow--response .sequence-arrow-line").first(),
  ).toHaveCSS("stroke-dasharray", "6px, 5px");
  const clippedLabels = await page
    .locator(".sequence-diagram")
    .evaluate((svg) => {
      const pairs = Array.from(svg.querySelectorAll(".sequence-arrow")).map(
        (group) => [
          group.querySelector(".sequence-message-tag"),
          group.querySelector(".sequence-message-label"),
        ],
      );
      for (const label of Array.from(
        svg.querySelectorAll(".sequence-process"),
      )) {
        pairs.push([
          label.previousElementSibling?.previousElementSibling ?? null,
          label,
        ]);
      }
      return pairs.filter(([background, label]) => {
        if (
          !(background instanceof SVGGraphicsElement) ||
          !(label instanceof SVGGraphicsElement)
        )
          return true;
        const outer = background.getBBox();
        const inner = label.getBBox();
        return (
          inner.x < outer.x ||
          inner.y < outer.y ||
          inner.x + inner.width > outer.x + outer.width ||
          inner.y + inner.height > outer.y + outer.height
        );
      }).length;
    });
  expect(clippedLabels).toBe(0);
});

test("REQ-023 / REQ-023-S01: 処理カードの余白と応答時の活性下端をそろえる", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  const geometry = await page.locator(".sequence-diagram").evaluate((svg) => {
    const fe = svg.querySelector<SVGRectElement>(
      '.sequence-activation[data-object-id="FE"]',
    );
    const cards = Array.from(
      svg.querySelectorAll<SVGRectElement>(".sequence-process-card"),
    ).slice(0, 3);
    if (!fe || cards.length !== 3) return null;
    const activation = fe.getBBox();
    const cardBoxes = cards.map((card) => card.getBBox());
    const responseGaps = [
      ["検索結果", "DB"],
      ["200 OK", "BE"],
      ["401 Unauthorized", "BE"],
    ].map(([label, id]) => {
      const response = Array.from(
        svg.querySelectorAll<SVGGElement>(".sequence-arrow--response"),
      ).find((group) => group.textContent?.includes(label));
      const responseY = Number(
        response?.querySelector(".sequence-arrow-line")?.getAttribute("y1"),
      );
      const bars = Array.from(
        svg.querySelectorAll<SVGRectElement>(
          `.sequence-activation[data-object-id="${id}"]`,
        ),
      );
      const bar = bars.find(
        (item) =>
          Math.abs(item.getBBox().y + item.getBBox().height - responseY) <= 1,
      );
      return bar ? 0 : Number.POSITIVE_INFINITY;
    });
    return {
      leftGap: Math.min(
        ...cardBoxes.map((card) => card.x - activation.x - activation.width),
      ),
      lowerGap: Math.min(
        cardBoxes[1].y - cardBoxes[0].y - cardBoxes[0].height,
        cardBoxes[2].y - cardBoxes[1].y - cardBoxes[1].height,
      ),
      responseGaps,
    };
  });
  expect(geometry).not.toBeNull();
  expect(geometry?.leftGap).toBeGreaterThanOrEqual(8);
  expect(geometry?.lowerGap).toBeGreaterThanOrEqual(8);
  expect(geometry?.responseGaps).toEqual([0, 0, 0]);
});

test("REQ-024 / REQ-024-S01: DBとFILEに見出しと接続線を付けSQLを接する", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".state-db-title")).toHaveText("users");
  await expect(page.locator(".state-file-title")).toHaveText("Storage");
  await expect(page.locator(".state-sql-title")).toHaveText("SQL");
  await expect(page.locator(".state-db-link")).toHaveCount(1);
  await expect(page.locator(".state-file-link")).toHaveCount(1);
  const db = await page.locator(".state-db-background").boundingBox();
  const sql = await page.locator(".state-sql-background").boundingBox();
  expect(db && sql).not.toBeNull();
  if (!db || !sql) return;
  expect(Math.abs(sql.y - db.y - db.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(sql.x - db.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(sql.width - db.width)).toBeLessThanOrEqual(1);
  await expect(page.locator(".state-db-heading")).toHaveCount(5);
  await expect(page.locator(".state-db-cell")).toHaveCount(5);
  await expect(page.locator(".state-file-node--added")).toHaveText("user.info");
});

test("REQ-024 / REQ-024-S01: DBの数値は右寄せで文字列の外側の引用符を除く", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".state-db-cell")).toHaveText([
    "1",
    "taro",
    "hashed-xxx",
    "2026-10-27 22:00:00",
    "2026-10-27 22:00:00",
  ]);
  const alignments = await page.locator(".state-db-cell").evaluateAll((items) =>
    items.map((item) => ({
      anchor: item.getAttribute("text-anchor"),
      x: Number(item.getAttribute("x")),
      grid: item.previousElementSibling?.getBoundingClientRect(),
      bounds: item.getBoundingClientRect(),
    })),
  );
  expect(alignments[0].anchor).toBe("end");
  expect(alignments[0].grid).toBeDefined();
  expect(alignments[0].bounds.right).toBeLessThanOrEqual(
    (alignments[0].grid?.right ?? 0) - 8,
  );
  expect(alignments[1].anchor).not.toBe("end");
  expect(alignments[1].bounds.left).toBeGreaterThanOrEqual(
    (alignments[1].grid?.left ?? 0) + 8,
  );
  await show(
    page,
    'Object DB as "DB" type DB\nschema DB.metrics:\n    amount: decimal\n    note: text\nstate DB.metrics:\n    [-12.5, "credit"]',
  );
  await expect(page.locator(".state-db-cell")).toHaveText(["-12.5", "credit"]);
  await expect(page.locator(".state-db-cell").first()).toHaveAttribute(
    "text-anchor",
    "end",
  );
  await expect(page.locator(".state-db-cell").last()).not.toHaveAttribute(
    "text-anchor",
    "end",
  );
});

test("REQ-024 / REQ-024-S01: State見出しにObject IDを出さずDB列幅を文字に合わせる", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".state-db-title")).toHaveText("users");
  await expect(page.locator(".state-file-title")).toHaveText("Storage");
  const paddings = await page.locator(".state-db").evaluate((state) => {
    const headers = Array.from(
      state.querySelectorAll<SVGRectElement>(".state-db-header-cell"),
    );
    const names = Array.from(
      state.querySelectorAll<SVGTextElement>(".state-db-heading"),
    );
    const values = Array.from(
      state.querySelectorAll<SVGTextElement>(".state-db-cell"),
    );
    return headers.map(
      (header, index) =>
        header.getBBox().width -
        Math.max(names[index].getBBox().width, values[index].getBBox().width),
    );
  });
  expect(paddings).toHaveLength(5);
  for (const padding of paddings) {
    expect(padding).toBeGreaterThanOrEqual(19);
    expect(padding).toBeLessThanOrEqual(36);
  }
});

test("REQ-024 / REQ-024-S02: 独立Stateと長文を切らずに表示する", async ({
  page,
}) => {
  const value = "a".repeat(120);
  await page.setViewportSize({ width: 480, height: 600 });
  await show(
    page,
    `Object DB as "PostgreSQL" type DB\nschema DB.users:\n    name: text\nstate DB.users:\n    ["short"]\nstate DB.users:\n    ["${value}"]`,
  );
  await expect(page.locator(".state-db")).toHaveCount(2);
  await expect(page.locator(".state-sql")).toHaveCount(0);
  await expect(page.locator(".state-db-title")).toHaveCount(2);
  await expect(page.locator(".state-db-cell").nth(1)).toContainText(value);
  const cell = await page.locator(".state-db-cell").nth(1).boundingBox();
  const svg = await page.locator(".sequence-diagram").boundingBox();
  expect(cell && svg && cell.x + cell.width <= svg.x + svg.width).toBe(true);
  const scrollable = await page
    .locator(".preview__scroller")
    .evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(scrollable).toBe(true);
});

test("REQ-025 / REQ-025-S01: ログイン分岐のラベルとObject間隔", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  await expect(page.locator(".sequence-fragment-tag")).toHaveCount(1);
  await expect(page.locator(".sequence-fragment-branch-tag")).toHaveCount(0);
  await expect(page.locator(".sequence-fragment-branch-label")).toHaveText([
    "case ユーザヒット",
    "else",
  ]);
  const geometry = await page.locator(".sequence-diagram").evaluate((svg) => {
    const x = (id: string) =>
      Number(
        svg
          .querySelector(`.sequence-lifeline[data-object-id="${id}"] line`)
          ?.getAttribute("x1"),
      );
    const caseLabel = (
      svg.querySelector(".sequence-fragment-case-label") as SVGGraphicsElement
    ).getBBox();
    return {
      distance: x("FILE") - x("DB"),
      caseRight: caseLabel.x + caseLabel.width,
      feX: x("FE"),
    };
  });
  expect(geometry.distance).toBeLessThanOrEqual(300);
  expect(geometry.caseRight).toBeLessThan(geometry.feX - 8);
  await page.setViewportSize({ width: 1600, height: 1700 });
  await page.screenshot({
    path: "test-results/preview-appearance-login.png",
    fullPage: true,
  });
});

test("REQ-025 / REQ-025-S01: case文字を枠内に置き活性の水平の隙間をなくす", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  const geometry = await page.locator(".sequence-diagram").evaluate((svg) => {
    const frame = svg.querySelector<SVGRectElement>(".sequence-fragment-frame");
    const firstCase = svg.querySelector<SVGTextElement>(
      ".sequence-fragment-case-label",
    );
    const feBars = Array.from(
      svg.querySelectorAll<SVGRectElement>(
        '.sequence-activation[data-object-id="FE"]',
      ),
    ).map((bar) => bar.getBBox());
    if (!frame || !firstCase || feBars.length !== 2) return null;
    const frameY = frame.getBBox().y;
    return {
      caseOffset: firstCase.getBBox().y - frameY,
      joinedAtStart:
        feBars[0].y < frameY && feBars[0].y + feBars[0].height > frameY + 70,
      hasSeam: feBars.some(
        (bar) =>
          Math.abs(bar.y - (frameY + 26)) < 3 ||
          Math.abs(bar.y + bar.height - (frameY + 26)) < 3,
      ),
    };
  });
  expect(geometry).not.toBeNull();
  expect(geometry?.caseOffset).toBeGreaterThanOrEqual(30);
  expect(geometry?.caseOffset).toBeLessThanOrEqual(36);
  expect(geometry?.joinedAtStart).toBe(true);
  expect(geometry?.hasSeam).toBe(false);
});

test("REQ-025 / REQ-025-S01: caseラベルをaltと枠を避けて少し上げる", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  const geometry = await page
    .locator(".sequence-fragment")
    .evaluate((group) => {
      const frame = group.querySelector<SVGRectElement>(
        ".sequence-fragment-frame",
      );
      const alt = group.querySelector<SVGRectElement>(".sequence-fragment-tag");
      const firstCase = group.querySelector<SVGTextElement>(
        ".sequence-fragment-case-label",
      );
      if (!frame || !alt || !firstCase) return null;
      const frameBox = frame.getBBox();
      const altBox = alt.getBBox();
      const caseBox = firstCase.getBBox();
      return {
        topFromFrame: caseBox.y - frameBox.y,
        gapFromAlt: caseBox.y - altBox.y - altBox.height,
      };
    });
  expect(geometry).not.toBeNull();
  expect(geometry?.topFromFrame).toBeGreaterThanOrEqual(30);
  expect(geometry?.topFromFrame).toBeLessThanOrEqual(36);
  expect(geometry?.gapFromAlt).toBeGreaterThanOrEqual(12);
});

test("REQ-025 / REQ-025-S01、REQ-025-S02: caseを枠なしの赤い文字で描く", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  const caseLabel = page.locator(".sequence-fragment-branch-label").first();
  await expect(caseLabel).toHaveText("case ユーザヒット");
  await expect(caseLabel).toHaveCSS("fill", "rgb(221, 104, 114)");
  await expect(page.locator(".sequence-fragment-branch-tag")).toHaveCount(0);
  const geometry = await page
    .locator(".sequence-fragment")
    .evaluate((group) => {
      const frame = group.querySelector<SVGRectElement>(
        ".sequence-fragment-frame",
      );
      const alt = group.querySelector<SVGRectElement>(".sequence-fragment-tag");
      const label = group.querySelector<SVGTextElement>(
        ".sequence-fragment-branch-label",
      );
      if (!frame || !alt || !label) return null;
      const frameBox = frame.getBBox();
      const altBox = alt.getBBox();
      const labelBox = label.getBBox();
      return {
        topFromFrame: labelBox.y - frameBox.y,
        gapFromAlt: labelBox.y - altBox.y - altBox.height,
      };
    });
  expect(geometry).not.toBeNull();
  expect(geometry?.topFromFrame).toBeGreaterThanOrEqual(30);
  expect(geometry?.topFromFrame).toBeLessThanOrEqual(36);
  expect(geometry?.gapFromAlt).toBeGreaterThanOrEqual(12);
});

test("REQ-025 / REQ-025-S01、REQ-025-S02: elseも枠なしの赤い文字で描く", async ({
  page,
}) => {
  await show(page, readFileSync("examples/login.glf", "utf8"));
  const labels = page.locator(".sequence-fragment-branch-label");
  await expect(labels).toHaveText(["case ユーザヒット", "else"]);
  await expect(labels.nth(0)).toHaveCSS("fill", "rgb(221, 104, 114)");
  await expect(labels.nth(1)).toHaveCSS("fill", "rgb(221, 104, 114)");
  await expect(page.locator(".sequence-fragment-branch-tag")).toHaveCount(0);
  const gap = await page.locator(".sequence-fragment").evaluate((group) => {
    const divider = group.querySelector<SVGLineElement>(
      ".sequence-fragment-divider",
    );
    const label = Array.from(
      group.querySelectorAll<SVGTextElement>(".sequence-fragment-branch-label"),
    ).find((text) => text.textContent === "else");
    if (!divider || !label) return null;
    return label.getBBox().y - Number(divider.getAttribute("y1")) - 1;
  });
  expect(gap).not.toBeNull();
  expect(gap).toBeGreaterThanOrEqual(8);
});

test("REQ-025 / REQ-025-S02: 長文と入れ子をスクロール範囲内に収める", async ({
  page,
}) => {
  await show(
    page,
    `Object FE as "フロントエンド" type APP\nObject DB as "PostgreSQL" type DB\nschema DB.users:\n    id: int\n    value: text\nFE ->> DB: ${"長いメッセージ".repeat(12)}\nstate DB.users:\n    [1, "${"a".repeat(80)}"]\n    [2, "${"b".repeat(80)}"]\nalt:\n    case 外側:\n        alt:\n            case 内側:\n                FE: 成功\n            else:\n                FE: 再試行\n    else:\n        FE: 中断`,
  );
  await expect(page.locator(".sequence-fragment-tag")).toHaveCount(2);
  await expect(page.locator(".sequence-fragment-branch-tag")).toHaveCount(0);
  const overflow = await page.locator(".sequence-diagram").evaluate((svg) => {
    const view = (svg as SVGSVGElement).viewBox.baseVal;
    return Array.from(
      svg.querySelectorAll("text, .state-db, .sequence-fragment-frame"),
    )
      .filter((item) => {
        const box = (item as SVGGraphicsElement).getBBox();
        return (
          box.x < 0 ||
          box.y < 0 ||
          box.x + box.width > view.width ||
          box.y + box.height > view.height
        );
      })
      .map((item) => {
        const box = (item as SVGGraphicsElement).getBBox();
        return {
          text: item.textContent,
          className: item.getAttribute("class"),
          x: box.x,
          y: box.y,
          right: box.x + box.width,
          bottom: box.y + box.height,
          width: view.width,
          height: view.height,
        };
      });
  });
  expect(overflow).toEqual([]);
});
