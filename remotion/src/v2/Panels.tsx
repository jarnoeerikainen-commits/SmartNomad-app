import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";
import { ease } from "./Frame";

// ─────────────────────────────────────────────────────────
// Tax Day Calculator panel — 195+ countries, 184-day trap
// ─────────────────────────────────────────────────────────
export const TaxPanel: React.FC<{ delay?: number }> = ({ delay = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 110 } });
  const op = enter;
  const y = interpolate(enter, [0, 1], [40, 0]);

  const countries = [
    { flag: "PT", name: "Portugal", days: 132, cap: 183, status: "safe" },
    { flag: "ES", name: "Spain", days: 168, cap: 183, status: "warn" },
    { flag: "SG", name: "Singapore", days: 41, cap: 183, status: "safe" },
    { flag: "AE", name: "UAE", days: 22, cap: 183, status: "safe" },
    { flag: "EE", name: "Estonia", days: 184, cap: 183, status: "trap" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity: op,
        width: 580,
        background: `linear-gradient(180deg, rgba(15,22,34,0.96) 0%, rgba(11,17,28,0.98) 100%)`,
        border: `1px solid ${C.hairline}`,
        borderRadius: 18,
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(243,217,139,0.12)`,
        fontFamily: FONT.ui,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 26px", borderBottom: `1px solid ${C.hairline}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: C.gold }} />
          <div style={{ color: C.goldLight, fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>TAX RESIDENCY · LIVE</div>
        </div>
        <div style={{ color: C.muted, fontSize: 12, letterSpacing: 2 }}>2026 · 195 COUNTRIES</div>
      </div>

      <div style={{ padding: 26 }}>
        {countries.map((c, i) => {
          const rowEnter = ease(frame, [delay + 12 + i * 5, delay + 28 + i * 5], [0, 1]);
          const pct = (c.days / c.cap) * 100;
          const barW = interpolate(rowEnter, [0, 1], [0, Math.min(pct, 100)]);
          const color = c.status === "trap" ? C.red : c.status === "warn" ? C.amber : C.teal;
          return (
            <div key={c.name} style={{ marginBottom: 14, opacity: rowEnter }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 24, borderRadius: 4, background: "rgba(212,175,55,0.16)", border: `1px solid ${C.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", color: C.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1, fontFamily: FONT.mono }}>{c.flag}</div>
                  <div style={{ color: C.pearl, fontSize: 17, fontWeight: 600 }}>{c.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: FONT.mono }}>
                  <div style={{ color, fontSize: 22, fontWeight: 700 }}>{c.days}</div>
                  <div style={{ color: C.muted, fontSize: 14 }}>/ {c.cap} days</div>
                </div>
              </div>
              <div style={{ height: 6, background: "rgba(246,241,229,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${barW}%`, background: `linear-gradient(90deg, ${color}aa, ${color})`, borderRadius: 3, boxShadow: `0 0 18px ${color}66` }} />
              </div>
              {c.status === "trap" && (
                <div style={{ marginTop: 6, color: C.red, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>⚠ DAY 184 — RESIDENCY TRIGGERED</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 26px", borderTop: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(229,72,77,0.08)" }}>
        <div style={{ color: C.pearl, fontSize: 14 }}>Avg penalty avoided</div>
        <div style={{ color: C.goldLight, fontFamily: FONT.mono, fontSize: 22, fontWeight: 700 }}>$12,400 / yr</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Threat Intelligence panel
// ─────────────────────────────────────────────────────────
export const ThreatPanel: React.FC<{ delay?: number }> = ({ delay = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 110 } });
  const op = enter;
  const y = interpolate(enter, [0, 1], [40, 0]);
  const pulse = 0.5 + Math.sin(frame * 0.18) * 0.5;

  const incidents = [
    { city: "Bangkok", level: 2, label: "Protest · Sukhumvit Rd", time: "14m ago", color: C.amber },
    { city: "Mexico City", level: 3, label: "Express kidnap risk · Polanco", time: "32m ago", color: C.red },
    { city: "Lisbon", level: 1, label: "Pickpocket cluster · Alfama", time: "1h ago", color: C.teal },
    { city: "Dubai", level: 1, label: "Sandstorm · DXB delays", time: "2h ago", color: C.teal },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity: op,
        width: 600,
        background: `linear-gradient(180deg, rgba(15,22,34,0.96) 0%, rgba(11,17,28,0.98) 100%)`,
        border: `1px solid ${C.hairline}`,
        borderRadius: 18,
        boxShadow: `0 40px 100px rgba(0,0,0,0.7)`,
        fontFamily: FONT.ui,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 26px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: C.red, opacity: pulse, boxShadow: `0 0 12px ${C.red}` }} />
          <div style={{ color: C.goldLight, fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>THREAT INTELLIGENCE · LIVE</div>
        </div>
        <div style={{ color: C.muted, fontSize: 12, letterSpacing: 2 }}>500+ ACTIVE FEEDS</div>
      </div>

      <div style={{ padding: 22 }}>
        {incidents.map((it, i) => {
          const rowEnter = ease(frame, [delay + 14 + i * 6, delay + 32 + i * 6], [0, 1]);
          const x = interpolate(rowEnter, [0, 1], [40, 0]);
          return (
            <div
              key={it.city}
              style={{
                opacity: rowEnter,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 14px",
                marginBottom: 10,
                borderLeft: `3px solid ${it.color}`,
                background: "rgba(246,241,229,0.03)",
                borderRadius: 6,
              }}
            >
              <div style={{ width: 38, textAlign: "center" }}>
                <div style={{ color: it.color, fontFamily: FONT.mono, fontSize: 22, fontWeight: 700 }}>L{it.level}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.pearl, fontSize: 17, fontWeight: 600 }}>{it.city}</div>
                <div style={{ color: C.muted, fontSize: 13 }}>{it.label}</div>
              </div>
              <div style={{ color: C.muted, fontSize: 12, fontFamily: FONT.mono }}>{it.time}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "14px 26px", borderTop: `1px solid ${C.hairline}`, background: "rgba(24,184,167,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: C.pearl, fontSize: 14 }}>You · Lisbon</div>
        <div style={{ color: C.teal, fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>SAFE · L1 ZONE</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Documents / Identity Vault panel
// ─────────────────────────────────────────────────────────
export const DocsPanel: React.FC<{ delay?: number }> = ({ delay = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 110 } });
  const op = enter;
  const y = interpolate(enter, [0, 1], [40, 0]);

  const docs = [
    { icon: "🛂", label: "Passport · US", meta: "Exp 14 Aug 2031", status: "Verified" },
    { icon: "🪪", label: "ID · Estonia e-Resident", meta: "Exp 02 Mar 2029", status: "Verified" },
    { icon: "✈️", label: "ETIAS · EU 2026", meta: "Granted · 23 Jan 2026", status: "Active" },
    { icon: "🩺", label: "Medical record", meta: "Allergies · Vaccines", status: "Sealed" },
    { icon: "💼", label: "Trust Pass · KYC", meta: "Walt.id verifiable credential", status: "Issued" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity: op,
        width: 600,
        background: `linear-gradient(180deg, rgba(15,22,34,0.97) 0%, rgba(11,17,28,0.99) 100%)`,
        border: `1px solid ${C.hairline}`,
        borderRadius: 18,
        boxShadow: `0 40px 100px rgba(0,0,0,0.7)`,
        fontFamily: FONT.ui,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 26px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: C.teal, boxShadow: `0 0 12px ${C.teal}` }} />
          <div style={{ color: C.goldLight, fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>SNOMAD ID VAULT · ENCRYPTED</div>
        </div>
        <div style={{ color: C.muted, fontSize: 12, letterSpacing: 2, fontFamily: FONT.mono }}>AES-256-GCM</div>
      </div>

      <div style={{ padding: 22 }}>
        {docs.map((d, i) => {
          const rowEnter = ease(frame, [delay + 12 + i * 5, delay + 28 + i * 5], [0, 1]);
          const x = interpolate(rowEnter, [0, 1], [-30, 0]);
          return (
            <div
              key={d.label}
              style={{
                opacity: rowEnter,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 14px",
                marginBottom: 8,
                background: "rgba(246,241,229,0.03)",
                borderRadius: 8,
                border: `1px solid rgba(246,241,229,0.06)`,
              }}
            >
              <div style={{ width: 44, height: 44, background: "rgba(212,175,55,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{d.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.pearl, fontSize: 16, fontWeight: 600 }}>{d.label}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{d.meta}</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(24,184,167,0.14)", border: `1px solid ${C.teal}55` }}>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: C.teal }} />
                <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{d.status}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "14px 26px", borderTop: `1px solid ${C.hairline}`, background: "rgba(212,175,55,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: C.pearl, fontSize: 14 }}>Zero-knowledge · Only you hold the key</div>
        <div style={{ color: C.goldLight, fontSize: 14, fontWeight: 700 }}>🔐</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Concierge AI chat panel
// ─────────────────────────────────────────────────────────
export const ConciergePanel: React.FC<{ delay?: number }> = ({ delay = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 110 } });
  const op = enter;
  const y = interpolate(enter, [0, 1], [40, 0]);
  const wave = frame * 0.18;

  const messages = [
    { from: "user", text: "Sofia, I land in Bangkok at 9pm. Sort everything.", at: 14 },
    { from: "ai", text: "On it. Booking the 9:35pm Karhoo limo. Hotel room ready, late check-in cleared.", at: 38 },
    { from: "ai", text: "ETIAS not needed for Thailand · 30-day visa-free. You'll hit day 27 of your 90-day Schengen cap on return.", at: 70 },
    { from: "user", text: "Dinner reco? Quiet, near hotel.", at: 110 },
    { from: "ai", text: "Bo.lan — 8min walk, verified. Reserved 10:30pm under your name. Threat L1, all clear.", at: 138 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(calc(-50% + ${y}px))`,
        opacity: op,
        width: 620,
        height: 620,
        background: `linear-gradient(180deg, rgba(15,22,34,0.97) 0%, rgba(11,17,28,0.99) 100%)`,
        border: `1px solid ${C.hairline}`,
        borderRadius: 18,
        boxShadow: `0 40px 100px rgba(0,0,0,0.7)`,
        fontFamily: FONT.ui,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "18px 26px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 36, background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.deep, fontFamily: FONT.display }}>S</div>
          <div>
            <div style={{ color: C.pearl, fontSize: 16, fontWeight: 700 }}>Sofia · Concierge</div>
            <div style={{ color: C.teal, fontSize: 11, letterSpacing: 2 }}>● ONLINE · VOICE READY</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ width: 3, height: 6 + Math.abs(Math.sin(wave + i * 0.5)) * 18, background: i % 3 === 0 ? C.teal : C.gold, borderRadius: 2 }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
        {messages.map((m, i) => {
          const e = ease(frame, [delay + m.at, delay + m.at + 14], [0, 1]);
          const ty = interpolate(e, [0, 1], [16, 0]);
          const isUser = m.from === "user";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", opacity: e, transform: `translateY(${ty}px)` }}>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "12px 16px",
                  borderRadius: 14,
                  borderTopRightRadius: isUser ? 4 : 14,
                  borderTopLeftRadius: isUser ? 14 : 4,
                  background: isUser ? "rgba(212,175,55,0.18)" : "rgba(24,184,167,0.10)",
                  border: isUser ? `1px solid ${C.gold}55` : `1px solid ${C.teal}40`,
                  color: C.pearl,
                  fontSize: 15,
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "14px 26px", borderTop: `1px solid ${C.hairline}`, background: "rgba(212,175,55,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: C.muted, fontSize: 12, letterSpacing: 1 }}>Books · plans · protects · pays — with your rules</div>
        <div style={{ color: C.goldLight, fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>24 / 7</div>
      </div>
    </div>
  );
};
