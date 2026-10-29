import { readFile } from "node:fs/promises";
import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName, parseGlf } from "../core";

type ViteManifest = Record<string, { file: string; css?: string[] }>;
type PreviewData = {
  type: "glitchflow.document";
  document: GlfDocument;
  fileName: string;
};

let panel: vscode.WebviewPanel | undefined;
let currentUri: string | undefined;
let currentData: PreviewData | undefined;
let isReady = false;
const rendered = new vscode.EventEmitter<{ uri: string; title: string }>();
const closed = new vscode.EventEmitter<string>();
export const onDidRenderPreview = rendered.event;
export const onDidClosePreview = closed.event;

function toPreviewData(document: vscode.TextDocument): PreviewData {
  return {
    type: "glitchflow.document",
    document: parseGlf(document.getText()),
    fileName:
      vscode.Uri.file(document.fileName).path.split("/").at(-1) ??
      document.fileName,
  };
}

function sendCurrent(): void {
  if (panel && isReady && currentData?.document.diagnostics.length === 0)
    void panel.webview.postMessage(currentData);
}

/** REQ-014 / REQ-027: 現在の単一パネルだけを正常な解析結果で更新する。 */
export function updatePreview(
  document: vscode.TextDocument,
  parsed: GlfDocument,
): void {
  if (
    parsed.diagnostics.length > 0 ||
    !panel ||
    currentUri !== document.uri.toString()
  )
    return;
  currentData = {
    type: "glitchflow.document",
    document: parsed,
    fileName:
      vscode.Uri.file(document.fileName).path.split("/").at(-1) ??
      document.fileName,
  };
  sendCurrent();
}

/** REQ-001 / REQ-026 / REQ-027: 自動・手動で同じ単一Webviewを開く。 */
export async function openPreview(
  context: vscode.ExtensionContext,
  document: vscode.TextDocument,
  preserveFocus = false,
): Promise<void> {
  if (!isGlfFileName(document.fileName)) return;
  currentUri = document.uri.toString();
  currentData = toPreviewData(document);
  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside, preserveFocus);
    sendCurrent();
    return;
  }

  const assetsRoot = vscode.Uri.joinPath(
    context.extensionUri,
    "dist",
    "webview",
  );
  const created = vscode.window.createWebviewPanel(
    "glitchflow.preview",
    "GlitchFlow Preview",
    { viewColumn: vscode.ViewColumn.Beside, preserveFocus },
    { enableScripts: true, localResourceRoots: [assetsRoot] },
  );
  panel = created;
  isReady = false;
  const listener = created.webview.onDidReceiveMessage((message: unknown) => {
    if (typeof message !== "object" || message === null || !("type" in message))
      return;
    if (message.type === "glitchflow.ready") {
      isReady = true;
      sendCurrent();
    } else if (
      message.type === "glitchflow.rendered" &&
      "title" in message &&
      typeof message.title === "string" &&
      currentUri
    ) {
      rendered.fire({ uri: currentUri, title: message.title });
    }
  });
  created.onDidDispose(() => {
    listener.dispose();
    if (panel !== created) return;
    panel = undefined;
    isReady = false;
    const uri = currentUri;
    currentUri = undefined;
    currentData = undefined;
    if (uri) closed.fire(uri);
  });

  try {
    const manifestPath = vscode.Uri.joinPath(
      assetsRoot,
      ".vite",
      "manifest.json",
    );
    const manifest = JSON.parse(
      await readFile(manifestPath.fsPath, "utf8"),
    ) as ViteManifest;
    const entry = manifest["index.html"];
    if (!entry?.file)
      throw new Error("GlitchFlow Webviewのビルド資産が見つからない");
    const scriptUri = created.webview.asWebviewUri(
      vscode.Uri.joinPath(assetsRoot, entry.file),
    );
    const styles = (entry.css ?? [])
      .map((file) => {
        const uri = created.webview.asWebviewUri(
          vscode.Uri.joinPath(assetsRoot, file),
        );
        return `<link rel="stylesheet" href="${uri}">`;
      })
      .join("\n");
    created.webview.html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${created.webview.cspSource}; script-src ${created.webview.cspSource}; style-src ${created.webview.cspSource};">
  <title>GlitchFlow Preview</title>
  ${styles}
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
  } catch (error) {
    created.dispose();
    throw error;
  }
}
