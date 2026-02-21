import React, { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Shield } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { MATCH_POOL, MatchEntry } from '@/data/socialMatchProfiles';

// Session-level storage keys
const SHOWN_IDS_KEY = 'supernomad_match_shown_ids';
const SHOWN_COUNTRIES_KEY = 'supernomad_match_shown_countries';

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationRef = useRef<{ city?: string; country_code?: string } | null>(null);
  const mountedRef = useRef(true);
  const { location } = useLocation();

  // Only run on published site, not in the editor preview
  const isPublishedSite = typeof window !== 'undefined' && !window.location.hostname.includes('preview');

  // Keep location in a ref so the stable callback always reads the latest
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

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
    const match = pickLocalMatch(
      MATCH_POOL,
      shownIdsRef.current,
      shownCountriesRef.current,
      loc?.city,
      loc?.country_code,
    );

    if (!match) return; // No fresh match available

    // Record this person + country as shown — persist to sessionStorage
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
    if (!isPublishedSite) return;
    mountedRef.current = true;

    const scheduleNext = () => {
      if (!mountedRef.current) return;
      const delay = 180000 + Math.random() * 60000; // 180-240s
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          showNotification();
          scheduleNext();
        }
      }, delay);
    };

    const initialDelay = 60000 + Math.random() * 30000;
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        showNotification();
        scheduleNext();
      }
    }, initialDelay);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPublishedSite]); // showNotification removed — it's stable via refs

  return null;
};

export default SocialMatchNotifications;
