import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Search, Coins, Landmark, Users, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LocationData } from '@/types/country';

interface CryptoToCashProps {
  currentLocation?: LocationData | null;
}

const CryptoToCash: React.FC<CryptoToCashProps> = ({ currentLocation }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');

  useEffect(() => {
    if (currentLocation) {
      const location = currentLocation.city 
        ? `${currentLocation.city}, ${currentLocation.country}`
        : currentLocation.country;
      setDisplayLocation(location);
      setSearchLocation(location);
    }
  }, [currentLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayLocation(searchLocation);
  };

  const services = [
    {
      name: 'Bitcoin ATM Finder',
      description: 'Find over 38,000+ Bitcoin ATMs worldwide for instant crypto-to-cash conversion',
      type: 'ATM Network',
      features: [
        'Buy & sell Bitcoin instantly',
        'Support for multiple cryptocurrencies',
        'Cash withdrawal available',
        'Real-time ATM availability'
      ],
      cryptos: ['BTC', 'ETH', 'LTC', 'BCH'],
      website: 'https://coinatmradar.com',
      locationFinder: `https://coinatmradar.com${displayLocation ? `/city/${encodeURIComponent(displayLocation.toLowerCase().replace(/\s+/g, '-'))}` : ''}`,
      icon: Landmark,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'LocalCoinSwap',
      description: 'Peer-to-peer marketplace to buy and sell crypto with cash locally',
      type: 'P2P Exchange',
      features: [
        'Trade with local sellers',
        'Cash in-person meetings',
        'Escrow protection',
        'Multiple payment methods'
      ],
      cryptos: ['BTC', 'ETH', 'LTC', 'DASH', 'XMR'],
      website: 'https://localcoinswap.com',
      locationFinder: `https://localcoinswap.com/buy-sell${displayLocation ? `?location=${encodeURIComponent(displayLocation)}` : ''}`,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Binance P2P',
      description: 'World\'s largest P2P platform for buying crypto with local currency',
      type: 'P2P Exchange',
      features: [
        'Zero trading fees',
        'Meet local traders',
        'Bank transfer & cash options',
        '350+ payment methods'
      ],
      cryptos: ['BTC', 'ETH', 'USDT', 'BNB', 'BUSD'],
      website: 'https://p2p.binance.com',
      locationFinder: 'https://p2p.binance.com/en/trade/all-payments/USDT',
      icon: Coins,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Crypto.com',
      description: 'Get a crypto debit card and spend your crypto anywhere that accepts Visa',
      type: 'Debit Card',
      features: [
        'Crypto debit card',
        'ATM withdrawals worldwide',
        'Cashback rewards',
        'No annual fees'
      ],
      cryptos: ['BTC', 'ETH', 'CRO', 'USDT', '250+ coins'],
      website: 'https://crypto.com',
      locationFinder: 'https://crypto.com/cards',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crypto to Cash</h1>
        <p className="text-muted-foreground">
          Convert your cryptocurrency to local cash with ease - find ATMs, P2P traders, and cash-out options
        </p>
      </div>

      {/* Safety Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Safety First:</strong> When meeting for P2P transactions, always choose public places, 
          verify the buyer/seller reputation, and never share your private keys or seed phrases.
        </AlertDescription>
      </Alert>

      {/* Location Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Find Crypto Services Near You
          </CardTitle>
          <CardDescription>
            {currentLocation 
              ? `Currently showing services near: ${displayLocation}`
              : 'Enter your location to find nearby crypto-to-cash services'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter city or country..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {service.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Supported Cryptocurrencies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.cryptos.map((crypto) => (
                      <Badge key={crypto} variant="outline" className="text-xs">
                        {crypto}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={() => window.open(service.locationFinder, '_blank')}
                  >
                    <MapPin className="h-4 w-4" />
                    {service.type === 'Debit Card' ? 'Get Card' : 'Find Locations'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(service.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Safe Crypto-to-Cash Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <div>
                <strong>Bitcoin ATMs:</strong> Check fees before transactions (typically 7-12%). 
                Bring a valid ID as many ATMs require verification for larger amounts.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <div>
                <strong>P2P Trading:</strong> Only trade with verified users who have good ratings. 
                Use escrow services and meet in public places with security cameras.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <div>
                <strong>Transaction Limits:</strong> Many services have daily limits. Plan larger 
                transactions across multiple days if needed.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <div>
                <strong>Tax Compliance:</strong> Keep records of all crypto transactions for tax 
                purposes. Consult local regulations regarding crypto taxation.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">5.</span>
              <div>
                <strong>Network Fees:</strong> Consider blockchain network fees when converting. 
                Transfer during low-traffic periods for lower fees.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoToCash;
