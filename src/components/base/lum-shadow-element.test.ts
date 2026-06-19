import { beforeEach, describe, expect, it } from "vitest";
import { LumShadowElement } from "./lum-shadow-element.component";

describe("LumShadowElement", () => {
    beforeEach(() => {
        TestLumShadowDefaultElement.define('lum-shadow-default-element');
        TestLumShadowOpenedElement.define('lum-shadow-opened-element');
        TestLumShadowClosedElement.define('lum-shadow-closed-element');
    });

    describe('shadowRoot property', () => {
        it('should return a shadow root value if using default configuration', () => {
            const el = document.createElement('lum-shadow-default-element');
            expect(el.shadowRoot).toBeDefined();
            expect(el.shadowRoot).not.toBeNull();
        });

        it('should return a shadow root value if using an open mode configuration', () => {
            const el = document.createElement('lum-shadow-opened-element');
            expect(el.shadowRoot).toBeDefined();
            expect(el.shadowRoot).not.toBeNull();
        });

        it('should return null if using a closed mode configuration', () => {
            const el = document.createElement('lum-shadow-closed-element');
            expect(el.shadowRoot).toBeDefined();
            expect(el.shadowRoot).toBeNull();
        });
    });
});

class TestLumShadowDefaultElement extends LumShadowElement {
    constructor() {
        super({ shadowMode: 'open' });
    }
}

class TestLumShadowOpenedElement extends LumShadowElement {
    constructor() {
        super({ shadowMode: 'open' });
    }
}

class TestLumShadowClosedElement extends LumShadowElement {
    constructor() {
        super({ shadowMode: 'closed' });
    }
}
