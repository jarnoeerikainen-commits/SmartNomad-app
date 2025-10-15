import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Bus, MapPin, ExternalLink, Search, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TransportOption {
  type: 'train' | 'bus' | 'metro' | 'tram' | 'combined';
  name: string;
  coverage: string;
  ticketUrl: string;
  mobileApp?: string;
  priceRange: string;
  features: string[];
}

interface CityTransport {
  city: string;
  country: string;
  countryCode: string;
  options: TransportOption[];
}

const publicTransportData: CityTransport[] = [
  // Europe
  {
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    options: [
      {
        type: 'combined',
        name: 'Transport for London (TfL)',
        coverage: 'Underground, buses, trams, DLR, Overground',
        ticketUrl: 'https://tfl.gov.uk/fares/how-to-pay-and-where-to-buy-tickets-and-oyster',
        mobileApp: 'TfL Oyster and contactless',
        priceRange: '£2.80-£7.70 per journey',
        features: ['Oyster Card', 'Contactless payment', 'Day caps', 'Night services']
      }
    ]
  },
  {
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    options: [
      {
        type: 'combined',
        name: 'RATP',
        coverage: 'Metro, RER, buses, trams',
        ticketUrl: 'https://www.ratp.fr/en/titres-et-tarifs',
        mobileApp: 'RATP',
        priceRange: '€2.10-€5.00 per journey',
        features: ['Navigo Pass', 'Mobile tickets', 'Tourist passes', '24/7 night buses']
      }
    ]
  },
  {
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    options: [
      {
        type: 'combined',
        name: 'BVG',
        coverage: 'U-Bahn, S-Bahn, buses, trams, ferries',
        ticketUrl: 'https://www.bvg.de/en/subscriptions-and-tickets',
        mobileApp: 'BVG Fahrinfo Plus',
        priceRange: '€3.20-€8.80 per journey',
        features: ['Berlin WelcomeCard', 'Group tickets', 'Monthly passes', 'Night services']
      }
    ]
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    options: [
      {
        type: 'combined',
        name: 'GVB',
        coverage: 'Trams, buses, metro, ferries',
        ticketUrl: 'https://reisproducten.gvb.nl/en',
        mobileApp: 'GVB',
        priceRange: '€3.40-€8.50 per journey',
        features: ['OV-chipkaart', 'Tourist day passes', 'Night buses', 'Free ferries']
      }
    ]
  },
  {
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    options: [
      {
        type: 'combined',
        name: 'Metro de Madrid / EMT',
        coverage: 'Metro, buses, light rail',
        ticketUrl: 'https://www.metromadrid.es/en/viaja_en_metro/tarifas',
        mobileApp: 'Metro de Madrid',
        priceRange: '€1.50-€5.00 per journey',
        features: ['Multi Card', '10-journey tickets', 'Tourist passes', 'Extensive night buses']
      }
    ]
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    options: [
      {
        type: 'combined',
        name: 'TMB',
        coverage: 'Metro, buses, trams, funicular',
        ticketUrl: 'https://www.tmb.cat/en/barcelona-fares-metro-bus',
        mobileApp: 'TMB App',
        priceRange: '€2.55-€11.35',
        features: ['T-casual card', 'Hola Barcelona pass', 'Airport connections', 'Night buses']
      }
    ]
  },
  {
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    options: [
      {
        type: 'combined',
        name: 'ATAC',
        coverage: 'Metro, buses, trams',
        ticketUrl: 'https://www.atac.roma.it/en/tickets-and-passes',
        mobileApp: 'MuoviRoma',
        priceRange: '€1.50-€7.00 per journey',
        features: ['Roma Pass', 'Daily/weekly tickets', 'Night buses', 'Tourist passes']
      }
    ]
  },
  {
    city: 'Vienna',
    country: 'Austria',
    countryCode: 'AT',
    options: [
      {
        type: 'combined',
        name: 'Wiener Linien',
        coverage: 'U-Bahn, trams, buses',
        ticketUrl: 'https://www.wienerlinien.at/tickets',
        mobileApp: 'WienMobil',
        priceRange: '€2.60-€5.80 per journey',
        features: ['Vienna Card', 'Weekly passes', 'Night services', 'Airport lines']
      }
    ]
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    countryCode: 'CZ',
    options: [
      {
        type: 'combined',
        name: 'DPP',
        coverage: 'Metro, trams, buses, funicular',
        ticketUrl: 'https://www.dpp.cz/en/fares',
        mobileApp: 'PID Lítačka',
        priceRange: '€1.20-€5.30 per journey',
        features: ['Prague Card', 'Multi-day passes', 'Night trams', 'Historic trams']
      }
    ]
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    options: [
      {
        type: 'combined',
        name: 'Carris / Metro de Lisboa',
        coverage: 'Metro, trams, buses, funiculars',
        ticketUrl: 'https://www.metrolisboa.pt/en/buy/where-to-buy/',
        mobileApp: 'Viva Viagem',
        priceRange: '€1.50-€6.80 per journey',
        features: ['Viva Viagem card', 'Historic trams', 'Tourist passes', 'Ferry connections']
      }
    ]
  },

  // North America
  {
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    options: [
      {
        type: 'combined',
        name: 'MTA',
        coverage: 'Subway, buses, Staten Island Railway',
        ticketUrl: 'https://new.mta.info/fares',
        mobileApp: 'MYmta',
        priceRange: '$2.90 per ride',
        features: ['MetroCard', 'OMNY contactless', 'Unlimited passes', '24/7 service']
      }
    ]
  },
  {
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    options: [
      {
        type: 'combined',
        name: 'BART / MUNI',
        coverage: 'BART trains, buses, light rail, cable cars',
        ticketUrl: 'https://www.bart.gov/tickets',
        mobileApp: 'MuniMobile',
        priceRange: '$2.50-$15.00 per journey',
        features: ['Clipper Card', 'Cable cars', 'Day passes', 'Regional connections']
      }
    ]
  },
  {
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    options: [
      {
        type: 'combined',
        name: 'TTC',
        coverage: 'Subway, streetcars, buses',
        ticketUrl: 'https://www.ttc.ca/Fares-and-passes',
        mobileApp: 'TTC',
        priceRange: 'CAD $3.35 per ride',
        features: ['PRESTO card', 'Day passes', 'Historic streetcars', 'Night network']
      }
    ]
  },
  {
    city: 'Montreal',
    country: 'Canada',
    countryCode: 'CA',
    options: [
      {
        type: 'combined',
        name: 'STM',
        coverage: 'Metro, buses',
        ticketUrl: 'https://www.stm.info/en/info/fares',
        mobileApp: 'STM',
        priceRange: 'CAD $3.75 per ride',
        features: ['OPUS card', 'Weekend passes', 'Night buses', 'Tourist passes']
      }
    ]
  },

  // Asia
  {
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    options: [
      {
        type: 'combined',
        name: 'Tokyo Metro / JR East',
        coverage: 'Metro, JR trains, buses',
        ticketUrl: 'https://www.tokyometro.jp/en/ticket/regular/index.html',
        mobileApp: 'Tokyo Metro',
        priceRange: '¥170-¥320 per journey',
        features: ['Suica/Pasmo IC cards', 'Tokyo Subway Ticket', 'Day passes', 'Extensive network']
      }
    ]
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    options: [
      {
        type: 'combined',
        name: 'SMRT / SBS Transit',
        coverage: 'MRT, LRT, buses',
        ticketUrl: 'https://www.transitlink.com.sg/tickets-fares/',
        mobileApp: 'SimplyGo',
        priceRange: 'SGD $0.92-$2.47 per journey',
        features: ['EZ-Link card', 'Tourist passes', 'Cashless only', 'Frequent services']
      }
    ]
  },
  {
    city: 'Hong Kong',
    country: 'Hong Kong',
    countryCode: 'HK',
    options: [
      {
        type: 'combined',
        name: 'MTR',
        coverage: 'MTR trains, light rail, buses',
        ticketUrl: 'https://www.mtr.com.hk/en/customer/tickets/index.html',
        mobileApp: 'MTR Mobile',
        priceRange: 'HKD $5-$60 per journey',
        features: ['Octopus card', 'Airport Express', 'Tourist passes', 'Very reliable']
      }
    ]
  },
  {
    city: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    options: [
      {
        type: 'combined',
        name: 'Seoul Metro',
        coverage: 'Subway lines, buses',
        ticketUrl: 'https://www.seoulmetro.co.kr/en/page.do?menuIdx=548',
        mobileApp: 'T-money',
        priceRange: '₩1,400-₩2,750 per journey',
        features: ['T-money card', 'Discover Seoul Pass', 'Free WiFi', 'English signage']
      }
    ]
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    options: [
      {
        type: 'combined',
        name: 'BTS / MRT',
        coverage: 'BTS Skytrain, MRT, Airport Rail Link, buses',
        ticketUrl: 'https://www.bts.co.th/eng/fares-routes.html',
        mobileApp: 'BTS SkyTrain',
        priceRange: '฿16-฿59 per journey',
        features: ['Rabbit Card', 'Single journey tokens', 'Day passes', 'Air-conditioned']
      }
    ]
  },
  {
    city: 'Shanghai',
    country: 'China',
    countryCode: 'CN',
    options: [
      {
        type: 'combined',
        name: 'Shanghai Metro',
        coverage: 'Metro lines, buses, ferries',
        ticketUrl: 'https://www.shmetro.com/en/node166/201901/con115017.htm',
        mobileApp: 'Metro Daduhui',
        priceRange: '¥3-¥15 per journey',
        features: ['Shanghai Public Transportation Card', 'Tourist passes', 'Extensive network', 'English signs']
      }
    ]
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    options: [
      {
        type: 'combined',
        name: 'RTA Dubai',
        coverage: 'Metro, trams, buses',
        ticketUrl: 'https://www.rta.ae/wps/portal/rta/ae/public-transport/nol-card',
        mobileApp: 'RTA Dubai',
        priceRange: 'AED 3-8.50 per journey',
        features: ['Nol Card', 'Gold class available', 'Day passes', 'Modern & clean']
      }
    ]
  },

  // Australia & Oceania
  {
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    options: [
      {
        type: 'combined',
        name: 'Transport for NSW',
        coverage: 'Trains, light rail, buses, ferries',
        ticketUrl: 'https://transportnsw.info/tickets-opal/opal',
        mobileApp: 'Opal Travel',
        priceRange: 'AUD $3.61-$8.90 per journey',
        features: ['Opal card', 'Day caps', 'Ferry services', 'Sunday discounts']
      }
    ]
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    options: [
      {
        type: 'combined',
        name: 'PTV',
        coverage: 'Trains, trams, buses',
        ticketUrl: 'https://www.ptv.vic.gov.au/tickets/myki',
        mobileApp: 'PTV',
        priceRange: 'AUD $4.90-$9.80 per day',
        features: ['Myki card', 'Free tram zone', 'Day passes', 'Historic trams']
      }
    ]
  },

  // South America
  {
    city: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    options: [
      {
        type: 'combined',
        name: 'SPTrans / Metro',
        coverage: 'Metro, buses, trains',
        ticketUrl: 'https://www.metro.sp.gov.br/index.aspx',
        mobileApp: 'SPTrans',
        priceRange: 'R$5.00 per journey',
        features: ['Bilhete Único', 'Integration system', 'Extensive network', 'Free transfers']
      }
    ]
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    options: [
      {
        type: 'combined',
        name: 'BA Subte',
        coverage: 'Subway, buses, trains',
        ticketUrl: 'https://www.buenosaires.gob.ar/subte/tarifas',
        mobileApp: 'BA Móvil',
        priceRange: 'ARS $125 per journey',
        features: ['SUBE card', 'Historic trains', '24-hour buses', 'Integrated fares']
      }
    ]
  },

  // Africa
  {
    city: 'Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    options: [
      {
        type: 'combined',
        name: 'MyCiTi',
        coverage: 'BRT buses, trains',
        ticketUrl: 'https://www.myciti.org.za/en/fares/',
        mobileApp: 'MyCiTi',
        priceRange: 'ZAR 9-35 per journey',
        features: ['myconnect card', 'Airport service', 'Safe & reliable', 'Modern buses']
      }
    ]
  },
];

interface PublicTransportProps {
  currentLocation?: { countryCode?: string; city?: string } | null;
}

const PublicTransport: React.FC<PublicTransportProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get unique countries for filter
  const countries = useMemo(() => {
    const countrySet = new Set(publicTransportData.map(item => item.country));
    return Array.from(countrySet).sort();
  }, []);

  // Detect user's current location and prioritize it
  const sortedData = useMemo(() => {
    const userCountryCode = currentLocation?.countryCode?.toUpperCase();
    const userCity = currentLocation?.city?.toLowerCase();

    return [...publicTransportData].sort((a, b) => {
      // Prioritize exact city match
      if (userCity) {
        if (a.city.toLowerCase() === userCity && b.city.toLowerCase() !== userCity) return -1;
        if (b.city.toLowerCase() === userCity && a.city.toLowerCase() !== userCity) return 1;
      }
      // Then prioritize country match
      if (userCountryCode) {
        if (a.countryCode === userCountryCode && b.countryCode !== userCountryCode) return -1;
        if (b.countryCode === userCountryCode && a.countryCode !== userCountryCode) return 1;
      }
      // Default alphabetical
      return a.city.localeCompare(b.city);
    });
  }, [currentLocation]);

  // Filter data
  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
      
      const matchesType = selectedType === 'all' || 
        item.options.some(opt => opt.type === selectedType || opt.type === 'combined');

      return matchesSearch && matchesCountry && matchesType;
    });
  }, [sortedData, searchQuery, selectedCountry, selectedType]);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'train': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'tram': return <Train className="h-4 w-4" />;
      case 'metro': return <Train className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Public Transport Guide</h1>
        <p className="text-muted-foreground">
          Find official public transport tickets and passes worldwide
        </p>
      </div>

      {/* Location Notice */}
      {currentLocation?.city && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <Navigation className="h-5 w-5" />
              <p className="font-medium">
                Showing {currentLocation.city} first based on your location
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search City or Country</label>
              <Input
                placeholder="e.g. London, Paris, Tokyo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="tram">Tram</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} {filteredData.length === 1 ? 'city' : 'cities'}
      </div>

      {/* Transport Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((cityData) => (
          <Card key={`${cityData.city}-${cityData.countryCode}`} className="hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {cityData.city}
                  </CardTitle>
                  <CardDescription>{cityData.country}</CardDescription>
                </div>
                {currentLocation?.city?.toLowerCase() === cityData.city.toLowerCase() && (
                  <Badge variant="default" className="gradient-trust">
                    <Navigation className="h-3 w-3 mr-1" />
                    Current Location
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cityData.options.map((option, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{option.name}</h3>
                    <Badge variant="outline">{getTransportIcon(option.type)}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-20">Coverage:</span>
                      <span className="font-medium">{option.coverage}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-20">Price:</span>
                      <span className="font-medium">{option.priceRange}</span>
                    </div>
                    {option.mobileApp && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-20">App:</span>
                        <span className="font-medium">{option.mobileApp}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, featureIdx) => (
                      <Badge key={featureIdx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full gradient-success"
                    onClick={() => window.open(option.ticketUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buy Tickets Online
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No cities found matching your search criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Travel Tips */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle>Public Transport Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="text-primary font-bold">1.</div>
            <p className="text-sm">Always purchase tickets before boarding to avoid fines</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">2.</div>
            <p className="text-sm">Consider multi-day or tourist passes for better value</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">3.</div>
            <p className="text-sm">Download the official mobile app for real-time updates</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">4.</div>
            <p className="text-sm">Keep your ticket until the end of your journey for validation</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">5.</div>
            <p className="text-sm">Check for night services and weekend schedules in advance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicTransport;