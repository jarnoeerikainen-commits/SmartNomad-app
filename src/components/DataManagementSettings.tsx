import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, Download, Trash2, Eye, EyeOff, 
  Lock, CheckCircle2, AlertTriangle, User, Mail, Phone, Globe
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EnhancedProfileData {
  firstName: string;
  email: string;
  phone?: string;
  nationality?: string;
  currentLocation?: string;
  occupation?: string;
  travelFrequency?: string;
  travelPurpose?: string[];
  preferredLanguages: string[];
  consents: {
    dataProcessing: boolean;
    marketing: boolean;
  };
  completedAt: string;
}

const DataManagementSettings: React.FC = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<EnhancedProfileData | null>(null);
  const [showData, setShowData] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('enhancedProfile');
    if (stored) {
      setProfileData(JSON.parse(stored));
    }
  }, []);

  const handleDownloadData = () => {
    const allData = {
      enhancedProfile: profileData,
      userProfile: JSON.parse(localStorage.getItem('userProfile') || 'null'),
      subscription: JSON.parse(localStorage.getItem('subscription') || 'null'),
      trackedCountries: JSON.parse(localStorage.getItem('trackedCountries') || '[]'),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartnomad-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Downloaded",
      description: "Your data has been exported successfully.",
    });
  };

  const handleDeleteProfile = () => {
    localStorage.removeItem('enhancedProfile');
    setProfileData(null);
    setShowDeleteDialog(false);

    toast({
      title: "Profile Deleted",
      description: "Your enhanced profile data has been removed.",
    });
  };

  const handleDeleteAllData = () => {
    // Clear all user data except essential app settings
    localStorage.removeItem('enhancedProfile');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('subscription');
    localStorage.removeItem('trackedCountries');
    
    setProfileData(null);
    setShowDeleteAllDialog(false);

    toast({
      title: "All Data Deleted",
      description: "All your data has been permanently removed. You will be redirected.",
      variant: "destructive",
    });

    // Reload the app to reset state
    setTimeout(() => window.location.reload(), 2000);
  };

  if (!profileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            You haven't completed the enhanced profile form yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Complete the profile form to unlock Premium features and access data management.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Management & Privacy
          </CardTitle>
          <CardDescription>
            View, download, or delete your personal data in compliance with GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your Stored Data</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowData(!showData)}
              >
                {showData ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Data
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Data
                  </>
                )}
              </Button>
            </div>

            {showData && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">First Name:</span>
                      <span>{profileData.firstName}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{profileData.email}</span>
                    </div>
                  </div>

                  {profileData.phone && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{profileData.phone}</span>
                      </div>
                    </div>
                  )}

                  {profileData.nationality && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">Nationality:</span>
                        <span>{profileData.nationality}</span>
                      </div>
                    </div>
                  )}

                  {profileData.currentLocation && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Current Location:</span>
                        <span>{profileData.currentLocation}</span>
                      </div>
                    </div>
                  )}

                  {profileData.occupation && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Occupation:</span>
                        <span>{profileData.occupation}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Preferences:</p>
                  <div className="flex flex-wrap gap-1">
                    {profileData.preferredLanguages.map(lang => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {profileData.travelPurpose?.map(purpose => (
                      <Badge key={purpose} variant="outline" className="text-xs">
                        {purpose}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-xs text-muted-foreground">
                  Profile completed: {new Date(profileData.completedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Consent Status */}
          <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Your Privacy Choices
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Data Processing for Services</span>
                <Badge variant={profileData.consents.dataProcessing ? "default" : "secondary"}>
                  {profileData.consents.dataProcessing ? "Consented" : "Not Consented"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Marketing Communications</span>
                <Badge variant={profileData.consents.marketing ? "default" : "secondary"}>
                  {profileData.consents.marketing ? "Subscribed" : "Unsubscribed"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Your Data Rights (GDPR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="p-3 bg-muted/30">
                <div className="flex items-start gap-2">
                  <Download className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Right to Access</p>
                    <p className="text-xs text-muted-foreground">Download all your data</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-muted/30">
                <div className="flex items-start gap-2">
                  <Trash2 className="h-4 w-4 mt-0.5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium">Right to Erasure</p>
                    <p className="text-xs text-muted-foreground">Delete your data permanently</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadData}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download My Data
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </Button>
            </div>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllDialog(true)}
              className="w-full"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Delete All Data & Account
            </Button>
          </div>

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <p className="font-medium mb-1">Data Security:</p>
            <ul className="space-y-1">
              <li>• All data is stored locally on your device</li>
              <li>• We use industry-standard encryption</li>
              <li>• Your data is never shared with third parties</li>
              <li>• You have full control over your information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Delete Profile Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enhanced Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your enhanced profile data and revert your subscription to Free tier. 
              Your travel tracking data will be preserved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground">
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Data Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete All Data?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your enhanced profile data</li>
                <li>All tracked countries and travel history</li>
                <li>Your subscription information</li>
                <li>All saved preferences and settings</li>
              </ul>
              <p className="font-semibold text-destructive pt-2">
                This action is permanent and cannot be undone!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive text-destructive-foreground">
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DataManagementSettings;