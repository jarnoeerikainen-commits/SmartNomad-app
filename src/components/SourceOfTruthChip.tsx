import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getTruth, type TruthDomain } from '@/data/sourceOfTruth';
import { formatDate } from '@/utils/dateFormat';

interface SourceOfTruthChipProps {
  domain: TruthDomain;
  /** Override label (defaults to record label) */
  label?: string;
  /** Compact mode: just chip; default shows full strip */
  variant?: 'chip' | 'strip';
  className?: string;
}

/**
 * Persistent "Source of truth" chip. Click to see every authority
 * that backs the data on this screen. HNW clients need to *see*
 * the verification — not infer it.
 */
export const SourceOfTruthChip: React.FC<SourceOfTruthChipProps> = ({
  domain,
  label,
  variant = 'strip',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const truth = getTruth(domain);
  const last = formatDate(truth.lastVerifiedISO);
  const next = formatDate(truth.nextRefreshISO);
  const primary = truth.sources[0];

  const chip = (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 transition-colors text-[11px] font-medium ${className}`}
      aria-label="Source of truth details"
    >
      <ShieldCheck className="h-3 w-3" />
      <span className="hidden sm:inline">Verified</span>
      <span className="opacity-80">• {primary?.authority || 'Official'}</span>
    </button>
  );

  if (variant === 'chip') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{chip}</PopoverTrigger>
        <SourcesPopoverContent truth={truth} last={last} next={next} label={label} />
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`group w-full flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-left ${className}`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Source of truth
          </span>
          <span className="text-xs text-muted-foreground">
            Last verified <strong className="text-foreground">{last}</strong>
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground truncate">
            <strong className="text-foreground">{primary?.authority}</strong>
            {truth.sources.length > 1 && (
              <span> +{truth.sources.length - 1} more</span>
            )}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Next refresh <strong className="text-foreground">{next}</strong>
          </span>
          <Badge variant="outline" className="ml-auto text-[10px] h-5 border-emerald-500/40">
            {truth.refreshCadence}
          </Badge>
        </button>
      </PopoverTrigger>
      <SourcesPopoverContent truth={truth} last={last} next={next} label={label} />
    </Popover>
  );
};

const SourcesPopoverContent: React.FC<{
  truth: ReturnType<typeof getTruth>;
  last: string;
  next: string;
  label?: string;
}> = ({ truth, last, next, label }) => (
  <PopoverContent className="w-96 max-h-[70vh] overflow-y-auto p-0" align="start">
    <div className="p-3 border-b bg-emerald-500/5">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <h4 className="text-sm font-semibold">{label || truth.label}</h4>
      </div>
      <div className="text-[11px] text-muted-foreground flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> Last verified {last}
        </span>
        <span className="inline-flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Next refresh {next}
        </span>
        <Badge variant="outline" className="text-[10px] h-4">{truth.refreshCadence}</Badge>
      </div>
      {truth.protocol && (
        <p className="text-[11px] text-muted-foreground mt-2 italic">{truth.protocol}</p>
      )}
    </div>
    <div className="divide-y">
      {truth.sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors text-xs group"
        >
          {s.flag && <span className="text-base">{s.flag}</span>}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{s.authority}</div>
            <div className="text-[10px] text-muted-foreground truncate">{s.jurisdiction}</div>
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
        </a>
      ))}
    </div>
    <div className="p-2 border-t text-[10px] text-muted-foreground text-center">
      All links route directly to the official issuing authority. No middlemen.
    </div>
  </PopoverContent>
);

export default SourceOfTruthChip;
