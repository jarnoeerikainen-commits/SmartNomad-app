import React, { useState } from 'react';
import { MapPin, Clock, Eye, Heart, Share2, Flag, Sparkles, TrendingUp, MessageCircle, Tag, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { MarketplaceItem } from '@/types/marketplace';
import { CATEGORY_INFO, CONDITION_INFO } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

interface ItemDetailModalProps {
  item: MarketplaceItem;
  open: boolean;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, open, onClose }) => {
  const { toast } = useToast();
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  
  const categoryInfo = CATEGORY_INFO[item.category];
  const conditionInfo = CONDITION_INFO[item.condition];

  const handleContact = () => {
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${item.seller.name}`,
    });
  };

  const handleFavorite = () => {
    toast({
      title: "Added to Favorites",
      description: "You'll be notified of any price changes",
    });
  };

  const handleSubmitOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast({
        title: "Invalid Offer",
        description: "Please enter a valid offer amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Offer Submitted!",
      description: `Your offer of €${offerAmount} has been sent to the seller`,
    });

    setOfferAmount('');
    setOfferMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{item.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <span className="text-lg">{categoryInfo.emoji}</span>
                {categoryInfo.label} • {conditionInfo.label}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleFavorite}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Flag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.availability.urgency === 'urgent' && (
                <Badge 
                  variant="destructive"
                  className="absolute top-2 right-2 animate-pulse"
                >
                  🔥 Urgent Sale
                </Badge>
              )}
            </div>

            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1).map((image, idx) => (
                  <div key={idx} className="aspect-square rounded overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${item.title} ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Price */}
            <Card className="gradient-card-subtle">
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    €{item.price.amount}
                  </span>
                  {item.price.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      €{item.price.originalPrice}
                    </span>
                  )}
                </div>
                
                {item.aiFeatures.pricingSuggestion && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-Optimized Price
                    </Badge>
                    <span className="text-muted-foreground">
                      {item.price.priceConfidence}% confidence
                    </span>
                  </div>
                )}

                {item.aiFeatures.demandScore && item.aiFeatures.demandScore >= 80 && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    High demand item • Likely to sell fast
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.seller.photo} />
                    <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{item.seller.name}</h4>
                      {item.seller.verified && (
                        <Badge variant="secondary">✓ Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ⭐ {item.seller.rating} rating • {item.seller.totalSales} sales • Responds in {item.seller.responseTime}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.seller.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button 
                    className="w-full gradient-success"
                    size="lg"
                    onClick={handleContact}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contact Seller
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    💬 Safe messaging • No personal info shared until you're ready
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Make an Offer Section */}
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Make an Offer
                  </h3>
                  {item.offers.length > 0 && (
                    <Badge variant="secondary">
                      {item.offers.length} offer{item.offers.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Offer (EUR)</label>
                    <Input
                      type="number"
                      placeholder={`Max: ${item.price.amount}`}
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      max={item.price.amount}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Asking price: €{item.price.amount}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                    <Textarea
                      placeholder="Add a message to strengthen your offer..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSubmitOffer} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Offer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location & Availability */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{item.location.neighborhood}, {item.location.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Available until {item.availability.availableUntil.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{item.views} views • {item.favorites} favorites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Offers */}
        {item.offers.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Offers</h3>
              <div className="space-y-3">
                {item.offers.slice(0, 5).map((offer) => (
                  <div key={offer.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={offer.buyerPhoto} />
                      <AvatarFallback>{offer.buyerName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{offer.buyerName}</p>
                        <Badge variant="outline" className="shrink-0">
                          €{offer.amount}
                        </Badge>
                      </div>
                      {offer.message && (
                        <p className="text-sm text-muted-foreground mt-1">{offer.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(offer.createdAt).toLocaleDateString()} at {new Date(offer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Description */}
        <div className="space-y-4 mt-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              Description
              {item.aiFeatures.aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Specifications */}
          {(item.dimensions || item.weight) && (
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {item.dimensions && (
                  <div>
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="ml-2">{item.dimensions}</span>
                  </div>
                )}
                {item.weight && (
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="ml-2">{item.weight}kg</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="ml-2">{conditionInfo.label}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="ml-2">{item.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
