import type { GlfDocument, GlfObject, Schema } from "../model/glf-model";
import { validateGlf } from "./validate-glf";

export interface ImportedDefinitions {
  uri: string;
  importLine: number;
  document: GlfDocument;
}

/** REQ-035 / REQ-036: 参照元のイベントを保ったまま定義を合成し、衝突を診断する。 */
export function mergeGlfDefinitions(
  root: GlfDocument,
  sources: ImportedDefinitions[],
): GlfDocument {
  const merged: GlfDocument = {
    ...root,
    objects: [...root.objects],
    schemas: [...root.schemas],
    diagnostics: [...root.diagnostics],
  };
  const objects = new Map<string, GlfObject>(
    merged.objects.map((object) => [object.id, object]),
  );
  const schemas = new Map<string, Schema>(
    merged.schemas.map((schema) => [schema.reference.raw, schema]),
  );
  for (const source of sources) {
    for (const object of source.document.objects) {
      const prior = objects.get(object.id);
      if (prior) {
        merged.diagnostics.push({
          code: "object-duplicate",
          line: source.importLine,
          message: `Object ID ${object.id} が重複: ${prior.origin?.uri ?? "このファイル"} と ${source.uri}`,
        });
        continue;
      }
      const imported = {
        ...object,
        line: source.importLine,
        origin: { uri: source.uri, line: object.line },
      };
      objects.set(imported.id, imported);
      merged.objects.push(imported);
    }
    for (const schema of source.document.schemas) {
      const prior = schemas.get(schema.reference.raw);
      if (prior) {
        merged.diagnostics.push({
          code: "schema-duplicate",
          line: source.importLine,
          message: `schema ${schema.reference.raw} が重複: ${prior.origin?.uri ?? "このファイル"} と ${source.uri}`,
        });
        continue;
      }
      const imported = {
        ...schema,
        line: source.importLine,
        origin: { uri: source.uri, line: schema.line },
      };
      schemas.set(imported.reference.raw, imported);
      merged.schemas.push(imported);
    }
  }
  merged.diagnostics.push(...validateGlf(merged));
  return merged;
}
