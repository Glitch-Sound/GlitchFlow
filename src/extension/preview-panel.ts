import { readFile } from "node:fs/promises";
import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName, parseGlf } from "../core";

type ViteManifest = Record<string, { file: string; css?: string[] }>;

const previews = new Map<string, Set<vscode.WebviewPanel>>();
const ready = new WeakSet<vscode.WebviewPanel>();
const rendered = new vscode.EventEmitter<{ uri: string; title: string }>();
export const onDidRenderPreview = rendered.event;
const latest = new Map<
  string,
  { type: string; document: GlfDocument; fileName: string }
>();

/** REQ-014: 開いている文書の正常な解析結果だけを対象パネルへ送る。 */
export function updatePreview(
  document: vscode.TextDocument,
  parsed: GlfDocument,
): void {
  if (parsed.diagnostics.length > 0) return;
  const key = document.uri.toString();
  const data = {
    type: "glitchflow.document",
    document: parsed,
    fileName:
      vscode.Uri.file(document.fileName).path.split("/").at(-1) ??
      document.fileName,
  };
  latest.set(key, data);
  const panels = previews.get(key);
  if (!panels) return;
  for (const panel of panels) {
    if (ready.has(panel)) void panel.webview.postMessage(data);
  }
}

/** REQ-001: open the compiled preview with local-only assets and a restrictive CSP. */
export async function openPreview(
  context: vscode.ExtensionContext,
): Promise<void> {
  const activeDocument = vscode.window.activeTextEditor?.document;
  const previewData =
    activeDocument && isGlfFileName(activeDocument.fileName)
      ? {
          type: "glitchflow.document",
          document: parseGlf(activeDocument.getText()),
          fileName:
            vscode.Uri.file(activeDocument.fileName).path.split("/").at(-1) ??
            activeDocument.fileName,
        }
      : undefined;
  const assetsRoot = vscode.Uri.joinPath(
    context.extensionUri,
    "dist",
    "webview",
  );
  const panel = vscode.window.createWebviewPanel(
    "glitchflow.preview",
    "GlitchFlow Preview",
    vscode.ViewColumn.Beside,
    { enableScripts: true, localResourceRoots: [assetsRoot] },
  );
  context.subscriptions.push(panel);
  if (previewData && activeDocument) {
    const key = activeDocument.uri.toString();
    const group = previews.get(key) ?? new Set<vscode.WebviewPanel>();
    group.add(panel);
    previews.set(key, group);
    const listener = panel.webview.onDidReceiveMessage((message: unknown) => {
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "glitchflow.rendered" &&
        "title" in message &&
        typeof message.title === "string"
      ) {
        rendered.fire({ uri: key, title: message.title });
        return;
      }
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "glitchflow.ready"
      ) {
        ready.add(panel);
        const current = latest.get(key) ?? previewData;
        if (current.document.diagnostics.length === 0)
          void panel.webview.postMessage(current);
      }
    });
    panel.onDidDispose(() => {
      listener.dispose();
      group.delete(panel);
      if (group.size === 0) {
        previews.delete(key);
        latest.delete(key);
      }
    });
  }

  const manifestPath = vscode.Uri.joinPath(
    assetsRoot,
    ".vite",
    "manifest.json",
  );
  const manifest = JSON.parse(
    await readFile(manifestPath.fsPath, "utf8"),
  ) as ViteManifest;
  const entry = manifest["index.html"];
  if (!entry?.file) {
    panel.dispose();
    throw new Error("GlitchFlow Webviewのビルド資産が見つからない");
  }

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(assetsRoot, entry.file),
  );
  const styles = (entry.css ?? [])
    .map((file) => {
      const uri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(assetsRoot, file),
      );
      return `<link rel="stylesheet" href="${uri}">`;
    })
    .join("\n");

  panel.webview.html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource}; script-src ${panel.webview.cspSource}; style-src ${panel.webview.cspSource};">
  <title>GlitchFlow Preview</title>
  ${styles}
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
}
