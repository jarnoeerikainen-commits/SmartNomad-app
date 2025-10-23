import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Shield, CheckCircle, Globe, Phone, Mail, AlertCircle } from 'lucide-react';
import { sampleProviders } from '@/data/localServicesData';
import { ServiceProvider } from '@/types/localServices';

interface ProviderSearchListProps {
  selectedCity: string;
  searchQuery: string;
}

const ProviderSearchList = ({ selectedCity, searchQuery }: ProviderSearchListProps) => {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Filter providers based on city and search query
  const filteredProviders = sampleProviders.filter(provider => {
    const inCity = provider.cities.includes(selectedCity);
    const matchesSearch = searchQuery === '' ||
      provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return inCity && matchesSearch;
  });

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{provider.businessName}</CardTitle>
              {provider.verificationStatus === 'verified' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            <CardDescription>{provider.description}</CardDescription>
          </div>
          {provider.availableNow && (
            <Badge variant="default" className="bg-green-600">
              Available Now
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{provider.rating}</span>
          </div>
          <span className="text-muted-foreground">
            ({provider.reviewCount} reviews)
          </span>
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-2">
          {provider.insuranceVerified && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Insured
            </Badge>
          )}
          {provider.backgroundChecked && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Background Checked
            </Badge>
          )}
          {provider.emergencyService && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              24/7 Emergency
            </Badge>
          )}
        </div>

        {/* Response Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Response time: ~{provider.responseTimeMinutes} minutes</span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Languages: {provider.languages.join(', ')}
          </span>
        </div>

        {/* Pricing */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Starting from</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                {provider.pricingModel.currency} ${provider.pricingModel.basePrice}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {provider.pricingModel.priceUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 pt-2 border-t">
          {provider.contactInfo.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{provider.contactInfo.phone}</span>
            </div>
          )}
          {provider.contactInfo.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{provider.contactInfo.email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" onClick={() => setSelectedProvider(provider)}>
            View Details
          </Button>
          <Button>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filter Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {filteredProviders.length} verified providers in {selectedCity}
              </p>
              <p className="text-sm text-muted-foreground">
                All providers rated 4.0★ or higher
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Verified Only
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Provider List */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              No providers found in {selectedCity}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? `Try a different search term or ` : ''}Select another city to see available providers
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Info Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                All providers are verified with background checks, insurance verification, and minimum 4.0★ ratings.
                If you're not satisfied with the service, our 24/7 support team is here to help.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSearchList;
