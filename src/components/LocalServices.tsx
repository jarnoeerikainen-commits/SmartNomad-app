import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Clock, Shield, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { majorCities } from '@/data/localServicesData';
import ServiceCategoryGrid from './ServiceCategoryGrid';
import ProviderSearchList from './ProviderSearchList';

const LocalServices = () => {
  const [selectedCity, setSelectedCity] = useState('Bangkok');
  const [searchQuery, setSearchQuery] = useState('');

  const cityData = majorCities.find(city => city.cityName === selectedCity);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              🏠 Expat Lifestyle Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              Trusted local services for expats in 100+ major cities worldwide
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            4.0★+ Only
          </Badge>
        </div>

        {/* Location Selector */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <label className="font-semibold">Your Location</label>
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {majorCities.map((city) => (
                      <SelectItem key={city.cityName} value={city.cityName}>
                        {city.cityName}, {city.countryCode} ({city.providerCount} providers)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-primary" />
                  <label className="font-semibold">Search Services</label>
                </div>
                <Input
                  placeholder="Search for cleaning, repair, health..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {cityData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{cityData.cityName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verified Providers</p>
                    <p className="font-semibold">{cityData.providerCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="font-semibold">4.6★</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="font-semibold">&lt; 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Service Categories</TabsTrigger>
          <TabsTrigger value="providers">Browse Providers</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <ServiceCategoryGrid 
            selectedCity={selectedCity}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <ProviderSearchList 
            selectedCity={selectedCity}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Expat Lifestyle Hub</CardTitle>
              <CardDescription>
                Your trusted partner for daily life services in 100+ cities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Quality Guarantee
                </h3>
                <p className="text-muted-foreground mb-3">
                  All service providers are manually verified with strict quality standards:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ Minimum 4.0★ rating requirement</li>
                  <li>✅ Background checks and license verification</li>
                  <li>✅ Insurance verification for applicable services</li>
                  <li>✅ Regular quality monitoring and user reviews</li>
                  <li>✅ 24/7 customer support for all bookings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Service Categories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">🏥 Health & Wellness</h4>
                    <p className="text-sm text-muted-foreground">
                      Medical services, lab tests, therapy, vaccines, and wellness at home
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🔧 Home Maintenance</h4>
                    <p className="text-sm text-muted-foreground">
                      Emergency repairs, pest control, AC service, moving services
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🧹 Cleaning Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Regular cleaning, deep cleaning, specialty cleaning, disinfection
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">💅 Personal Care</h4>
                    <p className="text-sm text-muted-foreground">
                      Beauty services, hair care, massage, and spa treatments at home
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🐾 Specialty Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Pet care, childcare, fitness training, car wash
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Global Coverage</h3>
                <p className="text-muted-foreground mb-3">
                  We're actively expanding services across 100 major cities worldwide, with 50+ new
                  provider partnerships planned for Q2-Q3 2026.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">100+ Cities</Badge>
                  <Badge variant="secondary">50+ Service Types</Badge>
                  <Badge variant="secondary">2,500+ Verified Providers</Badge>
                  <Badge variant="secondary">4.6★ Average Rating</Badge>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">💡 How It Works</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Select your city and browse service categories</li>
                  <li>2. Compare verified providers with transparent pricing</li>
                  <li>3. Book directly with providers or request quotes</li>
                  <li>4. Enjoy quality service with SmartNomad guarantee</li>
                  <li>5. Rate and review to help other expats</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalServices;
