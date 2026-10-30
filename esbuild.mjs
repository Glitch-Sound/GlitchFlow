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
  entryPoints: [
    "tests/extension/preview.test.ts",
    "tests/extension/diagnostics.test.ts",
    "tests/extension/syntax-colors.test.ts",
    "tests/extension/completion.test.ts",
    "tests/extension/export.test.ts",
  ],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["vscode"],
  outdir: "dist/extension-tests",
  sourcemap: true,
});
