import React from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'disabled';

interface Props {
  state: VoiceState;
  onClick?: () => void;
  size?: number;
  label?: string;
}

const RING: Record<VoiceState, string> = {
  idle:      'ring-2 ring-border bg-card text-muted-foreground hover:text-foreground hover:ring-primary/40',
  listening: 'ring-2 ring-primary bg-primary/10 text-primary animate-[pulse_1.5s_ease-in-out_infinite]',
  thinking:  'ring-2 ring-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]',
  speaking:  'ring-2 ring-accent bg-accent/15 text-accent',
  disabled:  'ring-2 ring-border/40 bg-muted text-muted-foreground opacity-50 cursor-not-allowed',
};

const LABELS: Record<VoiceState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
  disabled: 'Microphone unavailable',
};

/**
 * VoiceStateRing — single physical control with 4 visible states (+ disabled).
 * Replaces the previous 4-icons-per-state pattern with one consistent ring.
 */
const VoiceStateRing: React.FC<Props> = ({ state, onClick, size = 56, label }) => {
  const Icon =
    state === 'thinking' ? Loader2 :
    state === 'speaking' ? Volume2 :
    state === 'disabled' ? MicOff : Mic;

  return (
    <button
      type="button"
      onClick={state === 'disabled' ? undefined : onClick}
      disabled={state === 'disabled'}
      aria-label={label ?? LABELS[state]}
      title={label ?? LABELS[state]}
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center transition-all duration-200 touch-44 ${RING[state]}`}
    >
      <Icon
        className={`h-1/2 w-1/2 ${state === 'thinking' ? 'animate-spin' : ''}`}
        aria-hidden="true"
      />
      {state === 'listening' && (
        <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping" aria-hidden="true" />
      )}
    </button>
  );
};

export default VoiceStateRing;
