import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, MapPin, Shield, TrendingUp, ArrowRight, Calendar, Users, Lock } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type AgeGroup = 'adult' | 'teen' | 'child' | null;

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [birthYear, setBirthYear] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [parentConsentSent, setParentConsentSent] = useState(false);

  const currentYear = new Date().getFullYear();

  const calculateAgeGroup = (year: number): AgeGroup => {
    const age = currentYear - year;
    if (age >= 18) return 'adult';
    if (age >= 16) return 'teen';
    return 'child';
  };

  const handleBirthYearSubmit = () => {
    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1920 || year > currentYear) return;
    const group = calculateAgeGroup(year);
    setAgeGroup(group);
    localStorage.setItem('userBirthYear', birthYear);
    localStorage.setItem('ageGroup', group);
    if (group === 'child') {
      // Stay on this step, show parental invite
    } else {
      setCurrentStep(1);
    }
  };

  const handleParentalInvite = () => {
    if (!parentEmail.includes('@')) return;
    setParentConsentSent(true);
    // In a real app, this would send an email
  };

  const handleQuickAdultConfirm = () => {
    localStorage.setItem('ageGroup', 'adult');
    localStorage.setItem('hasSeenOnboarding', 'true');
    setAgeGroup('adult');
    setCurrentStep(1);
  };

  const featureSteps = [
    {
      title: 'Welcome to SuperNomad',
      description: 'Your intelligent travel companion for managing visas, tax residency, and travel compliance.',
      icon: MapPin,
      color: 'gradient-primary',
    },
    {
      title: 'Track Your Travels',
      description: 'Add countries you visit and we\'ll automatically track your days, visa requirements, and tax obligations.',
      icon: Shield,
      color: 'gradient-trust',
    },
    {
      title: 'Stay Compliant',
      description: 'Get smart alerts for visa limits, tax residency thresholds, and document renewals.',
      icon: TrendingUp,
      color: 'gradient-sunset',
    },
  ];

  const handleNext = () => {
    if (currentStep < featureSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    // Quick skip = confirm adult for demo
    localStorage.setItem('ageGroup', 'adult');
    localStorage.setItem('hasSeenOnboarding', 'true');
    onComplete();
  };

  // Step 0: Birth year / age verification
  if (currentStep === 0) {
    // Child locked screen
    if (ageGroup === 'child') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 shadow-large animate-scale-in">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-medium">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-4 mb-6 text-center">
                <h2 className="text-2xl font-bold text-foreground">Parental Consent Required</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 16 to use SuperNomad. Ask a parent or guardian to grant access.
                </p>
              </div>
              {!parentConsentSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Parent/Guardian Email</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      placeholder="parent@email.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleParentalInvite} className="w-full" disabled={!parentEmail.includes('@')}>
                    <Users className="mr-2 h-4 w-4" />
                    Send Parental Invite
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-lg bg-accent/50">
                    <p className="text-sm text-foreground font-medium">✅ Invite sent to {parentEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ask your parent to check their email and approve access.</p>
                  </div>
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => { setAgeGroup(null); setBirthYear(''); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                >
                  ← Enter a different year
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Birth year entry screen
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 shadow-large animate-scale-in">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-medium">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="h-8 w-8 p-0 hover:bg-accent">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">What year were you born?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We need this to tailor your experience. Your data stays private.
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <Input
                type="number"
                placeholder="e.g. 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min={1920}
                max={currentYear}
                className="text-center text-lg font-semibold"
                onKeyDown={(e) => e.key === 'Enter' && handleBirthYearSubmit()}
              />
              <Button onClick={handleBirthYearSubmit} className="w-full gradient-primary" disabled={!birthYear || parseInt(birthYear) < 1920 || parseInt(birthYear) > currentYear}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="border-t border-border pt-4">
              <button onClick={handleQuickAdultConfirm} className="text-sm text-primary hover:underline w-full text-center">
                I confirm I am 18 or older →
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Ages 16–17: Utility features only. Under 16: Requires parental consent.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Feature tour steps (1-indexed, map to featureSteps[currentStep - 1])
  const stepIndex = currentStep - 1;
  const step = featureSteps[stepIndex];
  const Icon = step.icon;
  const isLastStep = currentStep === featureSteps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-large animate-scale-in">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center shadow-medium`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="h-8 w-8 p-0 hover:bg-accent">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {featureSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === stepIndex
                    ? 'w-8 bg-primary'
                    : index < stepIndex
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className={`flex-1 ${step.color}`}>
              {isLastStep ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
