import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BusinessCenter } from '@/types/businessCenter';
import { MapPin, Star, Phone, ExternalLink, Navigation } from 'lucide-react';
import { SERVICE_LABELS } from '@/data/businessCentersData';

interface BusinessCenterCardProps {
  center: BusinessCenter & { distance?: number };
}

export const BusinessCenterCard = ({ center }: BusinessCenterCardProps) => {
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.lat},${center.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleVisitWebsite = () => {
    if (center.website) {
      window.open(center.website, '_blank');
    }
  };

  const handleCall = () => {
    if (center.phone) {
      window.location.href = `tel:${center.phone}`;
    }
  };

  const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  };

  return (
    <Card className="hover:shadow-medium transition-all duration-200 animate-fade-in">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {center.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{center.address}</span>
            </div>
          </div>
          {center.distance !== undefined && (
            <Badge variant="outline" className="ml-2 shrink-0">
              {formatDistance(center.distance)}
            </Badge>
          )}
        </div>

        {/* Rating and Status */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{center.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({center.reviewCount} reviews)
            </span>
          </div>
          {center.isOpenNow !== undefined && (
            <Badge
              variant={center.isOpenNow ? 'default' : 'secondary'}
              className={center.isOpenNow ? 'bg-green-500' : 'bg-gray-500'}
            >
              {center.isOpenNow ? '🟢 Open Now' : '🔴 Closed'}
            </Badge>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {center.services.map(service => (
            <Badge key={service} variant="secondary" className="text-xs">
              {SERVICE_LABELS[service]}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {center.description}
        </p>

        {/* Opening Hours */}
        {center.openingHours && (
          <p className="text-xs text-muted-foreground mb-4">
            📅 {center.openingHours}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleGetDirections}
            className="flex-1 min-w-[120px]"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </Button>
          {center.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisitWebsite}
              className="flex-1 min-w-[120px]"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Website
            </Button>
          )}
          {center.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex-1 min-w-[120px]"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
