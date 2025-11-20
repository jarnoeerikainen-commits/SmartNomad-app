import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Shield, Calculator, Plane, MapPin, 
  Globe, Wifi, Building, Crown,
  AlertTriangle, ShieldCheck, Bug, Siren,
  Bus, Car, Package, BookOpen, Users, Newspaper,
  Stethoscope, Scale, Briefcase, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardQuickStats from '../DashboardQuickStats';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface HomeSectionProps {
  countries: Country[];
  subscription: Subscription;
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, subscription, onNavigate }) => {
  const { t } = useLanguage();

  const serviceGroups = [
    {
      id: 'safety',
      title: 'Safety First',
      description: 'Emergency & Security Services',
      icon: Shield,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      badge: 'SOS',
      badgeVariant: 'destructive' as const,
      items: [
        { id: 'emergency', label: 'Emergency Contacts', icon: AlertTriangle },
        { id: 'sos-services', label: 'SOS Services', icon: Siren },
        { id: 'cyber-helpline', label: 'Cyber Security', icon: ShieldCheck },
        { id: 'threats', label: 'Threat Intelligence', icon: Shield },
      ]
    },
    {
      id: 'tax',
      title: 'Tax & Compliance',
      description: 'Your Primary Tracking Tool',
      icon: Calculator,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      badge: 'Core',
      badgeVariant: 'default' as const,
      items: [
        { id: 'tax', label: 'Tax Residency Dashboard', icon: Calculator },
        { id: 'tax-residency', label: 'Country Tracker', icon: MapPin },
        { id: 'visas', label: 'Visa Manager', icon: Plane },
        { id: 'vault', label: 'Document Vault', icon: Shield },
      ]
    },
    {
      id: 'travel',
      title: 'Travel Essentials',
      description: 'Transportation & Communication',
      icon: Plane,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      items: [
        { id: 'public-transport', label: 'Public Transport', icon: Bus },
        { id: 'taxis', label: 'Taxi Services', icon: Car },
        { id: 'delivery-services', label: 'Delivery Services', icon: Package },
        { id: 'esim', label: 'eSIM & VPN', icon: Wifi },
        { id: 'travel-insurance', label: 'Travel Insurance', icon: Shield },
      ]
    },
    {
      id: 'local',
      title: 'Local Living',
      description: 'Connect with your destination',
      icon: Globe,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      items: [
        { id: 'global-city-services', label: 'City Services', icon: Building },
        { id: 'language-learning', label: 'Language Learning', icon: BookOpen },
        { id: 'local-nomads', label: 'Local Nomads', icon: Users },
        { id: 'news', label: 'News & Updates', icon: Newspaper },
      ]
    },
    {
      id: 'premium',
      title: 'Premium Services',
      description: 'AI-Powered Advisory',
      icon: Crown,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      badge: 'Premium',
      badgeVariant: 'secondary' as const,
      items: [
        { id: 'ai-doctor', label: 'AI Health Advisor', icon: Stethoscope },
        { id: 'ai-lawyer', label: 'AI Legal Advisor', icon: Scale },
        { id: 'ai-planner', label: 'AI Travel Planner', icon: Sparkles },
        { id: 'tax-advisors', label: 'Tax Advisors', icon: Briefcase },
        { id: 'business-centers', label: 'Business Centers', icon: Building },
        { id: 'airport-lounges', label: 'VIP Lounges', icon: Crown },
        { id: 'private-clubs', label: 'Private Clubs', icon: Crown },
      ]
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Quick Stats */}
      <DashboardQuickStats countries={countries} />

      {/* Service Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card 
              key={group.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fade-in"
              onClick={() => onNavigate(group.items[0].id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-lg ${group.bgColor}`}>
                    <Icon className={`h-6 w-6 ${group.color}`} />
                  </div>
                  {group.badge && (
                    <Badge variant={group.badgeVariant}>{group.badge}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
                
                <div className="mt-4 space-y-2">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(item.id);
                        }}
                      >
                        <ItemIcon className="h-4 w-4 mr-2" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomeSection;
