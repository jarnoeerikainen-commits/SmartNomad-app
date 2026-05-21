import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, AlertTriangle, CheckCircle2, Landmark, Clock, DollarSign, Users } from 'lucide-react';

/**
 * Travel Authorisations — pre-arrival electronic permits (ESTA / ETA / ETIAS …)
 *
 * Every "officialUrl" is the ONLY government-issued application portal.
 * Verified against the issuing authority on 21 May 2026. Anything else is a
 * paid middleman and is shown separately under "verified helper services".
 *
 * Sources (one-click verifiable):
 *   US ESTA      — https://esta.cbp.dhs.gov                                  (DHS / CBP)
 *   UK ETA       — https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta (UK Home Office)
 *   EU ETIAS     — https://travel-europe.europa.eu/etias_en                   (European Commission)
 *   Canada eTA   — https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html (IRCC)
 *   Australia ETA— https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601 (Home Affairs)
 *   NZeTA        — https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/nzeta (INZ)
 *   K-ETA        — https://www.k-eta.go.kr/portal/apply/index.do              (Korea Immigration Service)
 */

interface Authorisation {
  id: string;
  code: string;          // ESTA, ETA, ETIAS …
  country: string;
  flag: string;
  fullName: string;
  authority: string;
  officialUrl: string;
  fee: string;
  validity: string;
  processingTime: string;
  whoNeedsIt: string;
  status: 'live' | 'launching';
  launchNote?: string;
  notes?: string;
  lastVerified: string;
}

const AUTHORISATIONS: Authorisation[] = [
  {
    id: 'us-esta',
    code: 'ESTA',
    country: 'United States',
    flag: '🇺🇸',
    fullName: 'Electronic System for Travel Authorization',
    authority: 'U.S. Customs and Border Protection (CBP)',
    officialUrl: 'https://esta.cbp.dhs.gov',
    fee: 'US $21 (US $4 processing + US $17 authorisation)',
    validity: '2 years, or until passport expires',
    processingTime: 'Up to 72 hours — apply at least 72 h before departure',
    whoNeedsIt: 'Visa Waiver Program nationals travelling by air or sea for ≤ 90 days',
    status: 'live',
    notes: 'Only esta.cbp.dhs.gov is the official site. CBP never charges extra "expedite" fees.',
    lastVerified: '21 May 2026',
  },
  {
    id: 'uk-eta',
    code: 'ETA',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fullName: 'UK Electronic Travel Authorisation',
    authority: 'UK Home Office',
    officialUrl: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta',
    fee: '£16',
    validity: '2 years, multiple entries (≤ 6 months per visit)',
    processingTime: 'Usually within 3 working days',
    whoNeedsIt: 'Non-visa nationals visiting, transiting or working short-term in the UK',
    status: 'live',
    notes: 'Apply only via the GOV.UK page or the official "UK ETA" app (Apple App Store / Google Play, publisher: Home Office).',
    lastVerified: '21 May 2026',
  },
  {
    id: 'eu-etias',
    code: 'ETIAS',
    country: 'European Union (Schengen + 30)',
    flag: '🇪🇺',
    fullName: 'European Travel Information and Authorisation System',
    authority: 'European Commission / eu-LISA',
    officialUrl: 'https://travel-europe.europa.eu/etias_en',
    fee: '€20 (free under 18 or over 70)',
    validity: '3 years, or until passport expires',
    processingTime: 'Most decisions within minutes; allow up to 30 days',
    whoNeedsIt: 'Visa-exempt non-EU nationals visiting any of 30 European countries for ≤ 90 days in any 180-day period',
    status: 'launching',
    launchNote: 'Launch: Q4 2026 (European Commission). Any site selling ETIAS today is fraudulent.',
    notes: 'There is only ONE official site: travel-europe.europa.eu. No middleman can apply for ETIAS on your behalf.',
    lastVerified: '21 May 2026',
  },
  {
    id: 'ca-eta',
    code: 'eTA',
    country: 'Canada',
    flag: '🇨🇦',
    fullName: 'Electronic Travel Authorization',
    authority: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html',
    fee: 'CAD $7',
    validity: '5 years, or until passport expires',
    processingTime: 'Most approvals within minutes',
    whoNeedsIt: 'Visa-exempt foreign nationals flying to or transiting through Canada',
    status: 'live',
    notes: 'Only canada.ca charges the official CAD $7 fee. Third-party sites cost CAD $50+.',
    lastVerified: '21 May 2026',
  },
  {
    id: 'au-eta',
    code: 'ETA',
    country: 'Australia',
    flag: '🇦🇺',
    fullName: 'Electronic Travel Authority (subclass 601)',
    authority: 'Australian Department of Home Affairs',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601',
    fee: 'AUD $20 service charge (visa itself is free)',
    validity: '12 months, multiple entries (≤ 3 months per visit)',
    processingTime: 'Most approvals within minutes',
    whoNeedsIt: 'Eligible passport holders visiting for tourism or business',
    status: 'live',
    notes: 'Apply only via the official "Australian ETA" app (publisher: Department of Home Affairs). Web form is via authorised agents only.',
    lastVerified: '21 May 2026',
  },
  {
    id: 'nz-eta',
    code: 'NZeTA',
    country: 'New Zealand',
    flag: '🇳🇿',
    fullName: 'New Zealand Electronic Travel Authority',
    authority: 'Immigration New Zealand (INZ)',
    officialUrl: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/nzeta',
    fee: 'NZD $17 (mobile app) / NZD $23 (web) + NZD $100 IVL',
    validity: '2 years, multiple entries',
    processingTime: 'Up to 72 hours — apply at least 72 h before travel',
    whoNeedsIt: 'Visa-waiver visitors and all transit passengers',
    status: 'live',
    notes: 'Includes mandatory International Visitor Levy (IVL). Only immigration.govt.nz or the official NZeTA app are valid.',
    lastVerified: '21 May 2026',
  },
  {
    id: 'kr-keta',
    code: 'K-ETA',
    country: 'South Korea',
    flag: '🇰🇷',
    fullName: 'Korea Electronic Travel Authorization',
    authority: 'Korea Immigration Service, Ministry of Justice',
    officialUrl: 'https://www.k-eta.go.kr/portal/apply/index.do',
    fee: 'KRW 10,000 (~US $7)',
    validity: '3 years, multiple entries',
    processingTime: 'Up to 72 hours',
    whoNeedsIt: 'Visa-waiver nationals (note: temporary exemption for many countries until 31 Dec 2026)',
    status: 'live',
    notes: 'Only k-eta.go.kr is official. Check the live exemption list before paying.',
    lastVerified: '21 May 2026',
  },
];

const VERIFIED_HELPERS = [
  {
    name: 'iVisa',
    url: 'https://www.ivisa.com',
    role: 'Paid concierge — fills your form, you still pay the government fee on top',
    note: 'Legitimate, but always cheaper to apply directly on the government portal above.',
  },
  {
    name: 'Sherpa° (by Kayak)',
    url: 'https://apply.joinsherpa.com',
    role: 'Aggregator — checks which authorisations your nationality needs',
    note: 'Best used for verification only. Final application should be on the official portal.',
  },
  {
    name: 'CIBT / Newland Chase',
    url: 'https://cibtvisas.com',
    role: 'Corporate immigration partner for businesses and frequent travellers',
    note: 'Verified enterprise provider. Suitable when HR or duty-of-care is involved.',
  },
];

const AuthorisationCard: React.FC<{ a: Authorisation }> = ({ a }) => (
  <Card className="border-l-4 border-l-primary/70 hover:shadow-elegant transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="text-3xl leading-none" aria-hidden>{a.flag}</div>
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
              <span className="font-mono tracking-tight">{a.code}</span>
              <span className="text-muted-foreground">·</span>
              <span>{a.country}</span>
            </CardTitle>
            <div className="text-xs text-muted-foreground mt-0.5">{a.fullName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {a.status === 'launching' ? (
            <Badge variant="outline" className="text-amber-600 border-amber-500/50 bg-amber-500/5">
              <Clock className="h-3 w-3 mr-1" /> {a.launchNote ?? 'Launching soon'}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/50 bg-emerald-500/5">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Live
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <Row icon={<Landmark className="h-3.5 w-3.5" />} label="Issuing authority" value={a.authority} />
        <Row icon={<DollarSign className="h-3.5 w-3.5" />} label="Official fee" value={a.fee} />
        <Row icon={<Clock className="h-3.5 w-3.5" />} label="Validity" value={a.validity} />
        <Row icon={<Clock className="h-3.5 w-3.5" />} label="Processing time" value={a.processingTime} />
        <Row icon={<Users className="h-3.5 w-3.5" />} label="Who needs it" value={a.whoNeedsIt} className="sm:col-span-2" />
      </div>

      {a.notes && (
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
          <span>{a.notes}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Verified {a.lastVerified}
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => window.open(a.officialUrl, '_blank', 'noopener,noreferrer')}
        >
          <Shield className="h-3.5 w-3.5" />
          Apply on official portal
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string; className?: string }> = ({
  icon, label, value, className,
}) => (
  <div className={className}>
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="uppercase tracking-wider text-[10px]">{label}</span>
    </div>
    <div className="text-foreground mt-0.5">{value}</div>
  </div>
);

const TravelAuthorisations: React.FC = () => {
  return (
    <section aria-labelledby="travel-auth-heading" className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 id="travel-auth-heading" className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Travel Authorisations — ESTA · ETA · ETIAS
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Pre-arrival electronic permits. Every link below is the <strong>official government portal</strong>
            {' '}of the issuing authority. SuperNomad never sells these — apply directly, never through a middleman site.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-foreground/80">
          <strong className="text-amber-700 dark:text-amber-400">Scam warning.</strong>{' '}
          Hundreds of paid look-alike sites charge 3–10× the official fee. The only valid portals are listed below.
          If a site is not on this list and asks for your passport, close the tab.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {AUTHORISATIONS.map(a => (
          <AuthorisationCard key={a.id} a={a} />
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Verified helper services (optional, paid)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            These companies are legitimate concierge / aggregator services. They are <strong>not</strong> the
            issuer — you will still pay the official fee on top. Use them only if you want help filling the form.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {VERIFIED_HELPERS.map(h => (
              <button
                key={h.name}
                onClick={() => window.open(h.url, '_blank', 'noopener,noreferrer')}
                className="text-left rounded-md border border-border bg-card hover:bg-muted/40 transition-colors p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{h.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-[11px] text-foreground/80">{h.role}</div>
                <div className="text-[11px] text-muted-foreground">{h.note}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TravelAuthorisations;
