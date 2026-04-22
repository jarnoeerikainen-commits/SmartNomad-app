import React, { useEffect, useRef, useState } from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { supabase } from '@/integrations/supabase/client';

// HeyGen public stock avatar (free tier) — warm professional woman
// Browse more at https://docs.heygen.com/docs/avatar-library
const HEYGEN_AVATAR_ID = 'Anna_public_3_20240108';
const HEYGEN_VOICE_ID = '131a436a8a1944c8a6d5c10b9eb02b3a'; // warm female English

interface Props {
  /** Lines Aurora should speak in order. Each line streams with perfect lip-sync. */
  lines: string[];
  /** Called when all lines finished speaking */
  onComplete: () => void;
  /** Called when ready to start (after WebRTC handshake) */
  onReady?: () => void;
  /** Optional: caption callback fired as each line begins */
  onLineStart?: (lineIndex: number, text: string) => void;
  /** Mute/unmute audio */
  muted?: boolean;
  /** Skip flag — when set true, immediately tear down */
  skipSignal?: boolean;
}

const HeyGenAuroraStream: React.FC<Props> = ({
  lines,
  onComplete,
  onReady,
  onLineStart,
  muted = false,
  skipSignal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const lineIndexRef = useRef(0);
  const completedRef = useRef(false);
  const [status, setStatus] = useState<'connecting' | 'ready' | 'speaking' | 'error'>('connecting');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // ── Mute toggle ──
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // ── Skip — destroy session ──
  useEffect(() => {
    if (skipSignal && avatarRef.current) {
      avatarRef.current.stopAvatar().catch(() => {});
    }
  }, [skipSignal]);

  // ── Boot HeyGen session ──
  useEffect(() => {
    let cancelled = false;

    const speakNextLine = async () => {
      if (cancelled || completedRef.current || !avatarRef.current) return;

      const idx = lineIndexRef.current;
      if (idx >= lines.length) {
        completedRef.current = true;
        // Wait a touch so the last word finishes, then complete
        setTimeout(() => {
          if (!cancelled) onComplete();
        }, 800);
        return;
      }

      const text = lines[idx];
      onLineStart?.(idx, text);
      lineIndexRef.current = idx + 1;

      try {
        await avatarRef.current.speak({
          text,
          taskType: TaskType.REPEAT, // just speak the text verbatim
        });
        // speak() resolves once the line finishes streaming
        if (!cancelled) speakNextLine();
      } catch (err) {
        console.error('[HeyGen] speak error:', err);
        if (!cancelled) speakNextLine(); // continue regardless
      }
    };

    const boot = async () => {
      try {
        // 1. Get session token from edge function
        const { data, error } = await supabase.functions.invoke('heygen-token');
        if (error || !data?.token) {
          throw new Error(error?.message || 'No token returned');
        }

        if (cancelled) return;

        // 2. Initialize SDK
        const avatar = new StreamingAvatar({ token: data.token });
        avatarRef.current = avatar;

        // 3. Wire stream to <video>
        avatar.on(StreamingEvents.STREAM_READY, (event: any) => {
          if (cancelled) return;
          const stream: MediaStream = event.detail;
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = muted;
            videoRef.current.play().catch((e) => console.warn('[HeyGen] video play blocked:', e));
            setStatus('ready');
            onReady?.();
            // Begin scripted monologue
            setTimeout(speakNextLine, 400);
          }
        });

        avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log('[HeyGen] stream disconnected');
        });

        avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
          setStatus('speaking');
        });

        avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
          setStatus('ready');
        });

        // 4. Start session with stock avatar
        await avatar.createStartAvatar({
          avatarName: HEYGEN_AVATAR_ID,
          quality: AvatarQuality.High,
          voice: {
            voiceId: HEYGEN_VOICE_ID,
            rate: 1.0,
            emotion: VoiceEmotion.FRIENDLY,
          },
          language: 'en',
          disableIdleTimeout: false,
        });
      } catch (err: any) {
        console.error('[HeyGen] boot failed:', err);
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err?.message || 'Failed to start avatar');
          // Fail-safe: complete after a beat so user isn't stuck
          setTimeout(() => {
            if (!cancelled && !completedRef.current) onComplete();
          }, 2500);
        }
      }
    };

    boot();

    return () => {
      cancelled = true;
      if (avatarRef.current) {
        avatarRef.current.stopAvatar().catch(() => {});
        avatarRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.05)' }}
      />

      {/* Loading overlay */}
      {status === 'connecting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-amber-300/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-amber-300/60 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 animate-pulse" />
          </div>
          <p className="text-white/80 text-sm font-medium tracking-wide">Materializing Aurora…</p>
          <p className="text-white/40 text-[10px] mt-1 uppercase tracking-[0.3em]">HeyGen · WebRTC</p>
        </div>
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8 text-center">
          <p className="text-white text-sm mb-2">Aurora couldn't connect this time.</p>
          <p className="text-white/50 text-xs">{errorMsg}</p>
        </div>
      )}
    </div>
  );
};

export default HeyGenAuroraStream;
