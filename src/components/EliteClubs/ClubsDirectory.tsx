import React, { useState } from 'react';
import { useClubsSearch } from '@/hooks/useClubsSearch';
import { EliteClub } from '@/types/eliteClub';
import { ClubCard } from './ClubCard';
import { ClubDetailModal } from './ClubDetailModal';
import { ClubFilters } from './ClubFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Filter, Crown, TrendingUp, Sparkles } from 'lucide-react';

export const ClubsDirectory: React.FC = () => {
  const {
    filteredClubs,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
  } = useClubsSearch();

  const [selectedClub, setSelectedClub] = useState<EliteClub | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilter('searchQuery', query);
  };

  const featuredClubs = filteredClubs.filter((club) => club.featured);
  const regularClubs = filteredClubs.filter((club) => !club.featured);

  const clubsByCity = filteredClubs.reduce((acc, club) => {
    if (!acc[club.city]) {
      acc[club.city] = [];
    }
    acc[club.city].push(club);
    return acc;
  }, {} as Record<string, EliteClub[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Elite Global Clubs</h1>
            <p className="text-muted-foreground mt-1">
              Discover exclusive membership clubs worldwide
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {filteredClubs.length}
            </div>
            <div className="text-sm text-muted-foreground">Clubs Available</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {Object.keys(clubsByCity).length}
            </div>
            <div className="text-sm text-muted-foreground">Cities</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {new Set(filteredClubs.map((c) => c.country)).size}
            </div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {featuredClubs.length}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </Card>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search clubs, cities, or amenities..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden h-12">
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <ClubFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block lg:col-span-1">
          <div className="sticky top-4">
            <ClubFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="lg:col-span-3 space-y-8">
          {filteredClubs.length === 0 ? (
            <Card className="p-12 text-center">
              <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <>
              {/* Featured Clubs */}
              {featuredClubs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold">Featured Clubs</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredClubs.map((club) => (
                      <ClubCard
                        key={club.id}
                        club={club}
                        onViewDetails={setSelectedClub}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Clubs by City */}
              {Object.entries(clubsByCity)
                .sort(([cityA], [cityB]) => cityA.localeCompare(cityB))
                .map(([city, clubs]) => {
                  const cityFeatured = clubs.filter((c) => c.featured);
                  const cityRegular = clubs.filter((c) => !c.featured);
                  const displayClubs = cityFeatured.length > 0 ? cityRegular : clubs;

                  if (displayClubs.length === 0) return null;

                  return (
                    <div key={city}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{city}</h2>
                        <Badge variant="secondary">{clubs.length} clubs</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {displayClubs.map((club) => (
                          <ClubCard
                            key={club.id}
                            club={club}
                            onViewDetails={setSelectedClub}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>

      {/* Club Detail Modal */}
      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
      />
    </div>
  );
};
