
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Hotel, UtensilsCrossed, Shield, Crown, Car, Plane, Umbrella, Ship } from 'lucide-react';

interface ServiceBoxProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  services: string[];
  isVip?: boolean;
  onOffersToggle: (enabled: boolean) => void;
  offersEnabled: boolean;
}

const ServiceBox: React.FC<ServiceBoxProps> = ({
  title,
  icon,
  description,
  services,
  isVip = false,
  onOffersToggle,
  offersEnabled
}) => {
  return (
    <Card className={`relative ${isVip ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-gray-200 bg-white'}`}>
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
                <Button variant="outline" size="sm">
                  Find Offers
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Get Offers & Deals
            </span>
            <Switch
              checked={offersEnabled}
              onCheckedChange={onOffersToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TravelServices: React.FC = () => {
  const [offersEnabled, setOffersEnabled] = useState<{[key: string]: boolean}>({
    insurance: false,
    hotels: false,
    restaurants: false,
    vip: false
  });

  const handleOffersToggle = (service: string, enabled: boolean) => {
    setOffersEnabled(prev => ({
      ...prev,
      [service]: enabled
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Travel Services</h2>
        <p className="text-gray-600">Find the best deals and services for your travels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insurance Services */}
        <ServiceBox
          title="Travel Insurance"
          icon={<Shield className="w-5 h-5 text-blue-600" />}
          description="Protect your travel investment"
          services={[
            "Travel Medical Insurance",
            "Trip Cancellation Coverage",
            "Baggage Protection",
            "Emergency Evacuation"
          ]}
          onOffersToggle={(enabled) => handleOffersToggle('insurance', enabled)}
          offersEnabled={offersEnabled.insurance}
        />

        {/* Hotel Booking */}
        <ServiceBox
          title="Hotel Booking"
          icon={<Hotel className="w-5 h-5 text-blue-600" />}
          description="Find your perfect accommodation"
          services={[
            "Luxury Hotels & Resorts",
            "Boutique Properties",
            "Business Hotels",
            "Budget-Friendly Options"
          ]}
          onOffersToggle={(enabled) => handleOffersToggle('hotels', enabled)}
          offersEnabled={offersEnabled.hotels}
        />

        {/* Local Restaurants */}
        <ServiceBox
          title="Local Restaurants"
          icon={<UtensilsCrossed className="w-5 h-5 text-blue-600" />}
          description="Discover local cuisine and dining"
          services={[
            "Fine Dining Restaurants",
            "Local Street Food",
            "Food Tours & Experiences",
            "Cooking Classes"
          ]}
          onOffersToggle={(enabled) => handleOffersToggle('restaurants', enabled)}
          offersEnabled={offersEnabled.restaurants}
        />

        {/* VIP Luxury Services */}
        <ServiceBox
          title="Luxury VIP Services"
          icon={<Crown className="w-5 h-5 text-yellow-600" />}
          description="Premium luxury travel experiences"
          services={[
            "Private Jet Charters",
            "Luxury Yacht Rentals",
            "Helicopter Transfers",
            "Limousine Services"
          ]}
          isVip={true}
          onOffersToggle={(enabled) => handleOffersToggle('vip', enabled)}
          offersEnabled={offersEnabled.vip}
        />
      </div>

      {/* VIP Luxury Services Details */}
      <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Crown className="w-6 h-6" />
            Premium Luxury Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Plane className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Private Jets</h4>
              <p className="text-sm text-gray-600">Exclusive charter flights</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Ship className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Luxury Yachts</h4>
              <p className="text-sm text-gray-600">Premium yacht experiences</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Car className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Limousines</h4>
              <p className="text-sm text-gray-600">Luxury ground transport</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Umbrella className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Helicopters</h4>
              <p className="text-sm text-gray-600">Aerial transfers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelServices;
