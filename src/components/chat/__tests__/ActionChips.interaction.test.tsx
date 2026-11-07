import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ActionChips, { type ActionChipKind } from '../ActionChips';
import ActionCards from '../ActionCards';

const kinds: ActionChipKind[] = ['book', 'calendar', 'hold', 'forward', 'share', 'call', 'open', 'pay', 'save', 'remind', 'verify', 'directions', 'flight', 'hotel', 'car', 'download', 'reply'];
describe('Offered actions', () => {
  it.each(kinds)('routes a %s choice exactly once', kind => {
    const onAction = vi.fn();
    const chip = { label: 'Selected option', kind, payload: 'reference' };
    render(<ActionChips chips={[chip]} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Selected option' }));
    expect(onAction).toHaveBeenCalledExactlyOnceWith(chip);
  });
  it('blocks duplicate actions while a reply is in progress', () => {
    const onAction = vi.fn();
    render(<ActionChips chips={[{ label: 'Review', kind: 'pay' }]} onAction={onAction} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(onAction).not.toHaveBeenCalled();
  });
  it('routes action-card review instead of pretending an AI-reported payment completed', () => {
    const onAction = vi.fn();
    render(<ActionCards items={[{ title: 'Pay for flight', type: 'payment', status: 'completed', result: 'Charged' }]} onAction={onAction} />);
    expect(screen.queryByText('Charged')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Review request' }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ kind: 'pay', label: 'Pay for flight' }));
  });
});