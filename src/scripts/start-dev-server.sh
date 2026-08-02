#!/bin/bash

npx esbuild ./src/luminary/luminary.ts \
    --bundle \
    --sourcemap \
    --tsconfig=./tsconfig.json \
    --outdir=./src/demo/assets \
    --servedir=./src/demo \
    --loader:.elem.html=text \
    --loader:.elem.css=text \
    --target=chrome67,firefox63,safari26,edge79 \
    --watch
