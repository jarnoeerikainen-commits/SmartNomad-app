import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Sparkles, Clock, Crown } from 'lucide-react';

interface Props {
  alias: string;
  persona?: 'free' | 'premium' | 'business' | 'family';
  trustScore?: number;
  lastSessionAgo?: string;
  lastQuery?: string;
  children: React.ReactNode;
}

const PERSONA_TONE: Record<string, string> = {
  free:     'bg-slate-500/15 text-slate-300 border-slate-500/30',
  premium:  'bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30',
  business: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  family:   'bg-coral-500/15 text-coral-300 border-orange-500/30',
};

/**
 * Hover card for admin user rows — surfaces persona, trust, last session,
 * and last concierge query without leaving the list.
 */
const UserHoverCard: React.FC<Props> = ({
  alias, persona = 'free', trustScore, lastSessionAgo, lastQuery, children,
}) => {
  const ts = trustScore ?? 0;
  const trustTone =
    ts > 80 ? 'text-emerald-300' :
    ts > 50 ? 'text-amber-300' :
              'text-red-300';

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.25)] text-white p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-sm truncate">{alias}</div>
          <Badge variant="outline" className={PERSONA_TONE[persona]}>
            {persona === 'premium' ? <Crown className="h-3 w-3 mr-1" /> : null}
            {persona}
          </Badge>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className={`h-3.5 w-3.5 ${trustTone}`} />
            <span className="text-[hsl(30_12%_75%)]">Trust score:</span>
            <span className={`font-semibold num ${trustTone}`}>{ts}</span>
          </div>
          {lastSessionAgo && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[hsl(30_12%_70%)]" />
              <span className="text-[hsl(30_12%_75%)]">Last session:</span>
              <span>{lastSessionAgo}</span>
            </div>
          )}
          {lastQuery && (
            <div className="pt-1.5 mt-1.5 border-t border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
                <span className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)]">Last concierge query</span>
              </div>
              <div className="text-[12px] italic text-[hsl(30_12%_90%)] line-clamp-2">"{lastQuery}"</div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
