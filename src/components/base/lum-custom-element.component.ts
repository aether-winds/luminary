export interface LumCustomElementConfiguration {}

export abstract class LumCustomElement extends HTMLElement {
    static define(tagName: string): void {
        if (!customElements.get(tagName)) {
            customElements.define(
                tagName,
                this as unknown as CustomElementConstructor,
            );
        }
    }

    constructor(_?: LumCustomElementConfiguration) {
        super();
    }

    protected getClassType(): typeof LumCustomElement {
        return this.constructor as typeof LumCustomElement;
    }
}
