import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Shield, Globe, Calculator, FileText, Heart, 
  Briefcase, CreditCard, MapPin, Plane, Users, TrendingUp 
} from 'lucide-react';

const InvestorSummary = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Travel Assistant",
      description: "GPT-5 powered travel planning, booking, and 24/7 support",
      value: "$500K+ annual AI API costs at scale"
    },
    {
      icon: Calculator,
      title: "Tax Residency Intelligence",
      description: "Automated tracking for Schengen, US, Canada + 180+ countries",
      value: "Replace $2K-5K/year tax advisors"
    },
    {
      icon: Shield,
      title: "Legal & Health AI",
      description: "Instant visa requirements, health protocols, legal advice",
      value: "$300-1K per consultation replaced"
    },
    {
      icon: Globe,
      title: "Global Service Integration",
      description: "Banking, insurance, transport, accommodation APIs",
      value: "15-30% affiliate revenue per booking"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Passport, visa, vaccination tracking with smart alerts",
      value: "Prevent $500-5K in visa/document penalties"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Auto-tracking, timezone sync, local services discovery",
      value: "Save 10-20 hours monthly in planning"
    }
  ];

  const metrics = [
    { label: "Target Market", value: "35M+ Digital Nomads", trend: "+40% YoY" },
    { label: "Market Size", value: "$1.2T Travel Tech", trend: "2025" },
    { label: "ARPU Potential", value: "$180-300/year", trend: "Premium" },
    { label: "User Acquisition", value: "$15-30 CAC", trend: "Organic+Paid" },
    { label: "Gross Margin", value: "75-85%", trend: "SaaS Model" },
    { label: "Payback Period", value: "2-4 months", trend: "Best-in-class" }
  ];

  const developmentValue = [
    {
      component: "AI Integration Layer",
      status: "Production-Ready",
      value: "$150K-250K",
      time: "6-9 months"
    },
    {
      component: "Tax Intelligence Engine",
      status: "Production-Ready",
      value: "$200K-350K",
      time: "9-12 months"
    },
    {
      component: "Service API Integrations",
      status: "Production-Ready",
      value: "$100K-200K",
      time: "6-8 months"
    },
    {
      component: "Mobile App (iOS/Android)",
      status: "Capacitor-Ready",
      value: "$80K-150K",
      time: "4-6 months"
    },
    {
      component: "Backend Infrastructure",
      status: "Supabase Production",
      value: "$120K-180K",
      time: "8-10 months"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="gradient-premium text-white px-4 py-2 text-lg">
          Investment Opportunity
        </Badge>
        <h1 className="text-5xl font-bold gradient-text">
          SuperNomad: The Ultimate Travel Intelligence Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Production-ready AI-powered platform serving digital nomads, expats, and global travelers
        </p>
      </div>

      {/* Key Metrics */}
      <Card className="glass-morphism border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Market Opportunity & Unit Economics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-card border">
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-2xl font-bold text-primary mt-1">{metric.value}</div>
                <div className="text-xs text-green-500 mt-1">{metric.trend}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Production-Ready Features (What's Built)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 rounded-lg bg-card border hover:border-primary/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-premium flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      Value: {feature.value}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Value */}
      <Card className="glass-morphism border-2 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-green-500" />
            Development Investment Already Made
          </CardTitle>
          <p className="text-muted-foreground">
            What it would cost to build this from scratch today
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {developmentValue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card border">
                <div className="flex-1">
                  <div className="font-semibold">{item.component}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.time} development time</div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    {item.status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{item.value}</div>
                    <div className="text-xs text-muted-foreground">market value</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-lg gradient-mesh border-2 border-primary mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">Total Development Value</div>
                  <div className="text-muted-foreground mt-1">
                    37+ months of development • Production-ready codebase
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold gradient-text">$650K-$1.1M</div>
                  <div className="text-sm text-green-500 mt-1">Ready to scale immediately</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Ask */}
      <Card className="glass-morphism border-2 border-primary/30 gradient-mesh">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-8 w-8 text-primary" />
            Investment Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Seeking</h3>
              <div className="text-3xl font-bold gradient-text">$250K-500K</div>
              <p className="text-muted-foreground">
                Seed round to scale user acquisition, enhance AI features, and expand market reach
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Use of Funds</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span><strong>40%</strong> User Acquisition & Marketing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span><strong>30%</strong> AI & Feature Enhancement</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span><strong>20%</strong> Team Expansion (2-3 hires)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span><strong>10%</strong> Infrastructure & Operations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t space-y-4">
            <h3 className="text-xl font-semibold">Projected 24-Month Returns</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border text-center">
                <div className="text-sm text-muted-foreground">Users</div>
                <div className="text-2xl font-bold text-primary mt-1">50K-100K</div>
              </div>
              <div className="p-4 rounded-lg bg-card border text-center">
                <div className="text-sm text-muted-foreground">Annual Revenue</div>
                <div className="text-2xl font-bold text-primary mt-1">$2M-5M</div>
              </div>
              <div className="p-4 rounded-lg bg-card border text-center">
                <div className="text-sm text-muted-foreground">Valuation</div>
                <div className="text-2xl font-bold text-primary mt-1">$10M-20M</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Strategic Advantages</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Production-ready platform (no prototype risk)",
                "Massive addressable market (35M+ users)",
                "Multiple revenue streams (SaaS + affiliates)",
                "High retention (daily use case for travelers)",
                "AI moat (proprietary tax intelligence)",
                "Clear exit path (Booking.com, Airbnb, Amex)"
              ].map((advantage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="glass-morphism text-center">
        <CardContent className="py-8">
          <h3 className="text-2xl font-semibold mb-2">Ready to Join the Journey?</h3>
          <p className="text-muted-foreground mb-6">
            Contact us to receive the full investor deck and financial projections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:invest@supernomad.com" 
              className="px-8 py-3 rounded-lg gradient-premium text-white font-semibold hover:shadow-glow transition-all"
            >
              Request Investor Deck
            </a>
            <a 
              href="mailto:founders@supernomad.com" 
              className="px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-all"
            >
              Schedule Meeting
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorSummary;
