import React from 'react';
import { LifeBuoy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HumanSupportEscalationProps {
  reason: string;
  onContact?: () => void;
}

/**
 * Rendered when the Concierge AI is not 100% sure and emits
 * [ESCALATE: reason]. Offers a one-tap handoff to the
 * SuperNomad human support team.
 */
const HumanSupportEscalation: React.FC<HumanSupportEscalationProps> = ({ reason, onContact }) => {
  const handleClick = () => {
    if (onContact) return onContact();
    // Default: navigate to the in-app support center
    window.dispatchEvent(new CustomEvent('supernomad:open-support', { detail: { reason } }));
  };

  return (
    <div className="mt-2 rounded-lg border border-warning/40 bg-warning/5 px-3 py-2.5 text-xs">
      <div className="flex items-start gap-2">
        <LifeBuoy className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground mb-0.5">Not 100% sure — let's get a human</p>
          <p className="text-muted-foreground leading-snug mb-2">{reason}</p>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] border-warning/50 hover:bg-warning/10"
            onClick={handleClick}
          >
            Contact SuperNomad Support
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HumanSupportEscalation;
