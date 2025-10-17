import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Building, Users, GraduationCap, Home, X } from 'lucide-react';
import { PricingTier, Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onUpgrade: (tier: string) => void;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'monthly',
    description: 'Essential travel tracking for casual nomads',
    userLimit: '1 user',
    features: [
      'Basic country tracking',
      'Manual trip logging',
      'Basic dashboard',
      'Emergency contacts',
      'Limited document storage (5 files)',
      'Community access',
      'No AI assistance'
    ]
  },
  {
    id: 'premium-lite',
    name: 'Premium Lite',
    price: 1,
    billing: 'monthly',
    description: 'Perfect starter plan for budget-conscious travelers',
    userLimit: '1 user',
    popular: true,
    features: [
      'All Free features',
      'Tax day calculators',
      'Basic tax reports',
      '20 AI requests/month',
      'Schengen calculator',
      'US & Canada tax trackers',
      'Document storage (50 files)',
      'Email support',
      'Visa tracking (up to 3)',
      'Health requirements tracker'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2.99,
    billing: 'monthly',
    description: 'Complete solution for serious digital nomads',
    userLimit: '1 user',
    features: [
      'All Premium Lite features',
      'Advanced tax reports & exports',
      'Unlimited passport tracking',
      'Unlimited visa tracking',
      '100 AI requests/month',
      'Smart alerts & notifications',
      'Weather integration',
      'Currency tracking',
      'Expense management',
      'Document storage (500 files)',
      'PDF report generation',
      'Priority email support',
      'Travel insurance finder',
      'Local community access'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 9.90,
    billing: 'monthly',
    description: 'Ultimate plan for professional nomads & wealthy travelers',
    userLimit: '1 user',
    features: [
      'All Premium features',
      '500 AI requests/month',
      'Advanced AI travel assistant',
      'Tax & wealth management tools',
      'Unlimited document storage',
      'Investor document generator',
      'Multi-year tax planning',
      'Scenario planner',
      'Priority 24/7 support',
      'Dedicated account manager',
      'Custom tax consultation',
      'VIP travel services',
      'Exclusive partner discounts',
      'Early access to new features'
    ]
  }
];

const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  subscription, 
  onUpgrade 
}) => {
  const { toast } = useToast();

  const handleSelectPlan = (tierId: string) => {
    if (tierId === subscription.tier) {
      return;
    }
    
    onClose();
    
    requestAnimationFrame(() => {
      onUpgrade(tierId);
      
      const tierName = PRICING_TIERS.find(t => t.id === tierId)?.name || tierId;
      toast({
        title: "Plan Upgraded!",
        description: `Successfully upgraded to ${tierName} plan. All features are now active!`,
      });
    });
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium-lite': return <Users className="w-5 h-5" />;
      case 'premium': return <Building className="w-5 h-5" />;
      case 'diamond': return <Crown className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const formatPrice = (tier: PricingTier) => {
    if (tier.price === 0) return 'Free';
    if (tier.billing === 'yearly') return `$${tier.price}/year`;
    if (tier.yearlyPrice) {
      return (
        <div className="flex flex-col">
          <span>${tier.price}/month</span>
          <span className="text-sm text-green-600">or ${tier.yearlyPrice}/year</span>
        </div>
      );
    }
    return `$${tier.price}/month`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            Choose Your Perfect Plan
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {PRICING_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative transition-all hover:shadow-lg ${
                tier.popular ? 'border-primary shadow-large ring-2 ring-primary/20' : 'border-border'
              } ${
                subscription.tier === tier.id ? 'bg-accent/20 border-accent' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-medium">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center mb-3">
                  {getTierIcon(tier.id)}
                </div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="text-2xl font-bold mt-2">
                  {formatPrice(tier)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                <p className="text-xs text-primary font-medium mt-1">{tier.userLimit}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-xs">
                  {tier.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.features.length > 6 && (
                    <li className="text-primary font-medium text-center pt-2">
                      +{tier.features.length - 6} more features
                    </li>
                  )}
                </ul>
                <Button 
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={subscription.tier === tier.id}
                  className={`w-full ${tier.popular ? 'gradient-success' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                  size="sm"
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
