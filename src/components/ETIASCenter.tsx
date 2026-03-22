import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Shield, Globe2, Search, ExternalLink, AlertTriangle, CheckCircle2,
  Clock, CreditCard, FileText, Info, Plane, Users, MapPin, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  ETIAS_FEE_EUR, ETIAS_VALIDITY_YEARS, ETIAS_MAX_STAY_DAYS, ETIAS_STAY_PERIOD_DAYS,
  ETIAS_LAUNCH_QUARTER, ETIAS_OFFICIAL_URL, ETIAS_WHO_SHOULD_APPLY_URL, ETIAS_FAQ_URL,
  ETIAS_REQUIRING_COUNTRIES, ETIAS_REQUIRED_NATIONALITIES, ETIAS_APPLICATION_FIELDS,
  ETIAS_EXEMPTIONS, needsETIAS, isETIASDestination,
  ETIAS_FEE_EXEMPT_MAX_AGE, ETIAS_FEE_EXEMPT_SENIOR_AGE
} from '@/data/etiasData';

const ETIASCenter: React.FC = () => {
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedNationality, setSelectedNationality] = useState<string | null>(null);
  const [showAllNationalities, setShowAllNationalities] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [showApplicationSteps, setShowApplicationSteps] = useState(false);

  const filteredNationalities = useMemo(() => {
    const q = nationalitySearch.toLowerCase();
    const list = ETIAS_REQUIRED_NATIONALITIES.filter(n =>
      n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q)
    );
    return showAllNationalities ? list : list.slice(0, 12);
  }, [nationalitySearch, showAllNationalities]);

  const filteredDestinations = useMemo(() => {
    const q = destinationSearch.toLowerCase();
    const list = ETIAS_REQUIRING_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
    return showAllDestinations ? list : list.slice(0, 12);
  }, [destinationSearch, showAllDestinations]);

  const eligibilityResult = selectedNationality ? needsETIAS(selectedNationality) : null;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ETIAS Travel Authorisation</h1>
              <p className="text-blue-100 text-sm mt-0.5">European Travel Information & Authorisation System</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> Launching {ETIAS_LAUNCH_QUARTER}
            </Badge>
            <Badge className="bg-amber-500/80 text-white border-amber-400/50">
              <CreditCard className="h-3 w-3 mr-1" /> €{ETIAS_FEE_EUR} Fee
            </Badge>
            <Badge className="bg-emerald-500/80 text-white border-emerald-400/50">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Valid {ETIAS_VALIDITY_YEARS} Years
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Globe2 className="h-3 w-3 mr-1" /> 30 Countries
            </Badge>
          </div>
          <p className="text-blue-100 text-sm mt-4 max-w-2xl leading-relaxed">
            Starting {ETIAS_LAUNCH_QUARTER}, citizens of 62 visa-free countries will need an ETIAS travel authorisation 
            to enter 30 European countries for short stays (up to {ETIAS_MAX_STAY_DAYS} days within {ETIAS_STAY_PERIOD_DAYS} days). 
            Not a visa — a lightweight online pre-screening, similar to the US ESTA.
          </p>
        </div>
      </div>

      {/* Key Facts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: CreditCard, label: 'Application Fee', value: `€${ETIAS_FEE_EUR}`, sub: 'Ages 18–70', color: 'text-amber-600' },
          { icon: Clock, label: 'Processing', value: 'Minutes', sub: 'Most approved instantly', color: 'text-blue-600' },
          { icon: CheckCircle2, label: 'Validity', value: `${ETIAS_VALIDITY_YEARS} Years`, sub: 'Or until passport expires', color: 'text-emerald-600' },
          { icon: Plane, label: 'Max Stay', value: `${ETIAS_MAX_STAY_DAYS} Days`, sub: `Per ${ETIAS_STAY_PERIOD_DAYS}-day period`, color: 'text-purple-600' },
        ].map((fact, i) => (
          <Card key={i} className="text-center">
            <CardContent className="p-4">
              <fact.icon className={`h-6 w-6 mx-auto mb-2 ${fact.color}`} />
              <p className="text-xl font-bold">{fact.value}</p>
              <p className="text-xs font-medium text-foreground">{fact.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{fact.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Eligibility Checker */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Check If You Need ETIAS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Select your nationality to check if you need an ETIAS travel authorisation:</p>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your nationality..."
              value={nationalitySearch}
              onChange={(e) => { setNationalitySearch(e.target.value); setSelectedNationality(null); }}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filteredNationalities.map(n => (
              <Button
                key={n.code}
                size="sm"
                variant={selectedNationality === n.code ? 'default' : 'outline'}
                className="text-xs h-7"
                onClick={() => setSelectedNationality(n.code)}
              >
                {n.flag} {n.name}
              </Button>
            ))}
            {!showAllNationalities && ETIAS_REQUIRED_NATIONALITIES.length > 12 && !nationalitySearch && (
              <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowAllNationalities(true)}>
                +{ETIAS_REQUIRED_NATIONALITIES.length - 12} more <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>

          {eligibilityResult !== null && (
            <div className={`p-4 rounded-lg border-2 ${eligibilityResult
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700'
              : 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700'
            }`}>
              {eligibilityResult ? (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-300">ETIAS Required</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      As a {ETIAS_REQUIRED_NATIONALITIES.find(n => n.code === selectedNationality)?.name} citizen, 
                      you will need an ETIAS travel authorisation to enter any of the 30 European ETIAS countries 
                      starting {ETIAS_LAUNCH_QUARTER}. Fee: €{ETIAS_FEE_EUR} (free for under {ETIAS_FEE_EXEMPT_MAX_AGE + 1} and over {ETIAS_FEE_EXEMPT_SENIOR_AGE}).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">No ETIAS Needed</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                      Your nationality is not on the ETIAS-required list. You may need a visa instead, or you may be an EU citizen exempt from ETIAS.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 30 ETIAS Destination Countries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              30 ETIAS Countries
            </CardTitle>
            <p className="text-xs text-muted-foreground">European countries that require ETIAS</p>
          </CardHeader>
          <CardContent>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search country..."
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filteredDestinations.map(c => (
                <Badge key={c.code} variant="outline" className="text-xs py-1 px-2">
                  {c.flag} {c.name}
                </Badge>
              ))}
              {!showAllDestinations && !destinationSearch && ETIAS_REQUIRING_COUNTRIES.length > 12 && (
                <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => setShowAllDestinations(true)}>
                  +{ETIAS_REQUIRING_COUNTRIES.length - 12} more
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 62 Nationalities That Need ETIAS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-amber-600" />
              62 Nationalities That Need ETIAS
            </CardTitle>
            <p className="text-xs text-muted-foreground">Visa-free nationals who must apply</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="flex flex-wrap gap-1.5">
                {ETIAS_REQUIRED_NATIONALITIES.map(n => (
                  <Badge key={n.code} variant="secondary" className="text-xs py-1 px-2">
                    {n.flag} {n.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Application Process */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              How to Apply for ETIAS
            </span>
            <Button
              variant="ghost" size="sm"
              onClick={() => setShowApplicationSteps(!showApplicationSteps)}
            >
              {showApplicationSteps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showApplicationSteps && (
          <CardContent className="space-y-5">
            {/* Steps */}
            <div className="space-y-4">
              {[
                { step: 1, title: 'Access the Official Portal', desc: 'Go to the official ETIAS website or download the mobile app (available once system launches).', icon: Globe2 },
                { step: 2, title: 'Complete Application Form', desc: 'Fill in personal details, passport info, travel data, health & security questions.', icon: FileText },
                { step: 3, title: 'Pay the Fee', desc: `Pay €${ETIAS_FEE_EUR} (ages 18–70). Free for travellers under 18 and over 70.`, icon: CreditCard },
                { step: 4, title: 'Receive Authorisation', desc: 'Most applications approved within minutes. Linked digitally to your passport — no printing needed.', icon: CheckCircle2 },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <s.icon className="h-4 w-4 text-primary" /> {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Required Information */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" /> Information Required
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ETIAS_APPLICATION_FIELDS.map((field, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    {field}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Fee Details */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-600" /> Fee Structure
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Standard fee (ages 18–70)</span>
                  <span className="font-bold">€{ETIAS_FEE_EUR}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Under 18 years old</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Over 70 years old</span>
                  <span className="font-bold">FREE</span>
                </div>
                <Separator />
                <p className="text-muted-foreground italic">
                  Fee updated from €7 to €20 to account for inflation and new system features. 
                  Payment via credit/debit card at the time of application.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Exemptions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            Who Is Exempt from ETIAS?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {ETIAS_EXEMPTIONS.map((exemption, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                {exemption}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notices */}
      <Card className="border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-300">Important Notices</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-400 text-xs">
                <li>ETIAS is <strong>not yet operational</strong> — launches {ETIAS_LAUNCH_QUARTER}. No applications are being accepted.</li>
                <li>Beware of unofficial websites charging fees — the only official site is <strong>travel-europe.europa.eu</strong>.</li>
                <li>You must have ETIAS approval <strong>before boarding</strong> your flight or starting your journey.</li>
                <li>Carriers (airlines, ferries) will verify your ETIAS authorisation before departure.</li>
                <li>ETIAS is separate from the Entry/Exit System (EES), which records biometrics at the border.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Official Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ExternalLink className="h-5 w-5 text-primary" />
            Official EU Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              { label: 'Official ETIAS Website', url: ETIAS_OFFICIAL_URL, desc: 'European Commission official portal' },
              { label: 'Who Should Apply', url: ETIAS_WHO_SHOULD_APPLY_URL, desc: 'Check eligibility and requirements' },
              { label: 'ETIAS FAQ', url: ETIAS_FAQ_URL, desc: 'Frequently asked questions' },
              { label: 'EES vs ETIAS Differences', url: 'https://home-affairs.ec.europa.eu/news/ees-vs-etias-main-differences-know-travellers-2026-01-29_en', desc: 'Understand both systems' },
              { label: 'EU Home Affairs - ETIAS', url: 'https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/european-travel-information-authorisation-system_en', desc: 'Policy background and regulation' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ETIASCenter;
