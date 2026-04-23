import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Car, Clock, MapPin, Users, Briefcase, Star, Leaf, ExternalLink, CheckCircle2, Loader2, Calendar as CalIcon, Phone } from 'lucide-react';
import { RideHailingService, type RideQuote, type RideBooking } from '@/services/RideHailingService';
import { useToast } from '@/hooks/use-toast';

interface RideBookingCardProps {
  pickup: { address: string; city?: string };
  dropoff: { address: string };
  whenISO?: string;
  passengerName?: string;
}

const SUPPLIER_COLORS: Record<string, string> = {
  'Uber': 'bg-black/5 text-foreground border-black/20',
  'Bolt': 'bg-[#34d186]/10 text-[#1ea863] border-[#34d186]/30',
  'Blacklane': 'bg-foreground/10 text-foreground border-foreground/30',
};

const RideBookingCard: React.FC<RideBookingCardProps> = ({
  pickup, dropoff, whenISO, passengerName,
}) => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<RideQuote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>(whenISO || '');
  const [booking, setBooking] = useState<RideBooking | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    RideHailingService.getQuotes({
      pickup, dropoff,
      whenISO: scheduledTime || undefined,
    })
      .then(q => { if (!cancelled) { setQuotes(q); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pickup.address, dropoff.address, scheduledTime]);

  const selectedQuote = quotes?.find(q => q.quoteId === selectedQuoteId);

  const handleBook = async () => {
    if (!selectedQuote) return;
    setBookingInProgress(true);
    try {
      const result = await RideHailingService.book({
        quoteId: selectedQuote.quoteId,
        pickup: { address: pickup.address },
        dropoff: { address: dropoff.address },
        whenISO: scheduledTime || undefined,
        passenger: { name: passengerName || 'SuperNomad Member' },
      });
      setBooking(result);
      toast({
        title: scheduledTime ? '🚖 Ride scheduled' : '🚖 Driver on the way',
        description: `${result.driverName} • ${result.vehiclePlate} • ETA ${result.etaMinutes} min`,
      });
    } catch (e) {
      toast({ title: 'Booking failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleDeepLink = (q: RideQuote) => {
    const url = q.deepLink || q.webLink;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ─── Booked state ───────────────────────────────────────────────
  if (booking) {
    return (
      <Card className="p-4 my-2 border-2 border-green-500/40 bg-green-500/5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-bold text-sm">
              {scheduledTime ? 'Ride Scheduled' : 'Driver Assigned'}
            </p>
            <p className="text-xs text-muted-foreground">{booking.supplier} • {booking.vehicleName}</p>
          </div>
          <Badge className="ml-auto bg-green-600 text-white">{booking.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs bg-background/80 rounded p-2 mb-2">
          <div><span className="text-muted-foreground">Driver:</span> <strong>{booking.driverName}</strong> ⭐ {booking.driverRating}</div>
          <div><span className="text-muted-foreground">Plate:</span> <strong>{booking.vehiclePlate}</strong></div>
          <div><span className="text-muted-foreground">Vehicle:</span> {booking.vehicleColor} {booking.vehicleName}</div>
          <div><span className="text-muted-foreground">ETA:</span> <strong>{booking.etaMinutes} min</strong></div>
        </div>
        {booking.driverPhone && (
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1"
            onClick={() => window.open(`tel:${booking.driverPhone}`)}>
            <Phone className="h-3 w-3" /> Call driver
          </Button>
        )}
      </Card>
    );
  }

  // ─── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="p-4 my-2 border-primary/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching ride options across Uber, Bolt & local fleets…
        </div>
      </Card>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Card className="p-4 my-2">
        <p className="text-sm text-muted-foreground">No rides available right now.</p>
      </Card>
    );
  }

  // ─── Quote list ─────────────────────────────────────────────────
  return (
    <Card className="p-3 my-2 border-primary/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold">Ride options</p>
        </div>
        <Badge variant="outline" className="text-[10px]">via Karhoo (demo)</Badge>
      </div>

      <div className="text-[11px] text-muted-foreground mb-2 space-y-0.5">
        <div className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5 text-green-600" /><span className="truncate">{pickup.address}</span></div>
        <div className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5 text-red-600" /><span className="truncate">{dropoff.address}</span></div>
      </div>

      {/* Schedule toggle */}
      <div className="flex items-center gap-2 mb-2">
        <CalIcon className="h-3 w-3 text-muted-foreground" />
        <Input
          type="datetime-local"
          value={scheduledTime}
          onChange={e => setScheduledTime(e.target.value)}
          className="h-7 text-[11px] flex-1"
          placeholder="ASAP"
        />
        {scheduledTime && (
          <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2" onClick={() => setScheduledTime('')}>
            ASAP
          </Button>
        )}
      </div>

      <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
        {quotes.map(q => {
          const selected = q.quoteId === selectedQuoteId;
          return (
            <button
              key={q.quoteId}
              onClick={() => setSelectedQuoteId(q.quoteId)}
              className={`w-full text-left rounded-lg border p-2 transition-all ${
                selected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:bg-accent/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Badge variant="outline" className={`text-[10px] h-4 px-1 ${SUPPLIER_COLORS[q.supplier] || ''}`}>
                      {q.supplier}
                    </Badge>
                    <p className="text-xs font-semibold truncate">{q.vehicleName}</p>
                    {q.ecoFriendly && <Leaf className="h-3 w-3 text-green-600" />}
                    {q.fixedPrice && <Badge variant="outline" className="text-[9px] h-4 px-1">Fixed</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{q.etaMinutes} min</span>
                    <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" />{q.capacityPax}</span>
                    <span className="flex items-center gap-0.5"><Briefcase className="h-2.5 w-2.5" />{q.capacityBags}</span>
                    <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{q.rating}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">
                    {q.priceLow === q.priceHigh
                      ? `${q.currency} ${q.priceLow}`
                      : `${q.currency} ${q.priceLow}–${q.priceHigh}`}
                  </p>
                  <p className="text-[9px] text-muted-foreground">{q.durationMinutes} min trip</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action row */}
      <div className="flex gap-2 mt-3">
        <Button
          className="flex-1 h-9 text-xs"
          disabled={!selectedQuote || bookingInProgress}
          onClick={handleBook}
        >
          {bookingInProgress ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Booking…</>
          ) : scheduledTime ? (
            <>📅 Schedule with {selectedQuote?.supplier || '…'}</>
          ) : (
            <>🚖 Book {selectedQuote?.supplier || '…'} now</>
          )}
        </Button>
        {selectedQuote && (selectedQuote.deepLink || selectedQuote.webLink) && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1"
            onClick={() => handleDeepLink(selectedQuote)}
          >
            Open app <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>

      <p className="text-[9px] text-muted-foreground mt-2 text-center">
        Demo mode • Connect Karhoo to enable live bookings
      </p>
    </Card>
  );
};

export default RideBookingCard;

// ─── Parser: extract ```ride blocks from AI responses ─────────────
export interface RideBlock {
  pickup: string;
  dropoff: string;
  whenISO?: string;
  city?: string;
}

export function parseRideBlocks(content: string): { text: string; rides: RideBlock[] } {
  const blockRegex = /```ride\s*\n([\s\S]*?)```/g;
  const rides: RideBlock[] = [];
  const text = content.replace(blockRegex, (_, raw) => {
    try {
      const cleaned = raw.trim().replace(/,\s*([}\]])/g, '$1');
      const parsed = JSON.parse(cleaned);
      const block: RideBlock = {
        pickup: parsed.pickup || 'Current location',
        dropoff: parsed.dropoff || '',
        whenISO: parsed.whenISO || parsed.when,
        city: parsed.city,
      };
      if (block.dropoff) {
        rides.push(block);
        return `{{RIDE_CARD_${rides.length - 1}}}`;
      }
    } catch (e) {
      console.warn('Failed to parse ride block:', e);
    }
    return '';
  });
  return { text, rides };
}
