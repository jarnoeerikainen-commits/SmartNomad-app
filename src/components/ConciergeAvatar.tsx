import React, { useEffect, useState, useRef, useMemo } from 'react';
import avatarFemale from '@/assets/avatar-female.png';
import avatarMale from '@/assets/avatar-male.png';

export type AvatarFace = 'female' | 'male';

interface ConciergeAvatarProps {
  face: AvatarFace;
  isSpeaking: boolean;
  isTyping?: boolean;
  /** 0-1 mouth openness from phoneme analysis */
  mouthOpenness?: number;
  /** Current word being spoken */
  currentWord?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the expanded speaking mode */
  expandOnSpeak?: boolean;
  className?: string;
}

const SIZES = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 140,
};

const ConciergeAvatar: React.FC<ConciergeAvatarProps> = ({
  face,
  isSpeaking,
  isTyping = false,
  mouthOpenness: externalMouth,
  currentWord = '',
  size = 'md',
  expandOnSpeak = false,
  className = '',
}) => {
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [internalMouth, setInternalMouth] = useState(0);
  const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalMouthRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const baseDim = SIZES[size];
  const src = face === 'female' ? avatarFemale : avatarMale;

  // Use external phoneme data if available, otherwise fallback to random
  const mouthOpen = externalMouth !== undefined ? externalMouth : internalMouth;

  // Animated expansion when speaking
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (expandOnSpeak && isSpeaking) {
      setExpanded(true);
    } else if (expandOnSpeak && !isSpeaking) {
      // Delay collapse slightly for smooth feel
      const t = setTimeout(() => setExpanded(false), 400);
      return () => clearTimeout(t);
    }
  }, [isSpeaking, expandOnSpeak]);

  const dim = useMemo(() => {
    if (!expandOnSpeak) return baseDim;
    return expanded ? Math.min(baseDim * 2.5, 200) : baseDim;
  }, [expandOnSpeak, expanded, baseDim]);

  // Blink every 2.5-5s — more frequent for lifelike feel
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 2500;
      blinkTimeout.current = setTimeout(() => {
        setBlinkPhase(true);
        // Double blink occasionally (20% chance)
        const isDoubleBlink = Math.random() < 0.2;
        setTimeout(() => {
          setBlinkPhase(false);
          if (isDoubleBlink) {
            setTimeout(() => {
              setBlinkPhase(true);
              setTimeout(() => setBlinkPhase(false), 120);
            }, 180);
          }
        }, 130);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => { if (blinkTimeout.current) clearTimeout(blinkTimeout.current); };
  }, []);

  // Fallback mouth animation when no external phoneme data
  useEffect(() => {
    if (externalMouth !== undefined) return;
    if (isSpeaking) {
      internalMouthRef.current = setInterval(() => {
        // Naturalistic pattern: quick open, slower close
        setInternalMouth(prev => {
          const target = Math.random() * 0.8 + 0.2;
          return prev + (target - prev) * 0.6;
        });
      }, 100);
    } else {
      if (internalMouthRef.current) clearInterval(internalMouthRef.current);
      setInternalMouth(0);
    }
    return () => { if (internalMouthRef.current) clearInterval(internalMouthRef.current); };
  }, [isSpeaking, externalMouth]);

  // Derive animation values from mouth openness
  const mouthHeight = mouthOpen * 12; // max 12% of face height for mouth opening
  const mouthWidth = 28 + mouthOpen * 8; // 28-36% width
  const jawDrop = mouthOpen * 2.5; // subtle chin drop in px
  const lipStretch = 1 + mouthOpen * 0.015; // very subtle horizontal stretch

  // Subtle micro-movements for lifelike feel
  const [microShift, setMicroShift] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setMicroShift({
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.6,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative flex-shrink-0 select-none ${className}`}
      style={{
        width: dim,
        height: dim,
        transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Outer glow ring — breathing pulse when idle, strong pulse when speaking */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -3,
          background: isSpeaking
            ? 'radial-gradient(circle, hsl(var(--primary) / 0.3) 60%, transparent 100%)'
            : 'transparent',
          boxShadow: isSpeaking
            ? `0 0 ${16 + mouthOpen * 12}px ${4 + mouthOpen * 4}px hsl(var(--primary) / ${0.25 + mouthOpen * 0.2})`
            : isTyping
              ? '0 0 8px 2px hsl(var(--primary) / 0.15)'
              : 'none',
          transition: 'box-shadow 0.15s ease-out, background 0.3s ease',
        }}
      />

      {/* Typing spinner */}
      {isTyping && !isSpeaking && (
        <div
          className="absolute rounded-full"
          style={{
            inset: -2,
            border: '2px solid transparent',
            borderTopColor: 'hsl(var(--primary) / 0.5)',
            borderRightColor: 'hsl(var(--primary) / 0.2)',
            animation: 'avatar-spin 1.5s linear infinite',
          }}
        />
      )}

      {/* Main avatar container */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          border: `${dim > 80 ? 3 : 2}px solid hsl(var(--primary) / ${isSpeaking ? 0.6 : 0.25})`,
          transition: 'border-color 0.3s ease',
          transform: `translate(${microShift.x}px, ${microShift.y}px)`,
        }}
      >
        {/* The face image */}
        <img
          src={src}
          alt={`AI Concierge ${face}`}
          className="w-full h-full object-cover"
          style={{
            transform: `translateY(${jawDrop}px) scaleX(${lipStretch})`,
            transition: 'transform 0.08s ease-out',
            filter: blinkPhase ? 'brightness(0.97)' : 'brightness(1)',
          }}
          draggable={false}
        />

        {/* Eye blink overlays — two separate eye areas for realism */}
        {blinkPhase && (
          <>
            {/* Left eye */}
            <div
              className="absolute bg-[#c4a882]"
              style={{
                left: '22%',
                top: '33%',
                width: '20%',
                height: '6%',
                borderRadius: '50%',
                opacity: 0.85,
              }}
            />
            {/* Right eye */}
            <div
              className="absolute bg-[#c4a882]"
              style={{
                right: '22%',
                top: '33%',
                width: '20%',
                height: '6%',
                borderRadius: '50%',
                opacity: 0.85,
              }}
            />
          </>
        )}

        {/* Mouth opening overlay — dark ellipse that simulates open mouth */}
        {mouthOpen > 0.05 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: 'translateX(-50%)',
              bottom: `${face === 'female' ? 18 : 16}%`,
              width: `${mouthWidth}%`,
              height: `${Math.max(2, mouthHeight)}%`,
              background: `radial-gradient(ellipse, rgba(40, 20, 20, ${0.5 + mouthOpen * 0.35}) 40%, rgba(60, 30, 30, ${0.3 + mouthOpen * 0.2}) 70%, transparent 100%)`,
              borderRadius: '50%',
              transition: 'width 0.06s ease-out, height 0.06s ease-out, bottom 0.06s ease-out',
            }}
          />
        )}

        {/* Upper lip highlight when mouth opens */}
        {mouthOpen > 0.15 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: 'translateX(-50%)',
              bottom: `${(face === 'female' ? 18 : 16) + mouthHeight * 0.7}%`,
              width: `${mouthWidth + 4}%`,
              height: '2%',
              background: `rgba(200, 160, 140, ${mouthOpen * 0.3})`,
              borderRadius: '50%',
              transition: 'all 0.06s ease-out',
            }}
          />
        )}

        {/* Teeth hint when mouth is open wide */}
        {mouthOpen > 0.4 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: 'translateX(-50%)',
              bottom: `${(face === 'female' ? 19 : 17) + mouthHeight * 0.15}%`,
              width: `${mouthWidth - 8}%`,
              height: `${Math.min(mouthHeight * 0.4, 5)}%`,
              background: `rgba(255, 252, 248, ${0.3 + mouthOpen * 0.3})`,
              borderRadius: '40% 40% 50% 50%',
              transition: 'all 0.06s ease-out',
            }}
          />
        )}
      </div>

      {/* Online indicator dot */}
      <div
        className="absolute rounded-full bg-success border-2 border-background"
        style={{
          bottom: dim > 80 ? 2 : 0,
          right: dim > 80 ? 2 : 0,
          width: dim > 80 ? 14 : 10,
          height: dim > 80 ? 14 : 10,
          boxShadow: '0 0 6px hsl(var(--success) / 0.6)',
        }}
      />

      {/* Speaking word bubble — shows current word */}
      {isSpeaking && currentWord && dim > 60 && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-primary bg-background/90 border border-primary/20 rounded-full px-2 py-0.5 shadow-sm"
          style={{
            animation: 'avatar-word-pop 0.15s ease-out',
            maxWidth: dim * 2.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {currentWord}
        </div>
      )}

      <style>{`
        @keyframes avatar-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes avatar-word-pop {
          from { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ConciergeAvatar;
