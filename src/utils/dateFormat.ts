import {
  format as dateFnsFormat,
  formatDistanceToNow as dateFnsFormatDistanceToNow,
  type FormatDistanceToNowOptions,
} from 'date-fns';
import {
  enUS, es, pt, zhCN, fr, de, ar, ja, it, ko, hi, ru, tr,
  type Locale,
} from 'date-fns/locale';

// Map app language codes to date-fns locales
const localeMap: Record<string, Locale> = {
  en: enUS,
  es: es,
  pt: pt,
  zh: zhCN,
  fr: fr,
  de: de,
  ar: ar,
  ja: ja,
  it: it,
  ko: ko,
  hi: hi,
  ru: ru,
  tr: tr,
};

/**
 * Get the current app language from localStorage.
 * Falls back to 'en' if not set.
 */
function getAppLanguage(): string {
  try {
    return localStorage.getItem('supernomad_language') || 'en';
  } catch {
    return 'en';
  }
}

function getLocale(lang?: string): Locale {
  const code = lang || getAppLanguage();
  return localeMap[code] || enUS;
}

// ── Public API ──────────────────────────────────────────────

/**
 * Standard full date: "3 Apr 2026" (d MMM yyyy)
 * Unambiguous worldwide — matches passport / airline / financial standard.
 */
export function formatDate(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'd MMM yyyy', { locale: getLocale(lang) });
}

/**
 * Date with weekday: "Thu, 3 Apr 2026"
 */
export function formatDateWithDay(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'EEE, d MMM yyyy', { locale: getLocale(lang) });
}

/**
 * Month + year only: "Apr 2026"
 */
export function formatMonthYear(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'MMM yyyy', { locale: getLocale(lang) });
}

/**
 * Full month name + year: "April 2026" — for calendar headers
 */
export function formatFullMonthYear(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'MMMM yyyy', { locale: getLocale(lang) });
}

/**
 * Day number only: "3" — for calendar grids
 */
export function formatDayNumber(date: Date | string | number): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'd');
}

/**
 * Short month only: "Apr"
 */
export function formatShortMonth(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'MMM', { locale: getLocale(lang) });
}

/**
 * Time only: "14:30" (24h) — used in chat timestamps
 */
export function formatTime(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'HH:mm', { locale: getLocale(lang) });
}

/**
 * Date range: "3 Apr 2026 – 10 Apr 2026"
 */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number | null | undefined,
  lang?: string
): string {
  const s = formatDate(start, lang);
  if (!end) return s;
  return `${s} – ${formatDate(end, lang)}`;
}

/**
 * ISO date for data attributes / internal use: "2026-04-03"
 */
export function formatISO(date: Date | string | number): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'yyyy-MM-dd');
}

/**
 * Relative time: "2 hours ago", "3 days ago" — localized
 */
export function formatRelative(
  date: Date | string | number,
  lang?: string,
  options?: Omit<FormatDistanceToNowOptions, 'locale'>
): string {
  const d = normalizeDate(date);
  return dateFnsFormatDistanceToNow(d, {
    addSuffix: true,
    locale: getLocale(lang),
    ...options,
  });
}

/**
 * Smart format: shows relative for recent, absolute for older
 * < 24h  → "2 hours ago"
 * < 7d   → "3 days ago"  
 * older  → "3 Apr 2026"
 */
export function formatSmart(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 24) return formatRelative(d, lang);
  if (diffDays < 7) return formatRelative(d, lang);
  return formatDate(d, lang);
}

/**
 * For Schengen/visa display — long readable date: "3 April 2026"
 */
export function formatLongDate(date: Date | string | number, lang?: string): string {
  const d = normalizeDate(date);
  return dateFnsFormat(d, 'd MMMM yyyy', { locale: getLocale(lang) });
}

// ── Internal ────────────────────────────────────────────────

function normalizeDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);
  return new Date(date);
}
