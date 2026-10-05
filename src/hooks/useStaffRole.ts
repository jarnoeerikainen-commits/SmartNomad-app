import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type StaffRole = 'admin' | 'support' | 'affiliate_manager' | 'affiliate_partner' | 'user' | 'premium' | null;

interface StaffState {
  role: StaffRole;
  isStaff: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isAffiliateManager: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
}

const STAFF_RANK = ['admin', 'support', 'affiliate_manager', 'affiliate_partner', 'premium', 'user'];

/**
 * Resolves the highest staff role for the current user.
 * Anonymous users never receive a synthetic staff role.
 */
export function useStaffRole(): StaffState {
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<StaffState>({
    role: null,
    isStaff: false,
    isAdmin: false,
    isSupport: false,
    isAffiliateManager: false,
    isLoading: true,
    isDemoMode: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (authLoading) return;

      if (!user) {
        if (!cancelled) {
          setState({
            role: null,
            isStaff: false,
            isAdmin: false,
            isSupport: false,
            isAffiliateManager: false,
            isLoading: false,
            isDemoMode: false,
          });
        }
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (cancelled) return;

      if (error || !data || data.length === 0) {
        setState({
          role: 'user',
          isStaff: false,
          isAdmin: false,
          isSupport: false,
          isAffiliateManager: false,
          isLoading: false,
          isDemoMode: false,
        });
        return;
      }

      const roles = data.map((r) => r.role as string);
      const highest = STAFF_RANK.find((r) => roles.includes(r)) as StaffRole;

      setState({
        role: highest,
        isStaff: ['admin', 'support', 'affiliate_manager'].includes(highest ?? ''),
        isAdmin: highest === 'admin',
        isSupport: highest === 'support' || highest === 'admin',
        isAffiliateManager: highest === 'affiliate_manager' || highest === 'admin',
        isLoading: false,
        isDemoMode: false,
      });
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return state;
}
