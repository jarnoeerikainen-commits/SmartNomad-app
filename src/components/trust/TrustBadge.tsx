import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrustTier, TIER_LABELS } from '@/services/TrustPassService';
import { Shield, ShieldCheck, Crown, Circle } from 'lucide-react';

interface TrustBadgeProps {
  tier: TrustTier;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ICONS: Record<TrustTier, React.ComponentType<{ className?: string }>> = {
  unverified: Circle,
  human: Shield,
  nomad: ShieldCheck,
  sovereign: Crown,
};

const SIZES = {
  xs: { icon: 'w-3 h-3', text: 'text-[10px]', padding: 'px-1.5 py-0.5' },
  sm: { icon: 'w-3.5 h-3.5', text: 'text-xs', padding: 'px-2 py-0.5' },
  md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2.5 py-1' },
  lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
};

const TrustBadge: React.FC<TrustBadgeProps> = ({ tier, size = 'sm', showLabel = false, className = '' }) => {
  const meta = TIER_LABELS[tier];
  const Icon = ICONS[tier];
  const s = SIZES[size];

  if (tier === 'unverified' && !showLabel) return null;

  const inner = (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${s.padding} ${s.text} ${className}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
        color: meta.color,
        borderWidth: 1,
        borderColor: `color-mix(in srgb, ${meta.color} 30%, transparent)`,
      }}
      aria-label={meta.label}
    >
      <Icon className={s.icon} />
      {showLabel && <span>{meta.label}</span>}
    </span>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px]">
          <div className="font-medium" style={{ color: meta.color }}>{meta.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{meta.description}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrustBadge;
