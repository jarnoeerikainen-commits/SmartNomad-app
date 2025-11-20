import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SecurityService } from '@/types/securityServices';
import { Shield, Star, Globe, Clock, DollarSign, Phone, ExternalLink } from 'lucide-react';
import { VERIFICATION_BADGES } from '@/data/securityServicesData';

interface SecurityServiceCardProps {
  service: SecurityService;
  onViewDetails: (service: SecurityService) => void;
}

const SecurityServiceCard: React.FC<SecurityServiceCardProps> = ({ service, onViewDetails }) => {
  const getServiceTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getCoverageColor = (coverage: string) => {
    switch (coverage) {
      case 'global': return 'bg-primary/10 text-primary';
      case 'regional': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-border/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(service.rating.overall)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                {service.rating.overall}/5
              </span>
              <span className="text-sm text-muted-foreground">
                ({service.rating.expatRating}/5 expat rating)
              </span>
            </div>

            {/* Service Types */}
            <div className="flex flex-wrap gap-2 mb-3">
              {service.type.slice(0, 3).map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {getServiceTypeLabel(type)}
                </Badge>
              ))}
              {service.type.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.type.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Coverage Badge */}
          <Badge className={getCoverageColor(service.coverage)}>
            <Globe className="h-3 w-3 mr-1" />
            {service.coverage.charAt(0).toUpperCase() + service.coverage.slice(1)}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>

        {/* Pricing & Response */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Daily Rate</p>
              <p className="text-sm font-semibold text-foreground">
                {service.pricing.currency} {service.pricing.daily.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Response</p>
              <p className="text-sm font-semibold text-foreground">{service.responseTime}</p>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-2">
          {service.verification.licensed && (
            <Badge variant="secondary" className="text-xs">
              {VERIFICATION_BADGES.licensed.icon} {VERIFICATION_BADGES.licensed.label}
            </Badge>
          )}
          {service.verification.insured && (
            <Badge variant="secondary" className="text-xs">
              {VERIFICATION_BADGES.insured.icon} {VERIFICATION_BADGES.insured.label}
            </Badge>
          )}
          {service.verification.expatSpecialist && (
            <Badge variant="secondary" className="text-xs">
              {VERIFICATION_BADGES.expatSpecialist.icon} {VERIFICATION_BADGES.expatSpecialist.label}
            </Badge>
          )}
          {service.responseTime.toLowerCase().includes('24/7') && (
            <Badge variant="destructive" className="text-xs">
              {VERIFICATION_BADGES.emergencyResponse.icon} {VERIFICATION_BADGES.emergencyResponse.label}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(service)}
            className="flex-1"
            variant="default"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(service.website, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`tel:${service.contact.emergency}`, '_blank')}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SecurityServiceCard;
