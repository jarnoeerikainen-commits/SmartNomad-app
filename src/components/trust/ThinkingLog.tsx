import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useTrust } from '@/contexts/TrustContext';

const ThinkingLog: React.FC = () => {
  const { thinkingSteps, isThinking } = useTrust();
  const [expanded, setExpanded] = useState(false);

  if (thinkingSteps.length === 0 && !isThinking) return null;

  const activeStep = thinkingSteps.find(s => s.status === 'active');
  const allDone = thinkingSteps.length > 0 && thinkingSteps.every(s => s.status === 'done');

  return (
    <div className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {allDone ? (
          <CheckCircle2 className="h-3 w-3 text-green-500" />
        ) : (
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
        )}
        <span className="font-medium">
          {allDone ? 'Analysis complete' : activeStep?.label || 'Thinking...'}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 pl-5 border-l border-border/30 ml-1.5">
          {thinkingSteps.map(step => (
            <div key={step.id} className="flex items-center gap-2 text-muted-foreground">
              {step.status === 'done' ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
              ) : step.status === 'active' ? (
                <Loader2 className="h-3 w-3 animate-spin text-primary flex-shrink-0" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground/30 flex-shrink-0" />
              )}
              <span className={step.status === 'done' ? 'line-through opacity-60' : ''}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThinkingLog;
