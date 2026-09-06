import { mock, type Mock } from 'node:test';
import { type LumMock } from './mock.type.js';

const elements: Record<string, CustomElementConstructor> = {};

const customElements: CustomElementRegistry = {
    define: mock.fn((tagName: string, constructor: CustomElementConstructor): void => {
        if (!elements[tagName]) {
            elements[tagName] = constructor;
        }
    }),

    get: mock.fn((tagName: string): CustomElementConstructor | undefined => {
        return elements[tagName];
    }),

    getName: mock.fn((constructor: CustomElementConstructor): string | null => {
        const entry = Object.entries(elements)
            .find(([_, v]: [string, CustomElementConstructor]) => v === constructor);

        return entry ? entry[0] : null;
    }),

    initialize: mock.fn((_: Document | ShadowRoot | Element) => {}),

    upgrade: mock.fn((_: Document | ShadowRoot | Element) => {}),

    whenDefined: mock.fn((tagName: string): Promise<CustomElementConstructor> => {
        if (!elements[tagName]) {
            return Promise.reject(new SyntaxError('not a valid tag name'));
        }
        return Promise.resolve(elements[tagName]);
    }),
};

export const mockCustomElements: LumMock<CustomElementRegistry> = {
    mocked: { ...customElements },

    reset: () => Object.keys(mockCustomElements.mocked).forEach((k: string) => {
        const method: Mock<Function> = mockCustomElements.mocked[k as keyof CustomElementRegistry] as unknown as Mock<Function>;

        if (method.mock !== undefined) {
            method.mock.resetCalls();
        }
    }),

    restore: () => Object.keys(mockCustomElements.mocked).forEach((k: string) => {
        const method: Mock<Function> = mockCustomElements.mocked[k as keyof CustomElementRegistry] as unknown as Mock<Function>;

        if (method.mock !== undefined) {
            method.mock.restore();
        }
    })
}
