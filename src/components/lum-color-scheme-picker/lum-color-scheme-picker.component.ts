import { LumComponent } from '../base-component/base-component.barrel.js';
import css from './lum-color-scheme-picker.component.css';

export class LumColorPickerElement extends LumComponent {
    static tagName = 'lum-color-schema-picker';
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadow.adoptedStyleSheets = [sheet];
    }

    public connectedCallback(): void {
        this.shadow.innerHTML = this.sanitizeHTML(`
            build the color picker component. unit testing and framework are all set now
        `) as unknown as string;
    }
}
