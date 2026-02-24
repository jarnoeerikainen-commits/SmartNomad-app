import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, X } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';

interface UpgradeBannerProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
  onDismiss?: () => void;
  onProfileFormClick?: () => void;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  subscription, 
  onUpgradeClick,
  onDismiss,
  onProfileFormClick
}) => {
  const { t } = useLanguage();
  
  // Only show for free users
  if (subscription.tier !== 'free') {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Standard Upgrade Banner */}
      <Card className="border-[hsl(var(--gold)/0.3)] bg-gradient-to-r from-[hsl(var(--gold-dark)/0.08)] via-[hsl(var(--gold)/0.05)] to-[hsl(var(--gold-dark)/0.08)] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--gold)/0.03)] to-[hsl(var(--gold-dark)/0.03)]" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="p-3 bg-[hsl(var(--gold)/0.15)] rounded-full">
                <Crown className="w-8 h-8 text-[hsl(var(--gold-dark))]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">
                    {t('upgrade.unlock_premium')}
                  </h3>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t('upgrade.from_price')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('upgrade.benefits')}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{t('upgrade.auto_location')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('upgrade.tax_tracking')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('upgrade.advanced_reports')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('upgrade.cloud_backup')}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button 
                  onClick={onUpgradeClick}
                  className="border-0 text-foreground font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-[1.03]"
                  style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {t('upgrade.view_plans')}
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
    </div>
  );
};

export default UpgradeBanner;
