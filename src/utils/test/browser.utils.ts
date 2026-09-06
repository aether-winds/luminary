import { JSDOM } from 'jsdom';
import { mockCustomElements } from './mocks/customElements.mock.js';

// DOM Polyfills
const dom = new JSDOM(`<!doctype html><html><body></body></html>`, { url: 'http://localhost' });
const window = dom.window as unknown as Window & typeof globalThis;
const document = window.document;
const HTMLElement = window.HTMLElement;

// Homegrown Mocks
const customElements = mockCustomElements.mocked;

// jsdom doesn't provide Trusted Types; components call trustedTypes.createPolicy()
// at module load, so a pass-through stub is enough for tests.
const trustedTypes = {
    createPolicy: (
        name: string,
        rules: Record<string, (input: string, ...args: unknown[]) => string>,
    ) => ({ name, ...rules }),
} as unknown as typeof globalThis.trustedTypes;

export {
    window,
    document,

    trustedTypes,

    HTMLElement,

    customElements,
};
