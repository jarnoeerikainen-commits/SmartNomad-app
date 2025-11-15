import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Phone, CreditCard, Shield, Siren, Bug, ShieldCheck } from 'lucide-react';
import EmergencyContacts from '../EmergencyContacts';
import SOSServices from '../SOSServices';
import EmergencyCardNumbers from '../EmergencyCardNumbers';
import CyberHelplineDashboard from '../CyberHelpline/CyberHelplineDashboard';
import ThreatDashboard from '../ThreatIntelligence/ThreatDashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EmergencySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Emergency Header */}
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl text-destructive">Emergency Services</CardTitle>
              <CardDescription>Quick access to critical safety resources</CardDescription>
            </div>
            <Badge variant="destructive" className="ml-auto">24/7</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            In case of emergency, dial local emergency services first (911, 112, etc.). 
            These tools provide additional support and resources.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="sos" className="flex items-center gap-2">
            <Siren className="h-4 w-4" />
            <span className="hidden sm:inline">SOS</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="cyber" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Cyber</span>
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            <span className="hidden sm:inline">Threats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-6 animate-fade-in">
          <EmergencyContacts />
        </TabsContent>

        <TabsContent value="sos" className="mt-6 animate-fade-in">
          <SOSServices />
        </TabsContent>

        <TabsContent value="cards" className="mt-6 animate-fade-in">
          <EmergencyCardNumbers />
        </TabsContent>

        <TabsContent value="cyber" className="mt-6 animate-fade-in">
          <CyberHelplineDashboard />
        </TabsContent>

        <TabsContent value="threats" className="mt-6 animate-fade-in">
          <ThreatDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencySection;
