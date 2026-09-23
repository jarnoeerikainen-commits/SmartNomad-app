import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle2, Clock3, CreditCard, ExternalLink, Hotel, Loader2, Plane, RefreshCcw, ShieldCheck, WalletCards } from 'lucide-react';
import { TravelCommerceService, type CommerceOffer, type PaymentRail } from '@/services/TravelCommerceService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  search: { bookingType: 'flight' | 'hotel'; origin?: string; destination: string; startDate: string; endDate?: string; adults?: number; cabin?: 'economy' | 'premium_economy' | 'business' | 'first' };
}

export const VerifiedBookingOffer: React.FC<Props> = ({ search }) => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<CommerceOffer[]>([]);
  const [selected, setSelected] = useState<CommerceOffer | null>(null);
  const [rail, setRail] = useState<PaymentRail>('tokenized-card');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const { bookingType, origin, destination, startDate, endDate, adults, cabin } = search;

  const load = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const found = await TravelCommerceService.search({ bookingType, origin, destination, startDate, endDate, adults, cabin });
      setOffers(found);
    } catch (error) {
      toast({ title: 'Offer search unavailable', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [adults, bookingType, cabin, destination, endDate, origin, startDate, toast]);

  useEffect(() => { void load(); }, [load]);

  const approve = async () => {
    if (!selected) return;
    setExecuting(true);
    try {
      await TravelCommerceService.prepare(selected);
      await TravelCommerceService.approve(selected);
      const response = await TravelCommerceService.executeDemo(selected, rail);
      setResult(response.message);
      setDialogOpen(false);
      toast({ title: 'Demo flow reconciled', description: response.message });
    } catch (error) {
      toast({ title: 'Booking stopped safely', description: error instanceof Error ? error.message : 'The supplier did not confirm.', variant: 'destructive' });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="my-2 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking authorized supplier-shaped demo offers…</div>;
  return (
    <div className="my-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Verified offer workflow</div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => void load()} aria-label="Refresh offers"><RefreshCcw className="h-3.5 w-3.5" /></Button>
      </div>
      {offers.map((offer) => {
        const Icon = offer.bookingType === 'flight' ? Plane : Hotel;
        return <Card key={offer.offerId} className="border-primary/20 p-3">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5"><p className="text-sm font-semibold text-foreground">{offer.title}</p><Badge variant="outline" className="text-[9px] uppercase">Demo only</Badge></div>
              <p className="mt-0.5 text-xs text-muted-foreground">{offer.summary}</p>
              <p className="mt-1 text-xs text-foreground">{offer.baggageOrRoom}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground"><span>{offer.supplier}</span><span>·</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />15-minute quote</span><a className="inline-flex items-center gap-1 text-primary" href={offer.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink className="h-3 w-3" /></a></div>
            </div>
            <div className="shrink-0 text-right"><p className="text-base font-bold text-foreground">{offer.amount.toLocaleString()} {offer.currency}</p><Button size="sm" className="mt-2 h-8 text-xs" onClick={() => { setSelected(offer); setDialogOpen(true); }}>Review</Button></div>
          </div>
        </Card>;
      })}
      {result && <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span>{result}</span></div>}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader><AlertDialogTitle>Approve a simulated booking?</AlertDialogTitle><AlertDialogDescription>This verifies the full approval and reconciliation flow. It will not reserve inventory, issue a ticket, charge a card, or move stablecoins.</AlertDialogDescription></AlertDialogHeader>
          {selected && <div className="space-y-3 rounded-md border p-3 text-sm"><div className="flex justify-between gap-3"><span>{selected.summary}</span><strong>{selected.amount} {selected.currency}</strong></div><p className="text-xs text-muted-foreground">Traveller: John Smith · Finnish · passport securely masked</p><p className="text-xs text-muted-foreground">{selected.cancellationTerms}</p></div>}
          <RadioGroup value={rail} onValueChange={(value) => setRail(value as PaymentRail)} className="grid gap-2">
            <label className="flex items-center gap-3 rounded-md border p-3"><RadioGroupItem value="tokenized-card" /><CreditCard className="h-4 w-4" /><span className="text-sm">Tokenized card reference</span></label>
            <label className="flex items-center gap-3 rounded-md border p-3"><RadioGroupItem value="lightspark-uma" /><WalletCards className="h-4 w-4" /><span className="text-sm">Lightspark/UMA funding simulation</span></label>
          </RadioGroup>
          <AlertDialogFooter><AlertDialogCancel disabled={executing}>Cancel</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void approve(); }} disabled={executing}>{executing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Approve & simulate</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VerifiedBookingOffer;