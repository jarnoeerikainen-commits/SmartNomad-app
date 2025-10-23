import React, { useState } from 'react';
import { Shield, AlertTriangle, Phone, MessageSquare, Lock, Smartphone, CreditCard, Mail, Users, Globe, FileText, ExternalLink, CheckCircle2, ArrowRight, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScenarioCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  immediateSteps: string[];
  severity: 'high' | 'medium' | 'low';
}

interface QuickHelpResource {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  action: string;
}

const CyberHelplineDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [userLocation] = useState('UK'); // This would come from location service

  const scenarios: ScenarioCard[] = [
    {
      id: 'hacked',
      title: 'I\'ve Been Hacked',
      icon: Lock,
      description: 'Email, social media, or banking account compromised',
      immediateSteps: [
        'Change your password immediately',
        'Enable two-factor authentication (2FA)',
        'Check recent account activity',
        'Review connected devices and apps',
        'Notify your contacts about the breach'
      ],
      severity: 'high'
    },
    {
      id: 'fraud',
      title: 'Digital Fraud & Scams',
      icon: CreditCard,
      description: 'Crypto scam, identity theft, or shopping fraud',
      immediateSteps: [
        'Contact your bank immediately',
        'Freeze affected accounts',
        'Document all transactions',
        'Report to Action Fraud (UK) or FBI IC3 (USA)',
        'Save all evidence (emails, messages, receipts)'
      ],
      severity: 'high'
    },
    {
      id: 'harassment',
      title: 'Online Harassment',
      icon: Users,
      description: 'Cyberbullying, stalking, or catfishing',
      immediateSteps: [
        'Block the harasser immediately',
        'Screenshot all evidence',
        'Report to platform administrators',
        'Adjust privacy settings',
        'Contact local authorities if threats made'
      ],
      severity: 'medium'
    },
    {
      id: 'phishing',
      title: 'Suspicious Messages',
      icon: Mail,
      description: 'Phishing emails, vishing calls, or smishing texts',
      immediateSteps: [
        'Do NOT click any links or attachments',
        'Report to email/SMS provider',
        'Delete the message',
        'Scan your device for malware',
        'Verify sender through official channels'
      ],
      severity: 'medium'
    },
    {
      id: 'ransomware',
      title: 'Ransomware & Blackmail',
      icon: AlertTriangle,
      description: 'Device locked or threats of data exposure',
      immediateSteps: [
        'Do NOT pay the ransom',
        'Disconnect device from network',
        'Contact cybersecurity experts immediately',
        'Report to law enforcement',
        'Check for decryption tools online'
      ],
      severity: 'high'
    },
    {
      id: 'lost-device',
      title: 'Lost or Stolen Device',
      icon: Smartphone,
      description: 'Phone, laptop, or tablet missing',
      immediateSteps: [
        'Use remote wipe if available',
        'Change all passwords from another device',
        'Contact your mobile carrier',
        'Enable lost mode on device',
        'Report to local police'
      ],
      severity: 'high'
    }
  ];

  const quickHelpResources: QuickHelpResource[] = [
    {
      id: 'account-recovery',
      title: 'Account Recovery',
      icon: Lock,
      description: 'Step-by-step guides to recover compromised accounts',
      action: 'View Guide'
    },
    {
      id: 'fraud-protection',
      title: 'Fraud Protection',
      icon: Shield,
      description: 'Protect yourself from scams and financial fraud',
      action: 'Learn More'
    },
    {
      id: 'privacy-settings',
      title: 'Privacy Protection',
      icon: Globe,
      description: 'Secure your online presence and personal data',
      action: 'Get Started'
    },
    {
      id: 'device-security',
      title: 'Device Security',
      icon: Smartphone,
      description: 'Secure your devices and protect your data',
      action: 'Setup Now'
    }
  ];

  const emergencyContacts = {
    UK: {
      actionFraud: { phone: '0300 123 2040', name: 'Action Fraud' },
      police: { phone: '999', name: 'Emergency Police' },
      cyberHelpline: { phone: '0808 1641 590', name: 'The Cyber Helpline' }
    },
    USA: {
      fbiIC3: { url: 'www.ic3.gov', name: 'FBI IC3' },
      ftc: { phone: '877-382-4357', name: 'FTC Consumer Protection' },
      cyberHelpline: { phone: '+44 808 164 1590', name: 'The Cyber Helpline' }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/10">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Cyber Helpline</h1>
              <p className="text-muted-foreground">Free expert help for cybercrime victims</p>
            </div>
          </div>
          <Badge variant="destructive" className="text-sm px-4 py-2">
            <LifeBuoy className="h-4 w-4 mr-2" />
            24/7 Available
          </Badge>
        </div>

        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-lg font-semibold">Emergency Cyber Support</AlertTitle>
          <AlertDescription className="text-base mt-2">
            1.5M+ people helped • 80,000+ cases opened • Available in UK & USA
          </AlertDescription>
        </Alert>
      </div>

      {/* Get Help Now Section */}
      <Card className="border-2 border-destructive/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-destructive/10 to-primary/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">Get Help Now</CardTitle>
          </div>
          <CardDescription className="text-base">
            Chat with our AI assistant or connect to a volunteer cybersecurity expert
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              size="lg" 
              className="h-auto py-6 flex-col gap-2 gradient-primary"
            >
              <MessageSquare className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Start AI Chat</div>
                <div className="text-xs opacity-90">Instant automated guidance</div>
              </div>
            </Button>
            <Button 
              size="lg" 
              variant="destructive"
              className="h-auto py-6 flex-col gap-2"
            >
              <Phone className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Emergency Call</div>
                <div className="text-xs opacity-90">Talk to a human expert</div>
              </div>
            </Button>
          </div>
          <div className="mt-4 p-4 bg-accent/50 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-semibold">100% Free Service</span> • Response time under 2 hours • Available in English, Spanish, French
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Your Situation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            What's Your Situation?
          </CardTitle>
          <CardDescription>
            Select the issue you're facing to get immediate step-by-step guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = selectedScenario === scenario.id;
              return (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'border-primary border-2 shadow-lg' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedScenario(isSelected ? null : scenario.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={getSeverityColor(scenario.severity) as any}>
                        {scenario.severity}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{scenario.title}</h3>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    </div>
                    {isSelected && (
                      <Button size="sm" className="w-full" variant="outline">
                        View Steps <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Scenario Details */}
          {selectedScenarioData && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <selectedScenarioData.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{selectedScenarioData.title}</CardTitle>
                    <CardDescription>{selectedScenarioData.description}</CardDescription>
                  </div>
                  <Badge variant={getSeverityColor(selectedScenarioData.severity) as any}>
                    {selectedScenarioData.severity} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Immediate Steps to Take:
                </h4>
                <div className="space-y-2">
                  {selectedScenarioData.immediateSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Expert Help with This Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Quick Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Help Resources
          </CardTitle>
          <CardDescription>
            Preventive guides and security best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickHelpResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 w-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {resource.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Location-Based Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Location-Based Emergency Contacts
          </CardTitle>
          <CardDescription>
            Official reporting channels and emergency services in your region
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* UK Section */}
          {userLocation === 'UK' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-sm">
                  📍 United Kingdom
                </Badge>
                <span className="text-sm text-muted-foreground">Based on your location</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(emergencyContacts.UK).map(([key, contact]) => (
                  <Card key={key} className="border-primary/30 hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Phone className="h-5 w-5 text-primary" />
                        <Badge variant="destructive" className="text-xs">Emergency</Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{contact.name}</h4>
                      <p className="text-lg font-mono font-bold text-primary mb-3">{contact.phone}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="h-3 w-3 mr-2" />
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* USA Section */}
          {userLocation === 'USA' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-sm">
                  📍 United States
                </Badge>
                <span className="text-sm text-muted-foreground">Based on your location</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(emergencyContacts.USA).map(([key, contact]) => {
                  const hasPhone = 'phone' in contact;
                  const hasUrl = 'url' in contact;
                  return (
                    <Card key={key} className="border-primary/30 hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          {hasPhone ? <Phone className="h-5 w-5 text-primary" /> : <Globe className="h-5 w-5 text-primary" />}
                          <Badge variant="destructive" className="text-xs">Emergency</Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{contact.name}</h4>
                        <p className="text-lg font-mono font-bold text-primary mb-3">
                          {hasPhone ? contact.phone : hasUrl ? contact.url : ''}
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          {hasPhone ? <Phone className="h-3 w-3 mr-2" /> : <ExternalLink className="h-3 w-3 mr-2" />}
                          {hasPhone ? 'Call Now' : 'Visit Website'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Global Resources */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              International Resources
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <Card className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Local Police (Emergency)</h5>
                      <p className="text-xs text-muted-foreground mb-2">Most countries: 112 or 911</p>
                    </div>
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Interpol Cybercrime</h5>
                      <p className="text-xs text-muted-foreground mb-2">www.interpol.int/cybercrime</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Trust Indicators */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">1.5M+</div>
            <div className="text-sm text-muted-foreground">People Helped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">80K+</div>
            <div className="text-sm text-muted-foreground">Cases Opened</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">&lt;2hrs</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Always Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CyberHelplineDashboard;