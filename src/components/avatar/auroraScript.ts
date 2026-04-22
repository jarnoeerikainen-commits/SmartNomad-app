// ═══════════════════════════════════════════════════════════
// Aurora Intro — Live HeyGen lip-synced monologue
// Each line is spoken by HeyGen (perfect lip-sync guaranteed).
// UI beats fire as each line begins.
// ═══════════════════════════════════════════════════════════

export type AuroraBeat =
  | 'idle'
  | 'name-chip'
  | 'vault-pulse'
  | 'gps-drop'
  | 'tax-card'
  | 'social-card'
  | 'outfit-chip'
  | 'tip-button'
  | 'tip-confirm'
  | 'farewell';

export interface AuroraLine {
  /** Text Aurora speaks. {name} is replaced with the user's name. */
  text: string;
  /** UI beat to activate when this line starts */
  beat?: AuroraBeat;
  /** Optional caption override (defaults to text) */
  caption?: string;
}

export const auroraLines: AuroraLine[] = [
  { text: "Hi {name}. I'm Aurora — your sovereign companion.", beat: 'name-chip' },
  { text: "I live inside your private vault. Read-only. Edge-rendered. Yours alone.", beat: 'vault-pulse' },
  { text: "I see you just landed in Helsinki.", beat: 'gps-drop' },
  { text: "I've prepared your 90-day Schengen residence warning. Twenty-two days remaining.", beat: 'tax-card' },
  { text: "I also found a sauna social tonight at seven. Fourteen nomads going.", beat: 'social-card' },
  { text: "It's cold here. I've picked out a Nordic coat from your wardrobe.", beat: 'outfit-chip' },
  { text: "If I helped, you can tip me five dollars.", beat: 'tip-button' },
  { text: "Paid via x402, settled in under half a second.", beat: 'tip-confirm' },
  { text: "Whenever you need me, I'm here.", beat: 'farewell' },
];
