
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Home } from 'lucide-react';
import { Subscription, PricingTier } from '@/types/subscription';

interface PricingCardProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'monthly',
    description: 'Full-featured travel tracking for digital nomads',
    userLimit: '1 user',
    features: [
      '1,000 AI requests/month',
      'Country tracking',
      'Trip logging',
      'Dashboard & analytics',
      'Emergency contacts',
      'Document storage (5 files)',
      'Community access',
      'Schengen calculator',
      'US & Canada tax trackers',
      'Visa & passport tracking',
      'Health requirements tracker',
      'Weather integration',
      'Currency tracking'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    billing: 'monthly',
    description: 'Everything in Free plus advanced tax & AI features',
    userLimit: '1 user',
    popular: true,
    features: [
      'All Free features',
      '10,000 AI requests/month',
      'Advanced tax reports & exports',
      'PDF report generation',
      'Multi-year tax planning',
      'Scenario planner',
      'Tax & wealth management tools',
      'Unlimited document storage',
      'Smart alerts & notifications',
      'Expense management',
      'Priority 24/7 support',
      'Exclusive partner discounts',
      'Early access to new features'
    ]
  }
];

const PricingCard: React.FC<PricingCardProps> = ({ subscription, onUpgradeClick }) => {
  const currentTier = PRICING_TIERS.find(t => t.id === subscription.tier) || PRICING_TIERS[0];

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium': return <Crown className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
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
          {subscription.tier === 'premium' && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-2xl font-bold text-primary mb-1">
            {currentTier.price === 0 ? 'Free' : `$${currentTier.price}/month`}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{currentTier.description}</p>
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
