import * as vscode from "vscode";
import { isGlfFileName } from "../core";
import { diagnoseDocument } from "./diagnostics";
import {
  onDidRenderPreview,
  openPreview,
  updatePreview,
} from "./preview-panel";
import { registerSyntaxColors } from "./syntax-colors";

/** REQ-001: register the user-facing preview command. */
export function activate(context: vscode.ExtensionContext): {
  onDidRenderPreview: typeof onDidRenderPreview;
} {
  const diagnostics = vscode.languages.createDiagnosticCollection("glitchflow");
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const revisions = new Map<string, number>();
  const refresh = (document: vscode.TextDocument) => {
    const parsed = diagnoseDocument(document, diagnostics);
    if (parsed) updatePreview(document, parsed);
  };
  context.subscriptions.push(diagnostics);
  context.subscriptions.push(
    vscode.commands.registerCommand("glitchflow.openPreview", () => {
      const document = vscode.window.activeTextEditor?.document;
      if (document) refresh(document);
      return openPreview(context);
    }),
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      if (!isGlfFileName(document.fileName)) return;
      const key = document.uri.toString();
      const revision = (revisions.get(key) ?? 0) + 1;
      revisions.set(key, revision);
      const prior = timers.get(key);
      if (prior) clearTimeout(prior);
      timers.set(
        key,
        setTimeout(() => {
          timers.delete(key);
          if (revisions.get(key) === revision) refresh(document);
        }, 150),
      );
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnostics.delete(document.uri);
      const key = document.uri.toString();
      const prior = timers.get(key);
      if (prior) clearTimeout(prior);
      timers.delete(key);
      revisions.delete(key);
    }),
    {
      dispose: () => {
        for (const timer of timers.values()) clearTimeout(timer);
      },
    },
  );
  for (const document of vscode.workspace.textDocuments) refresh(document);
  registerSyntaxColors(context);
  return { onDidRenderPreview };
}

export function deactivate(): void {}
