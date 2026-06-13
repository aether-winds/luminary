import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Luminary",
      formats: ["es", "cjs", "iife"],
      fileName: (format) => {
        if (format === "es") {
          return "luminary.esm.js";
        }
        if (format === "cjs") {
          return "luminary.cjs.js";
        }
        return "luminary.iife.js";
      }
    }
  }
});
