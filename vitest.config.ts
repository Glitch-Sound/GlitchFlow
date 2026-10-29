import { defineConfig } from "vitest/config";

export default defineConfig({
  root: process.cwd(),
  test: {
    include: ["tests/core/**/*.test.ts"],
  },
});
