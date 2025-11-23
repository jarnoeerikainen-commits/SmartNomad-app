import { MovingRequest, MovingQuote } from '@/types/movingServices';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, TrendingUp, DollarSign, Clock, Shield, CheckCircle, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteComparisonProps {
  moveRequest: MovingRequest;
  quotes: MovingQuote[];
  onClose: () => void;
}

export function QuoteComparison({ moveRequest, quotes, onClose }: QuoteComparisonProps) {
  const handleAcceptQuote = (quote: MovingQuote) => {
    toast.success(`Quote accepted from ${quote.providerName}!`, {
      description: 'The moving company will contact you within 24 hours to confirm details.'
    });
    onClose();
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (a.aiRecommendation === 'best-value') return -1;
    if (b.aiRecommendation === 'best-value') return 1;
    return a.totalCost - b.totalCost;
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Quote Comparison
          </DialogTitle>
          <DialogDescription>
            {moveRequest.route.from.city}, {moveRequest.route.from.country} → {moveRequest.route.to.city}, {moveRequest.route.to.country}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {sortedQuotes.map((quote) => (
            <Card 
              key={quote.id}
              className={quote.aiRecommendation === 'best-value' ? 'border-primary shadow-lg' : ''}
            >
              {quote.aiRecommendation === 'best-value' && (
                <div className="bg-gradient-primary px-4 py-1.5">
                  <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
                    <Sparkles className="h-3 w-3" />
                    AI Recommended - Best Value
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{quote.providerName}</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{quote.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {quote.estimatedDuration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${quote.totalCost.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">{quote.currency}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    {quote.breakdown.shipping && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">${quote.breakdown.shipping.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.breakdown.packing && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Packing</span>
                        <span className="font-medium">${quote.breakdown.packing.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.breakdown.insurance && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insurance</span>
                        <span className="font-medium">${quote.breakdown.insurance.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.breakdown.customs && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customs</span>
                        <span className="font-medium">${quote.breakdown.customs.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.breakdown.storage && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="font-medium">${quote.breakdown.storage.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Included Services */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Included Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quote.includedServices.map((service, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Excluded Services */}
                {quote.excludedServices.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        Not Included
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {quote.excludedServices.map((service, index) => (
                          <Badge key={index} variant="outline" className="gap-1 text-muted-foreground">
                            <X className="h-3 w-3" />
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {quote.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Additional Notes
                      </h4>
                      <p className="text-sm text-muted-foreground">{quote.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAcceptQuote(quote)}
                    className="flex-1 gap-2"
                    variant={quote.aiRecommendation === 'best-value' ? 'default' : 'outline'}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept Quote
                  </Button>
                  <Button variant="outline">
                    Contact Provider
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Quote valid until {new Date(quote.validUntil).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
