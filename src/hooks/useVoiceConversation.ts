import { useState, useCallback, useRef } from 'react';

// Map app language codes to BCP-47 locale codes for STT/TTS
const LANG_TO_LOCALE: Record<string, string> = {
  en: 'en-US', es: 'es-ES', pt: 'pt-BR', zh: 'zh-CN', fr: 'fr-FR',
  de: 'de-DE', ar: 'ar-SA', ja: 'ja-JP', it: 'it-IT', ko: 'ko-KR',
  hi: 'hi-IN', ru: 'ru-RU', tr: 'tr-TR',
};

// Phoneme-to-mouth-openness mapping for natural lip sync
// Maps characters to mouth openness values (0 = closed, 1 = wide open)
const VISEME_MAP: Record<string, number> = {
  // Wide open vowels
  a: 0.9, á: 0.9, à: 0.9, ä: 0.85,
  o: 0.8, ó: 0.8, ò: 0.8, ö: 0.75,
  // Medium open
  e: 0.6, é: 0.6, è: 0.6, ë: 0.6,
  i: 0.4, í: 0.4, ì: 0.4, ï: 0.4,
  u: 0.5, ú: 0.5, ù: 0.5, ü: 0.5,
  y: 0.35,
  // Consonants with lip movement
  m: 0.05, b: 0.1, p: 0.1,
  f: 0.2, v: 0.2,
  w: 0.45,
  // Consonants with some opening
  s: 0.15, z: 0.15, c: 0.15,
  t: 0.2, d: 0.2, n: 0.2,
  l: 0.3, r: 0.25,
  k: 0.2, g: 0.2, q: 0.2,
  j: 0.35, h: 0.3,
  x: 0.15,
  // Closed
  ' ': 0.0, '.': 0.0, ',': 0.0, '!': 0.0, '?': 0.0,
};

function getVisemeValue(char: string): number {
  return VISEME_MAP[char.toLowerCase()] ?? 0.15;
}

interface UseVoiceConversationReturn {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  currentWord: string;
  mouthOpenness: number;
  spokenText: string;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
  toggleVoice: () => void;
  sttSupported: boolean;
  ttsSupported: boolean;
  setLanguage: (lang: string) => void;
  setVoiceGender: (gender: 'woman' | 'man') => void;
}

export const useVoiceConversation = (initialLang = 'en'): UseVoiceConversationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const langRef = useRef(initialLang);
  const voiceGenderRef = useRef<'woman' | 'man'>('woman');
  const visemeAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const charIndexRef = useRef(0);
  const cleanTextRef = useRef('');

  const sttSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  const setVoiceGender = useCallback((gender: 'woman' | 'man') => {
    voiceGenderRef.current = gender;
  }, []);

  // Animate mouth through characters at approximate speech rate
  const startVisemeAnimation = useCallback((text: string, rate: number) => {
    cleanTextRef.current = text;
    charIndexRef.current = 0;

    // ~13 chars/second at rate 1.0 is average English speech
    const msPerChar = (1000 / 13) / rate;

    if (visemeAnimRef.current) clearInterval(visemeAnimRef.current);
    visemeAnimRef.current = setInterval(() => {
      const idx = charIndexRef.current;
      if (idx >= cleanTextRef.current.length) {
        // Loop back slowly — speech may still be going
        charIndexRef.current = 0;
        return;
      }
      const char = cleanTextRef.current[idx];
      const nextChar = cleanTextRef.current[idx + 1] || '';
      
      // Blend current and next character for smoother transitions
      const current = getVisemeValue(char);
      const next = getVisemeValue(nextChar);
      const blended = current * 0.7 + next * 0.3;
      
      setMouthOpenness(blended);

      // Extract current word for display
      const before = cleanTextRef.current.slice(0, idx + 1);
      const wordMatch = before.match(/\S+$/);
      if (wordMatch) setCurrentWord(wordMatch[0]);

      charIndexRef.current++;
    }, msPerChar);
  }, []);

  const stopVisemeAnimation = useCallback(() => {
    if (visemeAnimRef.current) {
      clearInterval(visemeAnimRef.current);
      visemeAnimRef.current = null;
    }
    setMouthOpenness(0);
    setCurrentWord('');
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!sttSupported) return;

    if (ttsSupported) window.speechSynthesis.cancel();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = LANG_TO_LOCALE[langRef.current] || 'en-US';

    let finalTranscript = '';
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        const result = finalTranscript.trim() || interim.trim();
        if (result) onResult(result);
        recognition.stop();
      }, 2000);
    };

    recognition.onerror = () => { if (silenceTimer) clearTimeout(silenceTimer); setIsListening(false); };
    recognition.onend = () => { if (silenceTimer) clearTimeout(silenceTimer); setIsListening(false); };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [sttSupported, ttsSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string, onComplete?: () => void) => {
    if (!ttsSupported || !voiceEnabled) {
      onComplete?.();
      return;
    }

    window.speechSynthesis.cancel();
    stopVisemeAnimation();

    // Smart filtering: strip booking blocks, URLs, domains, markdown for natural speech
    const clean = text
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

    if (!clean) { onComplete?.(); return; }

    setSpokenText(clean);

    const utterance = new SpeechSynthesisUtterance(clean);

    const locale = LANG_TO_LOCALE[langRef.current] || 'en-US';
    const langPrefix = locale.split('-')[0];
    const gender = voiceGenderRef.current;

    // Wait for voices to load if empty (Chrome loads async)
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>(resolve => {
        const onVoices = () => { resolve(); window.speechSynthesis.removeEventListener('voiceschanged', onVoices); };
        window.speechSynthesis.addEventListener('voiceschanged', onVoices);
        setTimeout(resolve, 500);
      });
      voices = window.speechSynthesis.getVoices();
    }

    // Gender-aware voice matching
    const femaleNames = ['Samantha', 'Karen', 'Moira', 'Victoria', 'Zira', 'Tessa', 'Fiona', 'Allison', 'Ava', 'Susan', 'Catherine', 'Paulina', 'Monica', 'Luciana', 'Amelie', 'Anna', 'Milena', 'Yuna', 'Kyoko', 'Lekha', 'Meijia', 'Tingting', 'Joana', 'Nora', 'Sara', 'Ellen', 'Helena', 'Martha'];
    const maleNames = ['David', 'James', 'Daniel', 'Mark', 'Fred', 'Alex', 'Tom', 'Oliver', 'Aaron', 'Gordon', 'Jorge', 'Thomas', 'Jacques', 'Luca', 'Yuri', 'Ichiro', 'Rishi', 'Albert', 'Arthur', 'Bruce', 'Charles', 'Ralph', 'Richard', 'Robert', 'Henry', 'Martin'];
    const femaleKeywords = ['Female', 'Woman', 'female', 'woman'];
    const maleKeywords = ['Male', 'Man', 'male', 'man'];

    const nameHints = gender === 'man' ? maleNames : femaleNames;
    const keywordHints = gender === 'man' ? maleKeywords : femaleKeywords;
    const antiNames = gender === 'man' ? femaleNames : maleNames;
    const antiKeywords = gender === 'man' ? femaleKeywords : maleKeywords;

    const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));

    let preferred: SpeechSynthesisVoice | undefined;
    preferred = langVoices.find(v => nameHints.some(n => v.name.includes(n)));
    if (!preferred) {
      preferred = langVoices.find(v => keywordHints.some(k => v.name.includes(k)));
    }
    if (!preferred && langVoices.length > 1) {
      const filtered = langVoices.filter(v =>
        !antiKeywords.some(k => v.name.includes(k)) &&
        !antiNames.some(n => v.name.includes(n))
      );
      preferred = filtered[0] || langVoices[0];
    }
    if (!preferred) preferred = langVoices[0];
    if (!preferred) {
      preferred = voices.find(v => nameHints.some(n => v.name.includes(n))) ||
                  voices.find(v => keywordHints.some(k => v.name.includes(k))) ||
                  voices[0];
    }

    if (preferred) {
      utterance.voice = preferred;
      utterance.lang = preferred.lang;
    } else {
      utterance.lang = locale;
    }

    // Pitch/rate differentiation
    utterance.rate = gender === 'man' ? 0.92 : 1.0;
    utterance.pitch = gender === 'man' ? 0.65 : 1.15;

    const speechRate = utterance.rate;

    console.log(`[Voice] Gender: ${gender}, Selected: "${preferred?.name || 'default'}" (${preferred?.lang || locale}), Pitch: ${utterance.pitch}`);

    utterance.onstart = () => {
      setIsSpeaking(true);
      startVisemeAnimation(clean, speechRate);
    };

    // Use boundary events for more accurate word tracking when available
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        charIndexRef.current = event.charIndex;
        const word = clean.slice(event.charIndex).match(/^\S+/)?.[0] || '';
        setCurrentWord(word);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      stopVisemeAnimation();
      setSpokenText('');
      onComplete?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      stopVisemeAnimation();
      setSpokenText('');
      onComplete?.();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsSupported, voiceEnabled, startVisemeAnimation, stopVisemeAnimation]);

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    stopVisemeAnimation();
    setIsSpeaking(false);
    setSpokenText('');
  }, [ttsSupported, stopVisemeAnimation]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev && ttsSupported) {
        window.speechSynthesis.cancel();
        stopVisemeAnimation();
      }
      return !prev;
    });
  }, [ttsSupported, stopVisemeAnimation]);

  return {
    isListening,
    isSpeaking,
    voiceEnabled,
    currentWord,
    mouthOpenness,
    spokenText,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleVoice,
    sttSupported,
    ttsSupported,
    setLanguage,
    setVoiceGender,
  };
};
