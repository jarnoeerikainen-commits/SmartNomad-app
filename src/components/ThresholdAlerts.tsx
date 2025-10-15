import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, AlertCircle, CheckCircle, Bell, Info } from 'lucide-react';
import { Country } from '@/types/country';

interface ThresholdAlertsProps {
  countries: Country[];
}

interface AlertLevel {
  level: 'safe' | 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ThresholdAlerts: React.FC<ThresholdAlertsProps> = ({ countries }) => {
  
  const getAlertLevel = (daysSpent: number, threshold: number = 183): AlertLevel => {
    const percentage = (daysSpent / threshold) * 100;

    if (daysSpent >= threshold) {
      return {
        level: 'critical',
        title: 'Tax Resident Status Reached',
        message: `You've exceeded ${threshold} days. You are considered a tax resident and must comply with local tax laws.`,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-300 dark:border-red-700'
      };
    }

    if (daysSpent >= 175) {
      return {
        level: 'danger',
        title: 'Urgent: Approaching Tax Residency',
        message: `Only ${threshold - daysSpent} days remaining! You're extremely close to becoming a tax resident.`,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-300 dark:border-red-700'
      };
    }

    if (daysSpent >= 150) {
      return {
        level: 'warning',
        title: 'Warning: Approaching Threshold',
        message: `You have ${threshold - daysSpent} days remaining. Start planning your exit or prepare for tax residency.`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
        borderColor: 'border-yellow-300 dark:border-yellow-700'
      };
    }

    if (daysSpent >= 100) {
      return {
        level: 'info',
        title: 'Monitor Your Days',
        message: `You have ${threshold - daysSpent} days remaining. Continue tracking to avoid unexpected tax residency.`,
        icon: <Info className="h-5 w-5" />,
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-300 dark:border-blue-700'
      };
    }

    return {
      level: 'safe',
      title: 'Well Within Limit',
      message: `You have ${threshold - daysSpent} days remaining. You're in a comfortable position.`,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-300 dark:border-green-700'
    };
  };

  // Get critical and warning alerts
  const alerts = countries
    .map(country => {
      const daysSpent = country.yearlyDaysSpent || country.daysSpent;
      const threshold = country.dayLimit || 183;
      const alert = getAlertLevel(daysSpent, threshold);
      const percentage = Math.min((daysSpent / threshold) * 100, 100);

      return {
        country,
        daysSpent,
        threshold,
        alert,
        percentage,
        daysRemaining: threshold - daysSpent
      };
    })
    .filter(a => a.daysSpent > 0)
    .sort((a, b) => {
      // Sort by alert priority
      const priority = { critical: 0, danger: 1, warning: 2, info: 3, safe: 4 };
      return priority[a.alert.level] - priority[b.alert.level];
    });

  const criticalAlerts = alerts.filter(a => a.alert.level === 'critical' || a.alert.level === 'danger');
  const warningAlerts = alerts.filter(a => a.alert.level === 'warning');

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-600" />
          Threshold Alerts & Warnings
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {criticalAlerts.length} Critical
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time monitoring of your tax residency thresholds (150, 175, 183 days)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Attention Required
            </h4>
            {criticalAlerts.map(({ country, daysSpent, threshold, alert, percentage, daysRemaining }) => (
              <Alert key={country.code} className={`${alert.bgColor} ${alert.borderColor} border-2`}>
                <div className="flex items-start gap-3">
                  <div className={alert.color}>{alert.icon}</div>
                  <div className="flex-1 space-y-2">
                    <AlertTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{country.flag}</span>
                        <span className="font-bold">{country.name}</span>
                      </span>
                      <Badge variant="destructive" className="ml-2">
                        {daysSpent}/{threshold} days
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p className={`font-semibold ${alert.color}`}>{alert.title}</p>
                      <p className="text-sm">{alert.message}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress to tax residency:</span>
                          <span className="font-bold">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>

                      {daysRemaining > 0 && (
                        <div className="bg-background/60 rounded p-2 text-xs font-medium">
                          ⚠️ Action Required: Leave before {daysRemaining} more days or prepare for tax residency
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Warnings
            </h4>
            {warningAlerts.map(({ country, daysSpent, threshold, alert, percentage, daysRemaining }) => (
              <Alert key={country.code} className={`${alert.bgColor} ${alert.borderColor}`}>
                <div className="flex items-start gap-3">
                  <div className={alert.color}>{alert.icon}</div>
                  <div className="flex-1 space-y-2">
                    <AlertTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-semibold">{country.name}</span>
                      </span>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                        {daysSpent}/{threshold} days
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p className={`text-sm font-medium ${alert.color}`}>{alert.title}</p>
                      <p className="text-xs">{alert.message}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress:</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* All Countries Summary */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            All Tracked Countries
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map(({ country, daysSpent, threshold, alert, percentage, daysRemaining }) => (
              <Card key={country.code} className={`${alert.bgColor} border ${alert.borderColor}`}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium text-sm">{country.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {daysSpent}/{threshold}
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                  <div className="flex justify-between items-center text-xs">
                    <span className={alert.color}>{alert.level.toUpperCase()}</span>
                    <span className="text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days over`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Information */}
        {alerts.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No countries tracked yet. Add countries to your tax tracker to monitor threshold alerts.
            </AlertDescription>
          </Alert>
        )}

        {/* Legend */}
        <Alert className="bg-muted/30">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs space-y-1">
            <p><strong>Alert Thresholds:</strong></p>
            <p>🟢 <strong>Safe (0-99 days):</strong> Well within limit</p>
            <p>🔵 <strong>Monitor (100-149 days):</strong> Continue tracking</p>
            <p>🟡 <strong>Warning (150-174 days):</strong> Start planning exit</p>
            <p>🟠 <strong>Danger (175-182 days):</strong> Urgent action needed</p>
            <p>🔴 <strong>Critical (183+ days):</strong> Tax resident status</p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};