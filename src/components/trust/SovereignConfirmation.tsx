import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { useTrust } from '@/contexts/TrustContext';

const HOLD_DURATION = 3000; // 3 seconds

const SovereignConfirmation: React.FC = () => {
  const { pendingConfirmation } = useTrust();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);

  useEffect(() => {
    if (!pendingConfirmation) {
      setHoldProgress(0);
      setIsHolding(false);
    }
  }, [pendingConfirmation]);

  const startHold = () => {
    setIsHolding(true);
    startTime.current = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearInterval(holdTimer.current!);
        pendingConfirmation?.onConfirm();
      }
    }, 30);
  };

  const stopHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimer.current) clearInterval(holdTimer.current);
  };

  if (!pendingConfirmation) return null;

  return (
    <Dialog open={!!pendingConfirmation} onOpenChange={(open) => { if (!open) pendingConfirmation.onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg">{pendingConfirmation.title}</DialogTitle>
          </div>
          <DialogDescription>{pendingConfirmation.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <div className="bg-muted rounded-lg p-3 space-y-1.5">
            {pendingConfirmation.details.map((detail, i) => (
              <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                {detail}
              </p>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 flex-shrink-0" />
              <span><strong>What if I change my mind?</strong> Most actions include a 60-second undo window after confirmation.</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={pendingConfirmation.onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <div className="flex-1 relative">
            <Button
              variant="destructive"
              className="w-full relative overflow-hidden"
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
            >
              <div
                className="absolute inset-0 bg-white/20 origin-left transition-none"
                style={{ transform: `scaleX(${holdProgress})` }}
              />
              <span className="relative z-10 text-sm">
                {isHolding ? `Hold... ${Math.ceil(HOLD_DURATION / 1000 * (1 - holdProgress))}s` : 'Hold to Confirm'}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SovereignConfirmation;
