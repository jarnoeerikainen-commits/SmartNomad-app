import React, { useMemo } from 'react';
import { Receipt, CreditCard, Trophy, Wallet, ArrowRight } from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

interface Props {
  onNavigate: (section: string) => void;
}

interface Kpi {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  section: string;
}

/** Shown only in "business" user mode. Source-of-truth: demo seeds for personas, neutral defaults otherwise. */
const BusinessKpiStrip: React.FC<Props> = ({ onNavigate }) => {
  const { activePersonaId } = useDemoPersona();

  const kpis: Kpi[] = useMemo(() => {
    // Conservative demo values; do not invent live financial data.
    const byPersona: Record<string, Kpi[]> = {
      meghan: [
        { key: 'spend',  label: 'YTD travel',    value: '£18,420', hint: 'across 6 trips',          icon: Wallet,     section: 'expenses' },
        { key: 'vat',    label: 'Reclaim VAT',   value: '£1,260',  hint: '12 receipts pending',     icon: Receipt,    section: 'expenses' },
        { key: 'points', label: 'Points expiring',value: '34,500',  hint: 'BA Avios · within 90 d',  icon: Trophy,     section: 'award-cards' },
        { key: 'card',   label: 'Card on file',  value: 'Amex Plat',hint: 'lounges + insurance',     icon: CreditCard, section: 'payment-options' },
      ],
      john: [
        { key: 'spend',  label: 'YTD travel',    value: '$42,180', hint: 'across 9 trips',          icon: Wallet,     section: 'expenses' },
        { key: 'vat',    label: 'Reclaim VAT',   value: '$2,840',  hint: '18 receipts pending',     icon: Receipt,    section: 'expenses' },
        { key: 'points', label: 'Points expiring',value: '128k',    hint: 'AAdvantage · within 90 d',icon: Trophy,     section: 'award-cards' },
        { key: 'card',   label: 'Card on file',  value: 'Amex Cent.',hint: 'concierge + lounges',    icon: CreditCard, section: 'payment-options' },
      ],
      default: [
        { key: 'spend',  label: 'YTD travel',    value: '—',       hint: 'connect expenses to track',icon: Wallet,    section: 'expenses' },
        { key: 'vat',    label: 'Reclaim VAT',   value: '—',       hint: 'scan receipts to compute',  icon: Receipt,   section: 'expenses' },
        { key: 'points', label: 'Points expiring',value: '—',      hint: 'add a loyalty card',        icon: Trophy,    section: 'award-cards' },
        { key: 'card',   label: 'Card on file',  value: '—',       hint: 'connect a payment method',  icon: CreditCard,section: 'payment-options' },
      ],
    };
    return byPersona[activePersonaId ?? 'default'] ?? byPersona.default;
  }, [activePersonaId]);

  return (
    <section aria-label="Business KPIs" className="space-y-2">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Business at a glance</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <button
              key={k.key}
              onClick={() => onNavigate(k.section)}
              className="group text-left rounded-xl border border-border/60 bg-card/60 p-3 hover:bg-card hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                <Icon className="h-3 w-3" />
                {k.label}
                <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-display text-lg leading-tight mt-0.5 text-foreground">{k.value}</div>
              <div className="text-[10.5px] text-muted-foreground leading-tight">{k.hint}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default BusinessKpiStrip;
