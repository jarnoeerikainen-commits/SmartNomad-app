import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Stethoscope, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  AlertCircle,
  Hospital,
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface MedicalServicesProps {
  currentLocation: LocationData | null;
  subscription: Subscription;
  onUpgradeClick?: () => void;
}

const MedicalServices: React.FC<MedicalServicesProps> = ({ 
  currentLocation, 
  subscription,
  onUpgradeClick 
}) => {
  const [activeTab, setActiveTab] = useState('online-doctors');

  const isPremium = subscription.tier !== 'free';

  // Top telemedicine services
  const telemedicineServices = [
    {
      name: 'Teladoc Health',
      availability: '24/7 Global',
      coverage: 'Global',
      languages: '40+ languages',
      features: ['Video consultations', 'Mental health', 'Dermatology', 'Prescription services'],
      pricing: 'From $75/visit or subscription',
      website: 'https://www.teladoc.com',
      app: {
        ios: 'https://apps.apple.com/app/teladoc/id592875749',
        android: 'https://play.google.com/store/apps/details?id=com.teladoc.members'
      },
      zones: ['Americas', 'Europe', 'Asia', 'Global']
    },
    {
      name: 'MDLive',
      availability: '24/7',
      coverage: 'US, International',
      languages: '20+ languages',
      features: ['Urgent care', 'Behavioral health', 'Pediatrics', 'Chronic care'],
      pricing: 'From $82/visit',
      website: 'https://www.mdlive.com',
      app: {
        ios: 'https://apps.apple.com/app/mdlive/id704348536',
        android: 'https://play.google.com/store/apps/details?id=com.mdlive.mobile'
      },
      zones: ['Americas', 'Global']
    },
    {
      name: 'Babylon Health',
      availability: '24/7',
      coverage: 'UK, Europe, US',
      languages: 'English, Spanish, Arabic',
      features: ['AI symptom checker', 'Video GP', 'Prescriptions', 'Referrals'],
      pricing: 'Subscription or per visit',
      website: 'https://www.babylonhealth.com',
      app: {
        ios: 'https://apps.apple.com/app/babylon-healthcare-services/id858558101',
        android: 'https://play.google.com/store/apps/details?id=com.babylon'
      },
      zones: ['Europe', 'Americas']
    },
    {
      name: 'Kry/Livi',
      availability: 'Extended hours',
      coverage: 'UK, Sweden, France, Germany, Norway',
      languages: 'Local languages + English',
      features: ['Video consultation', 'Digital prescriptions', 'Sick notes', 'Specialist referrals'],
      pricing: 'From €25/consultation',
      website: 'https://www.kry.se / https://www.livi.co.uk',
      app: {
        ios: 'https://apps.apple.com/app/kry-livi/id1099485975',
        android: 'https://play.google.com/store/apps/details?id=se.kry.citizen'
      },
      zones: ['Europe']
    },
    {
      name: 'Doctor on Demand',
      availability: '7 AM - 10 PM Local',
      coverage: 'US-focused',
      languages: 'English, Spanish',
      features: ['Video visits', 'Urgent care', 'Psychiatry', 'Preventive health'],
      pricing: 'From $79/visit',
      website: 'https://www.doctorondemand.com',
      app: {
        ios: 'https://apps.apple.com/app/doctor-on-demand/id591981144',
        android: 'https://play.google.com/store/apps/details?id=com.doctorondemand.apps.patientapp'
      },
      zones: ['Americas']
    },
    {
      name: 'Amwell',
      availability: '24/7',
      coverage: 'US, International',
      languages: 'Multiple languages',
      features: ['Urgent care', 'Therapy', 'Psychiatry', 'Nutrition'],
      pricing: 'From $79/visit',
      website: 'https://www.amwell.com',
      app: {
        ios: 'https://apps.apple.com/app/amwell/id1078762018',
        android: 'https://play.google.com/store/apps/details?id=com.americanwell.android.member.amwell'
      },
      zones: ['Americas', 'Global']
    },
    {
      name: 'HealthTap',
      availability: '24/7 Global',
      coverage: 'Global',
      languages: 'English, Spanish',
      features: ['AI doctor', 'Video consultations', 'Primary care', 'Prescriptions'],
      pricing: 'From $44/month membership',
      website: 'https://www.healthtap.com',
      app: {
        ios: 'https://apps.apple.com/app/healthtap/id377062957',
        android: 'https://play.google.com/store/apps/details?id=com.healthtap'
      },
      zones: ['Global', 'Americas', 'Europe', 'Asia']
    },
    {
      name: 'Push Doctor',
      availability: '7 AM - 10 PM',
      coverage: 'UK-focused',
      languages: 'English',
      features: ['Video GP', 'Prescriptions', 'Fit notes', 'Referrals'],
      pricing: 'From £30/consultation',
      website: 'https://www.pushdoctor.co.uk',
      app: {
        ios: 'https://apps.apple.com/app/push-doctor/id1036352968',
        android: 'https://play.google.com/store/apps/details?id=com.pushdoctor'
      },
      zones: ['Europe']
    }
  ];

  // Emergency numbers by region
  const emergencyNumbers = [
    { region: 'Europe (Most)', number: '112', service: 'Emergency Services' },
    { region: 'US & Canada', number: '911', service: 'Emergency Services' },
    { region: 'UK', number: '999 / 111', service: 'Emergency / Non-emergency' },
    { region: 'Australia', number: '000', service: 'Emergency Services' },
    { region: 'New Zealand', number: '111', service: 'Emergency Services' },
    { region: 'Japan', number: '119', service: 'Ambulance' },
    { region: 'India', number: '102 / 108', service: 'Ambulance' },
    { region: 'Singapore', number: '995', service: 'Ambulance' },
    { region: 'UAE', number: '998 / 999', service: 'Ambulance / Emergency' },
    { region: 'South Africa', number: '10177', service: 'Ambulance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Services</h1>
          <p className="text-muted-foreground mt-1">
            24/7 online doctors, emergency contacts, and local healthcare
          </p>
        </div>
      </div>

      {/* AI First Help Banner for Premium Users */}
      {isPremium && (
        <Alert className="border-primary/50 bg-primary/5">
          <Sparkles className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-primary">Premium Feature:</strong> Use AI Travel Assistant for immediate health guidance before consulting a doctor.
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
                <strong>Upgrade to Premium:</strong> Get AI-powered first help for instant health guidance.
              </div>
              <Button size="sm" onClick={onUpgradeClick}>
                Upgrade Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="online-doctors">
            <Stethoscope className="h-4 w-4 mr-2" />
            Online Doctors
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <AlertCircle className="h-4 w-4 mr-2" />
            Emergency
          </TabsTrigger>
          <TabsTrigger value="local">
            <MapPin className="h-4 w-4 mr-2" />
            Local Care
          </TabsTrigger>
        </TabsList>

        {/* Online Doctors Tab */}
        <TabsContent value="online-doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Telemedicine Services
              </CardTitle>
              <CardDescription>
                Connect with licensed doctors via video consultation - available 24/7 worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {telemedicineServices.map((service, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4" />
                            {service.availability}
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
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Coverage:</strong> {service.coverage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Languages:</strong> {service.languages}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Features:</p>
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
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(service.app.ios, '_blank')}
                          >
                            iOS App
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(service.app.android, '_blank')}
                          >
                            Android
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-4">
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription className="ml-2">
              <strong className="text-destructive">Life-threatening emergency?</strong> Call local emergency services immediately!
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Numbers by Region
              </CardTitle>
              <CardDescription>
                Important emergency contact numbers worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {emergencyNumbers.map((emergency, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{emergency.region}</p>
                          <p className="text-sm text-muted-foreground">{emergency.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-destructive">{emergency.number}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Care Tab */}
        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Local Healthcare
              </CardTitle>
              <CardDescription>
                {currentLocation 
                  ? `Healthcare services near ${currentLocation.city}, ${currentLocation.country}`
                  : 'Enable location to find nearby healthcare services'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-24 flex-col"
                  onClick={() => {
                    const query = currentLocation 
                      ? `doctors near ${currentLocation.city}, ${currentLocation.country}`
                      : 'doctors near me';
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }}
                >
                  <User className="h-8 w-8 mb-2" />
                  <span>Find Local Doctors</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex-col"
                  onClick={() => {
                    const query = currentLocation 
                      ? `hospitals near ${currentLocation.city}, ${currentLocation.country}`
                      : 'hospitals near me';
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }}
                >
                  <Hospital className="h-8 w-8 mb-2" />
                  <span>Find Nearest Hospital</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex-col"
                  onClick={() => {
                    const query = currentLocation 
                      ? `pharmacies near ${currentLocation.city}, ${currentLocation.country}`
                      : 'pharmacies near me';
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }}
                >
                  <Stethoscope className="h-8 w-8 mb-2" />
                  <span>Find Pharmacies</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex-col"
                  onClick={() => {
                    const query = currentLocation 
                      ? `urgent care near ${currentLocation.city}, ${currentLocation.country}`
                      : 'urgent care near me';
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }}
                >
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <span>Find Urgent Care</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalServices;