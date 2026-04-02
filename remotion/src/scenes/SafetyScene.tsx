import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";
import { FeatureCard } from "../components/FeatureCard";

export const SafetyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Radar sweep
  const radarAngle = interpolate(frame, [0, 120], [0, 360]);

  // SOS pulse
  const pulse1 = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.8]);
  const pulse2 = interpolate(Math.sin(frame * 0.06 + 1.5), [-1, 1], [40, 80]);

  const features = [
    { icon: "🛡️", title: "Threat Intelligence", desc: "Real-time security monitoring in 195+ countries" },
    { icon: "🤖", title: "SuperNomad Guardian", desc: "AI personal safety companion", badge: "NEW" },
    { icon: "🚨", title: "SOS Services", desc: "24/7 emergency response worldwide", badge: "24/7" },
    { icon: "🏛️", title: "Embassy Directory", desc: "Find embassies & consulates instantly", badge: "OFFICIAL" },
    { icon: "🔐", title: "Cyber Helpline", desc: "Cybersecurity assistance & protection", badge: "NEW" },
    { icon: "👤", title: "Private Protection", desc: "Personal security & bodyguard services", badge: "ELITE" },
  ];

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <div style={{ display: "flex", gap: 60 }}>
        {/* Left: Radar + title */}
        <div style={{ width: 400 }}>
          <SceneTitle title="SAFETY & EMERGENCY" subtitle="Protected, Everywhere" delay={5} />

          {/* Radar */}
          <div style={{
            position: "relative", width: 250, height: 250,
            marginTop: 40, marginLeft: 40,
          }}>
            {/* Rings */}
            {[80, 100, 120].map((r, i) => (
              <div key={i} style={{
                position: "absolute",
                left: 125 - r, top: 125 - r,
                width: r * 2, height: r * 2,
                borderRadius: "50%",
                border: "1px solid rgba(0,212,255,0.1)",
              }} />
            ))}
            {/* Sweep */}
            <div style={{
              position: "absolute", left: 125, top: 125,
              width: 120, height: 2,
              background: "linear-gradient(90deg, #00D4FF, transparent)",
              transformOrigin: "0 50%",
              transform: `rotate(${radarAngle}deg)`,
            }} />
            {/* Center */}
            <div style={{
              position: "absolute", left: 119, top: 119,
              width: 12, height: 12, borderRadius: "50%",
              background: "#00D4FF",
              boxShadow: "0 0 20px rgba(0,212,255,0.5)",
            }} />
            {/* SOS pulse */}
            <div style={{
              position: "absolute", left: 125 - pulse2 / 2, top: 125 - pulse2 / 2,
              width: pulse2, height: pulse2, borderRadius: "50%",
              border: `2px solid rgba(239,68,68,${pulse1})`,
            }} />
          </div>
        </div>

        {/* Right: features */}
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14, alignContent: "start",
        }}>
          {features.map((f, i) => (
            <FeatureCard
              key={i} index={i}
              icon={f.icon} title={f.title}
              description={f.desc}
              delay={25 + i * 12}
              badge={f.badge}
              accentColor={i < 2 ? "#00D4FF" : "#ef4444"}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
