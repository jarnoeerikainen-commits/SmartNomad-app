import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getKeyboardScrollTarget,
  handleGlobalKeyboardScroll,
  isKeyboardScrollKey,
  shouldIgnoreKeyboardScroll,
} from './globalKeyboardScroll';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeScrollable() {
  const scrollable = document.createElement('main');
  scrollable.dataset.appScrollContainer = 'true';
  Object.defineProperties(scrollable, {
    clientHeight: { value: 400, configurable: true },
    scrollHeight: { value: 1200, configurable: true },
  });
  scrollable.scrollTop = 0;
  const scrollByMock = vi.fn((options?: ScrollToOptions | number, y?: number) => {
    scrollable.scrollTop += typeof options === 'number' ? y ?? 0 : options?.top ?? 0;
  });
  scrollable.scrollBy = scrollByMock as typeof scrollable.scrollBy;
  document.body.appendChild(scrollable);
  return scrollable;
}

describe('globalKeyboardScroll', () => {
  it('recognizes all document scrolling keys', () => {
    expect(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].every(isKeyboardScrollKey)).toBe(true);
    expect(isKeyboardScrollKey('Enter')).toBe(false);
  });

  it('uses the app scroll container as the fallback target', () => {
    const scrollable = makeScrollable();
    expect(getKeyboardScrollTarget(document.body)).toBe(scrollable);
  });

  it('falls back to document scrolling when the app container cannot scroll', () => {
    const container = document.createElement('main');
    container.dataset.appScrollContainer = 'true';
    Object.defineProperties(container, {
      clientHeight: { value: 400, configurable: true },
      scrollHeight: { value: 400, configurable: true },
    });
    document.body.appendChild(container);

    expect(getKeyboardScrollTarget(document.body)).toBe(document.scrollingElement);
  });

  it('scrolls down with ArrowDown and prevents browser conflicts', () => {
    const scrollable = makeScrollable();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: document.body });

    handleGlobalKeyboardScroll(event);

    expect(scrollable.scrollTop).toBe(72);
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not steal arrow keys from text inputs or interactive roles', () => {
    const input = document.createElement('input');
    const slider = document.createElement('div');
    slider.setAttribute('role', 'slider');

    expect(shouldIgnoreKeyboardScroll(input)).toBe(true);
    expect(shouldIgnoreKeyboardScroll(slider)).toBe(true);
  });
});