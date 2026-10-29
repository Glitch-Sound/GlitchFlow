import { defineConfig } from "vite";

export default defineConfig({
  root: "src/webview",
  base: "./",
  build: {
    outDir: "../../dist/webview",
    emptyOutDir: true,
    manifest: true,
  },
});
