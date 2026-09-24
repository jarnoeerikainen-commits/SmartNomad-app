import { describe, expect, it } from 'vitest';
import { Home, Wallet } from 'lucide-react';
import { filterSidebarGroups } from '@/components/AppSidebar';

describe('AppSidebar visibility filtering', () => {
  const groups = [
    {
      id: 'main',
      label: 'Main',
      items: [{ id: 'dashboard', label: 'Home', icon: Home }],
    },
    {
      id: 'mainMore',
      label: 'More',
      items: [{ id: 'snomad-id', label: 'Snomad ID', icon: Wallet }],
    },
    {
      id: 'finance',
      label: 'Finance & Payments',
      items: [{ id: 'payment-options', label: 'Payment Options', icon: Wallet }],
    },
  ];

  it('removes hidden items and their empty group headings', () => {
    const result = filterSidebarGroups(groups, () => false, false);

    expect(result.map(group => group.id)).toEqual(['main']);
  });

  it('restores only groups containing explicitly visible items', () => {
    const result = filterSidebarGroups(groups, id => id === 'snomad-id', false);

    expect(result.map(group => group.id)).toEqual(['main', 'mainMore']);
    expect(result[1]?.items.map(item => item.id)).toEqual(['snomad-id']);
  });
});