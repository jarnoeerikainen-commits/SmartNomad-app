const SCROLLABLE_SELECTOR = '[data-app-scroll-container]';

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

function getScrollDelta(key: string, target: HTMLElement) {
  const line = 72;
  const page = Math.max(target.clientHeight * 0.85, 240);

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

  const isDocumentTarget = target === document.documentElement || target === document.body || target === document.scrollingElement;
  const before = isDocumentTarget ? window.scrollY : target.scrollTop;

  if (isDocumentTarget) {
    window.scrollBy({ top: delta, behavior: 'auto' });
  } else {
    target.scrollBy({ top: delta, behavior: 'auto' });
  }

  const after = isDocumentTarget ? window.scrollY : target.scrollTop;
  if (after !== before) {
    event.preventDefault();
  }
}

export function installGlobalKeyboardScroll() {
  window.addEventListener('keydown', handleGlobalKeyboardScroll, { capture: true });
  return () => window.removeEventListener('keydown', handleGlobalKeyboardScroll, { capture: true });
}