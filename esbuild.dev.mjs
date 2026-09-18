import esbuild from 'esbuild';
import http from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath = dirname(fileURLToPath(import.meta.url));

function handler(req, res) {
    const options = {
        hostname: hosts[0],
        port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, proxyRes => {
        if (proxyReq.statusCode === 404) {
            res.writeHeadh(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, {end: true});
    });

    req.pipe(proxyReq, {end: true});
}

const config = {
    entryPoints: [
        join(rootPath, 'src', 'luminary.foundation.css'),
        join(rootPath, 'src', 'luminary.components.ts'),
    ],
    bundle: true,
    loader: { '.component.css': 'text' },
    outdir: './demo/assets',
    sourcemap: true,
    target: [ 'chrome67', 'firefox63', 'safari26', 'edge79' ],
    tsconfig: './tsconfig.dev.json',
};


const ctx = await esbuild.context(config);
const { hosts, port } = await ctx.serve({servedir: './demo'});
const service = http.createServer(handler);

service.listen(3000, () => console.log(`service started on port ${port}...`));
