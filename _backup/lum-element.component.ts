export abstract class LumElement extends HTMLElement {
  protected readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static define<T extends typeof LumElement>(element: T, tagName: string): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, element as unknown as CustomElementConstructor);
    }
  }

  protected renderShadow(template: string, styles: string | string[] = []): void {
    const styleList = Array.isArray(styles) ? styles : styles ? [styles] : [];
    const styleMarkup = styleList
      .filter((style) => style.length > 0)
      .map((style) => `<style>${style}</style>`)
      .join('');

    this.shadow.innerHTML = `${styleMarkup}${template}`;
  }

  protected getBooleanAttribute(name: string): boolean {
    return this.hasAttribute(name);
  }

  protected setBooleanAttribute(name: string, value: boolean): void {
    if (value) {
      this.setAttribute(name, '');
      return;
    }

    this.removeAttribute(name);
  }

  protected getStringAttribute(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback;
  }

  protected setStringAttribute(name: string, value: string | null | undefined): void {
    if (value == null || value === '') {
      this.removeAttribute(name);
      return;
    }

    this.setAttribute(name, value);
  }

  protected getNumberAttribute(name: string, fallback = 0): number {
    const rawValue = this.getAttribute(name);

    if (rawValue == null || rawValue === '') {
      return fallback;
    }

    const value = Number(rawValue);
    return Number.isFinite(value) ? value : fallback;
  }

  protected setNumberAttribute(name: string, value: number | null | undefined): void {
    if (value == null || Number.isNaN(value)) {
      this.removeAttribute(name);
      return;
    }

    this.setAttribute(name, String(value));
  }

  protected syncAriaBoolean(name: string, value: boolean | null | undefined): void {
    if (value == null) {
      this.removeAttribute(`aria-${name}`);
      return;
    }

    this.setAttribute(`aria-${name}`, value ? 'true' : 'false');
  }

  protected syncAriaString(name: string, value: string | null | undefined): void {
    if (value == null || value === '') {
      this.removeAttribute(`aria-${name}`);
      return;
    }

    this.setAttribute(`aria-${name}`, value);
  }

  protected emitLumEvent<TDetail>(
    type: string,
    detail?: TDetail,
    init: Omit<CustomEventInit<TDetail>, 'detail'> = {}
  ): boolean {
    const eventType = type.startsWith('lum-') ? type : `lum-${type}`;

    return this.dispatchEvent(
      new CustomEvent<TDetail>(eventType, {
        bubbles: true,
        composed: true,
        detail,
        ...init
      })
    );
  }

  protected setTabIndex(tabIndex: number | null | undefined): void {
    if (tabIndex == null) {
      this.removeAttribute('tabindex');
      return;
    }

    this.setAttribute('tabindex', String(tabIndex));
  }

  protected setRole(role: string | null | undefined): void {
    if (role == null || role === '') {
      this.removeAttribute('role');
      return;
    }

    this.setAttribute('role', role);
  }
}

export default LumElement;
