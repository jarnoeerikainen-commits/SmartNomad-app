import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Plane, 
  Wifi, 
  Coffee, 
  Utensils, 
  Briefcase, 
  Sparkles,
  TrendingUp,
  CreditCard,
  DollarSign,
  MapPin,
  Star,
  Shield,
  CheckCircle2,
  ExternalLink,
  Calculator,
  Globe
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AirportLoungeAccessProps {
  currentLocation: LocationData | null;
}

interface LoungeNetwork {
  id: string;
  name: string;
  lounges: number;
  coverage: string;
  standardPrice: number;
  premiumPrice?: number;
  description: string;
  features: string[];
  type: 'network' | 'airline' | 'credit-card';
  rating: number;
}

interface PayPerVisitOption {
  name: string;
  price: string;
  description: string;
  icon: any;
  link: string;
}

const AirportLoungeAccess: React.FC<AirportLoungeAccessProps> = ({ currentLocation }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [flightsPerYear, setFlightsPerYear] = useState<number>(8);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Major lounge networks data
  const loungeNetworks: LoungeNetwork[] = [
    {
      id: 'priority-pass',
      name: 'Priority Pass',
      lounges: 1300,
      coverage: 'Global - Largest Network',
      standardPrice: 99,
      premiumPrice: 469,
      description: 'Access to 1,300+ lounges worldwide with flexible membership options',
      features: ['1,300+ lounges', '100+ airport restaurants', 'Global coverage', 'Spa services at select locations'],
      type: 'network',
      rating: 4.5
    },
    {
      id: 'amex-centurion',
      name: 'American Express Centurion',
      lounges: 40,
      coverage: 'Premium - Highest Quality',
      standardPrice: 695,
      description: 'Luxury lounges with premium dining, spas, and exclusive amenities',
      features: ['Premium dining', 'Spa services', 'Private workspaces', 'Complimentary guests'],
      type: 'credit-card',
      rating: 4.9
    },
    {
      id: 'delta-sky',
      name: 'Delta Sky Club',
      lounges: 50,
      coverage: 'US Focus + International',
      standardPrice: 650,
      description: 'Premium lounges for Delta passengers with excellent amenities',
      features: ['50+ locations', 'Premium food & drinks', 'Shower facilities', 'Business centers'],
      type: 'airline',
      rating: 4.4
    },
    {
      id: 'united-club',
      name: 'United Club',
      lounges: 45,
      coverage: 'Global Network',
      standardPrice: 525,
      description: 'Access to United and Star Alliance partner lounges worldwide',
      features: ['45+ lounges', 'International partners', 'Complimentary snacks', 'Premium beverages'],
      type: 'airline',
      rating: 4.3
    },
    {
      id: 'lounge-key',
      name: 'LoungeKey',
      lounges: 1100,
      coverage: 'Global Network',
      standardPrice: 32,
      description: 'Pay-per-use access to over 1,100 airport lounges worldwide',
      features: ['1,100+ lounges', 'No membership required', 'Instant booking', 'Mobile app access'],
      type: 'network',
      rating: 4.2
    }
  ];

  // Pay-per-visit options
  const payPerVisitOptions: PayPerVisitOption[] = [
    {
      name: 'LoungeBuddy',
      price: '$25-60',
      description: 'App-based booking with instant confirmation',
      icon: Plane,
      link: 'https://www.loungebuddy.com'
    },
    {
      name: 'DragonPass',
      price: '$32/visit',
      description: 'Access to 1,000+ lounges with no membership',
      icon: Globe,
      link: 'https://www.dragonpass.com'
    },
    {
      name: 'LoungeKey',
      price: '$32/visit',
      description: 'Visa/Mastercard lounge access program',
      icon: CreditCard,
      link: 'https://www.loungekey.com'
    }
  ];

  // Premium credit cards with lounge access
  const premiumCards = [
    {
      name: 'Amex Platinum',
      fee: 695,
      access: 'Centurion + Priority Pass + Delta',
      value: '1,400+ lounges',
      link: 'https://www.americanexpress.com/us/credit-cards/card/platinum/'
    },
    {
      name: 'Chase Sapphire Reserve',
      fee: 550,
      access: 'Priority Pass + LoungeKey',
      value: '1,300+ lounges',
      link: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'
    },
    {
      name: 'Capital One Venture X',
      fee: 395,
      access: 'Priority Pass + Capital One Lounges',
      value: '1,300+ lounges',
      link: 'https://www.capitalone.com/credit-cards/venture-x/'
    }
  ];

  // Calculate ROI and recommendations
  const calculateRecommendation = useMemo(() => {
    const avgPayPerVisit = 45;
    const estimatedVisits = flightsPerYear * 1.5; // Account for connections
    const totalPayPerViseCost = estimatedVisits * avgPayPerVisit;

    let recommendation = {
      type: '',
      name: '',
      cost: 0,
      value: 0,
      savings: 0,
      roi: 0,
      reason: ''
    };

    if (estimatedVisits >= 10) {
      recommendation = {
        type: 'Premium Card',
        name: 'Amex Platinum Card',
        cost: 695,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - 695,
        roi: ((estimatedVisits * avgPayPerVisit) - 695) / 695 * 100,
        reason: `With ${Math.round(estimatedVisits)} lounge visits per year, a premium card offers the best value`
      };
    } else if (estimatedVisits >= 6) {
      recommendation = {
        type: 'Annual Membership',
        name: 'Priority Pass Prestige',
        cost: 469,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - 469,
        roi: ((estimatedVisits * avgPayPerVisit) - 469) / 469 * 100,
        reason: `Perfect for ${Math.round(estimatedVisits)} visits - unlimited access with great coverage`
      };
    } else if (estimatedVisits >= 3) {
      recommendation = {
        type: 'Hybrid',
        name: 'Priority Pass Standard',
        cost: 99 + (estimatedVisits * 32),
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - (99 + (estimatedVisits * 32)),
        roi: ((estimatedVisits * avgPayPerVisit) - (99 + (estimatedVisits * 32))) / (99 + (estimatedVisits * 32)) * 100,
        reason: `Lower annual fee with per-visit charges for ${Math.round(estimatedVisits)} visits`
      };
    } else {
      recommendation = {
        type: 'Pay-Per-Use',
        name: 'LoungeBuddy / DragonPass',
        cost: estimatedVisits * 35,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - (estimatedVisits * 35),
        roi: ((estimatedVisits * avgPayPerVisit) - (estimatedVisits * 35)) / (estimatedVisits * 35) * 100,
        reason: `Most cost-effective for ${Math.round(estimatedVisits)} occasional visits`
      };
    }

    return recommendation;
  }, [flightsPerYear]);

  const handleFindNearbyLounges = () => {
    const searchQuery = currentLocation 
      ? `airport lounges near ${currentLocation.city}, ${currentLocation.country}`
      : 'airport lounges near me';
    
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, '_blank');
    
    toast({
      title: "Finding Nearby Lounges",
      description: `Searching for airport lounges in your area...`,
    });
  };

  const handlePurchase = (network: string, type: string) => {
    toast({
      title: "Opening Purchase Page",
      description: `Redirecting to ${network} ${type}...`,
    });
    // In production, these would be affiliate links
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-purple-900">
                  ✨ Airport Lounge Access
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Transform layovers into productive, comfortable experiences
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleFindNearbyLounges}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Nearby Lounges
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Wifi className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Free WiFi</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Utensils className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Premium Food</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Briefcase className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Workspaces</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">VIP Service</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendation Calculator */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calculator className="w-5 h-5" />
            Your Personalized Recommendation
          </CardTitle>
          <CardDescription>
            Based on your travel patterns, we'll find the best option for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              How many flights do you take per year?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={flightsPerYear}
                onChange={(e) => setFlightsPerYear(parseInt(e.target.value))}
                className="flex-1"
              />
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {flightsPerYear} flights
              </Badge>
            </div>
          </div>

          <Alert className="bg-white border-green-300">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900 font-bold">
              💡 Best Option: {calculateRecommendation.name}
            </AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p className="text-gray-700">{calculateRecommendation.reason}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Annual Cost</p>
                  <p className="text-lg font-bold text-green-700">${calculateRecommendation.cost}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Estimated Value</p>
                  <p className="text-lg font-bold text-green-700">${Math.round(calculateRecommendation.value)}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Annual Savings</p>
                  <p className="text-lg font-bold text-green-700">${Math.round(calculateRecommendation.savings)}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">ROI</p>
                  <p className="text-lg font-bold text-green-700">{Math.round(calculateRecommendation.roi)}%</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Main Options Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Networks & Memberships</TabsTrigger>
          <TabsTrigger value="single">Single Visit Passes</TabsTrigger>
          <TabsTrigger value="cards">Credit Cards</TabsTrigger>
        </TabsList>

        {/* Networks & Annual Memberships */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loungeNetworks.map((network) => (
              <Card key={network.id} className={`${
                network.rating >= 4.5 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-border'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {network.name}
                        {network.rating >= 4.5 && (
                          <Badge className="bg-yellow-400 text-yellow-900">
                            <Star className="w-3 h-3 mr-1" />
                            Top Rated
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {network.lounges}+ lounges • {network.coverage}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(network.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{network.description}</p>
                  
                  <div className="space-y-2">
                    {network.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Standard Membership</p>
                        <p className="text-2xl font-bold text-purple-600">${network.standardPrice}/year</p>
                      </div>
                      <Button 
                        onClick={() => handlePurchase(network.name, 'Standard')}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Purchase
                      </Button>
                    </div>
                    
                    {network.premiumPrice && (
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                        <div>
                          <p className="text-xs text-gray-600">Premium (Unlimited)</p>
                          <p className="text-xl font-bold text-purple-600">${network.premiumPrice}/year</p>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(network.name, 'Premium')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Get Premium
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pay-Per-Visit Options */}
        <TabsContent value="single" className="space-y-4">
          <Alert className="bg-blue-50 border-blue-300">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Single Visit Passes</AlertTitle>
            <AlertDescription className="text-blue-700">
              Perfect for occasional travelers - no membership required, instant booking
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {payPerVisitOptions.map((option, idx) => {
              const Icon = option.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{option.price}</p>
                      <p className="text-sm text-gray-600 mt-1">per visit</p>
                    </div>
                    <Button 
                      onClick={() => window.open(option.link, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Airport Lounge Direct Purchase Info */}
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Direct Lounge Purchase</CardTitle>
              <CardDescription>Walk up or pre-book directly at airport lounges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">Walk-Up Purchase</p>
                  <p className="text-2xl font-bold text-orange-600">$50-75</p>
                  <p className="text-sm text-gray-600 mt-1">Subject to availability</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">Pre-Book Online</p>
                  <p className="text-2xl font-bold text-orange-600">$35-60</p>
                  <p className="text-sm text-gray-600 mt-1">Save 20-30% booking ahead</p>
                </div>
              </div>
              <Alert className="bg-white border-orange-300">
                <Shield className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  💡 Pro Tip: Pre-booking guarantees access during peak travel times and saves money!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium Credit Cards */}
        <TabsContent value="cards" className="space-y-4">
          <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 border-yellow-300">
            <CreditCard className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900 font-bold">Premium Credit Cards</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Best value for frequent travelers - includes lounge access PLUS travel rewards, insurance, and more
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumCards.map((card, idx) => (
              <Card key={idx} className="border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge className="w-fit bg-amber-100 text-amber-800 mb-2">
                    <Star className="w-3 h-3 mr-1" />
                    Premium Card
                  </Badge>
                  <CardTitle className="text-lg">{card.name}</CardTitle>
                  <CardDescription>{card.access}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600">Annual Fee</p>
                    <p className="text-3xl font-bold text-amber-700">${card.fee}</p>
                    <p className="text-xs text-gray-500 mt-2">Lounge Access Value: ${card.fee * 2}+</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{card.value} lounge access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Travel rewards & benefits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Travel insurance included</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Guest access privileges</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.open(card.link, '_blank')}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ROI Comparison */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-900">💰 Value Comparison</CardTitle>
              <CardDescription>Why premium cards offer the best overall value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">Lounge Access Only</p>
                  <p className="text-xs text-gray-600 mb-3">Priority Pass Prestige</p>
                  <p className="text-2xl font-bold text-green-600">$469/year</p>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ Unlimited lounge visits</li>
                    <li>✓ 1,300+ lounges</li>
                  </ul>
                </div>
                <div className="bg-white/60 rounded-lg p-4 border-2 border-amber-400">
                  <p className="font-semibold text-amber-900 mb-2">Premium Card</p>
                  <p className="text-xs text-gray-600 mb-3">Amex Platinum</p>
                  <p className="text-2xl font-bold text-amber-600">$695/year</p>
                  <Badge className="bg-amber-100 text-amber-800 text-xs mt-2">Best Value</Badge>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ 1,400+ lounges (3 networks)</li>
                    <li>✓ Travel rewards points</li>
                    <li>✓ $200 travel credit</li>
                    <li>✓ Travel insurance</li>
                    <li>✓ Hotel status benefits</li>
                  </ul>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">Pay Per Visit</p>
                  <p className="text-xs text-gray-600 mb-3">10 visits/year</p>
                  <p className="text-2xl font-bold text-green-600">$450/year</p>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ No commitment</li>
                    <li>✓ Flexible usage</li>
                    <li>⚠️ No extra benefits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-purple-900">
              ✈️ Ready to Upgrade Your Travel Experience?
            </h3>
            <p className="text-purple-700 max-w-2xl mx-auto">
              Join thousands of smart travelers who save money and time with airport lounge access. 
              No more crowded gates, expensive airport food, or uncomfortable waiting areas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                size="lg"
                onClick={handleFindNearbyLounges}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Lounges Near You
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setSelectedTab('overview')}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Your Savings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirportLoungeAccess;
