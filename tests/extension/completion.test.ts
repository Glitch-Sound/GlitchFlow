import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

declare const suiteSetup: (callback: () => Promise<void>) => void;
declare const suiteTeardown: (callback: () => Promise<void>) => void;

suite("DSL completion", () => {
  let directory: string;

  suiteSetup(async () => {
    directory = await mkdtemp(join(tmpdir(), "glitchflow-completion-"));
  });

  suiteTeardown(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  async function complete(source: string, marker = "|") {
    const offset = source.indexOf(marker);
    assert.ok(offset >= 0);
    const text = source.replace(marker, "");
    const path = join(directory, `case-${Date.now()}-${Math.random()}.glf`);
    await writeFile(path, text);
    const document = await vscode.workspace.openTextDocument(path);
    await vscode.window.showTextDocument(document);
    const position = document.positionAt(offset);
    const result = await vscode.commands.executeCommand<vscode.CompletionList>(
      "vscode.executeCompletionItemProvider",
      document.uri,
      position,
    );
    return result?.items ?? [];
  }

  const labels = (items: vscode.CompletionItem[]) =>
    items
      .filter((item) => item.detail?.startsWith("GlitchFlow:"))
      .map((item) =>
        typeof item.label === "string" ? item.label : item.label.label,
      );

  test("REQ-029 / REQ-029-S01: Snippetとメッセージ記号", async () => {
    const initial = await complete("|");
    const object = initial.find(
      (item) =>
        item.label === "Object" && item.detail?.startsWith("GlitchFlow:"),
    );
    assert.ok(object);
    assert.equal(object.kind, vscode.CompletionItemKind.Snippet);
    assert.ok(object.insertText instanceof vscode.SnippetString);
    assert.match(object.insertText.value, /\$\{1:ID\}/);
    assert.match(
      object.insertText.value,
      /\$\{3\|APP,API,DB,FILE,FEATURE,MODULE\|\}/,
    );
    assert.ok(object.documentation);
    for (const keyword of [
      "title",
      "schema",
      "state",
      "sql",
      "alt",
      "par",
      "opt",
      "loop",
      "break",
    ])
      assert.ok(labels(initial).includes(keyword), keyword);
    const types = labels(await complete('Object FE as "Front" type |'));
    assert.deepEqual(
      types.sort(),
      ["APP", "API", "DB", "FEATURE", "FILE", "MODULE"].sort(),
    );
    const arrows = labels(
      await complete('Object FE as "Front" type APP\nFE |'),
    );
    for (const arrow of ["->>", "->", "-->", "<--", "<<-", "<-"])
      assert.ok(arrows.includes(arrow), arrow);
  });

  test("REQ-030 / REQ-030-S01: Objectと2形式のテーブル参照", async () => {
    const base =
      'Object FE as "Front" type APP\nObject DB as "Database" type DB\nschema DB.users:\n    id: int\nschema DB.public.orders:\n    id: int\n';
    assert.deepEqual(
      labels(await complete(`${base}FE ->> |: request`)).sort(),
      ["DB", "FE"],
    );
    assert.deepEqual(labels(await complete(`${base}sql |:\n    SELECT 1`)), [
      "DB",
    ]);
    const tables = labels(await complete(`${base}state DB.|:\n    [1]`));
    assert.ok(tables.includes("DB.users"));
    assert.ok(tables.includes("DB.public.orders"));
    assert.deepEqual(
      labels(await complete(`${base}state DB.public.|:\n    [1]`)),
      ["DB.public.orders"],
    );
    assert.ok(
      labels(await complete(`${base}schema |:\n    id: int`)).includes("DB"),
    );
    assert.ok(
      labels(await complete(`${base}FE <-- |: response`)).includes("Global"),
    );
    assert.ok(
      !labels(await complete(`${base}FE ->> |: request`)).includes("Global"),
    );
  });

  test("REQ-031 / REQ-031-S01: ブロック内の候補を限定", async () => {
    const branches = labels(await complete("alt:\n    |"));
    assert.ok(branches.includes("case"));
    assert.ok(branches.includes("else"));
    assert.ok(!branches.includes("Object"));
    assert.deepEqual(labels(await complete("schema DB.users:\n    |")), []);
    assert.deepEqual(labels(await complete("sql DB:\n    |")), []);
    assert.deepEqual(labels(await complete("state DB.users:\n    |")), []);
    assert.deepEqual(
      labels(await complete('Object FE as "FE" type APP\nFE: |')),
      [],
    );
  });

  test("REQ-031 / REQ-031-S02: 別行が未完成でも定義を使う", async () => {
    const items = await complete(
      'Object DB as "Database" type DB\nDB ->>\nsql |:\n    SELECT 1',
    );
    assert.deepEqual(labels(items), ["DB"]);
  });
});
