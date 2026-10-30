const SVG_NS = "http://www.w3.org/2000/svg";
const STYLE_PROPERTIES = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-linejoin",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "text-anchor",
  "text-decoration",
  "white-space",
] as const;

function sizeOf(svg: SVGSVGElement): { width: number; height: number } {
  const box = svg.viewBox.baseVal;
  if (
    !Number.isFinite(box.width) ||
    !Number.isFinite(box.height) ||
    box.width <= 0 ||
    box.height <= 0
  )
    throw new Error("図の寸法が不正なためエクスポートできない");
  return { width: box.width, height: box.height };
}

/** REQ-033: プレビューのSVGをズームとスクロールに依存しない単独の画像へ変換する。 */
export function serializeDiagram(svg: SVGSVGElement | null): string {
  if (
    !svg?.querySelector(
      ".sequence-lifeline, .state-db, .state-file, .state-sql, .sequence-arrow, .sequence-process, .sequence-fragment",
    )
  )
    throw new Error("エクスポートできる図が表示されていない");
  const { width, height } = sizeOf(svg);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  const originals = [svg, ...Array.from(svg.querySelectorAll<SVGElement>("*"))];
  const copies = [
    clone,
    ...Array.from(clone.querySelectorAll<SVGElement>("*")),
  ];
  for (let index = 0; index < originals.length; index++) {
    const computed = getComputedStyle(originals[index]);
    const target = copies[index];
    for (const property of STYLE_PROPERTIES) {
      const value = computed.getPropertyValue(property);
      if (value) target.style.setProperty(property, value);
    }
  }

  const background = document.createElementNS(SVG_NS, "rect");
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", String(width));
  background.setAttribute("height", String(height));
  const color = getComputedStyle(svg).backgroundColor;
  background.setAttribute(
    "fill",
    color && color !== "rgba(0, 0, 0, 0)" ? color : "#121922",
  );
  clone.insertBefore(background, clone.firstChild);

  const defs = document.createElementNS(SVG_NS, "defs");
  const pattern = document.createElementNS(SVG_NS, "pattern");
  pattern.setAttribute("id", "glitchflow-export-grid");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "40");
  pattern.setAttribute("height", "40");
  const stripe = document.createElementNS(SVG_NS, "line");
  stripe.setAttribute("x1", "0");
  stripe.setAttribute("x2", "40");
  stripe.setAttribute("y1", "39.5");
  stripe.setAttribute("y2", "39.5");
  stripe.setAttribute("stroke", "#fff");
  stripe.setAttribute("stroke-opacity", "0.015");
  pattern.append(stripe);
  defs.append(pattern);
  clone.insertBefore(defs, background.nextSibling);
  const grid = document.createElementNS(SVG_NS, "rect");
  grid.setAttribute("width", String(width));
  grid.setAttribute("height", String(height));
  grid.setAttribute("fill", "url(#glitchflow-export-grid)");
  clone.insertBefore(grid, defs.nextSibling);
  clone.removeAttribute("class");
  clone.style.removeProperty("background-color");
  clone.style.removeProperty("background-image");
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

/** REQ-033: 同一SVGを2倍を上限とするCanvasへラスタライズする。 */
export async function rasterizeDiagram(svgText: string): Promise<string> {
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  if (parsed.querySelector("parsererror"))
    throw new Error("SVG画像の生成に失敗した");
  const width = Number(parsed.documentElement.getAttribute("width"));
  const height = Number(parsed.documentElement.getAttribute("height"));
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error("図の寸法が不正なためPNGを作成できない");
  const scale = Math.min(
    2,
    16384 / Math.max(width, height),
    Math.sqrt(64_000_000 / (width * height)),
  );
  if (!Number.isFinite(scale) || scale <= 0)
    throw new Error("図が大きすぎてPNGを作成できない");
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("PNG変換用のCanvasを作成できない");
  const url = URL.createObjectURL(
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const encoded = canvas.toDataURL("image/png");
    if (!encoded.startsWith("data:image/png;base64,"))
      throw new Error("PNG画像を符号化できない");
    return encoded.slice("data:image/png;base64,".length);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("PNG")) throw error;
    throw new Error("PNG画像への変換に失敗した", { cause: error });
  } finally {
    URL.revokeObjectURL(url);
  }
}
