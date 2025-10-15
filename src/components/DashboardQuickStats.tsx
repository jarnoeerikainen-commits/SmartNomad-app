import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Shield, TrendingUp } from 'lucide-react';
import { Country } from '@/types/country';

interface DashboardQuickStatsProps {
  countries: Country[];
}

const DashboardQuickStats: React.FC<DashboardQuickStatsProps> = ({ countries }) => {
  const totalDays = countries.reduce((sum, country) => sum + country.daysSpent, 0);

  const currentYear = new Date().getFullYear();
  const daysThisYear = countries.reduce((sum, country) => {
    return sum + country.yearlyDaysSpent;
  }, 0);

  const stats = [
    {
      label: 'Countries Visited',
      value: countries.length.toString(),
      icon: MapPin,
      color: 'gradient-primary',
      trend: countries.length > 0 ? '+' + countries.length : '0',
    },
    {
      label: 'Days This Year',
      value: daysThisYear.toString(),
      icon: Calendar,
      color: 'gradient-trust',
      trend: daysThisYear > 0 ? daysThisYear + ' days' : 'Start tracking',
    },
    {
      label: 'Active Visas',
      value: '0',
      icon: Shield,
      color: 'gradient-sunset',
      trend: 'All valid',
    },
    {
      label: 'Tax Status',
      value: daysThisYear < 183 ? 'Clear' : 'Review',
      icon: TrendingUp,
      color: daysThisYear < 183 ? 'gradient-success' : 'gradient-warning',
      trend: daysThisYear + '/183 days',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="hover:shadow-medium transition-all duration-300 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardQuickStats;
