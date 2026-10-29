/** REQ-017: プレビュー内の倍率を管理する。 */
let zoom = 1;

export function getZoom(): number {
  return zoom;
}

export function changeZoom(delta: number): number {
  zoom = Math.max(0.5, Math.min(2, Math.round((zoom + delta) * 10) / 10));
  return zoom;
}

export function resetZoom(): number {
  zoom = 1;
  return zoom;
}
