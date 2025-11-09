import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Zap,
  Shield,
  Globe,
  Server,
  Smartphone,
  Target,
  CheckCircle2
} from "lucide-react";

export const InvestorDocument = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="outline">Investment Opportunity</Badge>
        <h1 className="text-4xl font-bold mb-4">SuperNomad Travel App</h1>
        <h2 className="text-2xl text-muted-foreground mb-2">Complete Financial Analysis</h2>
        <p className="text-muted-foreground">Development Costs, Operating Expenses & Revenue Projections</p>
      </div>

      {/* Executive Summary */}
      <Card className="p-8 mb-8 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Executive Summary</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            SuperNomad is a comprehensive travel management application targeting digital nomads, 
            frequent travelers, and expatriates. The app provides tax residency tracking, 
            visa management, expense tracking, and essential travel services.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">$100K</div>
              <div className="text-sm">Initial Development</div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">$6K/mo</div>
              <div className="text-sm">Operating @ 250K users</div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">3 months</div>
              <div className="text-sm">Time to Launch</div>
            </div>
          </div>
        </div>
      </Card>

      {/* One-Time Development Costs */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">One-Time Development Costs</h2>
        </div>

        <div className="space-y-6">
          {/* App Store Setup */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              App Store Registration
            </h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Apple Developer Account (yearly)</span>
                <span className="font-semibold">$99</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Google Play Developer (one-time)</span>
                <span className="font-semibold">$25</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$124</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Development Costs */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Development & Implementation
            </h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Capacitor Setup & Configuration</span>
                <span className="font-semibold">20 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Mobile-Specific Features (GPS, Camera, etc.)</span>
                <span className="font-semibold">58 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Mobile UI/UX Optimization</span>
                <span className="font-semibold">50 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Performance & Optimization</span>
                <span className="font-semibold">32 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Testing & Bug Fixes</span>
                <span className="font-semibold">64 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">App Store Preparation</span>
                <span className="font-semibold">26 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Backend Enhancements</span>
                <span className="font-semibold">28 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b bg-muted/30">
                <span className="font-semibold">Total Development Hours</span>
                <span className="font-bold">278 hrs</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-4">
                <span className="font-semibold">Development Cost @ $100/hr (Mid-Level)</span>
                <span className="font-bold text-primary">$27,800</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Marketing & Launch */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Marketing & Initial Launch</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">App Store Assets & Screenshots</span>
                <span className="font-semibold">$1,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Initial Marketing Campaign</span>
                <span className="font-semibold">$5,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">App Store Optimization (ASO)</span>
                <span className="font-semibold">$2,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$8,000</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Legal & Compliance */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Legal & Compliance
            </h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Terms of Service & Privacy Policy</span>
                <span className="font-semibold">$2,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">GDPR Compliance Setup</span>
                <span className="font-semibold">$3,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$5,000</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total One-Time */}
          <div className="bg-primary/10 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">TOTAL ONE-TIME INVESTMENT</span>
              <span className="text-3xl font-bold text-primary">$40,924</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended budget with contingency: <span className="font-semibold">$50,000</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Monthly Operating Costs */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Monthly Operating Costs</h2>
          <Badge variant="secondary">@ 250,000 Users</Badge>
        </div>

        <div className="space-y-6">
          {/* Infrastructure */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Infrastructure & Backend</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Lovable Cloud (Database, Auth, Storage)</span>
                <span className="font-semibold">$800</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">CDN & Asset Delivery</span>
                <span className="font-semibold">$50</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$850</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Services */}
          <div>
            <h3 className="font-semibold text-lg mb-3">AI Services</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Lovable AI Gateway (75K MAU)</span>
                <span className="font-semibold">$650</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$650</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Third-Party APIs */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Third-Party APIs</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Google Maps API (optimized with caching)</span>
                <span className="font-semibold">$800</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Currency Exchange API</span>
                <span className="font-semibold">$200</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">News API</span>
                <span className="font-semibold">$450</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Weather & Location Services</span>
                <span className="font-semibold">$100</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$1,550</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Communications */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Communications</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Email Service (600K emails/month)</span>
                <span className="font-semibold">$510</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Push Notifications</span>
                <span className="font-semibold">$100</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$610</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Monitoring & Security */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Monitoring & Security</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Error Tracking (Sentry)</span>
                <span className="font-semibold">$100</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Analytics (Mixpanel/Amplitude)</span>
                <span className="font-semibold">$240</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Security & WAF</span>
                <span className="font-semibold">$750</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$1,090</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Customer Support</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Help Desk Software</span>
                <span className="font-semibold">$500</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$500</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total Monthly */}
          <div className="bg-primary/10 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">TOTAL MONTHLY INFRASTRUCTURE</span>
              <span className="text-3xl font-bold text-primary">$5,250</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Cost per user:</span>
                <span className="font-semibold">$0.021/month</span>
              </div>
              <div className="flex justify-between">
                <span>Annual infrastructure cost:</span>
                <span className="font-semibold">$63,000</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Projections */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Revenue Projections</h2>
          <Badge variant="secondary">@ 250,000 Users</Badge>
        </div>

        <div className="space-y-6">
          {/* Freemium Model */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Freemium Subscription Model</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">250,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Conversion Rate (Conservative)</span>
                <span className="font-semibold">3%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Paying Subscribers</span>
                <span className="font-semibold">7,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Average Subscription Price</span>
                <span className="font-semibold">$9.99/month</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-4 bg-primary/10 -mx-7 px-7 rounded">
                <span className="font-bold">Monthly Subscription Revenue</span>
                <span className="text-2xl font-bold text-primary">$74,925</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Revenue */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Additional Revenue Streams</h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Affiliate Commissions (Travel Services)</span>
                <span className="font-semibold">$5,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Cold Wallet Affiliates (Tangem, Trezor, Ledger)</span>
                <span className="font-semibold">$2,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Crypto Platform Affiliates (Binance, Crypto.com, Bybit)</span>
                <span className="font-semibold">$3,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">VPN & Email Service Affiliates</span>
                <span className="font-semibold">$2,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Google Ads (Free Users)</span>
                <span className="font-semibold">$8,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Premium Features (One-time purchases)</span>
                <span className="font-semibold">$3,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-primary">$24,500</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total Revenue */}
          <div className="bg-primary/10 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">TOTAL MONTHLY REVENUE</span>
              <span className="text-3xl font-bold text-primary">$99,425</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-primary/20">
              <span className="text-xl font-bold">MONTHLY PROFIT</span>
              <span className="text-3xl font-bold text-green-600">$94,175</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 pt-2">
              <div className="flex justify-between">
                <span>Annual Revenue:</span>
                <span className="font-semibold">$1,193,100</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Profit:</span>
                <span className="font-semibold text-green-600">$1,130,100</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Profit Margin:</span>
                <span className="font-bold text-green-600">94.7%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ROI Analysis */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Return on Investment (ROI)</h2>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Initial Investment</div>
              <div className="text-3xl font-bold">$50,000</div>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Monthly Profit @ 250K Users</div>
              <div className="text-3xl font-bold text-green-600">$94,175</div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-4">Payback Period Analysis</h3>
            <div className="space-y-3 ml-7">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Break-even (at 250K users)</span>
                <span className="font-bold text-primary">0.53 months (~16 days)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Year 1 Profit (after initial investment)</span>
                <span className="font-bold text-green-600">$1,080,100</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">ROI Year 1</span>
                <span className="font-bold text-green-600">2,160%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-4">Growth Scenarios</h3>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Conservative (50K users)</span>
                  <Badge variant="outline">Year 1 Target</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Profit:</span>
                    <span className="font-semibold">$14,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break-even:</span>
                    <span className="font-semibold">3.6 months</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Moderate (150K users)</span>
                  <Badge variant="outline">Year 2 Target</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Profit:</span>
                    <span className="font-semibold">$45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break-even:</span>
                    <span className="font-semibold">1.1 months</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Target (250K users)</span>
                  <Badge>Projected Year 3</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Profit:</span>
                    <span className="font-semibold text-green-600">$77,675</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break-even:</span>
                    <span className="font-semibold text-green-600">0.64 months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Development Timeline</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="bg-primary text-primary-foreground w-20 h-20 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <div className="text-2xl font-bold">M1</div>
              <div className="text-xs">Month 1</div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Setup & Foundation</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Capacitor integration</li>
                <li>Native feature implementation</li>
                <li>Backend infrastructure setup</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-primary text-primary-foreground w-20 h-20 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <div className="text-2xl font-bold">M2</div>
              <div className="text-xs">Month 2</div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Development & Testing</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>UI/UX optimization for mobile</li>
                <li>Performance optimization</li>
                <li>Comprehensive testing</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-primary text-primary-foreground w-20 h-20 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <div className="text-2xl font-bold">M3</div>
              <div className="text-xs">Month 3</div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Launch Preparation</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>App store submission</li>
                <li>Marketing campaign launch</li>
                <li>Beta testing with real users</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-green-600 text-white w-20 h-20 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <div className="text-2xl font-bold">🚀</div>
              <div className="text-xs">Launch</div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Go Live</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Public release on App Store & Google Play</li>
                <li>Initial user acquisition</li>
                <li>Monitoring & optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* 3-Year Exit Strategy */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">3-Year Exit Strategy</h2>
        </div>
        <div className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground">
              Strategic growth plan targeting 10 million free users and 10,000 premium subscribers, 
              positioning SuperNomad as a premier acquisition target for travel tech giants or private equity firms.
            </p>
          </div>

          {/* Year-by-Year Growth Projections */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Growth Trajectory</h3>
            
            {/* Year 1 */}
            <Card className="border-2">
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">Year 1: Foundation & Market Entry</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Free Users</p>
                    <p className="text-2xl font-bold">500,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Users</p>
                    <p className="text-2xl font-bold">1,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Revenue</p>
                    <p className="text-xl font-bold">$118,800/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Affiliate Revenue</p>
                    <p className="text-xl font-bold">$240,000/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Google Ads Revenue</p>
                    <p className="text-xl font-bold">$60,000/year</p>
                  </div>
                </div>
                <div className="pt-2 border-t mt-4">
                  <p className="text-sm text-muted-foreground">Total Annual Revenue</p>
                  <p className="text-2xl font-bold text-primary">$418,800</p>
                </div>
              </div>
            </Card>

            {/* Year 2 */}
            <Card className="border-2">
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">Year 2: Rapid Scaling</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Free Users</p>
                    <p className="text-2xl font-bold">3,000,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Users</p>
                    <p className="text-2xl font-bold">4,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Revenue</p>
                    <p className="text-xl font-bold">$475,200/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Affiliate Revenue</p>
                    <p className="text-xl font-bold">$960,000/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Google Ads Revenue</p>
                    <p className="text-xl font-bold">$360,000/year</p>
                  </div>
                </div>
                <div className="pt-2 border-t mt-4">
                  <p className="text-sm text-muted-foreground">Total Annual Revenue</p>
                  <p className="text-2xl font-bold text-primary">$1,795,200</p>
                </div>
              </div>
            </Card>

            {/* Year 3 */}
            <Card className="border-2 border-primary">
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">Year 3: Market Leadership & Exit</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Free Users</p>
                    <p className="text-2xl font-bold">10,000,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Users</p>
                    <p className="text-2xl font-bold">10,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Revenue</p>
                    <p className="text-xl font-bold">$1,188,000/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Affiliate Revenue</p>
                    <p className="text-xl font-bold">$3,400,000/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Google Ads Revenue</p>
                    <p className="text-xl font-bold">$1,200,000/year</p>
                  </div>
                </div>
                <div className="pt-2 border-t mt-4">
                  <p className="text-sm text-muted-foreground">Total Annual Revenue</p>
                  <p className="text-2xl font-bold text-primary">$5,788,000</p>
                </div>
                <div className="pt-2 border-t mt-4">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-lg font-semibold">0.1% (Free to Premium)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Year 3 Revenue Breakdown</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Affiliate Revenue Streams</h4>
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Flight Booking Commissions (0.5% avg)</span>
                  <span className="font-bold">$600,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Accommodation Bookings (3% avg)</span>
                  <span className="font-bold">$750,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Travel Insurance Referrals</span>
                  <span className="font-bold">$300,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>eSIM & Digital Services</span>
                  <span className="font-bold">$200,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Cold Wallet Affiliates (Tangem, Trezor, Ledger)</span>
                  <span className="font-bold">$450,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Crypto Platform Affiliates (Binance, Crypto.com, Bybit)</span>
                  <span className="font-bold">$800,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>VPN & Email Service Affiliates</span>
                  <span className="font-bold">$250,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Currency Exchange & Banking</span>
                  <span className="font-bold">$50,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                  <span className="font-semibold">Total Affiliate Revenue</span>
                  <span className="font-bold text-xl">$3,400,000</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Google Ads Revenue (Free Users)</h4>
              <div className="grid gap-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Free Users Base</span>
                    <span className="font-semibold">10,000,000</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Avg. Monthly Ad Impressions/User</span>
                    <span className="font-semibold">20</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Effective CPM (Cost per 1000 impressions)</span>
                    <span className="font-semibold">$0.50</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Monthly Ad Revenue</span>
                    <span className="font-bold">$100,000</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                  <span className="font-semibold">Annual Google Ads Revenue</span>
                  <span className="font-bold text-xl">$1,200,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Valuation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Exit Valuation Analysis</h3>
            <div className="space-y-3">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Revenue Multiple (6-8x for SaaS)</span>
                      <span className="text-2xl font-bold">7x</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-xl font-semibold">Estimated Valuation</span>
                      <span className="text-3xl font-bold text-primary">$22.3M - $25.5M</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <div className="p-6">
                    <h4 className="font-semibold mb-2">User Base Value</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      10M users @ $2-3 per user (industry standard)
                    </p>
                    <p className="text-2xl font-bold">$20M - $30M</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <h4 className="font-semibold mb-2">Strategic Premium</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Market position + IP + growth trajectory
                    </p>
                    <p className="text-2xl font-bold">+20-30%</p>
                  </div>
                </Card>
              </div>

              <Card className="border-2 border-primary">
                <div className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">Target Exit Valuation Range</p>
                    <p className="text-4xl font-bold text-primary">$25M - $35M</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on comparable exits: TripIt ($120M), TravelPerk ($1.3B valuation), Hopper ($5B valuation)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Exit Strategy Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Potential Acquirers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Strategic Buyers</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Booking Holdings</strong> - Expand digital nomad segment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Expedia Group</strong> - Add tax compliance features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Airbnb</strong> - Long-term stay tax management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>TripAdvisor</strong> - Comprehensive travel suite</span>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Financial Buyers</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Vista Equity Partners</strong> - SaaS expertise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Accel-KKR</strong> - Travel tech focus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Thoma Bravo</strong> - Software consolidation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span><strong>Insight Partners</strong> - Growth-stage SaaS</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>

          {/* Investment Returns */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Investor Returns</h3>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500">
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Initial Investment</p>
                    <p className="text-2xl font-bold">$100,000</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Exit Value (20% equity)</p>
                    <p className="text-2xl font-bold text-green-600">$5M - $7M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">ROI Multiple</p>
                    <p className="text-3xl font-bold text-green-600">50-70x</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-2">Annualized Return</p>
                  <p className="text-3xl font-bold text-green-600">~140% per year</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Success Factors */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Critical Success Factors</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Achieve 0.1% conversion rate</p>
                  <p className="text-sm text-muted-foreground">Industry benchmark for freemium travel apps</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Scale to 10M users in 36 months</p>
                  <p className="text-sm text-muted-foreground">Average 280K new users per month</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Maintain churn below 5% monthly</p>
                  <p className="text-sm text-muted-foreground">Strong retention through unique value proposition</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Build strategic partnerships</p>
                  <p className="text-sm text-muted-foreground">Booking.com, Airbnb, major travel brands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conclusion */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Investment Conclusion</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            SuperNomad represents a high-potential investment opportunity in the growing digital nomad 
            and international travel market. With a modest initial investment of $50,000 and a 3-month 
            development timeline, the app is positioned to achieve profitability rapidly.
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-background p-4 rounded-lg border border-primary/20">
              <div className="text-sm font-semibold mb-1">Key Strengths</div>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Low initial investment ($50K)</li>
                <li>High profit margins (93.7%)</li>
                <li>Rapid payback period (19 days @ 250K users)</li>
                <li>Scalable infrastructure</li>
                <li>Multiple revenue streams</li>
              </ul>
            </div>
            <div className="bg-background p-4 rounded-lg border border-primary/20">
              <div className="text-sm font-semibold mb-1">Market Opportunity</div>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Growing digital nomad market</li>
                <li>Increasing remote work adoption</li>
                <li>Complex tax compliance needs</li>
                <li>Limited competition in niche</li>
                <li>High willingness to pay</li>
              </ul>
            </div>
          </div>
          <p className="font-semibold text-foreground">
            Expected ROI of 1,764% in Year 1 makes SuperNomad an exceptionally attractive investment 
            with minimal downside risk and substantial upside potential.
          </p>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t text-sm text-muted-foreground">
        <p>Document prepared: {new Date().toLocaleDateString()}</p>
        <p className="mt-2">For investment inquiries: invest@supernomad.app</p>
      </div>
    </div>
  );
};