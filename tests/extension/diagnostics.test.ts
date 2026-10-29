import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("REQ-015 / REQ-015-S01", () => {
  test("未宣言ObjectをProblemsへ表示し、修正後に消す", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-diagnostics-"));
    try {
      const path = join(directory, "broken.glf");
      await writeFile(path, 'Object FE as "FE" type APP\n');
      const document = await vscode.workspace.openTextDocument(path);
      const editor = await vscode.window.showTextDocument(document);
      await editor.edit((edit) =>
        edit.insert(new vscode.Position(1, 0), "FE ->> BAD: call\n"),
      );
      const started = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 80));
      assert.equal(vscode.languages.getDiagnostics(document.uri).length, 0);
      await new Promise((resolve) => setTimeout(resolve, 220));
      assert.ok(
        vscode.languages
          .getDiagnostics(document.uri)
          .some((item) => item.message.includes("BAD")),
      );
      assert.ok(Date.now() - started < 1000);
      await editor.edit((edit) =>
        edit.delete(document.lineAt(1).rangeIncludingLineBreak),
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      assert.equal(vscode.languages.getDiagnostics(document.uri).length, 0);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
