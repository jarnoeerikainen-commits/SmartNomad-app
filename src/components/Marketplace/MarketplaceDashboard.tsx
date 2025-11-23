import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, Clock, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/hooks/useMarketplace';
import ItemCard from './ItemCard';
import ItemDetailModal from './ItemDetailModal';
import ItemListingWizard from './ItemListingWizard';
import MarketplaceFilters from './MarketplaceFilters';
import { MarketplaceItem } from '@/types/marketplace';

const MarketplaceDashboard = () => {
  const { items, filters, updateFilters, clearFilters } = useMarketplace();
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showListingWizard, setShowListingWizard] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery });
  };

  const stats = {
    totalItems: items.length,
    avgPrice: items.length > 0 
      ? Math.round(items.reduce((sum, item) => sum + item.price.amount, 0) / items.length)
      : 0,
    urgentDeals: items.filter(item => item.availability.urgency === 'urgent').length,
    newToday: items.filter(item => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return item.createdAt > oneDayAgo;
    }).length
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            🏪 Expat Marketplace
          </h1>
          <p className="text-muted-foreground">
            Buy & sell with fellow nomads • AI-powered pricing • Trusted community
          </p>
        </div>
        <Button 
          size="lg" 
          className="gradient-success shadow-lg hover:shadow-xl transition-all"
          onClick={() => setShowListingWizard(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          List an Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card-subtle">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-subtle">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold">€{stats.avgPrice}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-subtle">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent Deals</p>
                <p className="text-2xl font-bold">{stats.urgentDeals}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-subtle">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Today</p>
                <p className="text-2xl font-bold">{stats.newToday}</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items, categories, or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.keys(filters).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </form>

          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <MarketplaceFilters 
                filters={filters}
                onFilterChange={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary">
              Category: {filters.category}
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {filters.location}
            </Badge>
          )}
          {filters.urgency && filters.urgency.length > 0 && (
            <Badge variant="secondary">
              Urgency: {filters.urgency.join(', ')}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Items Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All Items ({items.length})
          </TabsTrigger>
          <TabsTrigger value="urgent">
            Urgent 🔥
          </TabsTrigger>
          <TabsTrigger value="ai-picks">
            AI Picks 🤖
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {items.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No items found</CardTitle>
                <CardDescription>
                  Try adjusting your filters or search terms
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="urgent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter(item => item.availability.urgency === 'urgent')
              .map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-picks" className="mt-6">
          <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm">
              🤖 <strong>AI-Matched Items</strong> based on high demand scores and market trends
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter(item => (item.aiFeatures.demandScore || 0) >= 80)
              .map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Listing Wizard */}
      {showListingWizard && (
        <ItemListingWizard
          open={showListingWizard}
          onClose={() => setShowListingWizard(false)}
        />
      )}
    </div>
  );
};

export default MarketplaceDashboard;
