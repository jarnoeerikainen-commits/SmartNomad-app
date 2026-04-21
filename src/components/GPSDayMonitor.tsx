import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  MapPin, Navigation, AlertTriangle, CheckCircle2, Activity,
  TrendingUp, Calendar, Edit3, Plus, Sparkles, Globe2, Clock, Zap,
} from 'lucide-react';
import { Country } from '@/types/country';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/hooks/use-toast';
import { CountrySelector } from './CountrySelector';

interface GPSDayMonitorProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onUpdateCountryLimit: (id: string, newLimit: number) => void;
  /** Optional setter to bump daysSpent when GPS detects a country day */
  onIncrementDay?: (countryId: string) => void;
}

type RiskLevel = 'safe' | 'monitor' | 'warning' | 'critical' | 'over';

const riskFromPct = (pct: number): RiskLevel => {
  if (pct >= 100) return 'over';
  if (pct >= 90) return 'critical';
  if (pct >= 75) return 'warning';
  if (pct >= 50) return 'monitor';
  return 'safe';
};

const RISK_META: Record<RiskLevel, { label: string; ring: string; text: string; bg: string; stroke: string }> = {
  safe:     { label: 'Safe',     ring: 'ring-emerald-400/40',  text: 'text-emerald-600',  bg: 'bg-emerald-50',  stroke: 'hsl(152 69% 38%)' },
  monitor:  { label: 'Monitor',  ring: 'ring-sky-400/40',      text: 'text-sky-600',      bg: 'bg-sky-50',      stroke: 'hsl(192 82% 38%)' },
  warning:  { label: 'Warning',  ring: 'ring-amber-400/50',    text: 'text-amber-600',    bg: 'bg-amber-50',    stroke: 'hsl(38 92% 50%)'  },
  critical: { label: 'Critical', ring: 'ring-orange-500/50',   text: 'text-orange-600',   bg: 'bg-orange-50',   stroke: 'hsl(20 90% 52%)'  },
  over:     { label: 'Over Limit',ring: 'ring-destructive/60', text: 'text-destructive',  bg: 'bg-destructive/10', stroke: 'hsl(0 80% 58%)' },
};

const QUICK_CAPS = [
  { label: 'Schengen', days: 90 },
  { label: 'Tax 183', days: 183 },
  { label: 'Annual', days: 365 },
  { label: 'Tourist', days: 30 },
];

/* ---------- SVG Donut Chart ---------- */
const DonutChart: React.FC<{
  value: number;
  max: number;
  size?: number;
  stroke?: string;
  flag?: string;
}> = ({ value, max, size = 120, stroke = 'hsl(var(--primary))', flag }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(var(--muted))" strokeWidth="8"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {flag ? (
          <>
            <span className="text-2xl leading-none">{flag}</span>
            <span className="text-xs font-bold text-foreground mt-0.5">{Math.round(pct)}%</span>
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">of {max}</span>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------- Per-country card ---------- */
const CountryMonitorCard: React.FC<{
  country: Country;
  isCurrent: boolean;
  onUpdateLimit: (id: string, n: number) => void;
}> = ({ country, isCurrent, onUpdateLimit }) => {
  const pct = country.dayLimit > 0 ? (country.daysSpent / country.dayLimit) * 100 : 0;
  const risk = riskFromPct(pct);
  const meta = RISK_META[risk];
  const remaining = Math.max(country.dayLimit - country.daysSpent, 0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(country.dayLimit.toString());

  const save = () => {
    const n = parseInt(draft);
    if (n > 0 && n <= 365) {
      onUpdateLimit(country.id, n);
      setEditing(false);
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-large ${isCurrent ? 'ring-2 ring-primary' : `ring-1 ${meta.ring}`}`}>
      {/* Risk stripe */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: meta.stroke }} />

      {isCurrent && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          Live
        </div>
      )}

      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <DonutChart
            value={country.daysSpent}
            max={country.dayLimit}
            size={104}
            stroke={meta.stroke}
            flag={country.flag}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base sm:text-lg text-foreground truncate">{country.name}</h4>
            <p className="text-xs text-muted-foreground mb-2 truncate">{country.reason}</p>
            <Badge variant="outline" className={`${meta.text} ${meta.bg} border-0 font-semibold mb-3`}>
              {risk === 'over' || risk === 'critical' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
              {meta.label}
            </Badge>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted/40 rounded-lg p-2">
                <div className="text-lg font-bold text-foreground leading-tight">{country.daysSpent}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Used</div>
              </div>
              <div className="bg-muted/40 rounded-lg p-2">
                <div className={`text-lg font-bold leading-tight ${meta.text}`}>{remaining}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Left</div>
              </div>
            </div>
          </div>
        </div>

        {/* Limit editor */}
        <div className="mt-4 pt-3 border-t border-border/50">
          {editing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                min={1} max={365}
                className="h-8 text-sm"
                autoFocus
              />
              <Button size="sm" onClick={save} className="h-8">Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setDraft(country.dayLimit.toString()); setEditing(false); }} className="h-8">×</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Cap: <span className="font-semibold text-foreground">{country.dayLimit} days</span>
              </span>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-7 text-xs gap-1">
                <Edit3 className="w-3 h-3" /> Edit cap
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------- Main page ---------- */
const GPSDayMonitor: React.FC<GPSDayMonitorProps> = ({
  countries, onAddCountry, onUpdateCountryLimit, onIncrementDay,
}) => {
  const { location, isLoading, refreshLocation, error } = useLocation();
  const { toast } = useToast();
  const [showSelector, setShowSelector] = useState(false);
  const [defaultCap, setDefaultCap] = useState(90);

  // Identify currently-tracked country matching GPS location
  const currentTracked = useMemo(
    () => countries.find(c => location && c.code.toUpperCase() === location.country_code?.toUpperCase()),
    [countries, location]
  );
  const isUntracked = !!location && !currentTracked && location.country_code !== 'XX';

  // Auto-log: bump daysSpent once per UTC day per detected country
  useEffect(() => {
    if (!location || !currentTracked || !onIncrementDay) return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `gps-day-logged:${currentTracked.id}:${today}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    onIncrementDay(currentTracked.id);
    toast({
      title: `📍 Day logged for ${currentTracked.name}`,
      description: `GPS detected presence — ${currentTracked.daysSpent + 1}/${currentTracked.dayLimit} days used.`,
    });
  }, [location?.country_code, currentTracked?.id]);

  // Sort: warnings first
  const sorted = useMemo(() => {
    return [...countries].sort((a, b) => {
      const pa = a.dayLimit > 0 ? a.daysSpent / a.dayLimit : 0;
      const pb = b.dayLimit > 0 ? b.daysSpent / b.dayLimit : 0;
      return pb - pa;
    });
  }, [countries]);

  // Aggregate stats
  const stats = useMemo(() => {
    const atRisk = countries.filter(c => c.dayLimit > 0 && c.daysSpent / c.dayLimit >= 0.75).length;
    const overLimit = countries.filter(c => c.dayLimit > 0 && c.daysSpent >= c.dayLimit).length;
    const totalDays = countries.reduce((s, c) => s + c.daysSpent, 0);
    const totalCap = countries.reduce((s, c) => s + c.dayLimit, 0);
    return { atRisk, overLimit, totalDays, totalCap };
  }, [countries]);

  const handleQuickAdd = () => setShowSelector(true);

  const handleSelectCountry = (code: string, name: string, flag: string) => {
    const country: Country = {
      id: `country-${code}-${Date.now()}`,
      code, name, flag,
      dayLimit: defaultCap,
      daysSpent: 0,
      reason: defaultCap === 183 ? 'Tax residence tracking' : defaultCap === 90 ? 'Schengen area limit' : 'Tourist visa limit',
      lastUpdate: null,
      countTravelDays: true,
      yearlyDaysSpent: 0,
      lastEntry: null,
      totalEntries: 0,
      followEmbassyNews: true,
      countingMode: 'days',
      partialDayRule: 'full',
      countArrivalDay: true,
      countDepartureDay: true,
    };
    onAddCountry(country);
    setShowSelector(false);
  };

  return (
    <>
      <CountrySelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleSelectCountry}
        existingCountries={countries}
        maxCountries={50}
      />

      <div className="space-y-5">
        {/* Hero — GPS status */}
        <Card className="overflow-hidden border-0 shadow-large" style={{ background: 'var(--gradient-hero)' }}>
          <CardContent className="p-5 sm:p-7 text-primary-foreground">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">GPS Day Monitor</h2>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-white/90 mb-4">
                  Auto-logging your days in each country via GPS. Stay within visa & tax limits effortlessly.
                </p>
                {isLoading ? (
                  <div className="text-sm text-white/80 flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" /> Detecting location…
                  </div>
                ) : location ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">{location.city}, {location.country}</span>
                    </div>
                    {currentTracked && (
                      <div className="flex items-center gap-2 bg-emerald-500/30 backdrop-blur px-3 py-2 rounded-lg border border-white/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Tracked · {currentTracked.daysSpent}/{currentTracked.dayLimit} days</span>
                      </div>
                    )}
                    {isUntracked && (
                      <Button size="sm" onClick={handleQuickAdd} className="bg-white text-primary hover:bg-white/90 gap-1.5">
                        <Plus className="w-4 h-4" /> Track {location.country}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button size="sm" onClick={refreshLocation} variant="secondary" className="gap-1.5">
                    <Navigation className="w-4 h-4" /> Enable GPS
                  </Button>
                )}
              </div>

              {/* Aggregate stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 min-w-[260px]">
                <div className="text-center bg-white/15 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl sm:text-3xl font-bold">{countries.length}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mt-0.5">Countries</div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur rounded-xl p-3">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.totalDays}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mt-0.5">Days Used</div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur rounded-xl p-3">
                  <div className={`text-2xl sm:text-3xl font-bold ${stats.atRisk > 0 ? 'text-amber-200' : ''}`}>{stats.atRisk}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mt-0.5">At Risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical warnings */}
        {stats.overLimit > 0 && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="w-5 h-5" />
            <AlertTitle className="font-bold">⚠️ {stats.overLimit} {stats.overLimit === 1 ? 'country has' : 'countries have'} exceeded the day cap</AlertTitle>
            <AlertDescription>
              You may be at risk of overstaying or triggering tax residency. Review highlighted countries below.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick-add bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 mr-auto">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Quick add country with cap:</span>
              </div>
              {QUICK_CAPS.map(qc => (
                <Button
                  key={qc.label}
                  variant={defaultCap === qc.days ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setDefaultCap(qc.days); setShowSelector(true); }}
                  className="gap-1.5"
                >
                  {qc.label} <Badge variant="secondary" className="ml-0.5">{qc.days}d</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Country grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map(country => (
              <CountryMonitorCard
                key={country.id}
                country={country}
                isCurrent={location?.country_code?.toUpperCase() === country.code.toUpperCase()}
                onUpdateLimit={onUpdateCountryLimit}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">No countries tracked yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Add countries you visit to monitor day caps automatically. GPS will auto-log your presence each day.
              </p>
              <Button size="lg" onClick={handleQuickAdd} className="gap-2">
                <Plus className="w-5 h-5" /> Add Your First Country
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comparison bar chart */}
        {sorted.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Cap Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sorted.map(c => {
                const pct = c.dayLimit > 0 ? Math.min((c.daysSpent / c.dayLimit) * 100, 100) : 0;
                const meta = RISK_META[riskFromPct(pct)];
                return (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{c.daysSpent}/{c.dayLimit}</span>
                        <span className={`font-bold ${meta.text}`}>{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: meta.stroke }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* How it works */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">How GPS day-counting works</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Your GPS location is checked every 5 minutes (and auto-fallback to IP).</li>
                  <li>When you're inside a tracked country, that day is logged once (per UTC day).</li>
                  <li>Warnings appear at 75%, critical at 90%, over-limit at 100% of your cap.</li>
                  <li>VPN detected? You'll see a banner — disable for accurate compliance tracking.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GPSDayMonitor;
