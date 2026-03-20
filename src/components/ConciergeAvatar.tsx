import React, { useEffect, useState, useRef, useCallback } from 'react';
import avatarFemale from '@/assets/avatar-female.png';
import avatarMale from '@/assets/avatar-male.png';

export type AvatarFace = 'female' | 'male';

interface ConciergeAvatarProps {
  face: AvatarFace;
  isSpeaking: boolean;
  isTyping?: boolean;
  mouthOpenness?: number;
  currentWord?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expandOnSpeak?: boolean;
  className?: string;
}

const SIZES = { sm: 40, md: 64, lg: 96, xl: 160 };

// Smooth interpolation helper
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const ConciergeAvatar: React.FC<ConciergeAvatarProps> = ({
  face,
  isSpeaking,
  isTyping = false,
  mouthOpenness: externalMouth,
  size = 'md',
  expandOnSpeak = false,
  className = '',
}) => {
  const baseDim = SIZES[size];
  const src = face === 'female' ? avatarFemale : avatarMale;

  // ---- Smooth animation state at 60fps via rAF ----
  const animState = useRef({
    mouthOpen: 0,       // current smoothed mouth 0-1
    targetMouth: 0,     // target from phoneme
    jawY: 0,            // jaw displacement px
    cheekL: 0,          // left cheek tension 0-1
    cheekR: 0,          // right cheek tension 0-1
    browRaise: 0,       // eyebrow raise 0-0.3
    headTiltX: 0,       // head tilt degrees
    headTiltY: 0,       // head nod degrees
    headShiftX: 0,      // micro head shift px
    headShiftY: 0,
    blinkProgress: 0,   // 0 = open, 1 = closed
    breathPhase: 0,     // 0-2π breathing cycle
    gazeX: 0,           // eye gaze shift
    gazeY: 0,
  });
  const [renderTick, setRenderTick] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  // Blink scheduling
  const nextBlinkRef = useRef(Date.now() + 2000 + Math.random() * 3000);
  const blinkingRef = useRef(false);
  const blinkStartRef = useRef(0);

  // Gaze scheduling  
  const nextGazeRef = useRef(Date.now() + 1500 + Math.random() * 2000);

  // Head movement scheduling
  const nextHeadMoveRef = useRef(Date.now() + 800 + Math.random() * 1500);
  const headTargetRef = useRef({ tiltX: 0, tiltY: 0, shiftX: 0, shiftY: 0 });

  // Internal fallback mouth when no external data
  const internalMouthRef = useRef(0);
  const internalMouthTargetRef = useRef(0);
  const nextInternalMouthRef = useRef(Date.now());

  // Expansion state
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (expandOnSpeak && isSpeaking) {
      setExpanded(true);
    } else if (expandOnSpeak && !isSpeaking) {
      const t = setTimeout(() => setExpanded(false), 500);
      return () => clearTimeout(t);
    }
  }, [isSpeaking, expandOnSpeak]);

  const dim = expandOnSpeak && expanded ? Math.min(baseDim * 2.2, 220) : baseDim;

  // Update external mouth target
  useEffect(() => {
    if (externalMouth !== undefined) {
      animState.current.targetMouth = externalMouth;
    }
  }, [externalMouth]);

  // Main animation loop — 60fps
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
    lastTimeRef.current = timestamp;
    const s = animState.current;
    const now = Date.now();

    // ---- MOUTH ----
    if (isSpeaking) {
      if (externalMouth !== undefined) {
        // Smooth toward external phoneme target — fast attack, slower release
        const speed = s.targetMouth > s.mouthOpen ? 18 : 10;
        s.mouthOpen = lerp(s.mouthOpen, s.targetMouth, 1 - Math.exp(-speed * dt));
      } else {
        // Internal mouth: generate naturalistic pattern
        if (now > nextInternalMouthRef.current) {
          // Vary timing: short syllables (60-120ms) mixed with pauses (40-80ms)
          const isSyllable = Math.random() > 0.2;
          internalMouthTargetRef.current = isSyllable
            ? 0.15 + Math.random() * 0.75 // open range
            : Math.random() * 0.08; // near closed for pauses
          nextInternalMouthRef.current = now + (isSyllable ? 60 + Math.random() * 100 : 40 + Math.random() * 80);
        }
        internalMouthRef.current = lerp(internalMouthRef.current, internalMouthTargetRef.current, 1 - Math.exp(-20 * dt));
        s.mouthOpen = internalMouthRef.current;
      }
    } else {
      s.mouthOpen = lerp(s.mouthOpen, 0, 1 - Math.exp(-8 * dt));
    }

    // Derived jaw
    s.jawY = s.mouthOpen * (dim > 80 ? 3.5 : 2);

    // Cheeks tense when mouth wide
    s.cheekL = lerp(s.cheekL, s.mouthOpen > 0.4 ? s.mouthOpen * 0.5 : 0, 1 - Math.exp(-6 * dt));
    s.cheekR = lerp(s.cheekR, s.mouthOpen > 0.4 ? s.mouthOpen * 0.5 : 0, 1 - Math.exp(-6 * dt));

    // Eyebrows raise slightly when speaking emphatically
    const browTarget = isSpeaking && s.mouthOpen > 0.6 ? (s.mouthOpen - 0.6) * 0.5 : 0;
    s.browRaise = lerp(s.browRaise, browTarget, 1 - Math.exp(-4 * dt));

    // ---- BLINK ----
    if (!blinkingRef.current && now > nextBlinkRef.current) {
      blinkingRef.current = true;
      blinkStartRef.current = now;
      // Schedule next blink
      nextBlinkRef.current = now + 2500 + Math.random() * 3500;
      // Double blink 15% chance
      if (Math.random() < 0.15) {
        nextBlinkRef.current = now + 350; // quick second blink
      }
    }
    if (blinkingRef.current) {
      const blinkElapsed = now - blinkStartRef.current;
      const blinkDuration = 180; // ms total
      if (blinkElapsed < blinkDuration / 2) {
        s.blinkProgress = blinkElapsed / (blinkDuration / 2); // closing
      } else if (blinkElapsed < blinkDuration) {
        s.blinkProgress = 1 - (blinkElapsed - blinkDuration / 2) / (blinkDuration / 2); // opening
      } else {
        s.blinkProgress = 0;
        blinkingRef.current = false;
      }
    } else {
      s.blinkProgress = lerp(s.blinkProgress, 0, 1 - Math.exp(-20 * dt));
    }

    // ---- BREATHING ----
    s.breathPhase += dt * 1.2; // ~5s cycle
    const breathOffset = Math.sin(s.breathPhase) * 0.8;

    // ---- GAZE (subtle eye movement) ----
    if (now > nextGazeRef.current) {
      nextGazeRef.current = now + 1500 + Math.random() * 3000;
      // Look slightly different directions
      s.gazeX = (Math.random() - 0.5) * 1.2;
      s.gazeY = (Math.random() - 0.5) * 0.8;
    }

    // ---- HEAD micro-movements ----
    if (now > nextHeadMoveRef.current) {
      nextHeadMoveRef.current = now + 1000 + Math.random() * 2000;
      const intensity = isSpeaking ? 1.5 : 0.6;
      headTargetRef.current = {
        tiltX: (Math.random() - 0.5) * 1.5 * intensity,
        tiltY: (Math.random() - 0.5) * 1.0 * intensity,
        shiftX: (Math.random() - 0.5) * 0.7 * intensity,
        shiftY: (Math.random() - 0.5) * 0.5 * intensity + breathOffset,
      };
      // Nod slightly when speaking (bias downward then up)
      if (isSpeaking && s.mouthOpen > 0.5) {
        headTargetRef.current.tiltY += 0.8;
      }
    }
    const ht = headTargetRef.current;
    s.headTiltX = lerp(s.headTiltX, ht.tiltX, 1 - Math.exp(-3 * dt));
    s.headTiltY = lerp(s.headTiltY, ht.tiltY, 1 - Math.exp(-3 * dt));
    s.headShiftX = lerp(s.headShiftX, ht.shiftX, 1 - Math.exp(-3 * dt));
    s.headShiftY = lerp(s.headShiftY, ht.shiftY + breathOffset, 1 - Math.exp(-3 * dt));

    // Trigger React re-render
    setRenderTick(t => t + 1);
    rafRef.current = requestAnimationFrame(animate);
  }, [isSpeaking, externalMouth, dim]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Read current animation state for rendering
  const s = animState.current;
  const mo = s.mouthOpen; // 0-1

  // Face-specific mouth position tuning
  const mouthBottom = face === 'female' ? 17 : 15;
  const mouthCenterY = 100 - mouthBottom;

  // Jaw clip: lower portion of face moves down
  const jawClipTop = 72; // % from top where jaw split happens
  const jawTranslateY = s.jawY;

  // Mouth geometry
  const mouthW = 24 + mo * 10; // 24-34% of face width
  const mouthH = Math.max(0.5, mo * 14); // 0-14% height
  const teethH = mo > 0.35 ? Math.min(mouthH * 0.35, 5) : 0;
  const tongueVisible = mo > 0.55;

  // Cheek dimple shadows
  const cheekShadowOpacity = s.cheekL * 0.25;

  // Eye squint from blink
  const eyeScale = 1 - s.blinkProgress * 0.95;

  // Nostril flare when speaking with open mouth
  const nostrilFlare = mo > 0.4 ? (mo - 0.4) * 0.3 : 0;

  return (
    <div
      className={`relative flex-shrink-0 select-none ${className}`}
      style={{
        width: dim,
        height: dim,
        transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1), height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Speaking glow */}
      {isSpeaking && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -4,
            boxShadow: `0 0 ${12 + mo * 14}px ${3 + mo * 5}px hsl(var(--primary) / ${0.15 + mo * 0.2})`,
            transition: 'box-shadow 0.1s ease-out',
          }}
        />
      )}

      {/* Typing indicator */}
      {isTyping && !isSpeaking && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -2,
            border: '2px solid transparent',
            borderTopColor: 'hsl(var(--primary) / 0.4)',
            animation: 'avatar-spin 1.5s linear infinite',
          }}
        />
      )}

      {/* Face container with head movement */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          border: `${dim > 80 ? 3 : 2}px solid hsl(var(--primary) / ${isSpeaking ? 0.5 : 0.2})`,
          transition: 'border-color 0.3s ease',
          transform: `
            translate(${s.headShiftX}px, ${s.headShiftY}px)
            rotate(${s.headTiltX}deg)
          `,
        }}
      >
        {/* Layer 1: Upper face (static — eyes, forehead, nose) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 ${100 - jawClipTop}% 0)`,
          }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
            style={{
              transform: `translateY(${s.browRaise * -1.5}px)`,
            }}
          />

          {/* Eye blink overlays — skin-colored lids that close over eyes */}
          {s.blinkProgress > 0.01 && (
            <>
              <div
                className="absolute"
                style={{
                  left: '20%', width: '22%',
                  top: `${28 + (1 - eyeScale) * 2}%`,
                  height: `${10 * s.blinkProgress}%`,
                  background: face === 'female'
                    ? 'linear-gradient(180deg, rgba(210,185,165,0.92) 0%, rgba(200,175,155,0.88) 100%)'
                    : 'linear-gradient(180deg, rgba(195,170,145,0.92) 0%, rgba(185,160,135,0.88) 100%)',
                  borderRadius: '0 0 50% 50%',
                }}
              />
              <div
                className="absolute"
                style={{
                  right: '20%', width: '22%',
                  top: `${28 + (1 - eyeScale) * 2}%`,
                  height: `${10 * s.blinkProgress}%`,
                  background: face === 'female'
                    ? 'linear-gradient(180deg, rgba(210,185,165,0.92) 0%, rgba(200,175,155,0.88) 100%)'
                    : 'linear-gradient(180deg, rgba(195,170,145,0.92) 0%, rgba(185,160,135,0.88) 100%)',
                  borderRadius: '0 0 50% 50%',
                }}
              />
            </>
          )}

          {/* Eyebrow raise — subtle shadow shift */}
          {s.browRaise > 0.02 && (
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: '22%',
                width: '60%',
                height: '3%',
                background: `rgba(0,0,0,${s.browRaise * 0.15})`,
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />
          )}
        </div>

        {/* Layer 2: Lower face / jaw — moves down with speech */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(${jawClipTop}% 0 0 0)`,
            transform: `translateY(${jawTranslateY}px)`,
          }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Layer 3: Mouth interior — dark cavity */}
        {mo > 0.03 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${jawTranslateY * 0.5}px)`,
              top: `${mouthCenterY - mouthH * 0.3}%`,
              width: `${mouthW}%`,
              height: `${mouthH}%`,
              background: `radial-gradient(ellipse at 50% 40%, 
                rgba(30, 12, 12, ${0.7 + mo * 0.25}) 0%, 
                rgba(50, 20, 20, ${0.5 + mo * 0.2}) 50%,
                rgba(70, 35, 35, ${0.3 + mo * 0.15}) 80%,
                transparent 100%)`,
              borderRadius: `${40 + mo * 10}% / ${50 + mo * 10}%`,
            }}
          />
        )}

        {/* Layer 4: Upper teeth */}
        {teethH > 0 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${jawTranslateY * 0.2}px)`,
              top: `${mouthCenterY - mouthH * 0.25}%`,
              width: `${mouthW - 6}%`,
              height: `${teethH}%`,
              background: `linear-gradient(180deg, 
                rgba(255, 253, 250, ${0.5 + mo * 0.35}) 0%, 
                rgba(245, 240, 235, ${0.4 + mo * 0.3}) 100%)`,
              borderRadius: '2px 2px 40% 40%',
            }}
          />
        )}

        {/* Layer 5: Lower teeth hint */}
        {mo > 0.5 && teethH > 0 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${jawTranslateY * 0.7}px)`,
              top: `${mouthCenterY + mouthH * 0.05}%`,
              width: `${mouthW - 10}%`,
              height: `${teethH * 0.6}%`,
              background: `linear-gradient(0deg, 
                rgba(250, 248, 245, ${0.3 + (mo - 0.5) * 0.4}) 0%, 
                rgba(240, 235, 230, ${0.2 + (mo - 0.5) * 0.3}) 100%)`,
              borderRadius: '40% 40% 2px 2px',
            }}
          />
        )}

        {/* Layer 6: Tongue hint for wide open */}
        {tongueVisible && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${jawTranslateY * 0.6}px)`,
              top: `${mouthCenterY + mouthH * 0.1}%`,
              width: `${mouthW - 14}%`,
              height: `${(mo - 0.55) * 8}%`,
              background: `radial-gradient(ellipse, 
                rgba(190, 100, 100, ${0.3 + (mo - 0.55) * 0.5}) 0%, 
                transparent 100%)`,
              borderRadius: '50%',
            }}
          />
        )}

        {/* Layer 7: Lip lines — upper lip shadow */}
        {mo > 0.08 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%)`,
              top: `${mouthCenterY - mouthH * 0.35 - 1}%`,
              width: `${mouthW + 4}%`,
              height: '1.5%',
              background: `rgba(160, 120, 100, ${mo * 0.25})`,
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        )}

        {/* Layer 8: Lower lip highlight */}
        {mo > 0.08 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${jawTranslateY * 0.8}px)`,
              top: `${mouthCenterY + mouthH * 0.25}%`,
              width: `${mouthW + 2}%`,
              height: '1.8%',
              background: `rgba(200, 155, 140, ${mo * 0.2})`,
              borderRadius: '50%',
              filter: 'blur(0.8px)',
            }}
          />
        )}

        {/* Cheek tension shadows */}
        {cheekShadowOpacity > 0.01 && (
          <>
            <div
              className="absolute"
              style={{
                left: '8%', top: '62%',
                width: '18%', height: '12%',
                background: `rgba(0,0,0,${cheekShadowOpacity})`,
                borderRadius: '50%',
                filter: 'blur(4px)',
              }}
            />
            <div
              className="absolute"
              style={{
                right: '8%', top: '62%',
                width: '18%', height: '12%',
                background: `rgba(0,0,0,${cheekShadowOpacity})`,
                borderRadius: '50%',
                filter: 'blur(4px)',
              }}
            />
          </>
        )}

        {/* Nostril flare */}
        {nostrilFlare > 0.01 && (
          <>
            <div
              className="absolute"
              style={{
                left: '38%', top: '56%',
                width: `${3 + nostrilFlare * 2}%`,
                height: `${2 + nostrilFlare * 1}%`,
                background: `rgba(0,0,0,${nostrilFlare * 0.2})`,
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
            />
            <div
              className="absolute"
              style={{
                right: '38%', top: '56%',
                width: `${3 + nostrilFlare * 2}%`,
                height: `${2 + nostrilFlare * 1}%`,
                background: `rgba(0,0,0,${nostrilFlare * 0.2})`,
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
            />
          </>
        )}

        {/* Jaw-upper seam blend — hide the clip boundary */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${jawClipTop - 1}%`,
            height: '4%',
            background: face === 'female'
              ? 'linear-gradient(180deg, transparent 0%, rgba(210,185,168,0.15) 40%, rgba(210,185,168,0.15) 60%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(195,170,148,0.15) 40%, rgba(195,170,148,0.15) 60%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Online indicator */}
      {!isSpeaking && (
        <div
          className="absolute rounded-full bg-success border-2 border-background"
          style={{
            bottom: dim > 80 ? 2 : 0,
            right: dim > 80 ? 2 : 0,
            width: dim > 80 ? 12 : 8,
            height: dim > 80 ? 12 : 8,
            boxShadow: '0 0 4px hsl(var(--success) / 0.5)',
          }}
        />
      )}

      {/* Sound wave bars when speaking (replaces online dot) */}
      {isSpeaking && dim > 50 && (
        <div
          className="absolute flex items-end gap-[1px]"
          style={{
            bottom: dim > 80 ? 0 : -2,
            right: dim > 80 ? -2 : -4,
            height: dim > 80 ? 16 : 12,
          }}
        >
          {[0.4, 0.7, 1, 0.6, 0.3].map((base, i) => (
            <div
              key={i}
              className="rounded-full bg-primary"
              style={{
                width: dim > 80 ? 2.5 : 1.5,
                height: `${Math.max(20, (base * 0.4 + mo * 0.6) * 100)}%`,
                opacity: 0.6 + mo * 0.4,
                transition: 'height 0.08s ease-out',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes avatar-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConciergeAvatar;
