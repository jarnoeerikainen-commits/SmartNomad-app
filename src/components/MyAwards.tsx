import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  Plane, 
  Hotel, 
  CreditCard, 
  Globe, 
  ExternalLink, 
  Plus,
  TrendingUp,
  Gift,
  Star,
  Wallet
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RewardProgram {
  name: string;
  description: string;
  url: string;
  logo?: string;
  category: 'hotel' | 'airline' | 'booking' | 'credit';
  tier?: string;
}

const MyAwards: React.FC = () => {
  const { t } = useLanguage();
  const [trackedPrograms, setTrackedPrograms] = useState<string[]>([]);

  // Hotel Loyalty Programs
  const hotelPrograms: RewardProgram[] = [
    {
      name: 'Marriott Bonvoy',
      description: '30+ brands, 8,000+ hotels worldwide',
      url: 'https://www.marriott.com/loyalty.mi',
      category: 'hotel',
      tier: 'Elite Status Available'
    },
    {
      name: 'Hilton Honors',
      description: 'Earn points at 7,000+ properties',
      url: 'https://www.hilton.com/en/hilton-honors/',
      category: 'hotel',
      tier: 'Diamond Status Available'
    },
    {
      name: 'World of Hyatt',
      description: 'Premium rewards, suite upgrades',
      url: 'https://world.hyatt.com/',
      category: 'hotel',
      tier: 'Globalist Status Available'
    },
    {
      name: 'IHG One Rewards',
      description: '6,000+ hotels, no blackout dates',
      url: 'https://www.ihg.com/onerewards/',
      category: 'hotel'
    },
    {
      name: 'Accor Live Limitless',
      description: 'ALL loyalty program, 5,200+ hotels',
      url: 'https://all.accor.com/',
      category: 'hotel'
    },
    {
      name: 'Choice Privileges',
      description: '7,000+ hotels, easy redemptions',
      url: 'https://www.choicehotels.com/choice-privileges',
      category: 'hotel'
    },
    {
      name: 'Wyndham Rewards',
      description: 'No blackout dates, flat-rate awards',
      url: 'https://www.wyndhamhotels.com/wyndham-rewards',
      category: 'hotel'
    },
    {
      name: 'Best Western Rewards',
      description: '4,700+ hotels, instant benefits',
      url: 'https://www.bestwestern.com/en_US/about/best-western-rewards.html',
      category: 'hotel'
    }
  ];

  // Airline Loyalty Programs
  const airlinePrograms: RewardProgram[] = [
    {
      name: 'American AAdvantage',
      description: 'Earn miles on American & partners',
      url: 'https://www.aa.com/aadvantage',
      category: 'airline',
      tier: 'Executive Platinum Available'
    },
    {
      name: 'United MileagePlus',
      description: 'Star Alliance, no expiration',
      url: 'https://www.united.com/mileageplus',
      category: 'airline',
      tier: 'Premier 1K Available'
    },
    {
      name: 'Delta SkyMiles',
      description: 'SkyTeam alliance, no blackouts',
      url: 'https://www.delta.com/skymiles',
      category: 'airline',
      tier: 'Diamond Medallion Available'
    },
    {
      name: 'Southwest Rapid Rewards',
      description: 'No blackout dates, points don\'t expire',
      url: 'https://www.southwest.com/rapidrewards/',
      category: 'airline',
      tier: 'A-List Preferred Available'
    },
    {
      name: 'Alaska Mileage Plan',
      description: 'Best partner award chart',
      url: 'https://www.alaskaair.com/mileageplan',
      category: 'airline',
      tier: 'MVP Gold 100K Available'
    },
    {
      name: 'JetBlue TrueBlue',
      description: 'Points never expire, family pooling',
      url: 'https://www.jetblue.com/trueblue',
      category: 'airline',
      tier: 'Mosaic Available'
    },
    {
      name: 'British Airways Executive Club',
      description: 'Oneworld alliance, Avios currency',
      url: 'https://www.britishairways.com/executive-club',
      category: 'airline',
      tier: 'Gold Guest List Available'
    },
    {
      name: 'Air France-KLM Flying Blue',
      description: 'SkyTeam, monthly promo awards',
      url: 'https://www.flyingblue.com/',
      category: 'airline',
      tier: 'Platinum Available'
    },
    {
      name: 'Lufthansa Miles & More',
      description: 'Star Alliance, extensive network',
      url: 'https://www.miles-and-more.com/',
      category: 'airline',
      tier: 'Senator Status Available'
    },
    {
      name: 'Emirates Skywards',
      description: 'Luxury rewards, tier miles',
      url: 'https://www.emirates.com/skywards',
      category: 'airline',
      tier: 'Platinum Available'
    }
  ];

  // Booking Platform Programs
  const bookingPrograms: RewardProgram[] = [
    {
      name: 'Booking.com Genius',
      description: 'Up to 20% off, free breakfast',
      url: 'https://www.booking.com/genius.html',
      category: 'booking'
    },
    {
      name: 'Hotels.com Rewards',
      description: 'Collect 10 nights, get 1 free',
      url: 'https://www.hotels.com/rewards/',
      category: 'booking'
    },
    {
      name: 'Expedia Rewards',
      description: 'Points on hotels, flights, activities',
      url: 'https://www.expedia.com/rewards',
      category: 'booking'
    },
    {
      name: 'Agoda VIP',
      description: 'Exclusive discounts, priority support',
      url: 'https://www.agoda.com/vip',
      category: 'booking'
    },
    {
      name: 'Priceline VIP',
      description: 'Extra savings, express deals',
      url: 'https://www.priceline.com/vip/',
      category: 'booking'
    },
    {
      name: 'Airbnb Rewards',
      description: 'Travel credits and experiences',
      url: 'https://www.airbnb.com/',
      category: 'booking'
    }
  ];

  // Credit Card Rewards Programs
  const creditCardPrograms: RewardProgram[] = [
    {
      name: 'Chase Ultimate Rewards',
      description: 'Transfer to 14+ partners, 1.5x travel portal',
      url: 'https://www.chase.com/personal/credit-cards/rewards-credit-cards',
      category: 'credit',
      tier: 'Sapphire Reserve Premium'
    },
    {
      name: 'American Express Membership Rewards',
      description: '20+ transfer partners, flexible redemption',
      url: 'https://www.americanexpress.com/rewards',
      category: 'credit',
      tier: 'Platinum Card Benefits'
    },
    {
      name: 'Citi ThankYou Points',
      description: '15+ transfer partners, easy to earn',
      url: 'https://www.citi.com/credit-cards/thankyou',
      category: 'credit',
      tier: 'Prestige Card Available'
    },
    {
      name: 'Capital One Miles',
      description: 'No blackouts, transfer to 15+ airlines',
      url: 'https://www.capitalone.com/credit-cards/rewards/',
      category: 'credit',
      tier: 'Venture X Premium'
    },
    {
      name: 'Bilt Rewards',
      description: 'Earn points on rent, transfer to airlines',
      url: 'https://www.biltrewards.com/',
      category: 'credit'
    },
    {
      name: 'Bank of America Travel Rewards',
      description: 'No foreign transaction fees, easy redemption',
      url: 'https://www.bankofamerica.com/credit-cards/travel-rewards/',
      category: 'credit'
    }
  ];

  const toggleTracking = (programName: string) => {
    if (trackedPrograms.includes(programName)) {
      setTrackedPrograms(trackedPrograms.filter(p => p !== programName));
    } else {
      setTrackedPrograms([...trackedPrograms, programName]);
    }
  };

  const renderProgramCard = (program: RewardProgram) => {
    const isTracked = trackedPrograms.includes(program.name);
    const categoryIcons = {
      hotel: Hotel,
      airline: Plane,
      booking: Globe,
      credit: CreditCard
    };
    const Icon = categoryIcons[program.category];

    return (
      <Card key={program.name} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{program.name}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {program.description}
                </CardDescription>
                {program.tier && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {program.tier}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(program.url, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Visit
            </Button>
            <Button
              variant={isTracked ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTracking(program.name)}
              className="flex-1"
            >
              {isTracked ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Tracking
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  Track
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Travel Awards</h1>
        </div>
        <p className="text-muted-foreground">
          Track and manage all your travel rewards programs in one place
        </p>
        <Badge variant="outline" className="mt-2">
          <Gift className="w-3 h-3 mr-1" />
          {trackedPrograms.length} programs tracked
        </Badge>
      </div>

      {/* AwardWallet Integration */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AwardWallet Integration</CardTitle>
                <CardDescription>
                  Sync all your rewards programs automatically
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-background/50 rounded-lg p-4 border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Why AwardWallet?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Track 700+ loyalty programs in one place</li>
                <li>• Automatic balance updates</li>
                <li>• Expiration alerts for miles and points</li>
                <li>• Historical tracking and analytics</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex-1"
                onClick={() => window.open('https://awardwallet.com/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit AwardWallet
              </Button>
              <Button variant="outline" className="flex-1" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Connect Account (Coming Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Hotel Programs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Hotel Loyalty Programs</h2>
          <Badge variant="secondary">{hotelPrograms.length} programs</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotelPrograms.map(renderProgramCard)}
        </div>
      </div>

      <Separator />

      {/* Airline Programs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Airline Loyalty Programs</h2>
          <Badge variant="secondary">{airlinePrograms.length} programs</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {airlinePrograms.map(renderProgramCard)}
        </div>
      </div>

      <Separator />

      {/* Booking Platforms */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Booking Platform Rewards</h2>
          <Badge variant="secondary">{bookingPrograms.length} programs</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookingPrograms.map(renderProgramCard)}
        </div>
      </div>

      <Separator />

      {/* Credit Card Programs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Credit Card Rewards</h2>
          <Badge variant="secondary">{creditCardPrograms.length} programs</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditCardPrograms.map(renderProgramCard)}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Award className="w-5 h-5" />
            Pro Tips for Maximizing Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Focus on 2-3 programs per category for status benefits</li>
            <li>• Use credit card rewards that transfer to multiple partners</li>
            <li>• Book directly with hotels/airlines for elite benefits</li>
            <li>• Set up alerts for point expiration dates</li>
            <li>• Combine hotel and airline status matches when available</li>
            <li>• Use AwardWallet to track all programs automatically</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAwards;
