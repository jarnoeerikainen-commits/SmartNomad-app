import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { Country } from '@/types/country';
import { calcSchengenUsage, isSchengenEES, EES_SCHENGEN_DAYS, SchengenStay } from '@/data/eesData';

interface Props {
  countries: Country[];
  onNavigate?: (section: string) => void;
}

/**
 * Compact dashboard widget that surfaces Schengen 90/180 status from EES.
 * Stays silent (returns null) unless the user has at least one Schengen country tracked.
 */
const SchengenEESAlert: React.FC<Props> = ({ countries, onNavigate }) => {
  const stays: SchengenStay[] = useMemo(() =>
    countries.filter(c => isSchengenEES(c.code) && c.lastEntry)
      .map(c => ({ entry: c.lastEntry as string, exit: null, countryCode: c.code }))
  , [countries]);

  const hasSchengen = countries.some(c => isSchengenEES(c.code));
  if (!hasSchengen) return null;

  const usage = useMemo(() => calcSchengenUsage(stays), [stays]);
  const pct = Math.min(100, Math.round((usage.daysUsed / EES_SCHENGEN_DAYS) * 100));

  // Suppress when user is comfortably safe (under 50%) — avoid noise
  if (usage.status === 'safe' && pct < 50) return null;

  const tone = usage.status === 'critical'
    ? { ring: 'border-red-300 dark:border-red-700',     bg: 'bg-red-50/60 dark:bg-red-950/20',     text: 'text-red-700 dark:text-red-300',     Icon: AlertTriangle }
    : usage.status === 'caution'
    ? { ring: 'border-amber-300 dark:border-amber-700', bg: 'bg-amber-50/60 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-300', Icon: ShieldAlert }
    : { ring: 'border-emerald-300 dark:border-emerald-700', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300', Icon: ShieldCheck };

  const headline = usage.status === 'critical'
    ? `Schengen cap reached — ${usage.daysRemaining} day(s) left`
    : usage.status === 'caution'
    ? `Schengen 90-day cap approaching — ${usage.daysRemaining} day(s) left`
    : `Schengen usage at ${pct}% — on track`;

  return (
    <Card className={`border-2 ${tone.ring} ${tone.bg}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <tone.Icon className={`h-5 w-5 ${tone.text} mt-0.5 shrink-0`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{headline}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                EES live tracking · {usage.daysUsed}/{EES_SCHENGEN_DAYS} days in last 180 · verified by EU border system
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${tone.text} font-mono shrink-0`}>{pct}%</Badge>
        </div>
        <Progress value={pct} className="h-2" />
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant={usage.status === 'critical' ? 'destructive' : 'outline'}
            className="text-xs h-8"
            onClick={() => onNavigate?.('ees')}
          >
            Open EES Center <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchengenEESAlert;
