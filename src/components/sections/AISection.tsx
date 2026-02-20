import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Stethoscope, Scale, Plane, MessageSquare } from 'lucide-react';
import { AITravelDoctor } from '../AITravelDoctor';
import { AITravelLawyer } from '../AITravelLawyer';
import AITravelPlanner from '../AITravelPlanner';
import AITravelAssistant from '../AITravelAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/types/subscription';

interface AISectionProps {
  subscription: Subscription;
  onUpgradeClick: () => void;
}

const AISection: React.FC<AISectionProps> = ({ subscription, onUpgradeClick }) => {
  const [activeTab, setActiveTab] = useState('assistant');
  const isPremium = subscription.tier !== 'free';

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* AI Header */}
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Assistants</CardTitle>
              <CardDescription>Powered by advanced AI for personalized travel advice</CardDescription>
            </div>
            {!isPremium && (
              <Badge variant="secondary" className="ml-auto cursor-pointer" onClick={onUpgradeClick}>
                Upgrade for More
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isPremium 
              ? 'Access all AI-powered advisors for comprehensive travel support.'
              : `${subscription.aiRequestsRemaining || 0} AI requests remaining this month. Upgrade for unlimited access.`
            }
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="lawyer" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Legal</span>
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Planner</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="mt-6 animate-fade-in">
          <AITravelAssistant />
        </TabsContent>

        <TabsContent value="doctor" className="mt-6 animate-fade-in">
          <AITravelDoctor />
        </TabsContent>

        <TabsContent value="lawyer" className="mt-6 animate-fade-in">
          <AITravelLawyer subscription={subscription} onUpgradeClick={onUpgradeClick} />
        </TabsContent>

        <TabsContent value="planner" className="mt-6 animate-fade-in">
          <AITravelPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISection;
