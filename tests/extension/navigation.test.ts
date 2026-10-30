import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("REQ-039 / REQ-039-S01、REQ-040 / REQ-040-S01、REQ-040-S02", () => {
  test("既存グループで対象行を選択し、古い版と無効な行を拒否する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-navigation-"));
    const path = join(directory, "flow.glf");
    const extension = vscode.extensions.getExtension("glitch-sound.glitchflow");
    assert.ok(extension);
    const api = (await extension.activate()) as {
      onDidRenderPreview: vscode.Event<{ uri: string; renderId: number }>;
      navigateToSource: (renderId: number, line: number) => Promise<void>;
      openPreviewForDocument: (document: vscode.TextDocument) => Promise<void>;
    };
    try {
      await writeFile(
        path,
        'Object FE as "FE" type APP\nGlobal ->> FE: same\nGlobal ->> FE: same\n',
      );
      const document = await vscode.workspace.openTextDocument(path);
      const rendered: number[] = [];
      const listener = api.onDidRenderPreview((event) => {
        if (event.uri === document.uri.toString())
          rendered.push(event.renderId);
      });
      const editor = await vscode.window.showTextDocument(
        document,
        vscode.ViewColumn.One,
      );
      await api.openPreviewForDocument(document);
      const waitForRender = async (count: number) => {
        for (let i = 0; i < 200 && rendered.length < count; i++)
          await new Promise((resolve) => setTimeout(resolve, 25));
        assert.ok(rendered.length >= count, "プレビューが更新されない");
      };
      await waitForRender(1);
      const firstId = rendered.at(-1) as number;
      const column = editor.viewColumn;
      await api.navigateToSource(firstId, 3);
      assert.equal(editor.selection.start.line, 2);
      assert.equal(
        editor.selection.end.character,
        document.lineAt(2).text.length,
      );
      assert.equal(editor.viewColumn, column);
      await api.navigateToSource(firstId, 999);
      assert.equal(editor.selection.start.line, 2);
      const count = rendered.length;
      await editor.edit((edit) => edit.insert(new vscode.Position(0, 0), "\n"));
      const selectionAfterEdit = editor.selection;
      await api.navigateToSource(firstId, 2);
      assert.ok(editor.selection.isEqual(selectionAfterEdit));
      await waitForRender(count + 1);
      const newId = rendered.at(-1) as number;
      await api.navigateToSource(newId, 4);
      assert.equal(editor.selection.start.line, 3);
      assert.equal(
        editor.selection.end.character,
        document.lineAt(3).text.length,
      );
      listener.dispose();
    } finally {
      for (const group of vscode.window.tabGroups.all) {
        for (const tab of group.tabs) {
          if (
            tab.input instanceof vscode.TabInputWebview &&
            tab.input.viewType.endsWith("glitchflow.preview")
          )
            await vscode.window.tabGroups.close(tab);
        }
      }
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("REQ-038 / REQ-038-S01: importしたObjectは定義元へ移動する", async () => {
    const directory = await mkdtemp(
      join(tmpdir(), "glitchflow-import-navigation-"),
    );
    const source = join(directory, "flow.glf");
    const definitions = join(directory, "definitions.glf");
    const extension = vscode.extensions.getExtension("glitch-sound.glitchflow");
    assert.ok(extension);
    const api = (await extension.activate()) as {
      onDidRenderPreview: vscode.Event<{ uri: string; renderId: number }>;
      navigateToSource: (
        renderId: number,
        line: number,
        sourceUri?: string,
      ) => Promise<void>;
      openPreviewForDocument: (document: vscode.TextDocument) => Promise<void>;
    };
    try {
      await writeFile(definitions, '\nObject FE as "FE" type APP\n');
      await writeFile(
        source,
        'import "definitions.glf"\nGlobal ->> FE: start\n',
      );
      const document = await vscode.workspace.openTextDocument(source);
      const render = new Promise<number>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("プレビュー待機がタイムアウトした")),
          10000,
        );
        const listener = api.onDidRenderPreview((event) => {
          if (event.uri !== document.uri.toString()) return;
          clearTimeout(timer);
          listener.dispose();
          resolve(event.renderId);
        });
      });
      await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
      await api.openPreviewForDocument(document);
      const renderId = await render;
      await api.navigateToSource(
        renderId,
        2,
        vscode.Uri.file(definitions).toString(),
      );
      const target = vscode.window.visibleTextEditors.find(
        (editor) => editor.document.uri.fsPath === definitions,
      );
      assert.ok(target);
      assert.equal(target.selection.start.line, 1);
    } finally {
      for (const group of vscode.window.tabGroups.all) {
        for (const tab of group.tabs) {
          if (
            tab.input instanceof vscode.TabInputWebview &&
            tab.input.viewType.endsWith("glitchflow.preview")
          )
            await vscode.window.tabGroups.close(tab);
        }
      }
      await rm(directory, { recursive: true, force: true });
    }
  });
});
