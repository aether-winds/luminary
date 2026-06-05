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
  it("renders label from attribute", () => {
    const el = document.createElement("lum-button");
    el.setAttribute("label", "Save");
    document.body.appendChild(el);

    const button = el.shadowRoot.querySelector("button");
    expect(button.textContent.trim()).toBe("Save");
  });

  it("emits a lum-button-click custom event", () => {
    const el = document.createElement("lum-button");
    document.body.appendChild(el);

    const handler = vi.fn();
    el.addEventListener("lum-button-click", handler);

    el.shadowRoot.querySelector("button").click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].bubbles).toBe(true);
    expect(handler.mock.calls[0][0].composed).toBe(true);
  });

  it("does not emit event when disabled", () => {
    const el = document.createElement("lum-button");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);

    const handler = vi.fn();
    el.addEventListener("lum-button-click", handler);

    el.shadowRoot.querySelector("button").click();

    expect(handler).not.toHaveBeenCalled();
  });
});
