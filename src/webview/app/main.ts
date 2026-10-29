import "./styles.css";
import type { GlfDocument } from "../../core";
import { renderPreview } from "../pages/preview";

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  const vscode = (
    window as Window & {
      acquireVsCodeApi?: () => { postMessage: (message: unknown) => void };
    }
  ).acquireVsCodeApi?.();
  renderPreview(app);
  window.addEventListener("message", (event: MessageEvent) => {
    if (
      event.data?.type !== "glitchflow.document" ||
      !event.data.document ||
      typeof event.data.fileName !== "string"
    )
      return;
    renderPreview(app, event.data.document as GlfDocument, event.data.fileName);
    vscode?.postMessage({
      type: "glitchflow.rendered",
      title: app.querySelector("h1")?.textContent ?? "",
    });
  });
  vscode?.postMessage({ type: "glitchflow.ready" });
}
