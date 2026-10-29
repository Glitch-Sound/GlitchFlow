import { readFile } from "node:fs/promises";
import * as vscode from "vscode";

type ViteManifest = Record<string, { file: string; css?: string[] }>;

/** REQ-001: open the compiled preview with local-only assets and a restrictive CSP. */
export async function openPreview(
  context: vscode.ExtensionContext,
): Promise<void> {
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
