import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

suite("REQ-014 / REQ-014-S01、REQ-014-S02", () => {
  test("編集した見出しが1秒以内に表示され、エラー中は最後の図を保持する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-live-"));
    try {
      const path = join(directory, "live.glf");
      const extension = vscode.extensions.getExtension(
        "glitch-sound.glitchflow",
      );
      assert.ok(extension);
      await writeFile(
        path,
        await readFile(join(extension.extensionPath, "examples/login.glf")),
      );
      const document = await vscode.workspace.openTextDocument(path);
      const editor = await vscode.window.showTextDocument(document);
      const api = (await extension.activate()) as {
        onDidRenderPreview: vscode.Event<{ uri: string; title: string }>;
      };
      const seen: string[] = [];
      const listener = api.onDidRenderPreview((event) => {
        if (event.uri === document.uri.toString()) seen.push(event.title);
      });
      await vscode.commands.executeCommand("glitchflow.openPreview");
      const until = async (title: string) => {
        for (let i = 0; i < 40 && !seen.includes(title); i++)
          await new Promise((resolve) => setTimeout(resolve, 25));
        assert.ok(seen.includes(title), `表示された見出し: ${seen.join(", ")}`);
      };
      await until("ログインフロー");
      await editor.edit((edit) =>
        edit.replace(document.lineAt(0).range, 'title: "変更後"'),
      );
      await until("変更後");
      const started = Date.now();
      await editor.edit((edit) =>
        edit.replace(new vscode.Range(0, 8, 0, 9), "改"),
      );
      await until("改更後");
      const elapsed = Date.now() - started;
      console.log(
        `NREQ-001 / NREQ-001-S01: 編集からWebview描画まで ${elapsed} ms`,
      );
      assert.ok(elapsed < 1000);
      const renderedCount = seen.length;
      const badLine = document.lineCount - 1;
      await editor.edit((edit) =>
        edit.insert(new vscode.Position(badLine, 0), "FE ->> BAD: call\n"),
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      assert.equal(seen.length, renderedCount);
      assert.ok(
        vscode.window.tabGroups.all
          .flatMap((group) => group.tabs)
          .some(
            (tab) =>
              tab.input instanceof vscode.TabInputWebview &&
              tab.input.viewType.endsWith("glitchflow.preview"),
          ),
      );
      assert.ok(
        vscode.languages
          .getDiagnostics(document.uri)
          .some((item) => item.message.includes("BAD")),
      );
      await editor.edit((edit) =>
        edit.delete(document.lineAt(badLine).rangeIncludingLineBreak),
      );
      for (let i = 0; i < 40 && seen.length === renderedCount; i++)
        await new Promise((resolve) => setTimeout(resolve, 25));
      assert.ok(seen.length > renderedCount);
      listener.dispose();
      assert.equal(vscode.languages.getDiagnostics(document.uri).length, 0);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
