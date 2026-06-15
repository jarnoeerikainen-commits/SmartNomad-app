import React, { useEffect, useState } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const STORAGE_KEY = 'supernomad_heygen_avatar_enabled';

/**
 * Opt-in toggle for the HeyGen video-avatar layer on Concierge calls.
 * Persists preference in localStorage; consumers (call card / call module)
 * can read `localStorage.getItem(STORAGE_KEY) === '1'` to mount the avatar.
 */
const HeyGenAvatarToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try { setEnabled(localStorage.getItem(STORAGE_KEY) === '1'); } catch {}
  }, []);

  const onChange = (v: boolean) => {
    setEnabled(v);
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch {}
    window.dispatchEvent(new CustomEvent('heygen:avatar-toggle', { detail: { enabled: v } }));
  };

  const Icon = enabled ? Video : VideoOff;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/60 px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={`h-4 w-4 shrink-0 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-foreground leading-tight">Video avatar (HeyGen)</div>
          <div className="text-[11px] text-muted-foreground leading-snug truncate">
            See Concierge speak — opt-in, off by default
          </div>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} aria-label="Toggle HeyGen video avatar" />
    </div>
  );
};

export default HeyGenAvatarToggle;
