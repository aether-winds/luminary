import styles from './lum-application.elem.css';
import html from './lum-application.elem.html';

export class LumApplication extends HTMLBodyElement {
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