import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Plane,
  FileText,
  Building,
  DollarSign,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'document_expiry' | 'visa_limit' | 'tax_residency' | 'embassy_registration' | 'travel_reminder';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerDate: string;
  country?: string;
  actionRequired: boolean;
  isRead: boolean;
  suggestions: string[];
}

interface AlertSettings {
  documentExpiryDays: number[];
  visaLimitWarningPercentage: number;
  taxResidencyWarningDays: number;
  enablePushNotifications: boolean;
  enableEmailAlerts: boolean;
  dailyDigest: boolean;
  smartPredictions: boolean;
}

const ALERT_ICONS = {
  document_expiry: FileText,
  visa_limit: Plane,
  tax_residency: DollarSign,
  embassy_registration: Building,
  travel_reminder: Calendar
};

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

export const SmartAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    documentExpiryDays: [180, 90, 30, 7],
    visaLimitWarningPercentage: 80,
    taxResidencyWarningDays: 30,
    enablePushNotifications: true,
    enableEmailAlerts: false,
    dailyDigest: true,
    smartPredictions: true
  });
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const { toast } = useToast();

  // Generate sample alerts based on current tracking data
  useEffect(() => {
    generateSmartAlerts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateSmartAlerts = React.useCallback(() => {
    const sampleAlerts: Alert[] = [
      {
        id: '1',
        type: 'visa_limit',
        title: 'Schengen Visa Limit Warning',
        description: 'You have used 72 of 90 allowed days in the Schengen area. You can stay 18 more days.',
        severity: 'high',
        triggerDate: new Date().toISOString(),
        country: 'Schengen Area',
        actionRequired: true,
        isRead: false,
        suggestions: [
          'Plan to exit Schengen area within 18 days',
          'Apply for long-stay visa if staying longer',
          'Track 180-day rolling period carefully'
        ]
      },
      {
        id: '2',
        type: 'document_expiry',
        title: 'Passport Expiring Soon',
        description: 'Your US passport expires in 45 days. Many countries require 6 months validity.',
        severity: 'critical',
        triggerDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        actionRequired: true,
        isRead: false,
        suggestions: [
          'Start passport renewal process immediately',
          'Check passport requirements for upcoming travel',
          'Consider expedited processing if needed'
        ]
      },
      {
        id: '3',
        type: 'tax_residency',
        title: 'Tax Residency Threshold Approaching',
        description: 'You will become a tax resident of Germany in 25 days if you stay.',
        severity: 'medium',
        triggerDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        country: 'Germany',
        actionRequired: true,
        isRead: false,
        suggestions: [
          'Consider leaving before 183-day threshold',
          'Consult with tax advisor about implications',
          'Review double taxation treaties'
        ]
      },
      {
        id: '4',
        type: 'embassy_registration',
        title: 'Embassy Registration Recommended',
        description: 'Register with US Embassy in Thailand for safety updates and assistance.',
        severity: 'low',
        triggerDate: new Date().toISOString(),
        country: 'Thailand',
        actionRequired: false,
        isRead: true,
        suggestions: [
          'Complete STEP registration online',
          'Update contact information',
          'Enable emergency notifications'
        ]
      }
    ];

    setAlerts(sampleAlerts);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert dismissed",
      description: "The alert has been removed from your list",
    });
  };

  const updateSettings = (key: keyof AlertSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings updated",
      description: "Your alert preferences have been saved",
    });
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Smart Alerts & Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Intelligent alerts for visa limits, document expiry, and tax compliance
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('alerts')}
              >
                Alerts ({alerts.length})
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'alerts' ? (
            <div className="space-y-4">
              {criticalCount > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Alerts Require Immediate Action
                  </div>
                  <p className="text-red-700 text-sm">
                    You have {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} that need immediate attention.
                  </p>
                </div>
              )}

              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-gray-500">No active alerts</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const IconComponent = ALERT_ICONS[alert.type];
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${SEVERITY_COLORS[alert.severity]} ${
                          !alert.isRead ? 'border-l-4' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <IconComponent className="w-5 h-5 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{alert.title}</h4>
                                {!alert.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                {alert.country && (
                                  <Badge variant="outline" className="text-xs">
                                    {alert.country}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-3">{alert.description}</p>
                              
                              {alert.suggestions.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium">Suggested actions:</p>
                                  <ul className="text-xs space-y-1">
                                    {alert.suggestions.map((suggestion, index) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-gray-400">•</span>
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            {!alert.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(alert.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.enablePushNotifications}
                      onCheckedChange={(checked) => updateSettings('enablePushNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <Switch
                      id="email-alerts"
                      checked={settings.enableEmailAlerts}
                      onCheckedChange={(checked) => updateSettings('enableEmailAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <Switch
                      id="daily-digest"
                      checked={settings.dailyDigest}
                      onCheckedChange={(checked) => updateSettings('dailyDigest', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smart-predictions">Smart Predictions</Label>
                    <Switch
                      id="smart-predictions"
                      checked={settings.smartPredictions}
                      onCheckedChange={(checked) => updateSettings('smartPredictions', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Alert Timing</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Document Expiry Warnings (days before)</Label>
                    <div className="flex gap-2 mt-2">
                      {[180, 90, 30, 7].map(days => (
                        <Badge key={days} variant="outline" className="cursor-pointer">
                          {days} days
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Visa Limit Warning (%)</Label>
                    <Select 
                      value={settings.visaLimitWarningPercentage.toString()}
                      onValueChange={(value) => updateSettings('visaLimitWarningPercentage', parseInt(value))}
                    >
                      <SelectTrigger className="w-32 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tax Residency Warning (days before threshold)</Label>
                    <Select 
                      value={settings.taxResidencyWarningDays.toString()}
                      onValueChange={(value) => updateSettings('taxResidencyWarningDays', parseInt(value))}
                    >
                      <SelectTrigger className="w-32 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};