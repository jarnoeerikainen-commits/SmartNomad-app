import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Pause, Play, SkipForward, X, ChevronRight } from 'lucide-react';
import { speakLine, cancelSpeech, primeSpeech, isSpeechAvailable } from '@/components/SuperNomadCall/speech';

/**
 * Guided product tour. Triggered from the landing "Begin tour" link
 * which navigates to /app?tour=1. Walks the user through the core app
 * sections by dispatching `supernomad:navigate` events while speaking
 * synced narration via the Web Speech API. Concierge AI is unaffected.
 */

type Stop = {
  section: string;
  title: string;
  narration: string;
  /** Minimum dwell time per stop in ms (in case speech is unavailable / muted) */
  minDwellMs?: number;
};

const STOPS: Stop[] = [
  {
    section: 'dashboard',
    title: 'Welcome to SuperNomad',
    narration:
      "Welcome aboard. SuperNomad is your sovereign A.I. operating system for life across borders. Let me show you around — it takes about ninety seconds.",
  },
  {
    section: 'guardian',
    title: 'Guardian — 24/7 Safety',
    narration:
      "This is Guardian. Live threat intelligence, location-aware alerts, and one-tap emergency response. It watches the world so you don't have to.",
  },
  {
    section: 'tax-residency',
    title: 'Tax Residency Tracker',
    narration:
      "Tax days, automatically counted across every jurisdiction. The 183-day rule, Schengen 90 over 180, and your personal sovereignty plan — all in one view.",
  },
  {
    section: 'visas',
    title: 'Visa Intelligence',
    narration:
      "Every visa, every expiry, every requirement. SuperNomad matches you to the right visa for your next destination — before you book the flight.",
  },
  {
    // Stay on dashboard so the full Concierge chat panel doesn't take
    // over the screen. The floating concierge presence remains visible
    // alongside the dashboard while we narrate this step.
    section: 'dashboard',
    title: 'Your A.I. Concierge',
    narration:
      "Meet your concierge — always one tap away. Voice or chat, day or night. It books, plans, warns, translates, and remembers everything you tell it — encrypted end to end.",
  },
  {
    section: 'explore-local-life',
    title: 'Premium Local Life',
    narration:
      "Wherever you land, SuperNomad opens the right doors — private clubs, top restaurants, padel, golf, wellness, and reciprocity around the world.",
  },
  {
    section: 'marketplace',
    title: 'Vetted Marketplace',
    narration:
      "Hand-picked offers, up to sixty percent off — from premium hotels to private aviation. Every partner is vetted; every price is real.",
  },
  {
    section: 'travel-insurance',
    title: 'Insurance & Wellness',
    narration:
      "Travel insurance, health cover, jet-lag protocol, and a sleep suite. SuperNomad keeps you protected and performing at your best.",
  },
  {
    section: 'payment-options',
    title: 'Money & Awards',
    narration:
      "Multi-currency payments, FX, crypto, digital banks, award cards — and an A.I. optimizer that picks the best card for every transaction.",
  },
  {
    section: 'vault',
    title: 'Snomad ID Vault',
    narration:
      "Finally, the vault. Passports, licenses, medical records — all stored locally with AES-256-GCM, zero-knowledge encryption. Only you hold the key.",
  },
  {
    section: 'dashboard',
    title: "That's SuperNomad",
    narration:
      "That's the tour. Tap any tile to dive deeper, or just talk to your concierge. Welcome to the sovereign life.",
  },
];

const GuidedTour: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [idx, setIdx] = useState(0);
  const cancelledRef = useRef(false);

  const stop = STOPS[idx];
  const total = STOPS.length;
  const progress = ((idx + 1) / total) * 100;

  const navigateTo = useCallback((section: string) => {
    // Bounce through home/dashboard first to fully tear down any prior
    // panel (notably the AI Concierge tab), so the next section renders
    // on a clean slate and isn't visually overlapped.
    window.dispatchEvent(new CustomEvent('supernomad:home'));
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('supernomad:navigate', { detail: { section } }));
    }, 60);
  }, []);

  const goNext = useCallback(() => {
    if (cancelledRef.current) return;
    setIdx((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const exit = useCallback(() => {
    cancelledRef.current = true;
    cancelSpeech();
    onExit();
  }, [onExit]);

  // Split narration into sentences for reliable, complete TTS playback.
  // Browsers (esp. Chrome) cut single utterances after ~15s — short
  // sentences avoid that and let us guarantee no mid-sentence stops.
  const splitSentences = (text: string): string[] => {
    const parts = text
      .replace(/\s+/g, ' ')
      .match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g);
    return (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
  };

  // Drive each stop: navigate → speak ALL sentences fully → advance
  useEffect(() => {
    if (!started || paused) return;
    cancelledRef.current = false;
    let aborted = false;

    navigateTo(stop.section);
    cancelSpeech();

    const sentences = splitSentences(stop.narration);
    // Floor dwell ensures the user sees the section even if speech is muted/unavailable
    const minDwell = stop.minDwellMs ?? Math.max(4500, stop.narration.length * 55);
    const dwellPromise = new Promise<void>((r) => window.setTimeout(r, minDwell));

    const speechPromise: Promise<void> = (async () => {
      if (muted || !isSpeechAvailable()) {
        await new Promise<void>((r) => window.setTimeout(r, minDwell));
        return;
      }
      // Chrome bug guard: keep speech engine awake during long narrations
      const keepalive = window.setInterval(() => {
        try {
          if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        } catch { /* noop */ }
      }, 10000);
      try {
        for (const sentence of sentences) {
          if (aborted || cancelledRef.current) break;
          // speakLine resolves on end OR error — we always wait for it
          await speakLine(sentence, 'ai');
          // Tiny gap between sentences for natural cadence
          if (!aborted && !cancelledRef.current) {
            await new Promise<void>((r) => window.setTimeout(r, 120));
          }
        }
      } finally {
        window.clearInterval(keepalive);
      }
    })();

    Promise.all([speechPromise, dwellPromise]).then(() => {
      if (aborted || cancelledRef.current || paused) return;
      if (idx >= total - 1) {
        exit();
      } else {
        goNext();
      }
    });

    return () => {
      aborted = true;
      cancelSpeech();
    };
  }, [started, paused, idx, stop, muted, navigateTo, goNext, exit, total]);

  useEffect(() => () => { cancelSpeech(); }, []);

  if (!started) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[hsl(220_22%_5%/0.85)] px-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl border border-[hsl(43_96%_56%/0.4)] bg-[hsl(220_22%_8%)] p-6 text-center shadow-[0_30px_80px_-10px_hsl(0_0%_0%/0.9)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(48_96%_70%)] text-[hsl(220_22%_8%)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="font-display text-2xl text-[hsl(var(--gold))]">Your guided tour is ready</h2>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(30_12%_82%)]">
            I'll walk you through SuperNomad — about 90 seconds, with voice. Tap to begin.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={() => { primeSpeech(); setStarted(true); }}
              className="w-full rounded-full bg-[hsl(var(--gold))] px-5 py-3 text-sm font-semibold uppercase tracking-widest text-[hsl(220_22%_8%)] hover:bg-[hsl(var(--gold-light))]"
            >
              Start tour with voice
            </button>
            <button
              onClick={() => { setMuted(true); setStarted(true); }}
              className="w-full rounded-full border border-[hsl(43_96%_56%/0.35)] px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-[hsl(30_12%_82%)] hover:bg-[hsl(43_96%_56%/0.08)]"
            >
              Start without voice
            </button>
            <button
              onClick={exit}
              className="mt-1 text-xs uppercase tracking-widest text-[hsl(30_12%_60%)] hover:text-[hsl(30_12%_92%)]"
            >
              Skip — explore on my own
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] sm:bottom-4 sm:px-6 sm:pb-4">
      <div className="pointer-events-auto mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[hsl(43_96%_56%/0.45)] bg-[hsl(220_22%_8%/0.96)] shadow-[0_20px_60px_-10px_hsl(0_0%_0%/0.85)] backdrop-blur-md">
        {/* progress */}
        <div className="h-1 w-full bg-[hsl(43_96%_56%/0.12)]">
          <div className="h-full bg-gradient-to-r from-[hsl(38_92%_50%)] to-[hsl(48_96%_70%)] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-start gap-3 p-3 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(48_96%_70%)] text-[hsl(220_22%_8%)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[hsl(var(--gold))]">
              <span>Step {idx + 1} / {total}</span>
              <span className="opacity-50">·</span>
              <span className="truncate text-[hsl(30_12%_70%)]">{stop.title}</span>
            </div>
            <p className="mt-1 text-sm leading-snug text-[hsl(30_12%_92%)] line-clamp-3 sm:line-clamp-2">
              {stop.narration}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume tour' : 'Pause tour'}
              className="rounded-full p-2 text-[hsl(30_12%_82%)] hover:bg-[hsl(43_96%_56%/0.12)] hover:text-white"
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              onClick={() => { cancelSpeech(); if (idx >= total - 1) exit(); else goNext(); }}
              aria-label="Skip to next step"
              className="rounded-full p-2 text-[hsl(30_12%_82%)] hover:bg-[hsl(43_96%_56%/0.12)] hover:text-white"
            >
              {idx >= total - 1 ? <ChevronRight className="h-4 w-4" /> : <SkipForward className="h-4 w-4" />}
            </button>
            <button
              onClick={exit}
              aria-label="Exit tour"
              className="rounded-full p-2 text-[hsl(30_12%_82%)] hover:bg-[hsl(0_70%_55%/0.18)] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
