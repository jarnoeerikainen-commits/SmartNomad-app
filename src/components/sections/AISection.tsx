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
  const assistants = [
    {
      value: 'assistant',
      title: 'Travel Concierge',
      description: 'Everyday travel help, bookings, local answers, and quick decisions.',
      icon: MessageSquare,
    },
    {
      value: 'doctor',
      title: 'Health Advisor',
      description: 'Travel health, symptoms, medicines, clinics, and wellness guidance.',
      icon: Stethoscope,
    },
    {
      value: 'lawyer',
      title: 'Legal Advisor',
      description: 'Visa, residency, tax, document, and compliance questions.',
      icon: Scale,
    },
    {
      value: 'planner',
      title: 'Trip Planner',
      description: 'Build complete itineraries for business, family, sports, or nomad trips.',
      icon: Plane,
    },
  ];

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
              ? 'Voice + chat with memory. 10,000,000 AI requests / month.'
              : `${(subscription.aiRequestsRemaining ?? 1000000).toLocaleString()} AI requests remaining this month (chat mode). Upgrade to Premium for voice + tax tools.`
            }
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {assistants.map((assistant) => {
          const Icon = assistant.icon;
          const isActive = activeTab === assistant.value;

          return (
            <button
              key={assistant.value}
              type="button"
              onClick={() => setActiveTab(assistant.value)}
              className={`w-full rounded-xl border p-4 text-left transition-all touch-manipulation ${
                isActive
                  ? 'border-primary bg-primary/10 shadow-medium'
                  : 'border-border bg-card hover:bg-muted/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold leading-tight text-foreground">{assistant.title}</h3>
                    {isActive && <Badge variant="secondary" className="shrink-0">Open</Badge>}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{assistant.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden w-full grid-cols-2 md:grid lg:grid-cols-4">
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
