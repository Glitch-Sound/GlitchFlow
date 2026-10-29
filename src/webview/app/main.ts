import "./styles.css";
import { renderPreview } from "../pages/preview";

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  renderPreview(app);
}
