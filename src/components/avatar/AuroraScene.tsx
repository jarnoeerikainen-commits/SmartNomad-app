import React from 'react';
import blazerAsset from '@/assets/aurora-blazer.mp4.asset.json';
import coatAsset from '@/assets/aurora-coat.mp4.asset.json';
import { MapPin, Lock, Calendar, Sparkles, Check, ShieldCheck } from 'lucide-react';
import type { AuroraBeat } from './auroraScript';

interface Props {
  activeBeats: Set<AuroraBeat>;
  outfit: 'blazer' | 'coat';
  userName: string;
}

const card = "rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-3 py-2.5 shadow-2xl";

const AuroraScene: React.FC<Props> = ({ activeBeats, outfit, userName }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Helsinki backdrop gradient (always under both videos) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, hsl(35 40% 18%) 0%, hsl(220 35% 8%) 55%, hsl(220 40% 4%) 100%)',
        }}
      />
      {/* City light particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-200/70"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${50 + ((i * 17) % 45)}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Avatar video — cross-fade between blazer and coat */}
      <div className="absolute inset-0">
        <video
          src={blazerAsset.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: outfit === 'blazer' ? 1 : 0 }}
        />
        <video
          src={coatAsset.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: outfit === 'coat' ? 1 : 0 }}
        />
      </div>

      {/* Vignette + bottom fade for caption legibility */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />

      {/* ─── UI BEATS ─── */}

      {/* Name chip (top-left) */}
      <div
        className={`absolute top-5 left-5 ${card} flex items-center gap-2 transition-all duration-500 ${
          activeBeats.has('name-chip') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        <span className="text-xs font-medium text-white">Hi, {userName}</span>
      </div>

      {/* Vault lock pulse (top-right) */}
      <div
        className={`absolute top-5 right-5 ${card} flex items-center gap-2 transition-all duration-500 ${
          activeBeats.has('vault-pulse') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <Lock className={`h-3.5 w-3.5 text-emerald-300 ${activeBeats.has('vault-pulse') ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] uppercase tracking-wider text-white/80">Vault · Read-only</span>
      </div>

      {/* GPS pin drop (mid-left) */}
      <div
        className={`absolute top-1/3 left-5 ${card} flex items-center gap-2 transition-all duration-700 ${
          activeBeats.has('gps-drop') ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        <MapPin className="h-3.5 w-3.5 text-rose-400" />
        <span className="text-xs font-medium text-white">Helsinki, FI</span>
      </div>

      {/* Tax warning card (right column) */}
      <div
        className={`absolute top-[28%] right-5 w-[210px] ${card} transition-all duration-500 ${
          activeBeats.has('tax-card') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-[10px] uppercase tracking-wider text-amber-200/90 font-semibold">Tax · Schengen</span>
        </div>
        <p className="text-xs text-white leading-snug">90-day residence cap — 22 days remaining</p>
      </div>

      {/* Social invite card (right column, below) */}
      <div
        className={`absolute top-[48%] right-5 w-[210px] ${card} transition-all duration-500 ${
          activeBeats.has('social-card') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-3.5 w-3.5 text-sky-300" />
          <span className="text-[10px] uppercase tracking-wider text-sky-200/90 font-semibold">Tonight · 19:00</span>
        </div>
        <p className="text-xs text-white leading-snug">Löyly Sauna Social — 14 nomads going</p>
      </div>

      {/* Outfit purchase chip (bottom-left) */}
      <div
        className={`absolute bottom-32 left-5 ${card} flex items-center gap-2 transition-all duration-500 ${
          activeBeats.has('outfit-chip') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-white">Nordic Coat · <span className="text-amber-300">$15 USDC</span> · x402</span>
      </div>

      {/* Tip button (bottom-right) */}
      <button
        type="button"
        className={`absolute bottom-32 right-5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-semibold shadow-2xl transition-all duration-500 ${
          activeBeats.has('tip-button') && !activeBeats.has('tip-confirm')
            ? 'opacity-100 scale-100 animate-pulse'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        ✨ Tip Aurora · $5
      </button>

      {/* Tip confirm */}
      <div
        className={`absolute bottom-32 right-5 ${card} flex items-center gap-2 transition-all duration-500 ${
          activeBeats.has('tip-confirm') ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        style={{ borderColor: 'rgba(52,211,153,0.5)' }}
      >
        <Check className="h-4 w-4 text-emerald-300" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">$5 tipped via x402</span>
          <span className="text-[10px] text-emerald-300/90">Settled in 0.4s</span>
        </div>
      </div>
    </div>
  );
};

export default AuroraScene;
