import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const C = {
  deep: "#05070B",
  ink: "#08111F",
  gold: "#D4AF37",
  paleGold: "#F3D98B",
  teal: "#18B8A7",
  pearl: "#F6F1E5",
  muted: "rgba(246,241,229,0.72)",
  dim: "rgba(246,241,229,0.48)",
};

const shots = [
  {
    from: 0,
    duration: 270,
    image: "images/supernomad_global_operations.jpg",
    kicker: "SUPERNOMAD",
    title: "The operating system for life without borders.",
    body: "Travel, tax, visas, identity, safety, payments, local life and community — synchronized around one trusted AI layer.",
    stat: "Global Sovereign OS",
    modules: ["Travel", "Tax", "Visa", "Safety", "Wallet", "Community"],
  },
  {
    from: 235,
    duration: 315,
    image: "images/supernomad_concierge_suite.jpg",
    kicker: "CONCIERGE AI",
    title: "One assistant that understands the whole journey.",
    body: "It replans flights, finds lounges, books restaurants, locates coworking, prepares documents and asks approval when risk is high.",
    stat: "Voice-first action layer",
    modules: ["Flight change", "Lounge", "Reservation", "Documents", "Coworking", "Approvals"],
  },
  {
    from: 520,
    duration: 300,
    image: "images/supernomad_city_lounge.jpg",
    kicker: "COMPLIANCE INTELLIGENCE",
    title: "Tax days, Schengen windows and visa rules tracked quietly.",
    body: "SuperNomad monitors thresholds, ETIAS, immigration documents, embassies, insurance and official links before deadlines become problems.",
    stat: "195+ country logic",
    modules: ["Tax days", "90/180", "ETIAS", "Embassies", "Insurance", "Official links"],
  },
  {
    from: 790,
    duration: 300,
    image: "images/supernomad_community_life.jpg",
    kicker: "PULSE + VIBE",
    title: "Every city becomes useful, safe and human.",
    body: "Verified meetups, Vibe chat, sport partners, family support, local services and premium directories turn arrival into belonging.",
    stat: "Live community layer",
    modules: ["Meetups", "Vibe chat", "Sports", "Family", "Clubs", "Local life"],
  },
  {
    from: 1060,
    duration: 300,
    image: "images/supernomad_trust_guardian.jpg",
    kicker: "SOVEREIGN TRUST",
    title: "Identity, safety and proof stay under control.",
    body: "Snomad ID, Trust Pass, Guardian and Black Box protect documents, permissions, evidence, alerts and selective disclosure.",
    stat: "Zero-knowledge mindset",
    modules: ["Snomad ID", "Trust Pass", "Guardian", "Vault", "Evidence", "Consent"],
  },
  {
    from: 1330,
    duration: 300,
    image: "images/supernomad_command_phone.jpg",
    kicker: "AGENTIC COMMERCE",
    title: "From advice to execution — with guardrails.",
    body: "The AI wallet can book, pay, submit and reserve only inside user-defined limits, budgets and reversible approval flows.",
    stat: "Rules before action",
    modules: ["Wallet", "x402", "Budgets", "Receipts", "Approvals", "Proofs"],
  },
  {
    from: 1600,
    duration: 315,
    image: "images/supernomad_backoffice_ai.jpg",
    kicker: "AI OPERATIONS",
    title: "Every agent is monitored from the back office.",
    body: "Routes, token budgets, alarms, quality scores, execution proofs, graphs and daily reports keep the system optimized and accountable.",
    stat: "Route • prove • monitor",
    modules: ["Alarms", "Graphs", "Reports", "Token budgets", "Quality", "Approvals"],
  },
  {
    from: 1885,
    duration: 330,
    image: "images/supernomad_pulse_vibe.jpg",
    kicker: "FOR PEOPLE AND COMPANIES",
    title: "Built for nomads, expats, families, executives and teams.",
    body: "Personal context, corporate duty of care, verified data, local partners and AI advisors become one premium operating layer.",
    stat: "Personal + business ready",
    modules: ["Nomads", "Families", "Executives", "Companies", "Advisors", "Partners"],
  },
  {
    from: 2185,
    duration: 895,
    image: "images/supernomad_global_operations.jpg",
    kicker: "THE GLOBAL SOVEREIGN OS",
    title: "SuperNomad",
    body: "Your sovereign life command system. Anywhere.",
    stat: "Premium • secure • intelligent",
    modules: ["Concierge", "Compliance", "Community", "Trust", "Commerce", "Back office"],
    final: true,
  },
];

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const BrandMark = () => (
  <div style={{ position: "absolute", top: 34, left: 42, zIndex: 40, display: "flex", alignItems: "center", gap: 14 }}>
    <Img src={staticFile("images/supernomad_logo_latest.jpg")} style={{ width: 84, height: 48, objectFit: "cover", borderRadius: 7, boxShadow: "0 14px 42px rgba(0,0,0,0.4)" }} />
    <div style={{ color: C.paleGold, fontSize: 18, fontWeight: 900, letterSpacing: 3 }}>SUPERNOMAD</div>
  </div>
);

const VoiceWave = () => {
  const frame = useCurrentFrame();
  const op = ease(frame, [10, 45], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 42, bottom: 38, zIndex: 40, opacity: op, display: "flex", alignItems: "center", gap: 7 }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} style={{ width: 4, height: 10 + Math.abs(Math.sin(frame * 0.12 + i * 0.58)) * (i % 4 === 0 ? 42 : 28), borderRadius: 5, background: i % 3 === 0 ? C.teal : C.gold, boxShadow: `0 0 18px ${i % 3 === 0 ? C.teal : C.gold}` }} />
      ))}
      <div style={{ color: C.muted, fontSize: 14, letterSpacing: 2, marginLeft: 12 }}>CONCIERGE VOICE INTELLIGENCE</div>
    </div>
  );
};

const ModuleRibbon = ({ items }: { items: string[] }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 320], [0, -360]);
  const all = [...items, ...items, ...items];
  return (
    <div style={{ position: "absolute", right: -80, bottom: 92, zIndex: 18, transform: `translateX(${x}px) rotate(-2deg)`, display: "flex", gap: 12 }}>
      {all.map((item, i) => (
        <div key={`${item}-${i}`} style={{ padding: "12px 18px", border: `1px solid ${i % 2 ? "rgba(24,184,167,0.46)" : "rgba(212,175,55,0.48)"}`, color: C.pearl, background: "rgba(5,7,11,0.74)", borderRadius: 999, fontSize: 15, fontWeight: 800, letterSpacing: 1 }}>
          {item}
        </div>
      ))}
    </div>
  );
};

const TrustStack = ({ final = false }: { final?: boolean }) => {
  const frame = useCurrentFrame();
  const labels = final ? ["Global", "Sovereign", "Trusted", "Actionable"] : ["Route", "Prove", "Monitor", "Escalate"];
  return (
    <div style={{ position: "absolute", right: 92, top: 118, zIndex: 25, display: "grid", gridTemplateColumns: "repeat(2, 154px)", gap: 12 }}>
      {labels.map((label, i) => {
        const p = spring({ frame: frame - 22 - i * 8, fps: 30, config: { damping: 18, stiffness: 120 } });
        return (
          <div key={label} style={{ opacity: interpolate(p, [0, 1], [0, final ? 0.82 : 1]), transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`, padding: "16px 18px", borderRadius: 14, border: "1px solid rgba(212,175,55,0.28)", background: "rgba(5,7,11,0.62)", color: i % 2 ? C.teal : C.paleGold, fontWeight: 900, fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase" }}>
            {label}
          </div>
        );
      })}
    </div>
  );
};

const Shot = ({ shot, index }: { shot: typeof shots[number]; index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 12, fps, config: { damping: 28, stiffness: 88 } });
  const exit = ease(frame, [shot.duration - 48, shot.duration], [1, 0]);
  const imageScale = interpolate(frame, [0, shot.duration], [1.16, 1.02]);
  const imageX = interpolate(frame, [0, shot.duration], [index % 2 === 0 ? -44 : 44, index % 2 === 0 ? 28 : -28]);
  const contentX = interpolate(p, [0, 1], [index % 2 === 0 ? -92 : 92, 0]);
  const contentY = interpolate(p, [0, 1], [38, 0]);
  const contentOp = interpolate(p, [0, 1], [0, 1]) * exit;
  const left = index % 2 === 0 || shot.final;

  return (
    <AbsoluteFill style={{ opacity: exit, background: C.deep, overflow: "hidden" }}>
      <Img src={staticFile(shot.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imageScale}) translateX(${imageX}px)`, filter: "saturate(0.96) contrast(1.08)" }} />
      <div style={{ position: "absolute", inset: 0, background: left ? "linear-gradient(90deg, rgba(5,7,11,0.94) 0%, rgba(5,7,11,0.66) 45%, rgba(5,7,11,0.12) 100%)" : "linear-gradient(270deg, rgba(5,7,11,0.94) 0%, rgba(5,7,11,0.64) 44%, rgba(5,7,11,0.12) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(212,175,55,0.14), transparent 28%, rgba(5,7,11,0.42)), radial-gradient(circle at 76% 24%, rgba(24,184,167,0.13), transparent 30%)" }} />
      <div style={{ position: "absolute", top: shot.final ? 230 : 150, left: left ? 96 : 1010, width: shot.final ? 840 : 760, opacity: contentOp, transform: `translate(${contentX}px, ${contentY}px)` }}>
        <div style={{ color: C.gold, fontSize: 20, fontWeight: 900, letterSpacing: 5.5, marginBottom: 24 }}>{shot.kicker}</div>
        <div style={{ color: C.pearl, fontSize: shot.final ? 122 : 66, lineHeight: 1.02, fontWeight: 950, letterSpacing: 0, textShadow: "0 20px 60px rgba(0,0,0,0.58)" }}>{shot.title}</div>
        <div style={{ marginTop: 28, color: C.muted, fontSize: shot.final ? 34 : 25, lineHeight: 1.34, maxWidth: 760 }}>{shot.body}</div>
        <div style={{ marginTop: 38, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 20px", border: "1px solid rgba(212,175,55,0.44)", background: "rgba(5,7,11,0.62)", borderRadius: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 20, background: C.teal, boxShadow: `0 0 24px ${C.teal}` }} />
          <div style={{ color: C.paleGold, fontSize: 18, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{shot.stat}</div>
        </div>
      </div>
      <TrustStack final={shot.final} />
      <ModuleRibbon items={shot.modules} />
    </AbsoluteFill>
  );
};

export const EcosystemFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = Math.max(0, Math.sin(frame * 0.14)) * ease(frame, [0, 38], [1, 0.08]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.deep}, ${C.ink})`, overflow: "hidden", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {shots.map((shot, i) => (
        <Sequence key={`${shot.kicker}-${i}`} from={shot.from} durationInFrames={shot.duration}>
          <Shot shot={shot} index={i} />
        </Sequence>
      ))}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)", backgroundSize: "96px 96px", opacity: 0.11 }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: flash * 0.05, background: C.paleGold }} />
      <BrandMark />
      <VoiceWave />
      <Audio src={staticFile("audio/supernomad_ecosystem_voice.mp3")} volume={0.95} />
    </AbsoluteFill>
  );
};
