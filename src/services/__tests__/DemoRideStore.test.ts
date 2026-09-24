import { beforeEach, describe, expect, it } from 'vitest';
import { DemoRideStore } from '../DemoRideStore';

describe('DemoRideStore', () => {
  beforeEach(() => localStorage.clear());

  it('persists only a USD simulated ride linked to a trip', () => {
    DemoRideStore.save({
      tripBookingId: 'SN-DEMO-1',
      pickup: 'DXB',
      dropoff: 'Saved hotel (masked)',
      quote: { quoteId: 'q1', supplier: 'Uber', vehicleClass: 'premium', vehicleName: 'Premium', etaMinutes: 5, durationMinutes: 20, priceLow: 35, priceHigh: 42, currency: 'USD', capacityPax: 3, capacityBags: 2, cancellationFreeMinutes: 5, fixedPrice: true, ecoFriendly: false, rating: 4.8 },
      booking: { bookingId: 'ride-1', status: 'confirmed', supplier: 'Uber', vehicleName: 'Premium', etaMinutes: 5, pricePaid: 42, currency: 'USD', simulated: true },
    });
    expect(DemoRideStore.read()).toMatchObject([{ id: 'ride-1', tripBookingId: 'SN-DEMO-1', pickup: 'DXB' }]);
  });

  it('filters records that could imply a real ride', () => {
    localStorage.setItem('supernomad_demo_rides_v1', JSON.stringify([{ id: 'unsafe', quote: { currency: 'USD' }, booking: { simulated: false } }]));
    expect(DemoRideStore.read()).toEqual([]);
  });
});