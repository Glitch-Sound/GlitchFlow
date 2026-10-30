import { readFile } from "node:fs/promises";
import * as vscode from "vscode";
import { type GlfDocument, isGlfFileName, parseGlf } from "../core";

type ViteManifest = Record<string, { file: string; css?: string[] }>;
type PreviewData = {
  type: "glitchflow.document";
  document: GlfDocument;
  fileName: string;
  sourceUri: string;
  renderId: number;
};

let panel: vscode.WebviewPanel | undefined;
let currentUri: string | undefined;
let currentData: PreviewData | undefined;
let displayedData: PreviewData | undefined;
let isReady = false;
let nextRenderId = 0;
let nextExportId = 0;
let exportInProgress = false;
let pendingExport:
  | {
      id: string;
      format: "png" | "svg";
      resolve: (data: string) => void;
      reject: (error: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  | undefined;
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
    sourceUri: document.uri.toString(),
    renderId: ++nextRenderId,
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
    sourceUri: document.uri.toString(),
    renderId: ++nextRenderId,
  };
  sendCurrent();
}

/** REQ-032 / REQ-034: 表示中の図をVSCode標準ダイアログで選び、保存する。 */
export async function exportCurrentPreview(
  clickedRenderId?: number,
): Promise<void> {
  if (exportInProgress) {
    await vscode.window.showErrorMessage("画像をエクスポート中です");
    return;
  }
  exportInProgress = true;
  try {
    await performExport(clickedRenderId);
  } catch (error) {
    await vscode.window.showErrorMessage(
      `図を保存できません: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    exportInProgress = false;
  }
}

async function performExport(clickedRenderId?: number): Promise<void> {
  const snapshot = displayedData;
  if (!panel || !isReady || !snapshot) {
    await vscode.window.showErrorMessage(
      "エクスポートできる図が表示されていない",
    );
    return;
  }
  if (clickedRenderId !== undefined && clickedRenderId !== snapshot.renderId) {
    await vscode.window.showErrorMessage(
      "図が更新されたため、もう一度エクスポートを実行してください",
    );
    return;
  }
  const choice = await vscode.window.showQuickPick(
    [
      { label: "PNG", description: "高解像度の画像", format: "png" as const },
      {
        label: "SVG",
        description: "拡大可能なベクター画像",
        format: "svg" as const,
      },
    ],
    { placeHolder: "エクスポート形式を選択" },
  );
  if (!choice) return;
  const format = choice.format;
  const sourceUri = vscode.Uri.parse(snapshot.sourceUri);
  const defaultUri = sourceUri.with({
    path: sourceUri.path.replace(/\.glf$/i, `.${format}`),
  });
  const destination = await vscode.window.showSaveDialog({
    defaultUri,
    filters: format === "png" ? { PNG: ["png"] } : { SVG: ["svg"] },
    saveLabel: "図を保存",
  });
  if (!destination) return;
  if (!destination.path.toLowerCase().endsWith(`.${format}`)) {
    await vscode.window.showErrorMessage(
      `保存先には.${format}の拡張子を指定してください`,
    );
    return;
  }
  if (displayedData?.renderId !== snapshot.renderId || !panel) {
    await vscode.window.showErrorMessage(
      "図が更新されたため、もう一度エクスポートを実行してください",
    );
    return;
  }
  const id = `export-${++nextExportId}`;
  try {
    const data = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        pendingExport = undefined;
        reject(new Error("画像の生成がタイムアウトした"));
      }, 60_000);
      pendingExport = { id, format, resolve, reject, timer };
      void panel?.webview
        .postMessage({
          type: "glitchflow.export",
          requestId: id,
          format,
          renderId: snapshot.renderId,
        })
        .then(
          (sent) => {
            if (!sent && pendingExport?.id === id) {
              clearTimeout(timer);
              pendingExport = undefined;
              reject(new Error("プレビューへエクスポートを要求できない"));
            }
          },
          (error: unknown) => {
            if (pendingExport?.id === id) {
              clearTimeout(timer);
              pendingExport = undefined;
              reject(
                new Error("プレビューへエクスポートを要求できない", {
                  cause: error,
                }),
              );
            }
          },
        );
    });
    if (displayedData?.renderId !== snapshot.renderId)
      throw new Error("図が更新されたため保存を中止した");
    const bytes =
      format === "svg"
        ? Buffer.from(data, "utf8")
        : Buffer.from(data, "base64");
    if (bytes.length === 0) throw new Error("出力画像が空です");
    if (
      format === "png" &&
      bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
    )
      throw new Error("PNG画像の内容が不正です");
    await vscode.workspace.fs.writeFile(destination, bytes);
  } catch (error) {
    await vscode.window.showErrorMessage(
      `図を保存できません: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
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
    } else if (message.type === "glitchflow.export.clicked") {
      void exportCurrentPreview(
        "renderId" in message && typeof message.renderId === "number"
          ? message.renderId
          : undefined,
      );
    } else if (message.type === "glitchflow.export.result") {
      if (
        !pendingExport ||
        !("requestId" in message) ||
        message.requestId !== pendingExport.id
      )
        return;
      const request = pendingExport;
      clearTimeout(request.timer);
      pendingExport = undefined;
      if ("error" in message && typeof message.error === "string")
        request.reject(new Error(message.error));
      else if (
        "format" in message &&
        message.format === request.format &&
        "data" in message &&
        typeof message.data === "string"
      )
        request.resolve(message.data);
      else request.reject(new Error("プレビューからの画像データが不正です"));
    } else if (
      message.type === "glitchflow.rendered" &&
      "title" in message &&
      typeof message.title === "string" &&
      currentUri
    ) {
      const renderedData = currentData;
      if (
        !renderedData ||
        !("renderId" in message) ||
        renderedData.renderId !== message.renderId
      )
        return;
      displayedData = renderedData;
      rendered.fire({ uri: renderedData.sourceUri, title: message.title });
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
    displayedData = undefined;
    if (pendingExport) {
      clearTimeout(pendingExport.timer);
      pendingExport.reject(new Error("プレビューが閉じられた"));
      pendingExport = undefined;
    }
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
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${created.webview.cspSource} blob:; script-src ${created.webview.cspSource}; style-src ${created.webview.cspSource};">
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
