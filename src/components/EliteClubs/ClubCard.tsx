import React from 'react';
import { EliteClub } from '@/types/eliteClub';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, DollarSign, Clock, Star, Sparkles } from 'lucide-react';

interface ClubCardProps {
  club: EliteClub;
  onViewDetails: (club: EliteClub) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onViewDetails }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'Invitation Only':
        return 'destructive';
      case 'Application':
        return 'default';
      case 'Corporate':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {club.name}
              </h3>
              {club.featured && (
                <Sparkles className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{club.city}, {club.country}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(club.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                {club.rating}
              </span>
            </div>
          </div>
          <Badge variant={getMembershipTypeColor(club.membership.type)}>
            {club.membership.type}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {club.type.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {club.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{formatPrice(club.membership.price.annual)}/year</div>
              <div className="text-xs text-muted-foreground">
                Init: {formatPrice(club.membership.price.initiation)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{club.membership.waitlist} months</div>
              <div className="text-xs text-muted-foreground">Waitlist</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {club.amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {club.amenities.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{club.amenities.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(club)}
            className="flex-1"
            variant="default"
          >
            View Details
          </Button>
          <Button
            onClick={() => window.open(club.website, '_blank')}
            variant="outline"
            size="icon"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
