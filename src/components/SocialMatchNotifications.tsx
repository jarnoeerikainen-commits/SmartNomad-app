import React, { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Shield } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { MATCH_POOL, MEGHAN_SPORTS_MATCHES, JOHN_SPORTS_MATCHES, MatchEntry } from '@/data/socialMatchProfiles';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

// Session-level storage keys
const SHOWN_IDS_KEY = 'supernomad_match_shown_ids';
const SHOWN_COUNTRIES_KEY = 'supernomad_match_shown_countries';
const SHOWN_PERSONA_SPORTS_KEY = 'supernomad_persona_sports_shown';

function getSessionSet(key: string): Set<string> {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveSessionSet(key: string, set: Set<string>) {
  try { sessionStorage.setItem(key, JSON.stringify([...set])); } catch {}
}

/**
 * Picks a match from the user's current country.
 * - Never repeats the same person in a session
 * - Never repeats the same country in a session
 * Returns null when no fresh match is available.
 */
function pickLocalMatch(
  pool: MatchEntry[],
  shownIds: Set<string>,
  shownCountries: Set<string>,
  userCity?: string,
  userCountryCode?: string,
): MatchEntry | null {
  if (!userCity && !userCountryCode) return null;

  const cityNorm = userCity?.toLowerCase().trim();
  const codeNorm = userCountryCode?.toUpperCase().trim();

  // Filter to same country, exclude already-shown IDs AND already-shown countries
  const candidates = pool.filter(m => {
    const matchCountry = m.countryCode.replace(/\d+$/, '').toUpperCase();
    if (matchCountry !== codeNorm) return false;
    if (shownIds.has(m.id)) return false;
    if (shownCountries.has(matchCountry)) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  // Prioritize same city
  const sameCity = cityNorm
    ? candidates.filter(m => m.city.toLowerCase().includes(cityNorm) || cityNorm.includes(m.city.toLowerCase()))
    : [];

  if (sameCity.length > 0) {
    return sameCity[Math.floor(Math.random() * sameCity.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

const SocialMatchNotifications: React.FC = () => {
  const shownIdsRef = useRef<Set<string>>(getSessionSet(SHOWN_IDS_KEY));
  const shownCountriesRef = useRef<Set<string>>(getSessionSet(SHOWN_COUNTRIES_KEY));
  const shownPersonaSportsRef = useRef<Set<string>>(getSessionSet(SHOWN_PERSONA_SPORTS_KEY));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationRef = useRef<{ city?: string; country_code?: string } | null>(null);
  const mountedRef = useRef(true);
  const { location } = useLocation();
  const { activePersona } = useDemoPersona();
  const personaRef = useRef(activePersona);

  // Run on published site OR when a demo persona is active (for testing)
  const isPublishedSite = typeof window !== 'undefined' && !window.location.hostname.includes('preview');
  const shouldRunNotifications = isPublishedSite || !!activePersona;

  // Keep refs up to date
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    personaRef.current = activePersona;
  }, [activePersona]);

  const speakNotification = useCallback((text: string) => {
    if ('speechSynthesis' in window && !speechSynthesis.speaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.8;
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
        || voices.find(v => v.lang.startsWith('en') && !v.localService)
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Stable ref-based function — never changes identity, reads location from ref
  const showNotification = useCallback(() => {
    const loc = locationRef.current;
    const persona = personaRef.current;
    let match: MatchEntry | null = null;

    // First priority: persona-specific sports matches (1 per session per persona)
    if (persona) {
      const sportsPool = persona.id === 'meghan' ? MEGHAN_SPORTS_MATCHES : persona.id === 'john' ? JOHN_SPORTS_MATCHES : [];
      const unseenSports = sportsPool.filter(m => !shownPersonaSportsRef.current.has(m.id));
      if (unseenSports.length > 0) {
        match = unseenSports[Math.floor(Math.random() * unseenSports.length)];
        shownPersonaSportsRef.current.add(match.id);
        saveSessionSet(SHOWN_PERSONA_SPORTS_KEY, shownPersonaSportsRef.current);
      }
    }

    // Fallback: regular location-based match
    if (!match) {
      match = pickLocalMatch(
        MATCH_POOL,
        shownIdsRef.current,
        shownCountriesRef.current,
        loc?.city,
        loc?.country_code,
      );
    }

    if (!match) return;

    // Record this person + country as shown
    shownIdsRef.current.add(match.id);
    const matchCountryNorm = match.countryCode.replace(/\d+$/, '').toUpperCase();
    shownCountriesRef.current.add(matchCountryNorm);
    saveSessionSet(SHOWN_IDS_KEY, shownIdsRef.current);
    saveSessionSet(SHOWN_COUNTRIES_KEY, shownCountriesRef.current);

    toast.custom(
      (id) => (
        <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-4 animate-in slide-in-from-top-5 duration-500">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img src={match.profile.avatar} alt={match.profile.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
              {match.profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
                  <Shield className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{match.activityEmoji}</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">New Match</span>
                <span className="text-xs text-muted-foreground ml-auto">{match.matchScore}% match</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug">
                {match.profile.name}, {match.profile.age} · {match.profile.profession}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {match.activity} in <span className="font-medium text-foreground">{match.city}</span> · {match.when}
              </p>
              <div className="flex gap-2 mt-2.5">
                <button
                  onClick={() => {
                    toast.dismiss(id);
                    toast.success(`Safe chat opened with ${match.profile.name} 💬`, {
                      description: 'AI-moderated · End-to-end encrypted · Verified identity',
                      duration: 4000,
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Safe Chat
                </button>
                <button onClick={() => toast.dismiss(id)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Later
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-1.5 flex items-center gap-1">
                <Shield className="h-2.5 w-2.5" />
                Verified & AI-Protected Community
              </p>
            </div>
          </div>
        </div>
      ),
      { duration: 12000, position: 'top-right' }
    );

    speakNotification(match.voiceMessage);
  }, [speakNotification]); // stable — no location dependency

  useEffect(() => {
    if (!shouldRunNotifications) return;
    mountedRef.current = true;

    // Demo persona: faster but controlled (60-90s between notifications, max 3 total in preview)
    const isDemoMode = !!personaRef.current && !isPublishedSite;
    let notifCount = 0;
    const maxDemoNotifs = 3;

    const scheduleNext = () => {
      if (!mountedRef.current) return;
      if (isDemoMode && notifCount >= maxDemoNotifs) return;
      const delay = isDemoMode
        ? 45000 + Math.random() * 30000  // 45-75s in demo
        : 180000 + Math.random() * 60000; // 180-240s on live
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          showNotification();
          notifCount++;
          scheduleNext();
        }
      }, delay);
    };

    const initialDelay = isDemoMode
      ? 15000 + Math.random() * 10000  // 15-25s in demo
      : 60000 + Math.random() * 30000; // 60-90s on live
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        showNotification();
        notifCount++;
        scheduleNext();
      }
    }, initialDelay);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldRunNotifications, activePersona?.id]); // re-run when persona changes

  return null;
};

export default SocialMatchNotifications;
