import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Fingerprint, ShieldCheck, ShieldAlert, ExternalLink, AlertTriangle, Eye,
  Clock, FileText, Scale, Lock, Globe2, CheckCircle2, Info,
} from 'lucide-react';
import { Country } from '@/types/country';
import {
  EES_LAUNCH_DATE, EES_FULL_ROLLOUT, EES_DATA_RETENTION_YEARS,
  EES_SCHENGEN_DAYS, EES_OFFICIAL,
  EES_DATA_COLLECTED, EES_SCENARIOS, EES_USER_RIGHTS,
  EES_COUNTRIES, isSchengenEES, calcSchengenUsage, SchengenStay,
} from '@/data/eesData';

interface Props {
  countries?: Country[];
}

const statusTone = {
  safe:     { ring: 'border-emerald-300 dark:border-emerald-700', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300', icon: ShieldCheck },
  caution:  { ring: 'border-amber-300 dark:border-amber-700',     bg: 'bg-amber-50/60 dark:bg-amber-950/20',     text: 'text-amber-700 dark:text-amber-300',     icon: ShieldAlert },
  critical: { ring: 'border-red-400 dark:border-red-700',         bg: 'bg-red-50/60 dark:bg-red-950/20',         text: 'text-red-700 dark:text-red-300',         icon: AlertTriangle },
} as const;

const EESCenter: React.FC<Props> = ({ countries = [] }) => {
  const [showAllRights, setShowAllRights] = useState(false);

  // Build Schengen stays from the user's tracked countries
  const stays: SchengenStay[] = useMemo(() =>
    countries
      .filter(c => isSchengenEES(c.code) && c.lastEntry)
      .map(c => ({ entry: c.lastEntry as string, exit: null, countryCode: c.code }))
  , [countries]);

  const usage = useMemo(() => calcSchengenUsage(stays), [stays]);
  const tone = statusTone[usage.status];
  const ToneIcon = tone.icon;
  const pctUsed = Math.min(100, Math.round((usage.daysUsed / EES_SCHENGEN_DAYS) * 100));

  const trackedSchengen = countries.filter(c => isSchengenEES(c.code));

  return (
    <div className="space-y-6">
      {/* ─── Hero: You are in control ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
              <Fingerprint className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">EES Border Sovereignty Center</h1>
              <p className="text-blue-100 text-sm mt-0.5">Entry/Exit System — your data, your rights, your control</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-emerald-500/80 text-white border-emerald-400/40">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Live since {EES_LAUNCH_DATE}
            </Badge>
            <Badge className="bg-white/15 text-white border-white/30">
              <Clock className="h-3 w-3 mr-1" /> Full rollout {EES_FULL_ROLLOUT}
            </Badge>
            <Badge className="bg-amber-500/80 text-white border-amber-400/40">
              <Eye className="h-3 w-3 mr-1" /> {EES_DATA_RETENTION_YEARS}-year data retention
            </Badge>
            <Badge className="bg-white/15 text-white border-white/30">
              <Globe2 className="h-3 w-3 mr-1" /> 30 Schengen states
            </Badge>
          </div>
          <p className="text-blue-100 text-sm mt-4 max-w-3xl leading-relaxed">
            The EU border is now a data system. Every entry and exit is recorded with biometrics for{' '}
            {EES_DATA_RETENTION_YEARS} years. SuperNomad shows you exactly what is collected, warns you before any cap,
            and links only to official EU channels — never to paid third-party intermediaries.
          </p>
        </div>
      </div>

      {/* ─── Live Schengen 90/180 status ─── */}
      <Card className={`border-2 ${tone.ring} ${tone.bg}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <ToneIcon className={`h-5 w-5 ${tone.text}`} />
              Your Schengen 90/180 status (live)
            </span>
            <Badge variant="outline" className={tone.text}>
              {usage.status === 'safe' && 'On track'}
              {usage.status === 'caution' && 'Approaching cap'}
              {usage.status === 'critical' && 'Action required'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trackedSchengen.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Schengen countries tracked yet</AlertTitle>
              <AlertDescription>
                Add a Schengen country in Country Tracker — SuperNomad will then auto-calculate your 90/180 usage
                using the same rolling window logic as EU border guards.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{usage.daysUsed}<span className="text-base font-normal text-muted-foreground"> / {EES_SCHENGEN_DAYS} days</span></p>
                  <p className="text-xs text-muted-foreground">Used in the last 180 days · {usage.daysRemaining} days remaining</p>
                </div>
                <Badge variant="secondary" className="font-mono">{pctUsed}%</Badge>
              </div>
              <Progress value={pctUsed} className="h-2.5" />
              <div className="flex flex-wrap gap-1.5">
                {trackedSchengen.slice(0, 12).map(c => (
                  <Badge key={c.code} variant="outline" className="text-xs">
                    {c.flag} {c.name}
                  </Badge>
                ))}
              </div>
              <a
                href={EES_OFFICIAL.schengenCalc}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                Verify with the official EU short-stay calculator <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </CardContent>
      </Card>

      {/* ─── What the system collects (transparency layer) ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-blue-600" />
            What the EES collects about you
          </CardTitle>
          <p className="text-xs text-muted-foreground">Sourced from EU Regulation 2017/2226 — verified, no speculation.</p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {EES_DATA_COLLECTED.map((d, i) => (
            <div key={i} className="rounded-lg border bg-card p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{d.label}</p>
                <Badge variant="outline" className="text-[10px] capitalize shrink-0">{d.category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{d.detail}</p>
              <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground pt-1">
                <Clock className="h-3 w-3 mt-0.5 shrink-0" />
                <span>Retention: {d.retention}</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                <Scale className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{d.yourRight}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ─── Scenarios: predictable behavior ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Five scenarios — what happens, what to do
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EES_SCENARIOS.map(s => {
            const t = statusTone[s.status];
            const Icon = t.icon;
            return (
              <div key={s.id} className={`rounded-lg border-2 ${t.ring} ${t.bg} p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${t.text}`} />
                  <p className="font-semibold text-sm">{s.title}</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Trigger</p>
                    <p className="text-muted-foreground">{s.trigger}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">What the system sees</p>
                    <p className="text-muted-foreground">{s.whatTheSystemSees}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">What you should do</p>
                    <p className="text-muted-foreground">{s.whatYouShouldDo}</p>
                  </div>
                </div>
                <a
                  href={s.officialSource}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  Official source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ─── Your legal rights ─── */}
      <Card className="border-emerald-300 dark:border-emerald-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5 text-emerald-600" />
            Your rights under the EES Regulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(showAllRights ? EES_USER_RIGHTS : EES_USER_RIGHTS.slice(0, 3)).map((r, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
          {EES_USER_RIGHTS.length > 3 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAllRights(v => !v)}>
              {showAllRights ? 'Show less' : `Show ${EES_USER_RIGHTS.length - 3} more rights`}
            </Button>
          )}
          <Separator className="my-2" />
          <a
            href={EES_OFFICIAL.dataRights}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            File a Subject Access Request via EDPS <ExternalLink className="h-3 w-3" />
          </a>
        </CardContent>
      </Card>

      {/* ─── Verified-only sources ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-primary" />
            Verified official channels only
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            SuperNomad never links to paid third-party EES services. Below are the only legitimate EU government sources.
          </p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-2">
          {[
            { label: 'EU Travel — EES portal',          url: EES_OFFICIAL.euTravel,      desc: 'European Commission, citizen-facing' },
            { label: 'EU Home Affairs — EES policy',     url: EES_OFFICIAL.euHomeAffairs, desc: 'Legal regulation & rollout status' },
            { label: 'eu-LISA — system operator',        url: EES_OFFICIAL.euLisa,        desc: 'Agency that runs the EES infrastructure' },
            { label: 'EES FAQ',                          url: EES_OFFICIAL.faqEuTravel,   desc: 'Frequently asked questions' },
            { label: 'EDPS — your data protection rights', url: EES_OFFICIAL.dataRights,  desc: 'European Data Protection Supervisor' },
            { label: 'Schengen 90/180 calculator',       url: EES_OFFICIAL.schengenCalc,  desc: 'Official short-stay visa calculator' },
            { label: 'EES vs ETIAS — official comparison', url: EES_OFFICIAL.eesVsEtias,  desc: 'How the two systems differ' },
          ].map((l, i) => (
            <a
              key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium group-hover:text-primary truncate">{l.label}</p>
                <p className="text-xs text-muted-foreground truncate">{l.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
            </a>
          ))}
        </CardContent>
      </Card>

      {/* ─── Anti-scam warning ─── */}
      <Alert className="border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800 dark:text-red-300">Avoid scams</AlertTitle>
        <AlertDescription className="text-xs text-red-700 dark:text-red-400">
          The EES does <strong>not</strong> require any application or fee — biometrics are captured at the border for free.
          Any website asking you to "register for EES" or charging a fee is a scam. Only the {EES_COUNTRIES.length} official Schengen
          border authorities and the EU portals listed above are legitimate.
        </AlertDescription>
      </Alert>

      {/* ─── Cross-link to ETIAS ─── */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">EES is not ETIAS</p>
            <p className="text-xs text-muted-foreground mt-1">
              EES tracks every border crossing with biometrics (live now). ETIAS is the pre-travel authorisation
              you'll need from late 2026. SuperNomad covers both — see the ETIAS Center for the permission layer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EESCenter;
