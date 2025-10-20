import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CloudLightning, Wind, Snowflake, X } from 'lucide-react';

interface Alert {
  type: string;
  severity: 'warning' | 'watch' | 'advisory';
  headline: string;
  description: string;
  expires: Date;
}

interface SevereWeatherAlertProps {
  alert: Alert;
  onDismiss: () => void;
}

const SevereWeatherAlert: React.FC<SevereWeatherAlertProps> = ({
  alert,
  onDismiss,
}) => {
  const getSeverityConfig = (severity: string) => {
    const configs = {
      warning: {
        bgClass: 'bg-destructive/10 border-destructive/30',
        textClass: 'text-destructive',
        iconClass: 'text-destructive',
        badgeVariant: 'destructive' as const,
      },
      watch: {
        bgClass: 'bg-warning/10 border-warning/30',
        textClass: 'text-warning',
        iconClass: 'text-warning',
        badgeVariant: 'secondary' as const,
      },
      advisory: {
        bgClass: 'bg-primary/10 border-primary/30',
        textClass: 'text-primary',
        iconClass: 'text-primary',
        badgeVariant: 'outline' as const,
      },
    };
    return configs[severity as keyof typeof configs] || configs.advisory;
  };

  const getAlertIcon = (headline: string) => {
    if (headline.includes('Storm') || headline.includes('Thunder')) {
      return <CloudLightning className="h-6 w-6" />;
    }
    if (headline.includes('Wind')) {
      return <Wind className="h-6 w-6" />;
    }
    if (headline.includes('Snow')) {
      return <Snowflake className="h-6 w-6" />;
    }
    return <AlertTriangle className="h-6 w-6" />;
  };

  const config = getSeverityConfig(alert.severity);
  const timeRemaining = Math.max(0, alert.expires.getTime() - Date.now());
  const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60));

  return (
    <Card className={`border-2 ${config.bgClass} shadow-medium animate-fade-in`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={config.iconClass}>{getAlertIcon(alert.headline)}</div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Expires in {hoursRemaining}h
                  </span>
                </div>
                <h3 className={`font-bold text-lg ${config.textClass}`}>
                  {alert.headline}
                </h3>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-foreground">
              {alert.description}
            </p>
            
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                Updated: {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SevereWeatherAlert;