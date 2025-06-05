
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Crown, Building, Users, X } from 'lucide-react';
import { PricingTier, Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

interface PricingCardProps {
  subscription: Subscription;
  onUpgrade: (tier: string) => void;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'monthly',
    description: 'Basic tracking for casual travelers',
    features: [
      'Track up to 3 countries',
      'Basic location tracking',
      'Manual day counting',
      'Simple alerts'
    ]
  },
  {
    id: 'personal',
    name: 'Personal',
    price: 9.99,
    billing: 'monthly',
    description: 'Perfect for digital nomads and frequent travelers',
    popular: true,
    features: [
      'Unlimited country tracking',
      'Automatic location detection',
      'Tax residence tracking',
      'Passport expiry alerts',
      'Visa compliance monitoring',
      'Premium country database',
      'Excel/PDF reports',
      'Cloud backup'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 19.99,
    billing: 'monthly',
    description: 'For business travelers and companies',
    features: [
      'Everything in Personal',
      'Team management (up to 10 users)',
      'Business compliance tracking',
      'Work permit monitoring',
      'Expense tracking integration',
      'Company reporting dashboard',
      'API access',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    billing: 'monthly',
    description: 'For large organizations and agencies',
    features: [
      'Everything in Business',
      'Unlimited team members',
      'Custom integrations',
      'White-label options',
      'Advanced analytics',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom compliance rules'
    ]
  }
];

const PricingCard: React.FC<PricingCardProps> = ({ subscription, onUpgrade }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = (tierId: string) => {
    onUpgrade(tierId);
    setIsOpen(false);
    toast({
      title: "Upgrade Initiated",
      description: `Upgrading to ${PRICING_TIERS.find(t => t.id === tierId)?.name} plan...`,
    });
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'business': return <Building className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const currentTier = PRICING_TIERS.find(t => t.id === subscription.tier) || PRICING_TIERS[0];

  return (
    <>
      <Card className="w-64 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTierIcon(subscription.tier)}
              <CardTitle className="text-sm font-medium text-blue-700">
                {currentTier.name}
              </CardTitle>
            </div>
            {subscription.tier !== 'free' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-blue-800 mb-1">
            ${currentTier.price}
            <span className="text-sm font-normal text-blue-600">/month</span>
          </div>
          <p className="text-xs text-blue-600 mb-3">{currentTier.description}</p>
          <Button 
            onClick={() => setIsOpen(true)}
            className="w-full gradient-success text-white hover:opacity-90"
            size="sm"
          >
            {subscription.tier === 'free' ? 'Upgrade' : 'Change Plan'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Choose Your Plan
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {PRICING_TIERS.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative ${tier.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'} ${subscription.tier === tier.id ? 'bg-blue-50' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center mb-2">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${tier.price}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={subscription.tier === tier.id}
                    className={`w-full ${tier.popular ? 'gradient-success text-white' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {subscription.tier === tier.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingCard;
