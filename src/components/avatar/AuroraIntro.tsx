import React, { useState, useCallback } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import HeyGenAuroraStream from './HeyGenAuroraStream';
import { auroraLines, type AuroraBeat, type AuroraLine } from './auroraScript';
import { MapPin, Lock, Calendar, Sparkles, Check, ShieldCheck } from 'lucide-react';

interface Props {
  userName?: string;
  onComplete: () => void;
}

const card =
  'rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-3 py-2.5 shadow-2xl';

const AuroraIntro: React.FC<Props> = ({ userName = 'Nomad', onComplete }) => {
  const [muted, setMuted] = useState(false);
  const [skipSignal, setSkipSignal] = useState(false);
  const [activeBeats, setActiveBeats] = useState<Set<AuroraBeat>>(new Set());
  const [currentCaption, setCurrentCaption] = useState('');
  const [lineProgress, setLineProgress] = useState(0); // 0..auroraLines.length

  // Personalize each line
  const personalizedLines = auroraLines.map((l) => ({
    ...l,
    text: l.text.replace('{name}', userName),
  }));

  const handleLineStart = useCallback(
    (idx: number, text: string) => {
      const line: AuroraLine = personalizedLines[idx];
      setCurrentCaption(line.caption?.replace('{name}', userName) ?? text);
      if (line.beat) {
        setActiveBeats((prev) => new Set(prev).add(line.beat!));
      }
      setLineProgress(idx + 1);
    },
    [personalizedLines, userName]
  );

  const handleSkip = () => {
    setSkipSignal(true);
    setTimeout(onComplete, 200);
  };

  const progress = lineProgress / auroraLines.length;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      role="dialog"
      aria-label="Meet Aurora — your Sovereign Companion"
    >
      {/* Stage — portrait 9:16 framed cinematically */}
      <div className="relative w-full h-full max-w-[480px] mx-auto">
        {/* Live HeyGen stream — perfect lip-sync */}
        <HeyGenAuroraStream
          lines={personalizedLines.map((l) => l.text)}
          onComplete={onComplete}
          onLineStart={handleLineStart}
          muted={muted}
          skipSignal={skipSignal}
        />

        {/* Vignette for caption legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.85) 100%)',
          }}
        />

        {/* ─── UI BEATS ─── */}

        {/* Name chip (top-left) */}
        <div
          className={`absolute top-5 left-5 ${card} flex items-center gap-2 transition-all duration-500 ${
            activeBeats.has('name-chip')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-xs font-medium text-white">Hi, {userName}</span>
        </div>

        {/* Vault lock (top-right, below mute) */}
        <div
          className={`absolute top-14 right-3 ${card} flex items-center gap-2 transition-all duration-500 ${
            activeBeats.has('vault-pulse')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          <Lock
            className={`h-3.5 w-3.5 text-emerald-300 ${
              activeBeats.has('vault-pulse') ? 'animate-pulse' : ''
            }`}
          />
          <span className="text-[10px] uppercase tracking-wider text-white/80">Vault · Read-only</span>
        </div>

        {/* GPS pin drop (mid-left) */}
        <div
          className={`absolute top-1/3 left-5 ${card} flex items-center gap-2 transition-all duration-700 ${
            activeBeats.has('gps-drop')
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <MapPin className="h-3.5 w-3.5 text-rose-400" />
          <span className="text-xs font-medium text-white">Helsinki, FI</span>
        </div>

        {/* Tax warning card */}
        <div
          className={`absolute top-[28%] right-3 w-[200px] ${card} transition-all duration-500 ${
            activeBeats.has('tax-card')
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-6 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-[10px] uppercase tracking-wider text-amber-200/90 font-semibold">
              Tax · Schengen
            </span>
          </div>
          <p className="text-xs text-white leading-snug">90-day cap — 22 days remaining</p>
        </div>

        {/* Social invite */}
        <div
          className={`absolute top-[48%] right-3 w-[200px] ${card} transition-all duration-500 ${
            activeBeats.has('social-card')
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-6 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-[10px] uppercase tracking-wider text-sky-200/90 font-semibold">
              Tonight · 19:00
            </span>
          </div>
          <p className="text-xs text-white leading-snug">Löyly Sauna Social — 14 nomads going</p>
        </div>

        {/* Outfit chip */}
        <div
          className={`absolute bottom-32 left-5 ${card} flex items-center gap-2 transition-all duration-500 ${
            activeBeats.has('outfit-chip')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white">
            Nordic Coat · <span className="text-amber-300">$15 USDC</span> · x402
          </span>
        </div>

        {/* Tip button */}
        <button
          type="button"
          className={`absolute bottom-32 right-5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-semibold shadow-2xl transition-all duration-500 ${
            activeBeats.has('tip-button') && !activeBeats.has('tip-confirm')
              ? 'opacity-100 scale-100 animate-pulse'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          ✨ Tip Aurora · $5
        </button>

        {/* Tip confirm */}
        <div
          className={`absolute bottom-32 right-5 ${card} flex items-center gap-2 transition-all duration-500 ${
            activeBeats.has('tip-confirm')
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
          style={{ borderColor: 'rgba(52,211,153,0.5)' }}
        >
          <Check className="h-4 w-4 text-emerald-300" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">$5 tipped via x402</span>
            <span className="text-[10px] text-emerald-300/90">Settled in 0.4s</span>
          </div>
        </div>

        {/* Top bar: mute */}
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute top-3 left-3 z-10 px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs flex items-center gap-1"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>

        {/* Skip */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs flex items-center gap-1"
          aria-label="Skip intro"
        >
          Skip <X className="h-3 w-3" />
        </button>

        {/* Caption */}
        <div className="absolute bottom-16 left-0 right-0 px-6 z-10">
          <p
            key={currentCaption}
            className="text-center text-white text-base sm:text-lg font-medium leading-snug animate-fade-in"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}
          >
            {currentCaption}
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-6 left-6 right-6 h-0.5 rounded-full bg-white/10 overflow-hidden z-10">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-[width] duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Brand mark */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">
            SuperNomad · Sovereign Avatar · Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuroraIntro;
