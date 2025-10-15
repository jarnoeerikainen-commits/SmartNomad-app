import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Shield, 
  Lock, 
  ExternalLink, 
  Star,
  Globe,
  Zap,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface Service {
  name: string;
  category: 'email' | 'vpn' | 'both';
  description: string;
  features: string[];
  pricing: {
    free?: string;
    paid: string;
  };
  rating: number;
  url: string;
  logo?: string;
  recommended?: boolean;
}

const VPNEmailServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const services: Service[] = [
    {
      name: 'Proton Mail',
      category: 'email',
      description: 'Swiss-based encrypted email service with end-to-end encryption and zero-access architecture.',
      features: [
        'End-to-end encryption',
        'Zero-access encryption',
        'Anonymous sign-up',
        'Swiss privacy laws',
        'Custom domain support'
      ],
      pricing: {
        free: 'Up to 1GB storage',
        paid: 'From $4.99/month'
      },
      rating: 4.8,
      url: 'https://proton.me/mail',
      recommended: true
    },
    {
      name: 'ProtonVPN',
      category: 'vpn',
      description: 'High-speed Swiss VPN that safeguards your privacy with strong encryption.',
      features: [
        'No-logs policy',
        'Swiss privacy protection',
        'Kill switch',
        'DNS leak protection',
        'Split tunneling'
      ],
      pricing: {
        free: 'Limited servers',
        paid: 'From $4.99/month'
      },
      rating: 4.7,
      url: 'https://protonvpn.com',
      recommended: true
    },
    {
      name: 'Tuta Mail',
      category: 'email',
      description: 'German-based secure email with automatic encryption and calendar integration.',
      features: [
        'Automatic encryption',
        'Encrypted calendar',
        'Anonymous registration',
        'GDPR compliant',
        'Open source'
      ],
      pricing: {
        free: 'Up to 1GB storage',
        paid: 'From $3/month'
      },
      rating: 4.6,
      url: 'https://tuta.com',
    },
    {
      name: 'StartMail',
      category: 'email',
      description: 'Privacy-focused email service with unlimited aliases and PGP encryption.',
      features: [
        'Unlimited aliases',
        'PGP encryption',
        'No tracking',
        'Dutch privacy laws',
        '10GB storage'
      ],
      pricing: {
        paid: 'From $5.95/month'
      },
      rating: 4.5,
      url: 'https://www.startmail.com',
    },
    {
      name: 'NordVPN',
      category: 'vpn',
      description: 'Leading VPN service with extensive server network and threat protection.',
      features: [
        '6000+ servers worldwide',
        'Double VPN',
        'Threat Protection',
        'Meshnet feature',
        '6 simultaneous connections'
      ],
      pricing: {
        paid: 'From $3.39/month'
      },
      rating: 4.7,
      url: 'https://nordvpn.com',
      recommended: true
    },
    {
      name: 'ExpressVPN',
      category: 'vpn',
      description: 'Fast and secure VPN with servers in 94 countries and 24/7 support.',
      features: [
        'Ultra-fast speeds',
        '94 countries',
        'Split tunneling',
        'No activity logs',
        '5 simultaneous devices'
      ],
      pricing: {
        paid: 'From $6.67/month'
      },
      rating: 4.6,
      url: 'https://expressvpn.com',
    },
    {
      name: 'Mailfence',
      category: 'email',
      description: 'Belgian secure email with integrated calendar, documents, and groups.',
      features: [
        'End-to-end encryption',
        'Digital signatures',
        'Calendar & documents',
        'No ads',
        'GDPR compliant'
      ],
      pricing: {
        free: 'Up to 500MB storage',
        paid: 'From $2.50/month'
      },
      rating: 4.4,
      url: 'https://mailfence.com',
    },
    {
      name: 'Mullvad VPN',
      category: 'vpn',
      description: 'Privacy-focused VPN that requires no email for signup, Swedish-based.',
      features: [
        'Anonymous accounts',
        'No logs policy',
        'WireGuard protocol',
        'Multihop',
        'Flat pricing'
      ],
      pricing: {
        paid: '€5/month flat rate'
      },
      rating: 4.5,
      url: 'https://mullvad.net',
    },
  ];

  const filteredServices = services.filter(service => {
    if (activeTab === 'all') return true;
    return service.category === activeTab || service.category === 'both';
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
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">VPN & Email Services</h1>
            <p className="text-muted-foreground">
              Secure your privacy with encrypted email and VPN services
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Email Services</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.category === 'email' || s.category === 'both').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VPN Services</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.category === 'vpn' || s.category === 'both').length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.recommended).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            Browse privacy-focused email and VPN providers to protect your digital nomad lifestyle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                All Services
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="vpn" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                VPN
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {filteredServices.map((service) => (
                <Card 
                  key={service.name}
                  className={`transition-all hover:shadow-lg ${
                    service.recommended ? 'border-blue-500 border-2' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          {service.recommended && (
                            <Badge className="bg-blue-500">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {service.category === 'email' && <Mail className="h-3 w-3 mr-1" />}
                            {service.category === 'vpn' && <Globe className="h-3 w-3 mr-1" />}
                            {service.category.toUpperCase()}
                          </Badge>
                        </div>
                        {renderStars(service.rating)}
                      </div>
                      <Button asChild size="sm">
                        <a href={service.url} target="_blank" rel="noopener noreferrer">
                          Visit Site
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div className="flex gap-4">
                        {service.pricing.free && (
                          <div>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                            <p className="text-sm font-medium">{service.pricing.free}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Paid Plan</p>
                          <p className="text-sm font-medium">{service.pricing.paid}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Privacy Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy Tips for Digital Nomads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Always Use VPN
              </h4>
              <p className="text-sm text-muted-foreground">
                When connecting to public WiFi in cafes, airports, or hotels, always use a VPN to encrypt your connection and protect your data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Use Encrypted Email
              </h4>
              <p className="text-sm text-muted-foreground">
                Switch to encrypted email providers for sensitive communications. They protect your messages from unauthorized access.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Multi-Factor Authentication
              </h4>
              <p className="text-sm text-muted-foreground">
                Enable 2FA on all your accounts. Most privacy services offer TOTP or hardware key authentication for extra security.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-500" />
                Choose Your Server Location
              </h4>
              <p className="text-sm text-muted-foreground">
                Select VPN servers in privacy-friendly jurisdictions like Switzerland, Iceland, or the Netherlands for better legal protection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VPNEmailServices;
