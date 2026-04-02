import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";

interface FeatureCardProps {
  title: string;
  icon: string;
  description: string;
  delay: number;
  index: number;
  accentColor?: string;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title, icon, description, delay, index, accentColor = "#D4AF37", badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        backdropFilter: undefined,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: 0.6,
      }} />
      {badge && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: accentColor, color: "#080E1A",
          padding: "3px 10px", borderRadius: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ color: "#F0F0F0", fontSize: 18, fontWeight: 600, letterSpacing: 0.3 }}>
        {title}
      </div>
      <div style={{ color: "rgba(240,240,240,0.5)", fontSize: 13, lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
};

interface StatCardProps {
  value: string;
  label: string;
  delay: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, delay, color = "#D4AF37" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
  const scale = interpolate(p, [0, 1], [0.5, 1]);
  const opacity = interpolate(p, [0, 1], [0, 1]);

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      textAlign: "center", padding: "20px 30px",
    }}>
      <div style={{ color, fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "rgba(240,240,240,0.6)", fontSize: 16, marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
};
