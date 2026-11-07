import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieConsent } from '../GDPRCompliance';
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
describe('cookie-only entry', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);
  it('offers a choice without onboarding and remembers rejection without assigning an age', () => {
    const view = render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Reject All' }));
    expect(JSON.parse(localStorage.getItem('cookieConsent') || '{}')).toEqual({ necessary: true, analytics: false, marketing: false, functional: false });
    expect(localStorage.getItem('ageGroup')).toBeNull();
    view.unmount();
    render(<CookieConsent />);
    expect(screen.queryByRole('button', { name: 'Accept All' })).toBeNull();
  });
  it('saves an explicit accept-all choice', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept All' }));
    expect(JSON.parse(localStorage.getItem('cookieConsent') || '{}').analytics).toBe(true);
  });
});