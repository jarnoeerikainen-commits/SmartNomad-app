import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Fuel,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
  Star,
  TrendingUp,
  CreditCard,
  Globe,
  Phone,
  Mail,
  FileText,
  Info
} from 'lucide-react';

interface CarRentalService {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  coverage: string[];
  features: string[];
  priceRange: string;
  specialties: string[];
  bestFor: string[];
  insurance: string[];
  driverAge: string;
  deposit: string;
  cancellation: string;
  contactUrl: string;
  description: string;
}

interface CarLeaseProvider {
  id: string;
  name: string;
  type: 'Short-term' | 'Long-term' | 'Subscription';
  minDuration: string;
  maxDuration: string;
  carTypes: string[];
  includedServices: string[];
  pricing: string;
  bestFor: string[];
  countries: string[];
  requirements: string[];
  contactUrl: string;
  description: string;
}

const CarRentLease: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('rental');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCarType, setSelectedCarType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive rental services covering all demographics
  const rentalServices: CarRentalService[] = [
    {
      id: 'enterprise',
      name: 'Enterprise Rent-A-Car',
      logo: '🚗',
      rating: 4.5,
      reviewCount: 125000,
      categories: ['Budget', 'Business', 'Family', 'Luxury'],
      coverage: ['Worldwide', '85+ countries', 'Airport locations'],
      features: ['Free pickup', 'Multiple drivers', 'One-way rentals', 'Young driver options'],
      priceRange: '$30-150/day',
      specialties: ['Business travel', 'Long-term rentals', 'Group bookings'],
      bestFor: ['Business travelers', 'Families', 'Long stays'],
      insurance: ['Collision damage waiver', 'Liability protection', 'Personal accident insurance'],
      driverAge: '21+ (18+ in some locations)',
      deposit: '$200-500',
      cancellation: 'Free cancellation up to 24h',
      contactUrl: 'https://www.enterprise.com',
      description: 'Global leader with extensive network, excellent for business and family travel with flexible options.'
    },
    {
      id: 'hertz',
      name: 'Hertz',
      logo: '⚡',
      rating: 4.3,
      reviewCount: 98000,
      categories: ['Premium', 'Business', 'Electric', 'Luxury'],
      coverage: ['Worldwide', '150+ countries', 'Premium locations'],
      features: ['Electric vehicles', 'Hertz Gold Plus', 'Premium cars', 'Airport priority'],
      priceRange: '$40-200/day',
      specialties: ['Electric vehicles', 'Premium fleet', 'Business class'],
      bestFor: ['Business executives', 'Eco-conscious travelers', 'Luxury seekers'],
      insurance: ['Premium coverage', 'Zero excess options', 'International protection'],
      driverAge: '25+ (23+ with surcharge)',
      deposit: '$300-1000',
      cancellation: 'Free cancellation up to 48h',
      contactUrl: 'https://www.hertz.com',
      description: 'Premium service with extensive electric vehicle fleet and business-focused amenities.'
    },
    {
      id: 'sixt',
      name: 'SIXT',
      logo: '🏆',
      rating: 4.6,
      reviewCount: 76000,
      categories: ['Luxury', 'Premium', 'Sports', 'Business'],
      coverage: ['Europe', 'USA', 'Asia', '100+ countries'],
      features: ['Luxury cars', 'Sports cars', 'SUVs', 'Young driver friendly'],
      priceRange: '$45-300/day',
      specialties: ['Luxury vehicles', 'German engineering', 'Premium service'],
      bestFor: ['Luxury travelers', 'Special occasions', 'Sports car enthusiasts'],
      insurance: ['Full coverage options', 'Premium protection', 'International coverage'],
      driverAge: '21+ (19+ in some locations)',
      deposit: '$500-2000',
      cancellation: 'Free cancellation up to 24h',
      contactUrl: 'https://www.sixt.com',
      description: 'Premium German brand offering luxury and sports cars with exceptional service quality.'
    },
    {
      id: 'budget',
      name: 'Budget Car Rental',
      logo: '💰',
      rating: 4.2,
      reviewCount: 89000,
      categories: ['Budget', 'Economy', 'Student', 'Family'],
      coverage: ['Worldwide', '120+ countries', 'Budget-friendly'],
      features: ['Low prices', 'Student discounts', 'Weekend specials', 'Compact cars'],
      priceRange: '$25-80/day',
      specialties: ['Budget travel', 'Student friendly', 'Economy options'],
      bestFor: ['Students', 'Budget travelers', 'Short trips'],
      insurance: ['Basic coverage', 'Optional upgrades', 'Affordable protection'],
      driverAge: '21+ (18+ with surcharge)',
      deposit: '$150-300',
      cancellation: 'Free cancellation up to 24h',
      contactUrl: 'https://www.budget.com',
      description: 'Best value option for budget-conscious travelers, students, and short-term needs.'
    },
    {
      id: 'localrent',
      name: 'Local Car Rental Aggregator',
      logo: '🌍',
      rating: 4.4,
      reviewCount: 54000,
      categories: ['Local', 'Budget', 'Regional', 'Cultural'],
      coverage: ['Worldwide', 'Local providers', 'Regional specialists'],
      features: ['Local expertise', 'Best prices', 'Unique vehicles', 'Cultural insights'],
      priceRange: '$20-100/day',
      specialties: ['Local providers', 'Regional knowledge', 'Unique experiences'],
      bestFor: ['Cultural explorers', 'Long-term travelers', 'Local experience seekers'],
      insurance: ['Varies by provider', 'Local coverage options'],
      driverAge: 'Varies by country',
      deposit: '$100-500',
      cancellation: 'Varies by provider',
      contactUrl: 'https://www.rentalcars.com',
      description: 'Connect with trusted local rental companies for authentic experiences and better prices.'
    },
    {
      id: 'europcar',
      name: 'Europcar',
      logo: '🇪🇺',
      rating: 4.4,
      reviewCount: 67000,
      categories: ['European', 'Family', 'Business', 'Eco'],
      coverage: ['Europe', 'Worldwide', '140+ countries'],
      features: ['Green vehicles', 'Family cars', 'One-way Europe', 'Ski equipment'],
      priceRange: '$35-120/day',
      specialties: ['European travel', 'Eco-friendly', 'Ski trips'],
      bestFor: ['European travelers', 'Families', 'Eco-conscious'],
      insurance: ['Comprehensive EU coverage', 'Cross-border protection'],
      driverAge: '21+ (18+ in some countries)',
      deposit: '$200-600',
      cancellation: 'Free cancellation up to 48h',
      contactUrl: 'https://www.europcar.com',
      description: 'European specialist with excellent cross-border coverage and eco-friendly options.'
    },
    {
      id: 'avis',
      name: 'Avis',
      logo: '🔴',
      rating: 4.3,
      reviewCount: 93000,
      categories: ['Global', 'Business', 'Premium', 'Reliable'],
      coverage: ['Worldwide', '165+ countries', 'Major airports'],
      features: ['Avis Preferred', 'Express service', 'Premium fleet', 'Business tools'],
      priceRange: '$40-180/day',
      specialties: ['Business travel', 'Reliability', 'Global network'],
      bestFor: ['Business professionals', 'Frequent travelers', 'Corporate bookings'],
      insurance: ['Business coverage', 'Corporate plans', 'International protection'],
      driverAge: '25+ (23+ with fee)',
      deposit: '$300-800',
      cancellation: 'Free cancellation up to 48h',
      contactUrl: 'https://www.avis.com',
      description: 'Trusted global brand with strong business focus and loyalty program benefits.'
    },
    {
      id: 'turo',
      name: 'Turo (Peer-to-peer)',
      logo: '🤝',
      rating: 4.5,
      reviewCount: 45000,
      categories: ['P2P', 'Unique', 'Local', 'Flexible'],
      coverage: ['USA', 'Canada', 'UK', 'France', 'Australia'],
      features: ['Unique cars', 'Local hosts', 'Flexible booking', 'Airport delivery'],
      priceRange: '$30-200/day',
      specialties: ['Unique vehicles', 'Personal service', 'Flexible terms'],
      bestFor: ['Unique car enthusiasts', 'Long stays', 'Personal touch seekers'],
      insurance: ['Turo insurance plans', 'Host protection', 'Liability coverage'],
      driverAge: '21+ (18+ in some states)',
      deposit: '$100-500',
      cancellation: 'Varies by host policy',
      contactUrl: 'https://www.turo.com',
      description: 'Peer-to-peer car sharing platform offering unique vehicles and personal hosting experiences.'
    }
  ];

  // Comprehensive lease providers
  const leaseProviders: CarLeaseProvider[] = [
    {
      id: 'flexicar',
      name: 'Flexi Car Lease',
      type: 'Subscription',
      minDuration: '1 month',
      maxDuration: 'Unlimited',
      carTypes: ['Economy', 'Family', 'SUV', 'Electric'],
      includedServices: ['Insurance', 'Maintenance', 'Road tax', 'Breakdown cover', 'Free swap'],
      pricing: '$400-1200/month',
      bestFor: ['Digital nomads', 'Expats', 'Flexible living', 'Trial periods'],
      countries: ['UK', 'Germany', 'France', 'Netherlands', 'Spain'],
      requirements: ['Valid license', 'Proof of address', 'Credit check'],
      contactUrl: 'https://www.flexicar-lease.com',
      description: 'Flexible monthly subscriptions perfect for digital nomads and expats with no long-term commitment.'
    },
    {
      id: 'leasys',
      name: 'Leasys Mobility',
      type: 'Short-term',
      minDuration: '1 month',
      maxDuration: '24 months',
      carTypes: ['All types', 'Luxury', 'Electric', 'Commercial'],
      includedServices: ['Insurance', 'Maintenance', 'Assistance', 'Tax', 'Registration'],
      pricing: '$500-2000/month',
      bestFor: ['Business travelers', 'Long projects', 'Temporary assignments', 'Company cars'],
      countries: ['Italy', 'France', 'Spain', 'Germany', 'Belgium', 'Portugal'],
      requirements: ['Business license', 'Employment proof', 'Credit check'],
      contactUrl: 'https://www.leasys.com',
      description: 'Professional leasing solutions for business travelers and temporary assignments across Europe.'
    },
    {
      id: 'drover',
      name: 'Drover Car Subscription',
      type: 'Subscription',
      minDuration: '28 days',
      maxDuration: 'Flexible',
      carTypes: ['Premium', 'Electric', 'SUV', 'Family'],
      includedServices: ['Insurance', 'Maintenance', 'Road tax', 'Breakdown', 'Swap anytime'],
      pricing: '$600-1500/month',
      bestFor: ['No commitment needed', 'Testing electric cars', 'Lifestyle flexibility'],
      countries: ['UK', 'Coming to EU'],
      requirements: ['UK license', '23+', 'Credit check'],
      contactUrl: 'https://www.drover.com',
      description: 'Modern car subscription service with ultimate flexibility - swap or cancel anytime.'
    },
    {
      id: 'longterm-lease',
      name: 'Long-term Auto Lease',
      type: 'Long-term',
      minDuration: '12 months',
      maxDuration: '48 months',
      carTypes: ['All types', 'New cars', 'Business', 'Personal'],
      includedServices: ['Insurance options', 'Maintenance plans', 'Warranty', 'Road tax'],
      pricing: '$300-1500/month',
      bestFor: ['Residents', 'Long-term expats', 'Cost savings', 'New cars'],
      countries: ['Worldwide', 'Major markets'],
      requirements: ['Residency', 'Employment', 'Credit history', 'Down payment'],
      contactUrl: 'https://www.autolease.com',
      description: 'Traditional long-term leasing ideal for residents and long-term expats seeking stability.'
    },
    {
      id: 'peugeot-lease',
      name: 'Peugeot Open Europe',
      type: 'Short-term',
      minDuration: '17 days',
      maxDuration: '175 days',
      carTypes: ['Peugeot', 'Citroën', 'DS', 'Opel', 'New vehicles'],
      includedServices: ['Full insurance', 'Maintenance', 'Breakdown', 'No excess', 'Zero deposit'],
      pricing: '$60-120/day (volume discount)',
      bestFor: ['Non-EU tourists', 'Extended European trips', 'Multiple countries'],
      countries: ['All Europe', '42 countries', 'Tax-free for non-EU'],
      requirements: ['Non-EU resident', '18+', 'Valid license'],
      contactUrl: 'https://www.openeuropeprogram.com',
      description: 'Unique tax-free program for non-EU residents traveling Europe - brand new cars with full coverage.'
    },
    {
      id: 'business-lease',
      name: 'Corporate Fleet Solutions',
      type: 'Long-term',
      minDuration: '24 months',
      maxDuration: '60 months',
      carTypes: ['Business', 'Executive', 'Fleet', 'Electric'],
      includedServices: ['Full maintenance', 'Insurance', 'Fleet management', 'Driver services', 'Fuel cards'],
      pricing: 'Custom quotes',
      bestFor: ['Companies', 'Executive teams', 'Multi-vehicle needs', 'Corporate travel'],
      countries: ['Worldwide', 'Enterprise solutions'],
      requirements: ['Business registration', 'Financial statements', 'Credit check'],
      contactUrl: 'https://www.corporatefleet.com',
      description: 'Enterprise-grade fleet management for companies with multiple vehicles and executive needs.'
    }
  ];

  const filteredRentals = rentalServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || service.coverage.some(c => c.toLowerCase().includes(selectedCountry.toLowerCase()));
    return matchesSearch && matchesCountry;
  });

  const filteredLeases = leaseProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedCarType === 'all' || provider.type === selectedCarType;
    return matchesSearch && matchesType;
  });

  const RentalCard = ({ service }: { service: CarRentalService }) => (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{service.logo}</div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">({service.reviewCount.toLocaleString()})</span>
                </div>
              </div>
            </div>
          </div>
          <Badge variant="secondary">{service.priceRange}</Badge>
        </div>
        <CardDescription className="mt-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Categories</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {service.categories.map(cat => (
              <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
            ))}
          </div>
        </div>

        {/* Best For */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Best For</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {service.bestFor.map(item => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Key Features</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {service.features.slice(0, 4).map(feature => (
              <div key={feature} className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Details */}
        <div className="bg-accent/50 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Driver Age:</span>
            <span className="font-medium">{service.driverAge}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit:</span>
            <span className="font-medium">{service.deposit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cancellation:</span>
            <span className="font-medium text-green-600">{service.cancellation}</span>
          </div>
        </div>

        <Button className="w-full gradient-trust" asChild>
          <a href={service.contactUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit {service.name}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  const LeaseCard = ({ provider }: { provider: CarLeaseProvider }) => (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{provider.type}</Badge>
              <Badge variant="outline">{provider.pricing}</Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">{provider.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Duration */}
        <div className="bg-accent/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Lease Duration</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{provider.minDuration}</span> to <span className="font-medium">{provider.maxDuration}</span>
          </div>
        </div>

        {/* Best For */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Ideal For</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.bestFor.map(item => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </div>

        {/* Included Services */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">What's Included</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {provider.includedServices.slice(0, 6).map(service => (
              <div key={service} className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-xs">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Available In</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.countries.map(country => (
              <Badge key={country} variant="outline" className="text-xs">{country}</Badge>
            ))}
          </div>
        </div>

        <Button className="w-full gradient-success" asChild>
          <a href={provider.contactUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Quote from {provider.name}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Car className="h-8 w-8" />
          Car Rent & Lease
        </h1>
        <p className="text-muted-foreground">
          Find the perfect vehicle solution for your travel needs - from short-term rentals to long-term leases
        </p>
      </div>

      {/* Important Tips */}
      <Alert className="mb-6 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Smart Tip:</strong> Book rentals 2-4 weeks in advance for best prices. Consider long-term leases if staying 3+ months. Always check insurance coverage and understand local driving laws.
        </AlertDescription>
      </Alert>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rental" className="gap-2">
            <Car className="h-4 w-4" />
            Rental Services
          </TabsTrigger>
          <TabsTrigger value="lease" className="gap-2">
            <Calendar className="h-4 w-4" />
            Lease Programs
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <FileText className="h-4 w-4" />
            Guide
          </TabsTrigger>
        </TabsList>

        {/* Rental Services Tab */}
        <TabsContent value="rental" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Find Your Perfect Rental
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Search Services</Label>
                  <Input
                    placeholder="Search by name or feature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="worldwide">Worldwide</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCountry('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRentals.map(service => (
              <RentalCard key={service.id} service={service} />
            ))}
          </div>

          {filteredRentals.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No rental services found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Lease Programs Tab */}
        <TabsContent value="lease" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Find Your Lease Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Search Programs</Label>
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Lease Type</Label>
                  <Select value={selectedCarType} onValueChange={setSelectedCarType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Short-term">Short-term</SelectItem>
                      <SelectItem value="Long-term">Long-term</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCarType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredLeases.map(provider => (
              <LeaseCard key={provider.id} provider={provider} />
            ))}
          </div>

          {filteredLeases.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No lease programs found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm('');
                  setSelectedCarType('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rental vs Lease Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  When to Rent vs Lease
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    Choose Rental If:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Staying less than 3 months</li>
                    <li>• Need flexibility in vehicle type</li>
                    <li>• Visiting multiple countries</li>
                    <li>• Prefer no long-term commitment</li>
                    <li>• Want included insurance/maintenance</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Choose Lease If:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Staying 3+ months in one country</li>
                    <li>• Want lower monthly costs</li>
                    <li>• Need consistent vehicle</li>
                    <li>• Building credit history</li>
                    <li>• Want latest model vehicles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Comparison Example
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>6-Month Stay in Europe</strong>
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Daily Rental</span>
                      <Badge variant="destructive">Higher Cost</Badge>
                    </div>
                    <p className="text-2xl font-bold">$9,000</p>
                    <p className="text-xs text-muted-foreground">$50/day × 180 days</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">6-Month Lease</span>
                      <Badge className="bg-green-600">Best Value</Badge>
                    </div>
                    <p className="text-2xl font-bold">$4,200</p>
                    <p className="text-xs text-muted-foreground">$700/month × 6 months</p>
                  </div>
                  <div className="text-center p-2 bg-accent rounded-lg">
                    <p className="text-sm font-semibold text-green-600">
                      Save $4,800 with Lease! 💰
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Driving */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  International Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Documents Needed:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Valid driver's license from home country</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>International Driving Permit (IDP) - required in many countries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Passport or national ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Credit card for deposit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Proof of insurance (some countries)</span>
                    </li>
                  </ul>
                </div>
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Get your IDP before traveling - it's often required even if not explicitly stated!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Insurance Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Insurance Essentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Coverage Types:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-accent/50 rounded">
                      <p className="font-medium">Collision Damage Waiver (CDW)</p>
                      <p className="text-xs text-muted-foreground">Reduces liability for vehicle damage</p>
                    </div>
                    <div className="p-2 bg-accent/50 rounded">
                      <p className="font-medium">Liability Protection</p>
                      <p className="text-xs text-muted-foreground">Covers damage to others/property</p>
                    </div>
                    <div className="p-2 bg-accent/50 rounded">
                      <p className="font-medium">Personal Accident Insurance</p>
                      <p className="text-xs text-muted-foreground">Medical coverage for you/passengers</p>
                    </div>
                    <div className="p-2 bg-accent/50 rounded">
                      <p className="font-medium">Theft Protection</p>
                      <p className="text-xs text-muted-foreground">Coverage if car is stolen</p>
                    </div>
                  </div>
                </div>
                <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-xs">
                    <strong>Pro Tip:</strong> Check if your credit card or travel insurance already covers rental cars before purchasing extra insurance!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Money Saving Tips */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Money-Saving Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Booking Strategy</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Book 2-4 weeks in advance</li>
                      <li>• Compare prices across platforms</li>
                      <li>• Check for promo codes</li>
                      <li>• Consider smaller local companies</li>
                      <li>• Book for full weeks (cheaper)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">During Rental</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Decline unnecessary insurance</li>
                      <li>• Choose smaller cars</li>
                      <li>• Return with full tank</li>
                      <li>• Avoid airport locations</li>
                      <li>• Check for university/AAA discounts</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Long-term Stays</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Switch to lease after 3 months</li>
                      <li>• Ask for extended rental rates</li>
                      <li>• Consider car subscription services</li>
                      <li>• Negotiate monthly rates</li>
                      <li>• Join loyalty programs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="mt-8 gradient-trust text-primary-foreground border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our team can help you find the perfect vehicle solution for your specific travel situation
          </p>
          <Button variant="secondary" size="lg">
            <Mail className="h-4 w-4 mr-2" />
            Contact Our Travel Experts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarRentLease;
