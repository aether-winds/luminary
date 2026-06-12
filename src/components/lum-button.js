/**
 * Luminary button web component.
 *
 * Tag: <lum-button>
 *
 * Attributes:
 *  - label: Fallback button label text when no slotted content is provided.
 *  - disabled: Disables click and keyboard interaction when present.
 *  - variant: Visual style variant ("primary" | "secondary").
 *
 * Slots:
 *  - default: Optional button content.
 *
 * Events:
 *  - lum-button-click: Fired when the control is activated by the user.
 *
 * Tokens:
 *  - --lum-button-bg
 *  - --lum-button-bg-hover
 *  - --lum-button-fg
 *  - --lum-button-radius
 */
export default class LumButton extends HTMLElement {
    #shadowRoot;

    static get observedAttributes() {
        return ["label", "disabled", "variant"];
    }

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: "open" });
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    connectedCallback() {
        this._render();
        this._button = this.#shadowRoot.querySelector("button");
        this._button.addEventListener("click", this._onButtonClick);
    }

    disconnectedCallback() {
        if (this._button) {
            this._button.removeEventListener("click", this._onButtonClick);
        }
    }

    attributeChangedCallback() {
        this._render();
        if (this.isConnected) {
            this._button = this.#shadowRoot.querySelector("button");
            this._button.removeEventListener("click", this._onButtonClick);
            this._button.addEventListener("click", this._onButtonClick);
        }
    }

    get label() {
        return this.getAttribute("label") || "Button";
    }

    set label(value) {
        this.setAttribute("label", value);
    }

    get disabled() {
        return this.hasAttribute("disabled");
    }

    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    click() {
        this.#shadowRoot.querySelector("button")?.click();
    }

    _onButtonClick(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.dispatchEvent(
            new CustomEvent("lum-button-click", {
                bubbles: true,
                composed: true,
                detail: {
                    label: this.label,
                    variant:
                        this.getAttribute("variant") === "secondary" ? "secondary" : "primary",
                },
            }),
        );
    }

    _render() {
        const variant =
            this.getAttribute("variant") === "secondary"
                ? "secondary"
                : "primary";
        const disabled = this.disabled ? "disabled" : "";

        this.#shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --lum-button-bg: #0f766e;
          --lum-button-bg-hover: #115e59;
          --lum-button-fg: #ffffff;
          --lum-button-radius: 0.5rem;
        }

        button {
          font: inherit;
          background: var(--lum-button-bg);
          color: var(--lum-button-fg);
          border: 0;
          border-radius: var(--lum-button-radius);
          padding: 0.6rem 0.95rem;
          cursor: pointer;
          transition: background-color 0.16s ease;
        }

        button[data-variant="secondary"] {
          background: transparent;
          color: var(--lum-button-bg);
          border: 1px solid currentColor;
        }

        button:hover:not(:disabled) {
          background: var(--lum-button-bg-hover);
        }

        button:focus-visible {
          outline: 2px solid #0a3d3a;
          outline-offset: 2px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      <button type="button" data-variant="${variant}" ${disabled}>
        <slot>${this.label}</slot>
      </button>
    `;
    }
}

if (!customElements.get("lum-button")) {
    customElements.define("lum-button", LumButton);
}
