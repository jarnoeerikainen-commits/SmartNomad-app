const SCROLLABLE_SELECTOR = '[data-app-scroll-container]';
const SCROLL_ANIMATION_MS = 180;
const KEYBOARD_LINE_SCROLL_PX = 72;
const KEYBOARD_PAGE_SCROLL_RATIO = 0.85;
const MIN_KEYBOARD_PAGE_SCROLL_PX = 240;

const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);

const interactiveRoles = new Set([
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menuitem',
  'option',
  'radio',
  'scrollbar',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'tree',
  'treeitem',
]);

export function isKeyboardScrollKey(key: string) {
  return scrollKeys.has(key);
}

export function shouldIgnoreKeyboardScroll(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  const editable = target.closest(
    'input, textarea, select, [contenteditable="true"], [contenteditable=""], [data-keyboard-scroll-ignore]'
  );
  if (editable) return true;

  const roleElement = target.closest('[role]');
  const role = roleElement?.getAttribute('role');
  return role ? interactiveRoles.has(role) : false;
}

function canScroll(element: Element) {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  return /(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight;
}

function findScrollableAncestor(start: Element | null) {
  let current = start;
  while (current && current !== document.documentElement) {
    if (canScroll(current)) return current as HTMLElement;
    current = current.parentElement;
  }
  return null;
}

export function getKeyboardScrollTarget(target: EventTarget | null) {
  const element = target instanceof Element ? target : document.activeElement;
  const appContainer = document.querySelector(SCROLLABLE_SELECTOR);

  return (
    findScrollableAncestor(element) ??
    (appContainer && canScroll(appContainer) ? (appContainer as HTMLElement) : null) ??
    (document.scrollingElement as HTMLElement | null) ??
    document.documentElement
  );
}

function getVisibleScrollHeight(target: HTMLElement) {
  return isDocumentScrollTarget(target) ? window.innerHeight || target.clientHeight : target.clientHeight;
}

function getScrollDelta(key: string, target: HTMLElement) {
  const line = KEYBOARD_LINE_SCROLL_PX;
  const page = Math.max(getVisibleScrollHeight(target) * KEYBOARD_PAGE_SCROLL_RATIO, MIN_KEYBOARD_PAGE_SCROLL_PX);

  switch (key) {
    case 'ArrowDown':
      return line;
    case 'ArrowUp':
      return -line;
    case 'PageDown':
      return page;
    case 'PageUp':
      return -page;
    case 'Home':
      return -target.scrollTop;
    case 'End':
      return target.scrollHeight - target.clientHeight - target.scrollTop;
    default:
      return 0;
  }
}

export function handleGlobalKeyboardScroll(event: KeyboardEvent) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    !isKeyboardScrollKey(event.key) ||
    shouldIgnoreKeyboardScroll(event.target)
  ) {
    return;
  }

  const target = getKeyboardScrollTarget(event.target);
  const delta = getScrollDelta(event.key, target);
  if (!delta) return;

  event.preventDefault();
  smoothScrollBy(target, delta);
}

type SmoothScrollState = {
  animationFrame: number;
  startedAt: number;
  startTop: number;
  targetTop: number;
};

const activeScrolls = new WeakMap<HTMLElement, SmoothScrollState>();

function isDocumentScrollTarget(target: HTMLElement) {
  return target === document.documentElement || target === document.body || target === document.scrollingElement;
}

function getCurrentScrollTop(target: HTMLElement) {
  return isDocumentScrollTarget(target) ? window.scrollY : target.scrollTop;
}

function setScrollTop(target: HTMLElement, top: number) {
  if (isDocumentScrollTarget(target)) {
    window.scrollTo({ top, behavior: 'auto' });
  } else {
    target.scrollTop = top;
  }
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function smoothScrollBy(target: HTMLElement, delta: number) {
  const maxTop = Math.max(target.scrollHeight - target.clientHeight, 0);
  const currentTop = getCurrentScrollTop(target);
  const existing = activeScrolls.get(target);
  const targetTop = Math.max(0, Math.min((existing?.targetTop ?? currentTop) + delta, maxTop));

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    if (existing) cancelAnimationFrame(existing.animationFrame);
    activeScrolls.delete(target);
    setScrollTop(target, targetTop);
    return;
  }

  if (existing) cancelAnimationFrame(existing.animationFrame);

  const state: SmoothScrollState = {
    animationFrame: 0,
    startedAt: performance.now(),
    startTop: currentTop,
    targetTop,
  };

  const step = (now: number) => {
    const progress = Math.min((now - state.startedAt) / SCROLL_ANIMATION_MS, 1);
    const nextTop = state.startTop + (state.targetTop - state.startTop) * easeOutCubic(progress);
    setScrollTop(target, nextTop);

    if (progress < 1) {
      state.animationFrame = requestAnimationFrame(step);
      activeScrolls.set(target, state);
    } else {
      activeScrolls.delete(target);
    }
  };

  state.animationFrame = requestAnimationFrame(step);
  activeScrolls.set(target, state);
}

export function immediateScrollBy(target: HTMLElement, delta: number) {
  const maxTop = Math.max(target.scrollHeight - target.clientHeight, 0);
  const currentTop = getCurrentScrollTop(target);
  setScrollTop(target, Math.max(0, Math.min(currentTop + delta, maxTop)));
}

export function installGlobalKeyboardScroll() {
  window.addEventListener('keydown', handleGlobalKeyboardScroll, { capture: true });
  return () => window.removeEventListener('keydown', handleGlobalKeyboardScroll, { capture: true });
}