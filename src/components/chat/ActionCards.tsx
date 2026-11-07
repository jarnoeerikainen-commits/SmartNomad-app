import React from 'react';
import type { ActionChip } from './ActionChips';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, FileText, CheckCircle2, Clock, MapPin, Calendar, CreditCard, Loader2, Shield, ExternalLink } from 'lucide-react';

// ─── Action Types ──────────────────────────────────────────
export type ActionType = 'phone-call' | 'document-fill' | 'reservation' | 'payment' | 'form-submit' | 'appointment';
export type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface ActionItem {
  type: ActionType;
  status: ActionStatus;
  title: string;
  subtitle?: string;
  provider?: string;
  details?: Record<string, string>;
  result?: string;
  url?: string;
  duration?: number; // simulated duration in ms
}

interface ActionCardsProps {
  items: ActionItem[];
  onAction: (chip: ActionChip) => void;
  disabled?: boolean;
}

// ─── Status Animations ────────────────────────────────────
const StatusIndicator: React.FC<{ status: ActionStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case 'in-progress':
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <Shield className="h-4 w-4 text-destructive" />;
  }
};

const TypeIcon: React.FC<{ type: ActionType }> = ({ type }) => {
  switch (type) {
    case 'phone-call': return <PhoneCall className="h-4 w-4" />;
    case 'document-fill': return <FileText className="h-4 w-4" />;
    case 'reservation': return <Calendar className="h-4 w-4" />;
    case 'payment': return <CreditCard className="h-4 w-4" />;
    case 'form-submit': return <FileText className="h-4 w-4" />;
    case 'appointment': return <MapPin className="h-4 w-4" />;
  }
};

const STATUS_LABELS: Record<ActionStatus, string> = {
  'pending': 'Queued',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'failed': 'Failed',
};

const STATUS_COLORS: Record<ActionStatus, string> = {
  'pending': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary border-primary/30',
  'completed': 'bg-green-500/10 text-green-600 border-green-500/30',
  'failed': 'bg-destructive/10 text-destructive border-destructive/30',
};

// ─── Phone Call Animation ─────────────────────────────────
const PhoneCallVisualizer: React.FC<{ status: ActionStatus; provider?: string }> = ({ status, provider }) => {
  return status === 'pending' ? <p className="text-xs text-muted-foreground">Call request{provider ? ` — ${provider}` : ''}. Not connected.</p> : null;
};

// ─── Main Action Card ─────────────────────────────────────
const ActionCards: React.FC<ActionCardsProps> = ({ items, onAction, disabled }) => {
  // Model output is a proposal, not evidence of execution.
  const actionStates = items.map(item => ({ ...item, status: 'pending' as const }));

  return (
    <div className="space-y-2 my-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        🤖 Concierge Actions
      </p>
      {actionStates.map((action, idx) => (
        <Card
          key={idx}
          className={`p-3 border transition-all duration-300 ${STATUS_COLORS[action.status]}`}
        >
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background/80 shrink-0">
                  <TypeIcon type={action.type} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{action.title}</p>
                  {action.subtitle && (
                    <p className="text-[11px] opacity-75 truncate">{action.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <StatusIndicator status={action.status} />
                <Badge variant="outline" className="text-[10px] h-5">
                  {STATUS_LABELS[action.status]}
                </Badge>
              </div>
            </div>

            {/* Phone call animation */}
            {action.type === 'phone-call' && (
              <PhoneCallVisualizer status={action.status} provider={action.provider} />
            )}

            {/* Details */}
            {action.status === 'pending' && (action.type === 'payment' || action.type === 'reservation' || action.type === 'form-submit') && (
              <div className="rounded-md border border-warning/30 bg-warning/10 p-2 text-xs text-foreground">
                Waiting for your explicit review. Concierge actions involving money, reservations, or submitted data never run automatically.
              </div>
            )}
            {action.details && (
              <div className="grid grid-cols-2 gap-1 text-[11px] bg-background/60 rounded p-2">
                {Object.entries(action.details).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-muted-foreground">{key}:</span>{' '}
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action URL */}
            {(
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                disabled={disabled}
                onClick={() => onAction({ label: action.title, kind: action.type === 'payment' ? 'pay' : action.type === 'phone-call' ? 'call' : action.type === 'reservation' ? 'book' : 'reply', payload: action.url || JSON.stringify(action.details || {}) })}
              >
                Review request <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActionCards;

// ─── Parser ───────────────────────────────────────────────
export function parseActionBlocks(content: string): { text: string; actions: ActionItem[][] } {
  const blockRegex = /```(?:action|actions)\s*\n([\s\S]*?)```/g;
  const actions: ActionItem[][] = [];
  const text = content.replace(blockRegex, (_, raw) => {
    try {
      const cleaned = raw.trim()
        .replace(/,\s*([}\]])/g, '$1')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F\x7F]/g, '');
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return '';
      const items: ActionItem[] = parsed.filter((entry: unknown) => entry && typeof entry === 'object').map((entry: Partial<ActionItem>) => ({
        type: entry.type || 'reservation',
        status: entry.status || 'pending',
        title: entry.title || 'Action',
        subtitle: entry.subtitle,
        provider: entry.provider,
        details: entry.details,
        result: entry.result,
        url: entry.url,
        duration: entry.duration || 3000,
      }));
      if (items.length > 0) {
        actions.push(items);
        return '{{ACTION_CARD_' + (actions.length - 1) + '}}';
      }
    } catch (e) {
      console.warn('Failed to parse action JSON:', e);
    }
    return '';
  });
  return { text, actions };
}
