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
  Plane
} from 'lucide-react';

interface QuickActionsProps {
  onAddCountry: () => void;
  onSectionChange: (section: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddCountry, onSectionChange }) => {
  const actions = [
    {
      title: 'Add Country',
      description: 'Start tracking a new destination',
      icon: Plus,
      action: onAddCountry,
      variant: 'default' as const,
      gradient: 'gradient-primary'
    },
    {
      title: 'Upload Documents',
      description: 'Store important travel docs',
      icon: Upload,
      action: () => onSectionChange('documents'),
      variant: 'outline' as const
    },
    {
      title: 'Check Visas',
      description: 'Review visa requirements',
      icon: Plane,
      action: () => onSectionChange('visas'),
      variant: 'outline' as const
    },
    {
      title: 'View Alerts',
      description: 'See important notifications',
      icon: Bell,
      action: () => onSectionChange('alerts'),
      variant: 'outline' as const
    }
  ];

  return (
    <Card className="mb-6 shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant={action.variant}
              className={`h-auto flex-col gap-2 p-4 ${
                action.gradient ? action.gradient + ' text-white hover:opacity-90' : ''
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
};

export default QuickActions;