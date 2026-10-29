import { type GlfDocument, layoutSequence } from "../../../../core";
import type { SequenceLayout } from "../../../../core/layout/sequence-layout";

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

function svgText(
  x: number,
  y: number,
  value: string,
  className: string,
): SVGTextElement {
  const element = svgElement("text", {
    x: String(x),
    y: String(y),
    class: className,
  });
  element.textContent = value;
  return element;
}

/** REQ-009..REQ-011: 表示用状態をIRの明示属性だけで安全なSVGノードへ変換する。 */
function renderState(layout: SequenceLayout, svg: SVGSVGElement): void {
  for (const state of layout.dbStates) {
    const group = svgElement("g", {
      class: "state-db",
      "data-reference": state.reference,
    });
    group.append(
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: String(state.height),
        class: "state-db-background",
      }),
    );
    let offset = 0;
    for (let index = 0; index < state.columns.length; index++) {
      const cellX = state.x + offset;
      const width = state.columnWidths[index];
      group.append(
        svgElement("rect", {
          x: String(cellX),
          y: String(state.y),
          width: String(width),
          height: "30",
          class: "state-db-header-cell",
        }),
      );
      group.append(
        svgText(
          cellX + 10,
          state.y + 20,
          state.columns[index],
          "state-db-heading",
        ),
      );
      for (let rowIndex = 0; rowIndex < state.rows.length; rowIndex++) {
        const row = state.rows[rowIndex];
        const cell = row.cells[index];
        const cellY = state.y + 30 + rowIndex * 28;
        group.append(
          svgElement("rect", {
            x: String(cellX),
            y: String(cellY),
            width: String(width),
            height: "28",
            class: "state-db-grid-cell",
          }),
        );
        const change =
          row.change === "unchanged"
            ? (cell?.change ?? "unchanged")
            : row.change;
        group.append(
          svgText(
            cellX + 10,
            cellY + 19,
            cell?.value ?? "",
            `state-db-cell state-db-cell--${change}`,
          ),
        );
      }
      offset += width;
    }
    svg.append(group);
  }
  for (const state of layout.fileStates) {
    const group = svgElement("g", {
      class: "state-file",
      "data-object-id": state.objectId,
    });
    group.append(
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: String(state.height),
        class: "state-file-background",
      }),
    );
    state.nodes.forEach((node, index) => {
      group.append(
        svgText(
          state.x + 12 + node.depth * 20,
          state.y + 27 + index * 24,
          node.name,
          `state-file-node state-file-node--${node.change}`,
        ),
      );
    });
    svg.append(group);
  }
  for (const sql of layout.sqlBlocks) {
    const group = svgElement("g", {
      class: "state-sql",
      "data-object-id": sql.objectId,
    });
    group.append(
      svgElement("rect", {
        x: String(sql.x),
        y: String(sql.y),
        width: String(sql.width),
        height: String(sql.height),
        class: "state-sql-background",
      }),
    );
    sql.lines.forEach((line, index) => {
      group.append(
        svgText(sql.x + 12, sql.y + 23 + index * 22, line, "state-sql-line"),
      );
    });
    svg.append(group);
  }
}

/** REQ-001, REQ-006..REQ-008, REQ-012: 分岐を含むシーケンスを安全なSVGノードで描画する。 */
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
    renderState(layout, svg);
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
    for (const fragment of layout.fragments) {
      const group = svgElement("g", { class: "sequence-fragment" });
      group.append(
        svgElement("rect", {
          x: String(fragment.x),
          y: String(fragment.y),
          width: String(fragment.width),
          height: String(fragment.height),
          class: "sequence-fragment-frame",
        }),
      );
      group.append(
        svgText(
          fragment.x + 10,
          fragment.y + 19,
          "alt",
          "sequence-fragment-label",
        ),
      );
      fragment.branches.forEach((branch, index) => {
        if (index > 0)
          group.append(
            svgElement("line", {
              x1: String(fragment.x),
              x2: String(fragment.x + fragment.width),
              y1: String(branch.y - 24),
              y2: String(branch.y - 24),
              class: "sequence-fragment-divider",
            }),
          );
        group.append(
          svgText(
            fragment.x + 10,
            branch.y - 8,
            branch.label === "else" ? "else" : `case ${branch.label}`,
            "sequence-fragment-branch-label",
          ),
        );
      });
      svg.append(group);
    }
    scroller.append(svg);
    main.append(scroller);
  }
  container.replaceChildren(main);
}
