import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { StatCard } from "../components/FeatureCard";

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stats counter
  const featuresP = spring({ frame: frame - 20, fps, config: { damping: 30 } });
  const featuresNum = Math.round(interpolate(featuresP, [0, 1], [0, 65]));

  const countriesP = spring({ frame: frame - 30, fps, config: { damping: 30 } });
  const countriesNum = Math.round(interpolate(countriesP, [0, 1], [0, 195]));

  // Logo reveal
  const logoP = spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 60 } });
  const logoScale = interpolate(logoP, [0, 1], [0.3, 1]);
  const logoOp = interpolate(logoP, [0, 1], [0, 1]);

  // Tagline
  const tagP = spring({ frame: frame - 120, fps, config: { damping: 18 } });
  const tagOp = interpolate(tagP, [0, 1], [0, 1]);
  const tagY = interpolate(tagP, [0, 1], [20, 0]);

  // URL
  const urlP = spring({ frame: frame - 160, fps, config: { damping: 22 } });
  const urlOp = interpolate(urlP, [0, 1], [0, 0.7]);

  // Decorative rings
  const ring1 = interpolate(frame, [0, 500], [0, 90]);
  const ring2 = interpolate(frame, [0, 500], [0, -60]);

  // Fade in glow
  const glowSize = interpolate(Math.sin(frame * 0.03), [-1, 1], [350, 500]);

  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Central glow */}
      <div style={{
        position: "absolute",
        width: glowSize, height: glowSize,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.1), transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* Rings */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        border: "1px solid rgba(212,175,55,0.08)",
        borderRadius: "50%", transform: `rotate(${ring1}deg)`,
      }} />
      <div style={{
        position: "absolute", width: 750, height: 750,
        border: "1px solid rgba(0,212,255,0.05)",
        borderRadius: "50%", transform: `rotate(${ring2}deg)`,
      }} />

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 60, marginBottom: 60,
        position: "relative", zIndex: 1,
      }}>
        <StatCard value={`${featuresNum}+`} label="Features" delay={20} />
        <StatCard value={`${countriesNum}+`} label="Countries" delay={30} color="#00D4FF" />
        <StatCard value="24/7" label="AI Concierge" delay={40} />
      </div>

      {/* Diamond logo */}
      <div style={{
        opacity: logoOp, transform: `scale(${logoScale})`,
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: 70, height: 70,
          background: "linear-gradient(135deg, #D4AF37, #F5E6A3, #D4AF37)",
          transform: "rotate(45deg)", borderRadius: 8,
          boxShadow: "0 0 80px rgba(212,175,55,0.4)",
        }} />
      </div>

      {/* Title */}
      <div style={{
        opacity: logoOp, fontSize: 64, fontWeight: 800,
        color: "#F0F0F0", letterSpacing: 12,
        marginTop: 30, position: "relative", zIndex: 1,
      }}>
        SUPERNOMAD
      </div>

      {/* Tagline */}
      <div style={{
        opacity: tagOp, transform: `translateY(${tagY}px)`,
        fontSize: 24, color: "#D4AF37",
        fontWeight: 300, letterSpacing: 6,
        textTransform: "uppercase", marginTop: 16,
        position: "relative", zIndex: 1,
      }}>
        Your Sovereign Life, Anywhere
      </div>

      {/* URL */}
      <div style={{
        opacity: urlOp, fontSize: 16,
        color: "#F0F0F0", marginTop: 30,
        letterSpacing: 3, position: "relative", zIndex: 1,
      }}>
        supernomad1.lovable.app
      </div>
    </AbsoluteFill>
  );
};
