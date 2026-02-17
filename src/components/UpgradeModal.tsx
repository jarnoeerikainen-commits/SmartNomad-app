import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Home, X } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';
import { PRICING_TIERS } from '@/components/PricingCard';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onUpgrade: (tier: string) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, subscription, onUpgrade }) => {
  const { toast } = useToast();

  const handleSelectPlan = (tierId: string) => {
    if (tierId === subscription.tier) return;
    onClose();
    requestAnimationFrame(() => {
      onUpgrade(tierId);
      const tierName = PRICING_TIERS.find(t => t.id === tierId)?.name || tierId;
      toast({
        title: "Plan Updated!",
        description: `Successfully switched to ${tierName} plan.`,
      });
    });
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium': return <Crown className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            Choose Your Plan
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {PRICING_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative transition-all hover:shadow-lg ${
                tier.popular ? 'border-primary shadow-large ring-2 ring-primary/20' : 'border-border'
              } ${subscription.tier === tier.id ? 'bg-accent/20 border-accent' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-medium">
                    ⭐ Recommended
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center mb-3">
                  {getTierIcon(tier.id)}
                </div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  {tier.price === 0 ? 'Free' : `$${tier.price}/mo`}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2">
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={subscription.tier === tier.id}
                  className={`w-full ${tier.popular ? 'gradient-success' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {subscription.tier === tier.id ? '✓ Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
