import React, { useState, useMemo, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { format, addDays, addWeeks, addMonths, isBefore, startOfDay, parseISO, isAfter } from 'date-fns';
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
  category: 'farmers-market' | 'business' | 'sports' | 'tournament' | 'gameday' | 
            'cultural' | 'workshop' | 'food' | 'wellness' | 'nightlife' | 
            'networking' | 'art' | 'music' | 'outdoor' | 'tech' | 
            'soccer' | 'nba' | 'american-football' | 'cricket' | 'rugby' | 
            'basketball' | 'cycling' | 'triathlon' | 'motorsports' | 'fighting';
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
  // Trust AI fields
  rating?: number;
  reviews?: number;
  trustBadges?: string[];
  // Existing detailed fields
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

// Helper function to generate upcoming dates
const getUpcomingDate = (daysFromNow: number): string => {
  return format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');
};

// Generate events using centralized cities data for consistency
const generateMockEvents = (): LocalEvent[] => {
  const today = new Date();
  const events: LocalEvent[] = [];
  
  // Get all active cities from our centralized database
  const activeCities = getAllCities();
  
  // Helper to map country codes to full names
  const getCountryName = (code: string): string => {
    const countryMap: Record<string, string> = {
      'US': 'USA', 'GB': 'UK', 'ES': 'Spain', 'PT': 'Portugal', 'FR': 'France',
      'DE': 'Germany', 'TH': 'Thailand', 'MX': 'Mexico', 'ID': 'Indonesia',
      'AU': 'Australia', 'CA': 'Canada', 'JP': 'Japan', 'IT': 'Italy',
      'NL': 'Netherlands', 'GR': 'Greece', 'BR': 'Brazil', 'CO': 'Colombia',
      'AR': 'Argentina', 'AE': 'UAE', 'SG': 'Singapore', 'VN': 'Vietnam',
      'MY': 'Malaysia', 'PH': 'Philippines', 'KR': 'South Korea', 'TR': 'Turkey',
      'AT': 'Austria', 'CZ': 'Czech Republic', 'PL': 'Poland', 'HU': 'Hungary',
      'DK': 'Denmark', 'SE': 'Sweden', 'NO': 'Norway', 'FI': 'Finland',
      'IE': 'Ireland', 'BE': 'Belgium', 'CH': 'Switzerland', 'HR': 'Croatia',
      'NZ': 'New Zealand', 'ZA': 'South Africa', 'CL': 'Chile', 'PE': 'Peru',
      'CR': 'Costa Rica', 'PA': 'Panama', 'EE': 'Estonia', 'LV': 'Latvia',
      'LT': 'Lithuania', 'GE': 'Georgia', 'MA': 'Morocco', 'EG': 'Egypt',
      'IL': 'Israel', 'IN': 'India', 'HK': 'Hong Kong', 'TW': 'Taiwan'
    };
    return countryMap[code] || code;
  };

  let eventId = 1;

  activeCities.forEach((cityData, index) => {
    const countryName = getCountryName(cityData.country_code);
    const baseDate = addDays(today, Math.floor(index / 10));
    
    // Farmers Markets
    events.push({
      id: `event-${eventId++}`,
      name: `${cityData.name} Fresh Market`,
      category: 'farmers-market',
      city: cityData.name,
      country: countryName,
      location: `Central Market District, ${cityData.name}`,
      startDate: format(baseDate, 'yyyy-MM-dd'),
      time: '07:00 - 14:00',
      description: `🥕 Fresh local produce, artisanal foods, and handcrafted goods from regional farmers and makers`,
      isFree: true,
      verified: true,
      recurring: 'weekly',
      tags: ['organic', 'local', 'food'],
      priceRange: 'free',
      organizer: `${cityData.name} Farmers Market Association`,
      address: `Main Square, Central Market District, ${cityData.name}`,
      website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}farmersmarket.com`,
      contactEmail: `info@${cityData.name.toLowerCase().replace(/\s/g, '')}market.com`,
      contactPhone: '+1-555-MARKET',
      accessibility: 'Wheelchair accessible',
      whatToBring: ['Reusable bags', 'Cash (some vendors)'],
      rating: 4.6 + Math.random() * 0.3,
      reviews: 120 + Math.floor(Math.random() * 200),
      trustBadges: ['Verified Local', 'Local Gem']
    });

    // Business Networking
    events.push({
      id: `event-${eventId++}`,
      name: `Digital Nomad Meetup ${cityData.name}`,
      category: 'networking',
      city: cityData.name,
      country: countryName,
      location: `Co-working Hub, ${cityData.name}`,
      startDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      time: '18:00 - 21:00',
      description: '💼 Connect with fellow remote workers, entrepreneurs, and digital nomads. Share experiences and build your network',
      isFree: true,
      verified: true,
      recurring: 'weekly',
      tags: ['networking', 'remote work', 'community'],
      priceRange: 'free',
      organizer: 'Digital Nomads Network',
      address: `123 Innovation Street, ${cityData.name}`,
      website: 'https://www.digitalnomads.com',
      registrationUrl: `https://www.meetup.com/digital-nomads-${cityData.name.toLowerCase().replace(/\s/g, '-')}`,
      contactEmail: `${cityData.name.toLowerCase().replace(/\s/g, '')}@digitalnomads.com`,
      capacity: 50,
      attendees: 35,
      rating: 4.7 + Math.random() * 0.2,
      reviews: 80 + Math.floor(Math.random() * 150),
      trustBadges: ['Nomad Favorite', 'Traveler Favorite']
    });

    // Sports & Wellness
    events.push({
      id: `event-${eventId++}`,
      name: `${cityData.name} Running Club`,
      category: 'sports',
      city: cityData.name,
      country: countryName,
      location: `City Park, ${cityData.name}`,
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      time: '06:30 - 07:30',
      description: 'Morning run for all fitness levels. Free, friendly, and a great way to start your day',
      isFree: true,
      verified: true,
      recurring: 'daily',
      tags: ['running', 'fitness', 'morning'],
      priceRange: 'free',
      organizer: `${cityData.name} Runners Association`,
      address: `Main Entrance, City Park, ${cityData.name}`,
      website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}runners.com`,
      contactEmail: `run@${cityData.name.toLowerCase().replace(/\s/g, '')}club.com`,
      whatToBring: ['Running shoes', 'Water bottle', 'Comfortable clothes']
    });

    // Cultural Events
    events.push({
      id: `event-${eventId++}`,
      name: `Cultural Evening at ${cityData.name}`,
      category: 'cultural',
      city: cityData.name,
      country: countryName,
      location: `Cultural Center, ${cityData.name}`,
      startDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      time: '19:00 - 22:00',
      description: 'Experience traditional music, dance, and cuisine from the local culture',
      isFree: false,
      fee: '$15-25',
      verified: true,
      tags: ['culture', 'traditional', 'evening'],
      priceRange: 'budget',
      organizer: `${cityData.name} Cultural Foundation`,
      address: `45 Heritage Avenue, ${cityData.name}`,
      website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}culture.org`,
      registrationUrl: `https://tickets.${cityData.name.toLowerCase().replace(/\s/g, '')}culture.org`,
      contactEmail: `events@${cityData.name.toLowerCase().replace(/\s/g, '')}culture.org`,
      contactPhone: '+1-555-CULTURE',
      capacity: 150,
      attendees: 120
    });

    // Tech Events
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Tech Startup Pitch Night`,
        category: 'tech',
        city: cityData.name,
        country: countryName,
        location: `Innovation Hub, ${cityData.name}`,
        startDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
        time: '18:30 - 21:30',
        description: 'Watch local startups pitch their ideas. Network with founders and investors',
        isFree: true,
        verified: true,
        tags: ['startups', 'tech', 'innovation'],
        priceRange: 'free',
        organizer: 'Startup Weekend Community',
        address: `Innovation District, ${cityData.name}`,
        website: 'https://www.startupweekend.org',
        registrationUrl: 'https://www.eventbrite.com/e/startup-pitch-night',
        contactEmail: `${cityData.name.toLowerCase().replace(/\s/g, '')}@startupweekend.org`,
        capacity: 100,
        attendees: 75
      });
    }

    // Tournaments
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.name} Football Tournament`,
        category: 'tournament',
        city: cityData.name,
        country: countryName,
        location: `Sports Complex, ${cityData.name}`,
        startDate: format(addDays(baseDate, 14), 'yyyy-MM-dd'),
        endDate: format(addDays(baseDate, 16), 'yyyy-MM-dd'),
        time: '09:00 - 18:00',
        description: 'International amateur football tournament. All skill levels welcome',
        isFree: false,
        fee: '$50 per team',
        verified: true,
        tags: ['football', 'tournament', 'sports'],
        priceRange: 'budget',
        organizer: `${cityData.name} Football Federation`,
        address: `Olympic Sports Complex, ${cityData.name}`,
        website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}football.com`,
        registrationUrl: `https://register.${cityData.name.toLowerCase().replace(/\s/g, '')}football.com`,
        contactEmail: `tournaments@${cityData.name.toLowerCase().replace(/\s/g, '')}football.com`,
        contactPhone: '+1-555-SOCCER',
        capacity: 16,
        attendees: 12,
        requirements: ['Team registration', 'Insurance', 'Medical clearance'],
        whatToBring: ['Football boots', 'Shin guards', 'Team uniform', 'Water']
      });
    }

    // Game Days
    if (index % 3 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Board Game Night`,
        category: 'gameday',
        city: cityData.name,
        country: countryName,
        location: `Game Café, ${cityData.name}`,
        startDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
        time: '19:00 - 23:00',
        description: 'Casual board game evening. Bring friends or make new ones',
        isFree: false,
        fee: '$5-10',
        verified: true,
        recurring: 'weekly',
        tags: ['games', 'social', 'indoor'],
        priceRange: 'budget',
        organizer: 'Board Gamers Society',
        address: `789 Game Street, ${cityData.name}`,
        website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}games.com`,
        contactEmail: `play@${cityData.name.toLowerCase().replace(/\s/g, '')}games.com`,
        contactPhone: '+1-555-GAMES',
        capacity: 40,
        attendees: 28
      });
    }

    // Food Tours
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.name} Street Food Tour`,
        category: 'food',
        city: cityData.name,
        country: countryName,
        location: `Old Town, ${cityData.name}`,
        startDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
        time: '17:00 - 20:00',
        description: 'Guided tour through the best street food spots. Taste authentic local cuisine',
        isFree: false,
        fee: '$35-45',
        verified: true,
        tags: ['food', 'tour', 'local cuisine'],
        priceRange: 'moderate',
        organizer: 'Foodie Adventures',
        address: `Old Town Square, ${cityData.name}`,
        website: 'https://www.foodieadventures.com',
        registrationUrl: `https://book.foodieadventures.com/${cityData.name.toLowerCase().replace(/\s/g, '-')}`,
        contactEmail: `tours@foodieadventures.com`,
        contactPhone: '+1-555-FOODIE',
        capacity: 15,
        attendees: 12,
        requirements: ['Comfortable walking shoes'],
        whatToBring: ['Appetite', 'Camera', 'Cash for extras']
      });
    }

    // Workshops
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Photography Workshop`,
        category: 'workshop',
        city: cityData.name,
        country: countryName,
        location: `Art Studio, ${cityData.name}`,
        startDate: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
        time: '10:00 - 16:00',
        description: 'Learn urban photography techniques from a professional. Camera provided if needed',
        isFree: false,
        fee: '$60-80',
        verified: true,
        tags: ['photography', 'learning', 'creative'],
        priceRange: 'moderate',
        organizer: 'Creative Arts Academy',
        address: `456 Arts Boulevard, ${cityData.name}`,
        website: 'https://www.creativearts.academy',
        registrationUrl: 'https://register.creativearts.academy/photography',
        contactEmail: 'workshops@creativearts.academy',
        contactPhone: '+1-555-PHOTO',
        capacity: 20,
        attendees: 15,
        requirements: ['Basic photography knowledge helpful but not required'],
        whatToBring: ['Camera (DSLR/Mirrorless preferred)', 'Notebook', 'Lunch']
      });
    }

    // Art Events
    if (index % 6 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.name} Art Gallery Night`,
        category: 'art',
        city: cityData.name,
        country: countryName,
        location: `Art District, ${cityData.name}`,
        startDate: format(addDays(baseDate, 8), 'yyyy-MM-dd'),
        time: '18:00 - 22:00',
        description: 'Free entry to multiple galleries. Meet artists and enjoy complimentary wine',
        isFree: true,
        verified: true,
        tags: ['art', 'culture', 'evening'],
        priceRange: 'free',
        organizer: `${cityData.name} Arts Council`,
        address: `Gallery Row, Arts District, ${cityData.name}`,
        website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}arts.org`,
        contactEmail: `info@${cityData.name.toLowerCase().replace(/\s/g, '')}arts.org`,
        ageRestriction: '21+ (wine service)',
        accessibility: 'All galleries wheelchair accessible'
      });
    }

    // Music Events
    if (index % 5 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Live Jazz Night`,
        category: 'music',
        city: cityData.name,
        country: countryName,
        location: `Jazz Club, ${cityData.name}`,
        startDate: format(addDays(baseDate, 9), 'yyyy-MM-dd'),
        time: '20:00 - 00:00',
        description: 'Live jazz performance featuring local and international musicians',
        isFree: false,
        fee: '$20-30',
        verified: true,
        recurring: 'weekly',
        tags: ['music', 'jazz', 'nightlife'],
        priceRange: 'budget',
        organizer: `${cityData.name} Jazz Society`,
        address: `Jazz Quarter, ${cityData.name}`,
        website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}jazz.com`,
        registrationUrl: `https://tickets.${cityData.name.toLowerCase().replace(/\s/g, '')}jazz.com`,
        contactEmail: `bookings@${cityData.name.toLowerCase().replace(/\s/g, '')}jazz.com`,
        contactPhone: '+1-555-JAZZZ',
        capacity: 80,
        attendees: 65,
        ageRestriction: '18+'
      });
    }

    // Wellness Events
    if (index % 4 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Sunrise Yoga Session`,
        category: 'wellness',
        city: cityData.name,
        country: countryName,
        location: `Beach/Park, ${cityData.name}`,
        startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
        time: '06:00 - 07:00',
        description: 'Start your day with peaceful yoga overlooking beautiful views',
        isFree: true,
        verified: true,
        recurring: 'daily',
        tags: ['yoga', 'wellness', 'morning'],
        priceRange: 'free',
        organizer: 'Wellness Warriors Community',
        address: `Sunrise Point, ${cityData.name}`,
        website: 'https://www.wellnesswarriors.com',
        contactEmail: `${cityData.name.toLowerCase().replace(/\s/g, '')}@wellnesswarriors.com`,
        whatToBring: ['Yoga mat', 'Water bottle', 'Towel', 'Comfortable clothes'],
        accessibility: 'Suitable for all fitness levels'
      });
    }

    // Nightlife
    if (index % 7 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Rooftop Party ${cityData.name}`,
        category: 'nightlife',
        city: cityData.name,
        country: countryName,
        location: `Sky Bar, ${cityData.name}`,
        startDate: format(addDays(baseDate, 12), 'yyyy-MM-dd'),
        time: '21:00 - 03:00',
        description: 'Dance under the stars with DJ sets and stunning city views',
        isFree: false,
        fee: '$15-25',
        verified: true,
        tags: ['party', 'nightlife', 'rooftop'],
        priceRange: 'budget',
        organizer: 'Skyline Entertainment',
        address: `Penthouse Level, Downtown Tower, ${cityData.name}`,
        website: 'https://www.skylineentertainment.com',
        registrationUrl: `https://tickets.skylineentertainment.com/${cityData.name.toLowerCase().replace(/\s/g, '-')}`,
        contactEmail: 'events@skylineentertainment.com',
        ageRestriction: '21+',
        capacity: 200,
        attendees: 180
      });
    }

    // Outdoor Activities
    if (index % 6 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `Hiking Adventure`,
        category: 'outdoor',
        city: cityData.name,
        country: countryName,
        location: `Nature Reserve near ${cityData.name}`,
        startDate: format(addDays(baseDate, 11), 'yyyy-MM-dd'),
        time: '08:00 - 14:00',
        description: 'Guided hike through scenic trails. All fitness levels welcome',
        isFree: false,
        fee: '$25-35',
        verified: true,
        tags: ['hiking', 'outdoor', 'nature'],
        priceRange: 'budget',
        organizer: 'Outdoor Adventures Co',
        address: `Nature Reserve Visitor Center, ${cityData.name}`,
        website: 'https://www.outdooradventures.co',
        registrationUrl: 'https://book.outdooradventures.co/hiking',
        contactEmail: 'adventures@outdooradventures.co',
        contactPhone: '+1-555-HIKE',
        capacity: 25,
        attendees: 18,
        requirements: ['Moderate fitness level', 'Closed-toe shoes'],
        whatToBring: ['Hiking boots', 'Backpack', 'Water (2L)', 'Snacks', 'Sunscreen', 'Hat']
      });
    }

    // Business Conferences
    if (index % 8 === 0) {
      events.push({
        id: `event-${eventId++}`,
        name: `${cityData.name} Business Summit`,
        category: 'business',
        city: cityData.name,
        country: countryName,
        location: `Convention Center, ${cityData.name}`,
        startDate: format(addDays(baseDate, 20), 'yyyy-MM-dd'),
        endDate: format(addDays(baseDate, 22), 'yyyy-MM-dd'),
        time: '09:00 - 18:00',
        description: 'Three-day business conference with keynote speakers and networking opportunities',
        isFree: false,
        fee: '$200-500',
        verified: true,
        tags: ['business', 'conference', 'networking'],
        priceRange: 'premium',
        organizer: 'Global Business Forum',
        address: `International Convention Center, ${cityData.name}`,
        website: `https://www.${cityData.name.toLowerCase().replace(/\s/g, '')}businesssummit.com`,
        registrationUrl: `https://register.${cityData.name.toLowerCase().replace(/\s/g, '')}businesssummit.com`,
        contactEmail: `info@${cityData.name.toLowerCase().replace(/\s/g, '')}businesssummit.com`,
        contactPhone: '+1-555-SUMMIT',
        capacity: 500,
        attendees: 420,
        requirements: ['Professional attire', 'Business registration'],
        whatToBring: ['Business cards', 'Laptop', 'Notebook']
      });
    }
  });

  // Add major professional sporting events
  const professionalSportingEvents: LocalEvent[] = [
    // FIFA World Cup 2026
    {
      id: `event-pro-1`,
      name: 'FIFA World Cup 2026',
      category: 'soccer',
      city: 'Multiple Cities',
      country: 'USA, Canada, Mexico',
      location: 'Various Stadiums',
      venue: 'Multiple Venues',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
      time: 'Various Times',
      description: 'The biggest soccer tournament in the world. Watch the best national teams compete for glory across North America.',
      isFree: false,
      fee: '$200-2000',
      verified: true,
      tags: ['soccer', 'world cup', 'international', 'professional'],
      priceRange: 'premium',
      organizer: 'FIFA',
      address: 'Multiple Stadiums across USA, Canada, and Mexico',
      website: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026',
      ticketUrl: 'https://fifaworldcup26.hospitality.fifa.com/us/en',
      contactEmail: 'tickets@fifa.com',
      capacity: 50000,
      ageRestriction: 'All ages',
      accessibility: 'Full wheelchair access at all venues'
    },
    // Super Bowl LX
    {
      id: `event-pro-2`,
      name: 'Super Bowl LX',
      category: 'american-football',
      city: 'San Francisco',
      country: 'USA',
      location: 'Levi\'s Stadium',
      venue: 'Levi\'s Stadium',
      startDate: '2026-02-08',
      time: '15:30 PST',
      description: 'The championship game of the NFL. Experience the ultimate American sports spectacle with halftime show.',
      isFree: false,
      fee: '$5000-50000',
      verified: true,
      tags: ['nfl', 'super bowl', 'american football', 'championship'],
      priceRange: 'premium',
      organizer: 'NFL',
      address: '4900 Marie P DeBartolo Way, Santa Clara, CA 95054',
      website: 'https://www.nfl.com/super-bowl',
      ticketUrl: 'https://onlocationexp.com/nfl/super-bowl-tickets',
      contactEmail: 'superbowl@nfl.com',
      capacity: 68500,
      ageRestriction: 'All ages',
      accessibility: 'Full ADA compliance'
    },
    // NBA Finals 2026
    {
      id: `event-pro-3`,
      name: 'NBA Finals 2026',
      category: 'nba',
      city: 'TBD',
      country: 'USA',
      location: 'TBD Based on Teams',
      venue: 'NBA Arena',
      startDate: '2026-06-01',
      endDate: '2026-06-21',
      time: '17:00-21:00 ET',
      description: 'The championship series of the NBA. Watch the best basketball players compete for the Larry O\'Brien Trophy.',
      isFree: false,
      fee: '$500-10000',
      verified: true,
      tags: ['nba', 'basketball', 'finals', 'championship'],
      priceRange: 'premium',
      organizer: 'NBA',
      address: 'Various NBA Arenas',
      website: 'https://www.nba.com/finals',
      ticketUrl: 'https://www.nba.com/tickets',
      contactEmail: 'tickets@nba.com',
      capacity: 20000,
      ageRestriction: 'All ages',
      accessibility: 'Wheelchair accessible'
    },
    // NCAA Men's Final Four 2026
    {
      id: `event-pro-4`,
      name: 'NCAA Men\'s Final Four',
      category: 'basketball',
      city: 'Indianapolis',
      country: 'USA',
      location: 'Lucas Oil Stadium',
      venue: 'Lucas Oil Stadium',
      startDate: '2026-04-04',
      endDate: '2026-04-06',
      time: 'Various',
      description: 'College basketball\'s premier event. Watch the nation\'s best college teams battle for the championship.',
      isFree: false,
      fee: '$300-2000',
      verified: true,
      tags: ['ncaa', 'basketball', 'college', 'tournament'],
      priceRange: 'premium',
      organizer: 'NCAA',
      address: '500 S Capitol Ave, Indianapolis, IN 46225',
      website: 'https://www.ncaa.com/final-four',
      ticketUrl: 'https://onlocationexp.com/ncaa/mens-final-four-tickets',
      contactEmail: 'finalfour@ncaa.com',
      capacity: 70000,
      ageRestriction: 'All ages',
      accessibility: 'Full accessibility'
    },
    // UFC 322
    {
      id: `event-pro-5`,
      name: 'UFC 322: Della Maddalena vs Makhachev',
      category: 'fighting',
      city: 'New York City',
      country: 'USA',
      location: 'Madison Square Garden',
      venue: 'Madison Square Garden',
      startDate: '2025-11-15',
      time: '19:00 ET',
      description: 'Elite mixed martial arts action featuring top UFC fighters in an epic showdown.',
      isFree: false,
      fee: '$200-3000',
      verified: true,
      tags: ['ufc', 'mma', 'fighting', 'combat sports'],
      priceRange: 'premium',
      organizer: 'UFC',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      website: 'https://www.ufc.com',
      ticketUrl: 'https://ufcvip.com/d/ufc-322-tickets',
      contactEmail: 'tickets@ufc.com',
      capacity: 20789,
      ageRestriction: '18+',
      accessibility: 'Wheelchair accessible seating available'
    },
    // Tour de France 2026
    {
      id: `event-pro-6`,
      name: 'Tour de France 2026',
      category: 'cycling',
      city: 'Multiple Cities',
      country: 'France',
      location: 'Various Routes',
      venue: 'Across France',
      startDate: '2026-07-04',
      endDate: '2026-07-26',
      time: 'Daytime',
      description: 'The world\'s most prestigious cycling race. Follow the peloton through beautiful French countryside.',
      isFree: true,
      verified: true,
      tags: ['cycling', 'tour de france', 'racing', 'endurance'],
      priceRange: 'free',
      organizer: 'ASO',
      address: 'Various locations across France',
      website: 'https://www.letour.fr',
      ticketUrl: 'https://www.letour.fr/en/tickets',
      contactEmail: 'info@letour.fr',
      ageRestriction: 'All ages',
      accessibility: 'Viewing areas vary by location',
      whatToBring: ['Sun protection', 'Water', 'Comfortable shoes']
    },
    // NASCAR Cup Series Championship
    {
      id: `event-pro-7`,
      name: 'NASCAR Cup Series Championship Race',
      category: 'motorsports',
      city: 'Phoenix',
      country: 'USA',
      location: 'Phoenix Raceway',
      venue: 'Phoenix Raceway',
      startDate: '2025-11-02',
      time: '15:00 MST',
      description: 'The final race of the NASCAR season. Watch stock car racing\'s best compete for the championship.',
      isFree: false,
      fee: '$150-1000',
      verified: true,
      tags: ['nascar', 'racing', 'motorsports', 'championship'],
      priceRange: 'premium',
      organizer: 'NASCAR',
      address: '7602 S Avondale Blvd, Avondale, AZ 85323',
      website: 'https://www.nascar.com',
      ticketUrl: 'https://onlocationexp.com/nascar/phoenix-fall-race-tickets',
      contactEmail: 'tickets@nascar.com',
      capacity: 42000,
      ageRestriction: 'All ages',
      accessibility: 'ADA accessible',
      whatToBring: ['Ear protection', 'Sunscreen', 'Hat']
    },
    // Rugby World Cup 2027
    {
      id: `event-pro-8`,
      name: 'Rugby World Cup 2027',
      category: 'rugby',
      city: 'Multiple Cities',
      country: 'Australia',
      location: 'Various Stadiums',
      venue: 'Multiple Venues',
      startDate: '2027-09-08',
      endDate: '2027-10-20',
      time: 'Various',
      description: 'The pinnacle of international rugby. Watch the world\'s best rugby nations battle for the Webb Ellis Cup.',
      isFree: false,
      fee: '$100-1500',
      verified: true,
      tags: ['rugby', 'world cup', 'international', 'tournament'],
      priceRange: 'premium',
      organizer: 'World Rugby',
      address: 'Various stadiums across Australia',
      website: 'https://www.rugbyworldcup.com',
      ticketUrl: 'https://www.rugbyworldcup.com/tickets',
      contactEmail: 'tickets@worldrugby.org',
      capacity: 50000,
      ageRestriction: 'All ages',
      accessibility: 'Wheelchair accessible at all venues'
    },
    // ICC Cricket World Cup
    {
      id: `event-pro-9`,
      name: 'ICC Cricket World Cup',
      category: 'cricket',
      city: 'Multiple Cities',
      country: 'India & Pakistan',
      location: 'Various Stadiums',
      venue: 'Multiple Cricket Grounds',
      startDate: '2027-10-01',
      endDate: '2027-11-19',
      time: 'Various',
      description: 'The premier international cricket championship. Watch the world\'s best cricket teams compete.',
      isFree: false,
      fee: '$50-800',
      verified: true,
      tags: ['cricket', 'world cup', 'international', 'tournament'],
      priceRange: 'premium',
      organizer: 'ICC',
      address: 'Various cricket grounds across India & Pakistan',
      website: 'https://www.icc-cricket.com',
      ticketUrl: 'https://www.icc-cricket.com/tickets',
      contactEmail: 'tickets@icc-cricket.com',
      capacity: 40000,
      ageRestriction: 'All ages',
      accessibility: 'Wheelchair accessible seating'
    },
    // Ironman World Championship
    {
      id: `event-pro-10`,
      name: 'Ironman World Championship',
      category: 'triathlon',
      city: 'Kona',
      country: 'USA',
      location: 'Kailua-Kona, Hawaii',
      venue: 'Kailua-Kona',
      startDate: '2026-10-10',
      time: '06:30 HST',
      description: 'The ultimate triathlon challenge. Watch elite athletes swim 2.4mi, bike 112mi, and run 26.2mi.',
      isFree: true,
      verified: true,
      tags: ['triathlon', 'ironman', 'endurance', 'hawaii'],
      priceRange: 'free',
      organizer: 'Ironman',
      address: 'Kailua-Kona, Big Island, Hawaii',
      website: 'https://www.ironman.com/im-world-championship',
      ticketUrl: 'https://www.ironman.com/im-world-championship',
      contactEmail: 'info@ironman.com',
      ageRestriction: 'All ages welcome to watch',
      accessibility: 'Various viewing points',
      whatToBring: ['Sun protection', 'Water', 'Comfortable walking shoes', 'Snacks']
    },
    // Premier League - Multiple Games
    {
      id: `event-pro-11`,
      name: 'Premier League Match Day',
      category: 'soccer',
      city: 'London',
      country: 'UK',
      location: 'Various London Stadiums',
      venue: 'Premier League Stadiums',
      startDate: '2025-11-01',
      endDate: '2026-05-23',
      time: 'Various Times',
      description: 'Experience the world\'s most exciting soccer league. Multiple matches every weekend across London.',
      isFree: false,
      fee: '$50-300',
      verified: true,
      recurring: 'weekly',
      tags: ['soccer', 'premier league', 'football', 'UK'],
      priceRange: 'moderate',
      organizer: 'Premier League',
      address: 'Various Premier League Stadiums in London',
      website: 'https://www.premierleague.com',
      ticketUrl: 'https://www.premierleague.com/tickets',
      contactEmail: 'tickets@premierleague.com',
      capacity: 60000,
      ageRestriction: 'All ages',
      accessibility: 'All stadiums wheelchair accessible'
    },
    // La Liga
    {
      id: `event-pro-12`,
      name: 'La Liga: Real Madrid vs Barcelona',
      category: 'soccer',
      city: 'Madrid',
      country: 'Spain',
      location: 'Santiago Bernabéu Stadium',
      venue: 'Santiago Bernabéu Stadium',
      startDate: '2026-03-21',
      time: '21:00 CET',
      description: 'El Clásico - The biggest rivalry in world soccer. Experience the passion of Spanish football.',
      isFree: false,
      fee: '$200-1500',
      verified: true,
      tags: ['soccer', 'la liga', 'el clasico', 'spain'],
      priceRange: 'premium',
      organizer: 'La Liga',
      address: 'Av. de Concha Espina, 1, 28036 Madrid, Spain',
      website: 'https://www.laliga.com',
      ticketUrl: 'https://www.realmadrid.com/en/tickets',
      contactEmail: 'tickets@laliga.es',
      capacity: 81044,
      ageRestriction: 'All ages',
      accessibility: 'Wheelchair accessible'
    }
  ];

  // Combine all events
  events.push(...professionalSportingEvents);

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
  },
  'soccer': {
    label: 'Soccer',
    icon: Trophy,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20'
  },
  'nba': {
    label: 'NBA Basketball',
    icon: Target,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20'
  },
  'american-football': {
    label: 'American Football',
    icon: Flag,
    color: 'text-red-700 dark:text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
  'cricket': {
    label: 'Cricket',
    icon: Trophy,
    color: 'text-green-700 dark:text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/20'
  },
  'rugby': {
    label: 'Rugby',
    icon: Flame,
    color: 'text-slate-700 dark:text-slate-400',
    bgColor: 'bg-slate-500/10 border-slate-500/20'
  },
  'basketball': {
    label: 'Basketball',
    icon: Target,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20'
  },
  'cycling': {
    label: 'Cycling & Races',
    icon: Bike,
    color: 'text-blue-700 dark:text-blue-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20'
  },
  'triathlon': {
    label: 'Triathlon',
    icon: Zap,
    color: 'text-purple-700 dark:text-purple-500',
    bgColor: 'bg-purple-500/10 border-purple-500/20'
  },
  'motorsports': {
    label: 'Motorsports',
    icon: Car,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
  'fighting': {
    label: 'UFC & Fighting',
    icon: Flame,
    color: 'text-orange-700 dark:text-orange-500',
    bgColor: 'bg-orange-500/10 border-orange-500/20'
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
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null);

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
        <div className="flex items-start gap-2">
          <p className="text-muted-foreground flex-1">
            🌍 Discover verified, high-quality events in 100+ cities. Only ≥4.0★ rated events from trusted organizers.
          </p>
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
        </div>
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
                <Card 
                  key={event.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
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
          <div className="space-y-4">
            {/* Smart Location Search */}
            <SmartSearchMenu
              selectedCountry={selectedCountry === 'all' ? null : selectedCountry}
              selectedCity={selectedCity === 'all' ? null : selectedCity}
              onCountryChange={(code, name) => {
                setSelectedCountry(name);
                setSelectedCity('all');
              }}
              onCityChange={(city) => setSelectedCity(city)}
            />
            
            <div className="grid gap-4 md:grid-cols-3">
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
                onClick={() => setSelectedEvent(event)}
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
                      <div className="flex-1">
                        <span className="line-clamp-1">{event.venue || event.location}</span>
                      </div>
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

                  {/* Trust badges and rating */}
                  {event.trustBadges && event.trustBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.trustBadges.slice(0, 2).map((badge, idx) => (
                        <TrustBadge key={idx} badge={badge as any} showIcon={false} />
                      ))}
                    </div>
                  )}
                  
                  {event.rating && (
                    <TrustRating rating={event.rating} reviews={event.reviews} showReviews={false} />
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t flex-wrap">
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
                    {event.ticketUrl && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.ticketUrl, '_blank');
                        }}
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        Get Tickets
                      </Button>
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

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(selectedEvent.category)}
                      <Badge variant="outline" className={categoryConfig[selectedEvent.category].bgColor}>
                        {categoryConfig[selectedEvent.category].label}
                      </Badge>
                      {selectedEvent.verified && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <DialogTitle className="text-2xl">{selectedEvent.name}</DialogTitle>
                    <DialogDescription className="text-base mt-2">
                      {selectedEvent.city}, {selectedEvent.country}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">About This Event</h3>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {/* Key Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {formatEventDate(selectedEvent.startDate, selectedEvent.endDate)}
                          {selectedEvent.recurring && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {selectedEvent.recurring}
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedEvent.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Organizer</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.organizer}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.isFree ? 'Free Entry' : selectedEvent.fee}
                        </p>
                      </div>
                    </div>

                    {selectedEvent.capacity && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Capacity</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedEvent.attendees || 0} / {selectedEvent.capacity} attendees
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {selectedEvent.website && (
                      <a
                        href={selectedEvent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        {selectedEvent.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedEvent.contactEmail && (
                      <a
                        href={`mailto:${selectedEvent.contactEmail}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {selectedEvent.contactEmail}
                      </a>
                    )}
                    {selectedEvent.contactPhone && (
                      <a
                        href={`tel:${selectedEvent.contactPhone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        {selectedEvent.contactPhone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                {(selectedEvent.venue || selectedEvent.requirements || selectedEvent.whatToBring || selectedEvent.ageRestriction || selectedEvent.accessibility) && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Additional Information</h3>
                    <div className="space-y-3">
                      {selectedEvent.venue && (
                        <div>
                          <p className="font-medium text-sm mb-1">Venue</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.venue}</p>
                        </div>
                      )}
                      {selectedEvent.requirements && (
                        <div>
                          <p className="font-medium text-sm mb-1">Requirements</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {selectedEvent.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedEvent.whatToBring && (
                        <div>
                          <p className="font-medium text-sm mb-1">What to Bring</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {selectedEvent.whatToBring.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedEvent.ageRestriction && (
                        <div>
                          <p className="font-medium text-sm mb-1">Age Restriction</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.ageRestriction}</p>
                        </div>
                      )}
                      {selectedEvent.accessibility && (
                        <div>
                          <p className="font-medium text-sm mb-1">Accessibility</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.accessibility}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {selectedEvent.ticketUrl && (
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => window.open(selectedEvent.ticketUrl, '_blank')}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Buy Tickets
                    </Button>
                  )}
                  {selectedEvent.registrationUrl && (
                    <Button
                      className="flex-1"
                      variant={selectedEvent.ticketUrl ? "outline" : "default"}
                      onClick={() => window.open(selectedEvent.registrationUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Register Now
                    </Button>
                  )}
                  {!selectedEvent.ticketUrl && !selectedEvent.registrationUrl && selectedEvent.website && (
                    <Button
                      className="flex-1"
                      onClick={() => window.open(selectedEvent.website, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {selectedEvent.contactEmail && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`mailto:${selectedEvent.contactEmail}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Organizer
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExploreLocalLife;
