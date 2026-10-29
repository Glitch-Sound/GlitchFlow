import { resolve } from "node:path";
import { runTests } from "@vscode/test-electron";

// VS Code's extension host exports variables that would turn the child Electron
// process into a Node process and reject normal VS Code launch arguments.
delete process.env.ELECTRON_RUN_AS_NODE;
for (const key of Object.keys(process.env)) {
  if (key.startsWith("VSCODE_")) delete process.env[key];
}

await runTests({
  extensionDevelopmentPath: process.cwd(),
  extensionTestsPath: resolve("scripts/extension-test-runner.cjs"),
  vscodeExecutablePath: process.env.VSCODE_EXECUTABLE_PATH,
  launchArgs: [
    "--disable-extensions",
    "--disable-workspace-trust",
    "--skip-welcome",
  ],
});
