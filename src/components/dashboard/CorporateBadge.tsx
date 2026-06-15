import React, { useEffect, useState } from 'react';
import { Building2, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CorporateService, type Organization } from '@/services/CorporateService';

interface Props {
  onNavigate?: (section: string) => void;
}

/**
 * Small chip indicating the user is operating inside a corporate workspace.
 * Hidden if user is signed out or has no organization membership.
 */
const CorporateBadge: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth() as any;
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setOrg(null); return; }
    (async () => {
      try {
        const orgs = await CorporateService.listMyOrgs();
        if (!cancelled && orgs.length > 0) setOrg(orgs[0]);
      } catch {
        /* silent — non-auth or no membership */
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!org) return null;

  const name = org.name || 'Corporate workspace';

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5 text-[11px] font-medium text-primary">
      <Building2 className="h-3 w-3" />
      <span className="truncate max-w-[140px]" title={name}>{name}</span>
      <button
        type="button"
        onClick={() => onNavigate?.('profile')}
        className="ml-0.5 inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Switch to personal"
        title="Switch to personal"
      >
        <ArrowRightLeft className="h-3 w-3" />
      </button>
    </div>
  );
};

export default CorporateBadge;
