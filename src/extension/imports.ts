import { type FSWatcher, watch } from "node:fs";
import { basename, dirname } from "node:path";
import * as vscode from "vscode";
import {
  type Diagnostic,
  type GlfDocument,
  type GlfImport,
  mergeGlfDefinitions,
  parseGlf,
} from "../core";

const decoder = new TextDecoder("utf-8", { fatal: true });

function importTarget(owner: vscode.Uri, path: string): vscode.Uri | undefined {
  if (
    owner.scheme !== "file" ||
    !/^[^\\/:?*"<>|]+(?:\/[^\\/:?*"<>|]+)*\.glf$/.test(path)
  )
    return undefined;
  return vscode.Uri.joinPath(vscode.Uri.joinPath(owner, ".."), path);
}

/** REQ-035からREQ-037: VSCode側でローカルGLFの依存を解決し、変更を通知する。 */
export class GlfImportResolver implements vscode.Disposable {
  private readonly roots = new Map<string, Set<string>>();
  private readonly watchers = new Map<string, FSWatcher>();
  private readonly changed = new vscode.EventEmitter<vscode.Uri>();
  private readonly generations = new Map<string, number>();
  readonly onDidChangeDependency = this.changed.event;

  dependents(uri: vscode.Uri): string[] {
    const key = uri.toString();
    return [...this.roots]
      .filter(([, dependencies]) => dependencies.has(key))
      .map(([root]) => root);
  }

  forget(uri: vscode.Uri): void {
    const key = uri.toString();
    this.generations.delete(key);
    this.roots.delete(key);
    this.pruneWatchers();
  }

  private track(root: string, dependencies: Set<string>): void {
    this.roots.set(root, dependencies);
    for (const key of dependencies) {
      if (this.watchers.has(key)) continue;
      const uri = vscode.Uri.parse(key);
      try {
        const name = basename(uri.fsPath);
        const watcher = watch(dirname(uri.fsPath), (_, changedName) => {
          if (changedName === null || changedName.toString() === name)
            this.changed.fire(uri);
        });
        watcher.on("error", () => {
          this.watchers.delete(key);
          watcher.close();
          this.changed.fire(uri);
        });
        this.watchers.set(key, watcher);
      } catch {
        // 親ディレクトリも存在しない場合は次の解析時に再試行する。
      }
    }
    this.pruneWatchers();
  }

  private pruneWatchers(): void {
    for (const [key, watcher] of this.watchers) {
      if (
        [...this.roots.values()].some((dependencies) => dependencies.has(key))
      )
        continue;
      watcher.close();
      this.watchers.delete(key);
    }
  }

  /** 開いた文書の未保存内容を優先し、同じファイルは1回だけ解析する。 */
  async resolve(document: vscode.TextDocument): Promise<GlfDocument> {
    const rootUri = document.uri;
    const rootKey = rootUri.toString();
    const generation = (this.generations.get(rootKey) ?? 0) + 1;
    this.generations.set(rootKey, generation);
    const root = parseGlf(document.getText(), { validate: false });
    if (root.imports.length === 0) {
      this.track(rootKey, new Set());
      return parseGlf(document.getText());
    }
    const dependencies = new Set<string>();
    const visited = new Set<string>();
    const active = new Set<string>([rootKey]);
    const sources: {
      uri: string;
      importLine: number;
      document: GlfDocument;
    }[] = [];
    const errors: Diagnostic[] = [];

    const visit = async (
      owner: vscode.Uri,
      entry: GlfImport,
      rootLine: number,
      chain: string[],
    ): Promise<void> => {
      const target = importTarget(owner, entry.path);
      if (!target) {
        errors.push({
          code: "import-path",
          line: rootLine,
          message: `importの相対GLFパスが不正: ${entry.path}`,
        });
        return;
      }
      const key = target.toString();
      dependencies.add(key);
      if (active.has(key)) {
        errors.push({
          code: "import-cycle",
          line: rootLine,
          message: `importが循環: ${[...chain, target.fsPath].join(" -> ")}`,
        });
        return;
      }
      if (visited.has(key)) return;
      visited.add(key);
      active.add(key);
      try {
        const open = vscode.workspace.textDocuments.find(
          (candidate) => candidate.uri.toString() === key,
        );
        const source = open
          ? open.getText()
          : decoder.decode(await vscode.workspace.fs.readFile(target));
        const imported = parseGlf(source, { validate: false });
        if (imported.diagnostics.length > 0) {
          errors.push({
            code: "import-invalid",
            line: rootLine,
            message: `import先が不正: ${target.fsPath}:${imported.diagnostics[0].line} ${imported.diagnostics[0].message}`,
          });
          return;
        }
        sources.push({ uri: key, importLine: rootLine, document: imported });
        for (const nested of imported.imports)
          await visit(target, nested, rootLine, [...chain, target.fsPath]);
      } catch (error) {
        errors.push({
          code: "import-read",
          line: rootLine,
          message: `import先を読み込めない: ${target.fsPath} (${error instanceof Error ? error.message : String(error)})`,
        });
      } finally {
        active.delete(key);
      }
    };

    for (const entry of root.imports)
      await visit(rootUri, entry, entry.line, [rootUri.fsPath]);
    const merged = mergeGlfDefinitions(root, sources);
    merged.diagnostics.push(...errors);
    if (this.generations.get(rootKey) === generation)
      this.track(rootKey, dependencies);
    return merged;
  }

  dispose(): void {
    for (const watcher of this.watchers.values()) watcher.close();
    this.watchers.clear();
    this.roots.clear();
    this.generations.clear();
    this.changed.dispose();
  }
}
