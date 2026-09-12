import { document } from '../browser.utils.js';

let element: InstanceType<typeof HTMLElement>;

export async function createElement(tagName: string): Promise<InstanceType<typeof HTMLElement>> {
    element = document.createElement(tagName);
    document.body.append(element);

    return element;
}

export async function removeElement(): Promise<void> {
    document.body.removeChild(element);
}

export function generateRandomTagName(): string {
    // Not too proud to admit I pulled this off stack overflow.
    // Gets a random letter, then replaces the first char from a random uuid with that letter.
    // High likelihood of getting a unique tag name that is acceptable to browser define method.
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 6));
    return `${randomLetter}${crypto.randomUUID().slice(1)}`;
}
