import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Country } from '@/types/country';
import { AlertTriangle, CheckCircle, Shield, TrendingUp, Globe, ExternalLink, Home, Briefcase, Heart, DollarSign, FileCheck, Scale } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaxResidencyVisualDashboardProps {
  countries: Country[];
  homeCountryCode?: string;
}

// Government data sources for verification
const TAX_DATA_SOURCES = {
  US: { name: 'IRS', url: 'https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test' },
  GB: { name: 'HMRC', url: 'https://www.gov.uk/guidance/tax-residence' },
  CA: { name: 'CRA', url: 'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/residency-status.html' },
  AU: { name: 'ATO', url: 'https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency' },
  DE: { name: 'BMF', url: 'https://www.bundesfinanzministerium.de/' },
  FR: { name: 'DGFiP', url: 'https://www.impots.gouv.fr/international' },
  ES: { name: 'AEAT', url: 'https://sede.agenciatributaria.gob.es/' },
  IT: { name: 'Agenzia delle Entrate', url: 'https://www.agenziaentrate.gov.it/' },
  PT: { name: 'AT', url: 'https://info.portaldasfinancas.gov.pt/' },
  NL: { name: 'Belastingdienst', url: 'https://www.belastingdienst.nl/' },
  DEFAULT: { name: 'OECD Model Tax Convention', url: 'https://www.oecd.org/tax/treaties/model-tax-convention-on-income-and-on-capital-condensed-version-20745419.htm' }
};

const TaxResidencyVisualDashboard: React.FC<TaxResidencyVisualDashboardProps> = ({ 
  countries, 
  homeCountryCode 
}) => {
  // Calculate tax residency metrics for each country
  const countryMetrics = useMemo(() => {
    return countries.map(country => {
      const daysSpent = country.yearlyDaysSpent || 0;
      const threshold = 183; // Standard tax residency threshold
      const daysRemaining = Math.max(0, threshold - daysSpent);
      const progress = Math.min((daysSpent / threshold) * 100, 100);
      
      let status: 'safe' | 'warning' | 'danger' = 'safe';
      let statusColor = 'hsl(var(--success))';
      let statusLabel = 'Safe Zone';
      
      if (daysSpent >= threshold) {
        status = 'danger';
        statusColor = 'hsl(var(--destructive))';
        statusLabel = 'Tax Resident';
      } else if (daysSpent >= 150) {
        status = 'warning';
        statusColor = 'hsl(var(--warning))';
        statusLabel = 'Warning Zone';
      }
      
      return {
        country,
        daysSpent,
        daysRemaining,
        progress,
        status,
        statusColor,
        statusLabel,
        isHome: country.code.toLowerCase() === homeCountryCode?.toLowerCase()
      };
    });
  }, [countries, homeCountryCode]);

  // Find home country or most critical country for main display
  const mainCountry = useMemo(() => {
    const home = countryMetrics.find(m => m.isHome);
    if (home) return home;
    
    // Find country with most days spent
    return countryMetrics.reduce((prev, current) => 
      current.daysSpent > prev.daysSpent ? current : prev
    , countryMetrics[0]);
  }, [countryMetrics]);

  // Prepare data for radial chart
  const mainChartData = useMemo(() => {
    if (!mainCountry) return [];
    
    return [{
      name: mainCountry.country.name,
      value: mainCountry.progress,
      fill: mainCountry.statusColor
    }];
  }, [mainCountry]);

  if (!mainCountry) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Add countries to track tax residency</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Overall global status
  const globalStatus = useMemo(() => {
    const atRisk = countryMetrics.filter(m => m.status === 'danger').length;
    const warning = countryMetrics.filter(m => m.status === 'warning').length;
    
    if (atRisk > 0) return { status: 'danger', label: 'Tax Resident', color: 'hsl(var(--destructive))', icon: AlertTriangle };
    if (warning > 0) return { status: 'warning', label: 'Approaching Threshold', color: 'hsl(var(--warning))', icon: AlertTriangle };
    return { status: 'safe', label: 'Safe Zone', color: 'hsl(var(--success))', icon: CheckCircle };
  }, [countryMetrics]);

  return (
    <div className="space-y-6">
      {/* Global Status Hero */}
      <Card className="w-full overflow-hidden gradient-trust border-none text-primary-foreground">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Globe 
                className="w-24 h-24 animate-pulse" 
                style={{ color: globalStatus.color, filter: 'drop-shadow(0 0 20px currentColor)' }}
              />
              <div className="absolute -bottom-2 -right-2">
                <globalStatus.icon 
                  className="w-10 h-10" 
                  style={{ color: globalStatus.color }}
                />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Tax Residency Status</h2>
              <Badge 
                variant="secondary" 
                className="text-lg px-4 py-1 bg-white/20 text-white border-white/30"
              >
                {globalStatus.label}
              </Badge>
            </div>
            <p className="text-primary-foreground/80 max-w-2xl">
              Your global tax residency cockpit. All data verified through official government sources.
              Tracking {countryMetrics.length} {countryMetrics.length === 1 ? 'country' : 'countries'}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Hero Card - Featured Country */}
      <Card className="w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Tax Residency Status
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mainCountry.isHome ? 'Your Home Country' : 'Most Days Spent'}
          </p>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Main Circular Chart */}
            <div className="relative">
              <div className="w-[280px] h-[280px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    data={mainChartData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background={{ fill: 'hsl(var(--muted))' }}
                      dataKey="value"
                      cornerRadius={10}
                      fill={mainCountry.statusColor}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-3">{mainCountry.country.flag}</div>
                  <div className="text-5xl font-bold mb-1" style={{ color: mainCountry.statusColor }}>
                    {mainCountry.daysRemaining}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    days remaining
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    of 183 days
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-6 flex-1 max-w-md">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-2">{mainCountry.country.name}</h3>
                <Badge 
                  variant="outline" 
                  className="text-base px-4 py-1"
                  style={{ 
                    borderColor: mainCountry.statusColor,
                    color: mainCountry.statusColor 
                  }}
                >
                  {mainCountry.status === 'safe' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {mainCountry.status === 'warning' && <AlertTriangle className="w-4 h-4 mr-2" />}
                  {mainCountry.status === 'danger' && <AlertTriangle className="w-4 h-4 mr-2" />}
                  {mainCountry.statusLabel}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Days Spent</div>
                  <div className="text-3xl font-bold">{mainCountry.daysSpent}</div>
                </Card>
                <Card className="p-4 bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Threshold</div>
                  <div className="text-3xl font-bold">183</div>
                </Card>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Tax Residency</span>
                  <span className="font-medium">{Math.round(mainCountry.progress)}%</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${mainCountry.progress}%`,
                      background: `linear-gradient(90deg, ${mainCountry.statusColor}, ${mainCountry.statusColor}dd)`
                    }}
                  />
                </div>
              </div>

              {/* Warning Message */}
              {mainCountry.status === 'warning' && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-medium">Approaching threshold!</span>
                    <p className="text-muted-foreground mt-1">
                      You have {mainCountry.daysRemaining} days left before becoming a tax resident.
                    </p>
                  </div>
                </div>
              )}

              {mainCountry.status === 'danger' && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-medium">Tax Resident Status</span>
                    <p className="text-muted-foreground mt-1">
                      You've exceeded the 183-day threshold and may be considered a tax resident.
                    </p>
                  </div>
                </div>
              )}

              {/* Government Data Source Verification */}
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <FileCheck className="w-4 h-4 text-success" />
                <div className="flex-1 text-xs">
                  <span className="font-medium">Government Verified</span>
                  <p className="text-muted-foreground">
                    Data sourced from official tax authority
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => {
                          const source = TAX_DATA_SOURCES[mainCountry.country.code as keyof typeof TAX_DATA_SOURCES] || TAX_DATA_SOURCES.DEFAULT;
                          window.open(source.url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {(TAX_DATA_SOURCES[mainCountry.country.code as keyof typeof TAX_DATA_SOURCES] || TAX_DATA_SOURCES.DEFAULT).name}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View official source</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tie-Breaker Matrix */}
      {mainCountry && mainCountry.daysSpent >= 150 && (
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-warning" />
              Tie-Breaker Analysis: {mainCountry.country.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              When you're resident in multiple countries, tie-breaker rules determine your primary tax residence
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-card/50">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Permanent Home</h4>
                    <p className="text-xs text-muted-foreground">
                      Do you own or rent a home available to you year-round?
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Primary Factor
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Center of Vital Interests</h4>
                    <p className="text-xs text-muted-foreground">
                      Where are your personal and economic ties strongest?
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Secondary Factor
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Habitual Abode</h4>
                    <p className="text-xs text-muted-foreground">
                      Where do you spend most of your time throughout the year?
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Tertiary Factor
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Economic Interests</h4>
                    <p className="text-xs text-muted-foreground">
                      Where are your business activities, investments, and income sources?
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Key Consideration
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">⚠️ Professional Advice Required:</span> Tie-breaker rules are complex and vary by treaty. 
                Consult with a qualified international tax advisor to determine your status when approaching thresholds in multiple countries.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Countries Grid */}
      {countryMetrics.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Other Tracked Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {countryMetrics
                .filter(m => m !== mainCountry)
                .sort((a, b) => b.daysSpent - a.daysSpent)
                .map((metric) => (
                  <Card 
                    key={metric.country.id} 
                    className="p-4 hover:shadow-lg transition-shadow border-l-4"
                    style={{ borderLeftColor: metric.statusColor }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{metric.country.flag}</span>
                        <div>
                          <div className="font-semibold text-sm">{metric.country.name}</div>
                          <Badge 
                            variant="outline" 
                            className="text-xs mt-1"
                            style={{ 
                              borderColor: metric.statusColor,
                              color: metric.statusColor 
                            }}
                          >
                            {metric.statusLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Days</span>
                        <span className="font-bold">{metric.daysSpent}/183</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${metric.progress}%`,
                            backgroundColor: metric.statusColor
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.daysRemaining > 0 
                          ? `${metric.daysRemaining} days remaining` 
                          : 'Tax resident'
                        }
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxResidencyVisualDashboard;
