import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from '@/components/ui/command';
import {
  Home, Plane, Sparkles, ShieldCheck, Receipt, Users, Brain,
  Radio, LifeBuoy, Database, Coins, Activity, Mic, CalendarPlus,
  Forward, Clock, ArrowRight, LayoutDashboard, Building2,
} from 'lucide-react';

/**
 * GlobalCommandPalette — Linear/Raycast-style command bar.
 * Open with ⌘K / Ctrl-K from anywhere. Adapts its verbs based on whether
 * the user is in /admin (operator verbs) or the consumer app (concierge + nav).
 *
 * Concierge prefill uses the same contract as HomeCommandBar: localStorage key
 * `concierge:prefill` + `CustomEvent("concierge:prefill")`.
 */
const PREFILL_KEY = 'concierge:prefill';

export const GlobalCommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // ⌘K / Ctrl-K toggles
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  const askConcierge = useCallback((text: string) => {
    const q = text.trim();
    if (!q) { go('/app'); return; }
    try { localStorage.setItem(PREFILL_KEY, q); } catch {}
    window.dispatchEvent(new CustomEvent('concierge:prefill', { detail: { text: q } }));
    setOpen(false);
    setQuery('');
    if (!location.pathname.startsWith('/app')) navigate('/app');
  }, [go, navigate, location.pathname]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={isAdmin ? 'Operator command — search users, runs, actions…' : 'Ask Concierge or jump anywhere…'}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.trim() ? (
            <button
              type="button"
              onClick={() => askConcierge(query)}
              className="w-full text-left px-3 py-3 text-sm text-foreground hover:bg-muted rounded-md"
            >
              <Sparkles className="inline h-3.5 w-3.5 text-primary mr-2" />
              Ask Concierge: <span className="text-muted-foreground">"{query}"</span>
            </button>
          ) : 'No results.'}
        </CommandEmpty>

        {!isAdmin && (
          <>
            <CommandGroup heading="Concierge">
              <CommandItem onSelect={() => askConcierge(query || 'Plan a trip')}>
                <Plane className="mr-2 h-4 w-4 text-primary" />
                Plan a trip{query ? `: ${query}` : '…'}
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => askConcierge(`Hold the best option for 24 hours: ${query}`)}>
                <Clock className="mr-2 h-4 w-4" /> Hold 24h
              </CommandItem>
              <CommandItem onSelect={() => askConcierge(`Add to my calendar: ${query}`)}>
                <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
              </CommandItem>
              <CommandItem onSelect={() => askConcierge(`Forward to my accountant: ${query}`)}>
                <Forward className="mr-2 h-4 w-4" /> Forward to accountant
              </CommandItem>
              <CommandItem onSelect={() => go('/app')}>
                <Mic className="mr-2 h-4 w-4" /> Open Concierge (voice)
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Jump to">
              <CommandItem onSelect={() => go('/app')}><Home className="mr-2 h-4 w-4" /> Home</CommandItem>
              <CommandItem onSelect={() => go('/corporate')}><Building2 className="mr-2 h-4 w-4" /> Corporate workspace</CommandItem>
              <CommandItem onSelect={() => go('/business-centers')}><Building2 className="mr-2 h-4 w-4" /> Business centers</CommandItem>
              <CommandItem onSelect={() => go('/wifi-finder')}><Activity className="mr-2 h-4 w-4" /> Wi-Fi finder</CommandItem>
              <CommandItem onSelect={() => go('/affiliate')}><Coins className="mr-2 h-4 w-4" /> Affiliate dashboard</CommandItem>
            </CommandGroup>
          </>
        )}

        {isAdmin && (
          <>
            <CommandGroup heading="Cockpit">
              <CommandItem onSelect={() => go('/admin')}><LayoutDashboard className="mr-2 h-4 w-4 text-[hsl(var(--gold))]" /> Operator Cockpit</CommandItem>
              <CommandItem onSelect={() => go('/admin/agent-live')}><Radio className="mr-2 h-4 w-4" /> Live agent feed</CommandItem>
              <CommandItem onSelect={() => go('/admin/concierge')}><Sparkles className="mr-2 h-4 w-4" /> Concierge AI</CommandItem>
              <CommandItem onSelect={() => go('/admin/brain')}><Brain className="mr-2 h-4 w-4" /> AI Brain</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Operate">
              <CommandItem onSelect={() => go('/admin/users')}><Users className="mr-2 h-4 w-4" /> Users</CommandItem>
              <CommandItem onSelect={() => go('/admin/tickets')}><LifeBuoy className="mr-2 h-4 w-4" /> Support tickets</CommandItem>
              <CommandItem onSelect={() => go('/admin/expenses')}><Receipt className="mr-2 h-4 w-4" /> Tax &amp; expense</CommandItem>
              <CommandItem onSelect={() => go('/admin/data')}><Database className="mr-2 h-4 w-4" /> B2B data</CommandItem>
              <CommandItem onSelect={() => go('/admin/affiliates')}><Coins className="mr-2 h-4 w-4" /> Affiliates</CommandItem>
              <CommandItem onSelect={() => go('/admin/audit')}><ShieldCheck className="mr-2 h-4 w-4" /> Audit log</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Leave">
              <CommandItem onSelect={() => go('/app')}><ArrowRight className="mr-2 h-4 w-4" /> Back to consumer app</CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalCommandPalette;
