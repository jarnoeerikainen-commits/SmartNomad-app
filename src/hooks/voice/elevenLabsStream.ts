// ═══════════════════════════════════════════════════════════════════════════
// ElevenLabs streaming TTS player — premium Concierge voice
// ───────────────────────────────────────────────────────────────────────────
// • Calls the `elevenlabs-tts` edge function which streams MP3 chunks
// • Plays via HTMLAudioElement with `audio/mpeg` MediaSource fallback to blob
// • Drives the same mouth-openness signal the avatar uses (Web Audio analyser)
// • Cleanly cancels on stop / new utterance so barge-in feels instant
// ═══════════════════════════════════════════════════════════════════════════

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export interface ElevenStreamHandle {
  audio: HTMLAudioElement;
  cancel: () => void;
  promise: Promise<void>;
  /** 0..1 mouth openness derived from RMS volume — null until audio starts. */
  getOpenness: () => number;
}

export interface ElevenStreamOptions {
  text: string;
  lang?: string;
  gender?: 'woman' | 'man';
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
  /** Polled while audio plays — receives openness 0..1 every animation frame. */
  onOpenness?: (level: number) => void;
}

/**
 * Stream ElevenLabs TTS to <audio>. Returns a handle that can be cancelled
 * to support barge-in (user starts talking → stop bot mid-sentence).
 */
export function streamElevenLabsTTS(opts: ElevenStreamOptions): ElevenStreamHandle {
  const controller = new AbortController();
  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.preload = 'auto';

  let analyser: AnalyserNode | null = null;
  let audioCtx: AudioContext | null = null;
  let rafId = 0;
  let openness = 0;
  let blobUrl: string | null = null;

  const cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
    audioCtx = null;
    analyser = null;
  };

  const setupAnalyser = () => {
    if (analyser || !opts.onOpenness) return;
    try {
      const Ctx: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
      const src = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      analyser.connect(audioCtx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyser) return;
        analyser.getByteTimeDomainData(data);
        // RMS deviation from 128 → 0..1 mouth signal
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        openness = Math.min(1, rms * 4); // boost for visibility
        opts.onOpenness?.(openness);
        rafId = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      analyser = null;
    }
  };

  const promise = (async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (PUBLISHABLE_KEY) headers.Authorization = `Bearer ${PUBLISHABLE_KEY}`;

      const res = await fetch(TTS_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: opts.text,
          lang: opts.lang,
          gender: opts.gender,
          voiceId: opts.voiceId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`tts ${res.status} ${msg.slice(0, 120)}`);
      }
      if (!res.body) throw new Error('tts empty body');

      // Buffer the streamed MP3 into a Blob URL — most reliable cross-browser.
      // ElevenLabs first-chunk is fast (≈150ms) so we still feel snappy.
      const blob = await res.blob();
      if (controller.signal.aborted) return;

      blobUrl = URL.createObjectURL(blob);
      audio.src = blobUrl;

      audio.addEventListener('play', () => {
        opts.onStart?.();
        setupAnalyser();
      }, { once: true });

      audio.addEventListener('ended', () => {
        cleanup();
        opts.onEnd?.();
      }, { once: true });

      audio.addEventListener('error', () => {
        cleanup();
        opts.onError?.(new Error('audio playback failed'));
      }, { once: true });

      await audio.play();
    } catch (err: any) {
      cleanup();
      if (err?.name === 'AbortError') return;
      opts.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return {
    audio,
    cancel: () => {
      controller.abort();
      try { audio.pause(); } catch { /* noop */ }
      try { audio.removeAttribute('src'); audio.load(); } catch { /* noop */ }
      cleanup();
    },
    promise,
    getOpenness: () => openness,
  };
}
