import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const TaxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Schengen gauge
  const gaugeP = spring({ frame: frame - 60, fps, config: { damping: 25, stiffness: 80 } });
  const gaugeAngle = interpolate(gaugeP, [0, 1], [0, 248]); // 62/90 * 360
  const daysUsed = Math.round(interpolate(gaugeP, [0, 1], [0, 62]));

  const features = [
    { icon: "🗺️", title: "Country Tracker", desc: "Track days in every country with auto-detection", badge: "CORE" },
    { icon: "🛂", title: "Visa Manager", desc: "Visa expiry alerts & application tracking" },
    { icon: "📊", title: "Schengen Calculator", desc: "90/180-day rolling window compliance" },
    { icon: "🔒", title: "Document Vault", desc: "Encrypted passport & document storage" },
    { icon: "🏛️", title: "Government Apps", desc: "Official e-residency & tax portals" },
    { icon: "💰", title: "Tax & Wealth Help", desc: "Optimization strategies & advisor matching", badge: "VIP" },
  ];

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <SceneTitle title="TAX & COMPLIANCE" subtitle="Stay Legal, Stay Free" delay={5} />

      <div style={{ display: "flex", gap: 50, marginTop: 40 }}>
        {/* Left: Schengen Gauge */}
        <div style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={220} height={220} viewBox="0 0 220 220">
            <circle cx={110} cy={110} r={90} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
            <circle
              cx={110} cy={110} r={90} fill="none"
              stroke="url(#gaugeGrad)" strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={`${gaugeAngle * 1.57} 999`}
              transform="rotate(-90 110 110)"
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
            <text x={110} y={100} textAnchor="middle" fill="#F0F0F0" fontSize={44} fontWeight={800}>
              {daysUsed}
            </text>
            <text x={110} y={125} textAnchor="middle" fill="rgba(240,240,240,0.4)" fontSize={14}>
              of 90 days
            </text>
          </svg>
          <div style={{ color: "#D4AF37", fontSize: 14, marginTop: 12, letterSpacing: 2, textTransform: "uppercase" }}>
            Schengen Tracker
          </div>
        </div>

        {/* Right: Feature cards grid */}
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}>
          {features.map((f, i) => (
            <FeatureCard
              key={i} index={i}
              icon={f.icon} title={f.title}
              description={f.desc}
              delay={30 + i * 12}
              badge={f.badge}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
