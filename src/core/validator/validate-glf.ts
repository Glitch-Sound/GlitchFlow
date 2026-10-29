import type { Diagnostic, GlfDocument, GlfEvent } from "../model/glf-model";

/** REQ-005: Object参照と明示的な活性操作を検証する。 */
export function validateGlf(document: GlfDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const known = new Set(document.objects.map((object) => object.id));
  const check = (id: string, line: number, allowGlobal = false) => {
    if (!known.has(id) && !(allowGlobal && id === "Global"))
      diagnostics.push({
        code: "unknown-object",
        line,
        message: `未宣言のObject: ${id}`,
      });
  };
  for (const schema of document.schemas)
    check(schema.reference.objectId, schema.line);

  function walk(
    events: GlfEvent[],
    active: Map<string, number>,
  ): Map<string, number> {
    for (const event of events) {
      if (event.kind === "message") {
        check(event.from, event.line, true);
        check(event.to, event.line);
      }
      if (
        event.kind === "process" ||
        event.kind === "activation" ||
        event.kind === "file-state" ||
        event.kind === "sql"
      )
        check(event.objectId, event.line);
      if (event.kind === "db-state")
        check(event.reference.objectId, event.line);
      if (event.kind === "activation") {
        if (event.action === "start") active.set(event.objectId, event.line);
        else if (!active.has(event.objectId))
          diagnostics.push({
            code: "activation-unmatched",
            line: event.line,
            message: `開始していない活性の終了: ${event.objectId}`,
          });
        else active.delete(event.objectId);
      }
      if (event.kind === "alt") {
        const paths = event.branches.map((branch) =>
          walk(branch.events, new Map(active)),
        );
        if (
          paths.length > 0 &&
          paths.every(
            (path) =>
              [...path.keys()].join(",") === [...paths[0].keys()].join(","),
          )
        )
          active = paths[0];
      }
    }
    return active;
  }
  const active = walk(document.events, new Map());
  for (const [id, line] of active)
    diagnostics.push({
      code: "activation-unclosed",
      line,
      message: `活性が閉じていない: ${id}`,
    });
  return diagnostics;
}
