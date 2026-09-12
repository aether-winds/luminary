import { ok } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { ShadowRoot } from '../../utils/test/browser.utils.ts';
import { createElement, generateRandomTagName } from '../../utils/test/helpers/component.helpers.ts';
import { registerComponent } from '../base-component/base-component.component.ts';
import { LumColorPickerElement } from './lum-color-scheme-picker.component.ts';


describe('LumColorPickerElement', () => {
    let element: LumColorPickerElement;

    beforeEach(async () => {
        const TAG_NAME = generateRandomTagName();

        registerComponent(class extends LumColorPickerElement {
            static tagName = TAG_NAME;
        });

        element = await createElement(TAG_NAME) as unknown as LumColorPickerElement;
    });

    it('should be an instance of HTMLElement', () => {
        ok(element instanceof HTMLElement);
    });

    it('should define a shadow root', () => {
        ok(element.shadowRoot instanceof ShadowRoot);
    });

    // TODO [Test] Create more tests for this component.
    // TODO [Plan] Start creating tickets for these items instead of sprinkling them all over the code.
});
