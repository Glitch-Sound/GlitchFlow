/** Pure filename check used at the extension boundary. */
export function isGlfFileName(fileName: string): boolean {
  return fileName.endsWith(".glf");
}

export type { SequenceLayout } from "./layout/sequence-layout";
export { layoutSequence } from "./layout/sequence-layout";
export type {
  Change,
  DbCell,
  DbRow,
  Diagnostic,
  FileNode,
  GlfDocument,
  GlfEvent,
  GlfObject,
  Schema,
  TableReference,
} from "./model/glf-model";
export { parseGlf } from "./parser/parse-glf";
