import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const TravelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated route line
  const lineP = spring({ frame: frame - 30, fps, config: { damping: 40, stiffness: 60 } });
  const lineLen = interpolate(lineP, [0, 1], [0, 900]);

  const cities = [
    { name: "London", x: 100, y: 40 },
    { name: "Dubai", x: 350, y: 80 },
    { name: "Bangkok", x: 600, y: 60 },
    { name: "Tokyo", x: 850, y: 35 },
  ];

  const features = [
    { icon: "🚌", title: "Transportation", desc: "Public transit, routes & schedules" },
    { icon: "🚕", title: "Taxi & Rideshare", desc: "Uber, Bolt, Grab & local apps" },
    { icon: "✈️", title: "Air Charter", desc: "Private jet booking with AI", badge: "AI" },
    { icon: "📱", title: "eSIM & VPN", desc: "Instant mobile data worldwide" },
    { icon: "🛡️", title: "Travel Insurance", desc: "Compare & buy in seconds" },
    { icon: "📶", title: "WiFi Finder", desc: "Nearby hotspots with speed ratings" },
    { icon: "🚗", title: "Car Rental", desc: "Rent or lease in any country" },
    { icon: "🔧", title: "Roadside Assist", desc: "24/7 emergency roadside help" },
  ];

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <SceneTitle title="TRAVEL ESSENTIALS" subtitle="Move Freely, Anywhere" delay={5} />

      {/* Route visualization */}
      <div style={{ position: "relative", height: 120, marginTop: 20, marginBottom: 10 }}>
        <svg width={950} height={120} style={{ position: "absolute" }}>
          <line x1={100} y1={60} x2={100 + lineLen} y2={60}
            stroke="url(#routeGrad)" strokeWidth={2} strokeDasharray="8,4" />
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
        {cities.map((city, i) => {
          const cp = spring({ frame: frame - 40 - i * 15, fps, config: { damping: 12 } });
          const s = interpolate(cp, [0, 1], [0, 1]);
          return (
            <div key={i} style={{
              position: "absolute", left: city.x - 6, top: city.y,
              opacity: s, transform: `scale(${s})`,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: "#D4AF37", border: "3px solid #080E1A",
                boxShadow: "0 0 20px rgba(212,175,55,0.4)",
              }} />
              <div style={{ color: "#F0F0F0", fontSize: 12, marginTop: 6, fontWeight: 600 }}>{city.name}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
        {features.map((f, i) => (
          <FeatureCard
            key={i} index={i}
            icon={f.icon} title={f.title}
            description={f.desc}
            delay={60 + i * 10}
            badge={f.badge}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
