import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(__dirname, "examples"),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, "examples-dist"),
    emptyOutDir: true
  }
});
