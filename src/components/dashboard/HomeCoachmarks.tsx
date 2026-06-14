import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

const STORAGE_KEY = 'supernomad_home_coachmarks_v1';

const STEPS = [
  {
    title: 'Your morning briefing',
    body: 'Active trip, tax days and threats — three colour-coded cards. Green = nothing to do.',
  },
  {
    title: 'Concierge command bar',
    body: 'Type a command or pick a chip. Plan, hold, forward to accountant, add to calendar — done.',
  },
  {
    title: 'Upcoming trips',
    body: 'Tap any trip for the full dossier: visa, health, threats, flights, eSIM, embassy.',
  },
  {
    title: 'Side bar holds everything else',
    body: 'Marketplace, vault, learning, B2B, settings. Home stays calm; depth is one tap away.',
  },
];

interface Props {
  /** Force-open (e.g. from a settings "Replay tour" button). */
  forceOpen?: boolean;
  onClose?: () => void;
}

/**
 * One-time orientation overlay for the home dashboard. Persists per browser.
 * Also re-fires whenever a different demo persona is activated.
 */
const HomeCoachmarks: React.FC<Props> = ({ forceOpen, onClose }) => {
  const { activePersonaId } = useDemoPersona();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setStep(0);
      setOpen(true);
      return;
    }
    try {
      const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const key = activePersonaId || 'default';
      if (!seen[key]) {
        const t = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, [forceOpen, activePersonaId]);

  const finish = () => {
    setOpen(false);
    try {
      const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      seen[activePersonaId || 'default'] = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch {}
    onClose?.();
  };

  if (!open) return null;
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tour"
      onClick={finish}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border/60 bg-card text-card-foreground shadow-2xl p-5 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
            <Sparkles className="h-3 w-3 text-primary" />
            Tour · {step + 1} / {STEPS.length}
          </div>
          <button
            onClick={finish}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="font-display text-xl leading-tight mb-1.5">{s.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.body}</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
              />
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={finish} className="text-xs">
            Skip
          </Button>
          <Button size="sm" onClick={() => (isLast ? finish() : setStep(step + 1))}>
            {isLast ? 'Done' : 'Next'}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCoachmarks;
