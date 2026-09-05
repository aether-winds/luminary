#!/bin/bash

npx esbuild \
    ./src/luminary.foundation.css \
    ./src/luminary.components.ts \
    --bundle \
    --sourcemap \
    --loader:.component.css=text \
    --tsconfig=./tsconfig.app.json \
    --outdir=./demo/assets \
    --servedir=./demo \
    --target=chrome67,firefox63,safari26,edge79 \
    --watch
