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

  // Comprehensive list of high-quality roadside assistance services by region
  const allServices = [
    // USA Services
    {
      name: "AAA Roadside Assistance",
      description: "Premier roadside assistance with over 60 million members. 24/7 emergency services including towing, battery service, fuel delivery, and lockout assistance.",
      type: "membership",
      features: [
        "24/7 Emergency Service",
        "Free Towing (up to 100 miles)",
        "Battery Jump-Start & Replacement",
        "Flat Tire Service",
        "Fuel Delivery",
        "Lockout Service"
      ],
      regions: ["USA", "Canada", "United States"],
      phone: "1-800-222-4357",
      website: "https://www.aaa.com/",
      locationFinder: "https://www.aaa.com/findclub",
      icon: Car,
      color: "blue",
      rating: 4.5
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
      regions: ["USA", "United States"],
      phone: "1-844-HONK-NOW",
      website: "https://www.honkmobile.com/",
      locationFinder: null,
      icon: Phone,
      color: "green",
      rating: 4.6
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
      regions: ["USA", "United States"],
      phone: null,
      website: "https://www.urgently.com/",
      locationFinder: null,
      icon: MapPin,
      color: "purple",
      rating: 4.4
    },
    // Canada Services
    {
      name: "CAA (Canadian Automobile Association)",
      description: "Canada's leading roadside assistance provider with 24/7 emergency services. Offers towing, battery service, fuel delivery, and more.",
      type: "membership",
      features: [
        "24/7 Emergency Service",
        "Towing Service",
        "Battery Boost & Replacement",
        "Tire Change",
        "Fuel Delivery",
        "Lockout Service"
      ],
      regions: ["Canada"],
      phone: "1-800-222-4357",
      website: "https://www.caa.ca/",
      locationFinder: "https://www.caa.ca/",
      icon: Car,
      color: "blue",
      rating: 4.7
    },
    // UK Services
    {
      name: "AA (The Automobile Association)",
      description: "UK's most trusted breakdown service with over 3 million members. 24/7 roadside assistance and recovery services.",
      type: "membership",
      features: [
        "24/7 Breakdown Cover",
        "Nationwide Coverage",
        "European Breakdown",
        "At-Home Start",
        "Relay to Destination",
        "Key Assist"
      ],
      regions: ["UK", "United Kingdom", "England", "Scotland", "Wales", "Northern Ireland"],
      phone: "0800 887 766",
      website: "https://www.theaa.com/",
      locationFinder: "https://www.theaa.com/",
      icon: Car,
      color: "blue",
      rating: 4.5
    },
    {
      name: "RAC",
      description: "UK's longest-established roadside assistance provider. Comprehensive breakdown cover with fast response times.",
      type: "membership",
      features: [
        "UK Breakdown Cover",
        "European Cover Available",
        "Home Start",
        "Onward Travel",
        "Fast Response",
        "Recovery Service"
      ],
      regions: ["UK", "United Kingdom", "England", "Scotland", "Wales", "Northern Ireland"],
      phone: "0333 2000 999",
      website: "https://www.rac.co.uk/",
      locationFinder: "https://www.rac.co.uk/",
      icon: Car,
      color: "green",
      rating: 4.4
    },
    // Australia Services
    {
      name: "RACV (Royal Automobile Club of Victoria)",
      description: "Australia's largest roadside assistance provider. 24/7 emergency roadside service across Australia.",
      type: "membership",
      features: [
        "24/7 Roadside Assistance",
        "Towing Service",
        "Battery Service",
        "Fuel Delivery",
        "Tire Change",
        "Emergency Accommodation"
      ],
      regions: ["Australia", "Victoria", "NSW", "Queensland"],
      phone: "13 11 11",
      website: "https://www.racv.com.au/",
      locationFinder: "https://www.racv.com.au/",
      icon: Car,
      color: "blue",
      rating: 4.6
    },
    {
      name: "NRMA",
      description: "Trusted roadside assistance in NSW, ACT & Tasmania. Fast response times and comprehensive coverage.",
      type: "membership",
      features: [
        "24/7 Service",
        "Free Towing",
        "Battery Replacement",
        "Lockout Service",
        "Fuel Delivery",
        "Minor Repairs"
      ],
      regions: ["Australia", "New South Wales", "NSW", "ACT", "Tasmania"],
      phone: "13 11 22",
      website: "https://www.mynrma.com.au/",
      locationFinder: "https://www.mynrma.com.au/",
      icon: Car,
      color: "orange",
      rating: 4.5
    },
    // Germany Services
    {
      name: "ADAC",
      description: "Germany's largest automobile club providing comprehensive roadside assistance across Europe.",
      type: "membership",
      features: [
        "24/7 Breakdown Service",
        "Europe-Wide Coverage",
        "Towing Service",
        "On-Site Repairs",
        "Vehicle Recovery",
        "Medical Assistance"
      ],
      regions: ["Germany", "Deutschland", "Austria", "Switzerland"],
      phone: "+49 89 22 22 22",
      website: "https://www.adac.de/",
      locationFinder: "https://www.adac.de/",
      icon: Car,
      color: "blue",
      rating: 4.8
    },
    // France Services
    {
      name: "Assistance Auto",
      description: "Leading roadside assistance in France with rapid response and professional service.",
      type: "membership",
      features: [
        "24/7 Service",
        "Dépannage Rapide",
        "Remorquage",
        "Assistance Europe",
        "Service de Batterie",
        "Livraison de Carburant"
      ],
      regions: ["France", "Belgium", "Luxembourg"],
      phone: "01 40 55 24 24",
      website: "https://www.assistanceauto.fr/",
      locationFinder: null,
      icon: Car,
      color: "blue",
      rating: 4.3
    },
    // Universal Services (Always show)
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
      regions: ["Universal"],
      phone: null,
      website: null,
      locationFinder: displayLocation 
        ? `https://www.google.com/maps/search/towing+services+near+${encodeURIComponent(displayLocation)}`
        : "https://www.google.com/maps/search/towing+services",
      icon: Car,
      color: "orange",
      rating: null
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
      regions: ["Universal"],
      phone: null,
      website: null,
      locationFinder: displayLocation
        ? `https://www.google.com/maps/search/auto+repair+near+${encodeURIComponent(displayLocation)}`
        : "https://www.google.com/maps/search/auto+repair",
      icon: Wrench,
      color: "red",
      rating: null
    }
  ];

  // Filter services based on location
  const getFilteredServices = () => {
    if (!displayLocation) {
      // Show universal services only if no location
      return allServices.filter(s => s.regions.includes("Universal"));
    }

    const locationLower = displayLocation.toLowerCase();
    
    // Filter services that match the location
    const filtered = allServices.filter(service => {
      // Always include universal services
      if (service.regions.includes("Universal")) return true;
      
      // Check if any region matches the location
      return service.regions.some(region => 
        locationLower.includes(region.toLowerCase())
      );
    });

    // If no specific services found, show universal services
    return filtered.length > 2 ? filtered : allServices.filter(s => s.regions.includes("Universal"));
  };

  const services = getFilteredServices();

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

                {!service.regions.includes("Universal") && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Coverage:</h4>
                    <p className="text-sm text-muted-foreground">{service.regions.join(", ")}</p>
                  </div>
                )}

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
