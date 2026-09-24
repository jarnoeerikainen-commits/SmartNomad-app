import type { LucideIcon } from 'lucide-react';
import { SYSTEM_FEATURES } from '@/data/featureRegistry';

export interface SidebarVisibilityItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export interface SidebarVisibilityGroup {
  id: string;
  label: string;
  items: SidebarVisibilityItem[];
}

export function filterSidebarGroups(
  groups: SidebarVisibilityGroup[],
  isVisible: (id: string) => boolean,
  isTeenRestricted: boolean,
): SidebarVisibilityGroup[] {
  const teenHiddenGroups = ['finance'];
  const teenHiddenItems = ['social-chat', 'nomad-chat', 'marketplace'];

  return groups.map(group => {
    if (group.id === 'main') return group;
    if (isTeenRestricted && teenHiddenGroups.includes(group.id)) return { ...group, items: [] };
    let items = group.items.filter(item => SYSTEM_FEATURES.includes(item.id) || isVisible(item.id));
    if (isTeenRestricted) items = items.filter(item => !teenHiddenItems.includes(item.id));
    return { ...group, items };
  }).filter(group => group.id === 'main' || group.items.length > 0);
}