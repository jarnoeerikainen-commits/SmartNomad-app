import React from 'react';

/** Pure-CSS animated waveform — no audio, no mic permission needed. */
export const CallWaveform: React.FC<{ active: boolean; bars?: number }> = ({ active, bars = 24 }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${active ? 'bg-primary' : 'bg-muted'}`}
          style={{
            animation: active ? `snc-wave 1.1s ease-in-out ${i * 0.06}s infinite` : 'none',
            height: active ? `${20 + ((i * 13) % 40)}%` : '20%',
            transformOrigin: 'center',
          }}
        />
      ))}
      <style>{`
        @keyframes snc-wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
};
