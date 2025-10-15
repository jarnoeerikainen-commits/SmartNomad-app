import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Star, ExternalLink, Search, Navigation, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaxiService {
  name: string;
  type: 'standard' | 'premium' | 'luxury';
  rating: number;
  bookingUrl: string;
  appAvailable: boolean;
  features: string[];
  priceLevel: string;
  availability: string;
}

interface CityTaxis {
  city: string;
  country: string;
  countryCode: string;
  services: TaxiService[];
}

const taxiServicesData: CityTaxis[] = [
  // Europe - Major Cities
  {
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/gb/en/ride/',
        appAvailable: true,
        features: ['24/7 service', 'Split fare', 'Multiple vehicle types', 'Safety features'],
        priceLevel: '£8-15 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en-gb/cities/london/',
        appAvailable: true,
        features: ['Lower prices', 'Quick arrival', 'Carbon neutral rides', 'Scheduled rides'],
        priceLevel: '£6-12 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'Gett',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://gett.com/uk/',
        appAvailable: true,
        features: ['Professional drivers', 'Business accounts', 'Fixed pricing', 'Premium vehicles'],
        priceLevel: '£15-30 average ride',
        availability: 'Central London'
      },
      {
        name: 'Addison Lee',
        type: 'luxury',
        rating: 4.7,
        bookingUrl: 'https://www.addisonlee.com/',
        appAvailable: true,
        features: ['Luxury fleet', 'Chauffeur service', 'Airport transfers', 'Corporate accounts'],
        priceLevel: '£40-100+ per trip',
        availability: 'London & major airports'
      }
    ]
  },
  {
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/fr/en/ride/',
        appAvailable: true,
        features: ['UberX', 'UberGreen', 'UberVan', 'Airport service'],
        priceLevel: '€10-20 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en-fr/cities/paris/',
        appAvailable: true,
        features: ['Competitive pricing', 'Eco-friendly options', 'Quick booking', 'Reliable service'],
        priceLevel: '€8-16 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'G7 Taxi',
        type: 'premium',
        rating: 4.5,
        bookingUrl: 'https://www.g7.fr/',
        appAvailable: true,
        features: ['Official Paris taxis', 'Fixed airport rates', 'Professional drivers', 'Business class'],
        priceLevel: '€15-35 average ride',
        availability: 'Paris & suburbs'
      },
      {
        name: 'Blacklane',
        type: 'luxury',
        rating: 4.8,
        bookingUrl: 'https://www.blacklane.com/en/chauffeur-service-paris/',
        appAvailable: true,
        features: ['Chauffeur service', 'Premium vehicles', 'Airport meet & greet', 'Fixed pricing'],
        priceLevel: '€80-200+ per trip',
        availability: 'Paris & CDG/Orly airports'
      }
    ]
  },
  {
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/de/en/ride/',
        appAvailable: true,
        features: ['Multiple options', 'Green rides', 'Split payment', 'Reliable service'],
        priceLevel: '€8-18 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/berlin/',
        appAvailable: true,
        features: ['Lower fares', 'Quick arrival', 'Professional drivers', 'Safety features'],
        priceLevel: '€6-14 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'FREE NOW',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://www.free-now.com/',
        appAvailable: true,
        features: ['Licensed taxis', 'Fixed pricing', 'Business accounts', 'Multiple payment options'],
        priceLevel: '€12-25 average ride',
        availability: 'Berlin city center'
      }
    ]
  },
  {
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/es/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Multiple options', 'Airport transfers'],
        priceLevel: '€8-15 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/madrid/',
        appAvailable: true,
        features: ['Affordable rates', 'Quick service', 'Scheduled rides', 'Safety features'],
        priceLevel: '€6-12 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'Cabify',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://cabify.com/en/spain',
        appAvailable: true,
        features: ['Premium service', 'Corporate accounts', 'Executive cars', 'Fixed pricing'],
        priceLevel: '€12-30 average ride',
        availability: 'Madrid & suburbs'
      }
    ]
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.2,
        bookingUrl: 'https://www.uber.com/es-es/ride/',
        appAvailable: true,
        features: ['Multiple vehicle types', 'Airport service', 'Split fare', '24/7 availability'],
        priceLevel: '€8-16 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/barcelona/',
        appAvailable: true,
        features: ['Competitive pricing', 'Eco options', 'Quick booking', 'Professional drivers'],
        priceLevel: '€6-13 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'Cabify',
        type: 'premium',
        rating: 4.7,
        bookingUrl: 'https://cabify.com/en/barcelona',
        appAvailable: true,
        features: ['Premium vehicles', 'Business class', 'Fixed rates', 'Airport transfers'],
        priceLevel: '€15-35 average ride',
        availability: 'Barcelona city'
      }
    ]
  },
  {
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.2,
        bookingUrl: 'https://www.uber.com/it/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Black', 'Green', 'Airport transfers'],
        priceLevel: '€10-18 average ride',
        availability: 'Rome center'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/rome/',
        appAvailable: true,
        features: ['Lower prices', 'Quick service', 'Reliable drivers', 'Safety features'],
        priceLevel: '€8-15 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'IT Taxi',
        type: 'premium',
        rating: 4.5,
        bookingUrl: 'https://www.ittaxi.it/',
        appAvailable: true,
        features: ['Official taxis', 'Fixed airport rates', 'English-speaking drivers', 'Advance booking'],
        priceLevel: '€15-40 average ride',
        availability: 'Rome & Fiumicino'
      }
    ]
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/nl/en/ride/',
        appAvailable: true,
        features: ['Multiple options', 'Green rides', 'Split payment', 'Airport service'],
        priceLevel: '€10-20 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/amsterdam/',
        appAvailable: true,
        features: ['Affordable rates', 'Quick arrival', 'Professional service', 'Scheduled rides'],
        priceLevel: '€8-16 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'FREE NOW',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://www.free-now.com/nl/',
        appAvailable: true,
        features: ['Licensed taxis', 'Fixed pricing', 'Business accounts', 'Taxi vouchers'],
        priceLevel: '€15-30 average ride',
        availability: 'Amsterdam & Schiphol'
      }
    ]
  },
  {
    city: 'Vienna',
    country: 'Austria',
    countryCode: 'AT',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/at/en/ride/',
        appAvailable: true,
        features: ['Comfort', 'Green', 'Multiple options', 'Airport transfers'],
        priceLevel: '€8-16 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.6,
        bookingUrl: 'https://bolt.eu/en/cities/vienna/',
        appAvailable: true,
        features: ['Competitive pricing', 'Quick service', 'Professional drivers', 'Eco-friendly'],
        priceLevel: '€6-12 average ride',
        availability: 'Wide coverage'
      }
    ]
  },

  // North America
  {
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/us/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'XL', 'Pool', 'Pet-friendly'],
        priceLevel: '$15-30 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.lyft.com/',
        appAvailable: true,
        features: ['Standard', 'XL', 'Lux', 'Scheduled rides', 'Round trip'],
        priceLevel: '$14-28 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Via',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://ridewithvia.com/',
        appAvailable: true,
        features: ['Shared rides', 'Lower cost', 'Eco-friendly', 'Fixed routes'],
        priceLevel: '$5-15 average ride',
        availability: 'Manhattan & outer boroughs'
      },
      {
        name: 'Blacklane',
        type: 'luxury',
        rating: 4.8,
        bookingUrl: 'https://www.blacklane.com/en/chauffeur-service-new-york/',
        appAvailable: true,
        features: ['Chauffeur service', 'Premium vehicles', 'Airport meet & greet', 'Business class'],
        priceLevel: '$100-300+ per trip',
        availability: 'NYC & major airports'
      }
    ]
  },
  {
    city: 'Los Angeles',
    country: 'United States',
    countryCode: 'US',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/us/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'SUV', 'Lux'],
        priceLevel: '$12-25 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.lyft.com/',
        appAvailable: true,
        features: ['Standard', 'XL', 'Lux', 'Lux Black', 'Scheduled'],
        priceLevel: '$11-23 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Blacklane',
        type: 'luxury',
        rating: 4.7,
        bookingUrl: 'https://www.blacklane.com/en/chauffeur-service-los-angeles/',
        appAvailable: true,
        features: ['Chauffeur service', 'Luxury vehicles', 'Airport transfers', 'Hourly bookings'],
        priceLevel: '$90-250+ per trip',
        availability: 'LA & LAX airport'
      }
    ]
  },
  {
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/us/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'XL', 'Premium'],
        priceLevel: '$15-30 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.lyft.com/',
        appAvailable: true,
        features: ['Standard', 'XL', 'Lux', 'Green mode', 'Wait & Save'],
        priceLevel: '$14-28 average ride',
        availability: 'Excellent coverage'
      }
    ]
  },
  {
    city: 'Chicago',
    country: 'United States',
    countryCode: 'US',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/us/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'XL', 'Black', 'Premier'],
        priceLevel: '$12-22 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.lyft.com/',
        appAvailable: true,
        features: ['Standard', 'XL', 'Lux', 'Lux Black XL', 'Scheduled rides'],
        priceLevel: '$11-20 average ride',
        availability: 'Excellent coverage'
      }
    ]
  },
  {
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/ca/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'XL', 'Green', 'Premium'],
        priceLevel: 'CAD $15-30 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.lyft.com/rider/cities/toronto-on',
        appAvailable: true,
        features: ['Standard', 'XL', 'Lux', 'Scheduled rides', 'Airport service'],
        priceLevel: 'CAD $14-28 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Beck Taxi',
        type: 'premium',
        rating: 4.3,
        bookingUrl: 'https://www.becktaxi.com/',
        appAvailable: true,
        features: ['Licensed taxis', 'Airport flat rates', 'Advance booking', 'Accessible vehicles'],
        priceLevel: 'CAD $20-40 average ride',
        availability: 'Toronto GTA'
      }
    ]
  },
  {
    city: 'Vancouver',
    country: 'Canada',
    countryCode: 'CA',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/ca/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'XL', 'Green', 'Pet'],
        priceLevel: 'CAD $12-25 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Lyft',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.lyft.com/rider/cities/vancouver-bc',
        appAvailable: true,
        features: ['Standard', 'XL', 'Scheduled', 'Airport rides', 'Business profiles'],
        priceLevel: 'CAD $11-23 average ride',
        availability: 'Good coverage'
      }
    ]
  },
  {
    city: 'Mexico City',
    country: 'Mexico',
    countryCode: 'MX',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/mx/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'Flash', 'Green'],
        priceLevel: 'MXN $60-150 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Didi',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://web.didiglobal.com/mx/',
        appAvailable: true,
        features: ['Express', 'Taxi', 'Preferred', 'Scheduled rides', 'Split payment'],
        priceLevel: 'MXN $50-130 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'Cabify',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://cabify.com/mexico',
        appAvailable: true,
        features: ['Premium service', 'Executive cars', 'Corporate accounts', 'Fixed pricing'],
        priceLevel: 'MXN $100-250 average ride',
        availability: 'Mexico City'
      }
    ]
  },

  // Asia
  {
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/jp/en/ride/',
        appAvailable: true,
        features: ['Taxi', 'Premium', 'Black', 'English support', 'Airport service'],
        priceLevel: '¥1,500-3,500 average ride',
        availability: 'Tokyo 23 wards'
      },
      {
        name: 'JapanTaxi (GO)',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://go.mo-t.com/',
        appAvailable: true,
        features: ['Official taxis', 'Fixed pricing', 'English app', 'Advance booking'],
        priceLevel: '¥1,200-3,000 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'S.RIDE',
        type: 'premium',
        rating: 4.6,
        bookingUrl: 'https://www.sride.jp/',
        appAvailable: true,
        features: ['Premium taxis', 'One-tap booking', 'AI dispatch', 'Corporate plans'],
        priceLevel: '¥2,000-5,000 average ride',
        availability: 'Tokyo metropolitan'
      }
    ]
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    services: [
      {
        name: 'Grab',
        type: 'standard',
        rating: 4.6,
        bookingUrl: 'https://www.grab.com/sg/',
        appAvailable: true,
        features: ['JustGrab', 'GrabCar', 'Premium', 'Airport transfers', 'Scheduled rides'],
        priceLevel: 'SGD $8-20 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Gojek',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.gojek.com/sg/',
        appAvailable: true,
        features: ['GoRide', 'GoCar', 'Lower fares', 'Multi-service app', 'Promo codes'],
        priceLevel: 'SGD $6-16 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'ComfortDelGro',
        type: 'premium',
        rating: 4.5,
        bookingUrl: 'https://www.cdgtaxi.com.sg/',
        appAvailable: true,
        features: ['Official taxis', 'Limousine service', 'Fixed rates', 'Corporate accounts'],
        priceLevel: 'SGD $12-35 average ride',
        availability: 'Island-wide'
      }
    ]
  },
  {
    city: 'Hong Kong',
    country: 'Hong Kong',
    countryCode: 'HK',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/hk/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'Pet', 'Airport service'],
        priceLevel: 'HKD $50-150 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'HKTaxi',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.hktaxi.com/',
        appAvailable: true,
        features: ['Official taxis', 'English app', 'Fixed routes', 'Airport taxis'],
        priceLevel: 'HKD $40-120 average ride',
        availability: 'Hong Kong Island & Kowloon'
      }
    ]
  },
  {
    city: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    services: [
      {
        name: 'Kakao T',
        type: 'standard',
        rating: 4.7,
        bookingUrl: 'https://www.kakaomobility.com/',
        appAvailable: true,
        features: ['Standard taxi', 'Black', 'Venti', 'English support', 'Quick booking'],
        priceLevel: '₩5,000-15,000 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Uber',
        type: 'premium',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/kr/en/ride/',
        appAvailable: true,
        features: ['Uber Black', 'Premium vehicles', 'English app', 'Airport service'],
        priceLevel: '₩15,000-40,000 average ride',
        availability: 'Seoul city center'
      }
    ]
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    services: [
      {
        name: 'Grab',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.grab.com/th/',
        appAvailable: true,
        features: ['JustGrab', 'GrabCar', 'Premium', '6-seater', 'Airport transfers'],
        priceLevel: '฿80-200 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/bangkok/',
        appAvailable: true,
        features: ['Lower prices', 'Quick service', 'Professional drivers', 'Safety features'],
        priceLevel: '฿60-160 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'inDrive',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://indrive.com/en/home/',
        appAvailable: true,
        features: ['Negotiate price', 'Choose driver', 'Lower costs', 'City & intercity'],
        priceLevel: '฿50-150 average ride',
        availability: 'Good coverage'
      }
    ]
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/ae/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'XL', 'Yacht'],
        priceLevel: 'AED 20-50 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Careem',
        type: 'standard',
        rating: 4.6,
        bookingUrl: 'https://www.careem.com/',
        appAvailable: true,
        features: ['Go', 'Go+', 'Kids', 'Business', 'Delivery'],
        priceLevel: 'AED 18-45 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Dubai Taxi',
        type: 'premium',
        rating: 4.4,
        bookingUrl: 'https://www.dubaitaxi.ae/',
        appAvailable: true,
        features: ['Official taxis', 'Ladies taxis', 'Airport service', 'Luxury cabs'],
        priceLevel: 'AED 25-70 average ride',
        availability: 'Dubai city'
      },
      {
        name: 'Blacklane',
        type: 'luxury',
        rating: 4.8,
        bookingUrl: 'https://www.blacklane.com/en/chauffeur-service-dubai/',
        appAvailable: true,
        features: ['Chauffeur service', 'Luxury vehicles', 'Airport meet & greet', 'Business class'],
        priceLevel: 'AED 300-800+ per trip',
        availability: 'Dubai & DXB airport'
      }
    ]
  },
  {
    city: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/in/en/ride/',
        appAvailable: true,
        features: ['Go', 'Premier', 'XL', 'Auto', 'Intercity'],
        priceLevel: '₹150-400 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Ola',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.olacabs.com/',
        appAvailable: true,
        features: ['Mini', 'Prime', 'Lux', 'Share', 'Outstation'],
        priceLevel: '₹120-350 average ride',
        availability: 'Excellent coverage'
      }
    ]
  },
  {
    city: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.2,
        bookingUrl: 'https://www.uber.com/in/en/ride/',
        appAvailable: true,
        features: ['Go', 'Premier', 'Auto', 'XL', 'Intercity'],
        priceLevel: '₹140-380 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Ola',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.olacabs.com/',
        appAvailable: true,
        features: ['Mini', 'Prime', 'Lux', 'Auto', 'Airport'],
        priceLevel: '₹110-330 average ride',
        availability: 'Excellent coverage'
      }
    ]
  },

  // Australia & Oceania
  {
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/au/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'XL', 'Pet'],
        priceLevel: 'AUD $15-35 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'DiDi',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://web.didiglobal.com/au/',
        appAvailable: true,
        features: ['Express', 'Max', 'Share', 'Preferred', 'Lower fares'],
        priceLevel: 'AUD $12-30 average ride',
        availability: 'Wide coverage'
      },
      {
        name: '13cabs',
        type: 'premium',
        rating: 4.3,
        bookingUrl: 'https://www.13cabs.com.au/',
        appAvailable: true,
        features: ['Official taxis', 'Maxi cabs', 'Silver Service', 'Airport transfers'],
        priceLevel: 'AUD $20-50 average ride',
        availability: 'Sydney metro'
      }
    ]
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/au/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Premium', 'Green', 'XL'],
        priceLevel: 'AUD $14-32 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'DiDi',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://web.didiglobal.com/au/',
        appAvailable: true,
        features: ['Express', 'Max', 'Share', 'Preferred', 'Competitive pricing'],
        priceLevel: 'AUD $11-28 average ride',
        availability: 'Wide coverage'
      },
      {
        name: '13cabs',
        type: 'premium',
        rating: 4.2,
        bookingUrl: 'https://www.13cabs.com.au/',
        appAvailable: true,
        features: ['Official taxis', 'Wheelchair access', 'Silver Service', 'Fixed airport rates'],
        priceLevel: 'AUD $18-45 average ride',
        availability: 'Melbourne metro'
      }
    ]
  },

  // South America
  {
    city: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/br/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'Moto', 'Flash'],
        priceLevel: 'R$15-40 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: '99',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://99app.com/',
        appAvailable: true,
        features: ['Pop', 'Comfort', 'Top', 'Taxi', 'Lower prices'],
        priceLevel: 'R$12-35 average ride',
        availability: 'Excellent coverage'
      }
    ]
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/ar/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Black', 'Flash', 'Pet'],
        priceLevel: 'ARS $800-2,000 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Cabify',
        type: 'premium',
        rating: 4.5,
        bookingUrl: 'https://cabify.com/argentina',
        appAvailable: true,
        features: ['Lite', 'Executive', 'Group', 'Fixed pricing', 'Corporate accounts'],
        priceLevel: 'ARS $1,000-2,500 average ride',
        availability: 'Buenos Aires city'
      },
      {
        name: 'BA Taxi',
        type: 'standard',
        rating: 4.2,
        bookingUrl: 'https://www.bataxiapp.com/',
        appAvailable: true,
        features: ['Official taxis', 'Advance booking', 'Airport service', 'Fixed routes'],
        priceLevel: 'ARS $900-2,200 average ride',
        availability: 'Buenos Aires'
      }
    ]
  },

  // Middle East & Africa
  {
    city: 'Istanbul',
    country: 'Turkey',
    countryCode: 'TR',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/tr/en/ride/',
        appAvailable: true,
        features: ['Comfort', 'Taxi', 'Van', 'Airport transfers'],
        priceLevel: '₺80-200 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'BiTaksi',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.bitaksi.com/',
        appAvailable: true,
        features: ['Official taxis', 'Lower fares', 'Quick booking', 'Corporate accounts'],
        priceLevel: '₺70-180 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/istanbul/',
        appAvailable: true,
        features: ['Competitive pricing', 'Professional drivers', 'Safety features', 'Scheduled rides'],
        priceLevel: '₺60-150 average ride',
        availability: 'Wide coverage'
      }
    ]
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://www.uber.com/za/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'XL', 'Van', 'Airport service'],
        priceLevel: 'ZAR 50-150 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.6,
        bookingUrl: 'https://bolt.eu/en/cities/cape-town/',
        appAvailable: true,
        features: ['Lower fares', 'Quick service', 'Professional drivers', 'Safety features'],
        priceLevel: 'ZAR 40-120 average ride',
        availability: 'Wide coverage'
      }
    ]
  },

  // Additional Major Cities
  {
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/pt/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'Van', 'Pet'],
        priceLevel: '€6-15 average ride',
        availability: 'Excellent coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/lisbon/',
        appAvailable: true,
        features: ['Affordable rates', 'Quick arrival', 'Professional service', 'Eco-friendly'],
        priceLevel: '€5-12 average ride',
        availability: 'Wide coverage'
      },
      {
        name: 'FREE NOW',
        type: 'premium',
        rating: 4.3,
        bookingUrl: 'https://www.free-now.com/pt/',
        appAvailable: true,
        features: ['Licensed taxis', 'Fixed pricing', 'Business accounts', 'Airport service'],
        priceLevel: '€8-20 average ride',
        availability: 'Lisbon metro'
      }
    ]
  },
  {
    city: 'Brussels',
    country: 'Belgium',
    countryCode: 'BE',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/be/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'Van', 'XL'],
        priceLevel: '€8-18 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/brussels/',
        appAvailable: true,
        features: ['Lower prices', 'Quick service', 'Professional drivers', 'Scheduled rides'],
        priceLevel: '€6-14 average ride',
        availability: 'Wide coverage'
      }
    ]
  },
  {
    city: 'Copenhagen',
    country: 'Denmark',
    countryCode: 'DK',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/dk/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'Van', 'Premium'],
        priceLevel: 'DKK 80-200 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/copenhagen/',
        appAvailable: true,
        features: ['Competitive pricing', 'Quick booking', 'Professional service', 'Eco options'],
        priceLevel: 'DKK 60-160 average ride',
        availability: 'Wide coverage'
      }
    ]
  },
  {
    city: 'Stockholm',
    country: 'Sweden',
    countryCode: 'SE',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://www.uber.com/se/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'XL', 'Van'],
        priceLevel: 'SEK 100-250 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.5,
        bookingUrl: 'https://bolt.eu/en/cities/stockholm/',
        appAvailable: true,
        features: ['Lower fares', 'Quick service', 'Professional drivers', 'Safety features'],
        priceLevel: 'SEK 80-200 average ride',
        availability: 'Wide coverage'
      }
    ]
  },
  {
    city: 'Oslo',
    country: 'Norway',
    countryCode: 'NO',
    services: [
      {
        name: 'Uber',
        type: 'standard',
        rating: 4.3,
        bookingUrl: 'https://www.uber.com/no/en/ride/',
        appAvailable: true,
        features: ['UberX', 'Comfort', 'Green', 'Van', 'XL'],
        priceLevel: 'NOK 120-300 average ride',
        availability: 'Good coverage'
      },
      {
        name: 'Bolt',
        type: 'standard',
        rating: 4.4,
        bookingUrl: 'https://bolt.eu/en/cities/oslo/',
        appAvailable: true,
        features: ['Competitive pricing', 'Quick arrival', 'Professional service', 'Eco-friendly'],
        priceLevel: 'NOK 100-250 average ride',
        availability: 'Wide coverage'
      }
    ]
  },
];

interface TaxiServicesProps {
  currentLocation?: { countryCode?: string; city?: string } | null;
}

const TaxiServices: React.FC<TaxiServicesProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

  // Get unique countries for filter
  const countries = useMemo(() => {
    const countrySet = new Set(taxiServicesData.map(item => item.country));
    return Array.from(countrySet).sort();
  }, []);

  // Detect user's current location and prioritize it
  const sortedData = useMemo(() => {
    const userCountryCode = currentLocation?.countryCode?.toUpperCase();
    const userCity = currentLocation?.city?.toLowerCase();

    return [...taxiServicesData].sort((a, b) => {
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
      
      const matchesServiceType = selectedServiceType === 'all' || 
        item.services.some(service => service.type === selectedServiceType);

      return matchesSearch && matchesCountry && matchesServiceType;
    });
  }, [sortedData, searchQuery, selectedCountry, selectedServiceType]);

  const getServiceBadgeVariant = (type: string) => {
    switch (type) {
      case 'luxury': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'luxury': return <Crown className="h-3 w-3" />;
      case 'premium': return <Sparkles className="h-3 w-3" />;
      default: return <Car className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Taxi & Ride Services</h1>
        <p className="text-muted-foreground">
          Premium taxi services, ride-sharing, and luxury chauffeurs worldwide
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
                placeholder="e.g. New York, London, Tokyo..."
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
              <label className="text-sm font-medium">Service Type</label>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard (Uber, Bolt)</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury / Limousine</SelectItem>
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

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((cityData) => (
          <Card key={`${cityData.city}-${cityData.countryCode}`} className="hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    {cityData.city}
                  </CardTitle>
                  <CardDescription>{cityData.country}</CardDescription>
                </div>
                {currentLocation?.city?.toLowerCase() === cityData.city.toLowerCase() && (
                  <Badge variant="default" className="gradient-trust">
                    <Navigation className="h-3 w-3 mr-1" />
                    Your Location
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cityData.services.map((service, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-accent/50 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <Badge variant={getServiceBadgeVariant(service.type)} className="capitalize">
                        {getServiceIcon(service.type)}
                        <span className="ml-1">{service.type}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {service.rating}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-24">Price Range:</span>
                      <span className="font-medium">{service.priceLevel}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-24">Coverage:</span>
                      <span className="font-medium">{service.availability}</span>
                    </div>
                    {service.appAvailable && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-24">Mobile App:</span>
                        <Badge variant="secondary" className="text-xs">
                          ✓ Available
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIdx) => (
                      <Badge key={featureIdx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      service.type === 'luxury' 
                        ? 'gradient-trust' 
                        : service.type === 'premium'
                        ? 'gradient-success'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    onClick={() => window.open(service.bookingUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book {service.name}
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
              No services found matching your search criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Safety Tips */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle>Taxi & Ride Safety Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="text-primary font-bold">1.</div>
            <p className="text-sm">Always verify the driver and vehicle details before entering</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">2.</div>
            <p className="text-sm">Share your trip details with a friend or family member</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">3.</div>
            <p className="text-sm">Check ratings and reviews before booking premium services</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">4.</div>
            <p className="text-sm">Use in-app payment methods for security and convenience</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">5.</div>
            <p className="text-sm">For luxury services, book in advance for better availability</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxiServices;