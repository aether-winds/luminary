#!/usr/bin/env sh
set -eu

npm run test
npm run verify:package

echo "Release preparation checks completed."
