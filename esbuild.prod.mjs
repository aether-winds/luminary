import esbuild from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath = dirname(fileURLToPath(import.meta.url));

const config = {
    entryPoints: [
        join(rootPath, 'src', 'luminary.foundation.css'),
        join(rootPath, 'src', 'luminary.components.ts'),
    ],
    bundle: true,
    loader: { '.component.css': 'text' },
    outdir: './dist',
    sourcemap: false,
    target: [ 'chrome67', 'firefox63', 'safari26', 'edge79' ],
};


const ctx = esbuild.build(config);
