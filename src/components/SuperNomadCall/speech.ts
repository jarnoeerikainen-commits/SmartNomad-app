// Lightweight speech synthesis helpers for SuperNomad Call demo audio.
// Uses the browser's built-in Web Speech API (SpeechSynthesis) so demo
// calls are actually audible without any external API or paid TTS.

let cachedVoices: SpeechSynthesisVoice[] | null = null;
let voicesReady = false;

const ensureVoicesLoaded = (): Promise<SpeechSynthesisVoice[]> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length) {
      cachedVoices = existing;
      voicesReady = true;
      resolve(existing);
      return;
    }
    // Some browsers (Chrome) populate voices asynchronously.
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      voicesReady = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(v);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Hard timeout fallback
    setTimeout(() => {
      if (!voicesReady) {
        const v = window.speechSynthesis.getVoices();
        cachedVoices = v;
        voicesReady = true;
        resolve(v);
      }
    }, 1500);
  });

export const isSpeechAvailable = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

const pickVoice = (role: 'ai' | 'user', personaId?: string): SpeechSynthesisVoice | undefined => {
  const voices = cachedVoices ?? (typeof window !== 'undefined' ? window.speechSynthesis?.getVoices() ?? [] : []);
  if (!voices.length) return undefined;

  // Prefer high-quality English voices
  const englishVoices = voices.filter(v => /en[-_]/i.test(v.lang) || /english/i.test(v.name));
  const pool = englishVoices.length ? englishVoices : voices;

  // AI concierge → female-leaning by default; user persona → varies
  const wantFemale = role === 'ai' || personaId === 'meghan';
  const female = pool.find(v =>
    /female|samantha|victoria|karen|moira|tessa|google uk english female|google us english/i.test(v.name)
  );
  const male = pool.find(v =>
    /male|daniel|alex|fred|google uk english male|aaron|tom/i.test(v.name)
  );

  if (wantFemale && female) return female;
  if (!wantFemale && male) return male;
  return pool[0];
};

/** Speak a single line. Resolves when the utterance ends or errors. */
export const speakLine = (
  text: string,
  role: 'ai' | 'user',
  personaId?: string,
  opts: { muted?: boolean } = {}
): Promise<void> =>
  new Promise(async (resolve) => {
    if (!isSpeechAvailable() || opts.muted) { resolve(); return; }
    try {
      await ensureVoicesLoaded();
      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(role, personaId);
      if (voice) utter.voice = voice;
      utter.lang = voice?.lang || 'en-US';
      utter.rate = role === 'ai' ? 1.0 : 0.95;
      utter.pitch = role === 'ai' ? 1.05 : 0.95;
      utter.volume = 1.0;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    } catch {
      resolve();
    }
  });

/** Cancel any in-flight or queued speech immediately. */
export const cancelSpeech = () => {
  if (!isSpeechAvailable()) return;
  try { window.speechSynthesis.cancel(); } catch { /* noop */ }
};

/**
 * Prime the speech engine within a user-gesture handler so subsequent
 * async-triggered utterances are allowed to play (mobile Safari + iOS).
 * Plays a near-silent, ultra-short utterance.
 */
export const primeSpeech = () => {
  if (!isSpeechAvailable()) return;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0.01;
    u.rate = 2;
    window.speechSynthesis.speak(u);
  } catch { /* noop */ }
};
