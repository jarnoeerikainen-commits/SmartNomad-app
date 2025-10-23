import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Globe, 
  Smartphone, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  MapPin,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react';
import GovernmentAppsService from '@/services/GovernmentAppsService';
import { serviceCategoriesInfo } from '@/data/governmentApps';
import { CountryGovernmentApp, GovernmentService } from '@/types/governmentApps';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const GovernmentApps = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<CountryGovernmentApp | null>(null);
  const [showOnlyWithApps, setShowOnlyWithApps] = useState(false);
  const [showOnlyEnglish, setShowOnlyEnglish] = useState(false);

  const allApps = GovernmentAppsService.getAllApps();
  const regions = ['all', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];

  const filteredApps = useMemo(() => {
    let filtered = allApps;

    // Search filter
    if (searchQuery) {
      filtered = GovernmentAppsService.searchAppsByCountry(searchQuery);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter((app) => app.region === selectedRegion);
    }

    // Apps with mobile app filter
    if (showOnlyWithApps) {
      filtered = GovernmentAppsService.getAppsWithMobileApp().filter((app) =>
        filtered.includes(app)
      );
    }

    // English support filter
    if (showOnlyEnglish) {
      filtered = filtered.filter((app) => app.englishSupport);
    }

    return filtered;
  }, [searchQuery, selectedRegion, showOnlyWithApps, showOnlyEnglish, allApps]);

  const countryServices = selectedCountry
    ? GovernmentAppsService.getServicesByCountryCode(selectedCountry.countryCode)
    : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 border">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Government Services Navigator</h1>
              <p className="text-muted-foreground mt-1">
                Access official government apps and services from 50 countries worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Country
          </CardTitle>
          <CardDescription>
            Search for government apps and official services by country or region
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by country name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={showOnlyWithApps ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyWithApps(!showOnlyWithApps)}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Apps Only
            </Button>
            <Button
              variant={showOnlyEnglish ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyEnglish(!showOnlyEnglish)}
            >
              <Globe className="h-4 w-4 mr-2" />
              English Support
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredApps.length} of {allApps.length} countries
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Country Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <Card
            key={app.id}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setSelectedCountry(app)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{app.flag}</span>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {app.countryName}
                    </CardTitle>
                    <CardDescription className="text-xs">{app.region}</CardDescription>
                  </div>
                </div>
                {app.verificationLevel === 'verified' && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {app.officialAppName ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Smartphone className="h-4 w-4 text-primary" />
                    {app.officialAppName}
                  </div>
                  <div className="flex gap-2">
                    {app.appStoreUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(app.appStoreUrl!, '_blank');
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        iOS
                      </Button>
                    )}
                    {app.playStoreUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(app.playStoreUrl!, '_blank');
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Android
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  No official mobile app
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span className="text-muted-foreground">Language: {app.primaryLanguage}</span>
                {app.englishSupport && (
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="h-3 w-3" />
                    English
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(app.webPortalUrl, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Visit Official Portal
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No countries found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Service Categories Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Service Categories</CardTitle>
          <CardDescription>
            Government services are organized into these categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategoriesInfo.map((category) => (
              <div
                key={category.category}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{category.label}</h4>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Country Details Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-card z-10 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{selectedCountry.flag}</span>
                  <div>
                    <CardTitle className="text-2xl">{selectedCountry.countryName}</CardTitle>
                    <CardDescription>Government Services Overview</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Official App Section */}
              {selectedCountry.officialAppName && (
                <div className="p-4 rounded-lg border bg-primary/5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Official Government App
                  </h3>
                  <div className="space-y-3">
                    <p className="font-medium">{selectedCountry.officialAppName}</p>
                    <div className="flex gap-2">
                      {selectedCountry.appStoreUrl && (
                        <Button
                          onClick={() => window.open(selectedCountry.appStoreUrl!, '_blank')}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download on App Store
                        </Button>
                      )}
                      {selectedCountry.playStoreUrl && (
                        <Button
                          onClick={() => window.open(selectedCountry.playStoreUrl!, '_blank')}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Get on Google Play
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Web Portal */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Official Web Portal
                </h3>
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedCountry.webPortalUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {selectedCountry.webPortalUrl}
                </Button>
              </div>

              {/* Language Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Primary Language</p>
                  <p className="font-semibold">{selectedCountry.primaryLanguage}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">English Support</p>
                  <div className="flex items-center gap-2">
                    {selectedCountry.englishSupport ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="font-semibold">Not Available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Services Section */}
              {countryServices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Available Services</h3>
                  <div className="space-y-3">
                    {countryServices.map((service) => (
                      <div key={service.id} className="p-4 rounded-lg border space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{service.serviceName}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <Badge variant={service.digitalAvailability ? 'default' : 'secondary'}>
                            {service.digitalAvailability ? 'Digital' : 'In-Person'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Processing Time:</span>
                            <p className="font-medium">{service.averageProcessingTime}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost:</span>
                            <p className="font-medium">
                              {service.costEstimate.currency} {service.costEstimate.amount}
                            </p>
                          </div>
                        </div>
                        {service.onlinePortalUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(service.onlinePortalUrl!, '_blank')}
                            className="w-full"
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Access Service
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Alert */}
              <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Official Information</p>
                    <p className="text-muted-foreground">
                      All links lead to official government websites and verified app stores.
                      Always verify you're on the correct domain before entering personal information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                Last verified: {new Date(selectedCountry.lastUpdated).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
