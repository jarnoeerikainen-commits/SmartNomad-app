import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Smartphone, Globe, Users, Shield, Clock, Navigation } from 'lucide-react';

interface LocationService {
  name: string;
  focus: string;
  description: string;
  features: string[];
  pricing: string;
  appLink?: string;
  websiteLink: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const locationServices: LocationService[] = [
  {
    name: 'GeoZilla',
    focus: 'Family & Location Tracker',
    description: 'Comprehensive GPS tracking solution for families with real-time location updates and safety features.',
    features: [
      'Real-time GPS tracking',
      'Driving reports & analytics',
      'Crash detection alerts',
      'Location history',
      'Geofencing zones',
      'Battery monitoring'
    ],
    pricing: '$5–$10/month',
    appLink: 'https://apps.apple.com/app/geozilla/id949539952',
    websiteLink: 'https://geozilla.com',
    icon: Users,
    badge: 'Popular',
    badgeVariant: 'default'
  },
  {
    name: 'Find My Kids',
    focus: 'Kids & Safety Tracker',
    description: 'Specialized tracking for children with smartwatch integration and comprehensive safety features.',
    features: [
      'GPS tracking for kids',
      'Smartwatch integration',
      'SOS button alerts',
      'Safe zones notifications',
      'Battery alerts',
      'Listen-in feature'
    ],
    pricing: '$4–$8/month',
    appLink: 'https://apps.apple.com/app/find-my-kids/id1035215003',
    websiteLink: 'https://findmykids.org',
    icon: Shield,
    badge: 'EU & Asia',
    badgeVariant: 'secondary'
  },
  {
    name: 'FamiSafe',
    focus: 'Family Safety & Parental Control',
    description: 'Complete family safety solution by Wondershare with advanced parental controls and GPS tracking.',
    features: [
      'GPS location tracking',
      'Screen time management',
      'App blocker & monitor',
      'Web content filtering',
      'Activity reports',
      'Geofencing alerts'
    ],
    pricing: 'Subscription plans',
    appLink: 'https://apps.apple.com/app/famisafe/id1287611555',
    websiteLink: 'https://famisafe.wondershare.com',
    icon: Clock,
    badge: 'Full Control',
    badgeVariant: 'outline'
  },
  {
    name: 'Glympse',
    focus: 'Location Sharing',
    description: 'Simple real-time location sharing with ETA tracking, perfect for meeting up or safety check-ins.',
    features: [
      'Real-time location sharing',
      'ETA calculations',
      'Temporary sharing (no signup needed)',
      'Group sharing',
      'Map integration',
      'Cross-platform support'
    ],
    pricing: 'Free (Ad-supported)',
    appLink: 'https://apps.apple.com/app/glympse/id330316698',
    websiteLink: 'https://glympse.com',
    icon: Navigation,
    badge: 'Free',
    badgeVariant: 'secondary'
  }
];

const LocationTrackingServices: React.FC = () => {
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Location Tracking Services</h1>
            <p className="text-muted-foreground">
              Trusted apps and services for family safety and location sharing
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Verified Services</p>
              <p className="text-sm text-muted-foreground">
                All links have been verified and lead directly to official app stores and websites. 
                Choose the service that best fits your family's needs and travel lifestyle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {locationServices.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription>{service.focus}</CardDescription>
                    </div>
                  </div>
                  {service.badge && (
                    <Badge variant={service.badgeVariant}>
                      {service.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Key Features:</p>
                  <ul className="grid grid-cols-1 gap-1.5 text-sm">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="pt-2 border-t">
                  <p className="text-sm">
                    <span className="font-semibold">Pricing:</span>{' '}
                    <span className="text-muted-foreground">{service.pricing}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {service.appLink && (
                    <Button
                      onClick={() => handleOpenLink(service.appLink!)}
                      className="flex-1 gap-2"
                      variant="default"
                    >
                      <Smartphone className="h-4 w-4" />
                      Get App
                    </Button>
                  )}
                  <Button
                    onClick={() => handleOpenLink(service.websiteLink)}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Important Note</p>
              <p className="text-sm text-muted-foreground">
                These are third-party services. Please review their privacy policies and terms of service 
                before use. Pricing and features may vary by region and are subject to change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationTrackingServices;
