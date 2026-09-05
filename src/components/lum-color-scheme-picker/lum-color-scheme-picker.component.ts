import css from './lum-color-scheme-picker.component.css';



import { luminaryTrustPolicy } from '../../utils/luminary-trust-policy/luminary-trust-policy.js';

export class LumColorPickerElement extends HTMLElement {
    private shadow: ShadowRoot;

    static register(): void {
        const TAG_NAME = 'color-schema-picker';
        if (!customElements.get(TAG_NAME))
            customElements.define(TAG_NAME, LumColorPickerElement);
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadow.adoptedStyleSheets = [sheet];
    }

    public connectedCallback(): void {
        this.shadow.innerHTML = luminaryTrustPolicy.createHTML(`
            <div> hello world! </div>
        `).toString();
    }
}
