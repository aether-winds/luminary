import { mock, type Mock, type MockFunctionContext } from 'node:test';
import { customElements } from './mocks/browser.utils.ts';

const mocks: MockObjectRegistry = {
    'customElements': {
        'define': mock.method(customElements, 'define'),
        'get': mock.method(customElements, 'get'),
    }
};

setMockMethodImpl('customElements', 'define', (_: string, __: typeof HTMLElement) => true);
setMockMethodImpl('customElements', 'get', (_: string) => undefined);

export type MockMethod = Mock<Function>;
export type MockMethodRegistry = Record<string, NonNullable<MockMethod>>;
export type MockObjectRegistry = Record<string, NonNullable<MockMethodRegistry>>;

export function getMockMethodContext(object: string, method: string): MockFunctionContext<Function> {
    if (mocks && mocks[object] && mocks[object][method]) {
        return mocks[object][method].mock;
    }
    throw new Error('mock not found');
}

export function setMockMethodImpl(object: string, method: string, impl: Function): boolean {
    const m = getMockMethodContext(object, method);
    if (m) {
        m.mockImplementation(impl);
        return true;
    }
    return false;
}

export function resetAllMocks(): void {
    Object.values(mocks).forEach((registry: MockMethodRegistry) => {
        Object.values(registry).forEach((m: MockMethod) => {
            m.mock.resetCalls();
        });
    })
}

// export class MocksManager {
//     private mocks: Record<string, Mock<Function>>;

//     static manage(o: object, methods: Record<string, Function | null>): MocksManager {
//         using instance = new MocksManager(o, methods); // This is neat.
//         return instance;
//     }

//     constructor(o: object, methods: Record<string, Function | null>) {
//         this.mocks = Object.entries(methods).reduce(
//             (final: Record<string, Mock<Function>>, [ key, override ]: [ string, Function | null ]) => {
//                 const m = mock.method(o, key as unknown as never);
//                 if (override) (m as Mock<Function>).mock.mockImplementation(override);
//                 return { ...final, [key]: m };
//             }, {}
//         );
//     }

//     public resetMocks(): void {
//         Object.values(this.mocks).forEach((m: Mock<Function>) => m.mock.resetCalls());
//     }

//     public setReturnValueForMock<T>(m: string | Mock<Function>, returnValue: any): void {
//         if (typeof m === 'string') {
//             this.getMock(m)?.mock.mockImplementation((..._: unknown[]) => returnValue as unknown as T);
//         } else {
//             m.mock.mockImplementation((..._: unknown[]) => returnValue as unknown as T);
//         }
//     }

//     public getMock(key: string): Mock<Function> | undefined {
//         const mock = this.mocks[key];
//         return mock;
//     }

//     [Symbol.dispose]() {
//         Object.values(this.mocks).forEach((m: Mock<Function>) => m.mock.restore());
//     }
// }
