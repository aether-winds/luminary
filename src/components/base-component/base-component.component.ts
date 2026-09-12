import type { TrustedTypePolicy } from "trusted-types/lib/index.js";

export type LumComponentType = typeof LumComponent & LumComponentConstructor;
export type CreateHTMLTrustPolicy = Pick<TrustedTypePolicy<{ createHTML: (input: string, ...args: unknown[]) => string; }>, "name" | "createHTML">;

interface LumComponentConstructor {
    new (...args: unknown[]): HTMLElement,
    readonly tagName: string; // enforcing a static property must exist.
}

const luminaryTrustPolicy: CreateHTMLTrustPolicy = trustedTypes.createPolicy('luminary-trust-policy', {
    createHTML: (input: string, ..._: unknown[]): string => {
        return input;
    }
});

export class LumComponent extends HTMLElement {
    private trustPolicy: CreateHTMLTrustPolicy = luminaryTrustPolicy;

    protected sanitizeHTML(html: string): TrustedHTML {
        return this.trustPolicy.createHTML(html);
    }
}

export function registerComponent(componentClass: LumComponentType): void {
    if (!customElements.get(componentClass.tagName)) {
        customElements.define(componentClass.tagName, componentClass);
    }
}
