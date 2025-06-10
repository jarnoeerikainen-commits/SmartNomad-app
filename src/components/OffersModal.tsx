
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Star, MapPin, Loader2 } from 'lucide-react';
import { Offer } from '@/services/OffersService';

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg text-gray-800 leading-tight">
                            {offer.title}
                          </h3>
                          {offer.discount && (
                            <Badge className="bg-green-100 text-green-800 ml-2">
                              {offer.discount}
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm">{offer.description}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-blue-600">{offer.price}</span>
                          {offer.originalPrice && (
                            <span className="text-sm line-through text-gray-400">
                              {offer.originalPrice}
                            </span>
                          )}
                        </div>

                        {offer.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{offer.rating}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">via {offer.provider}</span>
                          <Button 
                            size="sm" 
                            onClick={() => window.open(offer.url, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            View Deal
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No offers found for this location.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try enabling location services or check back later.
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Sources searched:</strong> Multiple providers including booking platforms, 
                comparison sites, and direct suppliers for {location}.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
