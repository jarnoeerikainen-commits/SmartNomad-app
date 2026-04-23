import { useState, useCallback, useRef, useEffect } from 'react';
import {
  buildSpeechWordCues,
  getWordAtCharIndex,
  sanitizeSpeechText,
} from './voice/speechText';
import { streamElevenLabsTTS, type ElevenStreamHandle } from './voice/elevenLabsStream';

const LANG_TO_LOCALE: Record<string, string> = {
  en: 'en-US', es: 'es-ES', pt: 'pt-BR', zh: 'zh-CN', fr: 'fr-FR',
  de: 'de-DE', ar: 'ar-SA', ja: 'ja-JP', it: 'it-IT', ko: 'ko-KR',
  hi: 'hi-IN', ru: 'ru-RU', tr: 'tr-TR',
};

// Allow users (or admin) to disable the premium voice via localStorage.
const ELEVEN_PREF_KEY = 'sn_voice_premium';
const isPremiumVoiceEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const v = localStorage.getItem(ELEVEN_PREF_KEY);
    return v === null ? true : v === 'true';
  } catch {
    return true;
  }
};

interface UseVoiceConversationReturn {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  currentWord: string;
  mouthOpenness: number;
  spokenText: string;
  micPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  startListening: (onResult: (text: string) => void) => Promise<void>;
  stopListening: () => void;
  speak: (text: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
  toggleVoice: () => void;
  sttSupported: boolean;
  ttsSupported: boolean;
  setLanguage: (lang: string) => void;
  setVoiceGender: (gender: 'woman' | 'man') => void;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const getWordShapeLevel = (word: string) => {
  const sample = word.toLowerCase();
  if (!sample) return 0.14;

  const vowels = (sample.match(/[aeiouyäöüáéíóú]/g) || []).length;
  const openVowels = (sample.match(/[aáàäåoóòö]/g) || []).length;
  const plosives = (sample.match(/[bmp]/g) || []).length;
  const fricatives = (sample.match(/[fvszxhj]/g) || []).length;

  return clamp(0.12 + vowels * 0.08 + openVowels * 0.08 + fricatives * 0.03 - plosives * 0.12, 0.08, 0.9);
};

export const useVoiceConversation = (initialLang = 'en'): UseVoiceConversationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');

  const recognitionRef = useRef<any>(null);
  const langRef = useRef(initialLang);
  const voiceGenderRef = useRef<'woman' | 'man'>('woman');
  const speechSessionRef = useRef(0);
  const wordFrameRef = useRef<number>(0);
  const wordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouthFallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elevenStreamRef = useRef<ElevenStreamHandle | null>(null);
  const premiumDisabledRef = useRef<boolean>(!isPremiumVoiceEnabled());

  const sttSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = true;

  // Check mic permission on mount
  useEffect(() => {
    if (!sttSupported) {
      setMicPermission('unsupported');
      return;
    }
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((status) => {
        setMicPermission(status.state as 'granted' | 'denied' | 'prompt');
        status.onchange = () => setMicPermission(status.state as 'granted' | 'denied' | 'prompt');
      }).catch(() => {
        // permissions API not available for mic (e.g. Safari) — keep as 'prompt'
      });
    }
  }, [sttSupported]);


  const stopWordAnimation = useCallback(() => {
    if (wordFrameRef.current) {
      cancelAnimationFrame(wordFrameRef.current);
      wordFrameRef.current = 0;
    }
    if (wordIntervalRef.current) {
      clearInterval(wordIntervalRef.current);
      wordIntervalRef.current = null;
    }
    setCurrentWord('');
  }, []);

  const stopFallbackMouthAnimation = useCallback(() => {
    if (mouthFallbackIntervalRef.current) {
      clearInterval(mouthFallbackIntervalRef.current);
      mouthFallbackIntervalRef.current = null;
    }
  }, []);

  const clearSpeechState = useCallback((onComplete?: () => void) => {
    stopWordAnimation();
    stopFallbackMouthAnimation();
    setIsSpeaking(false);
    setSpokenText('');
    setMouthOpenness(0);
    onComplete?.();
  }, [stopFallbackMouthAnimation, stopWordAnimation]);

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  const setVoiceGender = useCallback((gender: 'woman' | 'man') => {
    voiceGenderRef.current = gender;
  }, []);


  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted — stop the stream immediately (we only needed the permission)
      stream.getTracks().forEach(t => t.stop());
      setMicPermission('granted');
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermission('denied');
      }
      return false;
    }
  }, []);

  const startListening = useCallback(async (onResult: (text: string) => void) => {
    if (!sttSupported) return;

    // Request microphone permission first
    if (micPermission !== 'granted') {
      const allowed = await requestMicPermission();
      if (!allowed) return; // permission denied — caller should show toast
    }

    clearSpeechState();

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
      // Snappier turn-taking: 900ms silence (was 1800ms) for natural dialogue
      silenceTimer = setTimeout(() => {
        const result = finalTranscript.trim() || interim.trim();
        if (result) onResult(result);
        recognition.stop();
      }, 900);
    };

    recognition.onerror = (event: any) => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setMicPermission('denied');
      }
    };

    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('[Voice] Failed to start recognition:', e);
      setIsListening(false);
    }
  }, [clearSpeechState, sttSupported, micPermission, requestMicPermission]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const fallbackBrowserTTS = useCallback((text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) {
      clearSpeechState(onComplete);
      return;
    }

    const sessionId = ++speechSessionRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = LANG_TO_LOCALE[langRef.current] || 'en-US';
    const gender = voiceGenderRef.current;
    const cues = buildSpeechWordCues(text);

    window.speechSynthesis.cancel();

    utterance.lang = locale;
    utterance.rate = gender === 'man' ? 0.9 : 1.0;
    utterance.pitch = gender === 'man' ? 0.5 : 1.08;

    const localePrefix = locale.split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const genderHint = gender === 'man' ? /(male|man|david|george|daniel|liam|alex)/i : /(female|woman|samantha|victoria|karen|zira|sofia)/i;
    const preferredVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(localePrefix) && genderHint.test(voice.name))
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(localePrefix));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (sessionId !== speechSessionRef.current) return;
      setSpokenText(text);
      setIsSpeaking(true);
      stopWordAnimation();
      stopFallbackMouthAnimation();
      mouthFallbackIntervalRef.current = setInterval(() => {
        setMouthOpenness((prev) => {
          const pulse = currentWord ? getWordShapeLevel(currentWord) : 0.2 + Math.random() * 0.35;
          const next = pulse * (0.72 + Math.random() * 0.3);
          return prev > next ? prev * 0.72 : next;
        });
      }, 70);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (sessionId !== speechSessionRef.current || typeof event.charIndex !== 'number') return;
      const word = getWordAtCharIndex(cues, event.charIndex);
      setCurrentWord(word);
      setMouthOpenness(getWordShapeLevel(word));
    };

    utterance.onend = () => {
      if (sessionId !== speechSessionRef.current) return;
      clearSpeechState(onComplete);
    };

    utterance.onerror = () => {
      if (sessionId !== speechSessionRef.current) return;
      clearSpeechState(onComplete);
    };

    setSpokenText(text);
    window.speechSynthesis.speak(utterance);
  }, [clearSpeechState, currentWord, stopFallbackMouthAnimation, stopWordAnimation]);

  const speak = useCallback((text: string, onComplete?: () => void) => {
    if (!voiceEnabled) {
      onComplete?.();
      return;
    }

    const clean = sanitizeSpeechText(text);
    if (!clean) {
      onComplete?.();
      return;
    }

    speechSessionRef.current += 1;
    clearSpeechState();
    setSpokenText(clean);

    // Use browser-native TTS with full avatar animation
    fallbackBrowserTTS(clean, onComplete);
  }, [clearSpeechState, fallbackBrowserTTS, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearSpeechState();
  }, [clearSpeechState]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) {
        speechSessionRef.current += 1;
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        clearSpeechState();
      }
      return !prev;
    });
  }, [clearSpeechState]);

  useEffect(() => () => {
    speechSessionRef.current += 1;
    recognitionRef.current?.stop?.();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearSpeechState();
  }, [clearSpeechState]);

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
    micPermission,
    setLanguage,
    setVoiceGender,
  };
};
