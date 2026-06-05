#!/usr/bin/env sh
set -eu

npm run verify:package
npm run test
npm run build

echo "Release preparation checks completed."
