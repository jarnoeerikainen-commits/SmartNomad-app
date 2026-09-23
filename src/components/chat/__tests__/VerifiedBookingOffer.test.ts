import { describe, expect, it } from 'vitest';
import { parseVerifiedSearch } from '../BookingCards';
import { describe, expect, it } from 'vitest';

describe('parseVerifiedSearch', () => {
  it('extracts a flight route and date from a supported search URL', () => {
    expect(parseVerifiedSearch({ type: 'flight', provider: 'Kayak', url: 'https://www.kayak.com/flights/HEL-DXB/2026-12-20?sort=price_a', label: 'HEL to DXB' })).toEqual({ bookingType: 'flight', origin: 'HEL', destination: 'DXB', startDate: '2026-12-20', adults: 1, cabin: 'business' });
  });
  it('extracts hotel city and dates', () => {
    expect(parseVerifiedSearch({ type: 'hotel', provider: 'Booking.com', url: 'https://www.booking.com/searchresults.html?ss=Dubai&checkin=2026-12-20&checkout=2026-12-24', label: 'Dubai' })).toMatchObject({ bookingType: 'hotel', destination: 'Dubai', startDate: '2026-12-20', endDate: '2026-12-24' });
  });
  it('refuses incomplete searches', () => {
    expect(parseVerifiedSearch({ type: 'flight', provider: 'Search', url: '#', label: 'unknown' })).toBeNull();
  });
});