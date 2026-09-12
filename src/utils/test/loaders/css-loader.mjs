import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

function load(url, context, nextLoad) {
    if (url.endsWith('.css')) {
        const source = readFileSync(fileURLToPath(url), 'utf8');

        return {
            format: 'module',
            shortCircuit: true,
            source: `export default ${JSON.stringify(source)};`,
        };
    }

    return nextLoad(url, context);
}

registerHooks({ load });
