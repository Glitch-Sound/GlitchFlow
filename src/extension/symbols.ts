import * as vscode from "vscode";
import type { GlfDocument, GlfEvent, GlfObject, Schema } from "../core";
import { isGlfFileName } from "../core";

type SymbolKind = "object" | "schema";
interface Occurrence {
  kind: SymbolKind;
  name: string;
  range: vscode.Range;
  declaration: boolean;
}
interface ResolvedSymbol {
  kind: SymbolKind;
  uri: vscode.Uri;
  line: number;
  object?: GlfObject;
  schema?: Schema;
}

const identifier = "[A-Za-z_][A-Za-z0-9_]*";
const messagePattern = new RegExp(
  `^\\s*(${identifier})\\s*(->>|-->|->|<--|<<-|<-)\\s*(${identifier}):`,
);

function eventsByLine(
  events: GlfEvent[],
  result = new Map<number, GlfEvent>(),
): Map<number, GlfEvent> {
  for (const event of events) {
    result.set(event.line, event);
    if (event.kind === "alt" || event.kind === "par")
      for (const branch of event.branches) eventsByLine(branch.events, result);
    if (event.kind === "opt" || event.kind === "loop" || event.kind === "break")
      eventsByLine(event.events, result);
  }
  return result;
}

/** REQ-041..REQ-043: Parserが受理した行の識別子だけを、解決済みIRへ結び付ける。 */
function occurrences(
  document: vscode.TextDocument,
  model: GlfDocument,
): Occurrence[] {
  const result: Occurrence[] = [];
  const localObjects = new Map(
    model.objects
      .filter((item) => !item.origin)
      .map((item) => [item.line, item]),
  );
  const localSchemas = new Map(
    model.schemas
      .filter((item) => !item.origin)
      .map((item) => [item.line, item]),
  );
  const events = eventsByLine(model.events);
  const add = (
    kind: SymbolKind,
    name: string,
    line: number,
    start: number,
    declaration = false,
  ) => {
    if (start < 0) return;
    result.push({
      kind,
      name,
      declaration,
      range: new vscode.Range(line, start, line, start + name.length),
    });
  };
  const table = (
    raw: string,
    line: number,
    start: number,
    declaration = false,
  ) => {
    const dot = raw.indexOf(".");
    if (dot < 0) return;
    add("object", raw.slice(0, dot), line, start);
    add("schema", raw, line, start + dot + 1, declaration);
    const last = result[result.length - 1];
    if (last?.kind === "schema")
      last.range = new vscode.Range(
        line,
        start + dot + 1,
        line,
        start + raw.length,
      );
  };
  for (let line = 0; line < document.lineCount; line++) {
    const text = document.lineAt(line).text;
    const number = line + 1;
    const object = localObjects.get(number);
    if (object) {
      const match = /^\s*Object\s+([A-Za-z_]\w*)\s+as\s+"/.exec(text);
      if (match?.[1] === object.id)
        add(
          "object",
          object.id,
          line,
          text.indexOf(object.id, match[0].indexOf("Object") + "Object".length),
          true,
        );
      continue;
    }
    const schema = localSchemas.get(number);
    if (schema) {
      const match = /^\s*schema\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*){1,2}):$/.exec(
        text,
      );
      if (match?.[1] === schema.reference.raw)
        table(match[1], line, text.indexOf(match[1]), true);
      continue;
    }
    const event = events.get(number);
    if (!event) continue;
    if (event.kind === "db-state") {
      const match = /^\s*state\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*){1,2}):$/.exec(
        text,
      );
      if (match?.[1] === event.reference.raw)
        table(match[1], line, text.indexOf(match[1]));
    } else if (event.kind === "file-state" || event.kind === "sql") {
      const match = /^\s*(?:state|sql)\s+([A-Za-z_]\w*):$/.exec(text);
      if (match?.[1] === event.objectId)
        add("object", event.objectId, line, text.indexOf(match[1]));
    } else if (event.kind === "message") {
      const match = messagePattern.exec(text);
      if (match) {
        add("object", match[1], line, text.indexOf(match[1]));
        add(
          "object",
          match[3],
          line,
          text.indexOf(match[3], text.indexOf(match[2]) + match[2].length),
        );
      }
    } else if (event.kind === "activation" || event.kind === "process") {
      const match = /^\s*([A-Za-z_]\w*)/.exec(text);
      if (match?.[1] === event.objectId)
        add("object", match[1], line, text.indexOf(match[1]));
    }
  }
  return result;
}

function target(
  model: GlfDocument,
  uri: vscode.Uri,
  occurrence: Occurrence,
): ResolvedSymbol | undefined {
  if (occurrence.kind === "object") {
    if (
      occurrence.name === "Global" ||
      model.diagnostics.some(
        (item) =>
          item.code === "object-duplicate" &&
          item.message.includes(`Object ID ${occurrence.name} `),
      )
    )
      return undefined;
    const object = model.objects.find((item) => item.id === occurrence.name);
    if (!object) return undefined;
    return {
      kind: "object",
      uri: object.origin ? vscode.Uri.parse(object.origin.uri) : uri,
      line: object.origin?.line ?? object.line,
      object,
    };
  }
  if (
    model.diagnostics.some(
      (item) =>
        item.code === "schema-duplicate" &&
        item.message.includes(`schema ${occurrence.name} `),
    )
  )
    return undefined;
  const schema = model.schemas.find(
    (item) => item.reference.raw === occurrence.name,
  );
  if (!schema) return undefined;
  return {
    kind: "schema",
    uri: schema.origin ? vscode.Uri.parse(schema.origin.uri) : uri,
    line: schema.origin?.line ?? schema.line,
    schema,
  };
}

function at(
  occurrences: Occurrence[],
  position: vscode.Position,
): Occurrence | undefined {
  return occurrences.find(
    (item) =>
      item.range.contains(position) &&
      position.character < item.range.end.character,
  );
}

function same(a: ResolvedSymbol, b: ResolvedSymbol): boolean {
  return (
    a.kind === b.kind &&
    a.uri.toString() === b.uri.toString() &&
    a.line === b.line
  );
}

function escapeMarkdown(value: string): string {
  return value.replace(/[\\`*_{}[\]()#+.!|<>]/g, "\\$&");
}

/** REQ-041..REQ-043: 補完と同じ解決済み文書でVSCode標準の言語機能を提供する。 */
export function registerSymbols(
  context: vscode.ExtensionContext,
  resolve: (document: vscode.TextDocument) => Promise<GlfDocument>,
): void {
  const selector: vscode.DocumentSelector = {
    language: "glitchflow",
    scheme: "file",
  };
  const locate = async (
    document: vscode.TextDocument,
    position: vscode.Position,
  ) => {
    if (!isGlfFileName(document.fileName)) return undefined;
    const model = await resolve(document);
    const occurrence = at(occurrences(document, model), position);
    const symbol = occurrence && target(model, document.uri, occurrence);
    return occurrence && symbol ? { occurrence, symbol } : undefined;
  };
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(selector, {
      async provideDefinition(document, position) {
        const found = await locate(document, position);
        if (!found) return undefined;
        try {
          const destination = await vscode.workspace.openTextDocument(
            found.symbol.uri,
          );
          const line = found.symbol.line - 1;
          if (line < 0 || line >= destination.lineCount) return undefined;
          const candidates = occurrences(
            destination,
            await resolve(destination),
          );
          const declaration = candidates.find(
            (item) =>
              item.declaration &&
              item.kind === found.symbol.kind &&
              item.name === found.occurrence.name &&
              item.range.start.line === line,
          );
          return declaration
            ? new vscode.Location(found.symbol.uri, declaration.range)
            : undefined;
        } catch {
          return undefined;
        }
      },
    }),
    vscode.languages.registerReferenceProvider(selector, {
      async provideReferences(document, position, referenceContext) {
        const found = await locate(document, position);
        if (!found) return [];
        const files = await vscode.workspace.findFiles(
          "**/*.glf",
          "**/node_modules/**",
        );
        const uris = new Map<string, vscode.Uri>(
          [
            ...files,
            ...vscode.workspace.textDocuments
              .filter((item) => isGlfFileName(item.fileName))
              .map((item) => item.uri),
            document.uri,
            found.symbol.uri,
          ].map((uri) => [uri.toString(), uri]),
        );
        const results: vscode.Location[] = [];
        for (const uri of uris.values()) {
          try {
            const candidate = await vscode.workspace.openTextDocument(uri);
            const model = await resolve(candidate);
            for (const occurrence of occurrences(candidate, model)) {
              if (
                occurrence.declaration &&
                !referenceContext.includeDeclaration
              )
                continue;
              const resolved = target(model, uri, occurrence);
              if (resolved && same(found.symbol, resolved))
                results.push(new vscode.Location(uri, occurrence.range));
            }
          } catch {
            // 削除済みファイルは一覧に含めない。
          }
        }
        return results;
      },
    }),
    vscode.languages.registerHoverProvider(selector, {
      async provideHover(document, position) {
        const found = await locate(document, position);
        if (!found) return undefined;
        const { symbol, occurrence } = found;
        const markdown = new vscode.MarkdownString();
        if (symbol.object)
          markdown.appendMarkdown(
            `**${escapeMarkdown(symbol.object.label)}**  \nObject ID: \`${escapeMarkdown(symbol.object.id)}\`  \n種別: \`${symbol.object.type}\``,
          );
        if (symbol.schema) {
          markdown.appendMarkdown(
            `**${escapeMarkdown(symbol.schema.reference.raw)}**`,
          );
          for (const column of symbol.schema.columns)
            markdown.appendMarkdown(
              `  \n\`${escapeMarkdown(column.name)}\`: \`${escapeMarkdown(column.type)}\``,
            );
        }
        return new vscode.Hover(markdown, occurrence.range);
      },
    }),
  );
}
