import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";
import { GlfImportResolver } from "../../src/extension/imports";

suite("GLF imports", () => {
  test("REQ-035 / REQ-035-S02: 複数・多段の定義と同じファイルの再訪問", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-import-"));
    const resolver = new GlfImportResolver();
    try {
      await writeFile(
        join(directory, "base.glf"),
        'title: "Shared"\nObject DB as "Database" type DB\nschema DB.public.users:\n    id: int\nDB: imported only\n',
      );
      await writeFile(join(directory, "left.glf"), 'import "./base.glf"\n');
      await writeFile(
        join(directory, "right.glf"),
        'import "./base.glf"\nObject FE as "Front" type APP\n',
      );
      const rootPath = join(directory, "flow.glf");
      await writeFile(
        rootPath,
        'import "./left.glf"\nimport "./right.glf"\nstate DB.public.users:\n    [1]\nFE ->> DB: read\n',
      );
      const model = await resolver.resolve(
        await vscode.workspace.openTextDocument(rootPath),
      );
      assert.deepEqual(model.objects.map((object) => object.id).sort(), [
        "DB",
        "FE",
      ]);
      assert.deepEqual(
        model.schemas.map((schema) => schema.reference.raw),
        ["DB.public.users"],
      );
      assert.equal(model.diagnostics.length, 0);
      assert.equal(model.title, undefined);
      assert.equal(model.events.length, 2);
    } finally {
      resolver.dispose();
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("REQ-036 / REQ-036-S01からS03: 衝突、循環、欠損、不正、構文を診断", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-import-bad-"));
    const resolver = new GlfImportResolver();
    try {
      await writeFile(
        join(directory, "one.glf"),
        'Object DB as "One" type DB\nschema DB.users:\n    id: int\n',
      );
      await writeFile(
        join(directory, "two.glf"),
        'Object DB as "Two" type DB\nschema DB.users:\n    id: int\n',
      );
      await writeFile(join(directory, "broken.glf"), "Object BAD bad\n");
      const rootPath = join(directory, "flow.glf");
      await writeFile(
        rootPath,
        'import "./one.glf"\nimport "./two.glf"\nimport "./missing.glf"\nimport "/absolute.glf"\nimport "./broken.glf"\n',
      );
      const model = await resolver.resolve(
        await vscode.workspace.openTextDocument(rootPath),
      );
      const codes = model.diagnostics.map((item) => item.code);
      for (const code of [
        "object-duplicate",
        "schema-duplicate",
        "import-read",
        "import-path",
        "import-invalid",
      ])
        assert.ok(codes.includes(code), `${code}: ${codes.join(", ")}`);
      const cyclePath = join(directory, "cycle-a.glf");
      await writeFile(cyclePath, 'import "./cycle-b.glf"\n');
      await writeFile(
        join(directory, "cycle-b.glf"),
        'import "./cycle-a.glf"\n',
      );
      const cycle = await resolver.resolve(
        await vscode.workspace.openTextDocument(cyclePath),
      );
      assert.ok(cycle.diagnostics.some((item) => item.code === "import-cycle"));
    } finally {
      resolver.dispose();
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("REQ-037 / REQ-037-S01、REQ-037-S02: 補完と未保存編集を反映", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-import-live-"));
    try {
      const commonPath = join(directory, "common.glf");
      const flowPath = join(directory, "flow.glf");
      await writeFile(
        commonPath,
        'Object DB as "Database" type DB\nschema DB.users:\n    id: int\nschema DB.public.audit:\n    id: int\n',
      );
      await writeFile(
        flowPath,
        'import "./common.glf"\nstate DB.users:\n    [1]\nDB: work\n',
      );
      const extension = vscode.extensions.getExtension(
        "glitch-sound.glitchflow",
      );
      assert.ok(extension);
      const api = (await extension.activate()) as {
        onDidRenderPreview: vscode.Event<{ uri: string; title: string }>;
        currentPreviewUri: () => string | undefined;
      };
      const flow = await vscode.workspace.openTextDocument(flowPath);
      const seen: string[] = [];
      const listener = api.onDidRenderPreview((event) => {
        if (event.uri === flow.uri.toString()) seen.push(event.title);
      });
      const editor = await vscode.window.showTextDocument(flow);
      await vscode.commands.executeCommand("glitchflow.openPreview");
      const until = async (condition: () => boolean) => {
        for (let attempt = 0; attempt < 100 && !condition(); attempt++)
          await new Promise((resolve) => setTimeout(resolve, 30));
        assert.ok(condition());
      };
      await until(() => seen.length > 0);
      assert.equal(vscode.languages.getDiagnostics(flow.uri).length, 0);
      const common = await vscode.workspace.openTextDocument(commonPath);
      const commonEditor = await vscode.window.showTextDocument(common, {
        viewColumn: vscode.ViewColumn.One,
      });
      assert.equal(api.currentPreviewUri(), flow.uri.toString());
      await commonEditor.edit((edit) =>
        edit.replace(common.lineAt(0).range, 'Object OTHER as "Other" type DB'),
      );
      await until(() =>
        vscode.languages
          .getDiagnostics(flow.uri)
          .some((item) => item.message.includes("DB")),
      );
      const count = seen.length;
      await commonEditor.edit((edit) =>
        edit.replace(common.lineAt(0).range, 'Object DB as "Database" type DB'),
      );
      await until(() => vscode.languages.getDiagnostics(flow.uri).length === 0);
      assert.equal(api.currentPreviewUri(), flow.uri.toString());
      await until(() => seen.length > count);
      await vscode.window.showTextDocument(flow, {
        viewColumn: vscode.ViewColumn.One,
      });
      await editor.edit((edit) =>
        edit.insert(new vscode.Position(flow.lineCount - 1, 0), "state DB.\n"),
      );
      const completions = (await vscode.commands.executeCommand(
        "vscode.executeCompletionItemProvider",
        flow.uri,
        new vscode.Position(flow.lineCount - 2, "state DB.".length),
      )) as vscode.CompletionList;
      const labels = completions.items.map((item) =>
        typeof item.label === "string" ? item.label : item.label.label,
      );
      assert.ok(labels.includes("DB.users"), labels.join(", "));
      assert.ok(labels.includes("DB.public.audit"), labels.join(", "));
      await editor.edit((edit) =>
        edit.insert(new vscode.Position(flow.lineCount - 1, 0), "sql D\n"),
      );
      const sqlItems = (await vscode.commands.executeCommand(
        "vscode.executeCompletionItemProvider",
        flow.uri,
        new vscode.Position(flow.lineCount - 2, "sql D".length),
      )) as vscode.CompletionList;
      assert.ok(
        sqlItems.items.some((item) => item.label === "DB"),
        sqlItems.items.map((item) => item.label).join(", "),
      );
      listener.dispose();
    } finally {
      for (const group of vscode.window.tabGroups.all) {
        const tabs = group.tabs.filter(
          (tab) =>
            tab.input instanceof vscode.TabInputWebview &&
            tab.input.viewType.endsWith("glitchflow.preview"),
        );
        if (tabs.length) await vscode.window.tabGroups.close(tabs);
      }
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("REQ-037 / REQ-037-S01: ディスク上の定義変更を依存元へ反映", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-import-disk-"));
    try {
      const commonPath = join(directory, "common.glf");
      const flowPath = join(directory, "flow.glf");
      await writeFile(commonPath, 'Object DB as "Database" type DB\n');
      await writeFile(flowPath, 'import "./common.glf"\nDB: work\n');
      const flow = await vscode.workspace.openTextDocument(flowPath);
      await vscode.window.showTextDocument(flow);
      await vscode.commands.executeCommand("glitchflow.openPreview");
      const wait = async (condition: () => boolean) => {
        for (let i = 0; i < 100 && !condition(); i++)
          await new Promise((resolve) => setTimeout(resolve, 40));
        assert.ok(condition());
      };
      await wait(() => vscode.languages.getDiagnostics(flow.uri).length === 0);
      await writeFile(commonPath, 'Object OTHER as "Other" type DB\n');
      await wait(() =>
        vscode.languages
          .getDiagnostics(flow.uri)
          .some((item) => item.message.includes("DB")),
      );
      await writeFile(commonPath, 'Object DB as "Database" type DB\n');
      await wait(() => vscode.languages.getDiagnostics(flow.uri).length === 0);
    } finally {
      for (const group of vscode.window.tabGroups.all) {
        const tabs = group.tabs.filter(
          (tab) =>
            tab.input instanceof vscode.TabInputWebview &&
            tab.input.viewType.endsWith("glitchflow.preview"),
        );
        if (tabs.length) await vscode.window.tabGroups.close(tabs);
      }
      await rm(directory, { recursive: true, force: true });
    }
  });
});
