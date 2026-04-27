const SCROLLABLE_SELECTOR = '[data-app-scroll-container]';
const SCROLL_TIME_CONSTANT_MS = 44;
const SCROLL_SETTLE_THRESHOLD_PX = 1;
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

function getMaxScrollTop(target: HTMLElement) {
  if (isDocumentScrollTarget(target)) {
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
    const visibleHeight = window.innerHeight || document.documentElement.clientHeight;
    return Math.max(scrollHeight - visibleHeight, 0);
  }

  return Math.max(target.scrollHeight - target.clientHeight, 0);
}

function getScrollDelta(key: string, target: HTMLElement) {
  const line = KEYBOARD_LINE_SCROLL_PX;
  const page = Math.max(getVisibleScrollHeight(target) * KEYBOARD_PAGE_SCROLL_RATIO, MIN_KEYBOARD_PAGE_SCROLL_PX);
  const currentTop = getCurrentScrollTop(target);

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
      return -currentTop;
    case 'End':
      return getMaxScrollTop(target) - currentTop;
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
  targetTop: number;
  lastFrameAt: number;
};

const activeScrolls = new WeakMap<HTMLElement, SmoothScrollState>();

function isDocumentScrollTarget(target: HTMLElement) {
  return target === document.documentElement || target === document.body || target === document.scrollingElement;
}

function getCurrentScrollTop(target: HTMLElement) {
  return isDocumentScrollTarget(target)
    ? (document.scrollingElement as HTMLElement | null)?.scrollTop ?? window.scrollY
    : target.scrollTop;
}

function setScrollTop(target: HTMLElement, top: number) {
  if (isDocumentScrollTarget(target)) {
    const scrollElement = (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
    scrollElement.scrollTop = top;
    document.body.scrollTop = top;
  } else {
    target.scrollTop = top;
  }
}

export function smoothScrollBy(target: HTMLElement, delta: number) {
  const maxTop = getMaxScrollTop(target);
  const currentTop = getCurrentScrollTop(target);
  const existing = activeScrolls.get(target);
  const targetTop = Math.max(0, Math.min((existing?.targetTop ?? currentTop) + delta, maxTop));

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    if (existing) cancelAnimationFrame(existing.animationFrame);
    activeScrolls.delete(target);
    setScrollTop(target, targetTop);
    return;
  }

  if (existing) {
    existing.targetTop = targetTop;
    return;
  }

  const state: SmoothScrollState = {
    animationFrame: 0,
    targetTop,
    lastFrameAt: performance.now(),
  };

  const step = (now: number) => {
    const elapsed = Math.max(now - state.lastFrameAt, 16);
    state.lastFrameAt = now;

    const latestMaxTop = getMaxScrollTop(target);
    state.targetTop = Math.max(0, Math.min(state.targetTop, latestMaxTop));

    const latestTop = getCurrentScrollTop(target);
    const distance = state.targetTop - latestTop;
    const alpha = 1 - Math.exp(-elapsed / SCROLL_TIME_CONSTANT_MS);
    const nextTop = Math.abs(distance) <= SCROLL_SETTLE_THRESHOLD_PX ? state.targetTop : latestTop + distance * alpha;
    setScrollTop(target, nextTop);

    if (Math.abs(state.targetTop - nextTop) > SCROLL_SETTLE_THRESHOLD_PX) {
      state.animationFrame = requestAnimationFrame(step);
      activeScrolls.set(target, state);
    } else {
      setScrollTop(target, state.targetTop);
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