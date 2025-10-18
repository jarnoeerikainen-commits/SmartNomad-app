
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Star, MapPin, Loader2, Shield, Sparkles } from 'lucide-react';
import { Offer } from '@/services/OffersService';
import { TrustBadge, TrustRating, TrustScore } from '@/components/ui/trust-badge';

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
  serviceType: string;
  location: string;
  isLoading: boolean;
}

const OffersModal: React.FC<OffersModalProps> = ({
  isOpen,
  onClose,
  offers,
  serviceType,
  location,
  isLoading
}) => {
  const formatServiceType = (type: string) => {
    switch (type) {
      case 'insurance': return 'Travel Insurance';
      case 'hotels': return 'Hotel Booking';
      case 'restaurants': return 'Restaurants';
      case 'vip': return 'VIP Services';
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {formatServiceType(serviceType)} Offers in {location}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Searching for the best offers...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow border-2 border-primary/10">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with badges and verification */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="font-semibold text-lg flex-1 leading-tight">
                                {offer.title}
                              </h3>
                              {offer.verified && (
                                <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            
                            {/* Trust badges */}
                            {offer.badges && offer.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {offer.badges.map((badge, idx) => (
                                  <TrustBadge key={idx} badge={badge as any} />
                                ))}
                              </div>
                            )}
                            
                            <p className="text-sm text-muted-foreground mt-1">
                              {offer.description}
                            </p>
                          </div>
                          
                          {/* Rating and trust score */}
                          <div className="flex flex-col gap-2 items-end">
                            {offer.rating && (
                              <TrustRating 
                                rating={offer.rating} 
                                reviews={offer.reviews}
                                showReviews={true}
                              />
                            )}
                            {offer.trust_score && (
                              <TrustScore score={offer.trust_score} />
                            )}
                          </div>
                        </div>
                        
                        {/* Price and action */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">{offer.price}</span>
                              {offer.originalPrice && (
                                <span className="text-sm line-through text-muted-foreground">
                                  {offer.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              by {offer.provider}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {offer.discount && (
                              <Badge variant="destructive" className="animate-pulse">
                                {offer.discount}
                              </Badge>
                            )}
                            <Button 
                              size="sm"
                              className="gradient-primary shadow-sm"
                              onClick={() => window.open(offer.url, '_blank')}
                            >
                              View Deal
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4 p-8">
                <Shield className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="font-semibold mb-2">
                    No verified offers found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SmartNomad Trust AI filters results to show only verified, high-quality services with ratings ≥ 4.0★
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  We're searching top providers including TripAdvisor, Booking.com, and verified local partners.
                  Check back soon!
                </p>
              </div>
            )}

            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">SmartNomad Trust AI</p>
                    <p className="text-xs text-muted-foreground">
                      All results filtered for verified quality (≥4.0★), trusted sources (Google, TripAdvisor, Booking.com),
                      and authentic reviews. We prioritize local providers and sustainable practices.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Sources:</strong> TripAdvisor, Booking.com, Google Reviews, verified local partners in {location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
