import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, FileText, CheckCircle2, Clock, MapPin, Calendar, CreditCard, Loader2, Shield, ExternalLink } from 'lucide-react';

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
  const [dots, setDots] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([3, 5, 2, 7, 4, 6, 3, 5, 8, 4]);

  useEffect(() => {
    if (status !== 'in-progress') return;
    const dotInterval = setInterval(() => setDots(d => (d + 1) % 4), 500);
    const waveInterval = setInterval(() => {
      setWaveform(prev => prev.map(() => Math.floor(Math.random() * 10) + 1));
    }, 200);
    return () => { clearInterval(dotInterval); clearInterval(waveInterval); };
  }, [status]);

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
        <Phone className="h-3 w-3" />
        <span>Dialing {provider}{'.'.repeat(dots)}</span>
      </div>
    );
  }

  if (status === 'in-progress') {
    return (
      <div className="space-y-2 py-1">
        <div className="flex items-center gap-2 text-xs text-primary font-medium">
          <PhoneCall className="h-3 w-3 animate-pulse" />
          <span>Connected — speaking with {provider}</span>
        </div>
        <div className="flex items-center gap-[2px] h-4">
          {waveform.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-primary/60 rounded-full transition-all duration-150"
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// ─── Main Action Card ─────────────────────────────────────
const ActionCards: React.FC<ActionCardsProps> = ({ items }) => {
  const [actionStates, setActionStates] = useState<ActionItem[]>(items);

  // Simulate action progression for demo
  useEffect(() => {
    const initialItems = items.map(item => ({ ...item }));
    setActionStates(initialItems);

    const timers: ReturnType<typeof setTimeout>[] = [];

    initialItems.forEach((item, idx) => {
      if (item.status === 'pending') {
        // Move to in-progress after a short delay
        timers.push(setTimeout(() => {
          setActionStates(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], status: 'in-progress' };
            return next;
          });
        }, 800 + idx * 400));

        // Move to completed after the simulated duration
        const duration = item.duration || 3000;
        timers.push(setTimeout(() => {
          setActionStates(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], status: 'completed' };
            return next;
          });
        }, 800 + idx * 400 + duration));
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [items]);

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
            {action.details && action.status === 'completed' && (
              <div className="grid grid-cols-2 gap-1 text-[11px] bg-background/60 rounded p-2">
                {Object.entries(action.details).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-muted-foreground">{key}:</span>{' '}
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Result message */}
            {action.result && action.status === 'completed' && (
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                ✅ {action.result}
              </p>
            )}

            {/* Action URL */}
            {action.url && action.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => window.open(action.url, '_blank', 'noopener,noreferrer')}
              >
                View Details <ExternalLink className="h-3 w-3" />
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
      let cleaned = raw.trim()
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\x00-\x1F\x7F]/g, '');
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return '';
      const items: ActionItem[] = parsed.map((entry: any) => ({
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
