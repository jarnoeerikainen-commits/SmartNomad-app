import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, X } from 'lucide-react';
import { Subscription } from '@/types/subscription';

interface UpgradeBannerProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
  onDismiss?: () => void;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  subscription, 
  onUpgradeClick,
  onDismiss 
}) => {
  // Only show for free users
  if (subscription.tier !== 'free') {
    return null;
  }

  return (
    <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-primary/20 rounded-full">
              <Crown className="w-8 h-8 text-primary animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground">
                  Unlock Premium Features
                </h3>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Limited Offer
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Get automatic tracking, unlimited countries, tax residence monitoring, and more - starting from just $0.99/year!
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">🤖 Auto Location</Badge>
                <Badge variant="outline" className="text-xs">💰 Tax Tracking</Badge>
                <Badge variant="outline" className="text-xs">📊 Advanced Reports</Badge>
                <Badge variant="outline" className="text-xs">☁️ Cloud Backup</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onUpgradeClick}
              className="gradient-success shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Plans
            </Button>
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeBanner;
