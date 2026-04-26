import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const C = {
  deep: "#05070B",
  ink: "#0B111C",
  gold: "#D4AF37",
  paleGold: "#F3D98B",
  teal: "#18B8A7",
  pearl: "#F6F1E5",
  muted: "rgba(246,241,229,0.68)",
};

const shots = [
  {
    from: 0,
    duration: 170,
    image: "images/supernomad_city_lounge.jpg",
    kicker: "SUPERNOMAD",
    title: "One AI operating system for a life without borders.",
    body: "Travel, tax, safety, payments, local life and community — synchronized around you.",
    stat: "195+ countries",
  },
  {
    from: 150,
    duration: 180,
    image: "images/supernomad_command_phone.jpg",
    kicker: "SOVEREIGN COMMAND",
    title: "Every decision backed by context, proof and control.",
    body: "Visa alerts, threat intelligence, identity vault, AI wallet and concierge logic in one trusted layer.",
    stat: "Trust-first AI",
  },
  {
    from: 310,
    duration: 180,
    image: "images/supernomad_pulse_vibe.jpg",
    kicker: "PULSE + VIBE",
    title: "Meet the right people, in the right city, at the right moment.",
    body: "Verified meetups, smart social matching, AI catch-ups and voice-led community flows.",
    stat: "Live global network",
  },
  {
    from: 470,
    duration: 190,
    image: "images/supernomad_city_lounge.jpg",
    kicker: "AGENTIC LIFESTYLE",
    title: "Your concierge learns, monitors and acts — with guardrails.",
    body: "Back-office reports, alarms, token budgets, execution proofs and human approval for high-risk actions.",
    stat: "24/7 AI concierge",
  },
  {
    from: 650,
    duration: 250,
    image: "images/supernomad_command_phone.jpg",
    kicker: "THE GLOBAL SOVEREIGN OS",
    title: "SuperNomad",
    body: "Your sovereign life, anywhere.",
    stat: "Premium • secure • intelligent",
  },
];

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const BrandMark = () => (
  <div style={{ position: "absolute", top: 34, left: 42, zIndex: 20, display: "flex", alignItems: "center", gap: 14 }}>
    <Img src={staticFile("images/supernomad_logo.jpg")} style={{ width: 82, height: 46, objectFit: "cover", borderRadius: 6 }} />
    <div style={{ color: C.paleGold, fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>SUPERNOMAD</div>
  </div>
);

const VoiceWave = ({ start }: { start: number }) => {
  const frame = useCurrentFrame();
  const op = ease(frame, [start, start + 24], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 42, bottom: 38, zIndex: 20, opacity: op, display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ width: 4, height: 14 + Math.abs(Math.sin(frame * 0.14 + i * 0.7)) * 32, borderRadius: 3, background: i % 3 === 0 ? C.teal : C.gold }} />
      ))}
      <div style={{ color: C.muted, fontSize: 14, letterSpacing: 2, marginLeft: 12 }}>VOICE INTELLIGENCE ACTIVE</div>
    </div>
  );
};

const DataRibbon = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 900], [0, -520]);
  const items = ["Visa", "Tax days", "Threats", "Wallet", "Pulse", "Vibe", "Concierge", "Reports", "Approvals", "Trust Pass"];
  return (
    <div style={{ position: "absolute", right: -40, bottom: 80, zIndex: 12, transform: `translateX(${x}px) rotate(-2deg)`, display: "flex", gap: 12 }}>
      {[...items, ...items].map((item, i) => (
        <div key={i} style={{ padding: "12px 18px", border: `1px solid ${i % 2 ? "rgba(24,184,167,0.45)" : "rgba(212,175,55,0.45)"}`, color: C.pearl, background: "rgba(5,7,11,0.72)", borderRadius: 999, fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>
          {item}
        </div>
      ))}
    </div>
  );
};

const Shot = ({ shot, index }: { shot: typeof shots[number]; index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 10, fps, config: { damping: 26, stiffness: 90 } });
  const exit = ease(frame, [shot.duration - 40, shot.duration], [1, 0]);
  const imageScale = interpolate(frame, [0, shot.duration], [1.12, 1.02]);
  const imageX = interpolate(frame, [0, shot.duration], [index % 2 === 0 ? -34 : 34, index % 2 === 0 ? 20 : -20]);
  const contentX = interpolate(p, [0, 1], [index % 2 === 0 ? -80 : 80, 0]);
  const contentY = interpolate(p, [0, 1], [34, 0]);
  const contentOp = interpolate(p, [0, 1], [0, 1]) * exit;
  const isFinal = index === shots.length - 1;

  return (
    <AbsoluteFill style={{ opacity: exit, background: C.deep }}>
      <Img src={staticFile(shot.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imageScale}) translateX(${imageX}px)`, filter: "saturate(0.98) contrast(1.08)" }} />
      <div style={{ position: "absolute", inset: 0, background: index % 2 === 0 ? "linear-gradient(90deg, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.64) 42%, rgba(5,7,11,0.08) 100%)" : "linear-gradient(270deg, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.62) 44%, rgba(5,7,11,0.12) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(212,175,55,0.14), transparent 30%), radial-gradient(circle at 30% 80%, rgba(24,184,167,0.12), transparent 34%)" }} />
      <div style={{ position: "absolute", top: 142, left: index % 2 === 0 ? 96 : 1040, width: isFinal ? 760 : 720, opacity: contentOp, transform: `translate(${contentX}px, ${contentY}px)` }}>
        <div style={{ color: C.gold, fontSize: 20, fontWeight: 800, letterSpacing: 5, marginBottom: 24 }}>{shot.kicker}</div>
        <div style={{ color: C.pearl, fontSize: isFinal ? 104 : 66, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0, textShadow: "0 18px 55px rgba(0,0,0,0.55)" }}>{shot.title}</div>
        <div style={{ marginTop: 28, color: C.muted, fontSize: isFinal ? 32 : 26, lineHeight: 1.34, maxWidth: 710 }}>{shot.body}</div>
        <div style={{ marginTop: 38, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 20px", border: "1px solid rgba(212,175,55,0.42)", background: "rgba(5,7,11,0.58)", borderRadius: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 20, background: C.teal, boxShadow: `0 0 22px ${C.teal}` }} />
          <div style={{ color: C.paleGold, fontSize: 18, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{shot.stat}</div>
        </div>
      </div>
      {!isFinal && <DataRibbon />}
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = Math.max(0, Math.sin(frame * 0.18)) * ease(frame, [0, 28], [1, 0.1]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.deep}, ${C.ink})`, overflow: "hidden", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {shots.map((shot, i) => (
        <Sequence key={shot.kicker} from={shot.from} durationInFrames={shot.duration}>
          <Shot shot={shot} index={i} />
        </Sequence>
      ))}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)", backgroundSize: "96px 96px", opacity: 0.12 }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: flash * 0.04, background: C.paleGold }} />
      <BrandMark />
      <VoiceWave start={22} />
      <Audio src={staticFile("audio/supernomad_teaser_voice.mp3")} volume={0.95} />
    </AbsoluteFill>
  );
};