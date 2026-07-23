export function registerElement(tag: string, classType: typeof HTMLElement, options?: { extends: string }): void {
    if (customElements.get(tag)) return;
    customElements.define(tag, classType, options);
}