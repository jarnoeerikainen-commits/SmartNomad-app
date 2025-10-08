import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  Bell,
  MapPin,
  FileText,
  Plane,
  Stethoscope,
  Scale,
  CheckCircle,
  UtensilsCrossed
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onAddCountry: () => void;
  onSectionChange: (section: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = React.memo(({ onAddCountry, onSectionChange }) => {
  const { t } = useLanguage();
  
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
        </div>
      </CardContent>
    </Card>
  );
});

export default QuickActions;