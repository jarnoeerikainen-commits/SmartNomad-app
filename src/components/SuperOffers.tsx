import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Shield, 
  Wifi, 
  Users, 
  Sparkles, 
  ExternalLink, 
  Crown,
  TrendingUp,
  Globe,
  Star,
  Zap,
  Heart,
  Plane,
  Tag
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { TrustBadge, TrustRating, TrustScore } from '@/components/ui/trust-badge';

interface SuperOffersProps {
  currentLocation: LocationData | null;
  subscription: Subscription;
  onUpgradeClick?: () => void;
  onProfileFormClick?: () => void;
}

const SuperOffers: React.FC<SuperOffersProps> = ({ 
  currentLocation,
  subscription,
  onUpgradeClick,
  onProfileFormClick
}) => {
  const [activeTab, setActiveTab] = useState('premium');
  const hasEnhancedProfile = localStorage.getItem('enhancedProfile');
  const isFreeUser = subscription.tier === 'free';

  const premiumOffers = [
    {
      id: 'upgrade-premium',
      title: '👑 Upgrade to Premium',
      description: 'Unlock all features including 10,000 AI requests, tax reports, and more',
      value: '$4.99/month',
      features: ['10,000 AI Requests', 'Tax Residency Reports', 'Auto Location Tracking', 'Advanced Analytics'],
      action: 'View Plans',
      icon: Crown,
      gradient: 'from-accent via-primary to-accent',
      show: isFreeUser,
      onClick: onUpgradeClick
    }
  ];

  const travelOffers = [
    {
      id: 'insurance-1',
      title: 'SafetyWing Nomad Insurance',
      description: '🛡️ Medical coverage for digital nomads traveling the world',
      price: '$42/month',
      discount: 'First month free',
      rating: 4.8,
      reviews: 523,
      verified: true,
      icon: Shield,
      url: 'https://safetywing.com/nomad-insurance',
      features: ['180+ Countries', 'Cancel Anytime', 'Covers COVID-19'],
      badges: ['Top Rated', 'Nomad Favorite']
    },
    {
      id: 'insurance-2',
      title: 'World Nomads Travel Insurance',
      description: '🌍 Comprehensive travel insurance with adventure sports coverage',
      price: '$45/week',
      discount: '15% off for long trips',
      rating: 4.7,
      reviews: 412,
      verified: true,
      icon: Globe,
      url: 'https://www.worldnomads.com',
      features: ['Adventure Coverage', '24/7 Support', 'Medical Evacuation'],
      badges: ['Top Rated', 'Traveler Favorite']
    },
    {
      id: 'esim-1',
      title: 'Airalo eSIM Plans',
      description: '📱 Stay connected in 200+ countries with affordable eSIM data',
      price: 'From $3.50',
      discount: '$3 off first purchase',
      rating: 4.9,
      reviews: 1240,
      verified: true,
      icon: Wifi,
      url: 'https://www.airalo.com',
      features: ['No SIM Swap', 'Instant Setup', '200+ Countries'],
      badges: ['Top Rated', 'Nomad Favorite']
    },
    {
      id: 'esim-2',
      title: 'Holafly Unlimited Data',
      description: '⚡ Unlimited data eSIM for over 160 destinations',
      price: 'From $19/week',
      discount: '5% off with code NOMAD',
      rating: 4.6,
      reviews: 287,
      verified: true,
      icon: Zap,
      url: 'https://www.holafly.com',
      features: ['Unlimited Data', 'Multi-Country Plans', '24/7 Support'],
      badges: ['Verified Local']
    }
  ];

  const localOffers = currentLocation ? [
    {
      id: 'coworking',
      title: `Coworking Spaces in ${currentLocation.city}`,
      description: 'Find the best coworking spaces with great wifi and community',
      price: 'From $50/month',
      icon: Users,
      url: `https://www.coworker.com/search/${encodeURIComponent(currentLocation.city)}`,
      features: ['High-Speed WiFi', 'Meeting Rooms', 'Networking Events']
    },
    {
      id: 'meetups',
      title: `Digital Nomad Meetups`,
      description: `Connect with fellow nomads in ${currentLocation.city}`,
      price: 'Free',
      icon: Heart,
      url: `https://www.meetup.com/find/?keywords=digital+nomad&location=${encodeURIComponent(currentLocation.city)}`,
      features: ['Weekly Events', 'Skill Sharing', 'Social Activities']
    },
    {
      id: 'tours',
      title: `Local Experiences`,
      description: `Discover unique activities and tours in ${currentLocation.city}`,
      price: 'From $25',
      discount: '10% off first booking',
      icon: Plane,
      url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(currentLocation.city)}`,
      features: ['Authentic Experiences', 'Local Guides', 'Instant Confirmation']
    }
  ] : [];

  const specialDeals = [
    {
      id: 'revolut',
      title: 'Revolut Business Account',
      description: 'Free multi-currency business account for digital nomads',
      value: 'Free Forever',
      icon: TrendingUp,
      url: 'https://www.revolut.com/business',
      features: ['50+ Currencies', 'Virtual Cards', 'Expense Management']
    },
    {
      id: 'wise',
      title: 'Wise Borderless Account',
      description: 'Send, spend, and receive money internationally with low fees',
      value: 'No Monthly Fees',
      icon: Globe,
      url: 'https://wise.com',
      features: ['Real Exchange Rates', '50+ Currencies', 'Debit Card']
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
            <Tag className="w-8 h-8 text-primary" />
            Super Offers
          </h1>
          <p className="text-muted-foreground mt-2">
            Exclusive deals and offers curated for digital nomads
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Sparkles className="w-4 h-4 mr-1" />
          Updated Daily
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="premium">
            <Crown className="w-4 h-4 mr-2" />
            Premium Offers
          </TabsTrigger>
          <TabsTrigger value="travel">
            <Shield className="w-4 h-4 mr-2" />
            Travel Essentials
          </TabsTrigger>
          <TabsTrigger value="local">
            <Users className="w-4 h-4 mr-2" />
            Local Deals
          </TabsTrigger>
          <TabsTrigger value="special">
            <Star className="w-4 h-4 mr-2" />
            Special Deals
          </TabsTrigger>
        </TabsList>

        {/* Premium Offers Tab */}
        <TabsContent value="premium" className="space-y-4">
          {premiumOffers.filter(offer => offer.show).map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className="border-2 border-primary/40 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradient} opacity-5 animate-pulse`} />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                        {offer.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {offer.description}
                      </CardDescription>
                    </div>
                    <div className={`p-4 bg-gradient-to-br ${offer.gradient} rounded-full animate-bounce`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {offer.value}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {offer.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg" 
                    className={`w-full gradient-primary shadow-lg hover:shadow-xl transition-all`}
                    onClick={offer.onClick}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {offer.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Travel Essentials Tab */}
        <TabsContent value="travel" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelOffers.map((offer) => {
              const Icon = offer.icon;
              return (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow border-2 border-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          {offer.verified && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        {offer.badges && offer.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {offer.badges.map((badge, idx) => (
                              <TrustBadge key={idx} badge={badge as any} showIcon={false} />
                            ))}
                          </div>
                        )}
                        <CardDescription>{offer.description}</CardDescription>
                      </div>
                      {offer.rating && (
                        <TrustRating rating={offer.rating} reviews={offer.reviews} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{offer.price}</span>
                      {offer.discount && (
                        <Badge variant="destructive" className="animate-pulse">
                          {offer.discount}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(offer.url, '_blank')}
                    >
                      View Offer
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Local Deals Tab */}
        <TabsContent value="local" className="space-y-4">
          {currentLocation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                      </div>
                      <CardDescription>{offer.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">{offer.price}</span>
                        {offer.discount && (
                          <Badge variant="secondary">{offer.discount}</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {offer.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(offer.url, '_blank')}
                      >
                        Explore
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Location Detected</h3>
                <p className="text-muted-foreground">
                  Enable location tracking to see local offers and deals in your area
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Special Deals Tab */}
        <TabsContent value="special" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialDeals.map((deal) => {
              const Icon = deal.icon;
              return (
                <Card key={deal.id} className="hover:shadow-lg transition-shadow border-2 border-accent/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-accent" />
                          <CardTitle className="text-lg">{deal.title}</CardTitle>
                        </div>
                        <CardDescription>{deal.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="default" className="text-base px-3 py-1">
                      {deal.value}
                    </Badge>
                    <div className="space-y-1">
                      {deal.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Sparkles className="w-3 h-3 text-accent" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="default" 
                      className="w-full gradient-accent"
                      onClick={() => window.open(deal.url, '_blank')}
                    >
                      Get Started
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                SuperNomad Trust AI
              </p>
              <p className="text-xs text-muted-foreground">
                All offers are curated and verified for quality (≥4.0★). We prioritize trusted providers,
                authentic reviews, and local gems. Some partnerships help support SuperNomad at no extra cost to you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperOffers;
