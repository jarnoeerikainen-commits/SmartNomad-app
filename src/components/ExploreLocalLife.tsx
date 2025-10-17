import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Filter,
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
  Leaf
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { format, addDays, addWeeks, addMonths, isBefore, startOfDay, parseISO, isAfter } from 'date-fns';

interface ExploreLocalLifeProps {
  currentLocation: LocationData | null;
}

interface LocalEvent {
  id: string;
  name: string;
  category: 'farmers-market' | 'business' | 'sports' | 'tournament' | 'gameday' | 
            'cultural' | 'workshop' | 'food' | 'wellness' | 'nightlife' | 
            'networking' | 'art' | 'music' | 'outdoor' | 'tech';
  city: string;
  country: string;
  location: string;
  startDate: string; // ISO date format
  endDate?: string; // For multi-day events
  time: string;
  description: string;
  isFree: boolean;
  fee?: string;
  verified: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly';
  tags?: string[];
  priceRange?: 'free' | 'budget' | 'moderate' | 'premium';
}

// Helper function to generate upcoming dates
const getUpcomingDate = (daysFromNow: number): string => {
  return format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');
};

// Comprehensive events data for 100 global cities
const generateMockEvents = (): LocalEvent[] => {
  const today = new Date();
  const events: LocalEvent[] = [];
  
  const citiesData = [
    // North America
    { city: 'New York', country: 'USA', timezone: 'EST' },
    { city: 'Los Angeles', country: 'USA', timezone: 'PST' },
    { city: 'San Francisco', country: 'USA', timezone: 'PST' },
    { city: 'Chicago', country: 'USA', timezone: 'CST' },
    { city: 'Miami', country: 'USA', timezone: 'EST' },
    { city: 'Austin', country: 'USA', timezone: 'CST' },
    { city: 'Seattle', country: 'USA', timezone: 'PST' },
    { city: 'Denver', country: 'USA', timezone: 'MST' },
    { city: 'Boston', country: 'USA', timezone: 'EST' },
    { city: 'Toronto', country: 'Canada', timezone: 'EST' },
    { city: 'Vancouver', country: 'Canada', timezone: 'PST' },
    { city: 'Montreal', country: 'Canada', timezone: 'EST' },
    { city: 'Mexico City', country: 'Mexico', timezone: 'CST' },
    { city: 'Cancun', country: 'Mexico', timezone: 'EST' },
    { city: 'Playa del Carmen', country: 'Mexico', timezone: 'EST' },
    
    // South America
    { city: 'Buenos Aires', country: 'Argentina', timezone: 'ART' },
    { city: 'Rio de Janeiro', country: 'Brazil', timezone: 'BRT' },
    { city: 'São Paulo', country: 'Brazil', timezone: 'BRT' },
    { city: 'Lima', country: 'Peru', timezone: 'PET' },
    { city: 'Bogotá', country: 'Colombia', timezone: 'COT' },
    { city: 'Medellín', country: 'Colombia', timezone: 'COT' },
    { city: 'Santiago', country: 'Chile', timezone: 'CLT' },
    { city: 'Quito', country: 'Ecuador', timezone: 'ECT' },
    
    // Europe
    { city: 'London', country: 'UK', timezone: 'GMT' },
    { city: 'Paris', country: 'France', timezone: 'CET' },
    { city: 'Berlin', country: 'Germany', timezone: 'CET' },
    { city: 'Amsterdam', country: 'Netherlands', timezone: 'CET' },
    { city: 'Barcelona', country: 'Spain', timezone: 'CET' },
    { city: 'Madrid', country: 'Spain', timezone: 'CET' },
    { city: 'Lisbon', country: 'Portugal', timezone: 'WET' },
    { city: 'Porto', country: 'Portugal', timezone: 'WET' },
    { city: 'Rome', country: 'Italy', timezone: 'CET' },
    { city: 'Milan', country: 'Italy', timezone: 'CET' },
    { city: 'Prague', country: 'Czech Republic', timezone: 'CET' },
    { city: 'Vienna', country: 'Austria', timezone: 'CET' },
    { city: 'Budapest', country: 'Hungary', timezone: 'CET' },
    { city: 'Warsaw', country: 'Poland', timezone: 'CET' },
    { city: 'Athens', country: 'Greece', timezone: 'EET' },
    { city: 'Istanbul', country: 'Turkey', timezone: 'TRT' },
    { city: 'Copenhagen', country: 'Denmark', timezone: 'CET' },
    { city: 'Stockholm', country: 'Sweden', timezone: 'CET' },
    { city: 'Oslo', country: 'Norway', timezone: 'CET' },
    { city: 'Helsinki', country: 'Finland', timezone: 'EET' },
    { city: 'Dublin', country: 'Ireland', timezone: 'GMT' },
    { city: 'Edinburgh', country: 'UK', timezone: 'GMT' },
    { city: 'Brussels', country: 'Belgium', timezone: 'CET' },
    { city: 'Zurich', country: 'Switzerland', timezone: 'CET' },
    { city: 'Geneva', country: 'Switzerland', timezone: 'CET' },
    
    // Asia
    { city: 'Bangkok', country: 'Thailand', timezone: 'ICT' },
    { city: 'Chiang Mai', country: 'Thailand', timezone: 'ICT' },
    { city: 'Singapore', country: 'Singapore', timezone: 'SGT' },
    { city: 'Tokyo', country: 'Japan', timezone: 'JST' },
    { city: 'Seoul', country: 'South Korea', timezone: 'KST' },
    { city: 'Hong Kong', country: 'Hong Kong', timezone: 'HKT' },
    { city: 'Shanghai', country: 'China', timezone: 'CST' },
    { city: 'Beijing', country: 'China', timezone: 'CST' },
    { city: 'Taipei', country: 'Taiwan', timezone: 'CST' },
    { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'MYT' },
    { city: 'Hanoi', country: 'Vietnam', timezone: 'ICT' },
    { city: 'Ho Chi Minh', country: 'Vietnam', timezone: 'ICT' },
    { city: 'Manila', country: 'Philippines', timezone: 'PHT' },
    { city: 'Jakarta', country: 'Indonesia', timezone: 'WIB' },
    { city: 'Bali', country: 'Indonesia', timezone: 'WITA' },
    { city: 'Mumbai', country: 'India', timezone: 'IST' },
    { city: 'Delhi', country: 'India', timezone: 'IST' },
    { city: 'Bangalore', country: 'India', timezone: 'IST' },
    { city: 'Dubai', country: 'UAE', timezone: 'GST' },
    { city: 'Tel Aviv', country: 'Israel', timezone: 'IST' },
    
    // Oceania
    { city: 'Sydney', country: 'Australia', timezone: 'AEDT' },
    { city: 'Melbourne', country: 'Australia', timezone: 'AEDT' },
    { city: 'Brisbane', country: 'Australia', timezone: 'AEST' },
    { city: 'Perth', country: 'Australia', timezone: 'AWST' },
    { city: 'Auckland', country: 'New Zealand', timezone: 'NZDT' },
    { city: 'Wellington', country: 'New Zealand', timezone: 'NZDT' },
    
    // Africa
    { city: 'Cape Town', country: 'South Africa', timezone: 'SAST' },
    { city: 'Johannesburg', country: 'South Africa', timezone: 'SAST' },
    { city: 'Nairobi', country: 'Kenya', timezone: 'EAT' },
    { city: 'Lagos', country: 'Nigeria', timezone: 'WAT' },
    { city: 'Marrakech', country: 'Morocco', timezone: 'WET' },
    { city: 'Cairo', country: 'Egypt', timezone: 'EET' },
    
    // Additional Popular Digital Nomad Destinations
    { city: 'Tbilisi', country: 'Georgia', timezone: 'GET' },
    { city: 'Split', country: 'Croatia', timezone: 'CET' },
    { city: 'Dubrovnik', country: 'Croatia', timezone: 'CET' },
    { city: 'Tallinn', country: 'Estonia', timezone: 'EET' },
    { city: 'Riga', country: 'Latvia', timezone: 'EET' },
    { city: 'Vilnius', country: 'Lithuania', timezone: 'EET' },
    { city: 'Porto Alegre', country: 'Brazil', timezone: 'BRT' },
    { city: 'Montevideo', country: 'Uruguay', timezone: 'UYT' },
    { city: 'Panama City', country: 'Panama', timezone: 'EST' },
    { city: 'San José', country: 'Costa Rica', timezone: 'CST' },
    { city: 'Tulum', country: 'Mexico', timezone: 'EST' },
    { city: 'Da Nang', country: 'Vietnam', timezone: 'ICT' },
    { city: 'Penang', country: 'Malaysia', timezone: 'MYT' },
    { city: 'Colombo', country: 'Sri Lanka', timezone: 'IST' },
    { city: 'Kathmandu', country: 'Nepal', timezone: 'NPT' },
    { city: 'Bishkek', country: 'Kyrgyzstan', timezone: 'KGT' },
    { city: 'Almaty', country: 'Kazakhstan', timezone: 'ALMT' }
  ];

  let eventId = 1;

  citiesData.forEach((cityData, index) => {
    const baseDate = addDays(today, Math.floor(index / 10));
    
    // Farmers Markets
    events.push({
      id: `event-${eventId++}`,
      name: `${cityData.city} Fresh Market`,
      category: 'farmers-market',
      city: cityData.city,
      country: cityData.country,
      location: `Central Market District, ${cityData.city}`,
      startDate: format(baseDate, 'yyyy-MM-dd'),
      time: '07:00 - 14:00',
      description: `Fresh local produce, artisanal foods, and handcrafted goods from regional farmers and makers`,
      isFree: true,
      verified: true,
      recurring: 'weekly',
      tags: ['organic', 'local', 'food'],
      priceRange: 'free'
    });

    // Business Networking
    events.push({
      id: `event-${eventId++}`,
      name: `Digital Nomad Meetup ${cityData.city}`,
      category: 'networking',
      city: cityData.city,
      country: cityData.country,
      location: `Co-working Hub, ${cityData.city}`,
      startDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      time: '18:00 - 21:00',
      description: 'Connect with fellow remote workers, entrepreneurs, and digital nomads. Share experiences and build your network',
      isFree: true,
      verified: true,
      recurring: 'weekly',
      tags: ['networking', 'remote work', 'community'],
      priceRange: 'free'
    });

    // Sports & Wellness
    events.push({
      id: `event-${eventId++}`,
      name: `${cityData.city} Running Club`,
      category: 'sports',
      city: cityData.city,
      country: cityData.country,
      location: `City Park, ${cityData.city}`,
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      time: '06:30 - 07:30',
      description: 'Morning run for all fitness levels. Free, friendly, and a great way to start your day',
      isFree: true,
      verified: true,
      recurring: 'daily',
      tags: ['running', 'fitness', 'morning'],
      priceRange: 'free'
    });

    // Cultural Events
    events.push({
      id: `event-${eventId++}`,
      name: `Cultural Evening at ${cityData.city}`,
      category: 'cultural',
      city: cityData.city,
      country: cityData.country,
      location: `Cultural Center, ${cityData.city}`,
      startDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      time: '19:00 - 22:00',
      description: 'Experience traditional music, dance, and cuisine from the local culture',
      isFree: false,
      fee: '$15-25',
      verified: true,
      tags: ['culture', 'traditional', 'evening'],
      priceRange: 'budget'
    });

    // Tech Events
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Tech Startup Pitch Night`,
        category: 'tech',
        city: cityData.city,
        country: cityData.country,
        location: `Innovation Hub, ${cityData.city}`,
        startDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
        time: '18:30 - 21:30',
        description: 'Watch local startups pitch their ideas. Network with founders and investors',
        isFree: true,
        verified: true,
        tags: ['startups', 'tech', 'innovation'],
        priceRange: 'free'
      });
    }

    // Tournaments
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.city} Football Tournament`,
        category: 'tournament',
        city: cityData.city,
        country: cityData.country,
        location: `Sports Complex, ${cityData.city}`,
        startDate: format(addDays(baseDate, 14), 'yyyy-MM-dd'),
        endDate: format(addDays(baseDate, 16), 'yyyy-MM-dd'),
        time: '09:00 - 18:00',
        description: 'International amateur football tournament. All skill levels welcome',
        isFree: false,
        fee: '$50 per team',
        verified: true,
        tags: ['football', 'tournament', 'sports'],
        priceRange: 'budget'
      });
    }

    // Game Days
    if (index % 3 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Board Game Night`,
        category: 'gameday',
        city: cityData.city,
        country: cityData.country,
        location: `Game Café, ${cityData.city}`,
        startDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
        time: '19:00 - 23:00',
        description: 'Casual board game evening. Bring friends or make new ones',
        isFree: false,
        fee: '$5-10',
        verified: true,
        recurring: 'weekly',
        tags: ['games', 'social', 'indoor'],
        priceRange: 'budget'
      });
    }

    // Food Tours
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.city} Street Food Tour`,
        category: 'food',
        city: cityData.city,
        country: cityData.country,
        location: `Old Town, ${cityData.city}`,
        startDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
        time: '17:00 - 20:00',
        description: 'Guided tour through the best street food spots. Taste authentic local cuisine',
        isFree: false,
        fee: '$35-45',
        verified: true,
        tags: ['food', 'tour', 'local cuisine'],
        priceRange: 'moderate'
      });
    }

    // Workshops
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Photography Workshop`,
        category: 'workshop',
        city: cityData.city,
        country: cityData.country,
        location: `Art Studio, ${cityData.city}`,
        startDate: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
        time: '10:00 - 16:00',
        description: 'Learn urban photography techniques from a professional. Camera provided if needed',
        isFree: false,
        fee: '$60-80',
        verified: true,
        tags: ['photography', 'learning', 'creative'],
        priceRange: 'moderate'
      });
    }

    // Art Events
    if (index % 6 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.city} Art Gallery Night`,
        category: 'art',
        city: cityData.city,
        country: cityData.country,
        location: `Art District, ${cityData.city}`,
        startDate: format(addDays(baseDate, 8), 'yyyy-MM-dd'),
        time: '18:00 - 22:00',
        description: 'Free entry to multiple galleries. Meet artists and enjoy complimentary wine',
        isFree: true,
        verified: true,
        tags: ['art', 'culture', 'evening'],
        priceRange: 'free'
      });
    }

    // Music Events
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Live Jazz Night`,
        category: 'music',
        city: cityData.city,
        country: cityData.country,
        location: `Jazz Club, ${cityData.city}`,
        startDate: format(addDays(baseDate, 9), 'yyyy-MM-dd'),
        time: '20:00 - 00:00',
        description: 'Live jazz performance featuring local and international musicians',
        isFree: false,
        fee: '$20-30',
        verified: true,
        recurring: 'weekly',
        tags: ['music', 'jazz', 'nightlife'],
        priceRange: 'budget'
      });
    }

    // Wellness Events
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Sunrise Yoga Session`,
        category: 'wellness',
        city: cityData.city,
        country: cityData.country,
        location: `Beach/Park, ${cityData.city}`,
        startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
        time: '06:00 - 07:00',
        description: 'Start your day with peaceful yoga overlooking beautiful views',
        isFree: true,
        verified: true,
        recurring: 'daily',
        tags: ['yoga', 'wellness', 'morning'],
        priceRange: 'free'
      });
    }

    // Nightlife
    if (index % 7 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Rooftop Party ${cityData.city}`,
        category: 'nightlife',
        city: cityData.city,
        country: cityData.country,
        location: `Sky Bar, ${cityData.city}`,
        startDate: format(addDays(baseDate, 12), 'yyyy-MM-dd'),
        time: '21:00 - 03:00',
        description: 'Dance under the stars with DJ sets and stunning city views',
        isFree: false,
        fee: '$15-25',
        verified: true,
        tags: ['party', 'nightlife', 'rooftop'],
        priceRange: 'budget'
      });
    }

    // Outdoor Activities
    if (index % 6 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Hiking Adventure`,
        category: 'outdoor',
        city: cityData.city,
        country: cityData.country,
        location: `Nature Reserve near ${cityData.city}`,
        startDate: format(addDays(baseDate, 11), 'yyyy-MM-dd'),
        time: '08:00 - 14:00',
        description: 'Guided hike through scenic trails. All fitness levels welcome',
        isFree: false,
        fee: '$25-35',
        verified: true,
        tags: ['hiking', 'outdoor', 'nature'],
        priceRange: 'budget'
      });
    }

    // Business Conferences
    if (index % 8 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.city} Business Summit`,
        category: 'business',
        city: cityData.city,
        country: cityData.country,
        location: `Convention Center, ${cityData.city}`,
        startDate: format(addDays(baseDate, 20), 'yyyy-MM-dd'),
        endDate: format(addDays(baseDate, 22), 'yyyy-MM-dd'),
        time: '09:00 - 18:00',
        description: 'Three-day business conference with keynote speakers and networking opportunities',
        isFree: false,
        fee: '$200-500',
        verified: true,
        tags: ['business', 'conference', 'networking'],
        priceRange: 'premium'
      });
    }
  });

  return events;
};

const mockEvents = generateMockEvents();

const categoryConfig = {
  'farmers-market': {
    label: 'Farmers Markets',
    icon: ShoppingBag,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20'
  },
  'business': {
    label: 'Business & Conferences',
    icon: Briefcase,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20'
  },
  'sports': {
    label: 'Sports & Fitness',
    icon: Dumbbell,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
  'tournament': {
    label: 'Tournaments',
    icon: Trophy,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20'
  },
  'gameday': {
    label: 'Game Days',
    icon: Gamepad2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20'
  },
  'cultural': {
    label: 'Cultural Events',
    icon: PartyPopper,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10 border-pink-500/20'
  },
  'workshop': {
    label: 'Workshops & Classes',
    icon: GraduationCap,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20'
  },
  'food': {
    label: 'Food & Dining',
    icon: Pizza,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20'
  },
  'wellness': {
    label: 'Wellness & Yoga',
    icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20'
  },
  'nightlife': {
    label: 'Nightlife & Parties',
    icon: Music,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20'
  },
  'networking': {
    label: 'Networking Events',
    icon: Users,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20'
  },
  'art': {
    label: 'Arts & Culture',
    icon: Palette,
    color: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/10 border-fuchsia-500/20'
  },
  'music': {
    label: 'Live Music',
    icon: Music,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10 border-teal-500/20'
  },
  'outdoor': {
    label: 'Outdoor Adventures',
    icon: Leaf,
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-500/10 border-lime-500/20'
  },
  'tech': {
    label: 'Tech & Startups',
    icon: Wrench,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10 border-sky-500/20'
  }
};

const ExploreLocalLife: React.FC<ExploreLocalLifeProps> = ({ currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState(24);

  // Get unique cities and countries for filters
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(mockEvents.map(event => event.city)));
    return uniqueCities.sort();
  }, []);

  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(mockEvents.map(event => event.country)));
    return uniqueCountries.sort();
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents;

    // Filter out expired events if showOnlyUpcoming is true
    if (showOnlyUpcoming) {
      const today = startOfDay(new Date());
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.startDate);
        return isAfter(eventDate, today) || event.recurring;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.country.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(event => event.city === selectedCity);
    }

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(event => event.country === selectedCountry);
    }

    // Filter by price
    if (priceFilter === 'free') {
      filtered = filtered.filter(event => event.isFree);
    } else if (priceFilter !== 'all') {
      filtered = filtered.filter(event => event.priceRange === priceFilter);
    }

    // Sort: current location first, then by date
    return filtered.sort((a, b) => {
      if (currentLocation?.city) {
        const aIsLocal = a.city.toLowerCase() === currentLocation.city.toLowerCase();
        const bIsLocal = b.city.toLowerCase() === currentLocation.city.toLowerCase();
        
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
      }
      
      const dateA = parseISO(a.startDate);
      const dateB = parseISO(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [searchQuery, selectedCategory, selectedCity, selectedCountry, priceFilter, showOnlyUpcoming, currentLocation]);

  // Get top local events
  const topLocalEvents = useMemo(() => {
    if (!currentLocation?.city) return [];
    
    const today = startOfDay(new Date());
    return mockEvents
      .filter(event => {
        const eventDate = parseISO(event.startDate);
        return event.city.toLowerCase() === currentLocation.city.toLowerCase() && 
               (isAfter(eventDate, today) || event.recurring);
      })
      .slice(0, 3);
  }, [currentLocation]);

  const getCategoryIcon = (category: LocalEvent['category']) => {
    const Icon = categoryConfig[category].icon;
    return <Icon className={`h-5 w-5 ${categoryConfig[category].color}`} />;
  };

  const formatEventDate = (startDate: string, endDate?: string): string => {
    try {
      const start = parseISO(startDate);
      const formattedStart = format(start, 'MMM dd, yyyy');
      
      if (endDate) {
        const end = parseISO(endDate);
        const formattedEnd = format(end, 'MMM dd, yyyy');
        return `${formattedStart} - ${formattedEnd}`;
      }
      
      return formattedStart;
    } catch {
      return startDate;
    }
  };

  const loadMore = () => {
    setVisibleEvents(prev => prev + 24);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedCountry('all');
    setPriceFilter('all');
    setVisibleEvents(24);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Explore Local Life</h1>
        </div>
        <p className="text-muted-foreground">
          Discover amazing events, activities, and experiences in 100+ cities worldwide. From sports tournaments to cultural events, business networking to local markets.
        </p>
      </div>

      {/* Current Location Events */}
      {topLocalEvents.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Happening in {currentLocation?.city}</CardTitle>
            </div>
            <CardDescription>Top upcoming events near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {topLocalEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(event.category)}
                        <CardTitle className="text-base line-clamp-1">{event.name}</CardTitle>
                      </div>
                      {event.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatEventDate(event.startDate, event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.isFree ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          <Heart className="h-3 w-3 mr-1" />
                          Free
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {event.fee}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Find Events</CardTitle>
            </div>
            <Badge variant="secondary">{filteredEvents.length} events found</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, locations, activities, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="budget">Budget ($0-50)</SelectItem>
                <SelectItem value="moderate">Moderate ($50-150)</SelectItem>
                <SelectItem value="premium">Premium ($150+)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Upcoming Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyUpcoming ? "default" : "outline"}
              onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {showOnlyUpcoming ? 'Showing Upcoming Events' : 'Show All Events'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, visibleEvents).map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(event.category)}
                      <Badge variant="outline" className={categoryConfig[event.category].bgColor}>
                        {categoryConfig[event.category].label}
                      </Badge>
                    </div>
                    {event.verified && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{event.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {event.city}, {event.country}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{formatEventDate(event.startDate, event.endDate)}</span>
                      {event.recurring && (
                        <Badge variant="secondary" className="text-xs">
                          {event.recurring}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {event.isFree ? (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                        <Heart className="h-3 w-3 mr-1" />
                        Free Entry
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {event.fee}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {visibleEvents < filteredEvents.length && (
            <div className="flex justify-center">
              <Button onClick={loadMore} size="lg" variant="outline">
                Load More Events ({filteredEvents.length - visibleEvents} remaining)
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
              Try adjusting your filters or search query to discover more events
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExploreLocalLife;
