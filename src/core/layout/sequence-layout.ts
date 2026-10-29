import type { GlfDocument } from "../model/glf-model";

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
}

/** REQ-006, REQ-008: IRから基本シーケンスの座標を決定的に計算する。 */
export function layoutSequence(
  document: GlfDocument,
  measureText: (text: string) => number,
): SequenceLayout {
  const basic = document.events.filter(
    (event) =>
      event.kind === "message" ||
      event.kind === "process" ||
      event.kind === "activation",
  );
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
        (measureText(previous.label) + measureText(object.label)) / 2 + 48,
      );
    }
    xById.set(object.id, x);
    return { id: object.id, label: object.label, x };
  });
  const messages: SequenceLayout["messages"] = [];
  const processes: SequenceLayout["processes"] = [];
  const activations: SequenceLayout["activations"] = [];
  const active = new Map<string, number>();
  let lastY = 96;
  for (let index = 0; index < basic.length; index++) {
    const event = basic[index];
    if (
      event.kind === "message" &&
      (xById.get(event.to) === undefined ||
        (event.from !== "Global" && xById.get(event.from) === undefined))
    )
      continue;
    if (event.kind !== "message" && xById.get(event.objectId) === undefined)
      continue;
    const y = lastY + 56;
    lastY = y;
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
    } else {
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
    width: Math.max(320, x + 100, processRight, labelRight),
    height: Math.max(240, lastY + 72),
    lifelines,
    messages,
    processes,
    activations,
  };
}
