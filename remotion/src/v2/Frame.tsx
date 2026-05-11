import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";

export const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const BrandMark: React.FC = () => (
  <div style={{ position: "absolute", top: 36, left: 48, zIndex: 30, display: "flex", alignItems: "center", gap: 14 }}>
    <Img src={staticFile("images/supernomad_logo.jpg")} style={{ width: 64, height: 36, objectFit: "cover", borderRadius: 4 }} />
    <div style={{ color: C.goldLight, fontSize: 16, fontWeight: 700, letterSpacing: 5, fontFamily: FONT.ui }}>SUPERNOMAD</div>
  </div>
);

export const TopMeta: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const op = ease(frame, [0, 18], [0, 1]);
  return (
    <div style={{ position: "absolute", top: 48, right: 56, zIndex: 30, opacity: op, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.ui }}>
      <div style={{ width: 8, height: 8, borderRadius: 8, background: C.teal, boxShadow: `0 0 16px ${C.teal}` }} />
      <div style={{ color: C.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

export const BackgroundLayer: React.FC<{ image?: string; tint?: string }> = ({ image, tint }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.14]);
  const drift = interpolate(frame, [0, durationInFrames], [-8, 8]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.deep} 0%, ${C.ink} 100%)`, overflow: "hidden" }}>
      {image && (
        <Img
          src={staticFile(image)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${drift}px)`,
            filter: "saturate(0.95) contrast(1.06)",
            opacity: 0.55,
          }}
        />
      )}
      <AbsoluteFill style={{ background: tint ?? "linear-gradient(180deg, rgba(5,7,11,0.45) 0%, rgba(5,7,11,0.85) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 78% 22%, rgba(212,175,55,0.18), transparent 38%), radial-gradient(circle at 22% 80%, rgba(24,184,167,0.12), transparent 40%)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.07) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const op = ease(frame, [delay, delay + 14], [0, 1]);
  const x = interpolate(op, [0, 1], [-20, 0]);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, opacity: op, transform: `translateX(${x}px)`, fontFamily: FONT.ui }}>
      <div style={{ width: 32, height: 1.5, background: C.gold }} />
      <div style={{ color: C.gold, fontSize: 14, fontWeight: 800, letterSpacing: 5, textTransform: "uppercase" }}>{text}</div>
    </div>
  );
};

export const Headline: React.FC<{ text: string; delay?: number; size?: number }> = ({ text, delay = 6, size = 78 }) => {
  const frame = useCurrentFrame();
  const op = ease(frame, [delay, delay + 22], [0, 1]);
  const y = interpolate(op, [0, 1], [22, 0]);
  return (
    <div
      style={{
        marginTop: 22,
        color: C.pearl,
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 1.04,
        fontWeight: 700,
        letterSpacing: -0.5,
        opacity: op,
        transform: `translateY(${y}px)`,
        textShadow: "0 22px 60px rgba(0,0,0,0.55)",
        maxWidth: 920,
      }}
    >
      {text}
    </div>
  );
};

export const Sub: React.FC<{ text: string; delay?: number }> = ({ text, delay = 14 }) => {
  const frame = useCurrentFrame();
  const op = ease(frame, [delay, delay + 20], [0, 1]);
  const y = interpolate(op, [0, 1], [16, 0]);
  return (
    <div
      style={{
        marginTop: 26,
        color: C.muted,
        fontFamily: FONT.ui,
        fontSize: 24,
        lineHeight: 1.4,
        maxWidth: 720,
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const HairlineDivider: React.FC<{ delay?: number; width?: number }> = ({ delay = 4, width = 180 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(ease(frame, [delay, delay + 30], [0, 1]), [0, 1], [0, width]);
  return <div style={{ marginTop: 32, height: 1, width: w, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />;
};
