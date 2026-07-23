#!/bin/bash

npx esbuild ./src/luminary.ts \
    --bundle \
    --sourcemap \
    --tsconfig=./tsconfig.json \
    --outdir=./site/assets \
    --servedir=./site \
    --loader:.elem.html=text \
    --loader:.elem.css=text \
    --target=chrome67,firefox63,safari26,edge79 \
    --watch