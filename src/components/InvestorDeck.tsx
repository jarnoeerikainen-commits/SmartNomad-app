import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, DollarSign, Target, Calendar, Award } from "lucide-react";

const InvestorDeck = () => {
  // Financial Model Parameters
  const INITIAL_USERS = 5000000;
  const MONTHLY_GROWTH_RATE = 0.03;
  const SUBSCRIPTION_RATE = 0.01; // 1% convert to paid
  const PREMIUM_RATE = 0.001; // 0.1% convert to premium
  const BASIC_ANNUAL_PRICE = 1; // $1 USD
  const PREMIUM_ANNUAL_PRICE = 12; // $12 USD

  // Calculate projections
  const calculateProjections = () => {
    const projections = [];
    let currentUsers = INITIAL_USERS;

    for (let month = 0; month <= 36; month++) {
      if (month > 0) {
        currentUsers = currentUsers * (1 + MONTHLY_GROWTH_RATE);
      }

      const basicSubscribers = Math.floor(currentUsers * SUBSCRIPTION_RATE);
      const premiumSubscribers = Math.floor(currentUsers * PREMIUM_RATE);
      const totalSubscribers = basicSubscribers + premiumSubscribers;

      const basicRevenue = (basicSubscribers * BASIC_ANNUAL_PRICE) / 12; // Monthly
      const premiumRevenue = (premiumSubscribers * PREMIUM_ANNUAL_PRICE) / 12; // Monthly
      const monthlyRevenue = basicRevenue + premiumRevenue;
      const annualRevenue = monthlyRevenue * 12;

      projections.push({
        month,
        year: Math.floor(month / 12) + 1,
        totalUsers: Math.floor(currentUsers),
        basicSubscribers,
        premiumSubscribers,
        totalSubscribers,
        monthlyRevenue: Math.floor(monthlyRevenue),
        annualRevenue: Math.floor(annualRevenue),
      });
    }

    return projections;
  };

  const projections = calculateProjections();
  const year1 = projections[12];
  const year2 = projections[24];
  const year3 = projections[36];

  // Operating costs (conservative estimate)
  const calculateOperatingCosts = (users: number) => {
    const hostingPerUser = 0.05 / 12; // $0.05 per user per year
    const support = 10000; // Base support costs
    const marketing = Math.floor(users * 0.001); // Marketing scales with users
    return Math.floor(users * hostingPerUser + support + marketing);
  };

  const year1Costs = calculateOperatingCosts(year1.totalUsers) * 12;
  const year2Costs = calculateOperatingCosts(year2.totalUsers) * 12;
  const year3Costs = calculateOperatingCosts(year3.totalUsers) * 12;

  const year1Profit = year1.annualRevenue - year1Costs;
  const year2Profit = year2.annualRevenue - year2Costs;
  const year3Profit = year3.annualRevenue - year3Costs;

  // Exit valuation (10x annual revenue multiple)
  const exitValuation = year3.annualRevenue * 10;

  const downloadDeck = () => {
    const content = `
      SMARTNOMAD INVESTOR DECK
      ========================

      EXECUTIVE SUMMARY
      -----------------
      SmartNomad is a comprehensive travel management platform targeting digital nomads,
      frequent travelers, and remote workers. With an initial user base of 5 million users,
      we're positioned for rapid growth in the $1.3T global travel market.

      FINANCIAL PROJECTIONS
      ---------------------

      Year 1 (Month 12):
      • Total Users: ${year1.totalUsers.toLocaleString()}
      • Basic Subscribers (1%): ${year1.basicSubscribers.toLocaleString()}
      • Premium Subscribers (0.1%): ${year1.premiumSubscribers.toLocaleString()}
      • Annual Revenue: $${year1.annualRevenue.toLocaleString()}
      • Operating Costs: $${year1Costs.toLocaleString()}
      • Net Profit: $${year1Profit.toLocaleString()}

      Year 2 (Month 24):
      • Total Users: ${year2.totalUsers.toLocaleString()}
      • Basic Subscribers: ${year2.basicSubscribers.toLocaleString()}
      • Premium Subscribers: ${year2.premiumSubscribers.toLocaleString()}
      • Annual Revenue: $${year2.annualRevenue.toLocaleString()}
      • Operating Costs: $${year2Costs.toLocaleString()}
      • Net Profit: $${year2Profit.toLocaleString()}

      Year 3 (Month 36):
      • Total Users: ${year3.totalUsers.toLocaleString()}
      • Basic Subscribers: ${year3.basicSubscribers.toLocaleString()}
      • Premium Subscribers: ${year3.premiumSubscribers.toLocaleString()}
      • Annual Revenue: $${year3.annualRevenue.toLocaleString()}
      • Operating Costs: $${year3Costs.toLocaleString()}
      • Net Profit: $${year3Profit.toLocaleString()}

      GROWTH METRICS
      --------------
      • Monthly User Growth: 3%
      • Conversion Rate (Basic): 1%
      • Conversion Rate (Premium): 0.1%
      • 36-Month User Growth: ${Math.round(((year3.totalUsers - INITIAL_USERS) / INITIAL_USERS) * 100)}%
      • 36-Month Revenue CAGR: ${Math.round((Math.pow(year3.annualRevenue / year1.annualRevenue, 1/2) - 1) * 100)}%

      EXIT STRATEGY
      -------------
      Projected Exit Valuation (10x Revenue Multiple): $${exitValuation.toLocaleString()}

      Target Acquirers:
      • Booking.com / Booking Holdings
      • Expedia Group
      • Airbnb
      • TripAdvisor
      • Google Travel
      • Microsoft (Teams integration)

      Alternative Exit: IPO at >$500M valuation

      COMPETITIVE ADVANTAGES
      ----------------------
      • First-mover advantage in digital nomad space
      • Comprehensive tax residency tracking
      • Integrated travel services marketplace
      • Strong user retention through compliance tools
      • Network effects from growing user base

      REVENUE MODEL
      -------------
      • Basic Subscription: $1/year (1% conversion)
      • Premium Subscription: $12/year (0.1% conversion)
      • Future Revenue Streams:
        - Affiliate commissions (insurance, transport, services)
        - Premium features (AI assistant, document vault)
        - Enterprise B2B subscriptions
        - API access for third parties

      KEY MILESTONES
      --------------
      • Month 6: 5.8M users, $48K MRR
      • Month 12: 6.7M users, $56K MRR
      • Month 18: 7.8M users, $65K MRR
      • Month 24: 9.0M users, $75K MRR
      • Month 30: 10.5M users, $87K MRR
      • Month 36: 12.1M users, $101K MRR

      INVESTMENT OPPORTUNITY
      ----------------------
      We're seeking strategic partners to accelerate growth through:
      • Marketing and user acquisition
      • Product development and AI features
      • Strategic partnerships with travel providers
      • International expansion

      Contact: investors@smartnomad.com
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartNomad-Investor-Deck.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          SmartNomad Investor Deck
        </h1>
        <p className="text-xl text-muted-foreground">
          3-Year Financial Projections & Exit Strategy
        </p>
        <Button onClick={downloadDeck} className="gap-2">
          <Download className="w-4 h-4" />
          Download Full Deck
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Starting Users</p>
              <p className="text-2xl font-bold">5M</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
              <p className="text-2xl font-bold">3%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Year 3 Revenue</p>
              <p className="text-2xl font-bold">${(year3.annualRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Exit Valuation</p>
              <p className="text-2xl font-bold">${(exitValuation / 1000000).toFixed(0)}M</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 3-Year Projections */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          3-Year Financial Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Year 1 */}
          <div className="space-y-4 p-6 border rounded-lg bg-card">
            <h3 className="text-xl font-bold text-primary">Year 1</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">{year1.totalUsers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Subscribers</p>
                <p className="text-lg font-semibold">{year1.totalSubscribers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {year1.basicSubscribers.toLocaleString()} Basic + {year1.premiumSubscribers.toLocaleString()} Premium
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-bold text-green-600">${year1.annualRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operating Costs</p>
                <p className="text-lg">${year1Costs.toLocaleString()}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-xl font-bold">${year1Profit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Year 2 */}
          <div className="space-y-4 p-6 border rounded-lg bg-card">
            <h3 className="text-xl font-bold text-primary">Year 2</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">{year2.totalUsers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Subscribers</p>
                <p className="text-lg font-semibold">{year2.totalSubscribers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {year2.basicSubscribers.toLocaleString()} Basic + {year2.premiumSubscribers.toLocaleString()} Premium
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-bold text-green-600">${year2.annualRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operating Costs</p>
                <p className="text-lg">${year2Costs.toLocaleString()}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-xl font-bold">${year2Profit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Year 3 */}
          <div className="space-y-4 p-6 border-2 border-primary rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Year 3</h3>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">{year3.totalUsers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Subscribers</p>
                <p className="text-lg font-semibold">{year3.totalSubscribers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {year3.basicSubscribers.toLocaleString()} Basic + {year3.premiumSubscribers.toLocaleString()} Premium
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-bold text-green-600">${year3.annualRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operating Costs</p>
                <p className="text-lg">${year3Costs.toLocaleString()}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-xl font-bold">${year3Profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Growth Metrics */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Growth Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">36-Month User Growth</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round(((year3.totalUsers - INITIAL_USERS) / INITIAL_USERS) * 100)}%
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Revenue CAGR</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round((Math.pow(year3.annualRevenue / year1.annualRevenue, 1/2) - 1) * 100)}%
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Year 3 Profit Margin</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round((year3Profit / year3.annualRevenue) * 100)}%
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Subscriber Conversion</p>
            <p className="text-2xl font-bold text-primary">1.1%</p>
          </div>
        </div>
      </Card>

      {/* Exit Strategy */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Exit Strategy & Valuation
        </h2>
        <div className="space-y-6">
          <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
            <p className="text-sm text-muted-foreground mb-2">Projected Exit Valuation (10x Revenue Multiple)</p>
            <p className="text-4xl font-bold text-primary">${(exitValuation / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on Year 3 Annual Revenue: ${year3.annualRevenue.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Strategic Acquirers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Booking.com / Booking Holdings:</strong> Expand digital nomad services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Expedia Group:</strong> Add compliance & long-term stay features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Airbnb:</strong> Integrate with long-term rental platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>TripAdvisor:</strong> Enhance travel planning tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Google Travel:</strong> Add to Google ecosystem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Microsoft:</strong> Teams/Outlook integration for remote workers</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Alternative Exit Options</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>IPO:</strong> Target valuation &gt;$500M at profitable scale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>PE Acquisition:</strong> Growth equity at 8-12x revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>SPAC Merger:</strong> Fast path to public markets</span>
                </li>
              </ul>

              <h3 className="font-semibold mt-6 mb-3">Key Value Drivers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>12M+ active users with strong retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Profitable with positive cash flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Unique dataset on digital nomad behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Network effects and high switching costs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Breakdown */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Key Milestone Projections</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Month</th>
                <th className="text-right p-2">Total Users</th>
                <th className="text-right p-2">Subscribers</th>
                <th className="text-right p-2">MRR</th>
                <th className="text-right p-2">ARR</th>
              </tr>
            </thead>
            <tbody>
              {[6, 12, 18, 24, 30, 36].map(month => {
                const data = projections[month];
                return (
                  <tr key={month} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Month {month}</td>
                    <td className="text-right p-2">{data.totalUsers.toLocaleString()}</td>
                    <td className="text-right p-2">{data.totalSubscribers.toLocaleString()}</td>
                    <td className="text-right p-2">${data.monthlyRevenue.toLocaleString()}</td>
                    <td className="text-right p-2">${data.annualRevenue.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-primary/5">
        <h2 className="text-2xl font-bold mb-4">Investment Opportunity</h2>
        <p className="text-muted-foreground mb-4">
          Seeking strategic partners to accelerate growth and achieve market leadership in the digital nomad space.
        </p>
        <p className="font-semibold">Contact: investors@smartnomad.com</p>
      </Card>
    </div>
  );
};

export default InvestorDeck;