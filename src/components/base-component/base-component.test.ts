import { ok, strictEqual } from 'node:assert';
import { after, afterEach, before, beforeEach, describe, it, mock, type MockFunctionContext } from 'node:test';
import { TrustedHTML } from '../../utils/test/browser.utils.ts';
import { createElement, generateRandomTagName, removeElement } from '../../utils/test/helpers/component.helpers.ts';
import { LumComponent, type LumComponentType, registerComponent } from './base-component.component.ts';

describe('base-component', () => {
    describe('registerComponent', () => {
        let mockDefine: MockFunctionContext<Function>;
        let mockGet: MockFunctionContext<Function>;
        let component: LumComponentType;

        before(() => {
            mockDefine = mock.method(customElements, 'define').mock;
            mockGet = mock.method(customElements, 'get').mock;
        });

        beforeEach(() => {
            component = class extends LumComponent {
                static tagName = generateRandomTagName();
            };
        });

        afterEach(() => {
            mockDefine.resetCalls();
            mockGet.resetCalls();
        });

        after(() => {
            mockDefine.restore();
            mockGet.restore();
        })

        it('should be a function', () => {
            strictEqual(typeof registerComponent, 'function', 'expected registerComponent to be a function');
        });

        it('should check customElements to make sure the element is defined', () => {
            registerComponent(component);
            strictEqual(mockGet.callCount(), 1);
            mockGet.resetCalls();
        });

        it('it should only define a custom element if it does not already exist', () => {
            registerComponent(component);
            registerComponent(component);
            strictEqual(mockGet.callCount(), 2, `expected 'get' to be called twice; called ${mockGet.callCount()} times`);
            strictEqual(mockDefine.callCount(), 1, `expected 'define' to be called once; called ${mockDefine.callCount()} times`);
        });

        it('it should skip defining a custom element if it exists', () => {
            mockGet.mockImplementation((_: string) => component);
            registerComponent(component);
            strictEqual(mockDefine.callCount(), 0);
        });
    });

    describe('LumComponent', () => {
        describe('sanitizeHTML', () => {
            const TAG_NAME = 'sanitize-html-exposed-test-element';

            type ElementType = LumComponent & {
                getSanitizeHTML: () => (html: string) => TrustedHTML,
                executeSanitizeHTML: (html: string) => TrustedHTML,
            };

            let element: ElementType;

            before(() => {
                registerComponent(class extends LumComponent {
                    static tagName = TAG_NAME;

                    public getSanitizeHTML(): (html: string) => TrustedHTML {
                        return this.sanitizeHTML;
                    }

                    public executeSanitizeHTML(html: string): TrustedHTML {
                        return this.sanitizeHTML(html);
                    }
                });
            });

            beforeEach(async () => {
                element = await createElement(TAG_NAME) as ElementType;
            });
            afterEach(async () => await removeElement());

            it('should be a function', () => {
                strictEqual(typeof element.getSanitizeHTML(), 'function');
            });

            it('should return a TrustedHTML', () => {
                const result = element.executeSanitizeHTML('<html><head></head><body></body></html>');
                ok(result instanceof TrustedHTML);
            });

            it('should return the exact string if it is already sanitized', () => {
                const original = '<div>Hello World!</div>';
                const sanitized = element.executeSanitizeHTML(original);
                strictEqual(original, sanitized.toString(), `expected ${original} to match ${sanitized}`);
            });

            // TODO [Test] Create more tests for sanitizing actual content when you swing around to this.
            // TODO [Plan] Start creating tickets for these items instead of sprinkling them all over the code.
        });
    });
});
