import type {
  Change,
  DbCell,
  DbRow,
  FileNode,
  GlfDocument,
  GlfEvent,
  ObjectType,
  TableReference,
} from "../model/glf-model";
import { validateGlf } from "../validator/validate-glf";

interface SourceLine {
  text: string;
  indent: number;
  number: number;
  hasTabIndent: boolean;
}

const objectTypes = new Set(["APP", "API", "DB", "FILE", "FEATURE", "MODULE"]);
const identifier = "[A-Za-z_][A-Za-z0-9_]*";
const tablePattern = new RegExp(
  `^(${identifier})\\.(${identifier})(?:\\.(${identifier}))?$`,
);
const objectPattern = new RegExp(
  `^Object\\s+(${identifier})\\s+as\\s+"([^"]*)"\\s+type\\s+(${identifier})$`,
);
const messagePattern = new RegExp(
  `^(${identifier})\\s*(->>|-->|->|<--|<<-|<-)\\s*(${identifier}):\\s*(.+)$`,
);
const processPattern = new RegExp(`^(${identifier}):\\s*(.*)$`);
const activationPattern = new RegExp(`^(${identifier})([+-])$`);

function tableReference(raw: string): TableReference | undefined {
  const parts = tablePattern.exec(raw);
  if (!parts) return undefined;
  return {
    raw,
    objectId: parts[1],
    schema: parts[3] ? parts[2] : undefined,
    table: parts[3] ?? parts[2],
  };
}

function splitCells(text: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  let escaped = false;
  for (const char of text) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\" && quoted) {
      current += char;
      escaped = true;
      continue;
    }
    if (char === '"') quoted = !quoted;
    if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function changeFor(marker: string | undefined): Change {
  return marker === "+" ? "added" : marker === "-" ? "removed" : "unchanged";
}

/** REQ-002..REQ-005、REQ-018..REQ-021: .glfを表示用IRと行番号付き診断に変換する。 */
export function parseGlf(
  source: string,
  options: { validate?: boolean } = {},
): GlfDocument {
  const document: GlfDocument = {
    imports: [],
    objects: [],
    schemas: [],
    events: [],
    diagnostics: [],
  };
  const lines: SourceLine[] = source
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((raw, index) => ({
      text: raw.trim(),
      indent: raw.match(/^ */)?.[0].length ?? 0,
      number: index + 1,
      hasTabIndent: /^\s*\t/.test(raw),
    }))
    .filter((line) => line.text.length > 0);
  let index = 0;
  let titleSeen = false;
  const error = (code: string, line: number, message: string) =>
    document.diagnostics.push({ code, line, message });
  for (const line of lines) {
    if (line.hasTabIndent)
      error("indent", line.number, "インデントには空白を使う");
  }

  function children(parent: SourceLine, nested = false): SourceLine[] {
    const result: SourceLine[] = [];
    const next = lines[index];
    if (!next || next.indent <= parent.indent) {
      error("indent", parent.number, "ブロックの内容がない");
      return result;
    }
    const expected = next.indent;
    if (expected !== parent.indent + 4)
      error("indent", next.number, "インデントは4空白ずつ増やす");
    while (index < lines.length && lines[index].indent > parent.indent) {
      if (
        (!nested && lines[index].indent !== expected) ||
        (nested && (lines[index].indent - expected) % 4 !== 0)
      )
        error("indent", lines[index].number, "ブロック内のインデントが不正");
      result.push(lines[index++]);
    }
    return result;
  }

  function parseFileNodes(
    rows: SourceLine[],
    parentIndent: number,
  ): FileNode[] {
    let cursor = 0;
    function level(indent: number): FileNode[] {
      const nodes: FileNode[] = [];
      while (cursor < rows.length) {
        const line = rows[cursor];
        if (line.indent < indent) break;
        if (line.indent > indent) {
          error("indent", line.number, "FILEの階層が不正");
          cursor++;
          continue;
        }
        cursor++;
        const match = /^([+-])\s+(.+)$/.exec(line.text);
        const node: FileNode = {
          name: (match?.[2] ?? line.text).trim(),
          change: changeFor(match?.[1]),
          children: [],
          line: line.number,
        };
        if (rows[cursor]?.indent > indent) {
          if (rows[cursor].indent !== indent + 4)
            error("indent", rows[cursor].number, "FILEの階層は4空白ずつ増やす");
          node.children = level(rows[cursor].indent);
        }
        nodes.push(node);
      }
      return nodes;
    }
    return rows.length ? level(parentIndent + 4) : [];
  }

  function parseEvents(indent: number, stopOnBranch = false): GlfEvent[] {
    const events: GlfEvent[] = [];
    while (index < lines.length) {
      const line = lines[index];
      if (line.indent < indent) break;
      if (
        stopOnBranch &&
        line.indent === indent &&
        /^(case\s+.+:|else:)$/.test(line.text)
      )
        break;
      if (line.indent !== indent) {
        error("indent", line.number, "イベントのインデントが不正");
        index++;
        continue;
      }
      index++;
      const text = line.text;

      if (text.startsWith("import")) {
        const match = /^import\s+"([^"]+)"$/.exec(text);
        if (!match || line.indent !== 0)
          error("import-syntax", line.number, "importの構文または位置が不正");
        else document.imports.push({ path: match[1], line: line.number });
        continue;
      }

      if (text.startsWith("title:")) {
        const match = /^title:\s*"([^"]*)"$/.exec(text);
        if (titleSeen)
          error("title-duplicate", line.number, "titleは1回だけ指定できる");
        titleSeen = true;
        if (line !== lines[0])
          error("title-position", line.number, "titleは最初の非空行に指定する");
        if (!match) error("syntax", line.number, "titleの構文が不正");
        else if (match[1].length === 0)
          error("title-empty", line.number, "titleは空文字にできない");
        else if (line === lines[0]) document.title = match[1];
        continue;
      }
      const object = objectPattern.exec(text);
      if (object) {
        if (!objectTypes.has(object[3]))
          error("object-type", line.number, "未知のObject種別");
        else if (
          document.objects.some((item) => item.id === object[1]) ||
          object[1] === "Global"
        )
          error(
            "object-duplicate",
            line.number,
            "Object IDが重複または予約済み",
          );
        else
          document.objects.push({
            id: object[1],
            label: object[2],
            type: object[3] as ObjectType,
            line: line.number,
          });
        continue;
      }
      if (text.startsWith("Object ")) {
        error("syntax", line.number, "Objectの構文が不正");
        continue;
      }

      if (text.startsWith("schema ")) {
        const match = /^schema\s+([^:]+):$/.exec(text);
        const reference = match && tableReference(match[1]);
        const rows = children(line);
        if (!reference) {
          error("syntax", line.number, "schemaの参照が不正");
          continue;
        }
        const columns = rows.flatMap((row) => {
          const column = new RegExp(
            `^(${identifier}):\\s*(${identifier})$`,
          ).exec(row.text);
          if (!column) {
            error("syntax", row.number, "schemaのカラムが不正");
            return [];
          }
          return [{ name: column[1], type: column[2], line: row.number }];
        });
        document.schemas.push({ reference, columns, line: line.number });
        continue;
      }
      if (text.startsWith("state ")) {
        const match = /^state\s+([^:]+):$/.exec(text);
        const rows = children(line, match?.[1] === "FILE");
        if (!match) {
          error("syntax", line.number, "stateの参照が不正");
          continue;
        }
        if (match[1] === "FILE") {
          events.push({
            kind: "file-state",
            objectId: "FILE",
            nodes: parseFileNodes(rows, line.indent),
            line: line.number,
          });
        } else {
          const reference = tableReference(match[1]);
          if (!reference) {
            error("syntax", line.number, "DB stateの参照が不正");
            continue;
          }
          const parsedRows: DbRow[] = rows.flatMap((row) => {
            const record = /^([+-])?\s*\[(.*)\]$/.exec(row.text);
            if (!record) {
              error("syntax", row.number, "DB行の構文が不正");
              return [];
            }
            const cells: DbCell[] = splitCells(record[2]).map((cell) => ({
              value: cell.startsWith("!") ? cell.slice(1) : cell,
              change: cell.startsWith("!") ? "updated" : "unchanged",
            }));
            return [{ cells, change: changeFor(record[1]), line: row.number }];
          });
          events.push({
            kind: "db-state",
            reference,
            rows: parsedRows,
            line: line.number,
          });
        }
        continue;
      }
      if (text.startsWith("sql ")) {
        const match = new RegExp(`^sql\\s+(${identifier}):$`).exec(text);
        const rows = children(line);
        if (!match) error("syntax", line.number, "sqlの参照が不正");
        else
          events.push({
            kind: "sql",
            objectId: match[1],
            text: rows.map((row) => row.text).join("\n"),
            line: line.number,
          });
        continue;
      }
      const single = /^(opt|loop|break)\s+(.+):$/.exec(text);
      if (single) {
        if (
          lines[index] &&
          lines[index].indent > indent &&
          lines[index].indent !== indent + 4
        )
          error("indent", lines[index].number, "本体は4空白下げる");
        const body = parseEvents(indent + 4);
        if (body.length === 0) error("indent", line.number, "空のフラグメント");
        events.push({
          kind: single[1] as "opt" | "loop" | "break",
          label: single[2],
          events: body,
          line: line.number,
        });
        continue;
      }
      if (text === "alt:" || text === "par:") {
        const kind = text === "alt:" ? "alt" : "par";
        const branches: { label: string; events: GlfEvent[]; line: number }[] =
          [];
        if (!lines[index] || lines[index].indent <= indent) {
          error("indent", line.number, `${kind}の分岐がない`);
          events.push({ kind, branches, line: line.number });
          continue;
        }
        const branchIndent = lines[index].indent;
        if (branchIndent !== indent + 4)
          error("indent", lines[index].number, "分岐は4空白下げる");
        while (index < lines.length && lines[index].indent === branchIndent) {
          const branchLine = lines[index++];
          const branch = /^case\s+(.+):$/.exec(branchLine.text);
          if (!branch && !(kind === "alt" && branchLine.text === "else:")) {
            error(
              "syntax",
              branchLine.number,
              kind === "par" ? "caseが必要" : "caseまたはelseが必要",
            );
            continue;
          }
          const label = branch?.[1] ?? "else";
          const branchEvents = parseEvents(branchIndent + 4);
          if (branchEvents.length === 0)
            error("indent", branchLine.number, "空の分岐");
          branches.push({
            label,
            events: branchEvents,
            line: branchLine.number,
          });
        }
        if (kind === "par" && branches.length < 2)
          error("fragment-branches", line.number, "parには2区画以上が必要");
        events.push({ kind, branches, line: line.number });
        continue;
      }
      const message = messagePattern.exec(text);
      if (message) {
        const reverse = message[2].startsWith("<");
        const arrow = message[2];
        events.push({
          kind: "message",
          from: reverse ? message[3] : message[1],
          to: reverse ? message[1] : message[3],
          mode:
            arrow === "->>" || arrow === "<<-"
              ? "sync"
              : arrow === "->" || arrow === "<-"
                ? "async"
                : "response",
          label: message[4],
          line: line.number,
        });
        continue;
      }
      const activation = activationPattern.exec(text);
      if (activation) {
        events.push({
          kind: "activation",
          objectId: activation[1],
          action: activation[2] === "+" ? "start" : "end",
          line: line.number,
        });
        continue;
      }
      const process = processPattern.exec(text);
      if (
        process &&
        (process[2] ||
          lines[index]?.indent > line.indent ||
          document.objects.some((object) => object.id === process[1]))
      ) {
        const continuation =
          lines[index]?.indent > line.indent ? children(line) : [];
        const body = [process[2], ...continuation.map((part) => part.text)]
          .filter((part) => part.length > 0)
          .join("\n");
        if (!body) {
          error("process-empty", line.number, "処理の本文がない");
          continue;
        }
        const emphasis = /^\*[\s\S]+\*$/.test(body);
        events.push({
          kind: "process",
          objectId: process[1],
          text: emphasis ? body.slice(1, -1).replace(/^\n|\n$/g, "") : body,
          emphasis,
          line: line.number,
        });
        continue;
      }
      error("syntax", line.number, "未対応または不正な構文");
    }
    return events;
  }

  document.events = parseEvents(0);
  if (options.validate !== false)
    document.diagnostics.push(...validateGlf(document));
  return document;
}
