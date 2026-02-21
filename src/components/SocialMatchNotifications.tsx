import React, { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Shield } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { MATCH_POOL, MatchEntry } from '@/data/socialMatchProfiles';

/**
 * Picks a match ONLY from the user's current city/country.
 * Returns null if no match is available for the location.
 */
function pickLocalMatch(
  pool: MatchEntry[],
  shownIds: Set<string>,
  lastId: string | null,
  userCity?: string,
  userCountryCode?: string,
): MatchEntry | null {
  if (!userCity && !userCountryCode) return null;

  const cityNorm = userCity?.toLowerCase().trim();
  const codeNorm = userCountryCode?.toUpperCase().trim();

  // Strict filter: only same country matches
  const localPool = pool.filter(m => {
    const matchCountry = m.countryCode.replace(/\d+$/, '').toUpperCase(); // handle IT2, ES2 etc.
    return matchCountry === codeNorm;
  });

  if (localPool.length === 0) return null;

  // Prefer unseen, and always exclude last shown to avoid back-to-back repeats
  const unseen = localPool.filter(m => !shownIds.has(m.id) && m.id !== lastId);
  const noRepeat = localPool.filter(m => m.id !== lastId);
  const candidates = unseen.length > 0 ? unseen : (noRepeat.length > 0 ? noRepeat : localPool);

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
  const shownRef = useRef<Set<string>>(new Set());
  const lastIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { location } = useLocation();

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

  const showNotification = useCallback(() => {
    const match = pickLocalMatch(
      MATCH_POOL,
      shownRef.current,
      lastIdRef.current,
      location?.city,
      location?.country_code,
    );

    // Only show if we have a local match
    if (!match) return;

    shownRef.current.add(match.id);
    lastIdRef.current = match.id;
    // Don't clear shownRef — never repeat a match in the same session

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
  }, [speakNotification, location]);

  useEffect(() => {
    // First notification after 60-90s, then every 180-240s
    const initialDelay = 60000 + Math.random() * 30000;

    const scheduleNext = () => {
      const delay = 180000 + Math.random() * 60000; // 180-240s
      timerRef.current = setTimeout(() => {
        showNotification();
        scheduleNext();
      }, delay);
    };

    timerRef.current = setTimeout(() => {
      showNotification();
      scheduleNext();
    }, initialDelay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showNotification]);

  return null;
};

export default SocialMatchNotifications;
