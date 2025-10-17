import React from 'react';
import UserProfile from './UserProfile';
import DataManagementSettings from './DataManagementSettings';
import { Subscription } from '@/types/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield } from 'lucide-react';

interface SettingsProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ subscription, onUpgradeClick }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your profile, privacy, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <UserProfile subscription={subscription} onUpgradeClick={onUpgradeClick} />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <DataManagementSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;