
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Crown, Building, Users, X, GraduationCap, Home } from 'lucide-react';
import { PricingTier, Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

interface PricingCardProps {
  subscription: Subscription;
  onUpgrade: (tier: string) => void;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Basic',
    price: 0,
    billing: 'monthly',
    description: 'Basic tracking for casual travelers',
    userLimit: '1 user',
    features: [
      '✈️ Single visa tracking',
      '📊 Basic day counting',
      '📍 Manual location tracking',
      '⚠️ Simple alerts',
      '🗂️ Basic export options'
    ]
  },
  {
    id: 'student',
    name: 'Student',
    price: 0.99,
    billing: 'yearly',
    description: 'Perfect for students studying abroad',
    userLimit: '1 student',
    features: [
      '🎓 Multiple visa types (Student, Tourist, Transit)',
      '🏫 University compliance tracking',
      '📅 Academic calendar integration',
      '📖 Study visa monitoring',
      '🌍 Unlimited country tracking',
      '📧 Study abroad alerts',
      '🆔 Student ID verification',
      '📊 Academic reports'
    ]
  },
  {
    id: 'business-individual',
    name: 'Business Individual',
    price: 9.99,
    billing: 'monthly',
    description: 'Solo entrepreneur features',
    userLimit: '1 business user',
    features: [
      '💼 Multiple visa types (Business, Tourist, Work)',
      '🏢 Work permit tracking',
      '💰 Tax residence monitoring',
      '📊 Business travel analytics',
      '📄 Professional reporting',
      '☁️ Cloud backup',
      '🔗 Calendar integrations',
      '📱 Mobile app access'
    ]
  },
  {
    id: 'personal',
    name: 'Personal',
    price: 2.99,
    yearlyPrice: 19.99,
    billing: 'monthly',
    description: 'Perfect for digital nomads and frequent travelers',
    popular: true,
    userLimit: '1 user',
    features: [
      '🌐 All visa types (Tourist, Business, Transit, Digital Nomad)',
      '🤖 Automatic location detection',
      '💰 Tax residence tracking',
      '📋 Passport expiry alerts',
      '✅ Visa compliance monitoring',
      '🗃️ Premium country database',
      '📊 Excel/PDF reports',
      '☁️ Cloud backup',
      '🔄 Easy visa type switching'
    ]
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 6.99,
    yearlyPrice: 49.99,
    billing: 'monthly',
    description: 'For families and small teams traveling together',
    userLimit: 'Up to 12 people',
    features: [
      '👨‍👩‍👧‍👦 All visa types for family members',
      '🏠 Family dashboard',
      '🗺️ Shared trip planning',
      '👥 Group compliance tracking',
      '📘 Multiple passport management',
      '🤝 Family visa coordination',
      '💸 Shared expense tracking',
      '🚨 Emergency contact system',
      '🔄 Individual visa preferences'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 49.99,
    yearlyPrice: 399,
    billing: 'monthly',
    description: 'For companies with traveling employees',
    userLimit: 'Unlimited users',
    features: [
      '🏢 All visa types for employees',
      '👥 Unlimited team members',
      '📊 Advanced compliance dashboard',
      '💼 Work permit tracking',
      '💰 Corporate tax optimization',
      '🔗 HR integration tools',
      '📋 Audit trail reports',
      '🎯 Dedicated account manager',
      '🔌 API access',
      '🔐 SSO integration',
      '⚙️ Custom visa workflows'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    billing: 'monthly',
    description: 'For large organizations and agencies',
    userLimit: 'Unlimited + consulting',
    features: [
      '🌍 All global visa types & custom rules',
      '🏢 Custom compliance frameworks',
      '🏷️ White-label solutions',
      '🌐 Multi-country operations',
      '🏛️ Government reporting',
      '🔗 Custom integrations',
      '🔧 24/7 priority support',
      '⚖️ Legal compliance consulting',
      '🛡️ Data sovereignty options',
      '🎛️ Advanced visa management',
      '📈 Predictive compliance analytics'
    ]
  }
];

const PricingCard: React.FC<PricingCardProps> = ({ subscription, onUpgrade }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = (tierId: string) => {
    onUpgrade(tierId);
    setIsOpen(false);
    
    // Close the modal and return to main app
    setTimeout(() => {
      // This will trigger parent components to close their modals
      const event = new CustomEvent('planUpgraded', { detail: { tier: tierId } });
      window.dispatchEvent(event);
    }, 100);
    
    toast({
      title: "Plan Upgraded!",
      description: `Successfully upgraded to ${PRICING_TIERS.find(t => t.id === tierId)?.name} plan. All features are now active!`,
    });
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'business-individual': return <Building className="w-5 h-5" />;
      case 'family': return <Home className="w-5 h-5" />;
      case 'business': return <Building className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const currentTier = PRICING_TIERS.find(t => t.id === subscription.tier) || PRICING_TIERS[0];

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
            {formatPrice(currentTier)}
          </div>
          <p className="text-xs text-blue-600 mb-1">{currentTier.description}</p>
          <p className="text-xs text-blue-500 mb-3">{currentTier.userLimit}</p>
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Choose Your Plan
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
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
                  <div className="text-2xl font-bold">
                    {formatPrice(tier)}
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <p className="text-xs text-blue-600 font-medium">{tier.userLimit}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4 text-xs">
                    {tier.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.features.length > 6 && (
                      <li className="text-blue-600 font-medium">
                        +{tier.features.length - 6} more features
                      </li>
                    )}
                  </ul>
                  <Button 
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={subscription.tier === tier.id}
                    className={`w-full ${tier.popular ? 'gradient-success text-white' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                    size="sm"
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
