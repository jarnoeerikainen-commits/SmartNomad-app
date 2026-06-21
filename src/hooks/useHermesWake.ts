// ═══════════════════════════════════════════════════════════════════════════
// useHermesWake — auto-wakes Hermes when:
//   • a demo persona opens the app or changes route
//   • an admin lands on /admin pages
//   • a critical signal anomaly is detected (passed via opts.signals)
// Cached per-session for 5 min to avoid request floods.
// Result is exposed via the `lastBriefing` state so any UI can subscribe.
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "hermes_wake_cache_v1";
const TTL_MS = 5 * 60 * 1000;

interface HermesBriefing {
  dispatch: string;
  source: string;
  ts: number;
  trigger: string;
}

interface WakeOptions {
  isDemo?: boolean;
  persona?: string | null;
  signals?: Record<string, unknown>;
  enabled?: boolean;
}

function readCache(): HermesBriefing | null {
  try {
    // localStorage so wake survives new tabs/refresh (was sessionStorage)
    const raw = localStorage.getItem(CACHE_KEY) ?? sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as HermesBriefing;
    if (Date.now() - b.ts > TTL_MS) return null;
    return b;
  } catch { return null; }
}

function writeCache(b: HermesBriefing) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(b)); } catch { /* noop */ }
}

export function useHermesWake(opts: WakeOptions = {}) {
  const { isDemo = false, persona = null, signals = {}, enabled = true } = opts;
  const location = useLocation();
  const lastFiredRef = useRef<string>("");
  const [lastBriefing, setLastBriefing] = useState<HermesBriefing | null>(() => readCache());
  const [isWaking, setIsWaking] = useState(false);

  const wake = useCallback(async (trigger: string, snapshot: Record<string, unknown> = {}) => {
    if (!enabled) return;
    const cached = readCache();
    if (cached && trigger !== "manual" && trigger !== "anomaly") {
      setLastBriefing(cached);
      return;
    }
    setIsWaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-hermes", {
        body: {
          mode: "briefing",
          snapshot: {
            ...snapshot,
            ...signals,
            persona: persona ?? "guest",
            route: location.pathname,
            is_demo: isDemo,
            trigger,
          },
        },
      });
      if (error) throw error;
      const briefing: HermesBriefing = {
        dispatch: (data as any)?.dispatch ?? "",
        source: (data as any)?.source ?? "unknown",
        ts: Date.now(),
        trigger,
      };
      writeCache(briefing);
      setLastBriefing(briefing);
    } catch {
      // silent — never break user flow if Hermes is down
    } finally {
      setIsWaking(false);
    }
  }, [enabled, isDemo, persona, signals, location.pathname]);

  // Wake on route changes (debounced via cache TTL)
  useEffect(() => {
    if (!enabled) return;
    const key = `${location.pathname}:${persona ?? "guest"}`;
    if (lastFiredRef.current === key) return;
    lastFiredRef.current = key;

    const isAdmin = location.pathname.startsWith("/admin");
    const trigger = isAdmin ? "admin-route" : isDemo ? "demo-activity" : "user-activity";

    // Only fire for demo personas, admin pages, or when signals indicate anomaly
    const hasAnomaly = Object.values(signals).some(v =>
      typeof v === "number" ? v > 0 : typeof v === "boolean" ? v : false
    );
    if (isDemo || isAdmin || hasAnomaly) {
      const id = setTimeout(() => wake(trigger), 400);
      return () => clearTimeout(id);
    }
  }, [location.pathname, isDemo, persona, enabled, signals, wake]);

  return { lastBriefing, isWaking, wake };
}
