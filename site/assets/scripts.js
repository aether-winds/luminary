customElements.define('lum-dev-showcase', class extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({mode: 'open'});

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(``);
        this.#shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.#shadow.innerHTML = `
            <slot></slot>
        `;
    }
});