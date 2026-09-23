import { beforeEach, describe, expect, it } from 'vitest';
import { DemoBookingStore } from '../DemoBookingStore';
import type { DemoBookingResult } from '../TravelCommerceService';

const result = (id: string, departureLocal: string): DemoBookingResult => ({
  success: true, mode: 'demo', simulated: true, charged: false, ticketIssued: false,
  roomReserved: false, reconciled: true, message: 'Simulated only',
  order: {
    publicOrderId: id, supplier: 'Demo supplier', supplierOrderId: `supplier-${id}`, status: 'simulated', amount: 120, currency: 'EUR',
    itinerary: { originLabel: 'Helsinki', destinationLabel: 'Paris', departureLocal, arrivalLocal: departureLocal, duration: '3h', carrierOrProperty: 'Demo Air', serviceOrRoom: 'SN100', fareOrRate: 'Flex' },
    included: ['Cabin bag'], lineItems: [{ id: 'fare', label: 'Fare', amount: 120, currency: 'EUR', mandatory: true }],
    selectedServices: [], cancellationTerms: 'Demo terms', reconciliationStatus: 'matched',
    traveller: { displayName: 'John', citizenship: 'Finnish', city: 'Tampere', passport: '••••8550', documentStatus: 'masked demo' },
  },
  payment: { rail: 'tokenized-card', status: 'simulated', providerTransactionReference: null, fundingLabel: 'Demo credits' },
});

describe('DemoBookingStore', () => {
  beforeEach(() => localStorage.clear());

  it('stores approved demo records in departure order', () => {
    DemoBookingStore.save('hotel', result('later', '2027-02-10T15:00:00Z'));
    DemoBookingStore.save('flight', result('next', '2027-01-10T08:00:00Z'));
    expect(DemoBookingStore.read().map((booking) => booking.id)).toEqual(['next', 'later']);
  });

  it('replaces a duplicate order instead of duplicating it', () => {
    DemoBookingStore.save('flight', result('same', '2027-01-10T08:00:00Z'));
    DemoBookingStore.save('flight', result('same', '2027-01-11T08:00:00Z'));
    expect(DemoBookingStore.read()).toHaveLength(1);
  });

  it('rejects malformed and non-simulated storage data', () => {
    localStorage.setItem('supernomad_demo_bookings_v1', JSON.stringify([{ id: 'unsafe', bookingType: 'flight', completedAt: '2026-01-01', result: { simulated: false } }]));
    expect(DemoBookingStore.read()).toEqual([]);
  });

  it('clears all demo records', () => {
    DemoBookingStore.save('flight', result('one', '2027-01-10T08:00:00Z'));
    DemoBookingStore.clear();
    expect(DemoBookingStore.read()).toEqual([]);
  });
});
