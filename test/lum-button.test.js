import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import LumButton from "../src/components/lum-button.js";

beforeAll(() => {
    if (!customElements.get("lum-button")) {
        customElements.define("lum-button", LumButton);
    }
});

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("lum-button", () => {
    it("emits a lum-button-click custom event", () => {
        const el = createLumButton();
        const handler = vi.fn();

        el.addEventListener("lum-button-click", handler);
        el.click();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].bubbles).toBe(true);
        expect(handler.mock.calls[0][0].composed).toBe(true);
    });

    it("does not emit event when disabled", () => {
        const el = createLumButton([{ name: "disabled", value: "" }]);
        const handler = vi.fn();

        el.addEventListener("lum-button-click", handler);
        el.click();

        expect(handler).not.toHaveBeenCalled();
    });
});

function createLumButton(attributes) {
    const attrs = [ ...(!!attributes && Array.isArray(attributes) ? attributes : []) ];
    const el = document.createElement("lum-button");

    if (attrs.length > 0)
        attrs.forEach(attr => el.setAttribute(attr.name, attr.value));

    document.body.appendChild(el);
    return el;
}
