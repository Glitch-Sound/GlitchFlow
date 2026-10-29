import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

const previewTabs = () =>
  vscode.window.tabGroups.all
    .flatMap((group) => group.tabs)
    .filter(
      (tab) =>
        tab.input instanceof vscode.TabInputWebview &&
        tab.input.viewType.endsWith("glitchflow.preview"),
    );

async function waitFor(condition: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 80 && !condition(); attempt++)
    await new Promise((resolve) => setTimeout(resolve, 25));
  assert.ok(condition(), "期待するVSCode状態にならなかった");
}

async function closePreviews(): Promise<void> {
  for (const group of vscode.window.tabGroups.all) {
    const tabs = group.tabs.filter((tab) => previewTabs().includes(tab));
    if (tabs.length) await vscode.window.tabGroups.close(tabs);
  }
}

suite("REQ-026 / REQ-026-S01、REQ-026-S02、REQ-026-S03", () => {
  test("表示時だけ自動起動し、設定OFFと内部読み込みでは起動しない", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-auto-"));
    const configuration =
      vscode.workspace.getConfiguration("glitchflow.preview");
    try {
      await closePreviews();
      const glfPath = join(directory, "auto.glf");
      const textPath = join(directory, "other.txt");
      await writeFile(glfPath, 'title: "自動"\n', "utf8");
      await writeFile(textPath, "other\n", "utf8");
      const glf = await vscode.workspace.openTextDocument(glfPath);
      assert.equal(previewTabs().length, 0);
      const editor = await vscode.window.showTextDocument(glf);
      await waitFor(() => previewTabs().length === 1);
      assert.equal(
        vscode.window.activeTextEditor?.document.uri.toString(),
        editor.document.uri.toString(),
      );
      assert.equal(
        vscode.window.tabGroups.all.find((group) =>
          group.tabs.includes(previewTabs()[0]),
        )?.viewColumn,
        vscode.ViewColumn.Two,
      );
      await closePreviews();
      await configuration.update(
        "autoOpen",
        false,
        vscode.ConfigurationTarget.Global,
      );
      await vscode.window.showTextDocument(
        await vscode.workspace.openTextDocument(textPath),
      );
      await vscode.window.showTextDocument(glf);
      await new Promise((resolve) => setTimeout(resolve, 200));
      assert.equal(previewTabs().length, 0);
      await vscode.commands.executeCommand("glitchflow.openPreview");
      await waitFor(() => previewTabs().length === 1);
      await closePreviews();
      await configuration.update(
        "autoOpen",
        true,
        vscode.ConfigurationTarget.Global,
      );
      await vscode.window.showTextDocument(
        await vscode.workspace.openTextDocument(textPath),
      );
      assert.equal(previewTabs().length, 0);
    } finally {
      await configuration.update(
        "autoOpen",
        undefined,
        vscode.ConfigurationTarget.Global,
      );
      await closePreviews();
      await rm(directory, { recursive: true, force: true });
    }
  });
});

suite("REQ-028 / REQ-028-S01、REQ-028-S02", () => {
  test("Codiconボタンは.glfのeditor/titleに限定され、既存コマンドを使う", async () => {
    const extension = vscode.extensions.getExtension("glitch-sound.glitchflow");
    assert.ok(extension);
    const contribution = extension.packageJSON.contributes as {
      commands: { command: string; title: string; icon?: string }[];
      menus: { "editor/title": { command: string; when: string }[] };
      configuration: { properties: Record<string, { default: unknown }> };
    };
    const command = contribution.commands.find(
      (item) => item.command === "glitchflow.openPreview",
    );
    assert.equal(command?.icon, "$(open-preview)");
    assert.ok(command?.title.includes("プレビューを開く"));
    assert.deepEqual(contribution.menus["editor/title"], [
      {
        command: "glitchflow.openPreview",
        when: "resourceExtname == .glf",
        group: "navigation",
      },
    ]);
    assert.equal(
      contribution.configuration.properties["glitchflow.preview.autoOpen"]
        .default,
      true,
    );
  });
});

suite("REQ-027 / REQ-027-S01、REQ-027-S02、REQ-027-S03", () => {
  test("切り替えで単一パネルを再利用し、閉鎖後は同じ文書で再起動しない", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-reuse-"));
    try {
      await closePreviews();
      const firstPath = join(directory, "first.glf");
      const secondPath = join(directory, "second.glf");
      await writeFile(firstPath, 'title: "最初"\n', "utf8");
      await writeFile(secondPath, 'title: "次"\n', "utf8");
      const first = await vscode.workspace.openTextDocument(firstPath);
      const second = await vscode.workspace.openTextDocument(secondPath);
      const extension = vscode.extensions.getExtension(
        "glitch-sound.glitchflow",
      );
      assert.ok(extension);
      const api = (await extension.activate()) as {
        onDidRenderPreview: vscode.Event<{ uri: string; title: string }>;
      };
      const rendered: string[] = [];
      const listener = api.onDidRenderPreview((event) =>
        rendered.push(`${event.uri}:${event.title}`),
      );
      await vscode.window.showTextDocument(first);
      await waitFor(() => previewTabs().length === 1);
      const original = previewTabs()[0];
      await vscode.window.showTextDocument(second);
      await waitFor(() =>
        rendered.some((value) => value === `${second.uri.toString()}:次`),
      );
      assert.equal(previewTabs().length, 1);
      assert.equal(previewTabs()[0], original);
      assert.equal(
        vscode.window.activeTextEditor?.document.uri.toString(),
        second.uri.toString(),
      );
      const firstEditor = await vscode.window.showTextDocument(first);
      await closePreviews();
      await firstEditor.edit((edit) =>
        edit.insert(new vscode.Position(0, 0), "\n"),
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      assert.equal(previewTabs().length, 0);
      await Promise.all([
        vscode.commands.executeCommand("glitchflow.openPreview"),
        vscode.commands.executeCommand("glitchflow.openPreview"),
      ]);
      await waitFor(() => previewTabs().length === 1);
      assert.equal(previewTabs().length, 1);
      listener.dispose();
    } finally {
      await closePreviews();
      await rm(directory, { recursive: true, force: true });
    }
  });
});

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

      await waitFor(() => previewTabs().length === 1);
      assert.equal(previewTabs()[0].label, "GlitchFlow Preview");
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
