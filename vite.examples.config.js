const { resolve } = require("node:path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  root: resolve(__dirname, "examples"),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, "examples-dist"),
    emptyOutDir: true
  }
});
