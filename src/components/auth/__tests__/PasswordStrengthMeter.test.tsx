/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrengthMeter, { evaluatePassword } from '../PasswordStrengthMeter';

describe('evaluatePassword', () => {
  it('scores empty as 0', () => {
    expect(evaluatePassword('').score).toBe(0);
  });

  it('scores a weak password low', () => {
    expect(evaluatePassword('abc').score).toBeLessThanOrEqual(1);
  });

  it('scores a strong password high', () => {
    const { score } = evaluatePassword('CorrectHorse9!Battery');
    expect(score).toBeGreaterThanOrEqual(3);
  });

  it('rewards long passphrases without symbols', () => {
    const { score } = evaluatePassword('correcthorsebatterystaple');
    expect(score).toBeGreaterThanOrEqual(2);
  });
});

describe('<PasswordStrengthMeter />', () => {
  it('renders nothing for empty password', () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the strength label for a non-empty password', () => {
    render(<PasswordStrengthMeter password="hunter2" />);
    expect(screen.getByText(/strength/i)).toBeInTheDocument();
  });
});
