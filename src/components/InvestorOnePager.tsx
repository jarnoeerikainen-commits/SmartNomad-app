import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, TrendingUp, Rocket, CheckCircle2, Target } from "lucide-react";

export const InvestorOnePager = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <Globe className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SuperNomad
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-medium">
            The Operating System for Digital Nomads
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary" className="text-sm">AI-Powered</Badge>
            <Badge variant="secondary" className="text-sm">Tax Intelligence</Badge>
            <Badge variant="secondary" className="text-sm">Global Mobility</Badge>
          </div>
        </div>

        {/* Vision */}
        <Card className="p-8 border-2 border-primary/20 shadow-lg">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">The Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                35 million digital nomads navigate complex tax residency rules, visa requirements, and compliance across 195+ countries. 
                <span className="text-foreground font-semibold"> SuperNomad automates this complexity</span>, transforming global mobility from a legal minefield into a competitive advantage.
              </p>
            </div>
          </div>
        </Card>

        {/* Market Opportunity */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Market Opportunity</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">35M+</div>
                  <div className="text-sm text-muted-foreground">Digital Nomads Worldwide</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">$99K</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue Target</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">2,160%</div>
                  <div className="text-sm text-muted-foreground">Year 1 ROI Projection</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What We've Built */}
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <Rocket className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Production-Ready Platform</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Tax Residency Intelligence</div>
                      <div className="text-sm text-muted-foreground">Automatic tracking for 183-day rules across all countries</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">AI Travel Assistant</div>
                      <div className="text-sm text-muted-foreground">Real-time visa, tax & compliance guidance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Smart Alerts System</div>
                      <div className="text-sm text-muted-foreground">Proactive notifications before threshold breaches</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Document Vault</div>
                      <div className="text-sm text-muted-foreground">Secure passport, visa & vaccination tracking</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Expense Management</div>
                      <div className="text-sm text-muted-foreground">Multi-currency tracking with business tax optimization</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Global Services Network</div>
                      <div className="text-sm text-muted-foreground">Curated insurance, banking, VPN & travel partners</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">13-Language Support</div>
                      <div className="text-sm text-muted-foreground">Truly global accessibility</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Native Mobile Ready</div>
                      <div className="text-sm text-muted-foreground">iOS & Android via Capacitor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Technical Excellence */}
        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-3">Technical Foundation</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React 18 + TypeScript</Badge>
                <Badge variant="outline">100+ Components</Badge>
                <Badge variant="outline">Cloud Backend Ready</Badge>
                <Badge variant="outline">Real-time Data</Badge>
                <Badge variant="outline">Enterprise Security</Badge>
                <Badge variant="outline">Scalable Architecture</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* The Ask */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Investment Opportunity</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Raising</div>
                    <div className="text-3xl font-bold text-primary">$200,000</div>
                    <div className="text-sm text-muted-foreground mt-1">20% equity stake</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Use of Funds</div>
                    <div className="text-lg space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Development</span>
                        <span className="font-semibold">$41K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Marketing & Launch</span>
                        <span className="font-semibold">$100K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operations (12 months)</span>
                        <span className="font-semibold">$59K</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                      <div className="text-2xl font-bold">16 Days</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">3-Year Exit Target</div>
                      <div className="text-2xl font-bold">$25M-$35M</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Your Return (20%)</div>
                      <div className="text-2xl font-bold text-primary">$5M-$7M</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Why Now */}
        <Card className="p-8 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Why Now?</h2>
          <div className="space-y-3 text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p><span className="text-foreground font-semibold">Post-COVID mobility boom:</span> Remote work policies made digital nomadism mainstream</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p><span className="text-foreground font-semibold">Regulatory complexity increasing:</span> Countries implementing stricter tax residency enforcement</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p><span className="text-foreground font-semibold">AI enablement:</span> Technology now makes real-time compliance automation feasible</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p><span className="text-foreground font-semibold">No dominant player:</span> Fragmented market with no comprehensive solution</p>
            </div>
          </div>
        </Card>

        {/* Exit Strategy */}
        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-bold mb-3">Strategic Acquirers</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <Badge variant="secondary">TurboTax / Intuit</Badge>
            <Badge variant="secondary">Wise (TransferWise)</Badge>
            <Badge variant="secondary">Revolut</Badge>
            <Badge variant="secondary">SafetyWing</Badge>
            <Badge variant="secondary">Remote / Deel</Badge>
            <Badge variant="secondary">Airbnb</Badge>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 space-y-3">
          <div className="text-sm text-muted-foreground">
            For investment inquiries and detailed financial projections
          </div>
          <div className="text-lg font-semibold">
            investors@supernomad.app
          </div>
          <div className="text-xs text-muted-foreground">
            Confidential - For Accredited Investors Only
          </div>
        </div>
      </div>
    </div>
  );
};