import { type GlfDocument, layoutSequence } from "../../../../core";
import {
  ACTIVATION_WIDTH,
  type SequenceLayout,
} from "../../../../core/layout/sequence-layout";
import { changeZoom, getZoom, resetZoom } from "../model/zoom";

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

/** REQ-009..REQ-011、REQ-024: 表示用状態をIRの明示属性だけで安全なSVGノードへ変換する。 */
function renderState(layout: SequenceLayout, svg: SVGSVGElement): void {
  for (const state of layout.dbStates) {
    const group = svgElement("g", {
      class: "state-db",
      "data-reference": state.reference,
    });
    const laneX = layout.lifelines.find(
      (lane) => lane.id === state.objectId,
    )?.x;
    if (laneX !== undefined && !state.connectedToPrevious)
      group.append(
        svgElement("line", {
          x1: String(laneX + 8),
          x2: String(state.x),
          y1: String(state.y + 24),
          y2: String(state.y + 24),
          class: "state-db-link",
        }),
      );
    group.append(
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: String(state.height),
        class: "state-db-background",
      }),
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: "30",
        class: "state-db-title-band",
      }),
      svgText(state.x + 10, state.y + 20, state.title, "state-db-title"),
    );
    let offset = 0;
    for (let index = 0; index < state.columns.length; index++) {
      const cellX = state.x + offset;
      const width = state.columnWidths[index];
      group.append(
        svgElement("rect", {
          x: String(cellX),
          y: String(state.y + 30),
          width: String(width),
          height: "30",
          class: "state-db-header-cell",
        }),
      );
      group.append(
        svgText(
          cellX + 10,
          state.y + 50,
          state.columns[index],
          "state-db-heading",
        ),
      );
      for (let rowIndex = 0; rowIndex < state.rows.length; rowIndex++) {
        const row = state.rows[rowIndex];
        const cell = row.cells[index];
        const cellY = state.y + 60 + rowIndex * 28;
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
        const value = svgText(
          state.numericColumns[index] ? cellX + width - 10 : cellX + 10,
          cellY + 19,
          cell?.value ?? "",
          `state-db-cell state-db-cell--${change}`,
        );
        if (state.numericColumns[index])
          value.setAttribute("text-anchor", "end");
        group.append(value);
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
    const laneX = layout.lifelines.find(
      (lane) => lane.id === state.objectId,
    )?.x;
    if (laneX !== undefined)
      group.append(
        svgElement("line", {
          x1: String(laneX + 8),
          x2: String(state.x),
          y1: String(state.y + 24),
          y2: String(state.y + 24),
          class: "state-file-link",
        }),
      );
    group.append(
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: String(state.height),
        class: "state-file-background",
      }),
      svgElement("rect", {
        x: String(state.x),
        y: String(state.y),
        width: String(state.width),
        height: "30",
        class: "state-file-title-band",
      }),
      svgText(state.x + 10, state.y + 20, state.title, "state-file-title"),
    );
    state.nodes.forEach((node, index) => {
      group.append(
        svgText(
          state.x + 12 + node.depth * 20,
          state.y + 58 + index * 24,
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
      svgText(sql.x + 12, sql.y + 18, "SQL", "state-sql-title"),
    );
    sql.lines.forEach((line, index) => {
      group.append(
        svgText(sql.x + 12, sql.y + 44 + index * 20, line, "state-sql-line"),
      );
    });
    svg.append(group);
  }
}

/** REQ-001、REQ-006..REQ-008、REQ-012、REQ-018..REQ-025: 複合フラグメントを含むシーケンスを安全なSVGノードで描画する。 */
export function renderPreview(
  container: HTMLElement,
  documentData?: GlfDocument,
  fileName = "GlitchFlow Preview",
  onExport?: () => void,
): void {
  const previousScroller =
    container.querySelector<HTMLElement>(".preview__scroller");
  const previousScroll = {
    left: previousScroller?.scrollLeft ?? 0,
    top: previousScroller?.scrollTop ?? 0,
  };
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
    const dbCanvas = document.createElement("canvas");
    const dbContext = dbCanvas.getContext("2d");
    if (dbContext)
      dbContext.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
    const layout = layoutSequence(
      documentData,
      (text) => context?.measureText(text).width ?? text.length * 9,
      (text) => dbContext?.measureText(text).width ?? text.length * 8,
    );
    const scroller = document.createElement("div");
    scroller.className = "preview__scroller";
    const toolbar = document.createElement("div");
    toolbar.className = "preview__toolbar";
    const svg = svgElement("svg", {
      class: "sequence-diagram",
      width: String(layout.width * getZoom()),
      height: String(layout.height * getZoom()),
      viewBox: `0 0 ${layout.width} ${layout.height}`,
      role: "img",
      "aria-label": "シーケンス図",
    });
    const level = document.createElement("span");
    level.className = "preview__zoom-level";
    const applyZoom = (value: number) => {
      svg.setAttribute("width", String(layout.width * value));
      svg.setAttribute("height", String(layout.height * value));
      level.textContent = `${Math.round(value * 100)}%`;
    };
    const button = (
      label: string,
      accessibleName: string,
      action: () => number,
    ) => {
      const element = document.createElement("button");
      element.type = "button";
      element.textContent = label;
      element.setAttribute("aria-label", accessibleName);
      element.addEventListener("click", () => applyZoom(action()));
      toolbar.append(element);
    };
    button("-", "縮小", () => changeZoom(-0.1));
    button("Reset", "等倍", resetZoom);
    button("+", "拡大", () => changeZoom(0.1));
    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.textContent = "⇩";
    exportButton.title = "図をエクスポート";
    exportButton.setAttribute("aria-label", "図をエクスポート");
    exportButton.addEventListener("click", () => onExport?.());
    toolbar.append(exportButton);
    toolbar.append(level);
    applyZoom(getZoom());
    main.append(toolbar);
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
      const subtitle = lane.type;
      const labelWidth = Math.max(
        140,
        (context?.measureText(lane.label).width ?? lane.label.length * 9) + 32,
        (context?.measureText(subtitle).width ?? subtitle.length * 9) + 32,
      );
      group.append(
        svgElement("rect", {
          x: String(lane.x - labelWidth / 2),
          y: "18",
          width: String(labelWidth),
          height: "60",
          rx: "8",
          class: `sequence-object sequence-object--${lane.type.toLowerCase()}`,
        }),
      );
      const label = svgElement("text", {
        x: String(lane.x),
        y: "45",
        "text-anchor": "middle",
        class: "sequence-object-label",
      });
      label.textContent = lane.label;
      group.append(
        label,
        svgText(lane.x, 64, subtitle, "sequence-object-subtitle"),
        svgElement("line", {
          x1: String(lane.x),
          x2: String(lane.x),
          y1: "78",
          y2: String(layout.height - 24),
          class: "sequence-lifeline-line",
        }),
      );
      svg.append(group);
    }
    for (const activation of layout.activations) {
      svg.append(
        svgElement("rect", {
          x: String(activation.x - ACTIVATION_WIDTH / 2),
          y: String(activation.startY),
          width: String(ACTIVATION_WIDTH),
          height: String(Math.max(2, activation.endY - activation.startY)),
          class: `sequence-activation sequence-activation--${layout.lifelines.find((lane) => lane.id === activation.objectId)?.type.toLowerCase() ?? "module"}`,
          "data-object-id": activation.objectId,
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
      const labelWidth =
        (context?.measureText(message.label).width ??
          message.label.length * 9) + 16;
      group.append(
        svgElement("rect", {
          x: String((message.x1 + message.x2 - labelWidth) / 2),
          y: String(message.y - 29),
          width: String(labelWidth),
          height: "23",
          rx: "4",
          class: "sequence-message-tag",
        }),
        label,
      );
      svg.append(group);
    }
    for (const process of layout.processes) {
      const kind =
        layout.lifelines
          .find((lane) => lane.id === process.objectId)
          ?.type.toLowerCase() ?? "module";
      const cardHeight = process.emphasis ? 34 : 26;
      const cardTop = process.y - (process.emphasis ? 18 : 14);
      const cardWidth =
        (context?.measureText(process.text).width ?? process.text.length * 9) +
        20;
      svg.append(
        svgElement("rect", {
          x: String(process.x - 8),
          y: String(cardTop),
          width: String(cardWidth),
          height: String(cardHeight),
          rx: "3",
          class: `sequence-process-card sequence-process-card--${kind}${process.emphasis ? " sequence-process-card--emphasis" : ""}`,
        }),
        svgElement("rect", {
          x: String(process.x - 8),
          y: String(cardTop),
          width: "3",
          height: String(cardHeight),
          class: `sequence-process-accent sequence-process-accent--${kind}`,
        }),
      );
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
      const title = fragment.label
        ? `${fragment.kind} ${fragment.label}`
        : fragment.kind;
      group.append(
        svgElement("rect", {
          x: String(fragment.x + 6),
          y: String(fragment.y - 12),
          width: String(
            (context?.measureText(title).width ?? title.length * 9) + 18,
          ),
          height: "24",
          rx: "4",
          class: "sequence-fragment-tag",
        }),
        svgText(
          fragment.x + 15,
          fragment.y + 5,
          title,
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
        if (branch.label) {
          const branchTitle =
            branch.label === "else" ? "else" : `case ${branch.label}`;
          group.append(
            svgText(
              fragment.x + 15,
              branch.y + 3,
              branchTitle,
              `sequence-fragment-branch-label${branch.label === "else" ? "" : " sequence-fragment-case-label"}`,
            ),
          );
        }
      });
      svg.insertBefore(
        group,
        svg.querySelector(
          ".sequence-activation, .state-db, .state-file, .state-sql, .sequence-arrow, .sequence-process-card",
        ),
      );
    }
    scroller.append(svg);
    main.append(scroller);
  }
  container.replaceChildren(main);
  const nextScroller =
    container.querySelector<HTMLElement>(".preview__scroller");
  if (nextScroller) {
    nextScroller.scrollLeft = previousScroll.left;
    nextScroller.scrollTop = previousScroll.top;
  }
}
