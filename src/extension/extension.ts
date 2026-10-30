import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName } from "../core";
import { registerCompletion } from "./completion";
import { diagnoseDocument } from "./diagnostics";
import { GlfImportResolver } from "./imports";
import {
  currentPreviewUri,
  exportCurrentPreview,
  onDidClosePreview,
  onDidRenderPreview,
  openPreview,
  updatePreview,
} from "./preview-panel";
import { registerSyntaxColors } from "./syntax-colors";

/** REQ-001: register the user-facing preview command. */
export function activate(context: vscode.ExtensionContext): {
  onDidRenderPreview: typeof onDidRenderPreview;
  currentPreviewUri: typeof currentPreviewUri;
} {
  const diagnostics = vscode.languages.createDiagnosticCollection("glitchflow");
  const imports = new GlfImportResolver();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const revisions = new Map<string, number>();
  const resolved = new Map<
    string,
    { version: number; document: GlfDocument }
  >();
  let lastGlfEditor = vscode.window.activeTextEditor;
  let suppressedUri: string | undefined;
  const refresh = async (
    document: vscode.TextDocument,
  ): Promise<GlfDocument | undefined> => {
    if (!isGlfFileName(document.fileName)) return undefined;
    const key = document.uri.toString();
    const revision = (revisions.get(key) ?? 0) + 1;
    revisions.set(key, revision);
    const version = document.version;
    const parsed = await imports.resolve(document);
    if (revisions.get(key) !== revision || document.version !== version)
      return undefined;
    resolved.set(key, { version, document: parsed });
    diagnoseDocument(document, diagnostics, parsed);
    updatePreview(document, parsed);
    return parsed;
  };
  const schedule = (document: vscode.TextDocument) => {
    if (!isGlfFileName(document.fileName)) return;
    const key = document.uri.toString();
    resolved.delete(key);
    revisions.set(key, (revisions.get(key) ?? 0) + 1);
    const prior = timers.get(key);
    if (prior) clearTimeout(prior);
    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        void refresh(document);
      }, 150),
    );
  };
  const scheduleDependents = (uri: vscode.Uri) => {
    for (const key of imports.dependents(uri)) {
      const document = vscode.workspace.textDocuments.find(
        (candidate) => candidate.uri.toString() === key,
      );
      if (document) schedule(document);
    }
  };
  context.subscriptions.push(diagnostics, imports);
  context.subscriptions.push(
    vscode.commands.registerCommand("glitchflow.openPreview", () => {
      const document =
        vscode.window.activeTextEditor?.document ?? lastGlfEditor?.document;
      if (!document || !isGlfFileName(document.fileName)) return;
      suppressedUri = undefined;
      return refresh(document).then((parsed) => {
        if (parsed) openPreview(context, document, false, parsed);
      });
    }),
    vscode.commands.registerCommand("glitchflow.exportDiagram", () =>
      exportCurrentPreview(),
    ),
    onDidClosePreview((uri) => {
      suppressedUri = uri;
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor) return;
      const uri = editor.document.uri.toString();
      if (suppressedUri && suppressedUri !== uri) suppressedUri = undefined;
      if (!isGlfFileName(editor.document.fileName)) return;
      lastGlfEditor = editor;
      const previewUri = currentPreviewUri();
      if (
        previewUri &&
        imports.dependents(editor.document.uri).includes(previewUri)
      )
        return;
      if (
        vscode.workspace
          .getConfiguration("glitchflow.preview", editor.document.uri)
          .get<boolean>("autoOpen", true) &&
        suppressedUri !== uri
      ) {
        void refresh(editor.document).then((parsed) => {
          if (parsed) openPreview(context, editor.document, true, parsed);
        });
      }
    }),
    vscode.workspace.onDidOpenTextDocument((document) => {
      void refresh(document);
    }),
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      if (!isGlfFileName(document.fileName)) return;
      schedule(document);
      scheduleDependents(document.uri);
    }),
    imports.onDidChangeDependency(scheduleDependents),
    vscode.workspace.onDidCloseTextDocument((document) => {
      scheduleDependents(document.uri);
      imports.forget(document.uri);
      diagnostics.delete(document.uri);
      const key = document.uri.toString();
      const prior = timers.get(key);
      if (prior) clearTimeout(prior);
      timers.delete(key);
      revisions.delete(key);
      resolved.delete(key);
    }),
    {
      dispose: () => {
        for (const timer of timers.values()) clearTimeout(timer);
      },
    },
  );
  for (const document of vscode.workspace.textDocuments) void refresh(document);
  registerSyntaxColors(context);
  registerCompletion(context, async (document) => {
    const key = document.uri.toString();
    const cached = resolved.get(key);
    if (cached?.version === document.version) return cached.document;
    const version = document.version;
    const parsed = await imports.resolve(document);
    if (document.version === version)
      resolved.set(key, { version, document: parsed });
    return parsed;
  });
  const initialEditor = lastGlfEditor;
  if (
    initialEditor &&
    isGlfFileName(initialEditor.document.fileName) &&
    vscode.workspace
      .getConfiguration("glitchflow.preview", initialEditor.document.uri)
      .get<boolean>("autoOpen", true)
  ) {
    void refresh(initialEditor.document).then((parsed) => {
      if (parsed) openPreview(context, initialEditor.document, true, parsed);
    });
  }
  return { onDidRenderPreview, currentPreviewUri };
}

export function deactivate(): void {}
