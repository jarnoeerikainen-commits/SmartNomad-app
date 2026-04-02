import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneTitle } from "../components/SceneTitle";

const ChatBubble: React.FC<{
  text: string; isUser: boolean; delay: number; typing?: boolean;
}> = ({ text, isUser, delay, typing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
  const op = interpolate(p, [0, 1], [0, 1]);
  const scale = interpolate(p, [0, 1], [0.8, 1]);
  const x = interpolate(p, [0, 1], [isUser ? 30 : -30, 0]);

  // Typing dots animation
  const dot1 = typing ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 1]) : 1;
  const dot2 = typing ? interpolate(Math.sin(frame * 0.15 + 2), [-1, 1], [0.3, 1]) : 1;
  const dot3 = typing ? interpolate(Math.sin(frame * 0.15 + 4), [-1, 1], [0.3, 1]) : 1;

  return (
    <div style={{
      opacity: op, transform: `translateX(${x}px) scale(${scale})`,
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12,
    }}>
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%", marginRight: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #D4AF37, #F5E6A3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "#080E1A",
        }}>S</div>
      )}
      <div style={{
        maxWidth: 420, padding: "14px 18px", borderRadius: 16,
        background: isUser
          ? "linear-gradient(135deg, #1E3A5F, #2A4A6F)"
          : "rgba(255,255,255,0.06)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
        color: "#F0F0F0", fontSize: 15, lineHeight: 1.5,
      }}>
        {typing ? (
          <div style={{ display: "flex", gap: 4, padding: "4px 8px" }}>
            {[dot1, dot2, dot3].map((o, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#D4AF37", opacity: o,
              }} />
            ))}
          </div>
        ) : text}
      </div>
    </div>
  );
};

export const ConciergeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voice waveform
  const bars = Array.from({ length: 24 }, (_, i) => {
    const h = interpolate(
      Math.sin(frame * 0.08 + i * 0.5),
      [-1, 1], [8, 40]
    );
    return h;
  });

  const waveOp = interpolate(
    spring({ frame: frame - 280, fps, config: { damping: 20 } }),
    [0, 1], [0, 1]
  );

  return (
    <AbsoluteFill style={{ padding: "80px 100px", display: "flex" }}>
      {/* Left side: title + info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <SceneTitle title="AI CONCIERGE" subtitle="Your Personal Travel Intelligence" delay={5} />
        
        <div style={{ marginTop: 40 }}>
          {[
            { icon: "🧠", text: "Remembers your preferences", delay: 100 },
            { icon: "🗣️", text: "Natural voice conversation", delay: 115 },
            { icon: "🌍", text: "195+ countries knowledge", delay: 130 },
            { icon: "⚡", text: "Proactive travel alerts", delay: 145 },
          ].map((item, i) => {
            const p = spring({ frame: frame - item.delay, fps, config: { damping: 18 } });
            return (
              <div key={i} style={{
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)`,
                display: "flex", alignItems: "center", gap: 14,
                marginBottom: 16, color: "#F0F0F0", fontSize: 18,
              }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                {item.text}
              </div>
            );
          })}
        </div>

        {/* Voice waveform */}
        <div style={{
          opacity: waveOp, marginTop: 40,
          display: "flex", alignItems: "center", gap: 3, height: 50,
        }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: 4, height: h, borderRadius: 2,
              background: `linear-gradient(180deg, #D4AF37, rgba(212,175,55,0.3))`,
            }} />
          ))}
          <div style={{ marginLeft: 16, color: "#D4AF37", fontSize: 14 }}>
            Voice Mode Active
          </div>
        </div>
      </div>

      {/* Right side: chat mockup */}
      <div style={{
        width: 500, display: "flex", flexDirection: "column",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: 24, marginTop: 20,
      }}>
        <div style={{
          color: "#D4AF37", fontSize: 12, letterSpacing: 2,
          textTransform: "uppercase", marginBottom: 20,
          textAlign: "center",
        }}>
          SuperNomad Concierge
        </div>

        <ChatBubble
          text="I'm flying to Lisbon next week. What should I know?"
          isUser={true} delay={30}
        />
        <ChatBubble text="" isUser={false} delay={55} typing={frame < 80} />
        {frame >= 80 && (
          <ChatBubble
            text="Great choice! Lisbon is sunny next week, 28°C. 🌞"
            isUser={false} delay={80}
          />
        )}
        {frame >= 110 && (
          <ChatBubble
            text="Heads up — you've used 62 of 90 Schengen days. This trip will put you at 69. Plenty of room!"
            isUser={false} delay={110}
          />
        )}
        {frame >= 150 && (
          <ChatBubble
            text="Want me to check flight prices and lounge access at your departure airport?"
            isUser={false} delay={150}
          />
        )}
        {frame >= 200 && (
          <ChatBubble
            text="Yes, and find me a coworking space near Alfama"
            isUser={true} delay={200}
          />
        )}
        {frame >= 240 && (
          <ChatBubble
            text="On it! Found 3 top-rated spaces near Alfama. Nearest is Factory Lisbon — 8 min walk, great reviews. ☕"
            isUser={false} delay={240}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
