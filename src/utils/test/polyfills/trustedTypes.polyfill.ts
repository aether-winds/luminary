import { trustedTypes as polyfill } from 'trusted-types';

export const trustedTypes = polyfill as unknown as typeof globalThis.trustedTypes;
export const TrustedHTML = polyfill.TrustedHTML as unknown as typeof globalThis.TrustedHTML;
