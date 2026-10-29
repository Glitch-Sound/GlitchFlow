/** Pure filename check used at the extension boundary. */
export function isGlfFileName(fileName: string): boolean {
  return fileName.endsWith(".glf");
}
