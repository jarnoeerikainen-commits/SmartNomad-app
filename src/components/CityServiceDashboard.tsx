import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  Star, 
  Users,
  MapPin,
  ArrowRight,
  ExternalLink,
  Phone,
  Clock,
  Globe,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Languages,
  ShieldCheck
} from 'lucide-react';
import { getCityById, getServicesForCity } from '@/data/globalCities';
import CityServicesAIService, { AIServiceCategory, AIServiceProvider } from '@/services/CityServicesAIService';
import { toast } from 'sonner';

interface CityServiceDashboardProps {
  cityId: string;
}

const ProviderCard = ({ provider }: { provider: AIServiceProvider }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 hover:shadow-md transition-all border-border/50">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-sm truncate">{provider.name}</h5>
              {provider.verified && (
                <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{provider.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-bold">{provider.rating}</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2">
          {provider.priceRange && (
            <Badge variant="secondary" className="text-xs gap-1">
              <DollarSign className="h-3 w-3" />
              {provider.priceRange}
            </Badge>
          )}
          {provider.languages && provider.languages.length > 0 && (
            <Badge variant="outline" className="text-xs gap-1">
              <Languages className="h-3 w-3" />
              {provider.languages.slice(0, 2).join(', ')}
            </Badge>
          )}
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{provider.address}</span>
            </div>
            {provider.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                  {provider.phone}
                </a>
              </div>
            )}
            {provider.hours && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{provider.hours}</span>
              </div>
            )}
            {provider.highlights && provider.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {provider.highlights.map((h, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{h}</Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {expanded ? 'Less' : 'Details'}
          </Button>
          {provider.website && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 ml-auto"
              onClick={() => window.open(provider.website, '_blank')}
            >
              <Globe className="h-3 w-3 mr-1" />
              Website
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const CategorySection = ({ category }: { category: AIServiceCategory }) => {
  const [showAll, setShowAll] = useState(false);
  const displayProviders = showAll ? category.providers : category.providers.slice(0, 3);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h4 className="font-semibold text-lg">{category.name}</h4>
        </div>
        <Badge variant="secondary">{category.providers.length} providers</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayProviders.map((provider, idx) => (
          <ProviderCard key={idx} provider={provider} />
        ))}
      </div>

      {category.providers.length > 3 && (
        <Button
          variant="ghost"
          className="w-full mt-3"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `Show all ${category.providers.length} providers`}
          {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      )}
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        <div>
          <h3 className="text-lg font-semibold">AI is researching real service providers...</h3>
          <p className="text-sm text-muted-foreground">Finding verified businesses with 4+ star ratings</p>
        </div>
      </div>
      <Progress value={undefined} className="animate-pulse" />
    </Card>
    {[1, 2, 3].map(i => (
      <Card key={i} className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map(j => (
            <Skeleton key={j} className="h-32 rounded-lg" />
          ))}
        </div>
      </Card>
    ))}
  </div>
);

const CityServiceDashboard = ({ cityId }: CityServiceDashboardProps) => {
  const city = getCityById(cityId);
  const staticServices = getServicesForCity(cityId);
  const [aiData, setAiData] = useState<AIServiceCategory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (city) {
      // Check cache on mount
      const cached = CityServicesAIService.getCached(city.cityName);
      if (cached) {
        setAiData(cached.categories);
        setHasSearched(true);
      }
    }
  }, [city?.cityName]);

  if (!city) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">City not found</p>
      </Card>
    );
  }

  const fetchAIServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CityServicesAIService.fetchCityServices(city.cityName, city.countryName);
      setAiData(result.categories);
      setHasSearched(true);
      toast.success(`Found ${result.categories.reduce((sum, c) => sum + c.providers.length, 0)} verified providers in ${city.cityName}`);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshServices = () => {
    CityServicesAIService.clearCache(city.cityName);
    fetchAIServices();
  };

  const availableServices = staticServices.filter(s => s.availabilityStatus === 'available').length;
  const totalServices = 10;
  const totalProviders = aiData ? aiData.reduce((sum, c) => sum + c.providers.length, 0) : 0;

  return (
    <div className="space-y-6">
      {/* City Header */}
      <Card className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{city.cityName}</h2>
              <p className="text-xl text-muted-foreground">{city.countryName}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{city.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{(city.metroPopulation / 1000000).toFixed(1)}M people</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {city.coverageScore}
                </div>
                <div className="text-sm text-muted-foreground">Coverage Score</div>
              </div>
            </Card>
            <div className="flex items-center gap-2">
              <Progress value={(availableServices / totalServices) * 100} className="flex-1" />
              <span className="text-sm font-medium whitespace-nowrap">
                {availableServices}/{totalServices} services
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI-Powered Provider Lookup */}
      {!hasSearched && !loading && (
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Discover Real Providers</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Our AI researches and verifies real service providers in {city.cityName} — 
            real websites, phone numbers, addresses, and ratings. All 4+ stars.
          </p>
          <Button size="lg" onClick={fetchAIServices} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Research {city.cityName} Services
          </Button>
        </Card>
      )}

      {loading && <LoadingSkeleton />}

      {error && (
        <Card className="p-6 border-destructive/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div>
              <h4 className="font-semibold">Failed to load services</h4>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" className="ml-auto" onClick={fetchAIServices}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* AI Provider Results */}
      {aiData && aiData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-bold">
                {totalProviders} Verified Providers
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={refreshServices} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {aiData.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      )}

      {/* Location Details */}
      <Card className="p-6 bg-muted/50">
        <h4 className="text-lg font-semibold mb-3">📍 Location Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Currency</div>
            <div className="font-medium">{city.currencyCode}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Language</div>
            <div className="font-medium">{city.primaryLanguage}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Timezone</div>
            <div className="font-medium">{city.timezone.split('/')[1]}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Last Updated</div>
            <div className="font-medium">{new Date(city.lastUpdated).toLocaleDateString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CityServiceDashboard;
