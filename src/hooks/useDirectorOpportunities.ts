/**
 * useDirectorOpportunities — hook used by Concierge / Sales / Dashboard
 * surfaces to fetch the latest active opportunities sourced by the AI
 * Directors (Events, Sports, VIP). Read-only; works for both authenticated
 * users and visitors (RLS allows active opps to be read by anon + authed).
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DirectorRole = 'events' | 'sports' | 'vip';

export interface DirectorOpportunity {
  id: string;
  director: DirectorRole;
  category: string;
  title: string;
  summary: string;
  city: string | null;
  country: string | null;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  url: string | null;
  popularity_score: number;
  exclusivity_score: number;
  est_ticket_price_min: number | null;
  est_ticket_price_max: number | null;
  currency: string;
  vip_packages: Array<{ name: string; price: number; perks: string[] }>;
  sponsor_packages: Array<{ tier: string; price: number; deliverables: string[]; target_companies?: string[] }>;
  concierge_offer: { pitch?: string; bundle?: string[]; upsell?: string[] };
  sales_target_segments: string[];
  tags: string[];
  status: string;
  pushed_to_concierge: boolean;
  pushed_to_sales: boolean;
  created_at: string;
}

interface Options {
  director?: DirectorRole | 'all';
  limit?: number;
  /** Only opportunities marked pushed_to_concierge — what user-facing AI should pitch. */
  conciergeReady?: boolean;
}

export function useDirectorOpportunities({ director = 'all', limit = 12, conciergeReady = false }: Options = {}) {
  const [data, setData] = useState<DirectorOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let q = supabase
      .from('admin_ai_opportunities' as any)
      .select('*')
      .eq('status', 'active')
      .order('popularity_score', { ascending: false })
      .limit(limit);
    if (director !== 'all') q = q.eq('director', director);
    if (conciergeReady) q = q.eq('pushed_to_concierge', true);
    const { data: rows, error: err } = await q;
    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((rows ?? []) as unknown as DirectorOpportunity[]);
    }
    setLoading(false);
  }, [director, limit, conciergeReady]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
