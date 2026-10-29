import * as vscode from "vscode";
import { isGlfFileName } from "../core";

type TokenKind = "keyword" | "control" | "type" | "operator" | "string";
const tokenPattern =
  /"(?:\\.|[^"\\])*"|->>|-->|<--|<<-|->|<-|\b(?:title|Object|schema|state|sql|type|as|alt|case|else|opt|loop|par|break|APP|API|DB|FILE|FEATURE|MODULE)\b|[+!-]/g;
const controls = new Set([
  "alt",
  "case",
  "else",
  "opt",
  "loop",
  "par",
  "break",
]);
const types = new Set(["APP", "API", "DB", "FILE", "FEATURE", "MODULE"]);

/** REQ-016: `.glf`だけに任意の専用配色を付け、設定とテーマの変化に追従する。 */
export function registerSyntaxColors(context: vscode.ExtensionContext): void {
  const palette: Record<TokenKind, [string, string]> = {
    keyword: ["#7b3fc3", "#c79bff"],
    control: ["#b2295e", "#ff85ac"],
    type: ["#176b9e", "#87ccff"],
    operator: ["#a04417", "#ffb27c"],
    string: ["#236b36", "#9cdbab"],
  };
  const decorations = Object.fromEntries(
    (Object.keys(palette) as TokenKind[]).map((kind) => [
      kind,
      vscode.window.createTextEditorDecorationType({
        light: { color: palette[kind][0] },
        dark: { color: palette[kind][1] },
      }),
    ]),
  ) as Record<TokenKind, vscode.TextEditorDecorationType>;
  context.subscriptions.push(...Object.values(decorations));

  const apply = (editor: vscode.TextEditor) => {
    const enabled =
      vscode.workspace
        .getConfiguration("glitchflow")
        .get<string>("syntaxHighlighting", "theme") === "glitchflow";
    const ranges: Record<TokenKind, vscode.Range[]> = {
      keyword: [],
      control: [],
      type: [],
      operator: [],
      string: [],
    };
    if (enabled && isGlfFileName(editor.document.fileName)) {
      for (let index = 0; index < editor.document.lineCount; index++) {
        const line = editor.document.lineAt(index).text;
        for (const match of line.matchAll(tokenPattern)) {
          const value = match[0];
          const kind: TokenKind = value.startsWith('"')
            ? "string"
            : controls.has(value)
              ? "control"
              : types.has(value)
                ? "type"
                : /^(?:->>|-->|<--|<<-|->|<-|[+!-])$/.test(value)
                  ? "operator"
                  : "keyword";
          ranges[kind].push(
            new vscode.Range(
              index,
              match.index,
              index,
              match.index + value.length,
            ),
          );
        }
      }
    }
    for (const kind of Object.keys(ranges) as TokenKind[])
      editor.setDecorations(decorations[kind], ranges[kind]);
  };
  const applyAll = () => vscode.window.visibleTextEditors.forEach(apply);
  context.subscriptions.push(
    vscode.window.onDidChangeVisibleTextEditors(applyAll),
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      for (const editor of vscode.window.visibleTextEditors)
        if (editor.document === document) apply(editor);
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("glitchflow.syntaxHighlighting"))
        applyAll();
    }),
    vscode.window.onDidChangeActiveColorTheme(applyAll),
  );
  applyAll();
}
