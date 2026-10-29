import { describe, expect, it } from "vitest";
import { isGlfFileName } from "../../src/core";

describe("Core公開API: .glfファイルの判定", () => {
  it("正しい拡張子だけを受け付ける", () => {
    expect(isGlfFileName("login.glf")).toBe(true);
    expect(isGlfFileName("login.glf.backup")).toBe(false);
    expect(isGlfFileName("login.glfx")).toBe(false);
  });
});
