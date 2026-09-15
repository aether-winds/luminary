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

function getInput(element: LumColorPickerElement): HTMLInputElement {
    return element.shadowRoot!.querySelector('#color-scheme-picker') as HTMLInputElement;
}

function getSelectedSchemeLabel(element: LumColorPickerElement): Element {
    return element.shadowRoot!.querySelector('#selected-scheme') as Element;
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
            strictEqual(getInput(element).getAttribute('value'), '1');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'System');
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
            localStorage.setItem(PREF_KEY, '0');
            element = await createPicker();

            strictEqual(getInput(element).getAttribute('value'), '0');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'Dark');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'dark');
        });

        it('should restore "Light" when localStorage has the light value', async () => {
            localStorage.setItem(PREF_KEY, '2');
            element = await createPicker();

            strictEqual(getInput(element).getAttribute('value'), '2');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'Light');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light');
        });

        it('should fall back to "System" for any unrecognized stored value', async () => {
            localStorage.setItem(PREF_KEY, 'garbage');
            element = await createPicker();

            strictEqual(getInput(element).getAttribute('value'), '1');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'System');
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

        it('should render a range input bounded from 0 to 2', () => {
            const input = getInput(element);
            ok(input);
            strictEqual(input.getAttribute('type'), 'range');
            strictEqual(input.getAttribute('min'), '0');
            strictEqual(input.getAttribute('max'), '2');
            strictEqual(input.getAttribute('list'), 'color-scheme-options');
        });

        it('should render a datalist with dark, system, and light options', () => {
            const options = element.shadowRoot!.querySelectorAll('#color-scheme-options option');
            strictEqual(options.length, 3);
            strictEqual(options[0].getAttribute('value'), '0');
            strictEqual(options[0].getAttribute('label'), 'dark');
            strictEqual(options[1].getAttribute('value'), '1');
            strictEqual(options[1].getAttribute('label'), 'system');
            strictEqual(options[2].getAttribute('value'), '2');
            strictEqual(options[2].getAttribute('label'), 'light');
        });
    });

    describe('changing the picker value', () => {
        beforeEach(async () => {
            element = await createPicker();
        });

        it('should switch to "Dark": persist it, update the page scheme, and update the label', () => {
            changePickerValue(element, '0');

            strictEqual(localStorage.getItem(PREF_KEY), '0');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'dark');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'Dark');
        });

        it('should switch to "Light": persist it, update the page scheme, and update the label', () => {
            changePickerValue(element, '2');

            strictEqual(localStorage.getItem(PREF_KEY), '2');
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'Light');
        });

        it('should switch to "System": clear localStorage, update the page scheme, and update the label', () => {
            changePickerValue(element, '0');
            changePickerValue(element, '1');

            strictEqual(localStorage.getItem(PREF_KEY), null);
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'System');
        });

        it('should treat any unrecognized value as "System"', () => {
            changePickerValue(element, '0');
            changePickerValue(element, 'garbage');

            strictEqual(localStorage.getItem(PREF_KEY), null);
            strictEqual(document.documentElement.style.getPropertyValue('color-scheme'), 'light dark');
            strictEqual(getSelectedSchemeLabel(element).innerHTML, 'System');
        });

        it('should not update the input value attribute since it only reacts to the label span', () => {
            changePickerValue(element, '0');
            strictEqual(getInput(element).getAttribute('value'), '1');
        });
    });

    // TODO [Plan] Start creating tickets for these items instead of sprinkling them all over the code.
});
