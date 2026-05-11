import React from 'react';
import { useUserMode } from '@/hooks/useUserMode';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';
import { MODE_LIST, MODE_PRESETS, UserMode } from '@/data/modePresets';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ModeSwitcher: React.FC = () => {
  const { mode, setMode, preset } = useUserMode();
  const { prefs, isPinned, togglePinned, setVisibility } = useFeaturePreferences();
  const { toast } = useToast();

  const apply = (next: UserMode) => {
    if (next === mode) return;
    const np = MODE_PRESETS[next];
    setMode(next);

    // Pinned: clear current dash pins from previous preset and set new ones
    const previousPins = preset.pinned;
    previousPins.forEach(id => { if (isPinned(id)) togglePinned(id); });
    np.pinned.forEach(id => { if (!isPinned(id)) togglePinned(id); });

    // Dashboard visibility: hide dash-* not listed, show those listed
    const dashIds = ['dash-threat','dash-welcome','dash-stats','dash-weather','dash-gamification','dash-activity','dash-actions','dash-discovery'];
    dashIds.forEach(id => setVisibility(id, np.visibleDashboard.includes(id)));

    toast({ title: `Mode: ${np.label}`, description: np.tagline });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Mode</span>
        <span className="text-xs text-muted-foreground italic font-display">{preset.tagline}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
        {MODE_LIST.map(m => {
          const Icon = m.icon;
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              onClick={() => apply(m.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                'text-sm font-medium whitespace-nowrap',
                active
                  ? 'border-transparent text-foreground shadow-md'
                  : 'border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
              style={active ? { background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' } : undefined}
              aria-pressed={active}
              data-testid={`mode-${m.id}`}
            >
              <Icon className="h-4 w-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSwitcher;
