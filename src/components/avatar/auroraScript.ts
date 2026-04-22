// ═══════════════════════════════════════════════════════════
// Aurora Intro — Fixed script for first-launch demo
// Times are in milliseconds, matched to baked voiceover (~34.9s)
// V2: replace with generateAuroraScript(vaultContext) async fn
// ═══════════════════════════════════════════════════════════

export type AuroraBeat =
  | 'idle'
  | 'name-chip'
  | 'vault-pulse'
  | 'gps-drop'
  | 'tax-card'
  | 'social-card'
  | 'outfit-chip'
  | 'outfit-swap'
  | 'tip-button'
  | 'tip-confirm'
  | 'farewell';

export interface AuroraCue {
  atMs: number;
  caption: string;
  beat?: AuroraBeat;
}

export const AURORA_TOTAL_MS = 36_500; // ~35s VO + 1.5s outro

export const auroraCues: AuroraCue[] = [
  { atMs: 0,      caption: '',                                                              beat: 'idle' },
  { atMs: 600,    caption: "Hi {name}.",                                                    beat: 'name-chip' },
  { atMs: 1800,   caption: "I'm Aurora — your sovereign companion." },
  { atMs: 4500,   caption: "I live inside your private vault.",                             beat: 'vault-pulse' },
  { atMs: 6300,   caption: "Read-only. Edge-rendered. Yours alone." },
  { atMs: 9800,   caption: "You just landed in Helsinki.",                                  beat: 'gps-drop' },
  { atMs: 12200,  caption: "I've prepared your 90-day residence warning…",                  beat: 'tax-card' },
  { atMs: 16400,  caption: "…and found a sauna social tonight at 7.",                       beat: 'social-card' },
  { atMs: 20300,  caption: "It's cold here. Let me change.",                                beat: 'outfit-chip' },
  { atMs: 22500,  caption: '',                                                              beat: 'outfit-swap' },
  { atMs: 25800,  caption: "Tip me $5 if I helped.",                                        beat: 'tip-button' },
  { atMs: 28800,  caption: "Paid via x402 — settled in 0.4 seconds.",                       beat: 'tip-confirm' },
  { atMs: 32500,  caption: "Whenever you need me, I'm here.",                               beat: 'farewell' },
  { atMs: 35500,  caption: '' },
];
