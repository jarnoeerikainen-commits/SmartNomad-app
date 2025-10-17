import React, { useState } from 'react';
import UserProfile from './UserProfile';
import DataManagementSettings from './DataManagementSettings';
import ProfileDataViewer from './ProfileDataViewer';
import EnhancedProfileForm from './EnhancedProfileForm';
import { Subscription } from '@/types/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, FileText } from 'lucide-react';

interface SettingsProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
  onProfileComplete?: (data: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ subscription, onUpgradeClick, onProfileComplete }) => {
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleProfileEdit = () => {
    setShowProfileForm(true);
  };

  const handleProfileFormComplete = (data: any) => {
    setShowProfileForm(false);
    if (onProfileComplete) {
      onProfileComplete(data);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">Manage your profile, privacy, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="mydata" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Data
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UserProfile subscription={subscription} onUpgradeClick={onUpgradeClick} />
          </TabsContent>

          <TabsContent value="mydata" className="mt-6">
            <ProfileDataViewer onEdit={handleProfileEdit} />
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <DataManagementSettings />
          </TabsContent>
        </Tabs>
      </div>

      {showProfileForm && (
        <EnhancedProfileForm 
          onComplete={handleProfileFormComplete}
          onSkip={() => setShowProfileForm(false)}
        />
      )}
    </>
  );
};

export default Settings;