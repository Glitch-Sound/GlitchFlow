import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName, parseGlf } from "../core";

/** REQ-015: Coreの行番号付き診断をProblemsへ反映する。 */
export function diagnoseDocument(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection,
): GlfDocument | undefined {
  if (!isGlfFileName(document.fileName)) return undefined;
  const parsed = parseGlf(document.getText());
  collection.set(
    document.uri,
    parsed.diagnostics.map((item) => {
      const line = Math.max(0, Math.min(item.line - 1, document.lineCount - 1));
      const range = document.lineAt(line).range;
      const diagnostic = new vscode.Diagnostic(
        range,
        item.message,
        vscode.DiagnosticSeverity.Error,
      );
      diagnostic.code = item.code;
      diagnostic.source = "GlitchFlow";
      return diagnostic;
    }),
  );
  return parsed;
}
