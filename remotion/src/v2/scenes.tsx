import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "./theme";
import { BackgroundLayer, BrandMark, ease, HairlineDivider, Headline, Kicker, Sub, TopMeta } from "./Frame";
import { ConciergePanel, DocsPanel, TaxPanel, ThreatPanel } from "./Panels";

const SceneShell: React.FC<{
  image?: string;
  meta: string;
  kicker: string;
  headline: string;
  sub: string;
  panel?: React.ReactNode;
  headlineSize?: number;
}> = ({ image, meta, kicker, headline, sub, panel, headlineSize = 70 }) => {
  return (
    <AbsoluteFill style={{ background: C.deep, overflow: "hidden" }}>
      <BackgroundLayer image={image} />
      <BrandMark />
      <TopMeta label={meta} />
      <div style={{ position: "absolute", left: 80, top: "50%", transform: "translateY(-50%)", maxWidth: 720 }}>
        <Kicker text={kicker} delay={4} />
        <Headline text={headline} delay={10} size={headlineSize} />
        <Sub text={sub} delay={20} />
        <HairlineDivider delay={26} />
      </div>
      {panel}
    </AbsoluteFill>
  );
};

// Hero opener
export const HeroSceneV2: React.FC = () => {
  const frame = useCurrentFrame();
  const op = ease(frame, [0, 18], [0, 1]);
  const y = interpolate(op, [0, 1], [30, 0]);
  return (
    <AbsoluteFill style={{ background: C.deep }}>
      <BackgroundLayer image="images/supernomad_city_lounge.jpg" />
      <BrandMark />
      <TopMeta label="THE GLOBAL SOVEREIGN OS" />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 120px", textAlign: "center", opacity: op, transform: `translateY(${y}px)` }}>
        <Kicker text="SUPERNOMAD" delay={6} />
        <div style={{ marginTop: 28, color: C.pearl, fontFamily: FONT.display, fontSize: 124, lineHeight: 1.0, fontWeight: 700, letterSpacing: -2, textShadow: "0 22px 80px rgba(0,0,0,0.7)" }}>
          One AI that runs your<br />life across borders.
        </div>
        <div style={{ marginTop: 36, color: C.muted, fontFamily: FONT.ui, fontSize: 26, maxWidth: 900, lineHeight: 1.4 }}>
          Tax days. Threats. Documents. Bookings. Every signal that matters — handled silently, in one trusted layer.
        </div>
        <div style={{ marginTop: 48, display: "inline-flex", gap: 14, alignItems: "center", padding: "14px 22px", border: `1px solid ${C.gold}66`, borderRadius: 999, background: "rgba(5,7,11,0.55)" }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: C.teal, boxShadow: `0 0 14px ${C.teal}` }} />
          <div style={{ color: C.goldLight, fontSize: 14, fontWeight: 700, letterSpacing: 4, fontFamily: FONT.ui }}>195+ COUNTRIES · 6.2M GLOBAL CITIZENS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TaxSceneV2: React.FC = () => (
  <SceneShell
    image="images/supernomad_global_operations.jpg"
    meta="TAX DAY CALCULATOR"
    kicker="Day 184 = the most expensive day"
    headline="Never trip a tax residency by accident."
    sub="Live day-counter across 195+ countries. Schengen 90/180. Treaty thresholds. We warn you weeks before you cross the line."
    panel={<TaxPanel delay={14} />}
  />
);

export const ThreatSceneV2: React.FC = () => (
  <SceneShell
    image="images/supernomad_trust_guardian.jpg"
    meta="THREAT INTELLIGENCE"
    kicker="500+ live feeds · 200+ cities"
    headline="Know what's around you before it finds you."
    sub="Protests, scams, weather, kidnap zones, transit chaos. Filtered to where you actually are — not generic country alerts."
    panel={<ThreatPanel delay={14} />}
  />
);

export const DocsSceneV2: React.FC = () => (
  <SceneShell
    image="images/supernomad_backoffice_ai.jpg"
    meta="SNOMAD ID VAULT"
    kicker="Documents · Identity · Trust Pass"
    headline="Every document, ready before you're asked."
    sub="Passports, visas, ETIAS, medical records, verifiable credentials. AES-256-GCM. Zero-knowledge. Only you hold the key."
    panel={<DocsPanel delay={14} />}
  />
);

export const ConciergeSceneV2: React.FC = () => (
  <SceneShell
    image="images/supernomad_concierge_suite.jpg"
    meta="CONCIERGE AI · 24/7"
    kicker="Sofia + Marcus · Voice-first"
    headline="One assistant for everything else."
    sub="Books flights, hotels and dinners. Files receipts. Watches your tax days. Answers in your language. Acts only with your rules."
    panel={<ConciergePanel delay={12} />}
  />
);

export const ClosingSceneV2: React.FC = () => {
  const frame = useCurrentFrame();
  const op = ease(frame, [0, 22], [0, 1]);
  const scale = interpolate(ease(frame, [0, 60], [0, 1]), [0, 1], [0.94, 1]);
  return (
    <AbsoluteFill style={{ background: C.deep }}>
      <BackgroundLayer image="images/supernomad_command_phone.jpg" tint="linear-gradient(180deg, rgba(5,7,11,0.78), rgba(5,7,11,0.92))" />
      <BrandMark />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", opacity: op, transform: `scale(${scale})` }}>
        <div style={{ color: C.gold, fontSize: 16, fontWeight: 800, letterSpacing: 8, fontFamily: FONT.ui }}>SUPERNOMAD</div>
        <div style={{ marginTop: 32, color: C.pearl, fontFamily: FONT.display, fontSize: 144, lineHeight: 1.0, fontWeight: 700, letterSpacing: -2, textShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
          Your sovereign life,<br />anywhere.
        </div>
        <div style={{ marginTop: 44, display: "flex", gap: 32, color: C.muted, fontSize: 18, fontFamily: FONT.ui, letterSpacing: 4 }}>
          <span>TAX</span><span style={{ color: C.gold }}>·</span>
          <span>SAFETY</span><span style={{ color: C.gold }}>·</span>
          <span>DOCUMENTS</span><span style={{ color: C.gold }}>·</span>
          <span>CONCIERGE</span>
        </div>
        <div style={{ marginTop: 56, padding: "14px 28px", border: `1px solid ${C.gold}66`, borderRadius: 999, background: "rgba(5,7,11,0.6)", color: C.goldLight, fontSize: 15, letterSpacing: 4, fontFamily: FONT.ui, fontWeight: 700 }}>
          supernomad1.lovable.app
        </div>
      </div>
    </AbsoluteFill>
  );
};
