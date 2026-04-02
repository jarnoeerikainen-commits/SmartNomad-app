import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo reveal
  const logoP = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 80 } });
  const logoScale = interpolate(logoP, [0, 1], [0.3, 1]);
  const logoOp = interpolate(logoP, [0, 1], [0, 1]);

  // Title letters stagger
  const title = "SUPERNOMAD";
  const letterSpacing = interpolate(
    spring({ frame: frame - 40, fps, config: { damping: 25, stiffness: 60 } }),
    [0, 1], [40, 16]
  );
  const titleOp = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline
  const tagP = spring({ frame: frame - 80, fps, config: { damping: 20 } });
  const tagOp = interpolate(tagP, [0, 1], [0, 1]);
  const tagY = interpolate(tagP, [0, 1], [30, 0]);

  // Subtitle line
  const subP = spring({ frame: frame - 110, fps, config: { damping: 22 } });
  const subOp = interpolate(subP, [0, 1], [0, 0.6]);

  // Decorative rings
  const ring1 = interpolate(frame, [0, 300], [0, 180]);
  const ring2 = interpolate(frame, [0, 300], [0, -120]);

  // Pulse glow
  const glowSize = interpolate(Math.sin(frame * 0.04), [-1, 1], [300, 450]);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Central glow */}
      <div style={{
        position: "absolute",
        width: glowSize, height: glowSize,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)",
        filter: "blur(30px)",
      }} />

      {/* Decorative rings */}
      <div style={{
        position: "absolute", width: 500, height: 500,
        border: "1px solid rgba(212,175,55,0.1)",
        borderRadius: "50%",
        transform: `rotate(${ring1}deg)`,
      }} />
      <div style={{
        position: "absolute", width: 650, height: 650,
        border: "1px solid rgba(0,212,255,0.06)",
        borderRadius: "50%",
        transform: `rotate(${ring2}deg)`,
      }} />

      {/* Diamond logo */}
      <div style={{
        opacity: logoOp, transform: `scale(${logoScale})`,
        width: 80, height: 80,
        background: "linear-gradient(135deg, #D4AF37, #F5E6A3, #D4AF37)",
        transform: `scale(${logoScale}) rotate(45deg)`,
        marginBottom: 40, borderRadius: 8,
        boxShadow: "0 0 60px rgba(212,175,55,0.3)",
      }} />

      {/* Title */}
      <div style={{
        opacity: titleOp,
        fontSize: 82, fontWeight: 800,
        color: "#F0F0F0",
        letterSpacing: `${letterSpacing}px`,
        textAlign: "center",
        marginTop: -20,
      }}>
        {title}
      </div>

      {/* Tagline */}
      <div style={{
        opacity: tagOp, transform: `translateY(${tagY}px)`,
        fontSize: 28, color: "#D4AF37",
        fontWeight: 300, letterSpacing: 6,
        textTransform: "uppercase", marginTop: 16,
      }}>
        Your Sovereign Life, Anywhere
      </div>

      {/* Sub-subtitle */}
      <div style={{
        opacity: subOp, fontSize: 16,
        color: "#F0F0F0", marginTop: 24,
        letterSpacing: 2,
      }}>
        65+ Features • 195+ Countries • AI-Powered
      </div>
    </AbsoluteFill>
  );
};
