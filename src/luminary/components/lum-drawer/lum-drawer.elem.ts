import styles from './lum-drawer.elem.css';
import html from './lum-drawer.elem.html';

export class LumDrawer extends HTMLElement {
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
