import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmartSearchMenu } from '@/components/SmartSearchMenu';
import { getAllCities } from '@/data/cities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  DollarSign,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  Music,
  PartyPopper,
  Dumbbell,
  Heart,
  ShoppingBag,
  Briefcase,
  Trophy,
  Gamepad2,
  Users,
  Coffee,
  Palette,
  GraduationCap,
  Wrench,
  Pizza,
  Leaf,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  User,
  X,
  Bike,
  Car,
  Flame,
  Flag,
  Target,
  Zap,
  Shield,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  TrendingUp,
  Star,
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { format, addDays, startOfDay, parseISO, isAfter } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrustBadge, TrustRating } from '@/components/ui/trust-badge';

interface ExploreLocalLifeProps {
  currentLocation: LocationData | null;
}

interface LocalEvent {
  id: string;
  name: string;
  category: EventCategory;
  city: string;
  country: string;
  location: string;
  startDate: string;
  endDate?: string;
  time: string;
  description: string;
  isFree: boolean;
  fee?: string;
  verified: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly';
  tags?: string[];
  priceRange?: 'free' | 'budget' | 'moderate' | 'premium';
  rating?: number;
  reviews?: number;
  trustBadges?: string[];
  website?: string;
  registrationUrl?: string;
  ticketUrl?: string;
  organizer: string;
  contactEmail?: string;
  contactPhone?: string;
  address: string;
  venue?: string;
  capacity?: number;
  attendees?: number;
  requirements?: string[];
  whatToBring?: string[];
  ageRestriction?: string;
  accessibility?: string;
}

type EventCategory = 'farmers-market' | 'business' | 'sports' | 'tournament' | 'gameday' |
  'cultural' | 'workshop' | 'food' | 'wellness' | 'nightlife' |
  'networking' | 'art' | 'music' | 'outdoor' | 'tech' |
  'soccer' | 'nba' | 'american-football' | 'cricket' | 'rugby' |
  'basketball' | 'cycling' | 'triathlon' | 'motorsports' | 'fighting';

// ─── CATEGORY CONFIG ───
const categoryConfig: Record<EventCategory, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  'farmers-market': { label: 'Markets', icon: ShoppingBag, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-500/10 border-green-500/20' },
  'business': { label: 'Business', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  'sports': { label: 'Sports', icon: Dumbbell, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-500/10 border-red-500/20' },
  'tournament': { label: 'Tournaments', icon: Trophy, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20' },
  'gameday': { label: 'Game Days', icon: Gamepad2, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20' },
  'cultural': { label: 'Cultural', icon: PartyPopper, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-500/10 border-pink-500/20' },
  'workshop': { label: 'Workshops', icon: GraduationCap, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-500/10 border-indigo-500/20' },
  'food': { label: 'Food & Dining', icon: Pizza, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' },
  'wellness': { label: 'Wellness', icon: Heart, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500/10 border-rose-500/20' },
  'nightlife': { label: 'Nightlife', icon: Music, color: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-500/10 border-violet-500/20' },
  'networking': { label: 'Networking', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-500/10 border-cyan-500/20' },
  'art': { label: 'Art', icon: Palette, color: 'text-fuchsia-600 dark:text-fuchsia-400', bgColor: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
  'music': { label: 'Live Music', icon: Music, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-500/10 border-teal-500/20' },
  'outdoor': { label: 'Outdoor', icon: Leaf, color: 'text-lime-600 dark:text-lime-400', bgColor: 'bg-lime-500/10 border-lime-500/20' },
  'tech': { label: 'Tech', icon: Wrench, color: 'text-sky-600 dark:text-sky-400', bgColor: 'bg-sky-500/10 border-sky-500/20' },
  'soccer': { label: 'Soccer', icon: Trophy, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  'nba': { label: 'NBA', icon: Target, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' },
  'american-football': { label: 'NFL', icon: Flag, color: 'text-red-700 dark:text-red-500', bgColor: 'bg-red-500/10 border-red-500/20' },
  'cricket': { label: 'Cricket', icon: Trophy, color: 'text-green-700 dark:text-green-500', bgColor: 'bg-green-500/10 border-green-500/20' },
  'rugby': { label: 'Rugby', icon: Flame, color: 'text-slate-700 dark:text-slate-400', bgColor: 'bg-slate-500/10 border-slate-500/20' },
  'basketball': { label: 'Basketball', icon: Target, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  'cycling': { label: 'Cycling', icon: Bike, color: 'text-blue-700 dark:text-blue-500', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  'triathlon': { label: 'Triathlon', icon: Zap, color: 'text-purple-700 dark:text-purple-500', bgColor: 'bg-purple-500/10 border-purple-500/20' },
  'motorsports': { label: 'Motorsports', icon: Car, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-500/10 border-red-500/20' },
  'fighting': { label: 'UFC & Fighting', icon: Flame, color: 'text-orange-700 dark:text-orange-500', bgColor: 'bg-orange-500/10 border-orange-500/20' },
};

// ─── EVENT GENERATION ───
const getCountryName = (code: string): string => {
  const map: Record<string, string> = {
    US: 'USA', GB: 'UK', ES: 'Spain', PT: 'Portugal', FR: 'France', DE: 'Germany',
    TH: 'Thailand', MX: 'Mexico', ID: 'Indonesia', AU: 'Australia', CA: 'Canada',
    JP: 'Japan', IT: 'Italy', NL: 'Netherlands', GR: 'Greece', BR: 'Brazil',
    CO: 'Colombia', AR: 'Argentina', AE: 'UAE', SG: 'Singapore', VN: 'Vietnam',
    MY: 'Malaysia', PH: 'Philippines', KR: 'South Korea', TR: 'Turkey', AT: 'Austria',
    CZ: 'Czech Republic', PL: 'Poland', HU: 'Hungary', DK: 'Denmark', SE: 'Sweden',
    NO: 'Norway', FI: 'Finland', IE: 'Ireland', BE: 'Belgium', CH: 'Switzerland',
    HR: 'Croatia', NZ: 'New Zealand', ZA: 'South Africa', CL: 'Chile', PE: 'Peru',
    CR: 'Costa Rica', PA: 'Panama', EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania',
    GE: 'Georgia', MA: 'Morocco', EG: 'Egypt', IL: 'Israel', IN: 'India',
    HK: 'Hong Kong', TW: 'Taiwan', CN: 'China', RO: 'Romania', BG: 'Bulgaria',
    RS: 'Serbia', SK: 'Slovakia', SI: 'Slovenia', UA: 'Ukraine', AL: 'Albania',
    ME: 'Montenegro', MK: 'North Macedonia', BA: 'Bosnia', LU: 'Luxembourg',
    MC: 'Monaco', MT: 'Malta', CY: 'Cyprus', IS: 'Iceland', RU: 'Russia',
    SA: 'Saudi Arabia', QA: 'Qatar', BH: 'Bahrain', KW: 'Kuwait', OM: 'Oman',
    JO: 'Jordan', LB: 'Lebanon', KH: 'Cambodia', LA: 'Laos', MM: 'Myanmar',
    BD: 'Bangladesh', LK: 'Sri Lanka', NP: 'Nepal', PK: 'Pakistan', KZ: 'Kazakhstan',
    UZ: 'Uzbekistan', KG: 'Kyrgyzstan', AZ: 'Azerbaijan', AM: 'Armenia',
    MV: 'Maldives', KE: 'Kenya', NG: 'Nigeria', GH: 'Ghana', TZ: 'Tanzania',
    ET: 'Ethiopia', RW: 'Rwanda', UG: 'Uganda', SN: 'Senegal', CI: 'Ivory Coast',
    TN: 'Tunisia', DZ: 'Algeria', MU: 'Mauritius', NA: 'Namibia', BW: 'Botswana',
    DO: 'Dominican Republic', JM: 'Jamaica', CU: 'Cuba', TT: 'Trinidad & Tobago',
    BB: 'Barbados', BS: 'Bahamas', EC: 'Ecuador', UY: 'Uruguay', BO: 'Bolivia',
    PY: 'Paraguay', VE: 'Venezuela', GT: 'Guatemala', PR: 'Puerto Rico',
    FJ: 'Fiji', PF: 'French Polynesia', SC: 'Seychelles', CV: 'Cape Verde',
    IR: 'Iran', IQ: 'Iraq', MN: 'Mongolia', BN: 'Brunei', MO: 'Macao',
    NC: 'New Caledonia', ZM: 'Zambia', ZW: 'Zimbabwe', MZ: 'Mozambique',
    AO: 'Angola', CM: 'Cameroon', GM: 'Gambia', SD: 'Sudan', LY: 'Libya',
  };
  return map[code] || code;
};

const generateMockEvents = (): LocalEvent[] => {
  const today = new Date();
  const events: LocalEvent[] = [];
  const activeCities = getAllCities();
  const sources = ['Eventbrite Verified', 'Meetup Official', 'Facebook Events', 'SuperNomad Verified', 'Local Tourism Board', 'Official Organizer'];
  let id = 1;

  // Event templates — each city gets 4 core events + conditional extras
  const templates: Array<{
    nameGen: (city: string) => string;
    category: EventCategory;
    dayOffset: number;
    time: string;
    descGen: (city: string) => string;
    isFree: boolean;
    fee?: string;
    priceRange: 'free' | 'budget' | 'moderate' | 'premium';
    recurring?: 'daily' | 'weekly' | 'monthly';
    tags: string[];
    trustBadges: string[];
    condition?: (index: number) => boolean;
  }> = [
    {
      nameGen: c => `${c} Fresh Market`,
      category: 'farmers-market', dayOffset: 0, time: '07:00 - 14:00',
      descGen: c => `Fresh local produce, artisanal foods, and handcrafted goods from regional farmers in ${c}`,
      isFree: true, priceRange: 'free', recurring: 'weekly',
      tags: ['organic', 'local', 'food'], trustBadges: ['Verified Local', 'Local Gem'],
    },
    {
      nameGen: c => `Digital Nomad Meetup ${c}`,
      category: 'networking', dayOffset: 3, time: '18:00 - 21:00',
      descGen: () => 'Connect with fellow remote workers, entrepreneurs, and digital nomads. Share experiences and build your network',
      isFree: true, priceRange: 'free', recurring: 'weekly',
      tags: ['networking', 'remote work', 'community'], trustBadges: ['Nomad Favorite', 'Traveler Favorite'],
    },
    {
      nameGen: c => `${c} Running Club`,
      category: 'sports', dayOffset: 1, time: '06:30 - 07:30',
      descGen: () => 'Morning run for all fitness levels. Free, friendly, and a great way to start your day',
      isFree: true, priceRange: 'free', recurring: 'daily',
      tags: ['running', 'fitness', 'morning'], trustBadges: ['Local Gem', 'Nomad Favorite'],
    },
    {
      nameGen: c => `Cultural Evening at ${c}`,
      category: 'cultural', dayOffset: 5, time: '19:00 - 22:00',
      descGen: () => 'Experience traditional music, dance, and cuisine from the local culture',
      isFree: false, fee: '$15-25', priceRange: 'budget',
      tags: ['culture', 'traditional', 'evening'], trustBadges: ['Verified Local', 'Cultural Gem'],
    },
    {
      nameGen: () => 'Tech Startup Pitch Night',
      category: 'tech', dayOffset: 7, time: '18:30 - 21:30',
      descGen: () => 'Watch local startups pitch their ideas. Network with founders and investors',
      isFree: true, priceRange: 'free',
      tags: ['startups', 'tech', 'innovation'], trustBadges: ['Nomad Favorite', 'Top Rated'],
      condition: i => i % 4 === 0,
    },
    {
      nameGen: c => `${c} Street Food Tour`,
      category: 'food', dayOffset: 6, time: '17:00 - 20:00',
      descGen: c => `Guided tour through the best street food spots in ${c}. Taste authentic local cuisine`,
      isFree: false, fee: '$35-45', priceRange: 'moderate',
      tags: ['food', 'tour', 'local cuisine'], trustBadges: ['Top Rated', 'Traveler Favorite'],
      condition: i => i % 3 === 0,
    },
    {
      nameGen: () => 'Sunrise Yoga Session',
      category: 'wellness', dayOffset: 2, time: '06:00 - 07:00',
      descGen: () => 'Start your day with peaceful yoga overlooking beautiful views',
      isFree: true, priceRange: 'free', recurring: 'daily',
      tags: ['yoga', 'wellness', 'morning'], trustBadges: ['Local Gem', 'Nomad Favorite'],
      condition: i => i % 3 === 0,
    },
    {
      nameGen: () => 'Live Jazz Night',
      category: 'music', dayOffset: 9, time: '20:00 - 00:00',
      descGen: () => 'Live jazz performance featuring local and international musicians',
      isFree: false, fee: '$20-30', priceRange: 'budget', recurring: 'weekly',
      tags: ['music', 'jazz', 'nightlife'], trustBadges: ['Top Rated', 'Nomad Favorite'],
      condition: i => i % 4 === 0,
    },
    {
      nameGen: () => 'Photography Workshop',
      category: 'workshop', dayOffset: 10, time: '10:00 - 16:00',
      descGen: () => 'Learn urban photography techniques from a professional. Camera provided if needed',
      isFree: false, fee: '$60-80', priceRange: 'moderate',
      tags: ['photography', 'learning', 'creative'], trustBadges: ['Top Rated', 'Local Gem'],
      condition: i => i % 5 === 0,
    },
    {
      nameGen: c => `${c} Art Gallery Night`,
      category: 'art', dayOffset: 8, time: '18:00 - 22:00',
      descGen: () => 'Free entry to multiple galleries. Meet artists and enjoy complimentary wine',
      isFree: true, priceRange: 'free',
      tags: ['art', 'culture', 'evening'], trustBadges: ['Verified Local', 'Cultural Gem'],
      condition: i => i % 5 === 0,
    },
    {
      nameGen: () => 'Hiking Adventure',
      category: 'outdoor', dayOffset: 11, time: '08:00 - 14:00',
      descGen: () => 'Guided hike through scenic trails. All fitness levels welcome',
      isFree: false, fee: '$25-35', priceRange: 'budget',
      tags: ['hiking', 'outdoor', 'nature'], trustBadges: ['Top Rated', 'Traveler Favorite'],
      condition: i => i % 5 === 0,
    },
    {
      nameGen: c => `Board Game Night in ${c}`,
      category: 'gameday', dayOffset: 4, time: '19:00 - 23:00',
      descGen: () => 'Casual board game evening. Bring friends or make new ones',
      isFree: false, fee: '$5-10', priceRange: 'budget', recurring: 'weekly',
      tags: ['games', 'social', 'indoor'], trustBadges: ['Nomad Favorite', 'Traveler Favorite'],
      condition: i => i % 3 === 0,
    },
    {
      nameGen: c => `${c} Football Tournament`,
      category: 'tournament', dayOffset: 14, time: '09:00 - 18:00',
      descGen: () => 'International amateur football tournament. All skill levels welcome',
      isFree: false, fee: '$50 per team', priceRange: 'budget',
      tags: ['football', 'tournament', 'sports'], trustBadges: ['Verified Local', 'Top Rated'],
      condition: i => i % 6 === 0,
    },
    {
      nameGen: c => `Rooftop Party ${c}`,
      category: 'nightlife', dayOffset: 12, time: '21:00 - 03:00',
      descGen: () => 'Dance under the stars with DJ sets and stunning city views',
      isFree: false, fee: '$15-25', priceRange: 'budget',
      tags: ['party', 'nightlife', 'rooftop'], trustBadges: ['Nomad Favorite', 'Top Rated'],
      condition: i => i % 6 === 0,
    },
    {
      nameGen: c => `${c} Business Summit`,
      category: 'business', dayOffset: 20, time: '09:00 - 18:00',
      descGen: () => 'Three-day business conference with keynote speakers and networking opportunities',
      isFree: false, fee: '$200-500', priceRange: 'premium',
      tags: ['business', 'conference', 'networking'], trustBadges: ['Verified Local', 'Top Rated'],
      condition: i => i % 8 === 0,
    },
  ];

  activeCities.forEach((cityData, index) => {
    const countryName = getCountryName(cityData.country_code);
    const baseDate = addDays(today, Math.floor(index / 10));

    templates.forEach(t => {
      if (t.condition && !t.condition(index)) return;

      events.push({
        id: `event-${id++}`,
        name: t.nameGen(cityData.name),
        category: t.category,
        city: cityData.name,
        country: countryName,
        location: `${cityData.name} Center`,
        startDate: format(addDays(baseDate, t.dayOffset), 'yyyy-MM-dd'),
        time: t.time,
        description: t.descGen(cityData.name),
        isFree: t.isFree,
        fee: t.fee,
        verified: true,
        recurring: t.recurring,
        tags: t.tags,
        priceRange: t.priceRange,
        organizer: `${cityData.name} Events (${sources[index % sources.length]})`,
        address: `Central District, ${cityData.name}`,
        website: `https://events.supernomad.app/${cityData.name.toLowerCase().replace(/\s/g, '-')}`,
        registrationUrl: t.isFree ? undefined : `https://tickets.supernomad.app/${id}`,
        contactEmail: `events@supernomad.app`,
        rating: 4.2 + Math.random() * 0.7,
        reviews: 80 + Math.floor(Math.random() * 200),
        trustBadges: t.trustBadges,
      });
    });
  });

  // Professional sporting events
  const proEvents: LocalEvent[] = [
    {
      id: 'pro-1', name: 'FIFA World Cup 2026', category: 'soccer', city: 'Multiple Cities', country: 'USA, Canada, Mexico',
      location: 'Various Stadiums', startDate: '2026-06-11', endDate: '2026-07-19', time: 'Various',
      description: 'The biggest soccer tournament in the world across North America', isFree: false, fee: '$200-2000',
      verified: true, tags: ['soccer', 'world cup'], priceRange: 'premium', organizer: 'FIFA',
      address: 'Multiple Stadiums', website: 'https://www.fifa.com', ticketUrl: 'https://fifaworldcup26.hospitality.fifa.com',
      rating: 4.9, reviews: 15000, trustBadges: ['World-Class', 'Top Rated'],
    },
    {
      id: 'pro-2', name: 'Tour de France 2026', category: 'cycling', city: 'Multiple Cities', country: 'France',
      location: 'Various Routes', startDate: '2026-07-04', endDate: '2026-07-26', time: 'Daytime',
      description: 'The world\'s most prestigious cycling race through beautiful French countryside', isFree: true,
      verified: true, tags: ['cycling', 'racing'], priceRange: 'free', organizer: 'ASO',
      address: 'Various locations across France', website: 'https://www.letour.fr',
      rating: 4.8, reviews: 9500, trustBadges: ['World-Class', 'Top Rated', 'Traveler Favorite'],
    },
    {
      id: 'pro-3', name: 'NBA Finals 2026', category: 'nba', city: 'TBD', country: 'USA',
      location: 'NBA Arena', startDate: '2026-06-01', endDate: '2026-06-21', time: '17:00-21:00 ET',
      description: 'Championship series of the NBA — the best basketball on the planet', isFree: false, fee: '$500-10000',
      verified: true, tags: ['nba', 'basketball', 'finals'], priceRange: 'premium', organizer: 'NBA',
      address: 'Various NBA Arenas', website: 'https://www.nba.com/finals', ticketUrl: 'https://www.nba.com/tickets',
      rating: 4.7, reviews: 8500, trustBadges: ['World-Class', 'Top Rated'],
    },
    {
      id: 'pro-4', name: 'La Liga: El Clásico', category: 'soccer', city: 'Madrid', country: 'Spain',
      location: 'Santiago Bernabéu', startDate: '2026-03-21', time: '21:00 CET',
      description: 'Real Madrid vs Barcelona — the biggest rivalry in world football', isFree: false, fee: '$200-1500',
      verified: true, tags: ['soccer', 'la liga', 'el clasico'], priceRange: 'premium', organizer: 'La Liga',
      address: 'Av. de Concha Espina, Madrid', website: 'https://www.laliga.com', ticketUrl: 'https://www.realmadrid.com/en/tickets',
      rating: 4.9, reviews: 18500, trustBadges: ['World-Class', 'Top Rated', 'Traveler Favorite'],
    },
    {
      id: 'pro-5', name: 'Premier League Match Day', category: 'soccer', city: 'London', country: 'UK',
      location: 'London Stadiums', startDate: '2025-11-01', endDate: '2026-05-23', time: 'Various',
      description: 'Experience the world\'s most exciting soccer league every weekend', isFree: false, fee: '$50-300',
      verified: true, recurring: 'weekly', tags: ['soccer', 'premier league'], priceRange: 'moderate', organizer: 'Premier League',
      address: 'Various Premier League Stadiums', website: 'https://www.premierleague.com', ticketUrl: 'https://www.premierleague.com/tickets',
      rating: 4.7, reviews: 14200, trustBadges: ['World-Class', 'Top Rated'],
    },
    {
      id: 'pro-6', name: 'Ironman World Championship', category: 'triathlon', city: 'Kona', country: 'USA',
      location: 'Kailua-Kona, Hawaii', startDate: '2026-10-10', time: '06:30 HST',
      description: 'The ultimate triathlon challenge — swim, bike, run in Hawaii', isFree: true,
      verified: true, tags: ['triathlon', 'ironman', 'endurance'], priceRange: 'free', organizer: 'Ironman',
      address: 'Kailua-Kona, Hawaii', website: 'https://www.ironman.com',
      rating: 4.9, reviews: 8900, trustBadges: ['World-Class', 'Top Rated', 'Traveler Favorite'],
    },
  ];

  events.push(...proEvents);
  return events;
};

const mockEvents = generateMockEvents();

// ─── SAVED EVENTS HELPERS ───
const getSavedEventIds = (): Set<string> => {
  try {
    const saved = localStorage.getItem('supernomad_saved_events');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch { return new Set(); }
};

const toggleSavedEvent = (eventId: string, saved: Set<string>): Set<string> => {
  const next = new Set(saved);
  if (next.has(eventId)) next.delete(eventId); else next.add(eventId);
  localStorage.setItem('supernomad_saved_events', JSON.stringify([...next]));
  return next;
};

// ─── MAIN COMPONENT ───
const ExploreLocalLife: React.FC<ExploreLocalLifeProps> = ({ currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState(24);
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(getSavedEventIds);
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(() => Array.from(new Set(mockEvents.map(e => e.city))).sort(), []);
  const countries = useMemo(() => Array.from(new Set(mockEvents.map(e => e.country))).sort(), []);

  // Category counts for chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockEvents.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1; });
    return counts;
  }, []);

  // Active filter count
  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedCity !== 'all',
    selectedCountry !== 'all',
    priceFilter !== 'all',
    showSavedOnly,
  ].filter(Boolean).length;

  const filteredEvents = useMemo(() => {
    try {
      let filtered = mockEvents;

      // Only verified + rated
      filtered = filtered.filter(e => e?.verified && e.rating && e.rating >= 4.0);

      // Upcoming
      if (showOnlyUpcoming) {
        const today = startOfDay(new Date());
        filtered = filtered.filter(e => {
          if (!e?.startDate) return false;
          try { return isAfter(parseISO(e.startDate), today) || !!e.recurring; }
          catch { return false; }
        });
      }

      // Saved only
      if (showSavedOnly) {
        filtered = filtered.filter(e => savedEvents.has(e.id));
      }

      // Search — matches name, city, country, tags, description
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(e =>
          e.name?.toLowerCase().includes(q) ||
          e.city?.toLowerCase().includes(q) ||
          e.country?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.tags?.some(t => t?.toLowerCase().includes(q))
        );
      }

      if (selectedCategory !== 'all') filtered = filtered.filter(e => e.category === selectedCategory);
      if (selectedCity !== 'all') filtered = filtered.filter(e => e.city === selectedCity);
      if (selectedCountry !== 'all') filtered = filtered.filter(e => e.country === selectedCountry);
      if (priceFilter === 'free') filtered = filtered.filter(e => e.isFree);
      else if (priceFilter !== 'all') filtered = filtered.filter(e => e.priceRange === priceFilter);

      // Sort: local first, then rating, reviews, date
      return filtered.sort((a, b) => {
        if (currentLocation?.city) {
          const aLocal = a.city?.toLowerCase() === currentLocation.city.toLowerCase();
          const bLocal = b.city?.toLowerCase() === currentLocation.city.toLowerCase();
          if (aLocal && !bLocal) return -1;
          if (!aLocal && bLocal) return 1;
        }
        const rd = (b.rating || 0) - (a.rating || 0);
        if (Math.abs(rd) > 0.1) return rd;
        const rvd = (b.reviews || 0) - (a.reviews || 0);
        if (rvd !== 0) return rvd;
        try { return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(); }
        catch { return 0; }
      });
    } catch { return []; }
  }, [searchQuery, selectedCategory, selectedCity, selectedCountry, priceFilter, showOnlyUpcoming, showSavedOnly, savedEvents, currentLocation]);

  const topLocalEvents = useMemo(() => {
    if (!currentLocation?.city) return [];
    const today = startOfDay(new Date());
    return mockEvents
      .filter(e => {
        try {
          return e.city?.toLowerCase() === currentLocation.city.toLowerCase() &&
            (isAfter(parseISO(e.startDate), today) || !!e.recurring) &&
            e.verified && e.rating && e.rating >= 4.0;
        } catch { return false; }
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [currentLocation]);

  const getCategoryConfig = (cat: EventCategory) => categoryConfig[cat] || { label: 'Event', icon: Sparkles, color: 'text-muted-foreground', bgColor: 'bg-muted/50' };

  const formatEventDate = (start: string, end?: string): string => {
    if (!start) return 'Date TBA';
    try {
      const s = format(parseISO(start), 'MMM dd, yyyy');
      if (end) { try { return `${s} - ${format(parseISO(end), 'MMM dd, yyyy')}`; } catch { return s; } }
      return s;
    } catch { return start; }
  };

  const clearAllFilters = () => {
    setSearchQuery(''); setSelectedCategory('all'); setSelectedCity('all');
    setSelectedCountry('all'); setPriceFilter('all'); setShowSavedOnly(false); setVisibleEvents(24);
  };

  const handleToggleSave = useCallback((eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedEvents(prev => toggleSavedEvent(eventId, prev));
  }, []);

  // ─── QUICK CATEGORY CHIPS ───
  const quickCategories: EventCategory[] = ['networking', 'food', 'sports', 'music', 'cultural', 'tech', 'wellness', 'outdoor', 'nightlife', 'art'];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ─── HERO HEADER ─── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Find Events</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length.toLocaleString()} verified events across {countries.length} countries & {cities.length} cities
        </p>
      </div>

      {/* ─── SEARCH BAR ─── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events, cities, countries, tags..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 pr-20 h-12 text-base"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSearchQuery('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            className="h-8 gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {activeFilterCount > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilterCount}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* ─── QUICK CATEGORY CHIPS ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Button
          variant={showSavedOnly ? 'default' : 'outline'}
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => setShowSavedOnly(!showSavedOnly)}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          Saved ({savedEvents.size})
        </Button>
        {quickCategories.map(cat => {
          const cfg = getCategoryConfig(cat);
          const Icon = cfg.icon;
          const isActive = selectedCategory === cat;
          return (
            <Button
              key={cat}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setSelectedCategory(isActive ? 'all' : cat)}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label}
            </Button>
          );
        })}
      </div>

      {/* ─── ADVANCED FILTERS (collapsible) ─── */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <SmartSearchMenu
              selectedCountry={selectedCountry === 'all' ? null : selectedCountry}
              selectedCity={selectedCity === 'all' ? null : selectedCity}
              onCountryChange={(code, name) => { setSelectedCountry(name); setSelectedCity('all'); }}
              onCityChange={city => setSelectedCity(city)}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="budget">Budget ($0-50)</SelectItem>
                  <SelectItem value="moderate">Moderate ($50-150)</SelectItem>
                  <SelectItem value="premium">Premium ($150+)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearAllFilters} className="w-full">
                <X className="h-4 w-4 mr-2" /> Clear All
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={showOnlyUpcoming ? 'default' : 'outline'} size="sm" onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}>
                <Calendar className="h-4 w-4 mr-1" />
                {showOnlyUpcoming ? 'Upcoming Only' : 'All Dates'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── LOCAL EVENTS (if location detected) ─── */}
      {topLocalEvents.length > 0 && !searchQuery && selectedCategory === 'all' && !showSavedOnly && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Near You — {currentLocation?.city}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {topLocalEvents.map(event => (
                <EventMiniCard key={event.id} event={event} onClick={() => setSelectedEvent(event)}
                  saved={savedEvents.has(event.id)} onToggleSave={handleToggleSave} getCategoryConfig={getCategoryConfig} formatEventDate={formatEventDate} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── EVENTS GRID ─── */}
      {filteredEvents.length > 0 ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, visibleEvents).map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
                saved={savedEvents.has(event.id)}
                onToggleSave={handleToggleSave}
                getCategoryConfig={getCategoryConfig}
                formatEventDate={formatEventDate}
              />
            ))}
          </div>
          {visibleEvents < filteredEvents.length && (
            <div className="flex justify-center">
              <Button onClick={() => setVisibleEvents(v => v + 24)} size="lg" variant="outline">
                Load More ({filteredEvents.length - visibleEvents} remaining)
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearAllFilters} variant="outline">Clear All Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* ─── EVENT DETAIL MODAL ─── */}
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} saved={selectedEvent ? savedEvents.has(selectedEvent.id) : false}
        onToggleSave={handleToggleSave} getCategoryConfig={getCategoryConfig} formatEventDate={formatEventDate} />
    </div>
  );
};

// ─── EVENT CARD COMPONENT ───
const EventCard: React.FC<{
  event: LocalEvent;
  onClick: () => void;
  saved: boolean;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  getCategoryConfig: (cat: EventCategory) => { label: string; icon: React.ElementType; color: string; bgColor: string };
  formatEventDate: (s: string, e?: string) => string;
}> = ({ event, onClick, saved, onToggleSave, getCategoryConfig, formatEventDate }) => {
  const cfg = getCategoryConfig(event.category);
  const Icon = cfg.icon;

  return (
    <Card className="hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${cfg.color}`} />
            <Badge variant="outline" className={`text-xs ${cfg.bgColor}`}>{cfg.label}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={e => onToggleSave(event.id, e)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
            {event.verified && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
          </div>
        </div>
        <CardTitle className="text-base line-clamp-2">{event.name}</CardTitle>
        <CardDescription className="text-xs">{event.city}, {event.country}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="line-clamp-1">{formatEventDate(event.startDate, event.endDate)}</span>
            {event.recurring && <Badge variant="secondary" className="text-[10px] h-4">{event.recurring}</Badge>}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" /><span>{event.time}</span>
          </div>
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, i) => <Badge key={i} variant="outline" className="text-[10px] h-4">{tag}</Badge>)}
          </div>
        )}
        {event.rating && <TrustRating rating={event.rating} reviews={event.reviews} showReviews={false} />}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t">
          {event.isFree ? (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">Free</Badge>
          ) : (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">{event.fee}</Badge>
          )}
          {event.ticketUrl && (
            <Button size="sm" variant="default" className="h-7 text-xs" onClick={e => { e.stopPropagation(); window.open(event.ticketUrl, '_blank'); }}>
              Get Tickets
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── MINI CARD (for local events) ───
const EventMiniCard: React.FC<{
  event: LocalEvent;
  onClick: () => void;
  saved: boolean;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  getCategoryConfig: (cat: EventCategory) => { label: string; icon: React.ElementType; color: string; bgColor: string };
  formatEventDate: (s: string, e?: string) => string;
}> = ({ event, onClick, saved, onToggleSave, getCategoryConfig, formatEventDate }) => {
  const cfg = getCategoryConfig(event.category);
  const Icon = cfg.icon;
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon className={`h-4 w-4 ${cfg.color}`} />
            <CardTitle className="text-sm line-clamp-1">{event.name}</CardTitle>
          </div>
          <button onClick={e => onToggleSave(event.id, e)} className="p-0.5 rounded hover:bg-muted">
            {saved ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" /> : <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /><span>{formatEventDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /><span>{event.time}</span>
        </div>
        {event.isFree ? (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-[10px]">Free</Badge>
        ) : (
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[10px]">{event.fee}</Badge>
        )}
      </CardContent>
    </Card>
  );
};

// ─── EVENT DETAIL MODAL ───
const EventDetailModal: React.FC<{
  event: LocalEvent | null;
  onClose: () => void;
  saved: boolean;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  getCategoryConfig: (cat: EventCategory) => { label: string; icon: React.ElementType; color: string; bgColor: string };
  formatEventDate: (s: string, e?: string) => string;
}> = ({ event, onClose, saved, onToggleSave, getCategoryConfig, formatEventDate }) => {
  if (!event) return null;
  const cfg = getCategoryConfig(event.category);
  const Icon = cfg.icon;

  return (
    <Dialog open={!!event} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${cfg.color}`} />
                <Badge variant="outline" className={cfg.bgColor}>{cfg.label}</Badge>
                {event.verified && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
              </div>
              <DialogTitle className="text-2xl">{event.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">{event.city}, {event.country}</DialogDescription>
            </div>
            <Button variant={saved ? 'default' : 'outline'} size="sm" onClick={() => onToggleSave(event.id)}>
              {saved ? <BookmarkCheck className="h-4 w-4 mr-1" /> : <Bookmark className="h-4 w-4 mr-1" />}
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <p className="text-muted-foreground">{event.description}</p>

          {/* Rating */}
          {event.rating && (
            <div className="flex items-center gap-3">
              <TrustRating rating={event.rating} reviews={event.reviews} />
              {event.trustBadges?.map((b, i) => <TrustBadge key={i} badge={b as any} showIcon={false} />)}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <DetailRow icon={Calendar} label="Date" value={<>
                {formatEventDate(event.startDate, event.endDate)}
                {event.recurring && <Badge variant="secondary" className="ml-2 text-xs">{event.recurring}</Badge>}
              </>} />
              <DetailRow icon={Clock} label="Time" value={event.time} />
              <DetailRow icon={MapPin} label="Location" value={<>
                <span>{event.venue || event.location}</span>
                <span className="text-xs block text-muted-foreground mt-0.5">{event.address}</span>
              </>} />
            </div>
            <div className="space-y-3">
              <DetailRow icon={User} label="Organizer" value={event.organizer} />
              <DetailRow icon={DollarSign} label="Price" value={event.isFree ? 'Free Entry' : event.fee || 'TBA'} />
              {event.capacity && (
                <DetailRow icon={Users} label="Capacity" value={`${event.attendees || 0} / ${event.capacity}`} />
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            {event.website && (
              <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Globe className="h-4 w-4" />{event.website}<ExternalLink className="h-3 w-3" />
              </a>
            )}
            {event.contactEmail && (
              <a href={`mailto:${event.contactEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />{event.contactEmail}
              </a>
            )}
          </div>

          {/* Extra details */}
          {(event.requirements || event.whatToBring || event.ageRestriction || event.accessibility) && (
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">Details</h4>
              {event.requirements && <div><span className="font-medium">Requirements:</span> {event.requirements.join(', ')}</div>}
              {event.whatToBring && <div><span className="font-medium">Bring:</span> {event.whatToBring.join(', ')}</div>}
              {event.ageRestriction && <div><span className="font-medium">Age:</span> {event.ageRestriction}</div>}
              {event.accessibility && <div><span className="font-medium">Accessibility:</span> {event.accessibility}</div>}
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag, i) => <Badge key={i} variant="outline">{tag}</Badge>)}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
            {event.ticketUrl && (
              <Button className="flex-1" size="lg" onClick={() => window.open(event.ticketUrl, '_blank')}>
                <Trophy className="h-4 w-4 mr-2" />Buy Tickets
              </Button>
            )}
            {event.registrationUrl && (
              <Button className="flex-1" variant={event.ticketUrl ? 'outline' : 'default'} onClick={() => window.open(event.registrationUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />Register
              </Button>
            )}
            {!event.ticketUrl && !event.registrationUrl && event.website && (
              <Button className="flex-1" onClick={() => window.open(event.website, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />Visit Website
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── DETAIL ROW ───
const DetailRow: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="font-medium text-sm">{label}</p>
      <div className="text-sm text-muted-foreground">{value}</div>
    </div>
  </div>
);

export default ExploreLocalLife;
