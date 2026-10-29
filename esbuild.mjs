import { build } from "esbuild";

await build({
  entryPoints: ["src/extension/extension.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["vscode"],
  outfile: "dist/extension/extension.js",
  sourcemap: true,
});

await build({
  entryPoints: ["tests/extension/preview.test.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["vscode"],
  outfile: "dist/extension-tests/preview.test.js",
  sourcemap: true,
});
