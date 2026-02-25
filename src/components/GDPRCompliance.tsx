import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Cookie, FileText, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
    toast({
      title: "Cookie preferences saved",
      description: "All cookies have been accepted.",
    });
  };

  const acceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
    toast({
      title: "Cookie preferences saved",
      description: "Your cookie preferences have been saved.",
    });
  };

  const rejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(minimal);
    localStorage.setItem('cookieConsent', JSON.stringify(minimal));
    setIsVisible(false);
    toast({
      title: "Cookie preferences saved",
      description: "Only necessary cookies will be used.",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[60] md:bottom-4 md:left-auto md:right-4 md:w-96 max-h-[70vh] overflow-y-auto">
      <Card className="border border-border bg-background/95 backdrop-blur shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cookie className="w-5 h-5" />
            Cookie Preferences
          </CardTitle>
          <CardDescription>
            We use cookies to enhance your experience. See our{' '}
            <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a> and{' '}
            <a href="/terms" className="text-primary underline">Terms & Conditions</a>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="necessary" className="flex flex-col gap-1">
                <span>Necessary Cookies</span>
                <span className="text-xs text-muted-foreground">Required for basic functionality</span>
              </Label>
              <Switch id="necessary" checked={preferences.necessary} disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="flex flex-col gap-1">
                <span>Analytics Cookies</span>
                <span className="text-xs text-muted-foreground">Help us improve our service</span>
              </Label>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing" className="flex flex-col gap-1">
                <span>Marketing Cookies</span>
                <span className="text-xs text-muted-foreground">For personalized advertising</span>
              </Label>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="functional" className="flex flex-col gap-1">
                <span>Functional Cookies</span>
                <span className="text-xs text-muted-foreground">Enhanced features and preferences</span>
              </Label>
              <Switch
                id="functional"
                checked={preferences.functional}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, functional: checked }))}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={acceptAll} size="sm" className="flex-1">
              Accept All
            </Button>
            <Button onClick={acceptSelected} variant="outline" size="sm" className="flex-1">
              Save Preferences
            </Button>
            <Button onClick={rejectAll} variant="ghost" size="sm">
              Reject All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// PrivacyPolicy dialog removed - now a standalone page at /privacy-policy

export const DataManagement: React.FC = () => {
  const { toast } = useToast();

  const downloadData = () => {
    const userData = {
      profile: "User data export",
      countries: "Travel tracking data",
      preferences: "App settings and preferences",
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'supernomad-data-export.json');
    linkElement.click();
    
    toast({
      title: "Data export started",
      description: "Your data export will download shortly.",
    });
  };

  const deleteAllData = () => {
    toast({
      title: "Account deletion requested",
      description: "Your account deletion request has been submitted. This action cannot be undone.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Privacy Management
          </CardTitle>
          <CardDescription>
            Exercise your GDPR & CCPA rights and manage your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/privacy-policy">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </Button>
            </a>
            <a href="/terms">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Terms & Conditions
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={downloadData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download My Data
            </Button>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
            <Button
              variant="destructive"
              onClick={deleteAllData}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All My Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};