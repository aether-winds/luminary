import { fail, strictEqual } from 'node:assert';
import { beforeEach, describe, it, type MockFunctionContext } from 'node:test';

import { getMockMethodContext, type MockMethod, resetAllMocks, setMockMethodImpl } from '../../utils/test/mocks.utils.ts';
import { LumComponent, registerComponent } from './base-component.component.ts';

class TestElement extends LumComponent {
    static tagName = 'test-element';
}

describe('registerComponent', () => {
    beforeEach(() => {
        resetAllMocks();
    });

    it('should be a function', () => {
        strictEqual(typeof registerComponent, 'function', 'expected registerComponent to be a function');
    });

    it('should check customElements to make sure the element is defined', () => {
        registerComponent(TestElement);
        const mock: MockFunctionContext<Function> = getMockMethodContext('customElements', 'get');
        strictEqual(mock.callCount(), 1);
    });

    it('it should only define a custom element if it does not already exist', () => {
        registerComponent(TestElement);
        const mock: MockFunctionContext<Function> = getMockMethodContext('customElements', 'define');
        strictEqual(mock.callCount(), 1);
    });

    it('it should skip defining a custom element if it exists', () => {
        setMockMethodImpl('customElements', 'get', (_: string) => ({ connectedCallback: () => {} }));
        const mock: MockFunctionContext<Function> = getMockMethodContext('customElements', 'define');
        strictEqual(mock.callCount(), 0);
    });
});
