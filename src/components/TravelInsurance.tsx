import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  ExternalLink, 
  Star,
  CheckCircle,
  DollarSign,
  Plane,
  Heart,
  Briefcase,
  GraduationCap,
  Users,
  Globe,
  AlertCircle,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

interface InsuranceProvider {
  name: string;
  category: 'basic' | 'premium' | 'student' | 'business' | 'family' | 'annual';
  description: string;
  coverage: string[];
  highlights: string[];
  pricing: {
    daily?: string;
    weekly?: string;
    monthly?: string;
    annual?: string;
  };
  rating: number;
  url: string;
  logo?: string;
  recommended?: boolean;
  maxTripDuration?: string;
  regions: string[];
}

const TravelInsurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [tripDuration, setTripDuration] = useState('');
  const [destination, setDestination] = useState('');

  const providers: InsuranceProvider[] = [
    {
      name: 'World Nomads',
      category: 'premium',
      description: 'Designed for adventurous travelers with comprehensive coverage for 150+ activities.',
      coverage: [
        'Emergency medical expenses up to $10M',
        'Trip cancellation & interruption',
        'Lost/stolen luggage & equipment',
        'Adventure sports & activities',
        'Emergency evacuation',
        '24/7 emergency assistance'
      ],
      highlights: [
        'Covers 150+ adventure activities',
        'Buy & extend while traveling',
        'Claims online from anywhere',
        'No age limit for coverage'
      ],
      pricing: {
        weekly: 'From $50/week',
        monthly: 'From $180/month',
        annual: 'From $600/year'
      },
      rating: 4.8,
      url: 'https://www.worldnomads.com',
      recommended: true,
      maxTripDuration: 'Up to 1 year',
      regions: ['Worldwide', 'Including USA']
    },
    {
      name: 'SafetyWing',
      category: 'annual',
      description: 'Subscription-based global health insurance for remote workers and digital nomads.',
      coverage: [
        'Overall medical coverage $250k',
        'Medical expenses outside home',
        'Emergency medical evacuation',
        'Travel delays',
        'Lost checked luggage',
        'Natural disaster coverage'
      ],
      highlights: [
        'Subscribe monthly, cancel anytime',
        'Auto-renewal for long-term travel',
        'Covers in 180+ countries',
        'Includes home country visits (limited)'
      ],
      pricing: {
        monthly: 'From $45.08/4 weeks',
        annual: 'From $588/year'
      },
      rating: 4.7,
      url: 'https://safetywing.com',
      recommended: true,
      maxTripDuration: 'Unlimited (subscription)',
      regions: ['Worldwide', 'Limited USA coverage']
    },
    {
      name: 'Allianz Travel Insurance',
      category: 'basic',
      description: 'Reliable global insurance with various plan options for different trip types.',
      coverage: [
        'Emergency medical up to $50k-$100k',
        'Trip cancellation up to trip cost',
        'Baggage loss/delay coverage',
        'Emergency transportation',
        '24/7 hotline assistance',
        'Pre-existing condition coverage available'
      ],
      highlights: [
        'Trusted global brand',
        'Multiple plan tiers',
        'Quick online purchase',
        'Mobile app for claims'
      ],
      pricing: {
        daily: 'From $9/day',
        weekly: 'From $40/week',
        annual: 'From $200/year'
      },
      rating: 4.5,
      url: 'https://www.allianztravelinsurance.com',
      maxTripDuration: 'Up to 180 days',
      regions: ['Worldwide']
    },
    {
      name: 'IMG Global',
      category: 'business',
      description: 'Specialized insurance for business travelers and expatriates with corporate solutions.',
      coverage: [
        'Medical coverage up to $8M',
        'Business equipment protection',
        'Political evacuation',
        'Kidnap & ransom coverage',
        'Trip interruption for business',
        'Emergency reunion expenses'
      ],
      highlights: [
        'Corporate group policies',
        'Executive protection options',
        'Worldwide medical network',
        'Dedicated account management'
      ],
      pricing: {
        monthly: 'From $150/month',
        annual: 'From $1,200/year'
      },
      rating: 4.6,
      url: 'https://www.imglobal.com',
      maxTripDuration: 'Up to 364 days',
      regions: ['Worldwide', 'Including USA']
    },
    {
      name: 'ISO Student Travel Insurance',
      category: 'student',
      description: 'Affordable coverage specifically designed for international students and study abroad.',
      coverage: [
        'Medical coverage up to $500k',
        'Mental health coverage',
        'Study interruption benefit',
        'Lost passport assistance',
        'Sports & activities coverage',
        'Emergency evacuation'
      ],
      highlights: [
        'Budget-friendly for students',
        'Covers entire study period',
        'Mental health included',
        'No deductible options'
      ],
      pricing: {
        monthly: 'From $35/month',
        annual: 'From $300/year'
      },
      rating: 4.4,
      url: 'https://www.isoa.org',
      maxTripDuration: 'Up to 4 years',
      regions: ['Worldwide']
    },
    {
      name: 'Travelex Insurance',
      category: 'family',
      description: 'Family-focused plans with coverage for kids and comprehensive trip protection.',
      coverage: [
        'Emergency medical up to $50k-$100k',
        'Family trip cancellation',
        'Kids covered at no extra cost',
        'Pre-existing conditions covered',
        'Rental car damage',
        'Missed connection coverage'
      ],
      highlights: [
        'Children under 17 free',
        'Family-friendly benefits',
        'Cancel for any reason option',
        'Trip delay coverage'
      ],
      pricing: {
        weekly: 'From $100/week (family)',
        monthly: 'From $350/month (family)',
        annual: 'From $800/year (family)'
      },
      rating: 4.5,
      url: 'https://www.travelexinsurance.com',
      maxTripDuration: 'Up to 180 days',
      regions: ['Worldwide']
    },
    {
      name: 'GeoBlue',
      category: 'premium',
      description: 'Premium international health insurance for frequent travelers and expats.',
      coverage: [
        'Medical coverage up to $2M-$8M',
        'Direct billing worldwide',
        'Evacuation & repatriation',
        'Mental health coverage',
        'Maternity coverage',
        'Prescription medication'
      ],
      highlights: [
        'Access to global provider network',
        'No claim forms for network providers',
        'Concierge medical services',
        'Telehealth included'
      ],
      pricing: {
        monthly: 'From $120/month',
        annual: 'From $1,200/year'
      },
      rating: 4.7,
      url: 'https://www.geobluetravelinsurance.com',
      maxTripDuration: 'Up to 364 days',
      regions: ['Worldwide', 'Including USA']
    },
    {
      name: 'Cigna Global',
      category: 'business',
      description: 'Comprehensive global health insurance for business travelers and international assignments.',
      coverage: [
        'Medical up to unlimited',
        'Outpatient & inpatient care',
        'Dental & vision care',
        'Emergency evacuation',
        'Wellness programs',
        'Cancer & chronic care'
      ],
      highlights: [
        'Premium healthcare network',
        'Corporate wellness programs',
        'Multi-country coverage',
        'Dedicated customer service'
      ],
      pricing: {
        monthly: 'From $200/month',
        annual: 'From $2,000/year'
      },
      rating: 4.6,
      url: 'https://www.cignaglobal.com',
      maxTripDuration: 'Unlimited',
      regions: ['Worldwide']
    },
    {
      name: 'Seven Corners',
      category: 'annual',
      description: 'Flexible multi-trip annual plans for frequent international travelers.',
      coverage: [
        'Medical coverage up to $1M',
        'Multiple trips per year',
        'Trip cancellation/interruption',
        'Emergency evacuation',
        'Baggage protection',
        'Adventure sports coverage'
      ],
      highlights: [
        'Unlimited trips per year',
        'Covers trips up to 90 days',
        'Competitive pricing',
        'Quick online quotes'
      ],
      pricing: {
        annual: 'From $400/year'
      },
      rating: 4.5,
      url: 'https://www.sevencorners.com',
      maxTripDuration: 'Multiple trips up to 90 days each',
      regions: ['Worldwide']
    },
    {
      name: 'HTH Worldwide',
      category: 'premium',
      description: 'Specialized in international medical insurance for travelers, students, and expats.',
      coverage: [
        'Medical coverage up to $2M',
        'Emergency evacuation & repatriation',
        'Trip interruption',
        'Terrorism coverage',
        'Adventure sports included',
        'COVID-19 coverage'
      ],
      highlights: [
        'A+ rated insurer',
        'Global assistance team',
        'No destination restrictions',
        'Flexible plan options'
      ],
      pricing: {
        monthly: 'From $100/month',
        annual: 'From $900/year'
      },
      rating: 4.6,
      url: 'https://www.hthtravelinsurance.com',
      maxTripDuration: 'Up to 364 days',
      regions: ['Worldwide']
    }
  ];

  const filteredProviders = providers.filter(provider => {
    if (activeTab === 'all') return true;
    return provider.category === activeTab;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating}</span>
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return <Shield className="h-4 w-4" />;
      case 'premium': return <TrendingUp className="h-4 w-4" />;
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'business': return <Briefcase className="h-4 w-4" />;
      case 'family': return <Users className="h-4 w-4" />;
      case 'annual': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'student': return 'bg-green-500';
      case 'business': return 'bg-orange-500';
      case 'family': return 'bg-pink-500';
      case 'annual': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-trust">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Travel Insurance</h1>
            <p className="text-muted-foreground">
              Comprehensive coverage from top providers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Providers</p>
                <p className="text-2xl font-bold">{providers.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold">
                  {providers.filter(p => p.recommended).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starting From</p>
                <p className="text-2xl font-bold">$35</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold">Worldwide</p>
              </div>
              <Globe className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Calculator */}
      <Card className="gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Quick Insurance Estimator
          </CardTitle>
          <CardDescription>
            Get personalized recommendations based on your trip details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Europe, Asia, USA"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Trip Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 14"
                value={tripDuration}
                onChange={(e) => setTripDuration(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full gradient-trust">
                Get Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Providers Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Providers</CardTitle>
          <CardDescription>
            Browse plans by category to find the perfect coverage for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                All
              </TabsTrigger>
              <TabsTrigger value="basic" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Premium
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Student
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Business
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Family
              </TabsTrigger>
              <TabsTrigger value="annual" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Annual
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredProviders.map((provider) => (
                <Card 
                  key={provider.name}
                  className={`transition-all hover:shadow-large ${
                    provider.recommended ? 'border-primary border-2' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-xl">{provider.name}</CardTitle>
                          {provider.recommended && (
                            <Badge className={getCategoryColor('premium')}>
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {getCategoryIcon(provider.category)}
                            <span className="ml-1">{provider.category}</span>
                          </Badge>
                        </div>
                        {renderStars(provider.rating)}
                      </div>
                      <Button asChild>
                        <a href={provider.url} target="_blank" rel="noopener noreferrer">
                          Get Quote
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <CardDescription className="text-base">
                      {provider.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-semibold">Duration:</span> {provider.maxTripDuration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-semibold">Regions:</span> {provider.regions.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Coverage */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-destructive" />
                        Coverage Includes
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {provider.coverage.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-warning" />
                        Key Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {provider.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-success" />
                        Pricing Options
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {provider.pricing.daily && (
                          <div className="bg-success/10 px-4 py-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Daily</p>
                            <p className="text-sm font-bold text-success">{provider.pricing.daily}</p>
                          </div>
                        )}
                        {provider.pricing.weekly && (
                          <div className="bg-info/10 px-4 py-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Weekly</p>
                            <p className="text-sm font-bold text-info">{provider.pricing.weekly}</p>
                          </div>
                        )}
                        {provider.pricing.monthly && (
                          <div className="bg-warning/10 px-4 py-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Monthly</p>
                            <p className="text-sm font-bold text-warning">{provider.pricing.monthly}</p>
                          </div>
                        )}
                        {provider.pricing.annual && (
                          <div className="bg-primary/10 px-4 py-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Annual</p>
                            <p className="text-sm font-bold text-primary">{provider.pricing.annual}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Insurance Tips */}
      <Card className="gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Travel Insurance Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />
                Buy Before You Travel
              </h4>
              <p className="text-sm text-muted-foreground">
                Purchase insurance as soon as you book your trip for maximum coverage including trip cancellation. Some benefits are time-sensitive.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                Check Medical Coverage
              </h4>
              <p className="text-sm text-muted-foreground">
                Ensure your policy includes adequate emergency medical coverage and evacuation, especially for adventure activities or remote destinations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                Read the Fine Print
              </h4>
              <p className="text-sm text-muted-foreground">
                Understand exclusions, deductibles, and coverage limits. Check if pre-existing conditions are covered and what documentation is required.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-info" />
                Consider Annual Plans
              </h4>
              <p className="text-sm text-muted-foreground">
                If you travel frequently (3+ trips/year), an annual multi-trip policy is often more cost-effective than buying individual trip insurance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelInsurance;