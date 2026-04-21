import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, MapPin, Calendar as CalendarIcon, Mic, Camera, Bell, Mail, Heart } from 'lucide-react';

interface SovereignAccessTourProps {
  open: boolean;
  onClose: () => void;
  onOpenAccessCenter: () => void;
}

/**
 * Soft onboarding tour shown ONCE after signup.
 *
 * Important: this is a PREVIEW only — no permissions are requested here.
 * Each permission is asked just-in-time when the user taps the relevant
 * feature, with our PermissionPrePrompt component.
 */
const SovereignAccessTour: React.FC<SovereignAccessTourProps> = ({ open, onClose, onOpenAccessCenter }) => {
  const previews = [
    { icon: MapPin, label: 'Location', text: 'Auto-count Schengen 90/180 & tax-residency days' },
    { icon: CalendarIcon, label: 'Calendar', text: 'Detect upcoming flights & add visa expiry reminders' },
    { icon: Mail, label: 'Email import', text: 'One-tap import flight & hotel confirmations from Gmail / Outlook' },
    { icon: Mic, label: 'Microphone', text: 'Talk to your concierge — hands-free while travelling' },
    { icon: Camera, label: 'Camera', text: 'Scan passports & receipts into your encrypted vault' },
    { icon: Bell, label: 'Notifications', text: 'Schengen, weather, threat & visa-expiry alerts' },
    { icon: Heart, label: 'Health (optional)', text: 'Sync vaccinations & sleep for jet-lag protocol' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle>Unlock your Sovereign OS</DialogTitle>
              <DialogDescription>
                Here's what SuperNomad can do for you — when and only when you allow it.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 my-2">
          {previews.map(({ icon: Icon, label, text }) => (
            <div key={label} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
              <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-semibold">
            <Badge variant="outline" className="text-[10px]">Sovereign Trust</Badge>
            <span>How we ask</span>
          </div>
          <p className="text-muted-foreground">
            Nothing is enabled now. Every permission is asked just-in-time, with the exact reason.
            Decline anything — the rest of the app keeps working. Manage everything in <strong>Sovereign Access</strong>.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={onClose}>
            Maybe later
          </Button>
          <Button onClick={onOpenAccessCenter}>Open Sovereign Access</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SovereignAccessTour;
