import React from 'react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { User2, Briefcase, Sparkles } from 'lucide-react';

const OPTIONS = [
  { id: null,      label: 'Demo',   icon: Sparkles },
  { id: 'meghan',  label: 'Meghan', icon: User2 },
  { id: 'john',    label: 'John',   icon: Briefcase },
] as const;

/** Compact inline persona switch shown on Home so any visitor can preview each profile. */
const HomePersonaQuickSwitch: React.FC = () => {
  const { activePersonaId, setPersona } = useDemoPersona();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 p-0.5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold pl-2 pr-1.5">
        View as
      </span>
      {OPTIONS.map(o => {
        const Icon = o.icon;
        const active = (o.id ?? null) === (activePersonaId ?? null);
        return (
          <button
            key={o.label}
            onClick={() => setPersona((o.id as 'meghan' | 'john' | null) ?? null)}
            className={`inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-pressed={active}
          >
            <Icon className="h-3 w-3" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

export default HomePersonaQuickSwitch;
