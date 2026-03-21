import React, { useRef, useEffect, useState, useCallback } from 'react';
import { type LipsyncClip } from '@/data/lipsyncLibrary';
import { type AvatarFace } from './ConciergeAvatar';

interface ConciergeVideoPlayerProps {
  clip: LipsyncClip;
  face: AvatarFace;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  onEnded?: () => void;
  onError?: () => void;
  className?: string;
}

const SIZES: Record<string, number> = { sm: 40, md: 64, lg: 96, xl: 160, hero: 240 };

const ConciergeVideoPlayer: React.FC<ConciergeVideoPlayerProps> = ({
  clip,
  face,
  size = 'hero',
  onEnded,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dim = SIZES[size] || 240;

  const videoUrl = face === 'female' ? clip.femaleVideoUrl : clip.maleVideoUrl;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
    onError?.();
  }, [onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setHasError(false);
    setIsPlaying(false);

    video.load();
    video.play().catch(() => {
      setHasError(true);
      onError?.();
    });
  }, [videoUrl, onError]);

  if (hasError || !videoUrl) {
    return null; // Caller should fall back to ConciergeAvatar
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: dim, height: dim }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover rounded-full"
        playsInline
        muted={false}
        onPlay={handlePlay}
        onEnded={handleEnded}
        onError={handleError}
        style={{
          width: dim,
          height: dim,
          objectFit: 'cover',
        }}
      />

      {/* Live badge */}
      {isPlaying && (
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
          style={{
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: '0 2px 8px hsl(var(--primary) / 0.4)',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'hsl(var(--destructive))' }}
          />
          LIVE
        </div>
      )}

      {/* Glow ring during playback */}
      {isPlaying && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 20px 4px hsl(var(--primary) / 0.25), inset 0 0 12px hsl(var(--primary) / 0.08)',
          }}
        />
      )}
    </div>
  );
};

export default ConciergeVideoPlayer;
