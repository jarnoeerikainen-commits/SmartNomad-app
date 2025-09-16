import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Cookie, FileText, Users, Lock, Eye, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="border border-border bg-background/95 backdrop-blur shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cookie className="w-5 h-5" />
            Cookie Preferences
          </CardTitle>
          <CardDescription>
            We use cookies to enhance your experience and comply with GDPR regulations.
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

export const PrivacyPolicy: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Policy & GDPR Compliance
          </DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Data Controller Information</h3>
            <p className="text-sm text-muted-foreground mb-2">
              TravelTracker is committed to protecting your privacy and ensuring GDPR compliance.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm"><strong>Data Controller:</strong> TravelTracker Ltd.</p>
              <p className="text-sm"><strong>Contact:</strong> privacy@traveltracker.com</p>
              <p className="text-sm"><strong>DPO:</strong> dpo@traveltracker.com</p>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Data We Collect</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Personal Information</p>
                  <p className="text-sm text-muted-foreground">Name, email, passport details, travel history</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Usage Data</p>
                  <p className="text-sm text-muted-foreground">App interactions, preferences, device information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Location Data</p>
                  <p className="text-sm text-muted-foreground">GPS coordinates for travel tracking (with consent)</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Your Rights Under GDPR</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-sm">Right to Access</p>
                <p className="text-xs text-muted-foreground">Request copies of your data</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-sm">Right to Rectification</p>
                <p className="text-xs text-muted-foreground">Correct inaccurate data</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-sm">Right to Erasure</p>
                <p className="text-xs text-muted-foreground">Delete your data</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-sm">Right to Portability</p>
                <p className="text-xs text-muted-foreground">Transfer your data</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Data Processing Legal Basis</h3>
            <div className="space-y-2">
              <Badge variant="outline">Consent - for location tracking and marketing</Badge>
              <Badge variant="outline">Contractual necessity - for service provision</Badge>
              <Badge variant="outline">Legitimate interest - for app improvement</Badge>
              <Badge variant="outline">Legal compliance - for tax and visa tracking</Badge>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
            <p className="text-sm text-muted-foreground mb-2">
              We retain your data only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Account data: Until account deletion + 30 days</li>
              <li>• Travel history: 7 years (for tax compliance purposes)</li>
              <li>• Usage analytics: 2 years</li>
              <li>• Marketing data: Until consent withdrawal</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">6. International Transfers</h3>
            <p className="text-sm text-muted-foreground">
              Your data may be transferred outside the EEA only with appropriate safeguards, including:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 mt-2">
              <li>• EU Commission adequacy decisions</li>
              <li>• Standard contractual clauses</li>
              <li>• Binding corporate rules</li>
            </ul>
          </section>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} className="flex-1">
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DataManagement: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const { toast } = useToast();

  const downloadData = () => {
    // In a real app, this would generate and download user data
    const userData = {
      profile: "User data export",
      countries: "Travel tracking data",
      preferences: "App settings and preferences",
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'traveltracker-data-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data export started",
      description: "Your data export will download shortly.",
    });
  };

  const deleteAllData = () => {
    // In a real app, this would trigger account deletion
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
            Exercise your GDPR rights and manage your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPrivacyPolicy(true)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Privacy Policy
            </Button>
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

      <PrivacyPolicy isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
    </div>
  );
};