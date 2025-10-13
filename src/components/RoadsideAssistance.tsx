import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Car, Wrench, Phone, MapPin, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationData {
  city: string;
  country: string;
  country_code: string;
}

interface RoadsideAssistanceProps {
  currentLocation?: LocationData | null;
}

const RoadsideAssistance = ({ currentLocation }: RoadsideAssistanceProps) => {
  const { t } = useLanguage();
  const [searchLocation, setSearchLocation] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");

  useEffect(() => {
    if (currentLocation) {
      const location = `${currentLocation.city}, ${currentLocation.country}`;
      setSearchLocation(location);
      setDisplayLocation(location);
    }
  }, [currentLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayLocation(searchLocation);
  };

  const services = [
    {
      name: "AAA Roadside Assistance",
      description: "Premier roadside assistance with over 60 million members. 24/7 emergency services including towing, battery service, fuel delivery, and lockout assistance.",
      type: "membership",
      features: [
        "24/7 Emergency Service",
        "Free Towing (up to miles per membership)",
        "Battery Jump-Start & Replacement",
        "Flat Tire Service",
        "Fuel Delivery",
        "Lockout Service"
      ],
      coverage: "USA & Canada",
      phone: "1-800-222-4357",
      website: "https://www.aaa.com/",
      locationFinder: "https://www.aaa.com/findclub",
      icon: Car,
      color: "blue"
    },
    {
      name: "HONK",
      description: "On-demand roadside assistance app connecting you with nearby service providers. No membership required - pay as you go with transparent pricing.",
      type: "on-demand",
      features: [
        "No Membership Required",
        "Average 15-min Arrival Time",
        "Upfront Pricing",
        "Live GPS Tracking",
        "Battery Service",
        "Towing Available"
      ],
      coverage: "USA (300+ cities)",
      phone: "1-844-HONK-NOW",
      website: "https://www.honkmobile.com/",
      locationFinder: null,
      icon: Phone,
      color: "green"
    },
    {
      name: "Urgently",
      description: "Digital roadside assistance platform providing fast, reliable service through a network of professional providers.",
      type: "digital-platform",
      features: [
        "Digital-First Service",
        "Real-Time Provider Dispatch",
        "Quality Verified Providers",
        "Live ETA Updates",
        "Multiple Service Types"
      ],
      coverage: "USA",
      phone: null,
      website: "https://www.urgently.com/",
      locationFinder: null,
      icon: MapPin,
      color: "purple"
    },
    {
      name: "Local Towing Services",
      description: "Find nearby towing companies in your area. Google Maps will show you local towing services with ratings, contact info, and directions.",
      type: "local-search",
      features: [
        "Real Customer Reviews",
        "Direct Contact Numbers",
        "GPS Navigation",
        "Business Hours",
        "Price Estimates",
        "Emergency Services"
      ],
      coverage: "Worldwide",
      phone: null,
      website: null,
      locationFinder: displayLocation 
        ? `https://www.google.com/maps/search/towing+services+near+${encodeURIComponent(displayLocation)}`
        : "https://www.google.com/maps/search/towing+services",
      icon: Car,
      color: "orange"
    },
    {
      name: "Auto Repair Shops",
      description: "Locate nearby auto repair workshops and mechanics. Find certified mechanics for repairs, maintenance, and emergency services.",
      type: "local-search",
      features: [
        "Certified Mechanics",
        "Customer Ratings",
        "Service Specialties",
        "Operating Hours",
        "Contact Information",
        "Directions"
      ],
      coverage: "Worldwide",
      phone: null,
      website: null,
      locationFinder: displayLocation
        ? `https://www.google.com/maps/search/auto+repair+near+${encodeURIComponent(displayLocation)}`
        : "https://www.google.com/maps/search/auto+repair",
      icon: Wrench,
      color: "red"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t("Roadside Assistance")}</h2>
        <p className="text-muted-foreground">
          {t("Find emergency roadside services, towing, and repair shops near you")}
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Emergency Tip:</strong> Always prioritize your safety. If you're on a busy road, move to a safe location if possible. Keep emergency numbers saved in your phone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("Your Location")}
          </CardTitle>
          <CardDescription>
            {t("Enter your location to find nearby services")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={t("City, State or Address")}
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              {t("Search")}
            </Button>
          </form>
          {displayLocation && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing services near: <strong>{displayLocation}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${service.color}-500/10`}>
                      <Icon className={`h-6 w-6 text-${service.color}-500`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize mt-1">
                        {service.type.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{service.description}</p>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Coverage:</h4>
                  <p className="text-sm text-muted-foreground">{service.coverage}</p>
                </div>

                {service.phone && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Emergency Phone:</h4>
                    <a 
                      href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {service.phone}
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                  <ul className="text-sm space-y-1">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  {service.website && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={service.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  {service.locationFinder && (
                    <Button size="sm" className="flex-1" asChild>
                      <a href={service.locationFinder} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4 mr-2" />
                        Find Nearby
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Roadside Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">1.</span>
              <span><strong>Pull Over Safely:</strong> Move your vehicle to the shoulder or a safe location away from traffic.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">2.</span>
              <span><strong>Turn on Hazards:</strong> Activate your hazard lights to alert other drivers.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">3.</span>
              <span><strong>Stay in Vehicle:</strong> If on a busy highway, remain inside with seatbelt fastened unless it's unsafe.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">4.</span>
              <span><strong>Call for Help:</strong> Contact your roadside assistance provider or local emergency services.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">5.</span>
              <span><strong>Be Visible:</strong> Use reflective triangles or flares if you have them, especially at night.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-[20px]">6.</span>
              <span><strong>Share Location:</strong> Know your exact location (mile marker, nearby exits) when calling for help.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadsideAssistance;
