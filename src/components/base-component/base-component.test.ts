import { strictEqual } from 'node:assert';
import { afterEach, describe, it, type Mock, type MockFunctionContext } from 'node:test';
import { mockCustomElements } from '../../utils/test/mocks.utils.ts';
import { LumComponent, registerComponent } from './base-component.component.ts';

class TestElement extends LumComponent {
    static tagName = 'test-element';
}

describe('base-component', () => {
    describe('registerComponent', () => {
        afterEach(() => {
            mockCustomElements.reset();
            mockCustomElements.restore();
        });

        it('should be a function', () => {
            strictEqual(typeof registerComponent, 'function', 'expected registerComponent to be a function');
        });

        it('should check customElements to make sure the element is defined', () => {
            const mock: MockFunctionContext<Function> = (mockCustomElements.mocked.get as unknown as Mock<Function>).mock;

            registerComponent(TestElement);
            strictEqual(mock.callCount(), 1);
        });

        it('it should only define a custom element if it does not already exist', () => {
            const elTagName: string = crypto.randomUUID();
            TestElement.tagName = elTagName;
            const mock: MockFunctionContext<Function> = (mockCustomElements.mocked.define as unknown as Mock<Function>).mock;

            registerComponent(TestElement);
            strictEqual(mock.callCount(), 1);
        });

        it('it should skip defining a custom element if it exists', () => {
            const mock: MockFunctionContext<Function> = (mockCustomElements.mocked.define as unknown as Mock<Function>).mock;

            mock.mockImplementation((_: string) => ({ connectedCallback: () => {} }));
            strictEqual(mock.callCount(), 0);
        });
    });

    describe(
        'LumComponent',
        {
            skip: true,
            todo: 'TODO [Test] Need to figure out how to test this as we can\'t instantiate the component'
        },
        () => {}
    );
});
