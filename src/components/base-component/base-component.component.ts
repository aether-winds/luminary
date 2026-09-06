import type { TrustedTypePolicy } from "trusted-types/lib/index.js";

type CreateHTMLTrustPolicy = Pick<TrustedTypePolicy<{ createHTML: (input: string, ...args: unknown[]) => string; }>, "name" | "createHTML">;

interface LumComponentConstructor {
    new (...args: unknown[]): HTMLElement,
    readonly tagName: string; // enforcing a static property must exist.
}

const luminaryTrustPolicy: CreateHTMLTrustPolicy = trustedTypes.createPolicy('luminary-trust-policy', {
    createHTML: (input: string, ...args: unknown[]): string => {
        return input;
    }
});

export class LumComponent extends HTMLElement {
    protected trustPolicy: CreateHTMLTrustPolicy = luminaryTrustPolicy;
}

export function registerComponent(componentClass: typeof LumComponent & LumComponentConstructor): void {
    if (!customElements.get(componentClass.tagName)) {
        customElements.define(componentClass.tagName, componentClass);
    }
}
