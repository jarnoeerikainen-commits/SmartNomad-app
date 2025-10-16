import React, { useState, useMemo } from 'react';
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
  ShoppingBag
} from 'lucide-react';
import { LocationData } from '@/types/country';

interface ExploreLocalLifeProps {
  currentLocation: LocationData | null;
}

interface LocalEvent {
  id: string;
  name: string;
  category: 'farmers-market' | 'farm-events' | 'special-evenings' | 'general-activities' | 'sports';
  city: string;
  country: string;
  location: string;
  date: string;
  time: string;
  description: string;
  isFree: boolean;
  fee?: string;
  verified: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

// Comprehensive mock data for different cities
const mockEvents: LocalEvent[] = [
  // Bangkok Events
  {
    id: '1',
    name: 'Chatuchak Weekend Market',
    category: 'farmers-market',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Chatuchak Park, Phahonyothin Rd',
    date: 'Every Weekend',
    time: '09:00 - 18:00',
    description: 'One of the world\'s largest weekend markets with fresh produce, local food, and crafts',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '2',
    name: 'Or Tor Kor Market',
    category: 'farmers-market',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Kamphaeng Phet 3 Road',
    date: 'Daily',
    time: '06:00 - 20:00',
    description: 'Premium fresh market with organic produce and local delicacies',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '3',
    name: 'Live Music at The Iron Fairies',
    category: 'special-evenings',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Thonglor Soi 9',
    date: 'Friday & Saturday',
    time: '20:00 - 01:00',
    description: 'Live jazz and blues in a magical fairy-themed venue',
    isFree: false,
    fee: '500 THB minimum spend',
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '4',
    name: 'Lumpini Park Morning Tai Chi',
    category: 'sports',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Lumpini Park',
    date: 'Daily',
    time: '06:00 - 07:30',
    description: 'Free community Tai Chi sessions in the park',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '5',
    name: 'Bangkok Art & Culture Centre',
    category: 'general-activities',
    city: 'Bangkok',
    country: 'Thailand',
    location: 'Pathumwan, Rama I Road',
    date: 'Tuesday - Sunday',
    time: '10:00 - 21:00',
    description: 'Contemporary art exhibitions and cultural events',
    isFree: true,
    verified: true
  },

  // Lisbon Events
  {
    id: '6',
    name: 'Mercado da Ribeira',
    category: 'farmers-market',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'Cais do Sodré',
    date: 'Daily',
    time: '10:00 - 00:00',
    description: 'Historic market with fresh produce and Time Out food hall',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '7',
    name: 'LX Factory Night Market',
    category: 'special-evenings',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'LX Factory, Alcântara',
    date: 'Every Thursday',
    time: '18:00 - 23:00',
    description: 'Trendy night market with street food, crafts, and live music',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '8',
    name: 'Fado Night at Clube de Fado',
    category: 'special-evenings',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'Alfama District',
    date: 'Daily',
    time: '20:00 - 00:00',
    description: 'Authentic Fado music experience',
    isFree: false,
    fee: '€25 (includes dinner)',
    verified: true,
    recurring: 'daily'
  },
  {
    id: '9',
    name: 'Sunset Yoga at Miradouro',
    category: 'sports',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'Miradouro de Santa Catarina',
    date: 'Wednesday & Saturday',
    time: '18:30 - 19:30',
    description: 'Free sunset yoga with city views',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '10',
    name: 'Lisbon Street Art Tour',
    category: 'general-activities',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'Meeting at Praça do Comércio',
    date: 'Saturday & Sunday',
    time: '11:00 - 13:00',
    description: 'Guided tour of Lisbon\'s amazing street art scene',
    isFree: false,
    fee: '€15',
    verified: true,
    recurring: 'weekly'
  },

  // Bali Events
  {
    id: '11',
    name: 'Ubud Traditional Market',
    category: 'farmers-market',
    city: 'Bali',
    country: 'Indonesia',
    location: 'Jalan Raya Ubud',
    date: 'Daily',
    time: '05:00 - 17:00',
    description: 'Traditional Balinese market with fresh produce and handcrafts',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '12',
    name: 'Canggu Farmers Market',
    category: 'farmers-market',
    city: 'Bali',
    country: 'Indonesia',
    location: 'Samadi Bali, Canggu',
    date: 'Every Sunday',
    time: '08:00 - 13:00',
    description: 'Organic produce, healthy food, and wellness products',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '13',
    name: 'Full Moon Beach Party',
    category: 'special-evenings',
    city: 'Bali',
    country: 'Indonesia',
    location: 'Finns Beach Club, Canggu',
    date: 'Monthly (Full Moon)',
    time: '20:00 - 03:00',
    description: 'Epic beach party under the full moon',
    isFree: false,
    fee: 'IDR 300,000',
    verified: true,
    recurring: 'monthly'
  },
  {
    id: '14',
    name: 'Morning Surf & Yoga Session',
    category: 'sports',
    city: 'Bali',
    country: 'Indonesia',
    location: 'Batu Bolong Beach',
    date: 'Daily',
    time: '06:00 - 08:00',
    description: 'Surf lessons followed by beach yoga',
    isFree: false,
    fee: 'IDR 250,000',
    verified: true,
    recurring: 'daily'
  },
  {
    id: '15',
    name: 'Balinese Cooking Class',
    category: 'farm-events',
    city: 'Bali',
    country: 'Indonesia',
    location: 'Paon Bali Cooking Class, Ubud',
    date: 'Daily',
    time: '08:00 - 14:00',
    description: 'Market visit and traditional Balinese cooking experience',
    isFree: false,
    fee: 'IDR 450,000',
    verified: true,
    recurring: 'daily'
  },

  // Mexico City Events
  {
    id: '16',
    name: 'Mercado de Jamaica',
    category: 'farmers-market',
    city: 'Mexico City',
    country: 'Mexico',
    location: 'Colonia Jamaica',
    date: 'Daily',
    time: '06:00 - 18:00',
    description: 'Famous flower and produce market',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '17',
    name: 'San Juan Market Food Tour',
    category: 'farm-events',
    city: 'Mexico City',
    country: 'Mexico',
    location: 'Mercado San Juan',
    date: 'Monday - Saturday',
    time: '10:00 - 12:00',
    description: 'Gourmet market tour with tastings',
    isFree: false,
    fee: '$450 MXN',
    verified: true
  },
  {
    id: '18',
    name: 'Lucha Libre Wrestling Night',
    category: 'special-evenings',
    city: 'Mexico City',
    country: 'Mexico',
    location: 'Arena México',
    date: 'Tuesday, Friday, Sunday',
    time: '19:30 - 23:00',
    description: 'Traditional Mexican wrestling entertainment',
    isFree: false,
    fee: '$150-600 MXN',
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '19',
    name: 'Chapultepec Park Morning Run',
    category: 'sports',
    city: 'Mexico City',
    country: 'Mexico',
    location: 'Chapultepec Park',
    date: 'Daily',
    time: '06:00 - 08:00',
    description: 'Community running group in the city\'s largest park',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '20',
    name: 'Roma-Condesa Gallery Walk',
    category: 'general-activities',
    city: 'Mexico City',
    country: 'Mexico',
    location: 'Roma Norte neighborhood',
    date: 'First Saturday of month',
    time: '18:00 - 22:00',
    description: 'Art galleries open late with wine and music',
    isFree: true,
    verified: true,
    recurring: 'monthly'
  },

  // Berlin Events
  {
    id: '21',
    name: 'Turkish Market Maybachufer',
    category: 'farmers-market',
    city: 'Berlin',
    country: 'Germany',
    location: 'Maybachufer, Neukölln',
    date: 'Tuesday & Friday',
    time: '11:00 - 18:30',
    description: 'Vibrant Turkish market along the canal',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '22',
    name: 'Markthalle Neun Street Food Thursday',
    category: 'farm-events',
    city: 'Berlin',
    country: 'Germany',
    location: 'Markthalle Neun, Kreuzberg',
    date: 'Every Thursday',
    time: '17:00 - 22:00',
    description: 'International street food in historic market hall',
    isFree: true,
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '23',
    name: 'Berghain Techno Night',
    category: 'special-evenings',
    city: 'Berlin',
    country: 'Germany',
    location: 'Berghain Club',
    date: 'Friday & Saturday',
    time: '00:00 - 12:00',
    description: 'World-famous techno club experience',
    isFree: false,
    fee: '€20',
    verified: true,
    recurring: 'weekly'
  },
  {
    id: '24',
    name: 'Tempelhofer Feld Sports Day',
    category: 'sports',
    city: 'Berlin',
    country: 'Germany',
    location: 'Tempelhofer Feld',
    date: 'Daily',
    time: '06:00 - Sunset',
    description: 'Free access to former airport for sports and activities',
    isFree: true,
    verified: true,
    recurring: 'daily'
  },
  {
    id: '25',
    name: 'East Side Gallery Tour',
    category: 'general-activities',
    city: 'Berlin',
    country: 'Germany',
    location: 'Mühlenstraße',
    date: 'Daily',
    time: 'Any time',
    description: 'Open-air gallery on the Berlin Wall',
    isFree: true,
    verified: true,
    recurring: 'daily'
  }
];

const categoryConfig = {
  'farmers-market': {
    label: 'Farmers Markets',
    icon: ShoppingBag,
    color: 'text-green-600 dark:text-green-400'
  },
  'farm-events': {
    label: 'Local & Farm Events',
    icon: UtensilsCrossed,
    color: 'text-orange-600 dark:text-orange-400'
  },
  'special-evenings': {
    label: 'Special Evenings & Social',
    icon: Music,
    color: 'text-purple-600 dark:text-purple-400'
  },
  'general-activities': {
    label: 'General Activities',
    icon: PartyPopper,
    color: 'text-blue-600 dark:text-blue-400'
  },
  'sports': {
    label: 'Sports & Wellness',
    icon: Dumbbell,
    color: 'text-red-600 dark:text-red-400'
  }
};

const ExploreLocalLife: React.FC<ExploreLocalLifeProps> = ({ currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState(false);

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(mockEvents.map(event => event.city)));
    return uniqueCities.sort();
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query)
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

    // Filter by free events
    if (freeOnly) {
      filtered = filtered.filter(event => event.isFree);
    }

    // Sort: current location first, then alphabetically
    return filtered.sort((a, b) => {
      if (currentLocation?.city) {
        const aIsLocal = a.city.toLowerCase() === currentLocation.city.toLowerCase();
        const bIsLocal = b.city.toLowerCase() === currentLocation.city.toLowerCase();
        
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
      }
      return a.city.localeCompare(b.city) || a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, selectedCity, freeOnly, currentLocation]);

  // Get top 3 local events
  const topLocalEvents = useMemo(() => {
    if (!currentLocation?.city) return [];
    
    return mockEvents
      .filter(event => event.city.toLowerCase() === currentLocation.city.toLowerCase())
      .slice(0, 3);
  }, [currentLocation]);

  const getCategoryIcon = (category: LocalEvent['category']) => {
    const Icon = categoryConfig[category].icon;
    return <Icon className={`h-5 w-5 ${categoryConfig[category].color}`} />;
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
          Discover verified local events, markets, and activities happening around you
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
            <CardDescription>Top 3 events near you right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {topLocalEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(event.category)}
                        <CardTitle className="text-base">{event.name}</CardTitle>
                      </div>
                      {event.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.isFree ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          <Heart className="h-3 w-3 mr-1" />
                          Free Entry
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
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
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Find Events</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, locations, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-4">
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

            {/* Free Only Toggle */}
            <Button
              variant={freeOnly ? "default" : "outline"}
              onClick={() => setFreeOnly(!freeOnly)}
              className="w-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              Free Only
            </Button>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCity('all');
                setFreeOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </p>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(event.category)}
                      <Badge variant="outline" className="text-xs">
                        {categoryConfig[event.category].label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {event.city}, {event.country}
                    </CardDescription>
                  </div>
                  {event.verified && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
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
                    <span className="line-clamp-2">{event.location}</span>
                  </div>
                </div>

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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Try adjusting your filters or search query to find more events
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExploreLocalLife;