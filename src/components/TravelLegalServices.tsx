import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Scale, 
  Phone, 
  Globe, 
  Clock, 
  Shield,
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface TravelLegalServicesProps {
  currentLocation: LocationData | null;
  subscription: Subscription;
  onUpgradeClick?: () => void;
}

const TravelLegalServices: React.FC<TravelLegalServicesProps> = ({ 
  currentLocation, 
  subscription,
  onUpgradeClick 
}) => {
  const isPremium = subscription.tier !== 'free';

  // Top travel legal services
  const legalServices = [
    {
      name: 'LegalShield',
      availability: '24/7 Emergency',
      coverage: 'US, Canada, International travelers',
      languages: 'English, Spanish',
      features: [
        'Emergency legal consultation',
        'Document review',
        'Attorney network access',
        'Identity theft protection',
        'Travel emergency assistance'
      ],
      pricing: 'From $24.95/month',
      website: 'https://www.legalshield.com',
      phone: '1-800-773-0888',
      zones: ['Americas', 'Global'],
      description: 'Leading legal protection for travelers with 24/7 emergency support'
    },
    {
      name: 'Allianz Global Assistance',
      availability: '24/7 Worldwide',
      coverage: 'Global',
      languages: '20+ languages',
      features: [
        'Legal assistance abroad',
        'Bail bond assistance',
        'Attorney referrals',
        'Document replacement help',
        'Interpreter services'
      ],
      pricing: 'Included with travel insurance',
      website: 'https://www.allianztravelinsurance.com',
      phone: '1-866-884-3556',
      zones: ['Global', 'Americas', 'Europe', 'Asia'],
      description: 'Comprehensive legal support included with travel insurance'
    },
    {
      name: 'ARAG Legal Insurance',
      availability: 'Business hours + Emergency',
      coverage: 'Europe-focused',
      languages: 'English, German, French, Italian, Spanish',
      features: [
        'Legal advice hotline',
        'Contract disputes',
        'Traffic violations abroad',
        'Consumer protection',
        'Landlord disputes'
      ],
      pricing: 'From €15/month',
      website: 'https://www.arag.com',
      phone: '+49 211 963-2222',
      zones: ['Europe'],
      description: 'Europe\'s leading legal insurance provider for travelers'
    },
    {
      name: 'DAS Legal Insurance',
      availability: '24/7 Emergency line',
      coverage: 'Europe, UK',
      languages: 'English, German, Dutch, French',
      features: [
        'Legal helpline',
        'Travel legal cover',
        'Personal injury claims',
        'Contract disputes',
        'Tax investigation support'
      ],
      pricing: 'From £8/month',
      website: 'https://www.das.co.uk',
      phone: '+44 117 934 0066',
      zones: ['Europe'],
      description: 'Trusted UK and European legal insurance for travelers'
    },
    {
      name: 'AXA Assistance Legal',
      availability: '24/7',
      coverage: 'Global',
      languages: 'Multiple languages',
      features: [
        'Legal consultation',
        'Emergency legal assistance',
        'Bail advancement',
        'Attorney network',
        'Document loss support'
      ],
      pricing: 'Included with AXA insurance',
      website: 'https://www.axa-assistance.com',
      phone: '+33 1 55 92 40 00',
      zones: ['Global', 'Europe', 'Americas', 'Asia'],
      description: 'Global legal assistance through AXA insurance network'
    },
    {
      name: 'Travel Guard Legal',
      availability: '24/7 Assistance',
      coverage: 'Worldwide',
      languages: 'English, Spanish, French',
      features: [
        'Legal referrals',
        'Emergency cash transfer',
        'Lost document assistance',
        'Legal interpretation',
        'Embassy coordination'
      ],
      pricing: 'Part of travel insurance',
      website: 'https://www.travelguard.com',
      phone: '1-800-826-4919',
      zones: ['Global', 'Americas'],
      description: 'Comprehensive travel legal support worldwide'
    },
    {
      name: 'World Nomads Legal',
      availability: '24/7 Emergency',
      coverage: 'Global (150+ countries)',
      languages: 'English',
      features: [
        'Legal advice',
        'Emergency legal assistance',
        'Bail bonds',
        'Local lawyer referrals',
        'Embassy liaison'
      ],
      pricing: 'Included with insurance',
      website: 'https://www.worldnomads.com',
      phone: 'Country-specific numbers',
      zones: ['Global'],
      description: 'Legal support designed specifically for digital nomads'
    },
    {
      name: 'SafetyWing Legal Support',
      availability: '24/7',
      coverage: 'Global',
      languages: 'English',
      features: [
        'Legal consultation',
        'Emergency legal referrals',
        'Document assistance',
        'Travel advice',
        'Emergency coordination'
      ],
      pricing: 'Included with Nomad Insurance',
      website: 'https://www.safetywing.com',
      phone: 'Online support',
      zones: ['Global'],
      description: 'Modern legal support for remote workers and nomads'
    }
  ];

  const legalTips = [
    {
      title: 'Know Local Laws',
      description: 'Research local laws and customs before traveling. What\'s legal at home may be illegal abroad.',
      icon: FileText
    },
    {
      title: 'Keep Documents Safe',
      description: 'Keep copies of passport, visa, and insurance documents in multiple locations (physical and digital).',
      icon: Shield
    },
    {
      title: 'Embassy Contacts',
      description: 'Save your country\'s embassy/consulate contact information for your destination.',
      icon: Phone
    },
    {
      title: 'Know Your Rights',
      description: 'Understand your rights as a tourist, including consumer protection and legal representation.',
      icon: Scale
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Travel Legal Services</h1>
          <p className="text-muted-foreground mt-1">
            24/7 legal assistance and advice for travelers worldwide
          </p>
        </div>
      </div>

      {/* AI Legal Assistant Banner */}
      {isPremium && (
        <Alert className="border-primary/50 bg-primary/5">
          <Sparkles className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-primary">Premium Feature:</strong> Use AI Travel Assistant for instant legal guidance before contacting a lawyer.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!isPremium && onUpgradeClick && (
        <Alert>
          <Sparkles className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <strong>Upgrade to Premium:</strong> Get AI-powered legal guidance for immediate help.
              </div>
              <Button size="sm" onClick={onUpgradeClick}>
                Upgrade Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Legal Services Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Travel Legal Services
          </CardTitle>
          <CardDescription>
            Professional legal assistance for travelers - available 24/7 in multiple timezones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {legalServices.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {service.description}
                      </CardDescription>
                    </div>
                    {service.availability.includes('24/7') && (
                      <Badge variant="default">24/7</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Availability:</strong> {service.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Coverage:</strong> {service.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Contact:</strong> {service.phone}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-primary">{service.pricing}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => window.open(service.website, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                    {service.phone !== 'Online support' && service.phone !== 'Country-specific numbers' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`tel:${service.phone.replace(/\s/g, '')}`, '_blank')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Travel Legal Tips
          </CardTitle>
          <CardDescription>
            Important legal considerations for international travelers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {legalTips.map((tip, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <tip.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Location Info */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Your Location: {currentLocation.city}, {currentLocation.country}
            </CardTitle>
            <CardDescription>
              Quick access to local resources
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => {
                const query = `${currentLocation.country} embassy phone number`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Local Embassy
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const query = `lawyers in ${currentLocation.city} ${currentLocation.country}`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
              }}
            >
              <Scale className="h-4 w-4 mr-2" />
              Find Lawyers
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const query = `legal aid ${currentLocation.country}`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
              }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Legal Aid
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TravelLegalServices;