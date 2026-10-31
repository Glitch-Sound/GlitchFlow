import { mkdir, readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { parseGlf } from "../../src/core";

test.skip(
  process.env.CAPTURE_MARKETING_GIF !== "1",
  "紹介GIFの生成時だけ実行する",
);

test("紹介GIFのフレームを生成する", async ({ page }) => {
  const source = await readFile("examples/session-isolation.glf", "utf8");
  const icon = (await readFile("docs/images/glitchflow-icon-128.png")).toString(
    "base64",
  );
  const lines = source.split("\n");
  const parsedDocument = parseGlf(source);
  expect(parsedDocument.diagnostics).toEqual([]);
  await mkdir("test-results/marketing-gif-frames", { recursive: true });
  await page.setViewportSize({ width: 960, height: 540 });
  await page.setContent(`
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; color: #e5eef7; background: #0e1520; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .top { height: 66px; display: flex; align-items: center; padding: 0 22px; gap: 15px; background: #101a26; border-bottom: 1px solid #304050; }
      .mark { width: 44px; height: 44px; display:block; object-fit:contain; }
      .brand { font-size: 19px; font-weight: 800; letter-spacing: -.4px; }
      .tag { margin-left: auto; border: 1px solid #3e5869; border-radius: 20px; padding: 5px 11px; color:#a8d9e8; font-size:12px; }
      .stage { height: 414px; display: grid; grid-template-columns: 380px 580px; }
      .code { border-right: 1px solid #344657; background:#141d29; overflow:hidden; }
      .bar { height: 36px; padding: 10px 16px; color:#9eafc0; font-size:12px; border-bottom: 1px solid #2b3948; }
      .bar strong { color:#e5eef7; font-weight:600; }
      .body { padding: 12px 0; font: 12.5px/20px ui-monospace, SFMono-Regular, Menlo, monospace; }
      .line { display:flex; white-space:pre; height:20px; }
      .line.focus { background:#233f4c; box-shadow: inset 3px 0 #59d9bd; }
      .num { width:38px; text-align:right; padding-right:11px; color:#607387; flex:none; }
      .txt { color:#ccd9e5; }
      .kw { color:#7dddb4; } .str { color:#e8c783; } .op { color:#9bc4fb; } .chg { color:#ff9f9a; }
      .preview { overflow:hidden; background:#121922; position:relative; }
      iframe { width:760px; height:550px; border:0; transform:scale(.76); transform-origin:top left; }
      .bottom { height:60px; display:flex; align-items:center; gap:13px; padding:0 21px; border-top:1px solid #304050; background:#101a26; }
      .step { color:#66dbba; font-size:13px; font-weight:800; letter-spacing:1px; }
      .caption { font-size:18px; font-weight:700; }
      .count { margin-left:auto; color:#7f93a8; font:12px ui-monospace,monospace; }
    </style>
    <div class="top"><img class="mark" src="data:image/png;base64,${icon}" alt=""><div class="brand">GlitchFlow</div><div class="tag">FLOW × DATA STATE</div></div>
    <div class="stage"><div class="code"><div class="bar"><strong>session-isolation.glf</strong> &nbsp; GLF source</div><div class="body" id="code"></div></div><div class="preview"><iframe id="preview" src="http://127.0.0.1:5173/"></iframe></div></div>
    <div class="bottom"><span class="step" id="step"></span><span class="caption" id="caption"></span><span class="count" id="count"></span></div>
  `);
  await expect(page.locator(".mark")).toHaveJSProperty("naturalWidth", 128);
  const frame = page.frameLocator("#preview");
  await expect(frame.locator("#app")).toBeVisible();
  await page.locator("#preview").evaluate((iframe, data) => {
    (iframe as HTMLIFrameElement).contentWindow?.postMessage(
      {
        type: "glitchflow.document",
        document: data,
        fileName: "session-isolation.glf",
      },
      "*",
    );
  }, parsedDocument);
  await expect(frame.locator(".sequence-diagram")).toBeVisible();
  const scenes = [
    {
      step: "01 / FLOW",
      caption: "処理の流れを、ひと目で",
      range: [8, 18],
      focus: [13, 15, 18],
      scroll: 0,
      left: 0,
    },
    {
      step: "02 / STATE",
      caption: "DBの状態を、処理と一緒に",
      range: [14, 27],
      focus: [18, 20, 22],
      scroll: 160,
      left: 540,
    },
    {
      step: "03 / CHANGE",
      caption: "変わったセルだけ、見逃さない",
      range: [27, 37],
      focus: [30, 31, 32],
      scroll: 560,
      left: 540,
    },
    {
      step: "04 / FILE",
      caption: "追加ファイルも、同じ時間軸に",
      range: [30, 42],
      focus: [35, 36, 37],
      scroll: 650,
      left: 680,
    },
  ];
  let index = 0;
  for (const scene of scenes) {
    for (let phase = 0; phase < 2; phase++) {
      const focus = phase === 0 ? [] : scene.focus;
      await page.evaluate(
        ({ lines, scene, focus, index }) => {
          const escapeHtml = (s: string) =>
            s
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;");
          const colorize = (s: string) =>
            escapeHtml(s)
              .replace(
                /(&quot;[^&]*&quot;|"[^"]*"|'[^']*')/g,
                '<span class="str">$1</span>',
              )
              .replace(
                /\b(Object|schema|state|sql|alt|case|else|type)\b/g,
                '<span class="kw">$1</span>',
              )
              .replace(/(-&gt;&gt;|&lt;--|\+)/g, '<span class="op">$1</span>')
              .replace(
                /(!"[^"]*"|\+ S-42\.json)/g,
                '<span class="chg">$1</span>',
              );
          const code = document.querySelector("#code");
          const step = document.querySelector("#step");
          const caption = document.querySelector("#caption");
          const count = document.querySelector("#count");
          if (!code || !step || !caption || !count)
            throw new Error("Marketing layout is incomplete");
          code.innerHTML = lines
            .slice(scene.range[0] - 1, scene.range[1])
            .map((line: string, offset: number) => {
              const number = scene.range[0] + offset;
              return `<div class="line ${focus.includes(number) ? "focus" : ""}"><span class="num">${number}</span><span class="txt">${colorize(line)}</span></div>`;
            })
            .join("");
          step.textContent = scene.step;
          caption.textContent = scene.caption;
          count.textContent = `${index + 1} / 8`;
        },
        { lines, scene, focus, index },
      );
      await frame.locator(".preview__scroller").evaluate((scroller, scene) => {
        scroller.scrollTop = scene.scroll;
        scroller.scrollLeft = scene.left;
      }, scene);
      await page.screenshot({
        path: `test-results/marketing-gif-frames/${String(index).padStart(2, "0")}.png`,
      });
      index++;
    }
  }
});
