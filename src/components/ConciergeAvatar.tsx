import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import avatarFemale from '@/assets/avatar-female.png';
import avatarMale from '@/assets/avatar-male.png';

export type AvatarFace = 'female' | 'male';

interface ConciergeAvatarProps {
  face: AvatarFace;
  isSpeaking: boolean;
  isTyping?: boolean;
  mouthOpenness?: number;
  currentWord?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  expandOnSpeak?: boolean;
  showLiveBadge?: boolean;
  className?: string;
}

const SIZES = { sm: 40, md: 64, lg: 96, xl: 160, hero: 240 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

// Perlin-like noise for organic movement
function smoothNoise(t: number, seed: number): number {
  const x = Math.sin(t * 1.1 + seed * 7.3) * 0.5 +
            Math.sin(t * 2.3 + seed * 3.1) * 0.25 +
            Math.sin(t * 4.7 + seed * 1.7) * 0.125;
  return x / 0.875; // normalize to -1..1
}

const ConciergeAvatar: React.FC<ConciergeAvatarProps> = ({
  face,
  isSpeaking,
  isTyping = false,
  mouthOpenness: externalMouth,
  size = 'md',
  expandOnSpeak = false,
  showLiveBadge = false,
  className = '',
}) => {
  const baseDim = SIZES[size];
  const src = face === 'female' ? avatarFemale : avatarMale;

  // ---- Animation state (mutable, 60fps rAF) ----
  const s = useRef({
    mouth: 0,
    targetMouth: 0,
    jawY: 0,
    browRaise: 0,
    blinkProgress: 0,
    breathPhase: Math.random() * Math.PI * 2,
    headTiltX: 0,
    headTiltY: 0,
    headShiftX: 0,
    headShiftY: 0,
    gazeX: 0,
    gazeY: 0,
    cheekTension: 0,
    nostrilFlare: 0,
    // Micro-expression states
    microSmile: 0,
    lipPurse: 0,
    chinTension: 0,
    // Skin flush (blood flow simulation)
    skinFlush: 0,
  });
  const [, tick] = useState(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  // Blink state
  const nextBlink = useRef(Date.now() + 2000 + Math.random() * 2500);
  const blinkActive = useRef(false);
  const blinkStart = useRef(0);
  const isDoubleBlink = useRef(false);
  const doubleBlink2 = useRef(false);

  // Internal mouth when no phoneme data
  const intMouth = useRef(0);
  const intMouthTarget = useRef(0);
  const nextMouthChange = useRef(Date.now());

  // Expansion
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (expandOnSpeak && isSpeaking) setExpanded(true);
    else if (expandOnSpeak && !isSpeaking) {
      const t = setTimeout(() => setExpanded(false), 600);
      return () => clearTimeout(t);
    }
  }, [isSpeaking, expandOnSpeak]);

  const dim = useMemo(() => {
    if (!expandOnSpeak) return baseDim;
    return expanded ? Math.min(baseDim * 2.5, 280) : baseDim;
  }, [expandOnSpeak, expanded, baseDim]);

  // External mouth target
  useEffect(() => {
    if (externalMouth !== undefined) s.current.targetMouth = externalMouth;
  }, [externalMouth]);

  // ---- Main 60fps animation loop ----
  const animate = useCallback(() => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const a = s.current;

    // --- MOUTH ---
    if (isSpeaking) {
      if (externalMouth !== undefined) {
        // Fast attack, natural release with slight overshoot
        const speed = a.targetMouth > a.mouth ? 22 : 12;
        a.mouth = lerp(a.mouth, a.targetMouth, 1 - Math.exp(-speed * 0.016));
      } else {
        // Internal: simulate natural speech rhythm with variable cadence
        if (now > nextMouthChange.current) {
          const syllableType = Math.random();
          if (syllableType > 0.15) {
            // Voiced syllable - wide variety of openness
            intMouthTarget.current = 0.1 + Math.random() * 0.8;
            nextMouthChange.current = now + 50 + Math.random() * 120;
          } else {
            // Brief closure (consonant cluster / pause)
            intMouthTarget.current = Math.random() * 0.06;
            nextMouthChange.current = now + 30 + Math.random() * 60;
          }
        }
        intMouth.current = lerp(intMouth.current, intMouthTarget.current, 1 - Math.exp(-25 * 0.016));
        a.mouth = intMouth.current;
      }
    } else {
      a.mouth = lerp(a.mouth, 0, 1 - Math.exp(-10 * 0.016));
    }

    // Jaw displacement — scaled to avatar size
    const maxJaw = dim > 120 ? 5 : dim > 80 ? 3.5 : 2;
    a.jawY = a.mouth * maxJaw;

    // Cheek tension when mouth wide
    a.cheekTension = lerp(a.cheekTension, a.mouth > 0.35 ? a.mouth * 0.6 : 0, 0.12);

    // Nostril flare
    a.nostrilFlare = lerp(a.nostrilFlare, a.mouth > 0.4 ? (a.mouth - 0.4) * 0.4 : 0, 0.1);

    // Brow raise on emphasis
    const browTarget = isSpeaking && a.mouth > 0.6 ? (a.mouth - 0.6) * 0.7 : 0;
    a.browRaise = lerp(a.browRaise, browTarget, 0.08);

    // Chin tension 
    a.chinTension = lerp(a.chinTension, a.mouth > 0.5 ? a.mouth * 0.3 : 0, 0.1);

    // Lip purse for 'm', 'b', 'p' sounds (low mouth openness while speaking)
    a.lipPurse = lerp(a.lipPurse, isSpeaking && a.mouth < 0.15 && a.mouth > 0.02 ? 0.6 : 0, 0.15);

    // Micro-smile when idle
    const smileTarget = !isSpeaking ? 0.1 + smoothNoise(elapsed * 0.3, 5) * 0.05 : 0;
    a.microSmile = lerp(a.microSmile, smileTarget, 0.03);

    // Skin flush — subtle warmth when speaking intensely
    a.skinFlush = lerp(a.skinFlush, isSpeaking && a.mouth > 0.5 ? 0.15 : 0, 0.02);

    // --- BLINK ---
    if (!blinkActive.current && now > nextBlink.current) {
      blinkActive.current = true;
      blinkStart.current = now;
      isDoubleBlink.current = Math.random() < 0.2;
      doubleBlink2.current = false;
      nextBlink.current = now + 2500 + Math.random() * 4000;
    }
    if (blinkActive.current) {
      const be = now - blinkStart.current;
      const dur = 160;
      if (be < dur / 2) {
        a.blinkProgress = be / (dur / 2);
      } else if (be < dur) {
        a.blinkProgress = 1 - (be - dur / 2) / (dur / 2);
      } else if (isDoubleBlink.current && !doubleBlink2.current && be < dur + 100) {
        a.blinkProgress = 0;
      } else if (isDoubleBlink.current && !doubleBlink2.current && be >= dur + 100) {
        doubleBlink2.current = true;
        blinkStart.current = now;
        a.blinkProgress = 0;
      } else {
        a.blinkProgress = 0;
        blinkActive.current = false;
      }
    } else {
      a.blinkProgress = lerp(a.blinkProgress, 0, 0.3);
    }

    // --- BREATHING ---
    a.breathPhase += 0.016 * 1.1;
    const breathY = Math.sin(a.breathPhase) * 0.6;

    // --- HEAD MOVEMENT (organic noise-based) ---
    const headIntensity = isSpeaking ? 1.8 : 0.7;
    const targetTiltX = smoothNoise(elapsed * 0.4, 1) * 1.2 * headIntensity;
    const targetTiltY = smoothNoise(elapsed * 0.35, 2) * 0.8 * headIntensity +
      (isSpeaking && a.mouth > 0.5 ? 0.6 : 0); // nod on emphasis
    const targetShiftX = smoothNoise(elapsed * 0.25, 3) * 0.5 * headIntensity;
    const targetShiftY = smoothNoise(elapsed * 0.3, 4) * 0.4 * headIntensity + breathY;

    a.headTiltX = lerp(a.headTiltX, targetTiltX, 0.04);
    a.headTiltY = lerp(a.headTiltY, targetTiltY, 0.04);
    a.headShiftX = lerp(a.headShiftX, targetShiftX, 0.04);
    a.headShiftY = lerp(a.headShiftY, targetShiftY, 0.04);

    // --- GAZE ---
    const gazeTargetX = smoothNoise(elapsed * 0.2, 6) * 1.0;
    const gazeTargetY = smoothNoise(elapsed * 0.18, 7) * 0.6;
    a.gazeX = lerp(a.gazeX, gazeTargetX, 0.03);
    a.gazeY = lerp(a.gazeY, gazeTargetY, 0.03);

    tick(t => t + 1);
    rafRef.current = requestAnimationFrame(animate);
  }, [isSpeaking, externalMouth, dim]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Current values for rendering
  const a = s.current;
  const mo = a.mouth;

  // Face-specific positioning
  const mouthBottom = face === 'female' ? 17 : 15;
  const mouthCenterY = 100 - mouthBottom;
  const jawClipTop = 72;

  // Mouth geometry
  const mouthW = 22 + mo * 12;
  const mouthH = Math.max(0.3, mo * 15);
  const teethH = mo > 0.3 ? Math.min(mouthH * 0.38, 6) : 0;
  const tongueVisible = mo > 0.5;
  const lipPurseScale = 1 - a.lipPurse * 0.15;

  // Skin tone for overlays
  const skinBase = face === 'female'
    ? { r: 210, g: 185, b: 165 }
    : { r: 195, g: 170, b: 145 };
  const flushR = Math.min(255, skinBase.r + a.skinFlush * 40);
  const flushG = skinBase.g - a.skinFlush * 10;

  const isLarge = dim > 100;

  return (
    <div
      className={`relative flex-shrink-0 select-none ${className}`}
      style={{
        width: dim,
        height: dim,
        transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1), height 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Ambient glow — breathing pulse when idle, speech-reactive when talking */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: isSpeaking ? -6 : -3,
          boxShadow: isSpeaking
            ? `0 0 ${14 + mo * 20}px ${4 + mo * 8}px hsl(var(--primary) / ${0.12 + mo * 0.25})`
            : `0 0 8px 2px hsl(var(--primary) / ${0.05 + Math.sin(a.breathPhase) * 0.03})`,
          transition: 'inset 0.3s ease, box-shadow 0.1s ease-out',
        }}
      />

      {/* Typing spinner */}
      {isTyping && !isSpeaking && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -2,
            border: '2px solid transparent',
            borderTopColor: 'hsl(var(--primary) / 0.4)',
            borderRightColor: 'hsl(var(--primary) / 0.15)',
            animation: 'avatar-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }}
        />
      )}

      {/* Face container */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          border: `${isLarge ? 3 : 2}px solid hsl(var(--primary) / ${isSpeaking ? 0.6 : 0.15})`,
          transition: 'border-color 0.4s ease',
          transform: `
            translate(${a.headShiftX}px, ${a.headShiftY}px)
            rotate(${a.headTiltX}deg)
            perspective(600px) rotateX(${a.headTiltY * 0.3}deg)
          `,
          transformOrigin: '50% 60%',
        }}
      >
        {/* Upper face (eyes, forehead, nose) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 ${100 - jawClipTop}% 0)` }}>
          <img
            src={src} alt="" className="w-full h-full object-cover" draggable={false}
            style={{ transform: `translateY(${a.browRaise * -2}px)` }}
          />

          {/* Eye blink overlays with natural eyelid curve */}
          {a.blinkProgress > 0.01 && (
            <>
              {['22%', undefined].map((left, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    [left ? 'left' : 'right']: left || '22%',
                    width: '20%',
                    top: `${29}%`,
                    height: `${11 * a.blinkProgress}%`,
                    background: `linear-gradient(180deg, 
                      rgba(${skinBase.r},${skinBase.g},${skinBase.b},0.95) 0%, 
                      rgba(${skinBase.r - 10},${skinBase.g - 10},${skinBase.b - 10},0.9) 70%,
                      rgba(${skinBase.r - 20},${skinBase.g - 15},${skinBase.b - 10},0.4) 100%)`,
                    borderRadius: '0 0 50% 50%',
                    boxShadow: a.blinkProgress > 0.5 ? `0 1px 2px rgba(0,0,0,0.1)` : 'none',
                  }}
                />
              ))}
            </>
          )}

          {/* Eye gaze shift — subtle iris movement overlay */}
          {isLarge && (
            <>
              {['25%', undefined].map((left, i) => (
                <div
                  key={`gaze-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    [left ? 'left' : 'right']: left || '25%',
                    width: '12%',
                    height: '6%',
                    top: '33%',
                    transform: `translate(${a.gazeX * 1.5}px, ${a.gazeY}px)`,
                    background: 'transparent',
                  }}
                />
              ))}
            </>
          )}

          {/* Brow shadow on raise */}
          {a.browRaise > 0.03 && isLarge && (
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: '23%', width: '55%', height: '2.5%',
                background: `rgba(0,0,0,${a.browRaise * 0.12})`,
                borderRadius: '50%', filter: 'blur(2.5px)',
              }}
            />
          )}
        </div>

        {/* Lower face / jaw — moves with speech */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(${jawClipTop}% 0 0 0)`,
            transform: `translateY(${a.jawY}px)`,
          }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
        </div>

        {/* ---- MOUTH ANATOMY LAYERS ---- */}

        {/* Mouth cavity — dark interior with depth gradient */}
        {mo > 0.02 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${a.jawY * 0.5}px) scaleX(${lipPurseScale})`,
              top: `${mouthCenterY - mouthH * 0.3}%`,
              width: `${mouthW}%`,
              height: `${mouthH}%`,
              background: `radial-gradient(ellipse at 50% 35%, 
                rgba(20, 8, 8, ${0.75 + mo * 0.2}) 0%, 
                rgba(40, 15, 15, ${0.55 + mo * 0.15}) 45%,
                rgba(60, 28, 28, ${0.3 + mo * 0.1}) 75%,
                transparent 100%)`,
              borderRadius: `${42 + mo * 8}% / ${50 + mo * 12}%`,
            }}
          />
        )}

        {/* Upper teeth — pearlescent with realistic shape */}
        {teethH > 0 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${a.jawY * 0.15}px) scaleX(${lipPurseScale})`,
              top: `${mouthCenterY - mouthH * 0.28}%`,
              width: `${mouthW - 5}%`,
              height: `${teethH}%`,
              background: `linear-gradient(180deg, 
                rgba(255, 253, 248, ${0.55 + mo * 0.35}) 0%, 
                rgba(248, 244, 238, ${0.45 + mo * 0.3}) 60%,
                rgba(240, 236, 230, ${0.3 + mo * 0.2}) 100%)`,
              borderRadius: '1px 1px 35% 35%',
              boxShadow: mo > 0.4 ? '0 1px 1px rgba(0,0,0,0.08)' : 'none',
            }}
          />
        )}

        {/* Lower teeth — visible at wider openings */}
        {mo > 0.45 && teethH > 0 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${a.jawY * 0.65}px) scaleX(${lipPurseScale})`,
              top: `${mouthCenterY + mouthH * 0.02}%`,
              width: `${mouthW - 9}%`,
              height: `${teethH * 0.55}%`,
              background: `linear-gradient(0deg, 
                rgba(250, 248, 242, ${0.3 + (mo - 0.45) * 0.5}) 0%, 
                rgba(242, 238, 232, ${0.2 + (mo - 0.45) * 0.3}) 100%)`,
              borderRadius: '35% 35% 1px 1px',
            }}
          />
        )}

        {/* Tongue — naturalistic pink, visible at wide open */}
        {tongueVisible && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) translateY(${a.jawY * 0.55}px)`,
              top: `${mouthCenterY + mouthH * 0.08}%`,
              width: `${mouthW - 12}%`,
              height: `${(mo - 0.5) * 10}%`,
              background: `radial-gradient(ellipse at 50% 30%, 
                rgba(195, 110, 110, ${0.35 + (mo - 0.5) * 0.5}) 0%,
                rgba(170, 85, 85, ${0.2 + (mo - 0.5) * 0.3}) 60%, 
                transparent 100%)`,
              borderRadius: '50%',
            }}
          />
        )}

        {/* Upper lip line with natural curve */}
        {mo > 0.06 && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%) scaleX(${lipPurseScale})`,
              top: `${mouthCenterY - mouthH * 0.38 - 0.8}%`,
              width: `${mouthW + 3}%`,
              height: '1.2%',
              background: face === 'female'
                ? `rgba(180, 120, 110, ${mo * 0.3})`
                : `rgba(155, 115, 100, ${mo * 0.25})`,
              borderRadius: '50%',
              filter: 'blur(0.8px)',
            }}
          />
        )}

        {/* Lower lip with highlight and volume */}
        {mo > 0.06 && (
          <>
            <div
              className="absolute left-1/2"
              style={{
                transform: `translateX(-50%) translateY(${a.jawY * 0.75}px) scaleX(${lipPurseScale})`,
                top: `${mouthCenterY + mouthH * 0.22}%`,
                width: `${mouthW + 1}%`,
                height: '2%',
                background: face === 'female'
                  ? `rgba(200, 145, 135, ${mo * 0.22})`
                  : `rgba(180, 140, 125, ${mo * 0.18})`,
                borderRadius: '50%',
                filter: 'blur(0.6px)',
              }}
            />
            {/* Specular highlight on lower lip */}
            {isLarge && mo > 0.15 && (
              <div
                className="absolute left-1/2"
                style={{
                  transform: `translateX(-50%) translateY(${a.jawY * 0.7}px)`,
                  top: `${mouthCenterY + mouthH * 0.18}%`,
                  width: `${mouthW * 0.4}%`,
                  height: '0.8%',
                  background: `rgba(255,255,255,${mo * 0.12})`,
                  borderRadius: '50%',
                  filter: 'blur(0.5px)',
                }}
              />
            )}
          </>
        )}

        {/* Lip purse effect — slight protrusion */}
        {a.lipPurse > 0.05 && isLarge && (
          <div
            className="absolute left-1/2"
            style={{
              transform: `translateX(-50%)`,
              top: `${mouthCenterY - 2}%`,
              width: `${16 + a.lipPurse * 4}%`,
              height: `${3 + a.lipPurse * 2}%`,
              background: face === 'female'
                ? `rgba(200, 155, 145, ${a.lipPurse * 0.15})`
                : `rgba(185, 148, 132, ${a.lipPurse * 0.12})`,
              borderRadius: '50%',
              filter: 'blur(2px)',
            }}
          />
        )}

        {/* Cheek tension shadows — nasolabial fold deepening */}
        {a.cheekTension > 0.02 && isLarge && (
          <>
            {[{ left: '9%' }, { right: '9%' }].map((pos, i) => (
              <div
                key={`cheek-${i}`}
                className="absolute"
                style={{
                  ...pos,
                  top: '60%',
                  width: '16%',
                  height: '14%',
                  background: `rgba(0,0,0,${a.cheekTension * 0.2})`,
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                }}
              />
            ))}
          </>
        )}

        {/* Nostril flare */}
        {a.nostrilFlare > 0.01 && isLarge && (
          <>
            {['39%', undefined].map((left, i) => (
              <div
                key={`nostril-${i}`}
                className="absolute"
                style={{
                  [left ? 'left' : 'right']: left || '39%',
                  top: '57%',
                  width: `${2.5 + a.nostrilFlare * 2}%`,
                  height: `${1.8 + a.nostrilFlare * 1}%`,
                  background: `rgba(0,0,0,${a.nostrilFlare * 0.18})`,
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </>
        )}

        {/* Chin tension line */}
        {a.chinTension > 0.02 && isLarge && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${90 + a.jawY * 0.2}%`,
              width: '25%',
              height: '1.5%',
              background: `rgba(0,0,0,${a.chinTension * 0.08})`,
              borderRadius: '50%',
              filter: 'blur(2px)',
            }}
          />
        )}

        {/* Skin flush overlay — warm tone during intense speech */}
        {a.skinFlush > 0.01 && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 55%,
                rgba(${flushR}, ${flushG}, ${skinBase.b - 15}, ${a.skinFlush * 0.4}) 0%,
                transparent 70%)`,
            }}
          />
        )}

        {/* Micro-smile — subtle mouth corner lift when idle */}
        {a.microSmile > 0.02 && !isSpeaking && isLarge && (
          <>
            {['22%', undefined].map((left, i) => (
              <div
                key={`smile-${i}`}
                className="absolute"
                style={{
                  [left ? 'left' : 'right']: left || '22%',
                  top: `${mouthCenterY - 1}%`,
                  width: '6%',
                  height: '2%',
                  background: `rgba(0,0,0,${a.microSmile * 0.06})`,
                  borderRadius: '50%',
                  filter: 'blur(1.5px)',
                  transform: `rotate(${left ? -8 : 8}deg)`,
                }}
              />
            ))}
          </>
        )}

        {/* Jaw seam blend */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${jawClipTop - 1}%`,
            height: '4%',
            background: `linear-gradient(180deg, transparent 0%, 
              rgba(${skinBase.r},${skinBase.g},${skinBase.b},0.12) 40%, 
              rgba(${skinBase.r},${skinBase.g},${skinBase.b},0.12) 60%, 
              transparent 100%)`,
            filter: 'blur(1.2px)',
          }}
        />
      </div>

      {/* Live Sync badge */}
      {showLiveBadge && isSpeaking && (
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
          style={{
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: '0 2px 8px hsl(var(--primary) / 0.4)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </div>
      )}

      {/* Status indicator */}
      {!isSpeaking && !isTyping && (
        <div
          className="absolute rounded-full bg-success border-2 border-background"
          style={{
            bottom: isLarge ? 4 : dim > 50 ? 2 : 0,
            right: isLarge ? 4 : dim > 50 ? 2 : 0,
            width: isLarge ? 14 : dim > 50 ? 10 : 8,
            height: isLarge ? 14 : dim > 50 ? 10 : 8,
            boxShadow: '0 0 6px hsl(var(--success) / 0.5)',
          }}
        />
      )}

      {/* Sound wave equalizer when speaking */}
      {isSpeaking && dim > 45 && (
        <div
          className="absolute flex items-end gap-[1.5px]"
          style={{
            bottom: isLarge ? 2 : 0,
            right: isLarge ? 0 : -3,
            height: isLarge ? 20 : dim > 60 ? 14 : 10,
          }}
        >
          {[0.35, 0.65, 1.0, 0.75, 0.4, 0.55].map((base, i) => (
            <div
              key={i}
              className="rounded-full bg-primary"
              style={{
                width: isLarge ? 3 : 2,
                height: `${Math.max(15, (base * 0.3 + mo * 0.7) * 100)}%`,
                opacity: 0.5 + mo * 0.5,
                transition: 'height 0.06s ease-out',
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
