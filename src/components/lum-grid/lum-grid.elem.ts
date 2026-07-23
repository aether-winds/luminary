import styles from './lum-grid.elem.css';
import html from './lum-grid.elem.html';

export class LumGrid extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(styles);
        this.shadow.adoptedStyleSheets = [sheet];
    }

    public connectedCallback(): void {
        this.shadow.innerHTML = html;
    }
}