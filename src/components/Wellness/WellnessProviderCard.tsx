import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WellnessProvider, WELLNESS_CATEGORY_INFO } from '@/types/wellness';
import { Star, ExternalLink, Phone, MapPin, Globe, Zap } from 'lucide-react';

interface WellnessProviderCardProps {
  provider: WellnessProvider;
}

export const WellnessProviderCard: React.FC<WellnessProviderCardProps> = ({ provider }) => {
  const catInfo = WELLNESS_CATEGORY_INFO[provider.category];

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${provider.isHintsa ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-background' : ''}`}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
              {provider.isHintsa && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] shrink-0">
                  <Zap className="w-2.5 h-2.5 mr-0.5" /> PARTNER
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {catInfo.emoji} {catInfo.label}
              </Badge>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {provider.city}, {provider.countryCode}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm text-foreground">{provider.rating}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{provider.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {provider.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {provider.highlights.slice(0, 4).map(h => (
            <Badge key={h} variant="secondary" className="text-[10px] font-normal px-2 py-0.5">
              {h}
            </Badge>
          ))}
          {provider.highlights.length > 4 && (
            <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5">
              +{provider.highlights.length - 4} more
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">{provider.priceRange}</Badge>
            {provider.languages.length > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Globe className="w-3 h-3" />
                {provider.languages.slice(0, 2).join(', ')}
                {provider.languages.length > 2 && ` +${provider.languages.length - 2}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {provider.phone && (
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => window.open(`tel:${provider.phone}`)}>
                <Phone className="w-3.5 h-3.5" />
              </Button>
            )}
            {provider.website && (
              <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" onClick={() => window.open(provider.website, '_blank')}>
                <ExternalLink className="w-3 h-3 mr-1" /> Visit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
