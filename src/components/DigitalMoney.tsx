import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, MapPin, Search, Coins, Landmark, Users, CreditCard, AlertCircle, Shield, Wallet, Lock, Smartphone, TrendingUp, Zap, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LocationData } from '@/types/country';

interface DigitalMoneyProps {
  currentLocation?: LocationData | null;
}

const DigitalMoney: React.FC<DigitalMoneyProps> = ({ currentLocation }) => {
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

  const cryptoToCashServices = [
    {
      name: 'Bitcoin ATMs',
      description: 'Physical ATMs where you can buy/sell Bitcoin for cash instantly',
      type: 'ATM Network',
      features: ['Instant cash', 'Anonymous', 'Global network', 'Multiple cryptocurrencies'],
      cryptos: ['Bitcoin', 'Ethereum', 'Litecoin'],
      website: 'https://coinatmradar.com',
      locationFinder: 'https://coinatmradar.com',
      icon: Landmark,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'LocalBitcoins',
      description: 'P2P marketplace to buy and sell Bitcoin with local payment methods',
      type: 'P2P Exchange',
      features: ['Local meetups', 'Multiple payment methods', 'Escrow protection', 'Reputation system'],
      cryptos: ['Bitcoin'],
      website: 'https://localbitcoins.com',
      locationFinder: 'https://localbitcoins.com/buy-bitcoins-online/',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Paxful',
      description: 'Global P2P marketplace with 300+ payment options including cash',
      type: 'P2P Exchange',
      features: ['300+ payment methods', 'Gift cards accepted', 'Escrow service', '24/7 support'],
      cryptos: ['Bitcoin', 'Ethereum', 'USDT'],
      website: 'https://paxful.com',
      locationFinder: 'https://paxful.com/buy-bitcoin',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Crypto.com',
      description: 'Crypto debit cards that let you spend crypto anywhere',
      type: 'Crypto Card',
      features: ['Instant conversion', 'Cashback rewards', 'ATM withdrawals', 'Global acceptance'],
      cryptos: ['Bitcoin', 'Ethereum', 'All major coins'],
      website: 'https://crypto.com',
      locationFinder: 'https://crypto.com/cards',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const localOffices = [
    {
      name: 'Coinbase Office Locations',
      description: 'Official Coinbase offices and partner locations worldwide',
      regions: ['USA', 'UK', 'Europe', 'Asia'],
      services: ['Account verification', 'Support', 'Business services'],
      website: 'https://www.coinbase.com/locations',
      icon: Landmark,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Binance Support Centers',
      description: 'Binance regional offices and customer service centers',
      regions: ['Global', 'Asia', 'Europe', 'Americas'],
      services: ['Trading support', 'Verification', 'Enterprise solutions'],
      website: 'https://www.binance.com/en/support',
      icon: Landmark,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Kraken Offices',
      description: 'Kraken exchange offices for institutional and retail clients',
      regions: ['USA', 'UK', 'Europe'],
      services: ['Professional trading', 'Custody services', 'OTC desk'],
      website: 'https://www.kraken.com/contact',
      icon: Landmark,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const cryptoPlatforms = [
    {
      name: 'Binance',
      description: 'World\'s largest crypto exchange by trading volume',
      type: 'Centralized Exchange',
      features: ['600+ cryptocurrencies', 'Spot & futures trading', 'Staking & savings', 'NFT marketplace', 'Low fees (0.1%)', 'Binance Card'],
      highlights: ['Highest liquidity', 'Advanced trading tools', 'Mobile app', 'Multiple fiat options'],
      regions: ['Global (except USA)', 'Asia', 'Europe', 'Americas'],
      website: 'https://www.binance.com',
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      rating: '4.5/5'
    },
    {
      name: 'Crypto.com',
      description: 'All-in-one crypto platform with Visa card rewards',
      type: 'Centralized Exchange',
      features: ['350+ cryptocurrencies', 'Crypto Visa card', 'Up to 8% cashback', 'Earn & staking', 'DeFi wallet', 'NFT platform'],
      highlights: ['Best crypto card', 'CRO token rewards', 'User-friendly app', 'Sports sponsorships'],
      regions: ['Global', 'USA', 'Europe', 'Asia', 'Australia'],
      website: 'https://crypto.com',
      icon: CreditCard,
      color: 'from-blue-500 to-indigo-600',
      rating: '4.3/5'
    },
    {
      name: 'Bybit',
      description: 'Leading derivatives exchange for crypto traders',
      type: 'Centralized Exchange',
      features: ['400+ cryptocurrencies', 'Derivatives trading', 'Copy trading', 'Launchpad', 'Earn products', 'Low latency'],
      highlights: ['Best for derivatives', '100x leverage', 'Trading competitions', 'Institutional grade'],
      regions: ['Global', 'Asia', 'Europe', 'Middle East'],
      website: 'https://www.bybit.com',
      icon: Zap,
      color: 'from-orange-500 to-yellow-500',
      rating: '4.4/5'
    }
  ];

  const coldWalletProviders = [
    {
      name: 'Tangem',
      description: 'Smart card hardware wallet - tap to sign transactions',
      type: 'Card Wallet',
      features: ['NFC card design', 'No batteries', 'Waterproof', 'Backup cards', 'Mobile app'],
      price: '$49.90',
      cryptos: '6000+ coins',
      security: ['EAL6+ certified chip', 'Tamper-proof', 'No seed phrase needed'],
      website: 'https://tangem.com',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Trezor',
      description: 'The original hardware wallet - trusted since 2014',
      type: 'Hardware Wallet',
      features: ['Open source', 'Touchscreen', 'Shamir backup', 'Passphrase support'],
      price: 'From $59',
      cryptos: '1000+ coins',
      security: ['PIN protection', 'Recovery seed', 'Secure element', 'Desktop & mobile'],
      website: 'https://trezor.io',
      icon: Shield,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Ledger',
      description: 'Most popular hardware wallet with secure element chip',
      type: 'Hardware Wallet',
      features: ['Bluetooth support', 'Large screen', 'Ledger Live app', 'NFT support'],
      price: 'From $79',
      cryptos: '5500+ coins',
      security: ['CC EAL5+ certified', '2-factor auth', 'PIN protection', 'Recovery phrase'],
      website: 'https://www.ledger.com',
      icon: Wallet,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Coldcard',
      description: 'Bitcoin-only wallet with maximum security features',
      type: 'Hardware Wallet',
      features: ['Air-gapped', 'Duress PIN', 'Dice rolls', 'BIP39 compliant'],
      price: '$157.47',
      cryptos: 'Bitcoin only',
      security: ['Secure element', 'Open source', 'Anti-phishing words', 'Brick me PIN'],
      website: 'https://coldcard.com',
      icon: Lock,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'BitBox',
      description: 'Swiss-made hardware wallet with simplicity focus',
      type: 'Hardware Wallet',
      features: ['USB-C', 'Micro SD backup', 'Full node support', 'Open source'],
      price: '$149',
      cryptos: '1500+ coins',
      security: ['Secure chip', 'Swiss design', 'Password manager', 'Stealth addresses'],
      website: 'https://shiftcrypto.ch',
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'KeepKey',
      description: 'Large screen hardware wallet with ShapeShift integration',
      type: 'Hardware Wallet',
      features: ['6 inch display', 'One-click trading', 'Native ShapeShift', 'Hierarchical HD'],
      price: '$49',
      cryptos: '40+ coins',
      security: ['PIN protection', 'Recovery sentence', 'Offline storage', 'Open source'],
      website: 'https://shapeshift.com/keepkey',
      icon: Smartphone,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Money</h1>
        <p className="text-muted-foreground">
          Convert crypto to cash, find local offices, and secure your digital assets with cold wallets
        </p>
      </div>

      <Tabs defaultValue="crypto-to-cash" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="crypto-platforms">Crypto Platforms</TabsTrigger>
          <TabsTrigger value="crypto-to-cash">Crypto to Cash</TabsTrigger>
          <TabsTrigger value="local-offices">Local Offices</TabsTrigger>
          <TabsTrigger value="cold-wallets">Cold Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto-platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Cryptocurrency Exchanges</CardTitle>
              <CardDescription>
                Trade, invest, and manage your crypto on these leading platforms
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {cryptoPlatforms.map((platform) => (
              <Card key={platform.name} className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${platform.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg bg-gradient-to-br ${platform.color} p-3 text-white`}>
                        <platform.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{platform.name}</CardTitle>
                        <CardDescription className="mt-1 flex gap-2 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {platform.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{platform.rating}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{platform.description}</p>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Key Features</h4>
                    <ul className="space-y-1">
                      {platform.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Highlights</h4>
                    <div className="flex flex-wrap gap-1">
                      {platform.highlights.map((highlight) => (
                        <Badge key={highlight} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Available Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {platform.regions.map((region) => (
                        <Badge key={region} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <a href={platform.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit {platform.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Choosing a Crypto Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Security & Regulation</span>
                    <p className="text-sm text-muted-foreground">Check if the exchange is licensed in your region and has strong security measures</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Coins className="mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Fees & Costs</span>
                    <p className="text-sm text-muted-foreground">Compare trading fees, withdrawal fees, and spread costs</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="mt-1 h-4 w-4 text-purple-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Available Assets</span>
                    <p className="text-sm text-muted-foreground">Ensure the exchange supports the cryptocurrencies you want to trade</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Smartphone className="mt-1 h-4 w-4 text-orange-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">User Experience</span>
                    <p className="text-sm text-muted-foreground">Look for intuitive interfaces and good mobile app support</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto-to-cash" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              When using P2P services, always meet in public places, use escrow services, and verify trader reputation. Never share your private keys.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Services Near You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter city or country..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              {displayLocation && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Showing services near: <span className="font-medium">{displayLocation}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {cryptoToCashServices.map((service) => (
              <Card key={service.name} className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg bg-gradient-to-br ${service.color} p-2 text-white`}>
                        <service.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {service.type}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Supported Cryptocurrencies</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.cryptos.map((crypto) => (
                        <Badge key={crypto} variant="outline" className="text-xs">
                          {crypto}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Key Features</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <a href={service.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={service.locationFinder} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-4 w-4" />
                        Find Locations
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Safe Crypto-to-Cash Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Always use reputable platforms with escrow services for P2P transactions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Check ATM fees before transactions - they can range from 7-15%
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Verify trader reputation and reviews on P2P platforms
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    For large amounts, consider crypto debit cards for better rates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Never share your private keys or seed phrases with anyone
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local-offices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Crypto Exchange Offices</CardTitle>
              <CardDescription>
                Visit physical locations for account support, verification, and professional services
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localOffices.map((office) => (
              <Card key={office.name} className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${office.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-gradient-to-br ${office.color} p-2 text-white`}>
                      <office.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{office.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{office.description}</p>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {office.regions.map((region) => (
                        <Badge key={region} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Services Offered</h4>
                    <ul className="space-y-1">
                      {office.services.map((service) => (
                        <li key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="w-full">
                    <a href={office.website} target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Locations
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cold-wallets" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Cold wallets keep your crypto offline and secure. They're essential for long-term storage and large amounts.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            {coldWalletProviders.map((wallet) => (
              <Card key={wallet.name} className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${wallet.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg bg-gradient-to-br ${wallet.color} p-2 text-white`}>
                        <wallet.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{wallet.name}</CardTitle>
                        <CardDescription className="mt-1 flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {wallet.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {wallet.price}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>

                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium">Supported Assets</span>
                    <Badge variant="secondary">{wallet.cryptos}</Badge>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Key Features</h4>
                    <ul className="space-y-1">
                      {wallet.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Security Features
                    </h4>
                    <ul className="space-y-1">
                      {wallet.security.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="w-full">
                    <a href={wallet.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why Use a Cold Wallet?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Maximum Security</span>
                    <p className="text-sm text-muted-foreground">Your private keys never touch the internet</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="mt-1 h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Protection from Hacks</span>
                    <p className="text-sm text-muted-foreground">Immune to online attacks and exchange hacks</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Wallet className="mt-1 h-4 w-4 text-purple-500 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Full Control</span>
                    <p className="text-sm text-muted-foreground">You own your keys and control your crypto</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalMoney;
