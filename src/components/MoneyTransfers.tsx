import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, MapPin, Search, DollarSign } from 'lucide-react';
import { LocationData } from '@/types/country';

interface MoneyTransfersProps {
  currentLocation?: LocationData | null;
}

const MoneyTransfers: React.FC<MoneyTransfersProps> = ({ currentLocation }) => {
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
      name: 'MoneyGram',
      description: 'Fast and reliable money transfer service available in over 200 countries',
      features: [
        'Send money in minutes',
        '24/7 customer support',
        'Mobile app available',
        'Cash pickup locations worldwide'
      ],
      website: 'https://www.moneygram.com',
      locationFinder: `https://www.moneygram.com/mgo/us/en/locations?country=US${displayLocation ? `&address=${encodeURIComponent(displayLocation)}` : ''}`,
      icon: DollarSign,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Western Union',
      description: 'Global leader in cross-border money transfer services since 1851',
      features: [
        'Send to 200+ countries',
        'Multiple payout options',
        'Track your transfer online',
        '500,000+ agent locations'
      ],
      website: 'https://www.westernunion.com',
      locationFinder: `https://locations.westernunion.com/search${displayLocation ? `?q=${encodeURIComponent(displayLocation)}` : ''}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Money Transfer Services</h1>
        <p className="text-muted-foreground">
          Find nearby money transfer locations for quick and secure international transfers
        </p>
      </div>

      {/* Location Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Find Locations Near You
          </CardTitle>
          <CardDescription>
            {currentLocation 
              ? `Currently showing locations near: ${displayLocation}`
              : 'Enter your location to find nearby money transfer services'}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color}`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {service.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
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
                  Find Nearest Location
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
        ))}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Always verify the location's hours of operation before visiting</p>
          <p>• Bring a valid government-issued ID for all transactions</p>
          <p>• Compare fees and exchange rates between services for the best deal</p>
          <p>• Keep your receipt and tracking number until the transfer is completed</p>
          <p>• Be aware of any transfer limits and requirements in your destination country</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoneyTransfers;
