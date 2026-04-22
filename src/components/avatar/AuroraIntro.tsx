import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import voiceoverUrl from '@/assets/aurora-voiceover.mp3';
import AuroraScene from './AuroraScene';
import { auroraCues, AURORA_TOTAL_MS, type AuroraBeat } from './auroraScript';

interface Props {
  userName?: string;
  onComplete: () => void;
}

const AuroraIntro: React.FC<Props> = ({ userName = 'Nomad', onComplete }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  // ── Drive elapsed time off audio when playing, else wallclock ──
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.95;
      const tryPlay = audio.play();
      if (tryPlay && typeof tryPlay.catch === 'function') {
        tryPlay.catch(() => {
          // Autoplay blocked → fall back to wallclock-driven captions
          setAudioFailed(true);
          startedAtRef.current = performance.now();
        });
      }
    } else {
      startedAtRef.current = performance.now();
    }

    const tick = () => {
      const a = audioRef.current;
      if (a && !a.paused && !audioFailed) {
        setElapsed(a.currentTime * 1000);
      } else if (startedAtRef.current != null) {
        setElapsed(performance.now() - startedAtRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [audioFailed]);

  // ── Auto-close when finished ──
  useEffect(() => {
    if (elapsed >= AURORA_TOTAL_MS) {
      onComplete();
    }
  }, [elapsed, onComplete]);

  // ── Determine current caption + active beats ──
  const { currentCaption, activeBeats, outfit } = useMemo(() => {
    let caption = '';
    const beats = new Set<AuroraBeat>();
    let outfitState: 'blazer' | 'coat' = 'blazer';

    for (const cue of auroraCues) {
      if (elapsed >= cue.atMs) {
        if (cue.caption) caption = cue.caption.replace('{name}', userName);
        if (cue.beat) beats.add(cue.beat);
        if (cue.beat === 'outfit-swap') outfitState = 'coat';
      }
    }

    // Prune transient beats so they appear and stay (most are sticky)
    // tip-button hides once tip-confirm is shown — handled visually in scene
    return { currentCaption: caption, activeBeats: beats, outfit: outfitState };
  }, [elapsed, userName]);

  const handleSkip = () => {
    if (audioRef.current) audioRef.current.pause();
    onComplete();
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const progress = Math.min(1, elapsed / AURORA_TOTAL_MS);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      role="dialog"
      aria-label="Meet Aurora — your Sovereign Companion"
    >
      <audio ref={audioRef} src={voiceoverUrl} preload="auto" />

      {/* Stage — portrait 9:16 framed cinematically */}
      <div className="relative w-full h-full max-w-[480px] mx-auto">
        <AuroraScene activeBeats={activeBeats} outfit={outfit} userName={userName} />

        {/* Top bar: skip + mute */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={toggleMute}
            className="px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs flex items-center gap-1"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>
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
            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Brand mark */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">SuperNomad · Sovereign Avatar</span>
        </div>
      </div>
    </div>
  );
};

export default AuroraIntro;
