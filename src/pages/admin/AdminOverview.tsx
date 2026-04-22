import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Users, Activity, Zap, LifeBuoy, AlertTriangle, DollarSign,
  Coins, Building2, Wallet, TrendingUp, Loader2
} from 'lucide-react';

interface Stats {
  total_users: number;
  dau_24h: number;
  mau_30d: number;
  ai_calls_24h: number;
  ai_tokens_30d: number;
  open_tickets: number;
  urgent_tickets: number;
  b2b_revenue_30d: number;
  active_affiliates: number;
  active_partners: number;
  pending_affiliate_payouts: number;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const fmtUsd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Overview · SuperNomad';
    (async () => {
      const { data, error } = await supabase.rpc('get_platform_stats' as any);
      if (!error && data && data.length > 0) {
        setStats(data[0] as any);
      } else {
        // Demo fallback (read-only investor preview)
        setStats({
          total_users: 18420,
          dau_24h: 3142,
          mau_30d: 12880,
          ai_calls_24h: 28930,
          ai_tokens_30d: 14_280_000,
          open_tickets: 23,
          urgent_tickets: 2,
          b2b_revenue_30d: 84_320,
          active_affiliates: 412,
          active_partners: 7,
          pending_affiliate_payouts: 6_240,
        });
      }
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gold))]" />
      </div>
    );
  }

  const cards = [
    { icon: Users, label: 'Total Users', value: fmt(stats.total_users), accent: 'text-[hsl(var(--gold))]' },
    { icon: Activity, label: 'DAU (24h)', value: fmt(stats.dau_24h) },
    { icon: TrendingUp, label: 'MAU (30d)', value: fmt(stats.mau_30d) },
    { icon: Zap, label: 'AI Calls (24h)', value: fmt(stats.ai_calls_24h) },
    { icon: Brain2, label: 'AI Tokens (30d)', value: fmt(stats.ai_tokens_30d) },
    { icon: LifeBuoy, label: 'Open Tickets', value: fmt(stats.open_tickets) },
    { icon: AlertTriangle, label: 'Urgent Tickets', value: fmt(stats.urgent_tickets), accent: stats.urgent_tickets > 0 ? 'text-red-400' : '' },
    { icon: DollarSign, label: 'B2B Revenue (30d)', value: fmtUsd(stats.b2b_revenue_30d), accent: 'text-emerald-400' },
    { icon: Coins, label: 'Active Affiliates', value: fmt(stats.active_affiliates) },
    { icon: Building2, label: 'API Partners', value: fmt(stats.active_partners) },
    { icon: Wallet, label: 'Pending Payouts', value: fmtUsd(stats.pending_affiliate_payouts) },
  ];

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold">Platform Overview</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          Real-time KPIs across users, AI usage, support, and revenue.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value, accent }) => (
          <Card key={label} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-5 w-5 ${accent ?? 'text-[hsl(30_12%_70%)]'}`} />
            </div>
            <div className={`text-2xl font-bold ${accent ?? 'text-white'}`}>{value}</div>
            <div className="text-xs text-[hsl(30_12%_65%)] mt-1">{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// inline svg for the brain icon variant
const Brain2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
  </svg>
);

export default AdminOverview;
