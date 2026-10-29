import type { Diagnostic, GlfDocument, GlfEvent } from "../model/glf-model";

/** REQ-005、REQ-013、REQ-021: Object参照と経路ごとの明示的な活性操作を検証する。 */
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
      if (
        event.kind === "opt" ||
        event.kind === "loop" ||
        event.kind === "break"
      ) {
        const path = walk(event.events, new Map(active));
        if (!sameActive(active, path))
          diagnostics.push({
            code: "activation-fragment-mismatch",
            line: event.line,
            message: `${event.kind}の出口で活性状態が一致しない`,
          });
      }
      if (event.kind === "alt" || event.kind === "par") {
        const paths = event.branches.map((branch) =>
          walk(branch.events, new Map(active)),
        );
        if (paths.length > 0) {
          const same =
            paths.every((path) => sameActive(path, paths[0])) &&
            (event.kind !== "par" ||
              paths.every((path) => sameActive(path, active)));
          if (!same)
            diagnostics.push({
              code:
                event.kind === "alt"
                  ? "activation-branch-mismatch"
                  : "activation-fragment-mismatch",
              line: event.line,
              message: `${event.kind}の分岐出口で活性状態が一致しない`,
            });
          active = same
            ? paths[0]
            : new Map(paths.flatMap((path) => [...path.entries()]));
        }
      }
    }
    return active;
  }
  function sameActive(a: Map<string, number>, b: Map<string, number>): boolean {
    return a.size === b.size && [...a.keys()].every((id) => b.has(id));
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
