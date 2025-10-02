import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStatsProps {
  countries: Country[];
}

const DashboardStats: React.FC<DashboardStatsProps> = React.memo(({ countries }) => {
  const { t } = useLanguage();
  
  // Calculate stats
  const totalCountries = countries.length;
  const activeTracking = countries.filter(c => c.daysSpent && c.daysSpent > 0).length;
  const criticalAlerts = countries.filter(c => {
    const daysUsed = c.daysSpent || 0;
    const daysLimit = c.dayLimit || 0;
    const usagePercentage = daysLimit > 0 ? (daysUsed / daysLimit) * 100 : 0;
    return usagePercentage >= 90;
  }).length;
  const warningAlerts = countries.filter(c => {
    const daysUsed = c.daysSpent || 0;
    const daysLimit = c.dayLimit || 0;
    const usagePercentage = daysLimit > 0 ? (daysUsed / daysLimit) * 100 : 0;
    return usagePercentage >= 70 && usagePercentage < 90;
  }).length;

  const stats = [
    {
      title: t('stats.countries_tracked'),
      value: totalCountries,
      icon: MapPin,
      gradient: 'gradient-primary',
      description: t('stats.active_destinations')
    },
    {
      title: t('stats.active_tracking'),
      value: activeTracking,
      icon: Clock,
      gradient: 'gradient-trust',
      description: t('stats.with_recorded_visits')
    },
    {
      title: t('stats.critical_alerts'),
      value: criticalAlerts,
      icon: AlertTriangle,
      gradient: 'gradient-danger',
      description: t('stats.require_attention'),
      badge: criticalAlerts > 0 ? t('stats.urgent') : undefined
    },
    {
      title: t('stats.warnings'),
      value: warningAlerts,
      icon: TrendingUp,
      gradient: 'gradient-warning',
      description: t('stats.monitor_closely')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="relative overflow-hidden animate-fade-in shadow-medium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.gradient} shadow-soft`}>
              <stat.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
              {stat.badge && (
                <Badge variant="destructive" className="text-xs">
                  {stat.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

export default DashboardStats;