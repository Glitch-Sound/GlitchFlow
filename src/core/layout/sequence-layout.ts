import type {
  Change,
  DbRow,
  FileNode,
  GlfDocument,
  GlfEvent,
} from "../model/glf-model";

type TimelineItem =
  | Exclude<GlfEvent, { kind: "alt" }>
  | { kind: "alt-open"; depth: number }
  | { kind: "branch-open"; label: string; depth: number; first: boolean }
  | { kind: "branch-close" }
  | { kind: "alt-close" };

function timeline(events: GlfEvent[], depth = 0): TimelineItem[] {
  return events.flatMap((event): TimelineItem[] => {
    if (event.kind !== "alt") return [event];
    return [
      { kind: "alt-open", depth },
      ...event.branches.flatMap((branch, index): TimelineItem[] => [
        { kind: "branch-open", label: branch.label, depth, first: index === 0 },
        ...timeline(branch.events, depth + 1),
        { kind: "branch-close" },
      ]),
      { kind: "alt-close" },
    ];
  });
}

interface PanelBox {
  objectId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
interface FileLine {
  name: string;
  depth: number;
  change: Change;
}

export interface SequenceLayout {
  width: number;
  height: number;
  lifelines: { id: string; label: string; x: number }[];
  messages: {
    from: string;
    to: string;
    mode: "sync" | "async" | "response";
    label: string;
    x1: number;
    x2: number;
    y: number;
  }[];
  processes: {
    objectId: string;
    text: string;
    emphasis: boolean;
    x: number;
    y: number;
  }[];
  activations: { objectId: string; x: number; startY: number; endY: number }[];
  dbStates: (PanelBox & {
    reference: string;
    columns: string[];
    columnWidths: number[];
    rows: DbRow[];
  })[];
  fileStates: (PanelBox & { nodes: FileLine[] })[];
  sqlBlocks: (PanelBox & { lines: string[] })[];
  fragments: {
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    branches: { label: string; y: number; endY: number }[];
  }[];
}

function flattenFile(nodes: FileNode[], depth = 0): FileLine[] {
  return nodes.flatMap((node) => [
    { name: node.name, depth, change: node.change },
    ...flattenFile(node.children, depth + 1),
  ]);
}

/** REQ-006, REQ-008..REQ-013: IRから分岐を含む表示座標を決定的に計算する。 */
export function layoutSequence(
  document: GlfDocument,
  measureText: (text: string) => number,
): SequenceLayout {
  const basic = timeline(document.events);
  const panelWidths = new Map<string, number>();
  const measured = basic.map((event) => {
    if (event.kind === "db-state") {
      const schema = document.schemas.find(
        (item) => item.reference.raw === event.reference.raw,
      );
      if (!schema) return undefined;
      const columns = schema.columns.map((item) => item.name);
      const columnWidths = columns.map((name, index) =>
        Math.max(
          80,
          measureText(name) + 40,
          ...event.rows.map(
            (row) => measureText(row.cells[index]?.value ?? "") + 40,
          ),
        ),
      );
      const width = columnWidths.reduce((sum, value) => sum + value, 0);
      const height = 30 + Math.max(1, event.rows.length) * 28;
      panelWidths.set(
        event.reference.objectId,
        Math.max(width, panelWidths.get(event.reference.objectId) ?? 0),
      );
      return {
        kind: "db-state" as const,
        width,
        height,
        columns,
        columnWidths,
      };
    }
    if (event.kind === "file-state") {
      const nodes = flattenFile(event.nodes);
      const width = Math.max(
        150,
        ...nodes.map((node) => node.depth * 20 + measureText(node.name) + 32),
      );
      const height = Math.max(40, nodes.length * 24 + 20);
      panelWidths.set(
        event.objectId,
        Math.max(width, panelWidths.get(event.objectId) ?? 0),
      );
      return { kind: "file-state" as const, width, height, nodes };
    }
    if (event.kind === "sql") {
      const lines = event.text.split("\n");
      const width = Math.max(
        150,
        ...lines.map((line) => measureText(line) + 32),
      );
      const height = lines.length * 22 + 22;
      panelWidths.set(
        event.objectId,
        Math.max(width, panelWidths.get(event.objectId) ?? 0),
      );
      return { kind: "sql" as const, width, height, lines };
    }
    return undefined;
  });
  const xById = new Map<string, number>();
  const globalLabelWidth = basic.reduce(
    (width, event) =>
      event.kind === "message" && event.from === "Global"
        ? Math.max(width, measureText(event.label))
        : width,
    0,
  );
  let x = Math.max(110, globalLabelWidth + 16);
  const lifelines = document.objects.map((object, index) => {
    if (index > 0) {
      const previous = document.objects[index - 1];
      const between = basic.reduce(
        (width, event) =>
          event.kind === "message" &&
          ((event.from === previous.id && event.to === object.id) ||
            (event.to === previous.id && event.from === object.id))
            ? Math.max(width, measureText(event.label))
            : width,
        0,
      );
      const previousProcessWidth = basic.reduce(
        (width, event) =>
          event.kind === "process" && event.objectId === previous.id
            ? Math.max(width, measureText(event.text))
            : width,
        0,
      );
      x += Math.max(
        190,
        between + 56,
        previousProcessWidth + 52,
        (panelWidths.get(previous.id) ?? 0) + 64,
        (measureText(previous.label) + measureText(object.label)) / 2 + 48,
      );
    }
    xById.set(object.id, x);
    return { id: object.id, label: object.label, x };
  });
  const messages: SequenceLayout["messages"] = [];
  const processes: SequenceLayout["processes"] = [];
  const activations: SequenceLayout["activations"] = [];
  const dbStates: SequenceLayout["dbStates"] = [];
  const fileStates: SequenceLayout["fileStates"] = [];
  const sqlBlocks: SequenceLayout["sqlBlocks"] = [];
  const fragments: SequenceLayout["fragments"] = [];
  const active = new Map<string, number>();
  const fragmentStack: {
    fragment: SequenceLayout["fragments"][number];
    inherited: Map<string, number>;
    exits: Map<string, number>[];
  }[] = [];
  let lastY = 96;
  let lastPanel: { kind: string; objectId: string } | undefined;
  for (let index = 0; index < basic.length; index++) {
    const event = basic[index];
    const panel = measured[index];
    if (event.kind === "alt-open") {
      const y = lastY + 28;
      const left = (lifelines[0]?.x ?? 110) - 72 + event.depth * 12;
      const right =
        Math.max(
          x + 90,
          ...[...dbStates, ...fileStates, ...sqlBlocks].map(
            (box) => box.x + box.width + 18,
          ),
          ...[...panelWidths.entries()].map(
            ([id, width]) => (xById.get(id) ?? 0) + width + 50,
          ),
        ) -
        event.depth * 12;
      const fragment = {
        x: left,
        y,
        width: right - left,
        height: 0,
        depth: event.depth,
        branches: [] as { label: string; y: number; endY: number }[],
      };
      fragments.push(fragment);
      fragmentStack.push({ fragment, inherited: new Map(active), exits: [] });
      for (const [objectId, startY] of active) {
        const laneX = xById.get(objectId);
        if (laneX !== undefined)
          activations.push({ objectId, x: laneX, startY, endY: y + 26 });
      }
      active.clear();
      lastY = y;
      continue;
    }
    if (event.kind === "branch-open") {
      const current = fragmentStack.at(-1);
      if (!current) continue;
      lastY += event.first ? 38 : 36;
      const y = lastY;
      current.fragment.branches.push({ label: event.label, y, endY: y });
      active.clear();
      for (const id of current.inherited.keys())
        active.set(id, y - (event.first ? 12 : 24));
      lastPanel = undefined;
      continue;
    }
    if (event.kind === "branch-close") {
      const current = fragmentStack.at(-1);
      if (!current) continue;
      lastY += 22;
      const branch = current.fragment.branches.at(-1);
      if (branch) branch.endY = lastY;
      current.exits.push(new Map(active));
      for (const [objectId, startY] of active) {
        const laneX = xById.get(objectId);
        if (laneX !== undefined)
          activations.push({ objectId, x: laneX, startY, endY: lastY });
      }
      active.clear();
      continue;
    }
    if (event.kind === "alt-close") {
      const current = fragmentStack.pop();
      if (!current) continue;
      current.fragment.height = lastY + 10 - current.fragment.y;
      const common = current.exits[0] ?? new Map<string, number>();
      for (const id of common.keys())
        if (current.exits.every((path) => path.has(id)))
          active.set(id, lastY + 10);
      lastY += 30;
      lastPanel = undefined;
      continue;
    }
    if (
      event.kind === "message" &&
      (xById.get(event.to) === undefined ||
        (event.from !== "Global" && xById.get(event.from) === undefined))
    )
      continue;
    if (
      event.kind !== "message" &&
      xById.get(
        event.kind === "db-state" ? event.reference.objectId : event.objectId,
      ) === undefined
    )
      continue;
    if (
      panel &&
      (event.kind === "db-state" ||
        event.kind === "file-state" ||
        event.kind === "sql")
    ) {
      const objectId =
        event.kind === "db-state" ? event.reference.objectId : event.objectId;
      const laneX = xById.get(objectId);
      if (laneX === undefined) continue;
      const consecutiveSql =
        event.kind === "sql" &&
        lastPanel?.kind === "db-state" &&
        lastPanel.objectId === objectId;
      const y = lastY + (consecutiveSql ? 12 : 40);
      const box = {
        objectId,
        x: laneX + 28,
        y,
        width: panel.width,
        height: panel.height,
      };
      if (event.kind === "db-state" && panel.kind === "db-state")
        dbStates.push({
          ...box,
          reference: event.reference.raw,
          columns: panel.columns,
          columnWidths: panel.columnWidths,
          rows: event.rows,
        });
      if (event.kind === "file-state" && panel.kind === "file-state")
        fileStates.push({ ...box, nodes: panel.nodes });
      if (event.kind === "sql" && panel.kind === "sql")
        sqlBlocks.push({ ...box, lines: panel.lines });
      lastY = y + panel.height;
      lastPanel = { kind: event.kind, objectId };
      continue;
    }
    if (
      event.kind === "db-state" ||
      event.kind === "file-state" ||
      event.kind === "sql"
    )
      continue;
    const y = lastY + 56;
    lastY = y;
    lastPanel = undefined;
    if (event.kind === "activation") {
      if (event.action === "start") {
        const preceding = basic[index - 1];
        const startY =
          preceding?.kind === "message" && preceding.to === event.objectId
            ? (messages.at(-1)?.y ?? y)
            : y;
        active.set(event.objectId, startY);
      } else {
        const startY = active.get(event.objectId);
        const laneX = xById.get(event.objectId);
        if (startY !== undefined && laneX !== undefined) {
          activations.push({
            objectId: event.objectId,
            x: laneX,
            startY,
            endY: y,
          });
          active.delete(event.objectId);
        }
      }
    } else if (event.kind === "process") {
      const laneX = xById.get(event.objectId);
      if (laneX === undefined) continue;
      processes.push({
        objectId: event.objectId,
        text: event.text,
        emphasis: event.emphasis,
        x: laneX + 20,
        y,
      });
    } else if (event.kind === "message") {
      const fromX = event.from === "Global" ? 24 : xById.get(event.from);
      const toX = xById.get(event.to);
      if (fromX === undefined || toX === undefined) continue;
      const direction = Math.sign(toX - fromX) || 1;
      const following = basic[index + 1];
      const targetActive =
        active.has(event.to) ||
        (following?.kind === "activation" &&
          following.action === "start" &&
          following.objectId === event.to);
      messages.push({
        from: event.from,
        to: event.to,
        mode: event.mode,
        label: event.label,
        x1: fromX + (active.has(event.from) ? direction * 9 : 0),
        x2: toX - (targetActive ? direction * 9 : 0),
        y,
      });
    }
  }
  for (const [objectId, startY] of active) {
    const laneX = xById.get(objectId);
    if (laneX === undefined) continue;
    activations.push({
      objectId,
      x: laneX,
      startY,
      endY: lastY + 42,
    });
  }
  const processRight = processes.reduce(
    (right, process) =>
      Math.max(right, process.x + measureText(process.text) + 28),
    0,
  );
  const labelRight = lifelines.reduce(
    (right, lane) => Math.max(right, lane.x + measureText(lane.label) / 2 + 24),
    0,
  );
  return {
    width: Math.max(
      320,
      x + 100,
      processRight,
      labelRight,
      ...[...dbStates, ...fileStates, ...sqlBlocks].map(
        (box) => box.x + box.width + 24,
      ),
    ),
    height: Math.max(240, lastY + 72),
    lifelines,
    messages,
    processes,
    activations,
    dbStates,
    fileStates,
    sqlBlocks,
    fragments,
  };
}
