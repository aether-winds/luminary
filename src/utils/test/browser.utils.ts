import { JSDOM } from 'jsdom';
import { trustedTypes as polyfill } from 'trusted-types';

const dom: JSDOM = new JSDOM(`<!doctype html><html><body></body></html>`, { url: 'http://localhost' });

// DOM Polyfills
export const window = dom.window as unknown as Window & typeof globalThis;
export const document = window.document;
export const CSSStyleSheet = window.CSSStyleSheet;
export const HTMLElement = window.HTMLElement;
export const ShadowRoot = window.ShadowRoot;

// Homegrown Mocks
export const customElements = window.customElements;

// Trust policies
export const trustedTypes = polyfill as unknown as typeof globalThis.trustedTypes;
export const TrustedHTML = polyfill.TrustedHTML as unknown as typeof polyfill.TrustedHTML;
