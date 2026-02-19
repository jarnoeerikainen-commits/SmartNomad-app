import React from 'react';
import { Plane, Hotel, Car, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingItem {
  type: 'flight' | 'hotel' | 'car';
  provider: string;
  url: string;
  label: string;
  route?: string;
  date?: string;
  dates?: string;
  city?: string;
  price?: string;
}

interface BookingCardsProps {
  items: BookingItem[];
}

const PROVIDER_COLORS: Record<string, string> = {
  'Skyscanner': 'bg-[#0770e3]/10 text-[#0770e3] border-[#0770e3]/20',
  'Google Flights': 'bg-[#4285f4]/10 text-[#4285f4] border-[#4285f4]/20',
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
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
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
        </div>
      ))}
    </div>
  );
};

export default BookingCards;

export function parseBookingBlocks(content: string): { text: string; bookings: BookingItem[][] } {
  // Match ```booking, ```json, or plain ``` blocks containing arrays
  const blockRegex = /```(?:booking|json)?\s*\n([\s\S]*?)```/g;
  const bookings: BookingItem[][] = [];
  const text = content.replace(blockRegex, (_, raw) => {
    try {
      // Clean common LLM artifacts
      let cleaned = raw.trim()
        .replace(/,\s*([}\]])/g, '$1')       // trailing commas
        .replace(/[\x00-\x1F\x7F]/g, '');    // control chars

      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return '';

      // Normalise: AI may return {search_engine, url} instead of BookingItem shape
      const items: BookingItem[] = parsed.map((entry: any) => {
        const provider = entry.provider || entry.search_engine || entry.name || '';
        const url = entry.url || entry.link || '#';
        const label = entry.label || '';

        // Determine type: prefer explicit, then guess from provider/url
        let type: BookingItem['type'] = entry.type as BookingItem['type'];
        if (!type || !['flight', 'hotel', 'car'].includes(type)) {
          const lower = (url + ' ' + provider + ' ' + label).toLowerCase();
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

        return {
          type,
          provider: provider || 'Search',
          url,
          label: displayLabel,
          route: entry.route,
          date: entry.date,
          dates: entry.dates,
          city: entry.city,
          price: entry.price
        } as BookingItem;
      }).filter((item: BookingItem) => item.provider && item.provider !== 'Search' && item.url !== '#');

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
