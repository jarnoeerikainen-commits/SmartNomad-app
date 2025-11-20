import React, { useState } from 'react';
import { Shield, AlertCircle, Phone } from 'lucide-react';
import { useSecuritySearch } from '@/hooks/useSecuritySearch';
import SecurityServiceCard from './SecurityServiceCard';
import SecurityServiceDetailModal from './SecurityServiceDetailModal';
import SecurityFilters from './SecurityFilters';
import { SecurityService } from '@/types/securityServices';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const SecurityDirectory: React.FC = () => {
  const [selectedService, setSelectedService] = useState<SecurityService | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const {
    filters,
    updateFilter,
    clearFilters,
    servicesByCity,
    filteredCount,
    totalServices
  } = useSecuritySearch();

  const handleViewDetails = (service: SecurityService) => {
    setSelectedService(service);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Private Protection Services</h1>
        </div>
        <p className="text-muted-foreground">
          Elite executive protection, asset security, and crisis management for global citizens
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="mb-6 border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-destructive">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              For immediate emergency assistance, contact your local security provider's 24/7 hotline
            </span>
            <Button variant="destructive" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalServices} security services
          {filters.query && ` for "${filters.query}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SecurityFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Services List */}
        <div className="lg:col-span-3 space-y-8">
          {servicesByCity.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            servicesByCity.map(([city, services]) => (
              <div key={city}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{city}</h2>
                  <span className="text-sm text-muted-foreground">
                    ({services.length} {services.length === 1 ? 'service' : 'services'})
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <SecurityServiceCard
                      key={service.id}
                      service={service}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <SecurityServiceDetailModal
        service={selectedService}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
};

export default SecurityDirectory;
