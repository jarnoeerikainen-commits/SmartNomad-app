import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ArrowRight, CheckCircle2, Hotel, Plane, Scale, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Country } from '@/types/country';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { DEMO_BOOKINGS_CHANGED_EVENT, DemoBookingStore, type StoredDemoBooking } from '@/services/DemoBookingStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MorningBriefingProps {
  countries: Country[];
  onNavigate: (section: string) => void;
}

type Tone = 'ok' | 'warn' | 'alert';

const toneStyles: Record<Tone, { ring: string; bg: string; dot: string; text: string; label: string }> = {
  ok: { ring: 'border-emerald-500/40', bg: 'bg-emerald-500/5', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', label: 'Clear' },
  warn: { ring: 'border-amber-500/50', bg: 'bg-amber-500/5', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', label: 'Review' },
  alert: { ring: 'border-red-500/50', bg: 'bg-red-500/5', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', label: 'Action' },
};

interface BriefingCardProps {
  icon: React.ElementType;
  title: string;
  headline: string;
  detail: string;
  tone: Tone;
  cta: string;
  onClick: () => void;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ icon: Icon, title, headline, detail, tone, cta, onClick }) => {
  const style = toneStyles[tone];
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`group relative h-auto min-h-[164px] w-full justify-start whitespace-normal rounded-lg border ${style.ring} ${style.bg} p-4 text-left hover:bg-muted/40 hover:shadow-md`}
    >
      <div className="flex h-full w-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background/80 ${style.ring}`}>
              <Icon className={`h-4 w-4 ${style.text}`} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
              <div className={`flex items-center gap-1.5 text-[11px] font-medium ${style.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />{style.label}
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="line-clamp-2 font-display text-xl leading-tight text-foreground md:text-2xl">{headline}</div>
          <div className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{detail}</div>
        </div>
        <div className="mt-3 text-[11px] font-medium text-foreground/70">{cta} →</div>
      </div>
    </Button>
  );
};

const money = (amount: number, currency: string) => `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
const dateLabel = (value: string) => format(new Date(value), 'd MMM yyyy');

const BookingDossier = ({ booking, open, onOpenChange }: { booking: StoredDemoBooking | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
  if (!booking) return null;
  const { result, bookingType } = booking;
  const { order, payment } = result;
  const Icon = bookingType === 'flight' ? Plane : Hotel;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <div className="border-b bg-muted/30 p-5">
          <SheetHeader className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">SIMULATED</Badge>
              <Badge variant="outline">NO REAL BOOKING</Badge>
              <Badge variant="secondary" className="capitalize">{bookingType}</Badge>
            </div>
            <SheetTitle className="flex items-center gap-2 font-display text-2xl"><Icon className="h-5 w-5 text-primary" />{order.itinerary.destinationLabel}</SheetTitle>
            <SheetDescription>{order.itinerary.originLabel} → {order.itinerary.destinationLabel} · {dateLabel(order.itinerary.departureLocal)} – {dateLabel(order.itinerary.arrivalLocal)}</SheetDescription>
          </SheetHeader>
        </div>
        <div className="space-y-5 p-5 text-sm">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Supplier and service</p><p className="mt-1 font-semibold">{order.itinerary.carrierOrProperty}</p><p className="text-xs">{order.itinerary.serviceOrRoom} · {order.itinerary.fareOrRate}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Demo references</p><p className="mt-1 font-semibold">{order.publicOrderId}</p><p className="break-all text-xs">Supplier: {order.supplierOrderId}</p></div>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Complete itinerary</h3>
            <div className="rounded-lg border p-3 text-xs"><p>{dateLabel(order.itinerary.departureLocal)} · {order.itinerary.originLabel}</p><p className="my-1 text-muted-foreground">{order.itinerary.duration}</p><p>{dateLabel(order.itinerary.arrivalLocal)} · {order.itinerary.destinationLabel}</p>{order.itinerary.checkIn && <p className="mt-2 text-muted-foreground">Check-in: {order.itinerary.checkIn}</p>}{order.itinerary.checkOut && <p className="text-muted-foreground">Check-out: {order.itinerary.checkOut}</p>}</div>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Included</h3>
            <div className="grid gap-2 sm:grid-cols-2">{order.included.map((item) => <div key={item} className="flex items-start gap-2 text-xs"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />{item}</div>)}</div>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Full price record</h3>
            <div className="rounded-lg border p-3">{order.lineItems.map((item) => <div key={item.id} className="flex justify-between gap-3 py-1 text-xs"><span>{item.label}{!item.mandatory && <span className="text-muted-foreground"> · optional</span>}</span><span className="font-medium">{money(item.amount, item.currency)}</span></div>)}<div className="mt-2 flex justify-between gap-3 border-t pt-3 font-bold"><span>Simulated total</span><span>{money(order.amount, order.currency)}</span></div></div>
          </section>
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Traveller</p><p className="mt-1 font-semibold">{order.traveller.displayName} · {order.traveller.citizenship}</p><p className="text-xs">{order.traveller.city} · passport {order.traveller.passport}</p><p className="mt-1 text-[10px] text-muted-foreground">Masked demo data only</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Approval and payment</p><p className="mt-1 font-semibold">Approval recorded</p><p className="text-xs">{payment.fundingLabel} · {payment.rail}</p><p className="mt-1 text-[10px] text-muted-foreground">No card charged and no funds moved</p></div>
          </section>
          <section className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs"><p className="font-semibold">Status</p><p className="mt-1">Reconciliation {order.reconciliationStatus} · payment simulated · no ticket or room issued</p><p className="mt-2 text-muted-foreground">{order.cancellationTerms}</p></section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MorningBriefing: React.FC<MorningBriefingProps> = ({ countries, onNavigate }) => {
  const [stats, setStats] = useState(() => ThreatIntelligenceService.getStatistics());
  const [inDanger, setInDanger] = useState(() => ThreatIntelligenceService.isUserInDangerZone());
  const [bookings, setBookings] = useState<StoredDemoBooking[]>(() => DemoBookingStore.read());
  const [dossierOpen, setDossierOpen] = useState(false);

  useEffect(() => {
    const refreshThreats = () => {
      setStats(ThreatIntelligenceService.getStatistics());
      setInDanger(ThreatIntelligenceService.isUserInDangerZone());
    };
    const refreshBookings = () => setBookings(DemoBookingStore.read());
    const id = window.setInterval(refreshThreats, 60_000);
    window.addEventListener(DEMO_BOOKINGS_CHANGED_EVENT, refreshBookings);
    window.addEventListener('storage', refreshBookings);
    return () => {
      window.clearInterval(id);
      window.removeEventListener(DEMO_BOOKINGS_CHANGED_EVENT, refreshBookings);
      window.removeEventListener('storage', refreshBookings);
    };
  }, []);

  const nextBooking = useMemo(() => bookings[0] || null, [bookings]);
  const tripHeadline = nextBooking ? `${nextBooking.bookingType === 'flight' ? '✈' : '▣'} ${nextBooking.result.order.itinerary.destinationLabel}` : 'No approved demo booking';
  const tripDetail = nextBooking
    ? `${dateLabel(nextBooking.result.order.itinerary.departureLocal)} · ${nextBooking.result.order.itinerary.carrierOrProperty} · ${money(nextBooking.result.order.amount, nextBooking.result.order.currency)}`
    : 'Approved demo flights and hotels will appear here.';

  const currentYear = new Date().getFullYear();
  const daysThisYear = countries.reduce((sum, country) => sum + (country.yearlyDaysSpent || 0), 0);
  const remainingTax = Math.max(0, 183 - daysThisYear);
  const taxTone: Tone = daysThisYear >= 183 ? 'alert' : daysThisYear >= 146 ? 'warn' : 'ok';
  const taxDetail = taxTone === 'alert' ? `Tax residency threshold reached in ${currentYear}.` : `${remainingTax} days of headroom this year.`;

  const nearby = stats.activeNearby || 0;
  const critical = stats.critical || 0;
  const threatTone: Tone = inDanger || critical > 0 ? 'alert' : nearby > 0 ? 'warn' : 'ok';
  const threatHeadline = threatTone === 'alert' ? `${critical} critical · ${nearby} nearby` : nearby > 0 ? `${nearby} alert${nearby > 1 ? 's' : ''} nearby` : 'No threats nearby';
  const threatDetail = threatTone === 'alert' ? 'Critical incidents detected. Tap to view actions.' : nearby > 0 ? 'Non-critical incidents within 100 km of your location.' : 'All monitored sources clear within 100 km.';

  return (
    <section aria-label="Home status" className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <BriefingCard icon={nextBooking?.bookingType === 'hotel' ? Hotel : Plane} title="Next Trip" headline={tripHeadline} detail={tripDetail} tone="ok" cta={nextBooking ? 'Open full details' : 'Plan with Concierge'} onClick={() => nextBooking ? setDossierOpen(true) : onNavigate('ai-planner')} />
      <BriefingCard icon={Scale} title="Tax Days" headline={`${daysThisYear} / 183`} detail={taxDetail} tone={taxTone} cta="Open Tax Hub" onClick={() => onNavigate('tax-residency')} />
      <BriefingCard icon={threatTone === 'ok' ? ShieldCheck : ShieldAlert} title="Threats Near You" headline={threatHeadline} detail={threatDetail} tone={threatTone} cta="Open Threat Intelligence" onClick={() => onNavigate('threats')} />
      <BookingDossier booking={nextBooking} open={dossierOpen} onOpenChange={setDossierOpen} />
    </section>
  );
};

export default MorningBriefing;
