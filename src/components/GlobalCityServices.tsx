import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Globe2, Map, Search, TrendingUp } from 'lucide-react';
import GlobalCoverageMap from './GlobalCoverageMap';
import CityServiceDashboard from './CityServiceDashboard';
import ServiceCoverageAnalyzer from './ServiceCoverageAnalyzer';

const GlobalCityServices = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          <Globe2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Global City Services</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive service coverage across 512 cities worldwide
        </p>
        
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">200</div>
            <div className="text-sm text-muted-foreground">Cities with Full Coverage</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">150</div>
            <div className="text-sm text-muted-foreground">Cities with Growing Networks</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">162</div>
            <div className="text-sm text-muted-foreground">Cities with Basic Coverage</div>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Coverage Map
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find Services
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <GlobalCoverageMap onCitySelect={setSelectedCityId} />
          {selectedCityId && (
            <div className="mt-6">
              <CityServiceDashboard cityId={selectedCityId} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <ServiceCoverageAnalyzer onCitySelect={setSelectedCityId} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Service Coverage Insights</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Global Reach</h4>
                <p className="text-muted-foreground mb-4">
                  SuperNomad now covers 512 cities across 6 continents, providing comprehensive
                  service intelligence for digital nomads worldwide.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Service Quality</h4>
                <p className="text-muted-foreground mb-4">
                  Average user satisfaction across all services: <span className="text-primary font-bold">4.6/5.0</span>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Expansion Plans</h4>
                <p className="text-muted-foreground mb-4">
                  We're actively expanding services in Tier 2 and Tier 3 cities, with 50+ new
                  provider partnerships planned for Q2-Q3 2026.
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">🎯 Use Our Smart City Finder</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Select services you need (co-working, healthcare, etc.)</li>
                  <li>Choose your preferred regions and budget</li>
                  <li>Get matched with perfect cities + alternatives</li>
                  <li>See exact service availability and quality ratings</li>
                </ol>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalCityServices;
