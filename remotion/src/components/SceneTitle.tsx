import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";

interface SceneTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  delay?: number;
}

export const SceneTitle: React.FC<SceneTitleProps> = ({
  title, subtitle, align = "left", delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
  const lineWidth = interpolate(p, [0, 1], [0, 100]);
  const textOp = interpolate(p, [0, 1], [0, 1]);
  const textY = interpolate(p, [0, 1], [30, 0]);

  const subP = spring({ frame: frame - delay - 8, fps, config: { damping: 25 } });
  const subOp = interpolate(subP, [0, 1], [0, 1]);

  return (
    <div style={{ textAlign: align }}>
      <div style={{
        width: `${lineWidth}px`, height: 3,
        background: "linear-gradient(90deg, #D4AF37, #00D4FF)",
        marginBottom: 16,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
      }} />
      <div style={{
        opacity: textOp, transform: `translateY(${textY}px)`,
        color: "#D4AF37", fontSize: 14, fontWeight: 600,
        letterSpacing: 4, textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          opacity: subOp, color: "#F0F0F0",
          fontSize: 42, fontWeight: 700, lineHeight: 1.15, maxWidth: 700,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
