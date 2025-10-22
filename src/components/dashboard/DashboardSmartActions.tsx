import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Country } from '@/types/country';

interface DashboardSmartActionsProps {
  countries: Country[];
  onActionClick?: (action: string) => void;
}

export const DashboardSmartActions: React.FC<DashboardSmartActionsProps> = ({ 
  countries,
  onActionClick 
}) => {
  // Generate smart recommendations based on user data
  const generateRecommendations = () => {
    const recommendations = [];

    // Check for countries nearing limits
    const nearingLimit = countries.filter(c => {
      const daysSpent = c.daysSpent || 0;
      const limit = c.dayLimit || 183;
      return daysSpent > (limit * 0.8) && daysSpent < limit;
    });

    if (nearingLimit.length > 0) {
      recommendations.push({
        id: 'limit_warning',
        title: `Approaching day limit in ${nearingLimit[0].name}`,
        description: `You have ${(nearingLimit[0].dayLimit || 183) - (nearingLimit[0].daysSpent || 0)} days remaining`,
        icon: AlertCircle,
        priority: 'high',
        action: 'view_tax_tracker',
        color: 'text-destructive'
      });
    }

    // Check for low day counts (suggest updating)
    const lowDayCounts = countries.filter(c => (c.daysSpent || 0) === 0);
    if (lowDayCounts.length > 0) {
      recommendations.push({
        id: 'update_days',
        title: `Update tracking for ${lowDayCounts[0].name}`,
        description: 'Keep your records accurate and up-to-date',
        icon: Calendar,
        priority: 'medium',
        action: 'update_country',
        color: 'text-warning'
      });
    }

    // Suggest document uploads
    if (countries.length > 0) {
      recommendations.push({
        id: 'upload_docs',
        title: 'Upload passport scan',
        description: 'Secure your important documents in the vault',
        icon: FileText,
        priority: 'medium',
        action: 'open_vault',
        color: 'text-primary'
      });
    }

    // Suggest tax planning
    if (countries.length >= 2) {
      recommendations.push({
        id: 'tax_planning',
        title: 'Review your tax strategy',
        description: 'Optimize your tax residency across countries',
        icon: TrendingUp,
        priority: 'low',
        action: 'open_tax_hub',
        color: 'text-success'
      });
    }

    // Default recommendations for new users
    if (countries.length === 0) {
      recommendations.push({
        id: 'add_first_country',
        title: 'Add your first country',
        description: 'Start tracking your nomad journey today',
        icon: AlertCircle,
        priority: 'high',
        action: 'add_country',
        color: 'text-primary'
      });
    }

    return recommendations.slice(0, 4); // Limit to 4 recommendations
  };

  const recommendations = generateRecommendations();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Important</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Suggested</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-medium hover:shadow-large transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Smart Actions for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                className="group p-4 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-accent/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-primary/10 ${rec.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{rec.title}</p>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onActionClick?.(rec.action)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              All caught up! No actions needed right now.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
