import React from 'react';
import { MapPin, Clock, Eye, Heart, Sparkles, TrendingUp, Tag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MarketplaceItem } from '@/types/marketplace';
import { CATEGORY_INFO, CONDITION_INFO } from '@/types/marketplace';
import TrustBadge from '@/components/trust/TrustBadge';
import { getDemoTierForId } from '@/utils/demoTrust';

interface ItemCardProps {
  item: MarketplaceItem;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const categoryInfo = CATEGORY_INFO[item.category];
  const conditionInfo = CONDITION_INFO[item.condition];

  const urgencyColor = {
    flexible: 'secondary',
    moderate: 'default',
    urgent: 'destructive'
  }[item.availability.urgency] as 'secondary' | 'default' | 'destructive';

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {/* Urgency Badge */}
        {item.availability.urgency === 'urgent' && (
          <Badge 
            variant={urgencyColor}
            className="absolute top-2 right-2 animate-pulse"
          >
            🔥 Urgent
          </Badge>
        )}

        {/* AI Badge */}
        {item.aiFeatures.aiGenerated && (
          <Badge 
            variant="secondary"
            className="absolute top-2 left-2 bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        )}

        {/* Condition Badge */}
        <Badge 
          variant="secondary"
          className="absolute bottom-2 left-2"
        >
          {conditionInfo.label}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryInfo.emoji}</span>
          <span className="text-xs text-muted-foreground">{categoryInfo.label}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
          {item.title}
        </h3>

        {/* Price with AI Confidence */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            €{item.price.amount}
          </span>
          {item.price.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{item.price.originalPrice}
            </span>
          )}
          {item.price.priceConfidence && item.price.priceConfidence >= 85 && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              AI Priced
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{item.location.neighborhood}, {item.location.city}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {item.views}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {item.favorites}
          </div>
          {item.offers && item.offers.length > 0 && (
            <div className="flex items-center gap-1 text-primary font-medium">
              <Tag className="h-3 w-3" />
              {item.offers.length}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t flex-col items-stretch gap-2">
        <div className="flex items-center gap-2 w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.seller.photo} />
            <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium truncate">{item.seller.name}</p>
              <TrustBadge tier={getDemoTierForId(item.seller.id)} size="xs" />
            </div>
            <p className="text-xs text-muted-foreground">
              ⭐ {item.seller.rating} • {item.seller.totalSales} sales
            </p>
          </div>
        </div>
        {getDemoTierForId(item.seller.id) === 'unverified' && (
          <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 rounded p-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>Sovereign Hold: seller not verified — Concierge will require manual confirmation before payment.</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
