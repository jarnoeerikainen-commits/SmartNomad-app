import React, { useState } from 'react';
import UserProfile from './UserProfile';
import DataManagementSettings from './DataManagementSettings';
import ProfileDataViewer from './ProfileDataViewer';
import EnhancedProfileForm from './EnhancedProfileForm';
import { Subscription } from '@/types/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Shield, FileText, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SettingsProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
  onProfileComplete?: (data: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ subscription, onUpgradeClick, onProfileComplete }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
          <h2 className="text-3xl font-bold mb-2">{t('common.settings')}</h2>
          <p className="text-muted-foreground">{t('common.manage_profile')}</p>
        </div>

        {/* Translation Manager Alert - Admin Tool */}
        <Alert className="bg-primary/5 border-primary/20">
          <Languages className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">
              Professional Translation Manager - Manage all 13 languages in one place
            </span>
            <Button 
              onClick={() => navigate('/translation-manager')}
              variant="default"
              size="sm"
            >
              <Languages className="mr-2 h-4 w-4" />
              Open Translation Manager
            </Button>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('common.profile')}
            </TabsTrigger>
            <TabsTrigger value="mydata" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('common.my_data')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('common.privacy')}
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