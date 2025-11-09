import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Newspaper, 
  Shirt,
  Calculator,
  FileText,
  Users,
  ArrowRight
} from 'lucide-react';

interface DashboardFeatureDiscoveryProps {
  onFeatureClick?: (feature: string) => void;
}

export const DashboardFeatureDiscovery: React.FC<DashboardFeatureDiscoveryProps> = ({ 
  onFeatureClick 
}) => {
  const features = [
    {
      id: 'ai_doctor',
      name: 'AI Travel Doctor',
      description: 'Get instant health advice',
      icon: Bot,
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
      badge: 'Popular'
    },
    {
      id: 'tax_hub',
      name: 'Tax Residency Hub',
      description: 'Track your tax obligations',
      icon: Calculator,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
      badge: 'Essential'
    },
    {
      id: 'laundry',
      name: 'Laundry Services',
      description: 'Find trusted laundry near you',
      icon: Shirt,
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
      badge: 'New'
    },
    {
      id: 'visa',
      name: 'Visa Tracker',
      description: 'Never miss a visa deadline',
      icon: ShieldCheck,
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-500',
      badge: null
    },
    {
      id: 'news',
      name: 'Travel News',
      description: 'Stay informed on the go',
      icon: Newspaper,
      color: 'from-yellow-500/20 to-amber-500/20',
      iconColor: 'text-yellow-600',
      badge: null
    },
    {
      id: 'documents',
      name: 'Document Vault',
      description: 'Secure storage for your files',
      icon: FileText,
      color: 'from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-500',
      badge: null
    },
    {
      id: 'community',
      name: 'Local Nomads',
      description: 'Connect with travelers',
      icon: Users,
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-500',
      badge: null
    },
    {
      id: 'ai_planner',
      name: 'AI Travel Planner',
      description: 'Plan your next adventure',
      icon: Sparkles,
      color: 'from-teal-500/20 to-green-500/20',
      iconColor: 'text-teal-500',
      badge: 'AI'
    }
  ];

  return (
    <Card className="shadow-medium hover:shadow-large transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Discover SuperNomad Features
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => onFeatureClick?.(feature.id)}
                className={`group relative p-4 rounded-xl bg-gradient-to-br ${feature.color} border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 text-left`}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                      {feature.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-2 rounded-lg bg-background/50 mb-3 ${feature.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {feature.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Access Tip */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium text-primary mb-1">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground">
            Use the search bar (⌘K) to quickly jump to any feature
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
