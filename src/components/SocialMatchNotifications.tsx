import React, { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, MessageCircle, Shield } from 'lucide-react';

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
  when: string;
  profile: MatchProfile;
  matchScore: number;
  commonInterests: string[];
  message: string;
  voiceMessage: string;
}

const MATCH_POOL: MatchNotification[] = [
  {
    id: 'run-milano',
    activity: 'Morning Run',
    activityEmoji: '🏃‍♀️',
    city: 'Milano',
    country: 'Italy',
    when: 'Saturday 7:00 AM',
    profile: { name: 'Sofia R.', age: 29, gender: 'female', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', profession: 'UX Designer', verified: true },
    matchScore: 94,
    commonInterests: ['5K runs', 'coffee after'],
    message: '🏃‍♀️ Perfect match! Sofia R. (29, UX Designer) also runs Saturday mornings in Milano — Parco Sempione at 7 AM. 94% match!',
    voiceMessage: 'Great news! We found a perfect running match for you. Sofia, a 29-year-old UX Designer, also runs Saturday mornings in Milano at Parco Sempione. You have a 94% match score. Want to open a safe chat?',
  },
  {
    id: 'bike-mallorca',
    activity: 'Road Cycling',
    activityEmoji: '🚴',
    city: 'Mallorca',
    country: 'Spain',
    when: 'Sunday 8:30 AM',
    profile: { name: 'Marcus T.', age: 34, gender: 'male', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', profession: 'Startup Founder', verified: true },
    matchScore: 91,
    commonInterests: ['road cycling', 'Cap de Formentor route'],
    message: '🚴 Biking buddy found! Marcus T. (34, Startup Founder) is cycling the Cap de Formentor route in Mallorca this Sunday. 91% match!',
    voiceMessage: 'Exciting match! Marcus, a 34-year-old Startup Founder, is planning to cycle the Cap de Formentor route in Mallorca this Sunday morning. You share a 91% match. Shall I open a safe chat?',
  },
  {
    id: 'tennis-singapore',
    activity: 'Tennis Watching',
    activityEmoji: '🎾',
    city: 'Singapore',
    country: 'Singapore',
    when: 'Saturday 6:00 PM',
    profile: { name: 'Priya K.', age: 31, gender: 'female', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', profession: 'Fintech PM', verified: true },
    matchScore: 88,
    commonInterests: ['WTA Finals', 'Marina Bay area'],
    message: '🎾 Tennis fan match! Priya K. (31, Fintech PM) wants to watch the WTA Finals in Singapore this Saturday evening. 88% match!',
    voiceMessage: 'We found a tennis match for you! Priya, a 31-year-old Fintech Product Manager, is looking for someone to watch the WTA Finals in Singapore this Saturday evening. You have an 88% match score.',
  },
  {
    id: 'surf-bali',
    activity: 'Surfing',
    activityEmoji: '🏄‍♂️',
    city: 'Canggu',
    country: 'Bali',
    when: 'Tomorrow 6:00 AM',
    profile: { name: 'Jake W.', age: 27, gender: 'male', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', profession: 'Content Creator', verified: true },
    matchScore: 96,
    commonInterests: ['dawn patrol', 'intermediate level'],
    message: '🏄‍♂️ Surf buddy alert! Jake W. (27, Content Creator) is hitting the waves in Canggu tomorrow at dawn. 96% match — same level!',
    voiceMessage: 'Awesome find! Jake, a 27-year-old Content Creator, is surfing in Canggu tomorrow at dawn. You both surf at intermediate level, giving you a 96% match. Want to connect?',
  },
  {
    id: 'yoga-lisbon',
    activity: 'Sunset Yoga',
    activityEmoji: '🧘‍♀️',
    city: 'Lisbon',
    country: 'Portugal',
    when: 'Friday 6:30 PM',
    profile: { name: 'Elena M.', age: 33, gender: 'female', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', profession: 'Digital Nomad Coach', verified: true },
    matchScore: 92,
    commonInterests: ['vinyasa flow', 'rooftop sessions'],
    message: '🧘‍♀️ Yoga match! Elena M. (33, Digital Nomad Coach) hosts sunset yoga on Lisbon rooftops every Friday. 92% match!',
    voiceMessage: 'Beautiful match! Elena, a Digital Nomad Coach, hosts sunset vinyasa yoga on Lisbon rooftops every Friday evening. You have a 92% match score. Interested?',
  },
  {
    id: 'football-barcelona',
    activity: 'Football Match',
    activityEmoji: '⚽',
    city: 'Barcelona',
    country: 'Spain',
    when: 'Saturday 9:00 PM',
    profile: { name: 'Carlos D.', age: 36, gender: 'male', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', profession: 'Architect', verified: true },
    matchScore: 89,
    commonInterests: ['FC Barcelona', 'Camp Nou experience'],
    message: '⚽ Match day buddy! Carlos D. (36, Architect) has an extra ticket for Barça at Camp Nou this Saturday night. 89% match!',
    voiceMessage: 'Great news for football fans! Carlos, a 36-year-old Architect, has an extra ticket for the Barcelona match at Camp Nou this Saturday night. You share an 89% match score!',
  },
  {
    id: 'hiking-cape-town',
    activity: 'Table Mountain Hike',
    activityEmoji: '🥾',
    city: 'Cape Town',
    country: 'South Africa',
    when: 'Sunday 7:00 AM',
    profile: { name: 'Amara N.', age: 28, gender: 'female', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', profession: 'Wildlife Photographer', verified: true },
    matchScore: 93,
    commonInterests: ['sunrise hikes', 'photography'],
    message: '🥾 Hiking match! Amara N. (28, Wildlife Photographer) is hiking Table Mountain at sunrise this Sunday. 93% match!',
    voiceMessage: 'Amazing match! Amara, a 28-year-old Wildlife Photographer, is hiking Table Mountain at sunrise this Sunday. You both love photography and sunrise hikes. 93% match!',
  },
  {
    id: 'f1-monaco',
    activity: 'F1 Grand Prix Viewing',
    activityEmoji: '🏎️',
    city: 'Monaco',
    country: 'Monaco',
    when: 'Sunday 2:00 PM',
    profile: { name: 'Oliver H.', age: 38, gender: 'male', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', profession: 'Hedge Fund Manager', verified: true },
    matchScore: 87,
    commonInterests: ['Formula 1', 'hospitality suite'],
    message: '🏎️ F1 buddy! Oliver H. (38, Finance) has access to a hospitality suite for the Monaco GP this Sunday. 87% match!',
    voiceMessage: 'Exciting opportunity! Oliver, a finance professional, has access to a hospitality suite for the Monaco Grand Prix this Sunday. You share an 87% match score!',
  },
  {
    id: 'paddle-dubai',
    activity: 'Padel Tennis',
    activityEmoji: '🏓',
    city: 'Dubai',
    country: 'UAE',
    when: 'Thursday 7:00 PM',
    profile: { name: 'Layla A.', age: 30, gender: 'female', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', profession: 'E-commerce Director', verified: true },
    matchScore: 90,
    commonInterests: ['padel', 'intermediate level'],
    message: '🏓 Padel partner! Layla A. (30, E-commerce Director) needs a doubles partner in Dubai this Thursday evening. 90% match!',
    voiceMessage: 'Match found! Layla, an E-commerce Director in Dubai, is looking for a padel doubles partner this Thursday evening. You are both intermediate level with a 90% match!',
  },
  {
    id: 'ski-zermatt',
    activity: 'Skiing',
    activityEmoji: '⛷️',
    city: 'Zermatt',
    country: 'Switzerland',
    when: 'Saturday 9:00 AM',
    profile: { name: 'Niklas B.', age: 32, gender: 'male', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face', profession: 'Blockchain Developer', verified: true },
    matchScore: 95,
    commonInterests: ['off-piste skiing', 'après-ski'],
    message: '⛷️ Ski buddy! Niklas B. (32, Blockchain Dev) is hitting the slopes in Zermatt this Saturday — off-piste routes. 95% match!',
    voiceMessage: 'Perfect ski match! Niklas, a Blockchain Developer, is heading to the off-piste slopes in Zermatt this Saturday. You share a 95% match score and both love après-ski!',
  },
  {
    id: 'cooking-tokyo',
    activity: 'Ramen Workshop',
    activityEmoji: '🍜',
    city: 'Tokyo',
    country: 'Japan',
    when: 'Friday 12:00 PM',
    profile: { name: 'Yuki T.', age: 26, gender: 'female', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', profession: 'Food Blogger', verified: true },
    matchScore: 97,
    commonInterests: ['Japanese cuisine', 'food tours'],
    message: '🍜 Foodie match! Yuki T. (26, Food Blogger) is hosting a private ramen workshop in Tokyo this Friday. 97% match!',
    voiceMessage: 'Incredible match! Yuki, a Food Blogger in Tokyo, is hosting a private ramen workshop this Friday. You both love Japanese cuisine. 97% match — the highest this week!',
  },
  {
    id: 'diving-maldives',
    activity: 'Scuba Diving',
    activityEmoji: '🤿',
    city: 'Malé',
    country: 'Maldives',
    when: 'Wednesday 8:00 AM',
    profile: { name: 'David L.', age: 35, gender: 'male', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face', profession: 'Marine Biologist', verified: true },
    matchScore: 91,
    commonInterests: ['PADI Advanced', 'manta ray spots'],
    message: '🤿 Dive buddy! David L. (35, Marine Biologist) is diving manta ray spots in the Maldives this Wednesday. 91% match!',
    voiceMessage: 'Dive match found! David, a Marine Biologist, is exploring manta ray diving spots in the Maldives this Wednesday. You are both PADI Advanced certified with a 91% match!',
  },
];

const SocialMatchNotifications: React.FC = () => {
  const shownRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  // Shuffle pool once on mount
  const shuffledPool = useRef(
    [...MATCH_POOL].sort(() => Math.random() - 0.5)
  );

  const speakNotification = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Only speak if user has interacted with the page (browser policy)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.8;
      // Pick a natural-sounding voice
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
        || voices.find(v => v.lang.startsWith('en') && !v.localService)
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const showNotification = useCallback(() => {
    const pool = shuffledPool.current;
    if (indexRef.current >= pool.length) {
      indexRef.current = 0; // Restart cycle
      shuffledPool.current = [...MATCH_POOL].sort(() => Math.random() - 0.5);
    }

    const match = pool[indexRef.current];
    indexRef.current += 1;

    toast.custom(
      (id) => (
        <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-4 animate-in slide-in-from-top-5 duration-500">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={match.profile.avatar}
                alt={match.profile.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
              />
              {match.profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
                  <Shield className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{match.activityEmoji}</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  New Match
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {match.matchScore}% match
                </span>
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
                <button
                  onClick={() => toast.dismiss(id)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
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
      {
        duration: 12000,
        position: 'top-right',
      }
    );

    // Speak via TTS (only if speechSynthesis is not already speaking)
    if ('speechSynthesis' in window && !speechSynthesis.speaking) {
      speakNotification(match.voiceMessage);
    }
  }, [speakNotification]);

  useEffect(() => {
    // First notification after 25-35 seconds
    const initialDelay = 25000 + Math.random() * 10000;

    const scheduleNext = () => {
      // Random interval between 45-90 seconds — enough to demo, not annoying
      const delay = 45000 + Math.random() * 45000;
      timerRef.current = setTimeout(() => {
        showNotification();
        scheduleNext();
      }, delay);
    };

    timerRef.current = setTimeout(() => {
      showNotification();
      scheduleNext();
    }, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showNotification]);

  return null; // Render-less component — uses toast
};

export default SocialMatchNotifications;
