
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Building, GraduationCap, Home, Users } from 'lucide-react';
import { Subscription, PricingTier } from '@/types/subscription';

interface PricingCardProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
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
      '100 AI requests/month',
      'Schengen calculator',
      'US & Canada tax trackers',
      'Document storage (50 files)',
      'Email support',
      'Unlimited visa tracking',
      'Unlimited passport tracking',
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
      '500 AI requests/month',
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
      '2000 AI requests/month',
      'Advanced AI travel assistant',
      'Tax & wealth management tools',
      'Unlimited document storage',
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

const PricingCard: React.FC<PricingCardProps> = ({ subscription, onUpgradeClick }) => {
  const currentTier = PRICING_TIERS.find(t => t.id === subscription.tier) || PRICING_TIERS[0];

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium-lite': return <Users className="w-5 h-5" />;
      case 'premium': return <Building className="w-5 h-5" />;
      case 'diamond': return <Crown className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const formatPrice = (currentTier: typeof PRICING_TIERS[0]) => {
    if (currentTier.price === 0) return 'Free';
    if (currentTier.billing === 'yearly') return `$${currentTier.price}/year`;
    if (currentTier.yearlyPrice) {
      return `$${currentTier.price}/mo or $${currentTier.yearlyPrice}/yr`;
    }
    return `$${currentTier.price}/month`;
  };

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTierIcon(subscription.tier)}
            <CardTitle className="text-base font-semibold">
              {currentTier.name} Plan
            </CardTitle>
          </div>
          {subscription.tier !== 'free' && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-2xl font-bold text-primary mb-1">
            {formatPrice(currentTier)}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{currentTier.description}</p>
          <p className="text-xs text-primary font-medium">{currentTier.userLimit}</p>
        </div>
        
        {currentTier.features && currentTier.features.length > 0 && (
          <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2">
            <ul className="space-y-1.5 text-xs">
              {currentTier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          onClick={onUpgradeClick}
          className="w-full gradient-success hover:opacity-90"
          size="sm"
        >
          {subscription.tier === 'free' ? 'Upgrade Now' : 'Change Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
