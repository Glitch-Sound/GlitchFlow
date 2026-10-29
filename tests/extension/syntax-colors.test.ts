import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("REQ-016 / REQ-016-S01、REQ-016-S02", () => {
  test(".glf言語登録と設定切替を他言語から分離する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-colors-"));
    try {
      const path = join(directory, "sample.glf");
      await writeFile(path, 'title: "タイトル"\nObject FE as "FE" type APP\n');
      const document = await vscode.workspace.openTextDocument(path);
      await vscode.window.showTextDocument(document);
      assert.equal(document.languageId, "glitchflow");
      const config = vscode.workspace.getConfiguration("glitchflow");
      assert.equal(config.get("syntaxHighlighting"), "theme");
      const original = vscode.workspace
        .getConfiguration("editor")
        .get("tokenColorCustomizations");
      await config.update(
        "syntaxHighlighting",
        "glitchflow",
        vscode.ConfigurationTarget.Global,
      );
      assert.deepEqual(
        vscode.workspace
          .getConfiguration("editor")
          .get("tokenColorCustomizations"),
        original,
      );
      await config.update(
        "syntaxHighlighting",
        "theme",
        vscode.ConfigurationTarget.Global,
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
