import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Info, ChevronRight } from 'lucide-react';
import { Country } from '@/types/country';
import { ExpatDetectorService, ExpatAlert } from '@/services/ExpatDetectorService';

interface AccidentalExpatDetectorProps {
  countries: Country[];
  onNavigate?: (section: string) => void;
}

const AlertCard: React.FC<{ alert: ExpatAlert }> = ({ alert }) => {
  const severityStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    warning: 'border-amber-400/50 bg-amber-50 dark:bg-amber-950/20',
    info: 'border-blue-300/50 bg-blue-50 dark:bg-blue-950/20',
  };

  const severityIcon = {
    critical: <AlertTriangle className="w-5 h-5 text-destructive" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const severityBadge = {
    critical: 'destructive' as const,
    warning: 'secondary' as const,
    info: 'outline' as const,
  };

  const progressColor = alert.severity === 'critical' 
    ? '[&>div]:bg-destructive' 
    : alert.severity === 'warning' 
      ? '[&>div]:bg-amber-500' 
      : '[&>div]:bg-blue-500';

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${severityStyles[alert.severity]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{severityIcon[alert.severity]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{alert.countryFlag}</span>
            <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
        </div>
        <Badge variant={severityBadge[alert.severity]} className="text-xs shrink-0">
          {Math.round(alert.percentage)}%
        </Badge>
      </div>
      
      <Progress value={Math.min(alert.percentage, 100)} className={`h-2 ${progressColor}`} />
      
      <div className="flex items-start gap-2 bg-background/60 rounded-lg p-2.5">
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-foreground font-medium">{alert.recommendation}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Source: {alert.ruleSource}</p>
        </div>
      </div>
    </div>
  );
};

const AccidentalExpatDetector: React.FC<AccidentalExpatDetectorProps> = ({ countries, onNavigate }) => {
  const alerts = useMemo(() => ExpatDetectorService.analyzeCountries(countries), [countries]);

  if (alerts.length === 0) {
    return (
      <Card className="border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-950/10">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-foreground">No Tax Residency Risks Detected</p>
            <p className="text-xs text-muted-foreground">Your current travel patterns are within safe thresholds.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Accidental Expat Detector
          </CardTitle>
          <div className="flex gap-1.5">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">{criticalCount} Critical</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">{warningCount} Warning</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AccidentalExpatDetector;
