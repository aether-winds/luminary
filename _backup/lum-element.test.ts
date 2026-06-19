import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { LumElement } from './index';

class TestLumElement extends LumElement {
  static get observedAttributes(): string[] {
    return ['active', 'count', 'label'];
  }

  public setActive(value: boolean): void {
    this.setBooleanAttribute('active', value);
  }

  public getActive(): boolean {
    return this.getBooleanAttribute('active');
  }

  public setCount(value: number | null | undefined): void {
    this.setNumberAttribute('count', value);
  }

  public getCount(): number {
    return this.getNumberAttribute('count', 12);
  }

  public setLabel(value: string | null | undefined): void {
    this.setStringAttribute('label', value);
  }

  public getLabel(): string {
    return this.getStringAttribute('label', 'fallback');
  }

  public setAccessibleState(value: boolean | null | undefined): void {
    this.syncAriaBoolean('expanded', value);
  }

  public setAccessibleLabel(value: string | null | undefined): void {
    this.syncAriaString('label', value);
  }

  public renderContent(): void {
    this.renderShadow('<span>ready</span>', ':host { display: block; }');
  }

  public emitSampleEvent(): boolean {
    return this.emitLumEvent('sample', { ok: true });
  }

  public exposeTabIndex(value: number | null | undefined): void {
    this.setTabIndex(value);
  }

  public exposeRole(value: string | null | undefined): void {
    this.setRole(value);
  }
}

const tagName = 'test-lum-element';

beforeAll(() => {
  TestLumElement.define(tagName);
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('LumElement', () => {
  it('attaches an open shadow root during construction', () => {
    const element = document.createElement(tagName) as TestLumElement;

    expect(element.shadowRoot).toBeInstanceOf(ShadowRoot);
    expect(element.shadowRoot?.mode).toBe('open');
  });

  it('reflects common attribute and aria helpers', () => {
    const element = document.createElement(tagName) as TestLumElement;

    element.setActive(true);
    element.setCount(4);
    element.setLabel('Primary');
    element.setAccessibleState(true);
    element.setAccessibleLabel('Launch');
    element.exposeTabIndex(0);
    element.exposeRole('button');

    expect(element.getActive()).toBe(true);
    expect(element.getCount()).toBe(4);
    expect(element.getLabel()).toBe('Primary');
    expect(element.getAttribute('aria-expanded')).toBe('true');
    expect(element.getAttribute('aria-label')).toBe('Launch');
    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.getAttribute('role')).toBe('button');

    element.setActive(false);
    element.setCount(null);
    element.setLabel('');
    element.setAccessibleState(null);
    element.setAccessibleLabel(null);
    element.exposeTabIndex(null);
    element.exposeRole(null);

    expect(element.hasAttribute('active')).toBe(false);
    expect(element.getCount()).toBe(12);
    expect(element.getLabel()).toBe('fallback');
    expect(element.hasAttribute('aria-expanded')).toBe(false);
    expect(element.hasAttribute('aria-label')).toBe(false);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(element.hasAttribute('role')).toBe(false);
  });

  it('renders shadow content and dispatches lum events', () => {
    const element = document.createElement(tagName) as TestLumElement;
    const events: Array<CustomEvent<{ ok: boolean }>> = [];

    element.addEventListener('lum-sample', (event) => {
      events.push(event as CustomEvent<{ ok: boolean }>);
    });

    element.renderContent();

    expect(element.shadowRoot?.querySelector('style')?.textContent).toContain(':host { display: block; }');
    expect(element.shadowRoot?.querySelector('span')?.textContent).toBe('ready');

    expect(element.emitSampleEvent()).toBe(true);
    expect(events).toHaveLength(1);
    expect(events[0].detail).toEqual({ ok: true });
    expect(events[0].bubbles).toBe(true);
    expect(events[0].composed).toBe(true);
  });

  it('defines subclasses only once', () => {
    const uniqueTag = 'test-lum-element-define';

    class AnotherTestLumElement extends LumElement {}

    AnotherTestLumElement.define(uniqueTag);
    AnotherTestLumElement.define(uniqueTag);

    expect(customElements.get(uniqueTag)).toBe(AnotherTestLumElement);
  });
});
