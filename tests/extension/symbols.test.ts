import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

suite("DSL symbols", () => {
  test("REQ-041-S01、REQ-042-S01: 複数importの定義を区別する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-symbol-multi-"));
    try {
      const firstPath = join(directory, "first.glf");
      const secondPath = join(directory, "second.glf");
      const rootPath = join(directory, "root.glf");
      await writeFile(
        firstPath,
        'Object DB as "DB" type DB\nschema DB.users:\n    id: int\n',
      );
      await writeFile(secondPath, 'Object API as "API" type API\n');
      await writeFile(
        rootPath,
        'import "first.glf"\nimport "second.glf"\nAPI ->> DB: read\nstate DB.users:\n    [1]\n',
      );
      const root = await vscode.workspace.openTextDocument(rootPath);
      await vscode.window.showTextDocument(root);
      const api = await vscode.commands.executeCommand<vscode.Location[]>(
        "vscode.executeDefinitionProvider",
        root.uri,
        new vscode.Position(2, 1),
      );
      assert.equal(api?.[0]?.uri.fsPath, secondPath);
      const db = await vscode.commands.executeCommand<vscode.Location[]>(
        "vscode.executeDefinitionProvider",
        root.uri,
        new vscode.Position(2, 9),
      );
      assert.equal(db?.[0]?.uri.fsPath, firstPath);
      const table = await vscode.commands.executeCommand<vscode.Location[]>(
        "vscode.executeDefinitionProvider",
        root.uri,
        new vscode.Position(3, 11),
      );
      assert.equal(table?.[0]?.uri.fsPath, firstPath);
      assert.equal(table?.[0]?.range.start.line, 1);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("REQ-041-S01、REQ-041-S02、REQ-041-S03、REQ-042-S01、REQ-042-S02、REQ-043-S01、REQ-043-S02: import定義と未解決参照", async () => {
    const directory = await mkdtemp(join(tmpdir(), "glitchflow-symbols-"));
    try {
      const sharedPath = join(directory, "shared.glf");
      const mainPath = join(directory, "main.glf");
      await writeFile(
        sharedPath,
        'Object DB as "Database" type DB\nschema DB.users:\n    id: int\n    name: text\nschema DB.public.users:\n    id: text\n',
      );
      await writeFile(
        mainPath,
        'import "shared.glf"\nstate DB.users:\n    [1, "a"]\nstate DB.public.users:\n    ["b"]\nDB ->> DB: same\nstate DB.missing:\n    [1]\nsql DB:\n    SELECT DB.users\n',
      );
      const document = await vscode.workspace.openTextDocument(mainPath);
      const shared = await vscode.workspace.openTextDocument(sharedPath);
      await vscode.window.showTextDocument(document);
      const definition = async (line: number, character: number) =>
        await vscode.commands.executeCommand<vscode.Location[]>(
          "vscode.executeDefinitionProvider",
          document.uri,
          new vscode.Position(line, character),
        );
      const table = await definition(1, 11);
      assert.equal(table?.[0]?.uri.toString(), shared.uri.toString());
      assert.equal(table?.[0]?.range.start.line, 1);
      const object = await definition(1, 7);
      assert.equal(object?.[0]?.range.start.line, 0);
      assert.equal((await definition(3, 18))?.[0]?.range.start.line, 4);
      assert.equal((await definition(6, 11))?.length ?? 0, 0);
      const references = await vscode.commands.executeCommand<
        vscode.Location[]
      >(
        "vscode.executeReferenceProvider",
        document.uri,
        new vscode.Position(1, 11),
      );
      assert.ok(references?.some((item) => item.range.start.line === 1));
      assert.ok(
        references?.some(
          (item) =>
            item.uri.toString() === shared.uri.toString() &&
            item.range.start.line === 1,
        ),
      );
      assert.ok(!references?.some((item) => item.range.start.line === 3));
      assert.ok(!references?.some((item) => item.range.start.line === 9));
      const objectReferences = await vscode.commands.executeCommand<
        vscode.Location[]
      >(
        "vscode.executeReferenceProvider",
        document.uri,
        new vscode.Position(1, 7),
      );
      assert.ok(
        objectReferences?.some(
          (item) =>
            item.uri.toString() === document.uri.toString() &&
            item.range.start.line === 5 &&
            item.range.start.character === 0,
        ),
      );
      assert.ok(
        objectReferences?.some(
          (item) =>
            item.uri.toString() === document.uri.toString() &&
            item.range.start.line === 5 &&
            item.range.start.character === 7,
        ),
      );
      const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
        "vscode.executeHoverProvider",
        document.uri,
        new vscode.Position(1, 11),
      );
      const hoverText =
        (hover?.[0]?.contents[0] as vscode.MarkdownString)?.value ?? "";
      assert.match(hoverText, /id.*int/);
      assert.match(hoverText, /name.*text/);
      assert.doesNotMatch(hoverText, /id.*text/);
      const objectHover = await vscode.commands.executeCommand<vscode.Hover[]>(
        "vscode.executeHoverProvider",
        document.uri,
        new vscode.Position(1, 7),
      );
      assert.match(
        (objectHover?.[0]?.contents[0] as vscode.MarkdownString)?.value ?? "",
        /Database/,
      );
      const missingHover = await vscode.commands.executeCommand<vscode.Hover[]>(
        "vscode.executeHoverProvider",
        document.uri,
        new vscode.Position(6, 11),
      );
      assert.equal(missingHover?.length ?? 0, 0);
      const sharedEditor = await vscode.window.showTextDocument(
        shared,
        vscode.ViewColumn.One,
      );
      await sharedEditor.edit((edit) =>
        edit.replace(shared.lineAt(2).range, "    id: uuid"),
      );
      const refreshed = await vscode.commands.executeCommand<vscode.Hover[]>(
        "vscode.executeHoverProvider",
        document.uri,
        new vscode.Position(1, 11),
      );
      assert.match(
        (refreshed?.[0]?.contents[0] as vscode.MarkdownString)?.value ?? "",
        /id.*uuid/,
      );
      await sharedEditor.edit((edit) =>
        edit.replace(shared.lineAt(1).range, "schema DB.accounts:"),
      );
      assert.equal((await definition(1, 11))?.length ?? 0, 0);
      const oldReferences = await vscode.commands.executeCommand<
        vscode.Location[]
      >(
        "vscode.executeReferenceProvider",
        document.uri,
        new vscode.Position(1, 11),
      );
      assert.equal(oldReferences?.length ?? 0, 0);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
