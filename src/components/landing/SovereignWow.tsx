import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, X, ArrowRight } from 'lucide-react';

/* ---------------- Live ticker ---------------- */
export const LiveTicker: React.FC = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = time.toUTCString().slice(17, 22);
  const items = [
    `${hh} UTC · live`,
    '6,258,490 nomads online',
    'Lisbon 22°C · clear',
    'Dubai 31°C · haze',
    'Singapore 29°C · rain',
    'EUR/USD 1.08',
    'GBP/USD 1.27',
    'BTC $104,210',
    '195+ jurisdictions tracked',
    'ETIAS · live',
    'Schengen 90/180 · monitored',
    '500+ safety incidents · last 24h',
    'AES-256-GCM · zero-knowledge',
  ];
  const loop = [...items, ...items];
  return (
    <div className="sn-ticker-mask w-full overflow-hidden border-y border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_5%/0.7)] backdrop-blur-sm">
      <div className="sn-ticker-track py-2 text-[11px] uppercase tracking-[0.18em] text-[hsl(30_12%_82%)] sm:text-xs">
        {loop.map((it, i) => (
          <span key={i} className="mx-6 flex items-center gap-2 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))] shadow-[0_0_8px_hsl(43_96%_56%/0.8)]" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Typewriter headline ---------------- */
export const Typewriter: React.FC<{ text: string; speed?: number; className?: string }> = ({ text, speed = 55, className }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [n, text, speed]);
  return (
    <span className={className}>
      {text.slice(0, n)}
      <span className="sn-caret" aria-hidden />
    </span>
  );
};

/* ---------------- Magnetic wrapper ---------------- */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({ children, strength = 18, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`transition-transform duration-200 ease-out ${className ?? ''}`}>
      {children}
    </div>
  );
};

/* ---------------- Scroll-scrubbed counter ---------------- */
export const ScrollCounter: React.FC<{ to: number; duration?: number; suffix?: string; className?: string }> = ({ to, duration = 1400, suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} className={className}>{val.toLocaleString()}{suffix}</span>;
};

/* ---------------- Breathing concierge orb (landing only) ---------------- */
export const ConciergeOrb: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [whisper, setWhisper] = useState<string>('');
  useEffect(() => {
    const lines = [
      'Good to see you. Want a 30-second tour?',
      'Tap me — I can walk you through SuperNomad.',
      'Curious about the 184-day rule?',
    ];
    setWhisper(lines[Math.floor(Math.random() * lines.length)]);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-7 sm:right-7" aria-live="polite">
      {open && (
        <div className="mb-3 max-w-[260px] rounded-2xl border border-[hsl(43_96%_56%/0.35)] bg-[hsl(220_22%_8%/0.95)] p-4 text-sm text-[hsl(30_12%_92%)] shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.85)] backdrop-blur-md sm:max-w-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-base text-[hsl(var(--gold))]">Concierge</span>
            <button onClick={() => setOpen(false)} aria-label="Close concierge whisper" className="rounded-full p-1 text-[hsl(30_12%_70%)] hover:bg-[hsl(43_96%_56%/0.12)] hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="leading-snug">{whisper}</p>
          <Link to="/app?tour=1" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--gold))] hover:text-[hsl(var(--gold-light))]">
            Begin tour <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open SuperNomad concierge"
        className="sn-breathe relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(38_92%_50%)] via-[hsl(48_96%_70%)] to-[hsl(38_92%_38%)] text-[hsl(220_22%_8%)] sm:h-16 sm:w-16"
      >
        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[hsl(152_69%_45%)] ring-2 ring-[hsl(220_22%_8%)]" />
      </button>
    </div>
  );
};

/* ---------------- Section hairline frame ---------------- */
export const HairlineFrame: React.FC<{ label: string; index: string; children: React.ReactNode }> = ({ label, index, children }) => (
  <div className="sn-hairline relative">
    <div className="absolute -top-3 left-2 z-10 flex items-center gap-2 bg-[hsl(220_22%_8%)] px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--gold))] sm:left-6 sm:text-[11px]">
      <span className="opacity-70">§ {index}</span>
      <span>·</span>
      <span>{label}</span>
    </div>
    {children}
  </div>
);
