const { resolve } = require("node:path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.js"),
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
