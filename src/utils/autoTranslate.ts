/**
 * Auto-translation client utility.
 *
 * Given an English UI string, returns its translation in the user's
 * current app language. Uses a 3-layer cache:
 *   1. In-memory map (per session)
 *   2. localStorage (per device, persists across reloads)
 *   3. Server cache + Lovable AI Gateway (translate-ui edge function)
 *
 * Usage in a component:
 *
 *   const text = useAutoTranslate('Loading awesome stuff…');
 *   return <p>{text}</p>;
 *
 *   // or imperative:
 *   const t = await translateText('Hello world', 'fr');
 */

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const MEMORY_CACHE = new Map<string, string>();          // key: `${lang}::${text}`
const PENDING = new Map<string, Promise<string>>();      // dedupe inflight
const LS_PREFIX = "sn_tr_v1::";

const isBrowser = typeof window !== "undefined";

function memKey(text: string, lang: string) {
  return `${lang}::${text}`;
}

function readLocal(text: string, lang: string): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(LS_PREFIX + memKey(text, lang));
  } catch {
    return null;
  }
}

function writeLocal(text: string, lang: string, value: string) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(LS_PREFIX + memKey(text, lang), value);
  } catch {
    // quota exceeded — silently ignore
  }
}

export async function translateText(text: string, lang: string): Promise<string> {
  const trimmed = (text ?? "").trim();
  if (!trimmed || lang === "en") return text;

  const k = memKey(trimmed, lang);
  if (MEMORY_CACHE.has(k)) return MEMORY_CACHE.get(k)!;

  const local = readLocal(trimmed, lang);
  if (local) {
    MEMORY_CACHE.set(k, local);
    return local;
  }

  if (PENDING.has(k)) return PENDING.get(k)!;

  const promise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("translate-ui", {
        body: { texts: [trimmed], target: lang },
      });
      if (error) throw error;
      const translated = (data?.translations?.[trimmed] as string) || text;
      MEMORY_CACHE.set(k, translated);
      writeLocal(trimmed, lang, translated);
      return translated;
    } catch (e) {
      console.warn("[autoTranslate] falling back to English:", e);
      return text;
    } finally {
      PENDING.delete(k);
    }
  })();

  PENDING.set(k, promise);
  return promise;
}

export async function translateBatch(texts: string[], lang: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const need: string[] = [];

  for (const raw of texts) {
    const t = (raw ?? "").trim();
    if (!t) { out[raw] = raw; continue; }
    if (lang === "en") { out[raw] = raw; continue; }
    const k = memKey(t, lang);
    if (MEMORY_CACHE.has(k)) { out[raw] = MEMORY_CACHE.get(k)!; continue; }
    const local = readLocal(t, lang);
    if (local) { MEMORY_CACHE.set(k, local); out[raw] = local; continue; }
    need.push(t);
  }

  if (need.length === 0) return out;

  try {
    const { data, error } = await supabase.functions.invoke("translate-ui", {
      body: { texts: need, target: lang },
    });
    if (error) throw error;
    const map = (data?.translations || {}) as Record<string, string>;
    for (const raw of texts) {
      if (out[raw] !== undefined) continue;
      const t = raw.trim();
      const translated = map[t] || raw;
      out[raw] = translated;
      MEMORY_CACHE.set(memKey(t, lang), translated);
      writeLocal(t, lang, translated);
    }
  } catch (e) {
    console.warn("[autoTranslate] batch fallback:", e);
    for (const raw of texts) if (out[raw] === undefined) out[raw] = raw;
  }
  return out;
}

/**
 * Reactively translate an English string to the user's current language.
 * Returns the original text immediately and updates once translation arrives.
 */
export function useAutoTranslate(text: string): string {
  const { currentLanguage } = useLanguage();
  const [value, setValue] = useState<string>(text);

  useEffect(() => {
    let cancelled = false;
    if (!text || currentLanguage === "en") {
      setValue(text);
      return;
    }
    translateText(text, currentLanguage).then((translated) => {
      if (!cancelled) setValue(translated);
    });
    return () => { cancelled = true; };
  }, [text, currentLanguage]);

  return value;
}
