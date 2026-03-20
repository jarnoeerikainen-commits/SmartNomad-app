import React, { useEffect, useState, useRef } from 'react';
import avatarFemale from '@/assets/avatar-female.png';
import avatarMale from '@/assets/avatar-male.png';

export type AvatarFace = 'female' | 'male';

interface ConciergeAvatarProps {
  face: AvatarFace;
  isSpeaking: boolean;
  isTyping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { container: 40, img: 40 },
  md: { container: 64, img: 64 },
  lg: { container: 96, img: 96 },
};

const ConciergeAvatar: React.FC<ConciergeAvatarProps> = ({
  face,
  isSpeaking,
  isTyping = false,
  size = 'md',
  className = '',
}) => {
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); // 0-1
  const mouthInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dim = SIZES[size];
  const src = face === 'female' ? avatarFemale : avatarMale;

  // Blink every 3-6s
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      blinkTimeout.current = setTimeout(() => {
        setBlinkPhase(true);
        setTimeout(() => setBlinkPhase(false), 150);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => {
      if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
    };
  }, []);

  // Mouth animation synced to speaking
  useEffect(() => {
    if (isSpeaking) {
      // Simulate mouth movement with varying amplitude
      mouthInterval.current = setInterval(() => {
        setMouthOpen(Math.random() * 0.7 + 0.3); // 0.3–1.0
      }, 120);
    } else {
      if (mouthInterval.current) clearInterval(mouthInterval.current);
      setMouthOpen(0);
    }
    return () => {
      if (mouthInterval.current) clearInterval(mouthInterval.current);
    };
  }, [isSpeaking]);

  // Subtle chin/jaw movement derived from mouthOpen
  const jawShift = mouthOpen * 1.5; // px
  const mouthScaleY = 1 + mouthOpen * 0.02;

  // Breathing animation — gentle vertical bob
  const breathingStyle: React.CSSProperties = {
    animation: 'concierge-breathe 4s ease-in-out infinite',
  };

  return (
    <div
      className={`relative flex-shrink-0 select-none ${className}`}
      style={{ width: dim.container, height: dim.container }}
    >
      {/* Glow ring when speaking */}
      {isSpeaking && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 12px 3px hsl(var(--primary) / 0.45)',
            animation: 'concierge-pulse-ring 1.2s ease-in-out infinite',
          }}
        />
      )}

      {/* Typing indicator ring */}
      {isTyping && !isSpeaking && (
        <div
          className="absolute inset-0 rounded-full border-2 border-primary/40"
          style={{ animation: 'concierge-spin-ring 2s linear infinite' }}
        />
      )}

      {/* Avatar image with animations */}
      <div
        className="rounded-full overflow-hidden border-2 border-primary/30"
        style={{
          width: dim.img,
          height: dim.img,
          ...breathingStyle,
          transform: `translateY(${jawShift}px) scaleY(${mouthScaleY})`,
          transition: 'transform 0.08s ease-out',
        }}
      >
        <img
          src={src}
          alt={`AI Concierge ${face}`}
          className="w-full h-full object-cover"
          style={{
            // Blink effect — slight vertical squish on the top half
            clipPath: blinkPhase
              ? 'inset(0 0 0 0)' // fully visible but eyes "close" via overlay
              : 'inset(0 0 0 0)',
            filter: blinkPhase ? 'brightness(0.96)' : 'brightness(1)',
            transition: 'filter 0.1s ease',
          }}
          draggable={false}
        />

        {/* Blink overlay — thin dark bar across eye area */}
        {blinkPhase && (
          <div
            className="absolute left-0 right-0 bg-foreground/15"
            style={{
              top: '32%',
              height: '8%',
              borderRadius: '50%',
              transition: 'opacity 0.08s',
            }}
          />
        )}
      </div>

      {/* Mouth movement overlay — subtle shadow under lower face */}
      {isSpeaking && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-foreground/10 rounded-full"
          style={{
            bottom: `${8 + mouthOpen * 4}%`,
            width: `${30 + mouthOpen * 15}%`,
            height: `${4 + mouthOpen * 6}%`,
            opacity: mouthOpen * 0.7,
            transition: 'all 0.08s ease-out',
          }}
        />
      )}

      {/* Online indicator */}
      <div
        className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background"
        style={{ boxShadow: '0 0 6px hsl(var(--success) / 0.6)' }}
      />

      {/* CSS keyframes */}
      <style>{`
        @keyframes concierge-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes concierge-pulse-ring {
          0%, 100% { box-shadow: 0 0 8px 2px hsl(var(--primary) / 0.3); }
          50% { box-shadow: 0 0 16px 5px hsl(var(--primary) / 0.55); }
        }
        @keyframes concierge-spin-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConciergeAvatar;
