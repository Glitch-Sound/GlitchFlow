import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("REQ-032 / REQ-032-S01、REQ-034 / REQ-034-S01", () => {
  test("コマンドがPNGとSVGを保存し、初期名に.glfの基底名を使う", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-export-"));
    const extension = vscode.extensions.getExtension("glitch-sound.glitchflow");
    assert.ok(extension);
    const api = (await extension.activate()) as {
      onDidRenderPreview: vscode.Event<{ uri: string; title: string }>;
    };
    const source = join(directory, "diagram.glf");
    await writeFile(
      source,
      'Object FE as "Front" type APP\nGlobal ->> FE: start\n',
    );
    const document = await vscode.workspace.openTextDocument(source);
    const editor = await vscode.window.showTextDocument(document);
    const rendered = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("プレビュー待機がタイムアウトした")),
        5000,
      );
      const listener = api.onDidRenderPreview((event) => {
        if (event.uri !== document.uri.toString()) return;
        clearTimeout(timer);
        listener.dispose();
        resolve();
      });
    });
    await vscode.commands.executeCommand("glitchflow.openPreview");
    await rendered;
    const mutable = vscode.window as unknown as Record<string, unknown>;
    const originalQuickPick = mutable.showQuickPick;
    const originalSaveDialog = mutable.showSaveDialog;
    const originalErrorMessage = mutable.showErrorMessage;
    try {
      for (const format of ["svg", "png"] as const) {
        const output = join(directory, `diagram.${format}`);
        mutable.showQuickPick = async (items: { format: string }[]) =>
          items.find((item) => item.format === format);
        mutable.showSaveDialog = async (options: {
          defaultUri: vscode.Uri;
        }) => {
          assert.equal(options.defaultUri.fsPath, output);
          return vscode.Uri.file(output);
        };
        await vscode.commands.executeCommand("glitchflow.exportDiagram");
        const bytes = await readFile(output);
        if (format === "svg") {
          assert.match(bytes.toString("utf8"), /<svg/);
          assert.match(bytes.toString("utf8"), /sequence-global-origin/);
          assert.match(bytes.toString("utf8"), />start<\/text>/);
        } else {
          assert.equal(
            bytes.subarray(0, 8).toString("hex"),
            "89504e470d0a1a0a",
          );
        }
      }
      const errors: string[] = [];
      const invalidDestination = join(directory, "invalid.svg");
      await mkdir(invalidDestination);
      mutable.showQuickPick = async (items: { format: string }[]) =>
        items.find((item) => item.format === "svg");
      mutable.showSaveDialog = async () => vscode.Uri.file(invalidDestination);
      mutable.showErrorMessage = async (message: string) => {
        errors.push(message);
        return undefined;
      };
      await vscode.commands.executeCommand("glitchflow.exportDiagram");
      assert.ok(
        errors.some((message) => message.includes("保存できません")),
        `保存エラーが通知されない: ${JSON.stringify(errors)}`,
      );
      assert.equal(
        editor.document.getText(),
        'Object FE as "Front" type APP\nGlobal ->> FE: start\n',
      );
    } finally {
      mutable.showQuickPick = originalQuickPick;
      mutable.showSaveDialog = originalSaveDialog;
      mutable.showErrorMessage = originalErrorMessage;
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

  test("図のない状態では保存せずエラーを通知する", async () => {
    const mutable = vscode.window as unknown as Record<string, unknown>;
    const original = mutable.showErrorMessage;
    const messages: string[] = [];
    try {
      mutable.showErrorMessage = async (message: string) => {
        messages.push(message);
        return undefined;
      };
      await vscode.commands.executeCommand("glitchflow.exportDiagram");
      assert.ok(messages.some((message) => message.includes("図")));
    } finally {
      mutable.showErrorMessage = original;
    }
  });
});
