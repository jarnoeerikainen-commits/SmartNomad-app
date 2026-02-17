import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, Award, TrendingUp } from 'lucide-react';
import ComprehensiveUserProfile from '../ComprehensiveUserProfile';
import Settings from '../Settings';
import MyAwards from '../MyAwards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';

interface ProfileSectionProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ subscription, onUpgradeClick }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const getTierBadge = () => {
    switch (subscription.tier) {
      case 'premium':
        return <Badge variant="default">Premium</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
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
            <div className="flex-1">
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getTierBadge()}
              {subscription.tier === 'free' && (
                <Button size="sm" onClick={onUpgradeClick} className="ml-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="awards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Awards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 animate-fade-in">
          <ComprehensiveUserProfile />
        </TabsContent>

        <TabsContent value="settings" className="mt-6 animate-fade-in">
          <Settings />
        </TabsContent>

        <TabsContent value="awards" className="mt-6 animate-fade-in">
          <MyAwards />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSection;
