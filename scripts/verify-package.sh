#!/usr/bin/env sh
set -eu

node -e '
const fs = require("node:fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredScripts = ["dev", "test", "build", "preview", "verify:package", "release:prepare"];
const missingScripts = requiredScripts.filter((name) => !pkg.scripts || !pkg.scripts[name]);
const requiredFields = ["name", "version", "license", "main", "module", "exports", "files"];
const missingFields = requiredFields.filter((name) => pkg[name] == null);
if (missingScripts.length || missingFields.length) {
  if (missingScripts.length) {
    console.error("Missing scripts:", missingScripts.join(", "));
  }
  if (missingFields.length) {
    console.error("Missing package fields:", missingFields.join(", "));
  }
  process.exit(1);
}
'

npm run build >/dev/null

PACK_OUTPUT="$(npm pack --dry-run --json)"
printf "%s" "$PACK_OUTPUT" | node -e '
const fs = require("node:fs");
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const files = new Set((data[0] && data[0].files ? data[0].files : []).map((entry) => entry.path));
const required = [
  "README.md",
  "LICENSE",
  "dist/luminary.esm.js",
  "dist/luminary.cjs.js",
  "dist/luminary.iife.js"
];
const missing = required.filter((name) => !files.has(name));
if (missing.length) {
  console.error("Missing files in npm pack dry-run:", missing.join(", "));
  process.exit(1);
}
'

echo "Package verification passed."
