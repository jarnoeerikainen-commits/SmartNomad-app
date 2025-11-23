import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMovingServices } from '@/hooks/useMovingServices';
import { Truck, Plane, Search, Filter, TrendingUp, Clock, Shield, Award } from 'lucide-react';
import { MovingWizard } from './MovingWizard';
import { ServiceProviderCard } from './ServiceProviderCard';
import { MovingFilters } from './MovingFilters';
import { QuoteComparison } from './QuoteComparison';
import { demoMovingRequests } from '@/data/movingServicesData';

export function MovingServicesDashboard() {
  const { providers, filters, applyFilters, clearFilters } = useMovingServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuoteComparison, setShowQuoteComparison] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Moving Companies', value: providers.length, icon: Truck, color: 'text-blue-600' },
    { label: 'Countries Covered', value: '170+', icon: Plane, color: 'text-green-600' },
    { label: 'Avg Response Time', value: '24-48h', icon: Clock, color: 'text-orange-600' },
    { label: 'Customer Rating', value: '4.7/5', icon: Award, color: 'text-purple-600' }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || provider.type === activeTab || provider.type === 'both';
    
    return matchesSearch && matchesTab;
  });

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Moving Services
            </h1>
            <p className="text-muted-foreground mt-1">
              International relocations and local moves with intelligent planning
            </p>
          </div>
          <Button 
            onClick={() => setShowWizard(true)}
            size="lg"
            className="gap-2"
          >
            <Truck className="h-5 w-5" />
            Plan Your Move
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Quote Comparison */}
      {demoMovingRequests[0].quotes && demoMovingRequests[0].quotes.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Active Move Request
                </CardTitle>
                <CardDescription>
                  New York → London • {demoMovingRequests[0].quotes.length} quotes received
                </CardDescription>
              </div>
              <Button onClick={() => setShowQuoteComparison(true)} variant="outline">
                Compare Quotes
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search moving companies, routes, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <MovingFilters
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />
      )}

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              Min Rating: {filters.minRating}+
            </Badge>
          )}
          {filters.maxBudget && (
            <Badge variant="secondary" className="gap-1">
              Max Budget: ${filters.maxBudget}
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Moving Companies Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Movers</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProviders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No moving companies found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Trust Badges */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">All Movers Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showWizard && (
        <MovingWizard onClose={() => setShowWizard(false)} />
      )}

      {showQuoteComparison && demoMovingRequests[0].quotes && (
        <QuoteComparison
          moveRequest={demoMovingRequests[0]}
          quotes={demoMovingRequests[0].quotes}
          onClose={() => setShowQuoteComparison(false)}
        />
      )}
    </div>
  );
}
