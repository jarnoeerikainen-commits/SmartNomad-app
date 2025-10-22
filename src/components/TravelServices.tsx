
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel, UtensilsCrossed, Shield, Crown, Car, Plane, Umbrella, Ship, ExternalLink, Scale, FileText } from 'lucide-react';
import OffersModal from '@/components/OffersModal';
import OffersService, { Offer } from '@/services/OffersService';
import { LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import AirportLoungeAccess from '@/components/AirportLoungeAccess';

interface ServiceBoxProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  services: string[];
  isVip?: boolean;
  onOffersToggle: (enabled: boolean) => void;
  offersEnabled: boolean;
  serviceType: 'insurance' | 'hotels' | 'restaurants' | 'vip' | 'lawyers' | 'visa';
  currentLocation: LocationData | null;
}

const ServiceBox: React.FC<ServiceBoxProps> = ({
  title,
  icon,
  description,
  services,
  isVip = false,
  onOffersToggle,
  offersEnabled,
  serviceType,
  currentLocation
}) => {
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFindOffers = async (serviceName: string) => {
    // Always allow finding offers - make it active
    const mockLocation = currentLocation || {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'United States',
      country_code: 'US',
      timestamp: Date.now()
    };

    setIsLoading(true);
    setIsOffersModalOpen(true);

    try {
      
      
      const foundOffers = await OffersService.searchOffers({
        service: serviceType,
        location: mockLocation
      });

      setOffers(foundOffers);
      
      toast({
        title: "Offers Found!",
        description: `Found ${foundOffers.length} offers for ${serviceName} in ${mockLocation.city}.`,
      });
    } catch (error) {
      console.error('Error searching offers:', error);
      toast({
        title: "Search Failed",
        description: "Could not find offers at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={`relative ${isVip ? 'border-accent bg-gradient-to-br from-accent/10 to-accent/5' : 'border-border bg-card'}`}>
        {isVip && (
          <div className="absolute -top-3 -right-3">
            <Badge className="bg-yellow-400 text-yellow-900 font-bold">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </Badge>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isVip ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                {icon}
              </div>
              <div>
                <CardTitle className={`text-lg ${isVip ? 'text-yellow-800' : 'text-gray-800'}`}>
                  {title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFindOffers(service)}
                    className="hover:bg-green-50 hover:border-green-300 text-green-700 border-green-300"
                  >
                    {t('services.find_offers')}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {t('services.get_deals')}
              </span>
              <Switch
                checked={offersEnabled}
                onCheckedChange={onOffersToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => setIsOffersModalOpen(false)}
        offers={offers}
        serviceType={serviceType}
        location={currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'New York, United States'}
        isLoading={isLoading}
      />
    </>
  );
};

interface TravelServicesProps {
  currentLocation: LocationData | null;
}

const TravelServices: React.FC<TravelServicesProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [offersEnabled, setOffersEnabled] = useState<{[key: string]: boolean}>({
    insurance: false,
    hotels: false,
    restaurants: false,
    vip: false,
    lawyers: false,
    visa: false
  });

  const handleOffersToggle = (service: string, enabled: boolean) => {
    setOffersEnabled(prev => ({
      ...prev,
      [service]: enabled
    }));
  };

  // Verified premium luxury service providers
  const premiumServices = [
    {
      name: "NetJets",
      description: "Private jet charters and fractional ownership",
      url: "https://www.netjets.com",
      icon: Plane,
      category: "Aviation"
    },
    {
      name: "Flexjet",
      description: "Private jet solutions and luxury travel",
      url: "https://www.flexjet.com",
      icon: Plane,
      category: "Aviation"
    },
    {
      name: "VistaJet",
      description: "Global private aviation company",
      url: "https://www.vistajet.com",
      icon: Plane,
      category: "Aviation"
    },
    {
      name: "Burgess Yachts",
      description: "Luxury yacht charter and sales",
      url: "https://www.burgessyachts.com",
      icon: Ship,
      category: "Marine"
    },
    {
      name: "Fraser Yachts",
      description: "Superyacht charter and brokerage",
      url: "https://www.fraseryachts.com",
      icon: Ship,
      category: "Marine"
    },
    {
      name: "Northrop & Johnson",
      description: "Luxury yacht charter specialists",
      url: "https://www.northropandjohnson.com",
      icon: Ship,
      category: "Marine"
    },
    {
      name: "Blacklane",
      description: "Premium chauffeur service worldwide",
      url: "https://www.blacklane.com",
      icon: Car,
      category: "Ground Transport"
    },
    {
      name: "Uber Black",
      description: "Premium ride service with luxury vehicles",
      url: "https://www.uber.com/us/en/ride/uber-black/",
      icon: Car,
      category: "Ground Transport"
    },
    {
      name: "The Ritz-Carlton",
      description: "Luxury hotel experiences worldwide",
      url: "https://www.ritzcarlton.com",
      icon: Umbrella,
      category: "Hospitality"
    },
    {
      name: "Four Seasons",
      description: "Luxury hotels and resorts",
      url: "https://www.fourseasons.com",
      icon: Umbrella,
      category: "Hospitality"
    },
    {
      name: "Mandarin Oriental",
      description: "Luxury hotel group with Asian heritage",
      url: "https://www.mandarinoriental.com",
      icon: Umbrella,
      category: "Hospitality"
    },
    {
      name: "Quintessentially",
      description: "Global luxury concierge and lifestyle service",
      url: "https://www.quintessentially.com",
      icon: Crown,
      category: "Concierge"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('services.title')}</h2>
        <p className="text-gray-600">{t('services.description')}</p>
        {currentLocation && (
          <p className="text-sm text-blue-600 mt-1">
            📍 Searching offers for {currentLocation.city}, {currentLocation.country}
          </p>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="services">Travel Services</TabsTrigger>
          <TabsTrigger value="lounges">
            <Crown className="w-4 h-4 mr-2" />
            Airport Lounges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insurance Services */}
        <ServiceBox
          title={t('services.insurance')}
          icon={<Shield className="w-5 h-5 text-blue-600" />}
          description="Protect your travel investment"
          services={[
            "Travel Medical Insurance",
            "Trip Cancellation Coverage",
            "Baggage Protection",
            "Emergency Evacuation"
          ]}
          serviceType="insurance"
          onOffersToggle={(enabled) => handleOffersToggle('insurance', enabled)}
          offersEnabled={offersEnabled.insurance}
          currentLocation={currentLocation}
        />

        {/* Hotel Booking */}
        <ServiceBox
          title={t('services.hotels')}
          icon={<Hotel className="w-5 h-5 text-blue-600" />}
          description="Find your perfect accommodation"
          services={[
            "Luxury Hotels & Resorts",
            "Boutique Properties",
            "Business Hotels",
            "Budget-Friendly Options"
          ]}
          serviceType="hotels"
          onOffersToggle={(enabled) => handleOffersToggle('hotels', enabled)}
          offersEnabled={offersEnabled.hotels}
          currentLocation={currentLocation}
        />

        {/* Local Restaurants */}
        <ServiceBox
          title={t('services.restaurants')}
          icon={<UtensilsCrossed className="w-5 h-5 text-blue-600" />}
          description="Discover local cuisine and dining"
          services={[
            "Fine Dining Restaurants",
            "Local Street Food",
            "Food Tours & Experiences",
            "Cooking Classes"
          ]}
          serviceType="restaurants"
          onOffersToggle={(enabled) => handleOffersToggle('restaurants', enabled)}
          offersEnabled={offersEnabled.restaurants}
          currentLocation={currentLocation}
        />

        {/* VIP Luxury Services */}
        <ServiceBox
          title={t('services.vip')}
          icon={<Crown className="w-5 h-5 text-yellow-600" />}
          description="Premium luxury travel experiences"
          services={[
            "Private Jet Charters",
            "Luxury Yacht Rentals",
            "Helicopter Transfers",
            "Limousine Services"
          ]}
          serviceType="vip"
          isVip={true}
          onOffersToggle={(enabled) => handleOffersToggle('vip', enabled)}
          offersEnabled={offersEnabled.vip}
          currentLocation={currentLocation}
        />

        {/* Legal Services */}
        <ServiceBox
          title={t('services.legal')}
          icon={<Scale className="w-5 h-5 text-blue-600" />}
          description="Professional legal assistance"
          services={[
            "Immigration Lawyers",
            "Business Law Attorneys",
            "International Tax Lawyers",
            "Contract Review Services"
          ]}
          serviceType="lawyers"
          onOffersToggle={(enabled) => handleOffersToggle('lawyers', enabled)}
          offersEnabled={offersEnabled.lawyers}
          currentLocation={currentLocation}
        />

        {/* Visa Services */}
        <ServiceBox
          title={t('services.visa')}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          description="Visa processing and document services"
          services={[
            "Visa Application Services",
            "Embassy Appointments",
            "Document Authentication",
            "Visa Consultation"
          ]}
          serviceType="visa"
          onOffersToggle={(enabled) => handleOffersToggle('visa', enabled)}
          offersEnabled={offersEnabled.visa}
          currentLocation={currentLocation}
        />
      </div>

          {/* Premium Luxury Services Directory */}
          <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Crown className="w-6 h-6" />
                {t('services.premium_directory')}
              </CardTitle>
              <p className="text-sm text-yellow-700">
                Verified premium service providers for the ultimate luxury travel experience
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-yellow-600" />
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">{service.name}</h4>
                            <p className="text-xs text-yellow-600">{service.category}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(service.url, '_blank')}
                          className="text-xs px-2 py-1 h-auto border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">{t('services.why_premium')}</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 24/7 personalized concierge support</li>
                  <li>• Guaranteed availability and priority booking</li>
                  <li>• Exclusive access to luxury amenities</li>
                  <li>• White-glove service and attention to detail</li>
                  <li>• Global network of verified premium providers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Airport Lounge Access Tab */}
        <TabsContent value="lounges">
          <AirportLoungeAccess currentLocation={currentLocation} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelServices;
