import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { LumCustomElement } from "./lum-custom-element.component";

describe("LumCustomElement", () => {
    describe("define method", () => {
        let spy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            spy = vi.spyOn(customElements, "define");
        });

        afterEach(() => {
            spy = undefined;
        });

        it("should define the element", () => {
            class TestLumCustomElement extends LumCustomElement {
                constructor() {
                    super();
                }
            }

            TestLumCustomElement.define("test-lum-custom-element-1");
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(
                "test-lum-custom-element-1",
                TestLumCustomElement,
            );
        });

        it("should only define the element once", () => {
            class TestLumCustomElement extends LumCustomElement {
                constructor() {
                    super();
                }
            }

            TestLumCustomElement.define("test-lum-custom-element-2");
            TestLumCustomElement.define("test-lum-custom-element-2");
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(
                "test-lum-custom-element-2",
                TestLumCustomElement,
            );
        });
    });

    describe('getClassType method', () => {
        it('should return the class type', () => {
            class TestLumCustomElement extends LumCustomElement {
                constructor() { super(); }

                public get testGetClassType(): typeof LumCustomElement {
                    return this.getClassType();
                }
            }

            TestLumCustomElement.define('test-lum-custom-element-3');
            const el = document.createElement('test-lum-custom-element-3');
            expect((el as TestLumCustomElement).testGetClassType).toBe(TestLumCustomElement);
        });
    });
});
