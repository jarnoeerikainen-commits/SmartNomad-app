import { useEffect } from 'react';
import { installGlobalKeyboardScroll } from '@/utils/globalKeyboardScroll';

export function GlobalKeyboardScroll() {
  useEffect(() => installGlobalKeyboardScroll(), []);
  return null;
}