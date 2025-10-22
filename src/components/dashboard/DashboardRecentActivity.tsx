import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, FileCheck, TrendingUp, Calendar } from 'lucide-react';
import { Country } from '@/types/country';
import { format } from 'date-fns';

interface DashboardRecentActivityProps {
  countries: Country[];
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({ countries }) => {
  // Generate activity timeline from country data
  const generateActivities = () => {
    const activities = [];

    // Add activities based on country updates
    countries.forEach((country) => {
      if (country.lastUpdate) {
        activities.push({
          id: `country-${country.code}`,
          type: 'country_update',
          title: `Updated ${country.name}`,
          description: `Added ${country.daysSpent || 0} days of tracking`,
          icon: MapPin,
          timestamp: country.lastUpdate,
          color: 'text-primary'
        });
      }
    });

    // Add mock recent activities for demo
    const now = Date.now();
    const mockActivities = [
      {
        id: 'today-1',
        type: 'tracking',
        title: 'Day tracking updated',
        description: 'Added 2 days in current location',
        icon: Calendar,
        timestamp: now,
        color: 'text-success'
      },
      {
        id: 'yesterday',
        type: 'document',
        title: 'Document uploaded',
        description: 'Visa application form saved to vault',
        icon: FileCheck,
        timestamp: now - 86400000,
        color: 'text-secondary'
      },
      {
        id: '3days',
        type: 'report',
        title: 'Tax report generated',
        description: 'Q4 2024 residency summary created',
        icon: TrendingUp,
        timestamp: now - 259200000,
        color: 'text-accent'
      }
    ];

    return [...mockActivities, ...activities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  };

  const activities = generateActivities();

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return format(new Date(timestamp), 'MMM d');
  };

  return (
    <Card className="shadow-medium hover:shadow-large transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
                )}
                
                {/* Activity Item */}
                <div className="flex items-start gap-4">
                  <div className={`relative z-10 p-2 rounded-lg bg-card border border-border ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{activity.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start tracking to see your activity here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
