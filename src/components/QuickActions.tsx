import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  Bell,
  MapPin,
  FileText,
  Plane,
  Hotel,
  Stethoscope,
  Scale,
  CheckCircle,
  Smartphone,
  ExternalLink,
  Map,
  CreditCard,
  AlertTriangle,
  Wifi
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onAddCountry: () => void;
  onSectionChange: (section: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = React.memo(({ onAddCountry, onSectionChange }) => {
  const { t } = useLanguage();
  
  const flightSearchEngines = [
    { name: 'Skyscanner', url: 'https://www.skyscanner.com' },
    { name: 'Google Flights', url: 'https://www.google.com/travel/flights' },
    { name: 'Kayak', url: 'https://www.kayak.com' }
  ];

  const hotelSearchEngines = [
    { name: 'Booking.com', url: 'https://www.booking.com' },
    { name: 'Hotels.com', url: 'https://www.hotels.com' },
    { name: 'Agoda', url: 'https://www.agoda.com' }
  ];
  
  const actions = [
    {
      title: t('quick.add_country'),
      description: t('quick.add_country_desc'),
      icon: Plus,
      action: onAddCountry,
      variant: 'default' as const,
      gradient: 'gradient-primary'
    },
    {
      title: 'WiFi Finder',
      description: 'Find reliable WiFi hotspots',
      icon: Wifi,
      action: () => onSectionChange('wifi-finder'),
      variant: 'outline' as const,
      badge: 'NEW'
    },
    {
      title: t('quick.ai_doctor'),
      description: t('quick.ai_doctor_desc'),
      icon: Stethoscope,
      action: () => onSectionChange('ai-doctor'),
      variant: 'outline' as const
    },
    {
      title: t('quick.ai_lawyer'),
      description: t('quick.ai_lawyer_desc'),
      icon: Scale,
      action: () => onSectionChange('ai-lawyer'),
      variant: 'outline' as const
    },
    {
      title: t('quick.ai_visa_helper'),
      description: t('quick.ai_visa_helper_desc'),
      icon: CheckCircle,
      action: () => onSectionChange('ai-visa'),
      variant: 'outline' as const
    },
    {
      title: t('quick.esim'),
      description: t('quick.esim_desc'),
      icon: Smartphone,
      action: () => onSectionChange('esim'),
      variant: 'outline' as const
    },
    {
      title: t('quick.embassy'),
      description: t('quick.embassy_desc'),
      icon: MapPin,
      action: () => onSectionChange('embassy'),
      variant: 'outline' as const
    },
    {
      title: t('quick.travel_planner'),
      description: t('quick.travel_planner_desc'),
      icon: Map,
      action: () => onSectionChange('travel-planner'),
      variant: 'outline' as const
    },
    {
      title: t('quick.credit_cards'),
      description: t('quick.credit_cards_desc'),
      icon: CreditCard,
      action: () => onSectionChange('emergency-cards'),
      variant: 'destructive' as const
    }
  ];

  return (
    <Card className="mb-6 shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('quick.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant={action.variant}
              className={`h-auto flex-col gap-2 p-4 ${
                action.gradient ? action.gradient + ' text-primary-foreground hover:opacity-90' : ''
              }`}
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
          
          {/* Flights Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
              >
                <Plane className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{t('quick.search_flights')}</div>
                  <div className="text-xs opacity-80">{t('quick.search_flights_desc')}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {flightSearchEngines.map((engine) => (
                <DropdownMenuItem key={engine.name} asChild>
                  <a
                    href={engine.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>{engine.name}</span>
                    <ExternalLink className="h-4 w-4 opacity-50" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hotels Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
              >
                <Hotel className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{t('quick.search_hotels')}</div>
                  <div className="text-xs opacity-80">{t('quick.search_hotels_desc')}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {hotelSearchEngines.map((engine) => (
                <DropdownMenuItem key={engine.name} asChild>
                  <a
                    href={engine.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>{engine.name}</span>
                    <ExternalLink className="h-4 w-4 opacity-50" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
});

export default QuickActions;