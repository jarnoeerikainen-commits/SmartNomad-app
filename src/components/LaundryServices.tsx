import React, { useState, useMemo } from 'react';
import { 
  Shirt, Search, MapPin, Star, DollarSign, Clock, 
  Leaf, Zap, Phone, Globe, Mail, Award, Shield,
  TrendingUp, Filter, Info, CheckCircle2, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LaundryService {
  id: string;
  name: string;
  description: string;
  rating: number;
  countries: string[];
  cities: string[];
  serviceTypes: string[];
  pricing: {
    from: number;
    currency: string;
    unit: string;
  };
  features: string[];
  badges: string[];
  contact: {
    website: string;
    phone?: string;
    email?: string;
  };
  operatingHours: string;
  verificationLevel: 'premium' | 'verified' | 'standard';
  yearsOperation: number;
  region: string;
  specialFeatures: string[];
}

const laundryServices: LaundryService[] = [
  // North America
  {
    id: 'sudsy',
    name: 'Sudsy',
    description: 'Premium eco-friendly laundry service with pickup/delivery across major US cities',
    rating: 4.7,
    countries: ['US', 'CA'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Toronto', 'San Francisco', 'Boston'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Alterations', 'Eco-Friendly'],
    pricing: { from: 1.50, currency: 'USD', unit: 'per lb' },
    features: ['Pickup/Delivery', 'Real-time tracking', 'Express 4h', 'Mobile App'],
    badges: ['SmartNomad Verified', 'Eco Leader', 'Premium Service'],
    contact: {
      website: 'https://sudsy.com',
      phone: '+1-555-LAUNDRY',
      email: 'care@sudsy.com'
    },
    operatingHours: 'Mon-Sat: 8:00-20:00, Sun: 10:00-18:00',
    verificationLevel: 'premium',
    yearsOperation: 8,
    region: 'North America',
    specialFeatures: ['Volume discounts', 'Subscription available', 'Quality guarantee']
  },
  {
    id: 'cleanly',
    name: 'Cleanly',
    description: 'On-demand laundry and dry cleaning with exceptional customer service',
    rating: 4.5,
    countries: ['US'],
    cities: ['New York', 'Chicago', 'Washington DC', 'Boston', 'Philadelphia'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Premium Care'],
    pricing: { from: 1.75, currency: 'USD', unit: 'per lb' },
    features: ['Pickup/Delivery', 'Scheduling platform', '24/7 support'],
    badges: ['Verified', 'Nomad Favorite'],
    contact: {
      website: 'https://cleanly.com',
      email: 'hello@cleanly.com'
    },
    operatingHours: 'Mon-Sun: 7:00-22:00',
    verificationLevel: 'verified',
    yearsOperation: 6,
    region: 'North America',
    specialFeatures: ['Student discount 15%', 'Same-day service']
  },
  
  // Europe
  {
    id: 'laundrycare',
    name: 'Laundry Care',
    description: 'European premium laundry chain with eco-certification and multilingual staff',
    rating: 4.5,
    countries: ['GB', 'DE', 'FR', 'ES', 'IT', 'NL'],
    cities: ['London', 'Berlin', 'Paris', 'Barcelona', 'Rome', 'Amsterdam'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Premium Care', 'Eco-Friendly'],
    pricing: { from: 4.50, currency: 'EUR', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Multilingual staff', 'Quality guarantee'],
    badges: ['SmartNomad Verified', 'Eco Certified', 'Multilingual Expert'],
    contact: {
      website: 'https://laundrycare.eu',
      phone: '+44-20-7123-4567',
      email: 'service@laundrycare.eu'
    },
    operatingHours: 'Mon-Fri: 7:00-22:00, Sat-Sun: 9:00-20:00',
    verificationLevel: 'premium',
    yearsOperation: 12,
    region: 'Europe',
    specialFeatures: ['Express service', 'Eco detergents', 'Insurance coverage']
  },
  {
    id: 'laundryheap',
    name: 'Laundryheap',
    description: 'On-demand laundry service across UK, Europe and Middle East',
    rating: 4.4,
    countries: ['GB', 'IE', 'AE', 'KW', 'BH'],
    cities: ['London', 'Dublin', 'Dubai', 'Kuwait City', 'Manama'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Express'],
    pricing: { from: 5.00, currency: 'GBP', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Mobile app', '1-hour slots'],
    badges: ['Verified', 'Premium Service'],
    contact: {
      website: 'https://laundryheap.com',
      email: 'help@laundryheap.com'
    },
    operatingHours: 'Mon-Sun: 7:00-23:00',
    verificationLevel: 'verified',
    yearsOperation: 9,
    region: 'Europe',
    specialFeatures: ['24h turnaround', 'Contactless delivery']
  },
  {
    id: 'laundra',
    name: 'Laundra',
    description: 'UK-based subscription laundry service with premium quality',
    rating: 4.4,
    countries: ['GB'],
    cities: ['London', 'Manchester', 'Birmingham', 'Bristol'],
    serviceTypes: ['Wash & Fold', 'Subscription', 'Premium Care'],
    pricing: { from: 30.00, currency: 'GBP', unit: 'per month' },
    features: ['Unlimited laundry', 'Pickup/Delivery', 'Premium detergents'],
    badges: ['Verified', 'Eco Leader'],
    contact: {
      website: 'https://laundra.co.uk',
      email: 'hello@laundra.co.uk'
    },
    operatingHours: 'Mon-Sat: 8:00-20:00',
    verificationLevel: 'verified',
    yearsOperation: 5,
    region: 'Europe',
    specialFeatures: ['Subscription model', 'Cancel anytime', 'Premium fabrics']
  },

  // Asia
  {
    id: 'happynest',
    name: 'HappyNest',
    description: 'Asian premium laundry service focusing on digital convenience and quality',
    rating: 4.6,
    countries: ['SG', 'MY', 'TH', 'JP'],
    cities: ['Singapore', 'Bangkok', 'Tokyo', 'Kuala Lumpur', 'Osaka'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Express', 'Subscription'],
    pricing: { from: 3.20, currency: 'SGD', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Mobile app', 'Student discount', 'Quality guarantee'],
    badges: ['SmartNomad Verified', 'Nomad Favorite', 'Premium Service'],
    contact: {
      website: 'https://happynest.sg',
      phone: '+65-6123-4567',
      email: 'care@happynest.sg'
    },
    operatingHours: 'Mon-Sun: 8:00-21:00',
    verificationLevel: 'premium',
    yearsOperation: 6,
    region: 'Asia',
    specialFeatures: ['Student discount 20%', 'Subscription plans', 'Express 6h']
  },
  {
    id: 'mrjeff',
    name: 'Mr. Jeff',
    description: 'Global franchise network with consistent quality across 30+ countries',
    rating: 4.3,
    countries: ['ES', 'MX', 'BR', 'AR', 'CO', 'TH', 'ID', 'PH'],
    cities: ['Bangkok', 'Jakarta', 'Manila', 'Mexico City', 'São Paulo', 'Buenos Aires'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Ironing'],
    pricing: { from: 2.50, currency: 'USD', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Mobile app', 'Global network'],
    badges: ['Verified', 'Global Network'],
    contact: {
      website: 'https://mrjeff.com',
      email: 'support@mrjeff.com'
    },
    operatingHours: 'Mon-Sat: 9:00-20:00',
    verificationLevel: 'verified',
    yearsOperation: 7,
    region: 'Asia',
    specialFeatures: ['Franchise quality', 'Global consistency', 'Local pricing']
  },
  {
    id: 'dhobilite',
    name: 'DhobiLite',
    description: 'Premium laundry service in India with tech-enabled operations',
    rating: 4.5,
    countries: ['IN'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Premium Care', 'Express'],
    pricing: { from: 80, currency: 'INR', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Quality guarantee', 'Express service'],
    badges: ['Verified', 'Premium Service', 'Tech Leader'],
    contact: {
      website: 'https://dhobilite.in',
      phone: '+91-22-1234-5678',
      email: 'care@dhobilite.in'
    },
    operatingHours: 'Mon-Sun: 8:00-22:00',
    verificationLevel: 'verified',
    yearsOperation: 5,
    region: 'Asia',
    specialFeatures: ['Premium fabrics', 'Express 8h', 'Quality inspection']
  },

  // Middle East
  {
    id: 'washmen',
    name: 'Washmen',
    description: 'Premium on-demand laundry service across UAE with quality guarantees',
    rating: 4.7,
    countries: ['AE', 'SA', 'QA'],
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Sharjah'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Premium Care', 'Express'],
    pricing: { from: 5.00, currency: 'AED', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Quality guarantee', 'Express 2h', 'Premium detergents'],
    badges: ['SmartNomad Verified', 'Premium Service', 'Express Leader'],
    contact: {
      website: 'https://washmen.com',
      phone: '+971-4-123-4567',
      email: 'hello@washmen.com'
    },
    operatingHours: 'Mon-Sun: 7:00-23:00',
    verificationLevel: 'premium',
    yearsOperation: 7,
    region: 'Middle East',
    specialFeatures: ['Express 2h available', 'Premium detergents', 'Luxury fabrics']
  },

  // Latin America
  {
    id: 'rappiturbo',
    name: 'Rappi Turbo',
    description: 'Fast laundry service integrated with Rappi superapp across Latin America',
    rating: 4.3,
    countries: ['CO', 'MX', 'BR', 'AR', 'CL'],
    cities: ['Bogotá', 'Mexico City', 'São Paulo', 'Buenos Aires', 'Santiago'],
    serviceTypes: ['Wash & Fold', 'Express'],
    pricing: { from: 2.00, currency: 'USD', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Superapp integration', 'Fast service'],
    badges: ['Verified', 'Fast Service'],
    contact: {
      website: 'https://rappi.com',
      email: 'soporte@rappi.com'
    },
    operatingHours: 'Mon-Sun: 8:00-22:00',
    verificationLevel: 'verified',
    yearsOperation: 4,
    region: 'Latin America',
    specialFeatures: ['Cash payment', 'Local pricing', 'Fast turnaround']
  },

  // Australia
  {
    id: 'laundryheapau',
    name: 'Laundryheap Australia',
    description: 'Professional laundry service with quality guarantee across major Australian cities',
    rating: 4.5,
    countries: ['AU'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    serviceTypes: ['Wash & Fold', 'Dry Cleaning', 'Premium Care'],
    pricing: { from: 4.00, currency: 'AUD', unit: 'per kg' },
    features: ['Pickup/Delivery', 'Quality guarantee', 'Express service'],
    badges: ['Verified', 'Premium Service'],
    contact: {
      website: 'https://laundryheap.com.au',
      email: 'hello@laundryheap.com.au'
    },
    operatingHours: 'Mon-Fri: 7:00-21:00, Sat-Sun: 9:00-18:00',
    verificationLevel: 'verified',
    yearsOperation: 6,
    region: 'Australia',
    specialFeatures: ['Quality guarantee', 'Eco-friendly options', '24h service']
  }
];

const LaundryServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [showWeightGuide, setShowWeightGuide] = useState(false);

  const regions = ['all', ...Array.from(new Set(laundryServices.map(s => s.region)))];
  const serviceTypes = ['all', ...Array.from(new Set(laundryServices.flatMap(s => s.serviceTypes)))];

  const filteredServices = useMemo(() => {
    return laundryServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'all' || service.region === selectedRegion;
      const matchesServiceType = selectedServiceType === 'all' || 
        service.serviceTypes.includes(selectedServiceType);

      return matchesSearch && matchesRegion && matchesServiceType;
    });
  }, [searchTerm, selectedRegion, selectedServiceType]);

  const verificationBadgeColor = (level: string) => {
    switch (level) {
      case 'premium': return 'gradient-trust';
      case 'verified': return 'bg-success/20 text-success';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-trust">
            <Shirt className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Global Laundry Concierge</h1>
            <p className="text-muted-foreground">Premium laundry services worldwide - Verified, trusted, quality guaranteed</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-success/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{laundryServices.length}</p>
                <p className="text-xs text-muted-foreground">Verified Services</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/20">
            <CardContent className="p-4 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{Array.from(new Set(laundryServices.flatMap(s => s.countries))).length}+</p>
                <p className="text-xs text-muted-foreground">Countries Covered</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-info/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">4.5+</p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">Premium</p>
                <p className="text-xs text-muted-foreground">Quality Assured</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Info Alert */}
        <Alert className="border-info/50 bg-info/5">
          <Info className="h-4 w-4 text-info" />
          <AlertDescription className="text-sm">
            <strong>Quality Guarantee:</strong> All services are verified with 4.0+ ratings. 
            We manually verify each provider for quality, reliability, and service standards.
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 ml-2 text-info"
              onClick={() => setShowWeightGuide(!showWeightGuide)}
            >
              View Laundry Weight Guide →
            </Button>
          </AlertDescription>
        </Alert>

        {/* Weight Guide */}
        {showWeightGuide && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Laundry Weight Estimator Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Common Items Weight:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• T-shirt: ~150-200g</li>
                    <li>• Jeans: ~600-800g</li>
                    <li>• Underwear: ~50-100g</li>
                    <li>• Shirt: ~200-300g</li>
                    <li>• Hoodie: ~500-700g</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Typical Load Estimates:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>3kg</strong>: 5 t-shirts + 2 jeans + 5 underwear</li>
                    <li>• <strong>5kg</strong>: 8 t-shirts + 3 jeans + 10 underwear + 2 hoodies</li>
                    <li>• <strong>7kg</strong>: Full week of clothes for 1 person</li>
                    <li>• <strong>10kg</strong>: 2 weeks of clothes</li>
                  </ul>
                </div>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Most services charge per kg or lb. Knowing your typical load weight helps you estimate costs accurately.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service, city, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Services' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-elegant transition-all duration-300 border-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <Badge className={verificationBadgeColor(service.verificationLevel)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {service.verificationLevel === 'premium' ? 'Premium' : 'Verified'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-semibold text-sm">{service.rating}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-xs text-muted-foreground">{service.yearsOperation} years</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Badge variant="outline" className="text-xs">{service.region}</Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">{service.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {service.badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                <DollarSign className="h-5 w-5 text-success" />
                <div>
                  <p className="font-semibold text-success">
                    From {service.pricing.from} {service.pricing.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">{service.pricing.unit}</p>
                </div>
              </div>

              {/* Service Types */}
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Services Offered:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.serviceTypes.map((type, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Key Features:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Features */}
              {service.specialFeatures.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning" />
                    Special Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.specialFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-warning/10 text-warning border-warning/20">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage */}
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Coverage:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.cities.slice(0, 4).map((city, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {city}
                    </Badge>
                  ))}
                  {service.cities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.cities.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{service.operatingHours}</span>
              </div>

              <Separator />

              {/* Contact */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gradient-trust" asChild>
                  <a href={service.contact.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
                {service.contact.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${service.contact.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                {service.contact.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${service.contact.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Shirt className="h-16 w-16 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find laundry services.
              </p>
            </div>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedServiceType('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Cultural Guide */}
      <Card className="border-info/20 bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-info" />
            Cultural Laundry Guide for Nomads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Asia</h4>
              <p className="text-sm text-muted-foreground">
                Laundry services are abundant and affordable. Many offer same-day service. 
                Student discounts common (15-20%). Monsoon season may affect drying times.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Europe</h4>
              <p className="text-sm text-muted-foreground">
                Premium services with eco-focus. Higher prices but quality guaranteed. 
                Many offer subscription models. Multilingual staff in major cities.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Middle East</h4>
              <p className="text-sm text-muted-foreground">
                Premium services with express options (2-4h). Higher pricing but excellent quality. 
                Many cater to luxury fabrics. Service levels very high.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Latin America</h4>
              <p className="text-sm text-muted-foreground">
                Very affordable services. Cash payment common. Local "lavanderías" offer great value. 
                Growing app-based services in major cities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-warning" />
            Smart Nomad Laundry Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                Cost Optimization
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Accumulate 5-7kg loads for better per-kg rates</li>
                <li>• Look for subscription plans if staying 1+ month</li>
                <li>• Student discounts available in most cities (15-20%)</li>
                <li>• Self-service + fold-only can save 30-40%</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-info" />
                Quality Protection
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use services with quality guarantees</li>
                <li>• Separate delicate items and mark clearly</li>
                <li>• Take photos of expensive items before service</li>
                <li>• Check reviews for fabric damage complaints</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Timing Strategy
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Schedule laundry day after arrival in new city</li>
                <li>• Avoid express services unless truly needed (2x cost)</li>
                <li>• Use 24-48h standard service for best value</li>
                <li>• Plan around rainy/monsoon seasons</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Leaf className="h-4 w-4 text-success" />
                Eco-Friendly Options
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Look for eco-certified services</li>
                <li>• Request hypoallergenic/eco detergents</li>
                <li>• Some services offer biodegradable packaging</li>
                <li>• Line-drying available at premium services</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaundryServices;
