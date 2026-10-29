import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("REQ-001 / REQ-001-S01", () => {
  test(".glfを開いてコマンドからプレビューのパネルを表示する", async () => {
    const directory = await mkdtemp(
      join(tmpdir(), "glitchflow-extension-test-"),
    );
    try {
      const filePath = join(directory, "login.glf");
      await writeFile(
        filePath,
        'Object FE as "フロントエンド" type APP\n',
        "utf8",
      );
      const document = await vscode.workspace.openTextDocument(
        vscode.Uri.file(filePath),
      );
      await vscode.window.showTextDocument(document);

      await vscode.commands.executeCommand("glitchflow.openPreview");

      const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
      assert.ok(activeTab, "プレビューのタブが開く");
      assert.ok(activeTab.input instanceof vscode.TabInputWebview);
      assert.ok(activeTab.input.viewType.endsWith("glitchflow.preview"));
      assert.equal(activeTab.label, "GlitchFlow Preview");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
