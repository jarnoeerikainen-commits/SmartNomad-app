import React, { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Shield } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';

interface MatchProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  profession: string;
  verified: boolean;
}

interface MatchNotification {
  id: string;
  activity: string;
  activityEmoji: string;
  city: string;
  country: string;
  countryCode: string;
  when: string;
  profile: MatchProfile;
  matchScore: number;
  commonInterests: string[];
  message: string;
  voiceMessage: string;
}

// Large pool of matches tagged by city/country for contextual filtering
const MATCH_POOL: MatchNotification[] = [
  // --- Italy ---
  { id: 'run-milano', activity: 'Morning Run', activityEmoji: '🏃‍♀️', city: 'Milano', country: 'Italy', countryCode: 'IT', when: 'Saturday 7:00 AM',
    profile: { name: 'Sofia R.', age: 29, gender: 'female', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', profession: 'UX Designer', verified: true },
    matchScore: 94, commonInterests: ['5K runs', 'coffee after'],
    message: '🏃‍♀️ Perfect match! Sofia R. (29, UX Designer) also runs Saturday mornings in Milano — Parco Sempione at 7 AM. 94% match!',
    voiceMessage: 'Great news! Sofia, a 29-year-old UX Designer, also runs Saturday mornings in Milano at Parco Sempione. 94% match!' },
  { id: 'aperitivo-roma', activity: 'Aperitivo Evening', activityEmoji: '🍷', city: 'Rome', country: 'Italy', countryCode: 'IT', when: 'Friday 7:30 PM',
    profile: { name: 'Luca M.', age: 33, gender: 'male', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', profession: 'Film Producer', verified: true },
    matchScore: 89, commonInterests: ['rooftop bars', 'Italian wine'],
    message: '🍷 Aperitivo match! Luca M. (33, Film Producer) hosts rooftop aperitivos in Trastevere every Friday. 89% match!',
    voiceMessage: 'Luca, a Film Producer in Rome, hosts rooftop aperitivos in Trastevere every Friday evening. 89% match!' },

  // --- Spain ---
  { id: 'bike-mallorca', activity: 'Road Cycling', activityEmoji: '🚴', city: 'Mallorca', country: 'Spain', countryCode: 'ES', when: 'Sunday 8:30 AM',
    profile: { name: 'Marcus T.', age: 34, gender: 'male', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', profession: 'Startup Founder', verified: true },
    matchScore: 91, commonInterests: ['road cycling', 'Cap de Formentor route'],
    message: '🚴 Biking buddy found! Marcus T. (34, Startup Founder) is cycling Cap de Formentor in Mallorca this Sunday. 91% match!',
    voiceMessage: 'Marcus, a Startup Founder, is cycling Cap de Formentor in Mallorca this Sunday morning. 91% match!' },
  { id: 'football-barcelona', activity: 'Football Match', activityEmoji: '⚽', city: 'Barcelona', country: 'Spain', countryCode: 'ES', when: 'Saturday 9:00 PM',
    profile: { name: 'Carlos D.', age: 36, gender: 'male', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', profession: 'Architect', verified: true },
    matchScore: 89, commonInterests: ['FC Barcelona', 'Camp Nou'],
    message: '⚽ Match day buddy! Carlos D. (36, Architect) has an extra ticket for Barça at Camp Nou this Saturday. 89% match!',
    voiceMessage: 'Carlos, an Architect, has an extra ticket for the Barcelona match at Camp Nou this Saturday night. 89% match!' },

  // --- Singapore ---
  { id: 'tennis-singapore', activity: 'Tennis Watching', activityEmoji: '🎾', city: 'Singapore', country: 'Singapore', countryCode: 'SG', when: 'Saturday 6:00 PM',
    profile: { name: 'Priya K.', age: 31, gender: 'female', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', profession: 'Fintech PM', verified: true },
    matchScore: 88, commonInterests: ['WTA Finals', 'Marina Bay area'],
    message: '🎾 Tennis fan match! Priya K. (31, Fintech PM) wants to watch the WTA Finals in Singapore this Saturday. 88% match!',
    voiceMessage: 'Priya, a Fintech Product Manager, is looking for someone to watch the WTA Finals in Singapore this Saturday. 88% match!' },

  // --- Indonesia / Bali ---
  { id: 'surf-bali', activity: 'Surfing', activityEmoji: '🏄‍♂️', city: 'Canggu', country: 'Indonesia', countryCode: 'ID', when: 'Tomorrow 6:00 AM',
    profile: { name: 'Jake W.', age: 27, gender: 'male', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', profession: 'Content Creator', verified: true },
    matchScore: 96, commonInterests: ['dawn patrol', 'intermediate level'],
    message: '🏄‍♂️ Surf buddy alert! Jake W. (27, Content Creator) is hitting the waves in Canggu tomorrow at dawn. 96% match!',
    voiceMessage: 'Jake, a Content Creator, is surfing in Canggu tomorrow at dawn. You both surf at intermediate level. 96% match!' },

  // --- Portugal ---
  { id: 'yoga-lisbon', activity: 'Sunset Yoga', activityEmoji: '🧘‍♀️', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', when: 'Friday 6:30 PM',
    profile: { name: 'Elena M.', age: 33, gender: 'female', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', profession: 'Digital Nomad Coach', verified: true },
    matchScore: 92, commonInterests: ['vinyasa flow', 'rooftop sessions'],
    message: '🧘‍♀️ Yoga match! Elena M. (33, Digital Nomad Coach) hosts sunset yoga on Lisbon rooftops every Friday. 92% match!',
    voiceMessage: 'Elena, a Digital Nomad Coach, hosts sunset yoga on Lisbon rooftops every Friday evening. 92% match!' },

  // --- South Africa ---
  { id: 'hiking-cape-town', activity: 'Table Mountain Hike', activityEmoji: '🥾', city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', when: 'Sunday 7:00 AM',
    profile: { name: 'Amara N.', age: 28, gender: 'female', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', profession: 'Wildlife Photographer', verified: true },
    matchScore: 93, commonInterests: ['sunrise hikes', 'photography'],
    message: '🥾 Hiking match! Amara N. (28, Wildlife Photographer) is hiking Table Mountain at sunrise this Sunday. 93% match!',
    voiceMessage: 'Amara, a Wildlife Photographer, is hiking Table Mountain at sunrise this Sunday. You both love photography. 93% match!' },

  // --- Monaco ---
  { id: 'f1-monaco', activity: 'F1 Grand Prix Viewing', activityEmoji: '🏎️', city: 'Monaco', country: 'Monaco', countryCode: 'MC', when: 'Sunday 2:00 PM',
    profile: { name: 'Oliver H.', age: 38, gender: 'male', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', profession: 'Hedge Fund Manager', verified: true },
    matchScore: 87, commonInterests: ['Formula 1', 'hospitality suite'],
    message: '🏎️ F1 buddy! Oliver H. (38, Finance) has access to a hospitality suite for the Monaco GP this Sunday. 87% match!',
    voiceMessage: 'Oliver, a finance professional, has access to a hospitality suite for the Monaco Grand Prix this Sunday. 87% match!' },

  // --- UAE ---
  { id: 'paddle-dubai', activity: 'Padel Tennis', activityEmoji: '🏓', city: 'Dubai', country: 'UAE', countryCode: 'AE', when: 'Thursday 7:00 PM',
    profile: { name: 'Layla A.', age: 30, gender: 'female', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', profession: 'E-commerce Director', verified: true },
    matchScore: 90, commonInterests: ['padel', 'intermediate level'],
    message: '🏓 Padel partner! Layla A. (30, E-commerce Director) needs a doubles partner in Dubai this Thursday. 90% match!',
    voiceMessage: 'Layla, an E-commerce Director in Dubai, is looking for a padel doubles partner this Thursday evening. 90% match!' },

  // --- Switzerland ---
  { id: 'ski-zermatt', activity: 'Skiing', activityEmoji: '⛷️', city: 'Zermatt', country: 'Switzerland', countryCode: 'CH', when: 'Saturday 9:00 AM',
    profile: { name: 'Niklas B.', age: 32, gender: 'male', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face', profession: 'Blockchain Developer', verified: true },
    matchScore: 95, commonInterests: ['off-piste skiing', 'après-ski'],
    message: '⛷️ Ski buddy! Niklas B. (32, Blockchain Dev) is hitting the slopes in Zermatt this Saturday. 95% match!',
    voiceMessage: 'Niklas, a Blockchain Developer, is heading to the off-piste slopes in Zermatt this Saturday. 95% match!' },

  // --- Japan ---
  { id: 'cooking-tokyo', activity: 'Ramen Workshop', activityEmoji: '🍜', city: 'Tokyo', country: 'Japan', countryCode: 'JP', when: 'Friday 12:00 PM',
    profile: { name: 'Yuki T.', age: 26, gender: 'female', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', profession: 'Food Blogger', verified: true },
    matchScore: 97, commonInterests: ['Japanese cuisine', 'food tours'],
    message: '🍜 Foodie match! Yuki T. (26, Food Blogger) is hosting a private ramen workshop in Tokyo this Friday. 97% match!',
    voiceMessage: 'Yuki, a Food Blogger in Tokyo, is hosting a private ramen workshop this Friday. 97% match!' },

  // --- Maldives ---
  { id: 'diving-maldives', activity: 'Scuba Diving', activityEmoji: '🤿', city: 'Malé', country: 'Maldives', countryCode: 'MV', when: 'Wednesday 8:00 AM',
    profile: { name: 'David L.', age: 35, gender: 'male', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face', profession: 'Marine Biologist', verified: true },
    matchScore: 91, commonInterests: ['PADI Advanced', 'manta ray spots'],
    message: '🤿 Dive buddy! David L. (35, Marine Biologist) is diving manta ray spots in the Maldives this Wednesday. 91% match!',
    voiceMessage: 'David, a Marine Biologist, is exploring manta ray diving spots in the Maldives this Wednesday. 91% match!' },

  // --- Thailand ---
  { id: 'muay-thai-bangkok', activity: 'Muay Thai Class', activityEmoji: '🥊', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', when: 'Tuesday 6:00 PM',
    profile: { name: 'Nara P.', age: 27, gender: 'female', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face', profession: 'Fitness Coach', verified: true },
    matchScore: 93, commonInterests: ['martial arts', 'beginner-friendly'],
    message: '🥊 Training match! Nara P. (27, Fitness Coach) runs Muay Thai classes in Bangkok every Tuesday. 93% match!',
    voiceMessage: 'Nara, a Fitness Coach in Bangkok, runs beginner-friendly Muay Thai classes every Tuesday evening. 93% match!' },

  // --- Germany ---
  { id: 'beer-munich', activity: 'Brewery Tour', activityEmoji: '🍺', city: 'Munich', country: 'Germany', countryCode: 'DE', when: 'Saturday 3:00 PM',
    profile: { name: 'Felix K.', age: 31, gender: 'male', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', profession: 'Software Engineer', verified: true },
    matchScore: 86, commonInterests: ['craft beer', 'local history'],
    message: '🍺 Cheers! Felix K. (31, Software Engineer) is doing a craft brewery tour in Munich this Saturday. 86% match!',
    voiceMessage: 'Felix, a Software Engineer, is doing a craft brewery tour in Munich this Saturday afternoon. 86% match!' },

  // --- France ---
  { id: 'wine-paris', activity: 'Wine Tasting', activityEmoji: '🥂', city: 'Paris', country: 'France', countryCode: 'FR', when: 'Friday 7:00 PM',
    profile: { name: 'Camille D.', age: 30, gender: 'female', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', profession: 'Sommelier', verified: true },
    matchScore: 92, commonInterests: ['natural wines', 'Le Marais'],
    message: '🥂 Wine match! Camille D. (30, Sommelier) hosts intimate tastings in Le Marais every Friday. 92% match!',
    voiceMessage: 'Camille, a Sommelier in Paris, hosts intimate natural wine tastings in Le Marais every Friday evening. 92% match!' },

  // --- USA ---
  { id: 'basketball-nyc', activity: 'Basketball Pickup', activityEmoji: '🏀', city: 'New York', country: 'United States', countryCode: 'US', when: 'Saturday 10:00 AM',
    profile: { name: 'DeAndre J.', age: 28, gender: 'male', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', profession: 'Marketing Director', verified: true },
    matchScore: 88, commonInterests: ['pickup games', 'Central Park courts'],
    message: '🏀 Game on! DeAndre J. (28, Marketing Director) plays pickup basketball at Central Park every Saturday. 88% match!',
    voiceMessage: 'DeAndre, a Marketing Director, plays pickup basketball at Central Park every Saturday morning. 88% match!' },

  // --- UK ---
  { id: 'run-london', activity: 'Park Run', activityEmoji: '🏃', city: 'London', country: 'United Kingdom', countryCode: 'GB', when: 'Saturday 9:00 AM',
    profile: { name: 'Charlotte W.', age: 32, gender: 'female', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', profession: 'Investment Banker', verified: true },
    matchScore: 90, commonInterests: ['parkrun', 'Hyde Park'],
    message: '🏃 Running match! Charlotte W. (32, Investment Banker) runs parkrun at Hyde Park every Saturday. 90% match!',
    voiceMessage: 'Charlotte, an Investment Banker, runs parkrun at Hyde Park every Saturday morning. 90% match!' },

  // --- Mexico ---
  { id: 'salsa-mexico', activity: 'Salsa Night', activityEmoji: '💃', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', when: 'Friday 9:00 PM',
    profile: { name: 'Valentina R.', age: 29, gender: 'female', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', profession: 'Dance Instructor', verified: true },
    matchScore: 95, commonInterests: ['salsa', 'cumbia'],
    message: '💃 Dance match! Valentina R. (29, Dance Instructor) hosts salsa nights in Roma Norte every Friday. 95% match!',
    voiceMessage: 'Valentina, a Dance Instructor, hosts salsa nights in Roma Norte every Friday. 95% match!' },

  // --- Australia ---
  { id: 'surf-sydney', activity: 'Surfing', activityEmoji: '🏄', city: 'Sydney', country: 'Australia', countryCode: 'AU', when: 'Sunday 6:30 AM',
    profile: { name: 'Liam C.', age: 30, gender: 'male', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', profession: 'Physiotherapist', verified: true },
    matchScore: 91, commonInterests: ['Bondi Beach', 'dawn sessions'],
    message: '🏄 Surf match! Liam C. (30, Physiotherapist) catches waves at Bondi every Sunday at dawn. 91% match!',
    voiceMessage: 'Liam, a Physiotherapist, surfs at Bondi Beach every Sunday at dawn. 91% match!' },

  // --- Greece ---
  { id: 'sailing-athens', activity: 'Sailing', activityEmoji: '⛵', city: 'Athens', country: 'Greece', countryCode: 'GR', when: 'Saturday 10:00 AM',
    profile: { name: 'Eleni S.', age: 34, gender: 'female', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', profession: 'Marine Architect', verified: true },
    matchScore: 93, commonInterests: ['sailing', 'island hopping'],
    message: '⛵ Sailing match! Eleni S. (34, Marine Architect) sails the Saronic Gulf from Athens every Saturday. 93% match!',
    voiceMessage: 'Eleni, a Marine Architect, sails the Saronic Gulf from Athens every Saturday. 93% match!' },
];

/**
 * Picks the next notification, prioritizing matches in the user's current city/country.
 * Falls back to global pool when no local match is available.
 */
function pickContextualMatch(
  pool: MatchNotification[],
  shownIds: Set<string>,
  userCity?: string,
  userCountryCode?: string,
): MatchNotification {
  const unseen = pool.filter(m => !shownIds.has(m.id));
  const candidates = unseen.length > 0 ? unseen : pool; // reset if all shown

  // Prioritize: same city > same country > any
  const cityNorm = userCity?.toLowerCase().trim();
  const codeNorm = userCountryCode?.toUpperCase().trim();

  const sameCity = cityNorm
    ? candidates.filter(m => m.city.toLowerCase() === cityNorm)
    : [];
  const sameCountry = codeNorm
    ? candidates.filter(m => m.countryCode === codeNorm && !sameCity.includes(m))
    : [];
  const global = candidates.filter(m => !sameCity.includes(m) && !sameCountry.includes(m));

  // 50% chance local, 30% same country, 20% global (when available)
  const roll = Math.random();
  let pick: MatchNotification | undefined;

  if (roll < 0.5 && sameCity.length > 0) {
    pick = sameCity[Math.floor(Math.random() * sameCity.length)];
  } else if (roll < 0.8 && sameCountry.length > 0) {
    pick = sameCountry[Math.floor(Math.random() * sameCountry.length)];
  }

  if (!pick) {
    // Fallback: pick from whichever group has items
    const fallback = [...sameCity, ...sameCountry, ...global];
    pick = fallback.length > 0
      ? fallback[Math.floor(Math.random() * fallback.length)]
      : candidates[Math.floor(Math.random() * candidates.length)];
  }

  return pick;
}

const SocialMatchNotifications: React.FC = () => {
  const shownRef = useRef<Set<string>>(new Set());
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
    const match = pickContextualMatch(
      MATCH_POOL,
      shownRef.current,
      location?.city,
      location?.country_code,
    );

    shownRef.current.add(match.id);
    if (shownRef.current.size >= MATCH_POOL.length) shownRef.current.clear();

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
    // First notification after 30-45s, then every 60-120s — comfortable pace
    const initialDelay = 30000 + Math.random() * 15000;

    const scheduleNext = () => {
      const delay = 60000 + Math.random() * 60000;
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
