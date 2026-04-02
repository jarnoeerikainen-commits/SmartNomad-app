import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const LocalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🏙️", title: "City Services", desc: "Curated services for 100+ cities" },
    { icon: "🧘", title: "Wellness & Fitness", desc: "Gyms, yoga, spas & wellness centers", badge: "NEW" },
    { icon: "📰", title: "Local News", desc: "Real-time news from your location" },
    { icon: "🛒", title: "Marketplace", desc: "Buy & sell with fellow nomads", badge: "AI" },
    { icon: "💬", title: "Social Vibe", desc: "Match & connect with like-minded travelers", badge: "AI" },
    { icon: "🎪", title: "Local Events", desc: "Discover events, festivals & activities", badge: "LIVE" },
    { icon: "📦", title: "Delivery Services", desc: "Local delivery & logistics" },
    { icon: "🚚", title: "Moving Services", desc: "International relocation made easy", badge: "AI" },
    { icon: "👶", title: "Family Services", desc: "Trusted nanny & childcare", badge: "TRUSTED" },
    { icon: "🐾", title: "Pet Services", desc: "Pet care & vet services abroad" },
    { icon: "📖", title: "Language Learning", desc: "Learn any language with local tutors" },
    { icon: "🎓", title: "Student Services", desc: "Student resources & communities" },
  ];

  // Animated connection lines between features
  const connectionOp = interpolate(
    spring({ frame: frame - 120, fps, config: { damping: 25 } }),
    [0, 1], [0, 0.15]
  );

  return (
    <AbsoluteFill style={{ padding: "60px 90px" }}>
      <SceneTitle title="LOCAL LIVING" subtitle="Feel Home, Everywhere" delay={5} />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 14, marginTop: 30,
      }}>
        {features.map((f, i) => (
          <FeatureCard
            key={i} index={i}
            icon={f.icon} title={f.title}
            description={f.desc}
            delay={20 + i * 8}
            badge={f.badge}
            accentColor={i % 2 === 0 ? "#D4AF37" : "#00D4FF"}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
