import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const PremiumScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crown animation
  const crownP = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 80 } });
  const crownScale = interpolate(crownP, [0, 1], [0, 1]);
  const crownGlow = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.3, 0.7]);

  const features = [
    { icon: "🩺", title: "AI Doctor", desc: "Medical advice from AI trained on global health data", badge: "AI" },
    { icon: "⚖️", title: "AI Lawyer", desc: "Legal guidance for international matters", badge: "AI" },
    { icon: "✈️", title: "AI Travel Planner", desc: "Itinerary planning with local insights", badge: "AI" },
    { icon: "💼", title: "Tax Advisors", desc: "Expert consultation for international tax", badge: "VIP" },
    { icon: "🏥", title: "Medical Services", desc: "Find doctors & clinics worldwide" },
    { icon: "🏢", title: "Business Centers", desc: "Premium coworking & office spaces", badge: "NEW" },
    { icon: "✨", title: "Airport Lounges", desc: "VIP lounge access at 1,300+ airports", badge: "VIP" },
    { icon: "👑", title: "Elite Clubs", desc: "Private members' clubs worldwide", badge: "ELITE" },
  ];

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
        <div style={{
          fontSize: 48, transform: `scale(${crownScale})`,
          filter: `drop-shadow(0 0 ${20 * crownGlow}px rgba(212,175,55,0.5))`,
        }}>👑</div>
        <SceneTitle title="PREMIUM SERVICES" subtitle="The Sovereign Experience" delay={5} />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 14, marginTop: 20,
      }}>
        {features.map((f, i) => (
          <FeatureCard
            key={i} index={i}
            icon={f.icon} title={f.title}
            description={f.desc}
            delay={20 + i * 10}
            badge={f.badge}
            accentColor="#D4AF37"
          />
        ))}
      </div>

      {/* Bottom luxury bar */}
      <div style={{
        position: "absolute", bottom: 60, left: 100, right: 100,
        display: "flex", justifyContent: "center", gap: 60,
      }}>
        {["Concierge Level", "White Glove", "24/7 Priority"].map((label, i) => {
          const p = spring({ frame: frame - 120 - i * 15, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 0.6]),
              color: "#D4AF37", fontSize: 13, letterSpacing: 3,
              textTransform: "uppercase", fontWeight: 300,
            }}>
              ✦ {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
