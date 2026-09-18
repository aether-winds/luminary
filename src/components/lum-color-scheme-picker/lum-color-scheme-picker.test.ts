import { ok, strictEqual } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { document, ShadowRoot } from '../../utils/test/browser.utils.ts';
import { createElement, generateRandomTagName, removeElement } from '../../utils/test/helpers/component.helpers.ts';
import { registerComponent } from '../base-component/base-component.component.ts';
import { LumColorPickerElement } from './lum-color-scheme-picker.component.ts';

const PREF_KEY = 'userPreference.color.scheme';

async function createPicker(): Promise<LumColorPickerElement> {
    const TAG_NAME = generateRandomTagName();

    registerComponent(class extends LumColorPickerElement {
        static tagName = TAG_NAME;
    });

    return await createElement(TAG_NAME) as unknown as LumColorPickerElement;
}

function getInput(element: LumColorPickerElement): HTMLSelectElement {
    return element.shadowRoot!.querySelector('#color-scheme-picker') as HTMLSelectElement;
}

function getInputSelectedOption(element: LumColorPickerElement): HTMLOptionElement {
    return element.shadowRoot!.querySelector('#color-scheme-picker option:checked') as HTMLOptionElement;
}

function changePickerValue(element: LumColorPickerElement, value: string): void {
    const input = getInput(element);
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('LumColorPickerElement', () => {
    let element: LumColorPickerElement;

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.style.removeProperty('color-scheme');
    });

    afterEach(async () => {
        await removeElement();
        localStorage.clear();
        document.documentElement.style.removeProperty('color-scheme');
    });

    describe('defaults', () => {
        beforeEach(async () => {
            element = await createPicker();
        });

        it('should be an instance of HTMLElement', () => {
            ok(element instanceof HTMLElement);
        });

        it('should define a shadow root', () => {
            ok(element.shadowRoot instanceof ShadowRoot);
        });

        it('should default to the "System" scheme when nothing is stored', () => {
            strictEqual(getInputSelectedOption(element).getAttribute('value'), 'light dark');
        });

        it('should set the page color-scheme to "light dark" by default', () => {
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
        });

        it('should not persist anything to localStorage by default', () => {
            strictEqual(localStorage.getItem(PREF_KEY), null);
        });
    });

    describe('restoring a stored preference', () => {
        it('should restore "Dark" when localStorage has the dark value', async () => {
            localStorage.setItem(PREF_KEY, 'dark');
            element = await createPicker();

            strictEqual(getInputSelectedOption(element).getAttribute('value'), 'dark');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'dark');
        });

        it('should restore "Light" when localStorage has the light value', async () => {
            localStorage.setItem(PREF_KEY, 'light');
            element = await createPicker();

            strictEqual(getInputSelectedOption(element).getAttribute('value'), 'light');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light');
        });

        it('should fall back to "System" for any unrecognized stored value', async () => {
            localStorage.setItem(PREF_KEY, 'garbage');
            element = await createPicker();

            strictEqual(getInputSelectedOption(element).getAttribute('value'), 'light dark');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
        });
    });

    describe('rendered markup', () => {
        beforeEach(async () => {
            element = await createPicker();
        });

        it('should render a label for the picker', () => {
            const label = element.shadowRoot!.querySelector('label');
            ok(label);
            strictEqual(label!.getAttribute('for'), 'color-scheme-picker');
            strictEqual(label!.textContent, 'Choose Color Scheme');
        });
    });

    describe('changing the picker value', () => {
        beforeEach(async () => {
            element = await createPicker();
        });

        it('should switch to "Dark": persist it, and update the page scheme', () => {
            changePickerValue(element, 'dark');

            strictEqual(localStorage.getItem(PREF_KEY), 'dark');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'dark');
        });

        it('should switch to "Light": persist it, and update the page scheme', () => {
            changePickerValue(element, 'light');

            strictEqual(localStorage.getItem(PREF_KEY), 'light');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light');
        });

        it('should switch to "System": clear localStorage, and update the page scheme', () => {
            changePickerValue(element, 'light dark');

            strictEqual(localStorage.getItem(PREF_KEY), null);
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
        });

        it('should treat any unrecognized value as "System"', () => {
            changePickerValue(element, '0');
            changePickerValue(element, 'garbage');

            strictEqual(localStorage.getItem(PREF_KEY), null);
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
        });
    });
});
