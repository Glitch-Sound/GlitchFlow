import * as vscode from "vscode";
import { openPreview } from "./preview-panel";

/** REQ-001: register the user-facing preview command. */
export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("glitchflow.openPreview", () =>
      openPreview(context),
    ),
  );
}

export function deactivate(): void {}
