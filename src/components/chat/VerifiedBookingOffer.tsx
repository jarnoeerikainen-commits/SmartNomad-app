import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, CreditCard, ExternalLink, Hotel, Loader2, MapPin, Plane, RefreshCcw, ShieldCheck, WalletCards } from 'lucide-react';
import { TravelCommerceService, type CommerceOffer, type DemoBookingResult, type PaymentRail } from '@/services/TravelCommerceService';
import { DemoBookingStore } from '@/services/DemoBookingStore';
import RideBookingCard from '@/components/chat/RideBookingCard';
import { useToast } from '@/hooks/use-toast';

interface Props {
  search: { bookingType: 'flight' | 'hotel'; origin?: string; destination: string; startDate: string; endDate?: string; adults?: number; cabin?: 'economy' | 'premium_economy' | 'business' | 'first' };
}

type TransferState = 'unanswered' | 'arranged' | 'not-needed' | 'find';
const money = (amount: number, currency: string) => `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
const localDate = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

const TransferChoice = ({ label, value, onChange }: { label: string; value: TransferState; onChange: (value: TransferState) => void }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-medium">{label}</p>
    <Select value={value} onValueChange={(next) => onChange(next as TransferState)}>
      <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="unanswered">Choose status</SelectItem>
        <SelectItem value="arranged">Already arranged</SelectItem>
        <SelectItem value="not-needed">Not needed</SelectItem>
        <SelectItem value="find">Find a ride</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export const VerifiedBookingOffer: React.FC<Props> = ({ search }) => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<CommerceOffer[]>([]);
  const [selected, setSelected] = useState<CommerceOffer | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [rail, setRail] = useState<PaymentRail>('tokenized-card');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<DemoBookingResult | null>(null);
  const [outboundTransfer, setOutboundTransfer] = useState<TransferState>('unanswered');
  const [arrivalTransfer, setArrivalTransfer] = useState<TransferState>('unanswered');
  const [executing, setExecuting] = useState(false);
  const { bookingType, origin, destination, startDate, endDate, adults, cabin } = search;

  const load = useCallback(async () => {
    setLoading(true); setResult(null); setSelectedServiceIds([]);
    try {
      setOffers(await TravelCommerceService.search({ bookingType, origin, destination, startDate, endDate, adults, cabin }));
    } catch (error) {
      toast({ title: 'Offer search unavailable', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [adults, bookingType, cabin, destination, endDate, origin, startDate, toast]);

  useEffect(() => { void load(); }, [load]);

  const reviewTotal = useMemo(() => selected
    ? selected.amount + selected.optionalServices.filter((service) => selectedServiceIds.includes(service.id)).reduce((sum, service) => sum + service.amount, 0)
    : 0, [selected, selectedServiceIds]);

  const toggleService = (id: string) => setSelectedServiceIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  const approve = async () => {
    if (!selected) return;
    setExecuting(true);
    try {
      await TravelCommerceService.prepare(selected);
      await TravelCommerceService.approve(selected);
      const response = await TravelCommerceService.executeDemo(selected, rail, selectedServiceIds);
      DemoBookingStore.save(selected.bookingType, response);
      setResult(response); setDialogOpen(false);
      setOutboundTransfer('unanswered'); setArrivalTransfer('unanswered');
      toast({ title: 'Demo record complete', description: response.message });
    } catch (error) {
      toast({ title: 'Booking stopped safely', description: error instanceof Error ? error.message : 'The supplier did not confirm.', variant: 'destructive' });
    } finally { setExecuting(false); }
  };

  if (loading) return <div className="my-2 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking authorized supplier-shaped demo offers…</div>;

  return <div className="my-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-primary" />Verified offer workflow <Badge variant="outline">SIMULATED</Badge></div>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => void load()} aria-label="Refresh offers"><RefreshCcw className="h-3.5 w-3.5" /></Button>
    </div>
    {offers.map((offer) => {
      const Icon = offer.bookingType === 'flight' ? Plane : Hotel;
      return <Card key={offer.offerId} className="border-primary/20 p-3">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5"><p className="text-sm font-semibold">{offer.title}</p><Badge variant="outline" className="text-[9px] uppercase">Demo data</Badge></div>
            <p className="mt-0.5 text-xs text-muted-foreground">{offer.summary}</p>
            <p className="mt-1 text-xs">{offer.itinerary.carrierOrProperty} · {offer.itinerary.serviceOrRoom}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Includes {offer.included.join(' · ')}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground"><span>{offer.supplier}</span><span>·</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />15-minute demo quote</span><a className="inline-flex items-center gap-1 text-primary" href={offer.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink className="h-3 w-3" /></a></div>
          </div>
          <div className="shrink-0 text-right"><p className="text-base font-bold">{money(offer.amount, offer.currency)}</p><p className="text-[9px] text-muted-foreground">all mandatory fees</p><Button size="sm" className="mt-2 h-8 text-xs" onClick={() => { setSelected(offer); setSelectedServiceIds([]); setDialogOpen(true); }}>Review</Button></div>
        </div>
      </Card>;
    })}

    {result && <Card className="border-success/30 bg-success/5 p-4 space-y-4" data-testid="completed-booking-record">
      <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold">Simulation record complete</p><Badge variant="outline">NO REAL BOOKING</Badge></div><p className="text-xs text-muted-foreground">{result.order.publicOrderId} · {result.order.supplier} · reconciled demo reference {result.order.supplierOrderId}</p></div></div>
      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div className="space-y-1"><p className="font-semibold">Traveller readiness</p><p>{result.order.traveller.displayName} · Finnish citizen · {result.order.traveller.city}</p><p className="text-muted-foreground">Passport {result.order.traveller.passport} · masked demo status only</p></div>
        <div className="space-y-1"><p className="font-semibold">{result.order.itinerary.carrierOrProperty}</p><p>{result.order.itinerary.fareOrRate} · {result.order.itinerary.serviceOrRoom}</p><p className="text-muted-foreground">{localDate(result.order.itinerary.departureLocal)} → {localDate(result.order.itinerary.arrivalLocal)} · {result.order.itinerary.duration}</p></div>
      </div>
      <div className="border-y py-3 space-y-1.5">{result.order.lineItems.map((item) => <div key={item.id} className="flex justify-between gap-3 text-xs"><span>{item.label}{!item.mandatory && <span className="text-muted-foreground"> · optional</span>}</span><span className="font-medium">{money(item.amount, item.currency)}</span></div>)}<div className="flex justify-between gap-3 pt-2 border-t text-sm font-bold"><span>Simulated total</span><span>{money(result.order.amount, result.order.currency)}</span></div><p className="text-[10px] text-muted-foreground">{result.payment.fundingLabel}. No card was charged and no stablecoins moved.</p></div>
      <div className="text-xs"><p className="font-semibold">Rules and status</p><p className="text-muted-foreground">{result.order.cancellationTerms}</p><p className="mt-1">Approval recorded · payment simulated · reconciliation matched · no ticket or room issued</p></div>
      <div className="space-y-3 rounded-md border border-primary/20 bg-background/70 p-3">
        <div><p className="text-sm font-semibold">Are both airport transfers arranged?</p><p className="text-xs text-muted-foreground">Check each direction. A ride quote remains a separate review and approval.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TransferChoice label="Home / hotel → departure airport" value={outboundTransfer} onChange={setOutboundTransfer} />
          <TransferChoice label="Arrival airport → hotel / home" value={arrivalTransfer} onChange={setArrivalTransfer} />
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]"><Badge variant="secondary">Arrange outbound</Badge><Badge variant="secondary">Arrange arrival</Badge><Badge variant="secondary">Both arranged</Badge></div>
      </div>
      {outboundTransfer === 'find' && <RideBookingCard pickup={{ address: 'Saved home or hotel (masked)' }} dropoff={{ address: result.order.itinerary.originLabel }} whenISO={result.order.itinerary.departureLocal} passengerName="John" />}
      {arrivalTransfer === 'find' && <RideBookingCard pickup={{ address: result.order.itinerary.destinationLabel, city: destination }} dropoff={{ address: 'Saved hotel or home (masked)' }} whenISO={result.order.itinerary.arrivalLocal} passengerName="John" />}
    </Card>}

    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader><AlertDialogTitle>Review the complete simulated booking</AlertDialogTitle><AlertDialogDescription>Optional services are off by default. No inventory, ticket, room, ride, card charge, or token transfer will be created.</AlertDialogDescription></AlertDialogHeader>
        {selected && <div className="space-y-4 text-sm">
          <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-2">
            <div><p className="text-xs text-muted-foreground">Itinerary / stay</p><p className="font-semibold">{selected.itinerary.originLabel} <ArrowRight className="inline h-3 w-3" /> {selected.itinerary.destinationLabel}</p><p className="text-xs">{localDate(selected.itinerary.departureLocal)} → {localDate(selected.itinerary.arrivalLocal)}</p></div>
            <div><p className="text-xs text-muted-foreground">Service</p><p className="font-semibold">{selected.itinerary.carrierOrProperty}</p><p className="text-xs">{selected.itinerary.serviceOrRoom} · {selected.itinerary.fareOrRate}</p></div>
          </div>
          <div><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Included</p><div className="grid gap-1 sm:grid-cols-2">{selected.included.map((item) => <p key={item} className="text-xs">✓ {item}</p>)}</div></div>
          <div className="space-y-2"><p className="text-xs font-semibold uppercase text-muted-foreground">Optional services · select only what you want</p>{selected.optionalServices.map((service) => <label key={service.id} className="flex items-start gap-3 rounded-md border p-3"><Checkbox checked={selectedServiceIds.includes(service.id)} onCheckedChange={() => toggleService(service.id)} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="font-medium">{service.label}</span><span>{money(service.amount, service.currency)}</span></div><p className="text-xs text-muted-foreground">{service.description}</p></div></label>)}</div>
          <div className="rounded-md border p-3 space-y-1"><div className="flex justify-between text-xs"><span>{bookingType === 'flight' ? 'Base fare' : 'Room rate'}</span><span>{money(selected.pricing.base, selected.currency)}</span></div><div className="flex justify-between text-xs"><span>Taxes and mandatory fees</span><span>{money(selected.pricing.taxesAndMandatoryFees, selected.currency)}</span></div><div className="flex justify-between border-t pt-2 font-bold"><span>Simulated all-in total</span><span>{money(reviewTotal, selected.currency)}</span></div></div>
          <div className="rounded-md border p-3 text-xs"><p>Traveller: John · Finnish citizen · Tampere · passport securely masked</p><p className="mt-1 text-muted-foreground">{selected.cancellationTerms}</p></div>
        </div>}
        <RadioGroup value={rail} onValueChange={(value) => setRail(value as PaymentRail)} className="grid gap-2">
          <label className="flex items-center gap-3 rounded-md border p-3"><RadioGroupItem value="tokenized-card" /><CreditCard className="h-4 w-4" /><span className="text-sm">Tokenized card · simulation only</span></label>
          <label className="flex items-center gap-3 rounded-md border p-3"><RadioGroupItem value="lightspark-uma" /><WalletCards className="h-4 w-4" /><span className="text-sm">Lightspark / UMA · simulation only</span></label>
        </RadioGroup>
        <AlertDialogFooter><AlertDialogCancel disabled={executing}>Cancel</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void approve(); }} disabled={executing}>{executing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Approve simulation</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
};

export default VerifiedBookingOffer;