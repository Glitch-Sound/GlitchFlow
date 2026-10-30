import "./styles.css";
import type { GlfDocument } from "../../core";
import {
  rasterizeDiagram,
  renderPreview,
  serializeDiagram,
} from "../pages/preview";

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  const vscode = (
    window as Window & {
      acquireVsCodeApi?: () => { postMessage: (message: unknown) => void };
    }
  ).acquireVsCodeApi?.();
  let currentRenderId: number | undefined;
  const exportClicked = () =>
    vscode?.postMessage({
      type: "glitchflow.export.clicked",
      renderId: currentRenderId,
    });
  renderPreview(app, undefined, undefined, exportClicked);
  window.addEventListener("message", async (event: MessageEvent) => {
    if (event.data?.type === "glitchflow.export") {
      const { requestId, format } = event.data;
      if (
        typeof requestId !== "string" ||
        (format !== "png" && format !== "svg")
      )
        return;
      try {
        if (
          event.data.renderId !== undefined &&
          event.data.renderId !== currentRenderId
        )
          throw new Error("図が更新されたため保存を中止した");
        const svg = serializeDiagram(
          app.querySelector<SVGSVGElement>(".sequence-diagram"),
        );
        const data = format === "svg" ? svg : await rasterizeDiagram(svg);
        vscode?.postMessage({
          type: "glitchflow.export.result",
          requestId,
          format,
          data,
        });
      } catch (error) {
        vscode?.postMessage({
          type: "glitchflow.export.result",
          requestId,
          format,
          error:
            error instanceof Error ? error.message : "画像の生成に失敗した",
        });
      }
      return;
    }
    if (
      event.data?.type !== "glitchflow.document" ||
      !event.data.document ||
      typeof event.data.fileName !== "string"
    )
      return;
    renderPreview(
      app,
      event.data.document as GlfDocument,
      event.data.fileName,
      exportClicked,
    );
    currentRenderId = event.data.renderId;
    vscode?.postMessage({
      type: "glitchflow.rendered",
      title: app.querySelector("h1")?.textContent ?? "",
      fileName: event.data.fileName,
      renderId: currentRenderId,
    });
  });
  vscode?.postMessage({ type: "glitchflow.ready" });
}
