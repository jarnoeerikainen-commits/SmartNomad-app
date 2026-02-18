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
                className={`p-2.5 border cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01] ${PROVIDER_COLORS[item.provider] || 'bg-muted/50'}`}
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <TypeIcon type={item.type} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{item.provider}</p>
                      <p className="text-[10px] opacity-75 truncate">
                        {item.route || item.city || ''} {item.date || item.dates || ''}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs shrink-0 gap-1">
                    Search <ExternalLink className="h-3 w-3" />
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
  const bookingRegex = /```booking\n([\s\S]*?)```/g;
  const bookings: BookingItem[][] = [];
  const text = content.replace(bookingRegex, (_, json) => {
    try {
      const parsed = JSON.parse(json.trim());
      if (Array.isArray(parsed)) {
        bookings.push(parsed);
        return '{{BOOKING_CARD_' + (bookings.length - 1) + '}}';
      }
    } catch (e) {
      console.warn('Failed to parse booking JSON:', e);
    }
    return '';
  });
  return { text, bookings };
}
