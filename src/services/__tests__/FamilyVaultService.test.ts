import { describe, it, expect } from 'vitest';
import { buildAlerts, classifyUrgency } from '../FamilyVaultService';
import type { FamilyMember } from '@/types/familyMember';

const today = new Date('2026-04-22T12:00:00Z');

function daysFromToday(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function makeMember(overrides: Partial<FamilyMember> = {}): FamilyMember {
  return {
    id: 'm1',
    fullName: 'Jane Doe',
    relationship: 'spouse',
    careLevel: 'independent',
    passports: [],
    visas: [],
    vaccinations: [],
    medicalNotes: [],
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

describe('classifyUrgency', () => {
  it('classifies expired correctly', () => {
    expect(classifyUrgency(-1)).toBe('expired');
    expect(classifyUrgency(-365)).toBe('expired');
  });
  it('classifies critical (<= 7 days)', () => {
    expect(classifyUrgency(0)).toBe('critical');
    expect(classifyUrgency(7)).toBe('critical');
  });
  it('classifies warning (8-30 days)', () => {
    expect(classifyUrgency(8)).toBe('warning');
    expect(classifyUrgency(30)).toBe('warning');
  });
  it('classifies notice (31-90 days)', () => {
    expect(classifyUrgency(31)).toBe('notice');
    expect(classifyUrgency(90)).toBe('notice');
  });
  it('classifies ok (> 90 days)', () => {
    expect(classifyUrgency(91)).toBe('ok');
    expect(classifyUrgency(3650)).toBe('ok');
  });
});

describe('buildAlerts', () => {
  it('returns no alerts for empty family', () => {
    expect(buildAlerts([], today)).toEqual([]);
  });

  it('skips documents with expiry > 90 days', () => {
    const m = makeMember({
      passports: [{ id: 'p1', country: 'UK', passportNumber: 'X', expiryDate: daysFromToday(365) }],
    });
    expect(buildAlerts([m], today)).toEqual([]);
  });

  it('flags expired passport', () => {
    const m = makeMember({
      passports: [{ id: 'p1', country: 'UK', passportNumber: 'X', expiryDate: daysFromToday(-10) }],
    });
    const alerts = buildAlerts([m], today);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].urgency).toBe('expired');
    expect(alerts[0].docType).toBe('passport');
    expect(alerts[0].docLabel).toBe('UK passport');
  });

  it('flags vaccination expiring within 30 days', () => {
    const m = makeMember({
      vaccinations: [{ id: 'v1', name: 'Yellow Fever', dateReceived: '2020-01-01', expiryDate: daysFromToday(20), certificateNumber: 'YF123' }],
    });
    const alerts = buildAlerts([m], today);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].urgency).toBe('warning');
    expect(alerts[0].actionHint).toContain('Yellow Fever');
  });

  it('aggregates alerts across multiple family members and sorts by urgency', () => {
    const dad = makeMember({ id: 'd', fullName: 'Dad',
      passports: [{ id: 'p', country: 'IT', passportNumber: '', expiryDate: daysFromToday(60) }],
    });
    const child = makeMember({ id: 'c', fullName: 'Lily', relationship: 'child',
      visas: [{ id: 'v', country: 'JP', visaType: 'tourist', expiryDate: daysFromToday(-5) }],
    });
    const alerts = buildAlerts([dad, child], today);
    expect(alerts).toHaveLength(2);
    // Expired visa should sort first
    expect(alerts[0].urgency).toBe('expired');
    expect(alerts[0].memberName).toBe('Lily');
    expect(alerts[1].urgency).toBe('notice');
  });

  it('uses preferredName when present', () => {
    const m = makeMember({ fullName: 'Jonathan Smith', preferredName: 'Jon',
      passports: [{ id: 'p', country: 'US', passportNumber: '', expiryDate: daysFromToday(5) }],
    });
    expect(buildAlerts([m], today)[0].memberName).toBe('Jon');
  });

  it('ignores vaccinations without expiry date (lifetime)', () => {
    const m = makeMember({
      vaccinations: [{ id: 'v', name: 'Polio', dateReceived: '2010-01-01' }],
    });
    expect(buildAlerts([m], today)).toEqual([]);
  });

  it('gives passport-specific 6-month validity hint when 30-180 days away', () => {
    const m = makeMember({
      passports: [{ id: 'p', country: 'FR', passportNumber: '', expiryDate: daysFromToday(60) }],
    });
    const alerts = buildAlerts([m], today);
    expect(alerts[0].actionHint).toContain('6 months');
  });
});
