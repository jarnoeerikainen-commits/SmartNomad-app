import React from 'react';
import { Plane, Hotel, Car, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recordOutcome } from '@/utils/conciergeFeedback';
import VerifiedBookingOffer from '@/components/chat/VerifiedBookingOffer';

export interface BookingItem {
  type: 'flight' | 'hotel' | 'car';
  provider: string;
  url: string;
  label: string;
  route?: string;
  date?: string;
  dates?: string;
  city?: string;
  price?: string;
  endDate?: string;
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first';
}

const FLIGHT_HOSTS = new Set(['www.kayak.com', 'www.skyscanner.net']);
const HOTEL_HOSTS = new Set(['www.booking.com', 'www.hotels.com', 'www.trivago.com']);
const CAR_HOSTS = new Set(['www.rentalcars.com', 'www.kayak.com', 'www.discovercars.com']);
const CABINS = new Set(['economy', 'premium_economy', 'business', 'first']);

export function isValidIsoDate(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export function isTrustedBookingUrl(item: BookingItem): boolean {
  try {
    const url = new URL(item.url);
    if (url.protocol !== 'https:') return false;
    const hosts = item.type === 'flight' ? FLIGHT_HOSTS : item.type === 'hotel' ? HOTEL_HOSTS : CAR_HOSTS;
    return hosts.has(url.hostname);
  } catch {
    return false;
  }
}

const isoToCompact = (date: string) => date.replace(/-/g, '').slice(2);

export function buildTrustedBookingUrl(item: BookingItem): string | null {
  const route = item.route?.match(/\b([A-Z]{3})\s*(?:→|-|–|to)\s*([A-Z]{3})\b/i);
  const extractedStart = item.date?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const extractedEnd = item.endDate?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const startDate = isValidIsoDate(extractedStart) ? extractedStart : undefined;
  const endDate = isValidIsoDate(extractedEnd) ? extractedEnd : undefined;
  const cabin = item.cabin && CABINS.has(item.cabin) ? item.cabin : 'business';
  if (item.type === 'flight' && route && startDate) {
    const origin = route[1].toUpperCase();
    const destination = route[2].toUpperCase();
    if (item.provider === 'Skyscanner') return `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${isoToCompact(startDate)}${endDate ? `/${isoToCompact(endDate)}` : ''}/?adults=1&cabinclass=${cabin}`;
    if (item.provider === 'Kayak') return `https://www.kayak.com/flights/${origin}-${destination}/${startDate}${endDate ? `/${endDate}` : ''}/${cabin}?sort=bestflight_a`;
  }
  if (item.type === 'hotel' && item.city && item.date && item.endDate) {
    if (item.provider === 'Booking.com') return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(item.city)}&checkin=${item.date}&checkout=${item.endDate}&group_adults=1&nflt=class%3D4%3Bclass%3D5`;
    if (item.provider === 'Hotels.com') return `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(item.city)}&startDate=${item.date}&endDate=${item.endDate}&adults=1&sort=RECOMMENDED&star=4,5`;
    if (item.provider === 'Trivago') return `https://www.trivago.com/en-US/srl?query=${encodeURIComponent(item.city)}`;
  }
  return isTrustedBookingUrl(item) ? item.url : null;
}

interface BookingCardsProps {
  items: BookingItem[];
}

const PROVIDER_COLORS: Record<string, string> = {
  'Skyscanner': 'bg-[#0770e3]/10 text-[#0770e3] border-[#0770e3]/20',
  'Kayak': 'bg-[#ff690f]/10 text-[#ff690f] border-[#ff690f]/20',
  'Booking.com': 'bg-[#003580]/10 text-[#003580] border-[#003580]/20',
  'Hotels.com': 'bg-[#d32f2f]/10 text-[#d32f2f] border-[#d32f2f]/20',
  'Trivago': 'bg-[#007faf]/10 text-[#007faf] border-[#007faf]/20',
  'Rentalcars': 'bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20',
  'Discovercars': 'bg-[#00b67a]/10 text-[#00b67a] border-[#00b67a]/20',
  'Kayak Cars': 'bg-[#ff690f]/10 text-[#ff690f] border-[#ff690f]/20',
};

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'flight': return <Plane className="h-4 w-4" />;
    case 'hotel': return <Hotel className="h-4 w-4" />;
    case 'car': return <Car className="h-4 w-4" />;
    default: return <Star className="h-4 w-4" />;
  }
};

const BookingCards: React.FC<BookingCardsProps> = ({ items }) => {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, BookingItem[]>);

  const typeLabels: Record<string, string> = {
    flight: '✈️ Flights',
    hotel: '🏨 Hotels',
    car: '🚗 Car Rentals',
  };

  return (
    <div className="space-y-3 my-2">
      {Object.entries(grouped).map(([type, groupItems]) => (
        <div key={type}>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            {typeLabels[type] || type}
          </p>
          <div className="space-y-1.5">
            {groupItems.map((item, idx) => (
              <Card
                key={idx}
                className={`p-3 border cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01] ${PROVIDER_COLORS[item.provider] || 'bg-muted/50'}`}
                onClick={() => {
                  // 🧠 Closed-loop learning: record booking-card click as a positive signal
                  recordOutcome({
                    kind: 'booking_clicked',
                    topic: item.route || item.city || item.label || item.provider,
                    category: item.type === 'flight' ? 'travel' : item.type === 'hotel' ? 'accommodation' : 'transport',
                    metadata: { provider: item.provider, type: item.type, url: item.url },
                  }).catch(() => {});
                  window.open(item.url, '_blank', 'noopener,noreferrer');
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background/80 shrink-0">
                      <TypeIcon type={item.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{item.provider}</p>
                      <p className="text-[11px] opacity-75 truncate">
                        {item.route || item.city || item.label || `Search on ${item.provider}`}
                        {(item.date || item.dates) && ` · ${item.date || item.dates}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="h-8 px-3 text-xs shrink-0 gap-1 font-semibold">
                    Open <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {(() => {
            const verifiedSearch = parseVerifiedSearch(groupItems[0]);
            return verifiedSearch ? <VerifiedBookingOffer search={verifiedSearch} /> : null;
          })()}
        </div>
      ))}
    </div>
  );
};

export function parseVerifiedSearch(item?: BookingItem) {
  if (!item?.url || item.url === '#' || !isTrustedBookingUrl(item)) return null;
  try {
    const url = new URL(item.url);
    if (item.type === 'flight') {
      const pathMatch = url.pathname.match(/\/flights\/([A-Z]{3})-([A-Z]{3})\/(\d{4}-\d{2}-\d{2})(?:\/(\d{4}-\d{2}-\d{2}))?/i)
        || url.pathname.match(/\/transport\/flights\/([a-z]{3})\/([a-z]{3})\/(\d{6})(?:\/(\d{6}))?/i);
      if (!pathMatch) return null;
      const compact = pathMatch[3];
      const startDate = compact.length === 6 ? `20${compact.slice(0, 2)}-${compact.slice(2, 4)}-${compact.slice(4, 6)}` : compact;
      const compactEnd = pathMatch[4] || url.searchParams.get('returnDate') || item.endDate;
      const endDate = compactEnd ? (compactEnd.length === 6 ? `20${compactEnd.slice(0, 2)}-${compactEnd.slice(2, 4)}-${compactEnd.slice(4, 6)}` : compactEnd) : undefined;
      if (!isValidIsoDate(startDate) || (endDate && (!isValidIsoDate(endDate) || endDate <= startDate))) return null;
      const requestedCabin = (url.searchParams.get('cabinclass') || url.searchParams.get('cabin') || item.cabin || 'business').toLowerCase().replace('-', '_');
      const cabin = CABINS.has(requestedCabin) ? requestedCabin as 'economy' | 'premium_economy' | 'business' | 'first' : 'business';
      return { bookingType: 'flight' as const, origin: pathMatch[1].toUpperCase(), destination: pathMatch[2].toUpperCase(), startDate, endDate, adults: 1, cabin };
    }
    if (item.type === 'hotel') {
      const destination = url.searchParams.get('ss') || url.searchParams.get('destination') || item.city;
      const startDate = url.searchParams.get('checkin') || url.searchParams.get('startDate');
      const endDate = url.searchParams.get('checkout') || url.searchParams.get('endDate');
      if (!destination || !isValidIsoDate(startDate) || (endDate && (!isValidIsoDate(endDate) || endDate <= startDate))) return null;
      return { bookingType: 'hotel' as const, destination, startDate, endDate: endDate || undefined, adults: 1 };
    }
  } catch {
    return null;
  }
  return null;
}

export default BookingCards;

export function parseBookingBlocks(content: string): { text: string; bookings: BookingItem[][] } {
  // Match ```booking, ```json, or plain ``` blocks containing arrays
  const blockRegex = /```(?:booking|json)?\s*\n([\s\S]*?)```/g;
  const bookings: BookingItem[][] = [];
  const text = content.replace(blockRegex, (_, raw) => {
    try {
      // Clean common LLM artifacts
      const cleaned = raw.trim()
        .replace(/,\s*([}\]])/g, '$1')       // trailing commas
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F\x7F]/g, '');    // control chars

      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return '';

      // Normalise: AI may return {search_engine, url} instead of BookingItem shape
      // LLM JSON is validated and normalized field-by-field below.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: BookingItem[] = parsed.map((entry: any) => {
        const provider = entry.provider || entry.search_engine || entry.name || '';
        const suppliedUrl = entry.url || entry.link || '#';
        const label = entry.label || '';

        // Determine type: prefer explicit, then guess from provider/url
        let type: BookingItem['type'] = entry.type as BookingItem['type'];
        if (!type || !['flight', 'hotel', 'car'].includes(type)) {
          const lower = (suppliedUrl + ' ' + provider + ' ' + label).toLowerCase();
          if (lower.includes('hotel') || lower.includes('booking.com') || lower.includes('trivago') || lower.includes('hostel') || lower.includes('hotels.com')) {
            type = 'hotel';
          } else if (lower.includes('car') || lower.includes('rental') || lower.includes('discover')) {
            type = 'car';
          } else {
            type = 'flight';
          }
        }

        // Build a meaningful label if missing
        const displayLabel = label || entry.route || entry.city || `Search on ${provider}`;

        const candidate = {
          type,
          provider: provider || 'Search',
          url: suppliedUrl,
          label: displayLabel,
          route: entry.route,
          date: entry.date,
          dates: entry.dates,
          city: entry.city,
          price: entry.price,
          endDate: entry.endDate,
          cabin: entry.cabin,
        } as BookingItem;
        return { ...candidate, url: buildTrustedBookingUrl(candidate) || '#' };
      }).filter((item: BookingItem) => item.provider && item.provider !== 'Search' && isTrustedBookingUrl(item));

      if (items.length > 0) {
        bookings.push(items);
        return '{{BOOKING_CARD_' + (bookings.length - 1) + '}}';
      }
    } catch (e) {
      console.warn('Failed to parse booking JSON:', e);
    }
    return '';
  });
  return { text, bookings };
}
