import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Truck, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Zap,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface DeliveryService {
  id: string;
  name: string;
  category: 'food' | 'parcel' | 'local' | 'premium';
  rating: number;
  coverage: string;
  regions: string[];
  services: string[];
  premium: {
    name: string;
    price: string;
  };
  features: string[];
  bestFor: string[];
  apiAvailable: boolean;
  specialFeatures: string[];
  url: string;
}

const deliveryServices: DeliveryService[] = [
  // Food & Grocery Delivery
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    category: 'food',
    rating: 4.6,
    coverage: '6,000+ cities worldwide',
    regions: ['Global', 'Americas', 'Europe', 'Asia', 'Oceania'],
    services: ['Restaurant food', 'Groceries', 'Alcohol'],
    premium: {
      name: 'Uber Eats Pass',
      price: '$9.99/month'
    },
    features: [
      'Real-time tracking',
      'Contactless delivery',
      'Schedule orders',
      'Group ordering',
      'Multiple payment methods'
    ],
    bestFor: ['Quick meals', 'Late night delivery', 'Variety of restaurants'],
    apiAvailable: true,
    specialFeatures: ['Uber for Business integration', 'Rewards program'],
    url: 'https://www.ubereats.com'
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    category: 'food',
    rating: 4.7,
    coverage: '7,000+ cities',
    regions: ['United States', 'Canada', 'Australia', 'Japan'],
    services: ['Food delivery', 'Groceries', 'Convenience items'],
    premium: {
      name: 'DashPass',
      price: '$9.99/month'
    },
    features: [
      'Priority support',
      'Reduced fees',
      'Exclusive offers',
      'Group ordering',
      'Scheduled delivery'
    ],
    bestFor: ['Family orders', 'Grocery delivery', 'Local restaurants'],
    apiAvailable: true,
    specialFeatures: ['DoorDash Drive API', 'White-label solutions'],
    url: 'https://www.doordash.com'
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    category: 'food',
    rating: 4.5,
    coverage: '500+ towns worldwide',
    regions: ['Europe', 'Middle East', 'Asia', 'Australia'],
    services: ['Restaurant food', 'Groceries', 'Meal kits'],
    premium: {
      name: 'Deliveroo Plus',
      price: '£7.99/month'
    },
    features: [
      'Free delivery',
      'Priority support',
      'Exclusive restaurants',
      'Table reservations',
      'Subscription management'
    ],
    bestFor: ['Premium dining', 'European cities', 'Quick service'],
    apiAvailable: true,
    specialFeatures: ['Restaurant partnerships', 'Dark kitchens'],
    url: 'https://www.deliveroo.com'
  },
  {
    id: 'grabfood',
    name: 'GrabFood',
    category: 'food',
    rating: 4.6,
    coverage: '8 countries in Southeast Asia',
    regions: ['Southeast Asia', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines'],
    services: ['Food delivery', 'Groceries', 'Parcels', 'Mart items'],
    premium: {
      name: 'GrabUnlimited',
      price: 'Variable by country'
    },
    features: [
      'Multi-service app',
      'Cash payment option',
      'Real-time tracking',
      'Loyalty rewards',
      'Express delivery'
    ],
    bestFor: ['Southeast Asia travel', 'Local cuisine', 'Multi-service needs'],
    apiAvailable: true,
    specialFeatures: ['Superapp integration', 'GrabPay wallet'],
    url: 'https://www.grab.com/sg/food/'
  },
  {
    id: 'foodpanda',
    name: 'foodpanda',
    category: 'food',
    rating: 4.4,
    coverage: '40+ countries',
    regions: ['Asia', 'Europe', 'Middle East', 'Africa'],
    services: ['Food delivery', 'Groceries', 'Shops', 'pandamart'],
    premium: {
      name: 'pandapro',
      price: 'Variable by country'
    },
    features: [
      'Wide restaurant selection',
      'Free delivery',
      'Exclusive deals',
      'Pre-order scheduling',
      'Multiple cuisines'
    ],
    bestFor: ['Asian markets', 'Emerging markets', 'Budget-friendly'],
    apiAvailable: true,
    specialFeatures: ['Cloud kitchen network', 'pandamart convenience'],
    url: 'https://www.foodpanda.com'
  },

  // Parcel & Package Delivery
  {
    id: 'dhl-express',
    name: 'DHL Express',
    category: 'parcel',
    rating: 4.5,
    coverage: '220+ countries',
    regions: ['Global'],
    services: ['Document delivery', 'Parcel shipping', 'Express freight'],
    premium: {
      name: 'Same-day delivery',
      price: 'Quote-based'
    },
    features: [
      'Real-time tracking',
      'Customs clearance',
      'Door-to-door service',
      'Insurance options',
      'Pickup scheduling'
    ],
    bestFor: ['International shipping', 'Business documents', 'Express needs'],
    apiAvailable: true,
    specialFeatures: ['Customs expertise', 'Temperature-controlled shipping'],
    url: 'https://www.dhl.com'
  },
  {
    id: 'fedex',
    name: 'FedEx',
    category: 'parcel',
    rating: 4.4,
    coverage: '220+ countries',
    regions: ['Global'],
    services: ['Ground shipping', 'Express delivery', 'Freight', 'Specialty'],
    premium: {
      name: 'FedEx First Overnight',
      price: 'Quote-based'
    },
    features: [
      'Next-day delivery',
      'Package tracking',
      'Hold at location',
      'Signature services',
      'Special handling'
    ],
    bestFor: ['Overnight shipping', 'Reliable service', 'Business packages'],
    apiAvailable: true,
    specialFeatures: ['Supply chain solutions', 'Temperature-controlled'],
    url: 'https://www.fedex.com'
  },
  {
    id: 'ups',
    name: 'UPS',
    category: 'parcel',
    rating: 4.3,
    coverage: '220+ countries',
    regions: ['Global'],
    services: ['Ground', 'Air freight', 'Ocean freight', 'Logistics'],
    premium: {
      name: 'UPS Next Day Air',
      price: 'Quote-based'
    },
    features: [
      'Tracking & notifications',
      'Pickup services',
      'Delivery alerts',
      'Insurance coverage',
      'Return services'
    ],
    bestFor: ['Business shipping', 'Reliable tracking', 'Supply chain'],
    apiAvailable: true,
    specialFeatures: ['UPS My Choice', 'Carbon neutral shipping'],
    url: 'https://www.ups.com'
  },

  // Local & On-Demand Delivery
  {
    id: 'postmates',
    name: 'Postmates',
    category: 'local',
    rating: 4.5,
    coverage: '4,200+ US cities',
    regions: ['United States'],
    services: ['Food', 'Groceries', 'Alcohol', 'Retail'],
    premium: {
      name: 'Postmates Unlimited',
      price: '$9.99/month'
    },
    features: [
      '24/7 delivery',
      'Real-time tracking',
      'Contactless delivery',
      'No minimum order',
      'Wide merchant selection'
    ],
    bestFor: ['US cities', 'Late night needs', 'Variety'],
    apiAvailable: true,
    specialFeatures: ['Uber merger benefits', 'Party mode'],
    url: 'https://postmates.com'
  },
  {
    id: 'rappi',
    name: 'Rappi',
    category: 'local',
    rating: 4.5,
    coverage: '250+ cities in Latin America',
    regions: ['Latin America', 'Mexico', 'Colombia', 'Brazil', 'Argentina'],
    services: ['Food', 'Groceries', 'Pharmacy', 'Cash delivery'],
    premium: {
      name: 'RappiPrime',
      price: 'Variable by country'
    },
    features: [
      'Multi-service platform',
      'Cash handling',
      'Express delivery',
      'Pharmacy delivery',
      'Bill payments'
    ],
    bestFor: ['Latin America', 'Cash transactions', 'Multiple services'],
    apiAvailable: true,
    specialFeatures: ['Cash delivery', 'Bill payment services'],
    url: 'https://www.rappi.com'
  },

  // Premium & Specialized
  {
    id: 'gojek',
    name: 'Gojek',
    category: 'premium',
    rating: 4.6,
    coverage: '5 Southeast Asian countries',
    regions: ['Indonesia', 'Singapore', 'Thailand', 'Vietnam', 'Philippines'],
    services: ['Food', 'Groceries', 'Express courier', 'Transport'],
    premium: {
      name: 'GoClub',
      price: 'Variable by country'
    },
    features: [
      'Superapp integration',
      'Bike delivery',
      'Multi-service access',
      'Digital payments',
      'Loyalty program'
    ],
    bestFor: ['Southeast Asia', 'Quick local delivery', 'Integrated services'],
    apiAvailable: true,
    specialFeatures: ['Bike courier optimization', 'GoPay wallet'],
    url: 'https://www.gojek.com'
  }
];

interface DeliveryServicesProps {
  currentLocation?: { country: string; city: string } | null;
}

const DeliveryServices: React.FC<DeliveryServicesProps> = ({ currentLocation }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Get unique regions
  const allRegions = useMemo(() => {
    const regions = new Set<string>();
    deliveryServices.forEach(service => {
      service.regions.forEach(region => regions.add(region));
    });
    return ['all', ...Array.from(regions).sort()];
  }, []);

  // Filter services
  const filteredServices = useMemo(() => {
    return deliveryServices.filter(service => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        service.bestFor.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;

      // Region filter
      const matchesRegion = selectedRegion === 'all' || 
        service.regions.some(r => r.toLowerCase().includes(selectedRegion.toLowerCase())) ||
        (currentLocation && service.regions.some(r => 
          r.toLowerCase().includes(currentLocation.country.toLowerCase())
        ));

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [searchQuery, selectedCategory, selectedRegion, currentLocation]);

  // Group by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, DeliveryService[]> = {
      food: [],
      parcel: [],
      local: [],
      premium: []
    };

    filteredServices.forEach(service => {
      grouped[service.category].push(service);
    });

    return grouped;
  }, [filteredServices]);

  const handleServiceClick = (service: DeliveryService) => {
    toast({
      title: `Opening ${service.name}`,
      description: 'Redirecting to service website...'
    });
    window.open(service.url, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return ShoppingBag;
      case 'parcel': return Package;
      case 'local': return Zap;
      case 'premium': return Star;
      default: return Truck;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'food': return 'Food & Grocery';
      case 'parcel': return 'Parcel & Package';
      case 'local': return 'Local & On-Demand';
      case 'premium': return 'Premium & Specialized';
      default: return category;
    }
  };

  const ServiceCard: React.FC<{ service: DeliveryService }> = ({ service }) => {
    const CategoryIcon = getCategoryIcon(service.category);
    
    return (
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {service.coverage}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-sm">{service.rating}</span>
              </div>
              {service.apiAvailable && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  API
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Services
            </h4>
            <div className="flex flex-wrap gap-1">
              {service.services.map((s, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Premium Plan</p>
                <p className="font-semibold">{service.premium.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{service.premium.price}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Key Features
            </h4>
            <ul className="space-y-1">
              {service.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best For */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Best For</h4>
            <div className="flex flex-wrap gap-1">
              {service.bestFor.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              Available In
            </h4>
            <div className="flex flex-wrap gap-1">
              {service.regions.slice(0, 4).map((region, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
              {service.regions.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{service.regions.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Special Features */}
          {service.specialFeatures.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Special Features
              </h4>
              <div className="flex flex-wrap gap-1">
                {service.specialFeatures.map((feature, idx) => (
                  <Badge key={idx} className="text-xs gradient-success">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full gradient-trust shadow-medium hover:shadow-lg"
            onClick={() => handleServiceClick(service)}
          >
            Visit Service
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Premium Delivery Services</h1>
        <p className="text-muted-foreground">
          Access world-class delivery services rated 4★+ for food, parcels, and specialized needs worldwide
        </p>
      </div>

      {/* Location Info */}
      {currentLocation && (
        <Card className="gradient-success">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="font-semibold">Your Current Location</p>
                <p className="text-sm opacity-90">
                  {currentLocation.city}, {currentLocation.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services, cuisine types, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Service Type
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Services
              </Button>
              <Button
                variant={selectedCategory === 'food' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('food')}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Food & Grocery
              </Button>
              <Button
                variant={selectedCategory === 'parcel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('parcel')}
              >
                <Package className="h-4 w-4 mr-2" />
                Parcel & Package
              </Button>
              <Button
                variant={selectedCategory === 'local' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('local')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Local & On-Demand
              </Button>
              <Button
                variant={selectedCategory === 'premium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('premium')}
              >
                <Star className="h-4 w-4 mr-2" />
                Premium
              </Button>
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              Region
            </label>
            <div className="flex flex-wrap gap-2">
              {allRegions.slice(0, 8).map(region => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region === 'all' ? 'All Regions' : region}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredServices.length}</p>
                <p className="text-sm text-muted-foreground">Services Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Star className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.5+</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Globe2 className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">220+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services by Category */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="food">Food & Grocery</TabsTrigger>
          <TabsTrigger value="parcel">Parcel</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(servicesByCategory).map(([category, services]) => {
            if (services.length === 0) return null;
            
            return (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {React.createElement(getCategoryIcon(category), { className: 'h-6 w-6' })}
                  {getCategoryLabel(category)}
                  <Badge variant="secondary">{services.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {(['food', 'parcel', 'local', 'premium'] as const).map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesByCategory[category].map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find delivery services
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRegion('all');
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Premium Features Info */}
      <Card className="gradient-trust">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Premium Quality Guarantee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Minimum 4★ Rating</p>
              <p className="text-sm opacity-90">Only verified, high-quality services included</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Real-time Tracking</p>
              <p className="text-sm opacity-90">Monitor your deliveries from pickup to doorstep</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Global Coverage</p>
              <p className="text-sm opacity-90">Services available in 220+ countries worldwide</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">API Integration Ready</p>
              <p className="text-sm opacity-90">Most services offer developer APIs for seamless integration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryServices;
