import React, { useState, useRef } from 'react';
import { Sparkles, Send, Mic, Plane, CalendarPlus, Forward, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onNavigate: (section: string) => void;
}

const PREFILL_KEY = 'concierge:prefill';

const CHIPS: Array<{ key: string; label: string; icon: React.ElementType; intent: string }> = [
  { key: 'plan',     label: 'Plan a trip',     icon: Plane,        intent: 'Plan a trip: ' },
  { key: 'hold',     label: 'Hold 24h',        icon: Clock,        intent: 'Hold the best option for 24 hours: ' },
  { key: 'calendar', label: 'Add to calendar', icon: CalendarPlus, intent: 'Add to my calendar: ' },
  { key: 'forward',  label: 'Forward',         icon: Forward,      intent: 'Forward to my accountant: ' },
];

/**
 * Top-of-Home command bar. Routes user input to the Concierge (AI tab) with a
 * prefill payload that the assistant picks up via localStorage + custom event.
 */
const HomeCommandBar: React.FC<Props> = ({ onNavigate }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (text: string) => {
    const q = text.trim();
    if (!q) {
      onNavigate('ai');
      return;
    }
    try { localStorage.setItem(PREFILL_KEY, q); } catch {}
    window.dispatchEvent(new CustomEvent('concierge:prefill', { detail: { text: q } }));
    onNavigate('ai');
    setValue('');
  };

  const chipClick = (intent: string) => {
    const next = value.trim() ? `${intent}${value.trim()}` : intent;
    submit(next);
  };

  return (
    <section aria-label="Concierge command bar" className="space-y-2">
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 backdrop-blur px-3 py-2 shadow-sm focus-within:border-primary/50 focus-within:shadow-md transition-all">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(value); }}
          placeholder="Ask or command Concierge…"
          aria-label="Ask Concierge"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 py-1"
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Voice"
          onClick={() => onNavigate('ai')}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-8 w-8"
          aria-label="Send"
          onClick={() => submit(value)}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {CHIPS.map(c => {
          const Icon = c.icon;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => chipClick(c.intent)}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-border/60 bg-background/70 text-[11px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-3 w-3" />
              {c.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default HomeCommandBar;
