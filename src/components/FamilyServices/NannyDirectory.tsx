import { useState } from 'react';
import { useFamilyServicesSearch } from '@/hooks/useFamilyServicesSearch';
import { FamilyService } from '@/types/familyServices';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';
import { ServiceFilters } from './ServiceFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Baby, Shield, Star, Globe2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const NannyDirectory = () => {
  const { t } = useLanguage();
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    filteredServices,
    totalServices
  } = useFamilyServicesSearch();

  const [selectedService, setSelectedService] = useState<FamilyService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetails = (service: FamilyService) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Baby className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Nanny & Family Services</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Trusted childcare and family support services for expat families worldwide
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">100% Verified</p>
              <p className="text-xs text-muted-foreground">Background checked</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">4.7+ Rating</p>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Globe2 className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">100+ Cities</p>
              <p className="text-xs text-muted-foreground">Global coverage</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Baby className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Expat Focused</p>
              <p className="text-xs text-muted-foreground">International families</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search by service name, city, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ServiceFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="lg:col-span-3">
          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> of{' '}
              <span className="font-semibold text-foreground">{totalServices}</span> services
            </p>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Baby className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />

      {/* Safety Notice */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Safety & Verification</h3>
              <p className="text-sm text-muted-foreground">
                All listed services have been verified for background checks and references. However, we recommend conducting your own due diligence, including personal interviews, trial periods, and checking local references before making a final decision. SmartNomad provides directory services only and does not employ or endorse specific caregivers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
