import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const FinanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Currency ticker
  const rates = [
    { pair: "EUR/USD", rate: "1.0847", change: "+0.12%" },
    { pair: "GBP/EUR", rate: "1.1692", change: "-0.05%" },
    { pair: "BTC/USD", rate: "67,432", change: "+2.34%" },
    { pair: "ETH/USD", rate: "3,521", change: "+1.87%" },
  ];

  const features = [
    { icon: "💳", title: "Payment & AI Wallet", desc: "Smart payment routing & agentic commerce", badge: "AI", color: "#D4AF37" },
    { icon: "🏦", title: "Digital Banks", desc: "Wise, Revolut, N26 & 20+ more", color: "#00D4FF" },
    { icon: "💸", title: "Money Transfers", desc: "Best rates worldwide", color: "#D4AF37" },
    { icon: "₿", title: "Crypto & Digital", desc: "On/off ramp, DeFi & exchanges", color: "#00D4FF" },
    { icon: "🏆", title: "Award Cards", desc: "Points, miles & cashback optimization", badge: "NEW", color: "#D4AF37" },
    { icon: "🆘", title: "Emergency Cards", desc: "Instant replacement & freeze", badge: "SOS", color: "#ef4444" },
  ];

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <SceneTitle title="FINANCE & PAYMENTS" subtitle="Your Money, Borderless" delay={5} />

      {/* Currency ticker */}
      <div style={{
        display: "flex", gap: 24, marginTop: 30, marginBottom: 20,
      }}>
        {rates.map((r, i) => {
          const p = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 20 } });
          const positive = r.change.startsWith("+");
          return (
            <div key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [15, 0])}px)`,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "12px 20px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div>
                <div style={{ color: "rgba(240,240,240,0.5)", fontSize: 11, letterSpacing: 1 }}>{r.pair}</div>
                <div style={{ color: "#F0F0F0", fontSize: 20, fontWeight: 700 }}>{r.rate}</div>
              </div>
              <div style={{ color: positive ? "#22c55e" : "#ef4444", fontSize: 13, fontWeight: 600 }}>
                {r.change}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {features.map((f, i) => (
          <FeatureCard
            key={i} index={i}
            icon={f.icon} title={f.title}
            description={f.desc}
            delay={50 + i * 12}
            badge={f.badge}
            accentColor={f.color}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
