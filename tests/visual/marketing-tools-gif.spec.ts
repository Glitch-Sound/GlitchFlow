import { mkdir, readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { mergeGlfDefinitions, parseGlf } from "../../src/core";

test.skip(
  process.env.CAPTURE_MARKETING_GIF !== "1",
  "紹介GIFの生成時だけ実行する",
);

test("補完・診断・import・エクスポートの紹介フレームを生成する", async ({
  page,
}) => {
  const originalSource = await readFile(
    "examples/session-isolation.glf",
    "utf8",
  );
  const original = parseGlf(originalSource);
  expect(original.diagnostics).toEqual([]);
  const bad = parseGlf('Object APP as "画面" type APP\nAPP ->> BAD: 要求');
  expect(bad.diagnostics.some((item) => item.message.includes("BAD"))).toBe(
    true,
  );
  const commonSource =
    'Object APP as "監視コンソール" type APP\nObject API as "セキュリティAPI" type API\nObject DB as "セッションDB" type DB\nObject FILE as "証跡ストア" type FILE\nschema DB.sessions:\n    id: text\n    status: text\n    risk_score: int';
  const flowSource = `title: "不審セッションの隔離と証跡保全"\nimport "./common.glf"\n${originalSource.split("\n").slice(12).join("\n")}`;
  const imported = mergeGlfDefinitions(
    parseGlf(flowSource, { validate: false }),
    [
      {
        uri: "file:///demo/common.glf",
        importLine: 2,
        document: parseGlf(commonSource, { validate: false }),
      },
    ],
  );
  expect(imported.diagnostics).toEqual([]);
  await mkdir("test-results/marketing-tools-gif-frames", { recursive: true });
  await page.setViewportSize({ width: 960, height: 540 });
  await page.setContent(`
    <style>
      * { box-sizing:border-box; }
      body { margin:0; color:#e5eef7; background:#0e1520; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
      .top { height:66px; display:flex; align-items:center; gap:15px; padding:0 22px; background:#101a26; border-bottom:1px solid #304050; }
      .mark { width:29px; height:29px; border-radius:7px; background:linear-gradient(135deg,#52d997,#42aaf7); display:grid; place-items:center; color:#08131b; font-size:20px; font-weight:900; }
      .brand { font-size:19px; font-weight:800; letter-spacing:-.4px; }
      .tag { margin-left:auto; border:1px solid #3e5869; border-radius:20px; padding:5px 11px; color:#a8d9e8; font-size:12px; }
      .stage { height:414px; display:grid; grid-template-columns:380px 580px; }
      .editor { position:relative; border-right:1px solid #344657; background:#141d29; overflow:hidden; }
      .tab { height:36px; padding:10px 16px; color:#9eafc0; font-size:12px; border-bottom:1px solid #2b3948; }
      .tab strong { color:#e5eef7; font-weight:600; }
      .code { padding:12px 0; font:12.5px/21px ui-monospace,SFMono-Regular,Menlo,monospace; }
      .line { height:21px; display:flex; white-space:pre; }
      .line.focus { background:#24414d; box-shadow:inset 3px 0 #60dcbf; }
      .line.error .text { text-decoration:underline wavy #fa7777 1px; text-underline-offset:4px; }
      .num { width:39px; padding-right:11px; text-align:right; color:#64788e; flex:none; }
      .text { color:#dce7f3; }
      .keyword { color:#78d9ad; } .string { color:#e7c883; } .accent { color:#a8cafa; }
      .popup { position:absolute; left:82px; top:186px; width:230px; border:1px solid #556b80; border-radius:5px; background:#263748; box-shadow:0 12px 30px #0009; overflow:hidden; font:12px ui-monospace,monospace; }
      .popup .row { padding:9px 12px; border-bottom:1px solid #3b4b5c; }
      .popup .row.active { background:#34566a; color:#d9ffef; }
      .popup small { color:#a5b8c9; margin-left:10px; }
      .problems { position:absolute; bottom:0; width:100%; height:110px; background:#1e2935; border-top:1px solid #485b6e; padding:11px 15px; font-size:12px; }
      .problems b { font-size:11px; color:#b6c9d7; }
      .problem { margin-top:13px; padding:8px; background:#2a3542; border-left:3px solid #f27474; line-height:1.45; }
      .problem em { color:#f59393; font-style:normal; }
      .files { padding:13px 15px; display:grid; gap:10px; }
      .file { border:1px solid #354b5c; border-radius:5px; background:#1b2935; overflow:hidden; }
      .file strong { display:block; padding:6px 10px; color:#9dc5df; background:#263948; font-size:11px; }
      .file pre { margin:0; padding:7px 11px; color:#d6e5ee; font:11.5px/17px ui-monospace,monospace; }
      .note { margin:12px 18px; padding:12px; border-left:3px solid #60dcbf; background:#223b43; font-size:13px; line-height:1.55; }
      .preview { position:relative; overflow:hidden; background:#121922; }
      iframe { width:760px; height:550px; border:0; transform:scale(.76); transform-origin:top left; }
      .overlay { position:absolute; right:24px; top:72px; z-index:2; }
      .hint { background:#284d57; border:1px solid #65cbb6; border-radius:6px; padding:9px 13px; box-shadow:0 8px 24px #0008; font-size:13px; }
      .pick { width:272px; background:#253849; border:1px solid #64809a; border-radius:7px; box-shadow:0 14px 40px #000a; overflow:hidden; font-size:13px; }
      .pick .title { padding:11px 14px; background:#30485b; color:#dbe9f4; }
      .pick .choice { padding:11px 14px; border-top:1px solid #425c70; }
      .pick .choice:first-of-type { background:#34596a; }
      .pick small { display:block; color:#afc3d1; font-size:11px; margin-top:3px; }
      .bottom { height:60px; display:flex; align-items:center; gap:13px; padding:0 21px; border-top:1px solid #304050; background:#101a26; }
      .step { color:#66dbba; font-size:13px; font-weight:800; letter-spacing:1px; }
      .caption { font-size:18px; font-weight:700; }
      .count { margin-left:auto; color:#7f93a8; font:12px ui-monospace,monospace; }
    </style>
    <div class="top"><div class="mark">G</div><div class="brand">GlitchFlow</div><div class="tag">WRITE × REUSE × EXPORT</div></div>
    <div class="stage"><div class="editor"><div class="tab" id="tab"></div><div id="editor-content"></div></div><div class="preview"><iframe id="preview" src="http://127.0.0.1:5173/"></iframe><div class="overlay" id="overlay"></div></div></div>
    <div class="bottom"><span class="step" id="step"></span><span class="caption" id="caption"></span><span class="count" id="count"></span></div>
  `);
  const frame = page.frameLocator("#preview");
  await expect(frame.locator("#app")).toBeVisible();
  const showDocument = async (data: typeof original) => {
    await page.locator("#preview").evaluate((iframe, parsed) => {
      (iframe as HTMLIFrameElement).contentWindow?.postMessage(
        {
          type: "glitchflow.document",
          document: parsed,
          fileName: "session-isolation.glf",
        },
        "*",
      );
    }, data);
    await expect(frame.locator(".sequence-diagram")).toBeVisible();
  };
  await showDocument(original);
  const scenes = [
    {
      step: "01 / ASSIST",
      caption: "DSLの入力を候補がサポート",
      top: 0,
      left: 0,
    },
    {
      step: "02 / CHECK",
      caption: "参照ミスはProblemsで確認",
      top: 0,
      left: 0,
    },
    {
      step: "03 / IMPORT",
      caption: "定義を分割して、ひとつの図に",
      top: 160,
      left: 540,
    },
    {
      step: "04 / EXPORT",
      caption: "図全体をPNG・SVGで保存",
      top: 560,
      left: 540,
    },
  ];
  const completionCode = [
    'Object APP as "監視コンソール" type APP',
    'Object API as "セキュリティAPI" type API',
    'Object DB as "セッションDB" type DB',
    "",
    "APP ->> API: 隔離を要求",
    "API ->> ",
  ];
  const problemCode = [
    'Object APP as "監視コンソール" type APP',
    'Object API as "セキュリティAPI" type API',
    'Object DB as "セッションDB" type DB',
    "",
    "APP ->> API: 隔離を要求",
    "API ->> BAD: 更新",
  ];
  const codeHtml = (lines: string[], focus: number, error = -1) =>
    `<div class="code">${lines
      .map((line, index) => {
        const escaped = line
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
        return `<div class="line ${index === focus ? "focus" : ""} ${index === error ? "error" : ""}"><span class="num">${index + 1}</span><span class="text">${escaped}</span></div>`;
      })
      .join("")}</div>`;
  for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex++) {
    const scene = scenes[sceneIndex];
    if (sceneIndex === 2) await showDocument(imported);
    if (sceneIndex === 3) await showDocument(original);
    for (let phase = 0; phase < 2; phase++) {
      let editor = "";
      let overlay = "";
      if (sceneIndex === 0) {
        editor =
          codeHtml(completionCode, 5) +
          (phase
            ? '<div class="popup"><div class="row active">DB <small>宣言済みObject</small></div><div class="row">API <small>宣言済みObject</small></div></div>'
            : "");
      } else if (sceneIndex === 1) {
        editor =
          codeHtml(problemCode, 5, 5) +
          (phase
            ? `<div class="problems"><b>PROBLEMS &nbsp; 1</b><div class="problem"><em>●</em> ${bad.diagnostics[0].message}<br><small>session-isolation.glf · GlitchFlow</small></div></div>`
            : "");
      } else if (sceneIndex === 2) {
        editor =
          `<div class="files"><div class="file"><strong>common.glf · 抜粋</strong><pre>Object DB as "セッションDB" type DB\nschema DB.sessions:\n    id: text\n    status: text\n    risk_score: int</pre></div><div class="file"><strong>session-isolation.glf · 抜粋</strong><pre>import "./common.glf"\nstate DB.sessions:\n    ["S-42", "active", 92]\nsql DB:</pre></div></div>` +
          (phase
            ? '<div class="note">共通定義を読み込み、同じ図に表示</div>'
            : "");
      } else {
        editor = codeHtml(
          [
            'title: "不審セッションの隔離"',
            "",
            'Object APP as "監視コンソール" type APP',
            'Object API as "セキュリティAPI" type API',
            'Object DB as "セッションDB" type DB',
            'Object FILE as "証跡ストア" type FILE',
            "",
            "state DB.sessions:",
            '    ["S-42", !"isolated", 92]',
            "state FILE:",
            "    + S-42.json",
          ],
          7,
        );
        overlay = phase
          ? '<div class="pick"><div class="title">エクスポート形式を選択</div><div class="choice">PNG<small>高解像度の画像</small></div><div class="choice">SVG<small>拡大可能なベクター画像</small></div></div>'
          : '<div class="hint">⇩ 図をエクスポート</div>';
      }
      await page.evaluate(
        ({ scene, sceneIndex, phase, editor, overlay }) => {
          const setText = (id: string, value: string) => {
            const node = document.getElementById(id);
            if (!node) throw new Error(id);
            node.textContent = value;
          };
          const setHtml = (id: string, value: string) => {
            const node = document.getElementById(id);
            if (!node) throw new Error(id);
            node.innerHTML = value;
          };
          setText("step", scene.step);
          setText("caption", scene.caption);
          setText("count", `${sceneIndex * 2 + phase + 1} / 8`);
          setHtml(
            "tab",
            `<strong>session-isolation.glf</strong> &nbsp; GLF source`,
          );
          setHtml("editor-content", editor);
          setHtml("overlay", overlay);
        },
        { scene, sceneIndex, phase, editor, overlay },
      );
      await frame
        .locator(".preview__scroller")
        .evaluate((scroller, position) => {
          scroller.scrollTop = position.top;
          scroller.scrollLeft = position.left;
        }, scene);
      await page.screenshot({
        path: `test-results/marketing-tools-gif-frames/${String(sceneIndex * 2 + phase).padStart(2, "0")}.png`,
      });
    }
  }
});
