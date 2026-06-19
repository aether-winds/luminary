import { LumCustomElement, LumCustomElementConfiguration } from './lum-custom-element.component';

export interface LumShadowElementConfiguration extends LumCustomElementConfiguration {
    shadowMode: 'open' | 'closed';
}

export abstract class LumShadowElement extends LumCustomElement {
    protected _shadowRoot: ShadowRoot;

    constructor(configuration?: LumShadowElementConfiguration) {
        super(configuration);
        this._shadowRoot = this.attachShadow({ mode: configuration.shadowMode || 'open' });
    }
}
