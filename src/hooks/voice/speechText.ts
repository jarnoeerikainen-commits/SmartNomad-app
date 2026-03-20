const WORD_MATCHER = /\S+/g;

export const sanitizeSpeechText = (text: string) => text
  .replace(/```(?:json|booking)[\s\S]*?```/g, '')
  .replace(/\[?\{[^{}]*"url"[^{}]*\}[\s,\]]*/g, '')
  .replace(/https?:\/\/[^\s)]+/g, '')
  .replace(/www\.[^\s)]+/g, '')
  .replace(/[a-zA-Z0-9-]+\.(com|org|net|io|co|app|dev|travel)[^\s)]*\b/g, '')
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/[*_~`#]/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/^.*(?:Search on|Open in|Book (?:on|via|at)).*$/gm, '')
  .replace(/[🔗🌐💻📱]/g, '')
  .replace(/\n{2,}/g, '. ')
  .replace(/\n/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .trim();

export interface SpeechWordCue {
  word: string;
  charStart: number;
  charEnd: number;
  weight: number;
}

const getWordWeight = (word: string) => {
  const cleanWord = word.toLowerCase();
  const lengthWeight = Math.min(cleanWord.length, 12) * 0.08;
  const vowelWeight = (cleanWord.match(/[aeiouyäöüáéíóú]/g) || []).length * 0.1;
  const punctuationWeight = /[,.!?;:]/.test(cleanWord) ? 0.16 : 0;
  return 1 + lengthWeight + vowelWeight + punctuationWeight;
};

export const buildSpeechWordCues = (text: string): SpeechWordCue[] => {
  const matches = [...text.matchAll(WORD_MATCHER)];
  return matches.map((match) => {
    const word = match[0];
    const charStart = match.index ?? 0;
    const charEnd = charStart + word.length;

    return {
      word,
      charStart,
      charEnd,
      weight: getWordWeight(word),
    };
  });
};

export const getWordAtCharIndex = (cues: SpeechWordCue[], charIndex: number) => {
  if (!cues.length) return '';
  const match = cues.find((cue) => charIndex >= cue.charStart && charIndex < cue.charEnd);
  return match?.word || cues[cues.length - 1].word;
};

export const estimateSpeechDurationMs = (text: string) => {
  const cues = buildSpeechWordCues(text);
  const totalWeight = cues.reduce((sum, cue) => sum + cue.weight, 0);
  return Math.max(1500, totalWeight * 240);
};
