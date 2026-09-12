import { mock, type Mock } from 'node:test';
import { type LumMock } from './mock.type.js';

export class CSSStyleSheet {
    constructor() {}
    public replaceSync = mock.fn((_: string) => void {})
}
