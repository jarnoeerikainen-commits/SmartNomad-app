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
  scrollable.scrollBy = vi.fn(({ top }: ScrollToOptions) => {
    scrollable.scrollTop += top ?? 0;
  });
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