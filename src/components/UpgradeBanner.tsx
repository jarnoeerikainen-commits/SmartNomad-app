import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, X, Gift } from 'lucide-react';
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

  const hasEnhancedProfile = localStorage.getItem('enhancedProfile');

  return (
    <div className="space-y-4">
      {/* Premium Offer via Profile Form - Only if not completed */}
      {!hasEnhancedProfile && onProfileFormClick && (
        <Card className="border-primary/50 bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">
                      {t('upgrade.free_premium_title')}
                    </h3>
                    <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {t('upgrade.special_offer')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('upgrade.share_preferences')}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{t('upgrade.personalized_alerts')}</Badge>
                    <Badge variant="secondary" className="text-xs">{t('upgrade.tax_visa_guidance')}</Badge>
                    <Badge variant="secondary" className="text-xs">{t('upgrade.ai_assistant')}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onProfileFormClick}
                  className="gradient-primary shadow-lg hover:shadow-xl transition-all animate-pulse"
                  size="lg"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t('upgrade.get_free_premium')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Upgrade Banner */}
      <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="p-3 bg-primary/20 rounded-full">
                <Crown className="w-8 h-8 text-primary" />
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
                  className="gradient-success shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
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
