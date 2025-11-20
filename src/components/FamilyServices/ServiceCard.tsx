import { FamilyService } from '@/types/familyServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Heart, 
  Globe2, 
  Languages, 
  Star, 
  DollarSign,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';

interface ServiceCardProps {
  service: FamilyService;
  onViewDetails: (service: FamilyService) => void;
}

export const ServiceCard = ({ service, onViewDetails }: ServiceCardProps) => {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return currency;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Globe2 className="h-4 w-4" />
              <span>{service.cities.slice(0, 2).join(', ')}</span>
              {service.cities.length > 2 && <span>+{service.cities.length - 2} more</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{service.rating.overall}</span>
              <span className="text-sm text-muted-foreground">({service.rating.reviewCount})</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>

        {/* Service Types */}
        <div className="flex flex-wrap gap-2">
          {service.type.slice(0, 3).map((type, index) => (
            <Badge key={index} variant="secondary">
              {type}
            </Badge>
          ))}
          {service.type.length > 3 && (
            <Badge variant="outline">+{service.type.length - 3}</Badge>
          )}
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-2">
          {service.verification.backgroundChecks && (
            <Badge variant="default" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Background Checked
            </Badge>
          )}
          {service.verification.firstAidCertified && (
            <Badge variant="default" className="text-xs">
              <Heart className="h-3 w-3 mr-1" />
              First Aid
            </Badge>
          )}
          {service.verification.expatExperience && (
            <Badge variant="default" className="text-xs">
              <Globe2 className="h-3 w-3 mr-1" />
              Expat Specialist
            </Badge>
          )}
          {service.verification.multilingual && (
            <Badge variant="default" className="text-xs">
              <Languages className="h-3 w-3 mr-1" />
              Multilingual
            </Badge>
          )}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 text-sm">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {service.languages.slice(0, 3).join(', ')}
            {service.languages.length > 3 && ` +${service.languages.length - 3}`}
          </span>
        </div>

        {/* Pricing */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Monthly Rate</span>
            <span className="text-xl font-bold">
              {getCurrencySymbol(service.pricing.currency)}{service.pricing.monthly.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hourly: {getCurrencySymbol(service.pricing.currency)}{service.pricing.hourly}</span>
            <span>Daily: {getCurrencySymbol(service.pricing.currency)}{service.pricing.daily}</span>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(service.website, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Website
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewDetails(service)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>

        {/* Quick Contact */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <a href={`mailto:${service.contact.email}`} className="flex items-center gap-1 hover:text-primary">
            <Mail className="h-3 w-3" />
            Email
          </a>
          <a href={`tel:${service.contact.phone}`} className="flex items-center gap-1 hover:text-primary">
            <Phone className="h-3 w-3" />
            Call
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
