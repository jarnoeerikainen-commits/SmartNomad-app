import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Cat, 
  Dog, 
  Bird,
  Plane,
  FileText,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LocationData } from '@/types/country';

interface PetServicesProps {
  currentLocation?: LocationData | null;
}

export const PetServices: React.FC<PetServicesProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchLocation, setSearchLocation] = useState(
    currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : ''
  );

  const petTypes = [
    { id: 'dog', name: 'Dogs', icon: Dog, color: 'bg-blue-500' },
    { id: 'cat', name: 'Cats', icon: Cat, color: 'bg-purple-500' },
    { id: 'bird', name: 'Parrots & Birds', icon: Bird, color: 'bg-green-500' }
  ];

  const vetSearchServices = [
    {
      name: 'Google Maps - Veterinary Clinics',
      description: 'Find local veterinary clinics near you',
      getUrl: (location: string) => `https://www.google.com/maps/search/veterinary+clinic+${encodeURIComponent(location)}`,
      icon: Stethoscope
    },
    {
      name: 'Google Maps - 24hr Emergency Vets',
      description: 'Find 24-hour emergency veterinary services',
      getUrl: (location: string) => `https://www.google.com/maps/search/24+hour+emergency+vet+${encodeURIComponent(location)}`,
      icon: AlertCircle
    }
  ];

  const governmentResources = [
    {
      name: 'USDA APHIS Pet Travel',
      url: 'https://www.aphis.usda.gov/aphis/pet-travel',
      description: 'Official US government pet travel requirements',
      countries: ['USA']
    },
    {
      name: 'UK Pet Travel Scheme (PETS)',
      url: 'https://www.gov.uk/take-pet-abroad',
      description: 'Official UK government pet travel regulations',
      countries: ['UK', 'England', 'Scotland', 'Wales', 'Northern Ireland']
    },
    {
      name: 'EU Pet Travel Regulation',
      url: 'https://food.ec.europa.eu/animals/pet-movement_en',
      description: 'European Union pet movement regulations',
      countries: ['EU']
    },
    {
      name: 'Canada Pet Import Requirements',
      url: 'https://inspection.canada.ca/animal-health/terrestrial-animals/imports/pets/eng/1326600389775/1326600500578',
      description: 'Canadian Food Inspection Agency pet import rules',
      countries: ['Canada']
    },
    {
      name: 'Australia Pet Import',
      url: 'https://www.agriculture.gov.au/biosecurity-trade/cats-dogs',
      description: 'Australian Department of Agriculture pet import requirements',
      countries: ['Australia']
    },
    {
      name: 'New Zealand Pet Import',
      url: 'https://www.mpi.govt.nz/bringing-goods-into-nz/pets/',
      description: 'New Zealand biosecurity pet import regulations',
      countries: ['New Zealand']
    }
  ];

  const airlineResources = [
    {
      name: 'IATA Live Animals Regulations',
      url: 'https://www.iata.org/en/programs/cargo/live-animals/',
      description: 'International Air Transport Association pet travel standards',
      type: 'Standards Body'
    },
    {
      name: 'Lufthansa Cargo - Animal Transport',
      url: 'https://www.lufthansa-cargo.com/special-cargo/live-animals',
      description: 'Professional pet transport services',
      type: 'Airline'
    },
    {
      name: 'KLM Pet Travel',
      url: 'https://www.klm.com/information/travel/extra-baggage/animals',
      description: 'KLM pet travel information and booking',
      type: 'Airline'
    },
    {
      name: 'American Airlines Pet Policy',
      url: 'https://www.aa.com/i18n/travel-info/special-assistance/pets.jsp',
      description: 'American Airlines pet travel requirements',
      type: 'Airline'
    }
  ];

  const petTransportCompanies = [
    {
      name: 'International Pet and Animal Transportation Association (IPATA)',
      url: 'https://www.ipata.org/',
      description: 'Find certified international pet shippers',
      verified: true
    },
    {
      name: 'PetRelocation',
      url: 'https://www.petrelocation.com/',
      description: 'Professional international pet relocation services',
      verified: true
    },
    {
      name: 'AirAnimal',
      url: 'https://www.airanimal.com/',
      description: 'USDA certified pet transportation specialists',
      verified: true
    }
  ];

  const petRequirements = {
    dog: [
      'Microchip (ISO 11784/11785 compliant)',
      'Rabies vaccination (at least 21 days before travel)',
      'Health certificate (issued by licensed vet)',
      'Import permit (country-specific)',
      'Quarantine requirements (varies by destination)',
      'Breed restrictions (check destination country)'
    ],
    cat: [
      'Microchip (ISO 11784/11785 compliant)',
      'Rabies vaccination (at least 21 days before travel)',
      'Health certificate (issued by licensed vet)',
      'Import permit (country-specific)',
      'Quarantine requirements (varies by destination)',
      'FeLV/FIV test (some countries require)'
    ],
    bird: [
      'CITES permit (for protected species)',
      'Avian health certificate',
      'Quarantine requirements (often 30+ days)',
      'Import permit from destination country',
      'Psittacosis test (for parrots)',
      'Species-specific restrictions (check both countries)'
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('pet_services') || 'Pet Services'}</h1>
        <p className="text-muted-foreground">
          {t('pet_services_description') || 'Find local vets and official pet travel regulations'}
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Always verify requirements with official government sources and your destination country's embassy. 
          Pet travel regulations change frequently and vary by country, breed, and species.
        </AlertDescription>
      </Alert>

      {/* Local Vet Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Find Local Veterinary Services
          </CardTitle>
          <CardDescription>
            Search for veterinary clinics and emergency services in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter city or location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {vetSearchServices.map((service) => (
              <Button
                key={service.name}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                asChild
              >
                <a
                  href={service.getUrl(searchLocation || 'near me')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3"
                >
                  <service.icon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pet Travel by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Pet Travel Requirements by Type</CardTitle>
          <CardDescription>
            Essential requirements for traveling with your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dog" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {petTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {petTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">General Requirements for {type.name}</h3>
                  <ul className="space-y-2">
                    {petRequirements[type.id as keyof typeof petRequirements].map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className={`h-2 w-2 rounded-full ${type.color} mt-2 shrink-0`} />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Government Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Official Government Resources
          </CardTitle>
          <CardDescription>
            Verify requirements with official government sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {governmentResources.map((resource) => (
              <Button
                key={resource.name}
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3"
                >
                  <FileText className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">
                      {resource.name}
                      <Badge variant="outline" className="text-xs">Official</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {resource.countries.join(', ')}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Airline & IATA Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Airline & Aviation Standards
          </CardTitle>
          <CardDescription>
            Official airline policies and international aviation standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {airlineResources.map((resource) => (
              <Button
                key={resource.name}
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3"
                >
                  <Plane className="h-5 w-5 mt-0.5 shrink-0 text-blue-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">
                      {resource.name}
                      <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Pet Transport */}
      <Card>
        <CardHeader>
          <CardTitle>Certified Pet Transport Companies</CardTitle>
          <CardDescription>
            Professional pet relocation services with industry certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {petTransportCompanies.map((company) => (
              <Button
                key={company.name}
                variant="outline"
                className="w-full justify-start h-auto py-4"
                asChild
              >
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3"
                >
                  <Search className="h-5 w-5 mt-0.5 shrink-0 text-green-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">
                      {company.name}
                      {company.verified && (
                        <Badge variant="default" className="text-xs bg-green-500">Certified</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {company.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetServices;