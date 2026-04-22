import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, Award, Crown, Headphones, FileText, Shield, Users } from 'lucide-react';
import ComprehensiveUserProfile from '../ComprehensiveUserProfile';
import MyAwards from '../MyAwards';
import SupportTicketing from '../SupportTicketing';
import DataManagementSettings from '../DataManagementSettings';
import ProfileDataViewer from '../ProfileDataViewer';
import EnhancedProfileForm from '../EnhancedProfileForm';
import FamilyVault from '../FamilyVault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';

interface ProfileSectionProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
  onProfileComplete?: (data: any) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ subscription, onUpgradeClick, onProfileComplete }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showProfileForm, setShowProfileForm] = useState(false);

  const getTierBadge = () => {
    switch (subscription.tier) {
      case 'premium':
        return <Badge variant="default">Premium</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const handleProfileEdit = () => {
    setShowProfileForm(true);
  };

  const handleProfileFormComplete = (data: any) => {
    setShowProfileForm(false);
    onProfileComplete?.(data);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {getTierBadge()}
              {subscription.tier === 'free' && (
                <Button size="sm" onClick={onUpgradeClick} className="ml-2 border-0 text-foreground font-semibold tracking-wide hover:scale-[1.02] transition-all" style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}>
                  <Crown className="h-4 w-4 mr-2" />
                  PRO
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {subscription.tier === 'free' && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for unlimited AI requests, advanced analytics, and exclusive features.
            </p>
          </CardContent>
        )}
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs px-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-1.5 text-xs px-2">
            <Users className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Family</span>
          </TabsTrigger>
          <TabsTrigger value="mydata" className="flex items-center gap-1.5 text-xs px-2">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">My Data</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5 text-xs px-2">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-1.5 text-xs px-2">
            <Headphones className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Support</span>
          </TabsTrigger>
          <TabsTrigger value="awards" className="flex items-center gap-1.5 text-xs px-2">
            <Award className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Awards</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs px-2">
            <SettingsIcon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 animate-fade-in">
          <ComprehensiveUserProfile subscription={subscription} onUpgradeClick={onUpgradeClick} />
        </TabsContent>

        <TabsContent value="family" className="mt-6 animate-fade-in">
          <FamilyVault />
        </TabsContent>

        <TabsContent value="mydata" className="mt-6 animate-fade-in">
          <ProfileDataViewer onEdit={handleProfileEdit} />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6 animate-fade-in">
          <DataManagementSettings />
        </TabsContent>

        <TabsContent value="support" className="mt-6 animate-fade-in">
          <SupportTicketing />
        </TabsContent>

        <TabsContent value="awards" className="mt-6 animate-fade-in">
          <MyAwards />
        </TabsContent>

        <TabsContent value="settings" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                App Settings
              </CardTitle>
              <CardDescription>Configure your app preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.open('/translation-manager', '_blank')}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <SettingsIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Translation Manager</p>
                      <p className="text-xs text-muted-foreground">Manage all 13 languages</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">GDPR Compliance</p>
                      <p className="text-xs text-muted-foreground">Data protection settings</p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-1">App Information</p>
                <ul className="space-y-1">
                  <li>• Version: 2.0.0</li>
                  <li>• Languages supported: 13</li>
                  <li>• Data stored locally on device</li>
                  <li>• GDPR & CCPA compliant</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showProfileForm && (
        <EnhancedProfileForm
          onComplete={handleProfileFormComplete}
          onSkip={() => setShowProfileForm(false)}
        />
      )}
    </div>
  );
};

export default ProfileSection;
