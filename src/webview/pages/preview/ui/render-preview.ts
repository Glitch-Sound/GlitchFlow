import { type GlfDocument, layoutSequence } from "../../../../core";

const NS = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  name: K,
  attributes: Record<string, string> = {},
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes))
    element.setAttribute(key, value);
  return element;
}

function marker(id: string, filled: boolean): SVGMarkerElement {
  const element = svgElement("marker", {
    id,
    viewBox: "0 0 12 12",
    refX: "11",
    refY: "6",
    markerWidth: "12",
    markerHeight: "12",
    orient: "auto",
    markerUnits: "userSpaceOnUse",
  });
  element.append(
    svgElement("path", {
      d: "M 1 1 L 11 6 L 1 11",
      fill: filled ? "#e7edf6" : "none",
      stroke: "#e7edf6",
      "stroke-width": "1.5",
      "stroke-linejoin": "round",
    }),
  );
  return element;
}

/** REQ-001, REQ-006..REQ-008: 基本シーケンスを安全なSVGノードで描画する。 */
export function renderPreview(
  container: HTMLElement,
  documentData?: GlfDocument,
  fileName = "GlitchFlow Preview",
): void {
  const main = document.createElement("main");
  main.className = "preview";
  const heading = document.createElement("h1");
  heading.className = "preview__heading";
  heading.textContent = documentData?.title ?? fileName;
  main.append(heading);
  if (documentData) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) context.font = "14px sans-serif";
    const layout = layoutSequence(
      documentData,
      (text) => context?.measureText(text).width ?? text.length * 9,
    );
    const scroller = document.createElement("div");
    scroller.className = "preview__scroller";
    const svg = svgElement("svg", {
      class: "sequence-diagram",
      width: String(layout.width),
      height: String(layout.height),
      viewBox: `0 0 ${layout.width} ${layout.height}`,
      role: "img",
      "aria-label": "シーケンス図",
    });
    const defs = svgElement("defs");
    defs.append(
      marker("sequence-arrow-filled", true),
      marker("sequence-arrow-open", false),
    );
    svg.append(defs);
    for (const lane of layout.lifelines) {
      const group = svgElement("g", {
        class: "sequence-lifeline",
        "data-object-id": lane.id,
      });
      const labelWidth = Math.max(
        100,
        (context?.measureText(lane.label).width ?? lane.label.length * 9) + 32,
      );
      group.append(
        svgElement("rect", {
          x: String(lane.x - labelWidth / 2),
          y: "26",
          width: String(labelWidth),
          height: "42",
          rx: "5",
          class: "sequence-object",
        }),
      );
      const label = svgElement("text", {
        x: String(lane.x),
        y: "52",
        "text-anchor": "middle",
        class: "sequence-object-label",
      });
      label.textContent = lane.label;
      group.append(
        label,
        svgElement("line", {
          x1: String(lane.x),
          x2: String(lane.x),
          y1: "68",
          y2: String(layout.height - 24),
          class: "sequence-lifeline-line",
        }),
      );
      svg.append(group);
    }
    for (const activation of layout.activations) {
      svg.append(
        svgElement("rect", {
          x: String(activation.x - 8),
          y: String(activation.startY),
          width: "16",
          height: String(Math.max(2, activation.endY - activation.startY)),
          class: "sequence-activation",
        }),
      );
    }
    for (const message of layout.messages) {
      const group = svgElement("g", {
        class: `sequence-arrow sequence-arrow--${message.mode}`,
      });
      group.append(
        svgElement("line", {
          x1: String(message.x1),
          x2: String(message.x2),
          y1: String(message.y),
          y2: String(message.y),
          class: "sequence-arrow-line",
          "marker-end": `url(#sequence-arrow-${message.mode === "sync" ? "filled" : "open"})`,
        }),
      );
      if (message.from === "Global")
        group.append(
          svgElement("circle", {
            cx: String(message.x1),
            cy: String(message.y),
            r: "5",
            class: "sequence-global-origin",
          }),
        );
      const label = svgElement("text", {
        x: String((message.x1 + message.x2) / 2),
        y: String(message.y - 9),
        "text-anchor": "middle",
        class: "sequence-message-label",
      });
      label.textContent = message.label;
      group.append(label);
      svg.append(group);
    }
    for (const process of layout.processes) {
      const label = svgElement("text", {
        x: String(process.x),
        y: String(process.y + 5),
        class: `sequence-process${process.emphasis ? " sequence-process--emphasis" : ""}`,
      });
      label.textContent = process.text;
      svg.append(label);
    }
    scroller.append(svg);
    main.append(scroller);
  }
  container.replaceChildren(main);
}
