import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AISection from './AISection';
import { Subscription } from '@/types/subscription';

vi.mock('../AITravelAssistant', () => ({
  default: ({ currentLocation, citizenship }: { currentLocation?: { country: string; city: string }; citizenship?: string }) => (
    <label>
      Travel input
      <input data-testid="assistant-location" value={`${currentLocation?.city || ''}|${citizenship || ''}`} readOnly />
    </label>
  ),
}));

vi.mock('../AITravelDoctor', () => ({
  AITravelDoctor: ({ currentLocation, citizenship }: { currentLocation?: { country: string; city: string }; citizenship?: string }) => (
    <label>
      Health input
      <input data-testid="doctor-location" value={`${currentLocation?.country || ''}|${citizenship || ''}`} readOnly />
    </label>
  ),
}));

vi.mock('../AITravelLawyer', () => ({
  AITravelLawyer: ({ currentLocation }: { currentLocation?: { country: string; city: string } }) => (
    <label>
      Legal input
      <input data-testid="lawyer-location" value={currentLocation?.city || ''} readOnly />
    </label>
  ),
}));

vi.mock('../AITravelPlanner', () => ({
  default: () => (
    <label>
      Planner input
      <input data-testid="planner-input" readOnly />
    </label>
  ),
}));

const subscription: Subscription = {
  tier: 'premium',
  isActive: true,
  expiryDate: null,
  features: [],
  aiRequestsRemaining: 10000000,
  aiRequestsLimit: 10000000,
};

describe('AISection mobile assistant chooser', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(max-width: 767px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  });

  it('opens the selected assistant as a usable panel on mobile cards', () => {
    render(
      <AISection
        subscription={subscription}
        onUpgradeClick={vi.fn()}
        currentLocation={{ country: 'Portugal', city: 'Lisbon' }}
        citizenship="Finland"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /health advisor/i }));
    expect(screen.getByLabelText('Health input')).toBeVisible();
    expect(screen.getByTestId('doctor-location')).toHaveValue('Portugal|Finland');
    expect(screen.getByRole('button', { name: /health advisor/i })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /legal advisor/i }));
    expect(screen.getByLabelText('Legal input')).toBeVisible();
    expect(screen.getByTestId('lawyer-location')).toHaveValue('Lisbon');

    fireEvent.click(screen.getByRole('button', { name: /trip planner/i }));
    expect(screen.getByLabelText('Planner input')).toBeVisible();
  });
});
