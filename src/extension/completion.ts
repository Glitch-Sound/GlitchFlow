// biome-ignore-all lint/suspicious/noTemplateCurlyInString: VSCode SnippetString placeholders are literal.
import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName, parseGlf } from "../core";

const objectTypes = ["APP", "API", "DB", "FILE", "FEATURE", "MODULE"];
const arrows = [
  ["->>", "同期メッセージ"],
  ["->", "非同期メッセージ"],
  ["-->", "応答メッセージ"],
  ["<--", "逆向きの応答メッセージ"],
  ["<<-", "逆向きの同期メッセージ"],
  ["<-", "逆向きの非同期メッセージ"],
] as const;

function item(
  label: string,
  description: string,
  range: vscode.Range,
  insertText: string | vscode.SnippetString,
  kind = vscode.CompletionItemKind.Keyword,
): vscode.CompletionItem {
  const result = new vscode.CompletionItem(label, kind);
  result.detail = `GlitchFlow: ${description}`;
  result.documentation = description;
  result.insertText = insertText;
  result.range = range;
  return result;
}

function parentBlock(document: vscode.TextDocument, line: number): string {
  const indent = document.lineAt(line).text.match(/^ */)?.[0].length ?? 0;
  let ceiling = indent;
  for (let index = line - 1; index >= 0; index--) {
    const text = document.lineAt(index).text;
    if (!text.trim()) continue;
    const level = text.match(/^ */)?.[0].length ?? 0;
    if (level >= ceiling) continue;
    ceiling = level;
    const header = text.trim();
    if (/^(schema|state|sql)\s+.+:$/.test(header)) return "content";
    if (/^(alt|par):$/.test(header)) return header.slice(0, -1);
    if (/^(case\s+.+|else):$/.test(header)) return "events";
    if (/^(opt|loop|break)\s+.+:$/.test(header)) return "events";
  }
  return indent === 0 ? "root" : "events";
}

/** REQ-029..REQ-031: 既存Parserの定義を文脈別のVSCode補完へ変換する。 */
export function registerCompletion(
  context: vscode.ExtensionContext,
  resolve?: (document: vscode.TextDocument) => Promise<GlfDocument>,
): void {
  const parsed = new Map<string, { version: number; value: GlfDocument }>();
  const provider: vscode.CompletionItemProvider = {
    async provideCompletionItems(document, position) {
      if (!isGlfFileName(document.fileName)) return [];
      const uri = document.uri.toString();
      let model: GlfDocument;
      if (resolve) model = await resolve(document);
      else {
        let cached = parsed.get(uri);
        if (!cached || cached.version !== document.version) {
          cached = {
            version: document.version,
            value: parseGlf(document.getText()),
          };
          parsed.set(uri, cached);
        }
        model = cached.value;
      }
      const line = document.lineAt(position.line).text;
      const prefix = line.slice(0, position.character);
      const trimmed = prefix.trimStart();
      const block = parentBlock(document, position.line);
      const result: vscode.CompletionItem[] = [];
      const rangeFrom = (start: number) =>
        new vscode.Range(
          position.line,
          start,
          position.line,
          position.character,
        );
      const afterKeyword = /^(schema|state|sql)\s+([A-Za-z_][\w.]*)?$/.exec(
        trimmed,
      );
      if (afterKeyword && block !== "content") {
        const keyword = afterKeyword[1];
        const fragment = afterKeyword[2] ?? "";
        const start = position.character - fragment.length;
        const range = rangeFrom(start);
        if (keyword === "sql") {
          return model.objects
            .filter((object) => object.type === "DB")
            .filter((object) => object.id.startsWith(fragment))
            .map((object) =>
              item(
                object.id,
                `DB Object: ${object.label}`,
                range,
                object.id,
                vscode.CompletionItemKind.Reference,
              ),
            );
        }
        if (keyword === "state") {
          for (const schema of model.schemas) {
            const raw = schema.reference.raw;
            if (!raw.startsWith(fragment)) continue;
            result.push(
              item(
                raw,
                `テーブル: ${raw}`,
                range,
                raw,
                vscode.CompletionItemKind.Reference,
              ),
            );
          }
          if (
            "FILE".startsWith(fragment) &&
            model.objects.some(
              (object) => object.id === "FILE" && object.type === "FILE",
            )
          )
            result.push(
              item(
                "FILE",
                "FILEの状態",
                range,
                "FILE",
                vscode.CompletionItemKind.Reference,
              ),
            );
          return result;
        }
        return model.objects
          .filter((object) => object.type === "DB")
          .filter((object) => object.id.startsWith(fragment))
          .map((object) =>
            item(
              object.id,
              `DB Object: ${object.label}`,
              range,
              object.id,
              vscode.CompletionItemKind.Reference,
            ),
          );
      }

      if (block === "content") return [];
      const objectType = /^Object\s+.+\s+type\s+([A-Za-z_]*)$/.exec(trimmed);
      if (objectType) {
        const range = rangeFrom(position.character - objectType[1].length);
        return objectTypes.map((type) =>
          item(
            type,
            `Object種別 ${type}`,
            range,
            type,
            vscode.CompletionItemKind.EnumMember,
          ),
        );
      }
      if (
        /^(Object|import|title|case|else|alt|par|opt|loop|break)\b.*\s|^title:/.test(
          trimmed,
        )
      )
        return [];

      const target =
        /^([A-Za-z_]\w*|Global)\s+(->>|-->|->|<--|<<-|<-)\s*([A-Za-z_]\w*)?$/.exec(
          trimmed,
        );
      if (target) {
        const fragment = target[3] ?? "";
        const range = rangeFrom(position.character - fragment.length);
        const candidates = model.objects.filter((object) =>
          object.id.startsWith(fragment),
        );
        if (target[2].startsWith("<") && "Global".startsWith(fragment))
          return [
            ...candidates.map((object) =>
              item(
                object.id,
                `Object: ${object.label}`,
                range,
                object.id,
                vscode.CompletionItemKind.Reference,
              ),
            ),
            item(
              "Global",
              "暗黙のメッセージ起点",
              range,
              "Global",
              vscode.CompletionItemKind.Reference,
            ),
          ];
        return candidates.map((object) =>
          item(
            object.id,
            `Object: ${object.label}`,
            range,
            object.id,
            vscode.CompletionItemKind.Reference,
          ),
        );
      }
      const source = /^([A-Za-z_]\w*|Global)\s+(-{0,2}>*|<{0,2}-*)?$/.exec(
        trimmed,
      );
      if (
        source &&
        (source[1] === "Global" ||
          model.objects.some((object) => object.id === source[1]))
      ) {
        const fragment = source[2] ?? "";
        const range = rangeFrom(position.character - fragment.length);
        return arrows.map(([arrow, description]) =>
          item(
            arrow,
            description,
            range,
            new vscode.SnippetString(`${arrow} \${1:Target}: \${2:message}`),
            vscode.CompletionItemKind.Operator,
          ),
        );
      }

      const partial = /^([A-Za-z_]\w*)?$/.exec(trimmed);
      if (!partial) return [];
      const range = rangeFrom(position.character - (partial[1]?.length ?? 0));
      if (block === "alt" || block === "par") {
        result.push(
          item(
            "case",
            "分岐区画",
            range,
            new vscode.SnippetString("case ${1:条件}:\n    ${2:イベント}"),
            vscode.CompletionItemKind.Snippet,
          ),
        );
        if (block === "alt")
          result.push(
            item(
              "else",
              "それ以外の区画",
              range,
              new vscode.SnippetString("else:\n    ${1:イベント}"),
              vscode.CompletionItemKind.Snippet,
            ),
          );
        return result;
      }
      const snippets: [string, string, string][] = [
        [
          "Object",
          "Object宣言",
          'Object ${1:ID} as "${2:表示名}" type ${3|APP,API,DB,FILE,FEATURE,MODULE|}',
        ],
        [
          "schema",
          "テーブル定義",
          "schema ${1:DB}.${2:table}:\n    ${3:column}: ${4:type}",
        ],
        ["state", "DBの状態", "state ${1:DB}.${2:table}:\n    [${3:value}]"],
        ["sql", "SQL表示", "sql ${1:DB}:\n    ${2:SELECT ...}"],
        [
          "alt",
          "条件分岐",
          "alt:\n    case ${1:条件}:\n        ${2:イベント}\n    else:\n        ${3:イベント}",
        ],
        [
          "par",
          "並列区画",
          "par:\n    case ${1:区画A}:\n        ${2:イベント}\n    case ${3:区画B}:\n        ${4:イベント}",
        ],
        ["opt", "条件付き処理", "opt ${1:条件}:\n    ${2:イベント}"],
        ["loop", "繰り返し", "loop ${1:条件}:\n    ${2:イベント}"],
        ["break", "中断", "break ${1:条件}:\n    ${2:イベント}"],
      ];
      if (block === "root")
        snippets.push([
          "import",
          "別のGLFからObjectとschemaを読み込む",
          'import "${1:./common.glf}"',
        ]);
      if (
        block === "root" &&
        !model.title &&
        !document.getText(new vscode.Range(0, 0, position.line, 0)).trim()
      )
        snippets.unshift(["title", "文書タイトル", 'title: "${1:タイトル}"']);
      if (block === "root") {
        for (const [label, description, snippet] of snippets)
          result.push(
            item(
              label,
              description,
              range,
              new vscode.SnippetString(snippet),
              vscode.CompletionItemKind.Snippet,
            ),
          );
      } else {
        for (const [label, description, snippet] of snippets.slice(3))
          result.push(
            item(
              label,
              description,
              range,
              new vscode.SnippetString(snippet),
              vscode.CompletionItemKind.Snippet,
            ),
          );
      }
      for (const object of model.objects.filter((object) =>
        object.id.startsWith(partial[1] ?? ""),
      ))
        result.push(
          item(
            object.id,
            `Object: ${object.label}`,
            range,
            object.id,
            vscode.CompletionItemKind.Reference,
          ),
        );
      if (block === "root")
        result.push(
          item(
            "Global",
            "暗黙のメッセージ起点",
            range,
            "Global",
            vscode.CompletionItemKind.Reference,
          ),
        );
      return result;
    },
  };
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "glitchflow" },
      provider,
    ),
    vscode.workspace.onDidCloseTextDocument((document) =>
      parsed.delete(document.uri.toString()),
    ),
  );
}
