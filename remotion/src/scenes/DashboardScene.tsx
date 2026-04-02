import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { SceneTitle } from "../components/SceneTitle";

const MockWidget: React.FC<{
  x: number; y: number; w: number; h: number;
  delay: number; label: string; children?: React.ReactNode;
}> = ({ x, y, w, h, delay, label, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const scale = interpolate(p, [0, 1], [0.85, 1]);
  const op = interpolate(p, [0, 1], [0, 1]);

  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      opacity: op, transform: `scale(${scale})`,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: 20, overflow: "hidden",
    }}>
      <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
        {label}
      </div>
      {children}
    </div>
  );
};

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Weather temp counter
  const tempP = spring({ frame: frame - 50, fps, config: { damping: 30 } });
  const temp = Math.round(interpolate(tempP, [0, 1], [0, 28]));

  // XP bar
  const xpWidth = interpolate(
    spring({ frame: frame - 70, fps, config: { damping: 25 } }),
    [0, 1], [0, 75]
  );

  // Countries counter
  const countriesP = spring({ frame: frame - 60, fps, config: { damping: 30 } });
  const countries = Math.round(interpolate(countriesP, [0, 1], [0, 47]));

  // Days counter
  const daysP = spring({ frame: frame - 65, fps, config: { damping: 30 } });
  const days = Math.round(interpolate(daysP, [0, 1], [0, 142]));

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      <SceneTitle title="COMMAND CENTER" subtitle="Everything at a Glance" delay={5} />

      <div style={{ position: "relative", marginTop: 40, flex: 1 }}>
        {/* Weather Widget */}
        <MockWidget x={0} y={0} w={380} h={200} delay={20} label="Weather • Lisbon">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 54, fontWeight: 700, color: "#F0F0F0" }}>{temp}°</div>
            <div>
              <div style={{ color: "#D4AF37", fontSize: 16 }}>☀️ Sunny</div>
              <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 13, marginTop: 4 }}>Feels like 30°</div>
            </div>
          </div>
        </MockWidget>

        {/* Threat Alert */}
        <MockWidget x={400} y={0} w={380} h={200} delay={30} label="Threat Level">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 700, color: "white",
            }}>LOW</div>
            <div>
              <div style={{ color: "#22c55e", fontSize: 18, fontWeight: 600 }}>All Clear</div>
              <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 12, marginTop: 4 }}>No active threats in your area</div>
            </div>
          </div>
        </MockWidget>

        {/* Quick Stats */}
        <MockWidget x={800} y={0} w={380} h={200} delay={40} label="Your Journey">
          <div style={{ display: "flex", gap: 30, marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#D4AF37" }}>{countries}</div>
              <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 12, marginTop: 2 }}>Countries</div>
            </div>
            <div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#00D4FF" }}>{days}</div>
              <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 12, marginTop: 2 }}>Days Tracked</div>
            </div>
          </div>
        </MockWidget>

        {/* Gamification */}
        <MockWidget x={0} y={220} w={580} h={180} delay={55} label="Achievements & XP">
          <div style={{ color: "#F0F0F0", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
            Level 12 — Global Explorer 🌍
          </div>
          <div style={{
            width: "100%", height: 12, borderRadius: 6,
            background: "rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: `${xpWidth}%`, height: "100%", borderRadius: 6,
              background: "linear-gradient(90deg, #D4AF37, #F5E6A3)",
            }} />
          </div>
          <div style={{ color: "rgba(240,240,240,0.4)", fontSize: 12, marginTop: 6 }}>
            7,450 / 10,000 XP to Level 13
          </div>
        </MockWidget>

        {/* Recent Activity */}
        <MockWidget x={600} y={220} w={580} h={180} delay={65} label="Recent Activity">
          {[
            { text: "Arrived in Lisbon, Portugal", time: "2h ago", color: "#D4AF37" },
            { text: "Schengen: 62/90 days used", time: "Today", color: "#00D4FF" },
            { text: "Visa expires in 28 days", time: "Alert", color: "#ef4444" },
          ].map((item, i) => {
            const itemP = spring({ frame: frame - 75 - i * 10, fps, config: { damping: 20 } });
            return (
              <div key={i} style={{
                opacity: interpolate(itemP, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(itemP, [0, 1], [20, 0])}px)`,
                display: "flex", justifyContent: "space-between",
                padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{ color: "#F0F0F0", fontSize: 14 }}>{item.text}</div>
                <div style={{ color: item.color, fontSize: 12 }}>{item.time}</div>
              </div>
            );
          })}
        </MockWidget>
      </div>
    </AbsoluteFill>
  );
};
