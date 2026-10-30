export type ObjectType = "APP" | "API" | "DB" | "FILE" | "FEATURE" | "MODULE";
export type Change = "added" | "removed" | "unchanged";

export interface Diagnostic {
  code: string;
  line: number;
  message: string;
}

export interface DefinitionOrigin {
  uri: string;
  line: number;
}

export interface GlfImport {
  path: string;
  line: number;
}

export interface GlfObject {
  id: string;
  label: string;
  type: ObjectType;
  line: number;
  origin?: DefinitionOrigin;
}

export interface TableReference {
  raw: string;
  objectId: string;
  schema?: string;
  table: string;
}

export interface Schema {
  reference: TableReference;
  columns: { name: string; type: string; line: number }[];
  line: number;
  origin?: DefinitionOrigin;
}

export interface DbCell {
  value: string;
  change: "updated" | "unchanged";
}

export interface DbRow {
  cells: DbCell[];
  change: Change;
  line: number;
}

export interface FileNode {
  name: string;
  change: Change;
  children: FileNode[];
  line: number;
}

export type GlfEvent =
  | {
      kind: "message";
      from: string;
      to: string;
      mode: "sync" | "async" | "response";
      label: string;
      line: number;
    }
  | {
      kind: "process";
      objectId: string;
      text: string;
      emphasis: boolean;
      line: number;
    }
  | {
      kind: "activation";
      objectId: string;
      action: "start" | "end";
      line: number;
    }
  | { kind: "db-state"; reference: TableReference; rows: DbRow[]; line: number }
  | { kind: "file-state"; objectId: string; nodes: FileNode[]; line: number }
  | { kind: "sql"; objectId: string; text: string; line: number }
  | {
      kind: "alt";
      branches: { label: string; events: GlfEvent[]; line: number }[];
      line: number;
    }
  | {
      kind: "opt" | "loop" | "break";
      label: string;
      events: GlfEvent[];
      line: number;
    }
  | {
      kind: "par";
      branches: { label: string; events: GlfEvent[]; line: number }[];
      line: number;
    };

export interface GlfDocument {
  title?: string;
  imports: GlfImport[];
  objects: GlfObject[];
  schemas: Schema[];
  events: GlfEvent[];
  diagnostics: Diagnostic[];
}
