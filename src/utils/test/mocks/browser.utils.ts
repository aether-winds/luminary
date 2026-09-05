import { parseHTML } from 'linkedom';

const {
    customElements,
    HTMLElement,
} = parseHTML(`<!doctype html><html><body></body></html>`);

// linkedom doesn't provide Trusted Types; components call trustedTypes.createPolicy()
// at module load, so a pass-through stub is enough for tests.
const trustedTypes = {
    createPolicy: (
        name: string,
        rules: Record<string, (input: string, ...args: unknown[]) => string>,
    ) => ({ name, ...rules }),
} as unknown as typeof globalThis.trustedTypes;

export {
    customElements,
    HTMLElement,
    trustedTypes
};
