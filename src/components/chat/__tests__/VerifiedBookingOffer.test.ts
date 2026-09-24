import { describe, expect, it } from 'vitest';
import { buildTrustedBookingUrl, isTrustedBookingUrl, parseBookingBlocks, parseVerifiedSearch } from '../BookingCards';

describe('parseVerifiedSearch', () => {
  it('extracts a flight route and date from a supported search URL', () => {
    expect(parseVerifiedSearch({ type: 'flight', provider: 'Kayak', url: 'https://www.kayak.com/flights/HEL-DXB/2026-12-20?sort=price_a', label: 'HEL to DXB' })).toEqual({ bookingType: 'flight', origin: 'HEL', destination: 'DXB', startDate: '2026-12-20', adults: 1, cabin: 'business' });
  });
  it('preserves a return date and explicit cabin', () => {
    expect(parseVerifiedSearch({ type: 'flight', provider: 'Skyscanner', url: 'https://www.skyscanner.net/transport/flights/bom/dxb/260925/260927/?adults=1&cabinclass=first', label: 'BOM to DXB' })).toEqual({ bookingType: 'flight', origin: 'BOM', destination: 'DXB', startDate: '2026-09-25', endDate: '2026-09-27', adults: 1, cabin: 'first' });
  });
  it('constructs query-filled allowlisted links from structured fields', () => {
    const item = { type: 'flight' as const, provider: 'Kayak', url: '#', label: 'Compare', route: 'BOM → DXB', date: '2026-09-25', endDate: '2026-09-27' };
    const url = buildTrustedBookingUrl(item);
    expect(url).toBe('https://www.kayak.com/flights/BOM-DXB/2026-09-25/2026-09-27/business?sort=bestflight_a');
    expect(isTrustedBookingUrl({ ...item, url: url || '#' })).toBe(true);
  });
  it('rejects unsafe model-supplied domains', () => {
    const parsed = parseBookingBlocks('```booking\n[{"type":"flight","provider":"Kayak","url":"javascript:alert(1)","label":"Bad"}]\n```');
    expect(parsed.bookings).toHaveLength(0);
  });
  it('extracts hotel city and dates', () => {
    expect(parseVerifiedSearch({ type: 'hotel', provider: 'Booking.com', url: 'https://www.booking.com/searchresults.html?ss=Dubai&checkin=2026-12-20&checkout=2026-12-24', label: 'Dubai' })).toMatchObject({ bookingType: 'hotel', destination: 'Dubai', startDate: '2026-12-20', endDate: '2026-12-24' });
  });
  it('refuses incomplete searches', () => {
    expect(parseVerifiedSearch({ type: 'flight', provider: 'Search', url: '#', label: 'unknown' })).toBeNull();
  });
});