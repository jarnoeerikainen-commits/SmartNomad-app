import React, { useState } from 'react';
import { Phone, MessageCircle, Shield, Clock, Globe, Lock, Scale, AlertCircle, CheckCircle2, X, Ambulance, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SOSServices = () => {
  const [sosModalOpen, setSosModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4 gradient-hero rounded-lg p-8 shadow-large">
        <h1 className="text-4xl font-bold text-primary-foreground">
          Global Guardian: Your 24/7 Lifeline. Anywhere.
        </h1>
        <p className="text-lg text-primary-foreground/90 max-w-3xl mx-auto">
          Travel with absolute peace of mind. From a medical emergency to lost documents, our dedicated experts are just a tap away, ready to solve any crisis, anytime.
        </p>
      </div>

      {/* Two Plans Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Two Simple Plans for Total Freedom</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan 1: Pay-As-You-Protect */}
          <Card className="glass-effect border-2 hover:shadow-large transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-10 w-10 text-primary" />
                <Badge variant="secondary">Flexible</Badge>
              </div>
              <CardTitle className="text-2xl">🛡️ Pay-As-You-Protect</CardTitle>
              <CardDescription className="text-base">Perfect for short trips or trial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>On-demand access to our 24/7 global response center</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>Pay per use for services like emergency document replacement, legal referrals, or concierge-level assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>No subscription, complete flexibility</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" size="lg">
                Learn More About Pay-As-You-Protect
              </Button>
            </CardContent>
          </Card>

          {/* Plan 2: Annual Guardian Membership */}
          <Card className="glass-effect border-2 border-primary hover:shadow-large transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
              RECOMMENDED
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 text-primary">💎</div>
                <Badge className="gradient-success">Premium</Badge>
              </div>
              <CardTitle className="text-2xl">Annual Guardian Membership</CardTitle>
              <CardDescription className="text-base">The ultimate safety net for serious travelers & expats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold text-sm">All Pay-As-You-Protect services, PLUS:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Ambulance className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Emergency Medical Evacuation:</strong> To the nearest adequate facility
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Mortal Repatriation:</strong> Dignified and legally-compliant transfer in the event of death
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Ash Transfer Services:</strong> Compassionate and logistical support
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Crisis Management:</strong> Extraction from political or natural disaster zones
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Proactive Alerts:</strong> Real-time travel risk & security intel for your location
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Legal & Will Referral Network:</strong> Vetted experts for your testament and legal needs abroad
                  </div>
                </li>
              </ul>
              <div className="pt-4 space-y-2">
                <div className="text-3xl font-bold text-center text-primary">$299/yr</div>
                <Button className="w-full gradient-success shadow-medium" size="lg">
                  Start Your Annual Guardian Membership
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl text-center">How It Works: Help in 3 Simple Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Phone className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg">📱 Alert Us</h3>
              <p className="text-muted-foreground">
                Tap the SOS button in the app or call our direct, dedicated line
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">👥 Connect with a Pro</h3>
              <p className="text-muted-foreground">
                You'll be immediately connected to a dedicated, multilingual case manager—a real person, not a bot
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg">🛠️ We Handle It</h3>
              <p className="text-muted-foreground">
                Our team takes over, managing the situation locally and globally until you are safe and the issue is resolved
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immediate Access Section */}
      <Card className="glass-effect border-destructive/50 border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Immediate Access: Your Direct Line to Help
          </CardTitle>
          <CardDescription>Click the button below when you need emergency assistance</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button 
            size="lg" 
            className="gradient-hero text-xl px-12 py-8 h-auto shadow-large hover:shadow-xl transition-all"
            onClick={() => setSosModalOpen(true)}
          >
            <AlertCircle className="h-8 w-8 mr-3" />
            SOS - Get Help Now
          </Button>
        </CardContent>
      </Card>

      {/* Behind the Scenes Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Behind the Scenes: The Smartnomad Promise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤵</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Dedicated Professionals</h3>
                <p className="text-sm text-muted-foreground">
                  Our case managers are crisis-trained experts, not call center scripts
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">🌍 Global Network</h3>
                <p className="text-sm text-muted-foreground">
                  We leverage a vetted, on-the-ground network in over 90 countries to get you help, fast
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">🔒 Privacy & Discretion</h3>
                <p className="text-sm text-muted-foreground">
                  Your situation is handled with the utmost confidentiality and respect
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">⚖️ Full Legal & Logistical Support</h3>
                <p className="text-sm text-muted-foreground">
                  We navigate local authorities, paperwork, and transport so you don't have to
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                "Is this like travel insurance?"
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, it's better. While insurance reimburses you later, we actively manage and pay for the crisis in real-time (e.g., we dispatch and pay for the air ambulance directly). We are the action behind the insurance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                "What happens when I call?"
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A calm, expert will assess your situation, ensure your immediate safety, and then execute a plan using our global resources. We become your remote command center.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                "Can you help with non-medical issues?"
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely. From legal referrals for a will to getting your lost passport replaced, our "concierge of crisis" is here for any serious problem abroad.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <Card className="glass-effect gradient-success text-primary-foreground">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl">Stop Worrying. Start Exploring.</CardTitle>
          <CardDescription className="text-primary-foreground/90 text-lg">
            The world is unpredictable. Your safety net doesn't have to be.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-xl px-12 py-6 h-auto shadow-large hover:shadow-xl"
          >
            Get Protected Now
          </Button>
        </CardContent>
      </Card>

      {/* SOS Modal */}
      <Dialog open={sosModalOpen} onOpenChange={setSosModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              🚨 EMERGENCY ASSISTANCE IS READY
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              You are about to contact the Smartnomad Global Response Center. Our team of professionals is available 24/7 to assist you.
            </DialogDescription>
          </DialogHeader>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <p className="font-semibold">Choose your connection method:</p>
            
            <Button 
              variant="destructive" 
              size="lg" 
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={() => window.location.href = 'tel:+18007627876'}
            >
              <Phone className="h-6 w-6" />
              <div className="text-left flex-1">
                <div className="font-bold">CALL NOW</div>
                <div className="text-sm">+1-800-SMART-SOS (+1-800-762-7876)</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-auto py-4"
            >
              <MessageCircle className="h-6 w-6" />
              <div className="text-left flex-1">
                <div className="font-bold">LIVE CHAT WITH A CASE MANAGER</div>
                <div className="text-sm text-muted-foreground">Connect instantly via chat</div>
              </div>
            </Button>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setSosModalOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating SOS Button - Fixed at bottom */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="gradient-hero rounded-full h-16 w-16 shadow-large hover:shadow-xl animate-pulse"
          onClick={() => setSosModalOpen(true)}
        >
          <AlertCircle className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default SOSServices;
