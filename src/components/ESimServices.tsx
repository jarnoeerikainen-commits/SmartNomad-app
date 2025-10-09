import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, ExternalLink, Star, Globe, Zap, Shield } from 'lucide-react';

interface ESimProvider {
  name: string;
  description: string;
  features: string[];
  rating: number;
  countries: string;
  startingPrice: string;
  url: string;
  popular: boolean;
}

const ESIM_PROVIDERS: ESimProvider[] = [
  {
    name: 'Airalo',
    description: 'World\'s first eSIM store with coverage in 200+ countries',
    features: ['Instant activation', '24/7 support', 'No contracts'],
    rating: 4.8,
    countries: '200+ countries',
    startingPrice: '$4.50',
    url: 'https://www.airalo.com',
    popular: true,
  },
  {
    name: 'Holafly',
    description: 'Unlimited data eSIMs for travelers worldwide',
    features: ['Unlimited data', 'Keep your WhatsApp', 'Easy activation'],
    rating: 4.7,
    countries: '180+ countries',
    startingPrice: '$6.00',
    url: 'https://www.holafly.com',
    popular: true,
  },
  {
    name: 'Nomad',
    description: 'Flexible data plans for digital nomads and travelers',
    features: ['Flexible plans', 'Global coverage', 'Simple setup'],
    rating: 4.6,
    countries: '165+ countries',
    startingPrice: '$5.00',
    url: 'https://www.getnomad.app',
    popular: true,
  },
];

export const ESimServices: React.FC = () => {
  const handleVisitProvider = (url: string, providerName: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          eSIM Travel Solutions
        </CardTitle>
        <CardDescription>
          Stay connected worldwide with digital eSIM cards - no physical SIM needed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* What is eSIM Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">What is an eSIM?</h4>
                    <p className="text-sm text-muted-foreground">
                      An eSIM is a digital SIM that lets you activate a cellular plan without a physical card. 
                      Perfect for travelers - just scan a QR code and you're connected!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Providers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Top 3 eSIM Providers</h3>
            
            {ESIM_PROVIDERS.map((provider, index) => (
              <Card key={provider.name} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xl">{provider.name}</h4>
                          {provider.popular && (
                            <Badge variant="default" className="gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Popular
                            </Badge>
                          )}
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Coverage</div>
                          <div className="font-semibold text-sm">{provider.countries}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">From</div>
                          <div className="font-semibold text-sm">{provider.startingPrice}</div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {provider.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Rating & CTA */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(provider.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{provider.rating}</span>
                      </div>
                      <Button
                        onClick={() => handleVisitProvider(provider.url, provider.name)}
                        className="gap-2"
                      >
                        Visit {provider.name}
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Use Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                How to Activate Your eSIM
              </h4>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Check if your device supports eSIM (most modern smartphones do)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Choose a provider and purchase a data plan</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Scan the QR code provided by the provider</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Your eSIM will activate automatically - you're ready to go!</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};